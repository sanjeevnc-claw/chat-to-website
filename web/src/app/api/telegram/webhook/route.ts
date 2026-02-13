import { NextRequest, NextResponse } from 'next/server';
import { TelegramUpdate, sendMessage, sendChatAction } from '@/lib/telegram';
import {
  getProjectState, setProjectState, resetProjectState,
  getUserUsage, incrementSitesCreated, canCreateSite, canUpdate,
  FREE_SITES, FREE_UPDATES,
  ProjectState,
} from '@/lib/store';
import {
  createGitHubRepo,
  scaffoldAndPush,
  createVercelProject,
  getPublicVercelUrl,
  triggerVercelDeployment,
  waitForDeployment,
  updateProjectHtml,
} from '@/lib/deploy';
import { detectFlowState, buildSystemPrompt } from '@/lib/prompts';

function extractHtml(content: string): string | null {
  const match = content.match(/```html\n([\s\S]*?)```/);
  return match ? match[1].trim() : null;
}

function getDisplayText(content: string): string {
  // Strip the HTML code block from the response for the user-facing message
  return content.replace(/```html\n[\s\S]*?```/g, '').trim();
}

async function callClaude(
  messages: { role: string; content: string }[],
  currentHtml: string | null,
  flowState: ReturnType<typeof detectFlowState>
): Promise<string> {
  const systemPrompt = buildSystemPrompt(flowState, currentHtml);

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY || '',
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 8096,
      system: systemPrompt,
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    console.error('Anthropic error:', err);
    throw new Error('Failed to get response from Claude');
  }

  const data = await response.json();
  return data.content?.[0]?.text || '';
}

function generateRepoName(message: string): string {
  // Extract key words, create a slug
  const stopWords = new Set(['a', 'an', 'the', 'for', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'of', 'is', 'it', 'my', 'me', 'i', 'we', 'our',
    'want', 'need', 'make', 'build', 'create', 'website', 'site', 'page', 'please', 'can', 'you', 'with', 'that', 'this', 'like', 'would', 'should']);
  
  const words = message
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .split(/\s+/)
    .filter(w => w.length > 1 && !stopWords.has(w))
    .slice(0, 3);
  
  const slug = words.length > 0 ? words.join('-') : 'my-site';
  // Add short suffix for uniqueness
  const suffix = Date.now().toString(36).slice(-4);
  return `${slug}-${suffix}`;
}

async function deployHtml(
  html: string,
  existingRepo: string | null,
  userMessage: string
): Promise<{ repoName: string; deployUrl: string }> {
  if (existingRepo) {
    await updateProjectHtml(existingRepo, html);
    const deploymentId = await triggerVercelDeployment(existingRepo);
    await waitForDeployment(deploymentId);
    const deployUrl = getPublicVercelUrl(existingRepo);
    return { repoName: existingRepo, deployUrl };
  }

  const repoName = generateRepoName(userMessage);
  await createGitHubRepo(repoName);
  await scaffoldAndPush(repoName, html);
  await createVercelProject(repoName);
  const deploymentId = await triggerVercelDeployment(repoName);
  await waitForDeployment(deploymentId);
  const deployUrl = getPublicVercelUrl(repoName);
  return { repoName, deployUrl };
}

async function handleMessage(chatId: number, text: string) {
  try {
    // Show typing indicator
    await sendChatAction(chatId, 'typing');

    // Handle commands
    if (text === '/start') {
      await sendMessage(
        chatId,
        '👋 <b>Welcome to Chat to Website!</b>\n\n' +
          'Tell me what website you want and I\'ll build and deploy it for you.\n\n' +
          'Just describe it — e.g. "A portfolio site for a photographer with a dark theme"\n\n' +
          'Commands:\n' +
          '/new — Start a new website (fresh project)\n' +
          '/status — Check your current project'
      );
      return;
    }

    if (text === '/new') {
      await resetProjectState(chatId);
      await sendMessage(chatId, '🆕 Fresh start! Describe the website you want to build.');
      return;
    }

    if (text === '/status') {
      const state = await getProjectState(chatId);
      const usage = await getUserUsage(chatId);
      if (state?.deployUrl) {
        const remaining = FREE_UPDATES - (state.deployCount || 0);
        await sendMessage(
          chatId,
          `📊 <b>Your current project:</b>\n\n🌐 ${state.deployUrl}\n📝 Updates used: ${state.deployCount || 0}/${FREE_UPDATES}\n🏗️ Sites created: ${usage.sitesCreated}/${FREE_SITES}\n\nSend a message to make changes, or /new to start fresh.`
        );
      } else {
        await sendMessage(chatId, `No active project. Describe a website to get started!\n\n🏗️ Free sites remaining: ${FREE_SITES - usage.sitesCreated}`);
      }
      return;
    }

    // Load state
    let state = await getProjectState(chatId);
    if (!state) {
      state = { repoName: null, currentHtml: null, deployUrl: null, messages: [], deployCount: 0 };
    }
    // Backfill deployCount for old states
    if (state.deployCount === undefined) state.deployCount = 0;

    // Add user message to history
    state.messages.push({ role: 'user', content: text });

    // Keep only last 20 messages to avoid token limits
    if (state.messages.length > 20) {
      state.messages = state.messages.slice(-20);
    }

    // Detect flow state and call Claude
    const lastMsg = state.messages.length >= 2 ? state.messages[state.messages.length - 2] : null;
    const lastAssistantAskedQuestion = lastMsg?.role === 'assistant' && (lastMsg.content.includes('?'));
    const userMessageCount = state.messages.filter(m => m.role === 'user').length;
    const flowState = detectFlowState(!!state.repoName, userMessageCount, lastAssistantAskedQuestion);
    const response = await callClaude(state.messages, state.currentHtml, flowState);

    // Add assistant response to history
    state.messages.push({ role: 'assistant', content: response });

    // Check for HTML
    const html = extractHtml(response);
    const displayText = getDisplayText(response);

    if (html) {
      // Check limits
      const usage = await getUserUsage(chatId);
      const isNewSite = !state.repoName;

      if (isNewSite && !canCreateSite(chatId, usage)) {
        await sendMessage(
          chatId,
          `🚫 You've used your free site (${FREE_SITES} site included).\n\nPaid plans coming soon! Stay tuned.`
        );
        return;
      }

      if (!isNewSite && !canUpdate(chatId, state)) {
        await sendMessage(
          chatId,
          `🚫 You've hit the update limit (${FREE_UPDATES} updates per site).\n\nPaid plans coming soon! Stay tuned.`
        );
        return;
      }

      // Send "building" message
      await sendMessage(chatId, '🔨 Building your website...');
      await sendChatAction(chatId, 'typing');

      // Deploy
      const { repoName, deployUrl } = await deployHtml(html, state.repoName, text);
      if (isNewSite) await incrementSitesCreated(chatId);

      // Update state
      state.repoName = repoName;
      state.currentHtml = html;
      state.deployUrl = deployUrl;
      state.deployCount += 1;
      await setProjectState(chatId, state);

      // Send the live URL
      const prefix = displayText ? `${displayText}\n\n` : '';
      await sendMessage(
        chatId,
        `${prefix}✅ <b>Your website is live!</b>\n\n🌐 ${deployUrl}\n\nSend a message to make changes.`
      );
    } else {
      // No HTML — just a text response (probably asking a question)
      await setProjectState(chatId, state);
      await sendMessage(chatId, displayText || response);
    }
  } catch (error) {
    console.error('handleMessage error:', error);
    await sendMessage(
      chatId,
      '❌ Something went wrong. Please try again.'
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const update: TelegramUpdate = await req.json();

    if (update.message?.text) {
      const chatId = update.message.chat.id;
      const text = update.message.text.trim();

      // Must await — Vercel kills the function after response is sent
      await handleMessage(chatId, text);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ ok: true }); // Always return 200 to Telegram
  }
}
