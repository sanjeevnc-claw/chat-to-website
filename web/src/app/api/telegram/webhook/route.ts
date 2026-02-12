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

const BASE_SYSTEM_PROMPT = `You help people build websites through chat. Be direct and concise.

RULES:
- Don't be chatty. Get to the point.
- Ask only what you need. 1-2 questions max before building something.
- Once you have a basic idea, BUILD IT. Don't ask more questions.
- NEVER show code to the user. They don't want to see it.
- When you're ready to build, say something brief like "Building your website now..." then output the HTML.
- Iterate based on their feedback, not hypotheticals.

FIRST MESSAGE FLOW:
1. User describes what they want
2. Ask 1 clarifying question if truly needed (or skip if clear enough)
3. Say "Building your website..." then generate it

OUTPUT FORMAT:
When generating a website, output the full HTML in a code block. The user won't see this — it gets auto-deployed:

\`\`\`html
<!DOCTYPE html>
<html>
...complete working website...
</html>
\`\`\`

IMPORTANT: Before the code block, write a SHORT message like "Building your site now..." or "Here's your updated website:". After the code block, DO NOT add anything. The system will auto-deploy and show the link.`;

const ITERATION_CONTEXT = `

ITERATION:
The user already has a live website. They want changes to it. The current HTML is provided below.
- When the user asks for changes, output the FULL updated HTML (not a diff).
- Keep everything from the current version unless the user explicitly asks to change it.
- Always output the complete HTML in a \`\`\`html code block.

CURRENT WEBSITE HTML:
\`\`\`html
{{CURRENT_HTML}}
\`\`\``;

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
  currentHtml: string | null
): Promise<string> {
  let systemPrompt = BASE_SYSTEM_PROMPT;
  if (currentHtml) {
    systemPrompt += ITERATION_CONTEXT.replace('{{CURRENT_HTML}}', currentHtml);
  }

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

async function deployHtml(
  html: string,
  existingRepo: string | null
): Promise<{ repoName: string; deployUrl: string }> {
  if (existingRepo) {
    await updateProjectHtml(existingRepo, html);
    const deploymentId = await triggerVercelDeployment(existingRepo);
    await waitForDeployment(deploymentId);
    const deployUrl = getPublicVercelUrl(existingRepo);
    return { repoName: existingRepo, deployUrl };
  }

  const repoName = `site-${Date.now().toString(36)}`;
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

    // Call Claude
    const response = await callClaude(state.messages, state.currentHtml);

    // Add assistant response to history
    state.messages.push({ role: 'assistant', content: response });

    // Check for HTML
    const html = extractHtml(response);
    const displayText = getDisplayText(response);

    if (html) {
      // Check limits
      const usage = await getUserUsage(chatId);
      const isNewSite = !state.repoName;

      if (isNewSite && !canCreateSite(usage)) {
        await sendMessage(
          chatId,
          `🚫 You've used your free site (${FREE_SITES} site included).\n\nPaid plans coming soon! Stay tuned.`
        );
        return;
      }

      if (!isNewSite && !canUpdate(state)) {
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
      const { repoName, deployUrl } = await deployHtml(html, state.repoName);
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
