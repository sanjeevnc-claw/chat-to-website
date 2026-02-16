import { NextRequest, NextResponse } from 'next/server';
import { TelegramUpdate, sendMessage, sendChatAction, sendInvoice, answerPreCheckoutQuery, downloadFile, transcribeVoice } from '@/lib/telegram';
import {
  getProjectState, setProjectState, resetProjectState,
  getUserUsage, incrementSitesCreated, canCreateSite, canUpdate,
  addExtraSite, addExtraUpdates,
  FREE_SITES, FREE_UPDATES, PRICES,
  ProjectState, createInitialState,
  upsertPage, removePage, upsertBlogPost, removeBlogPost,
  PageContent,
} from '@/lib/store';
import {
  createGitHubRepo,
  scaffoldAndPush,
  scaffoldMultiPageSite,
  createVercelProject,
  getPublicVercelUrl,
  triggerVercelDeployment,
  waitForDeployment,
  updateProjectHtml,
  pushImageToRepo,
  updatePage,
  deletePage,
  updateBlogPost,
  deleteBlogPost,
  updateLayout,
} from '@/lib/deploy';
import { detectFlowState, buildSystemPrompt, parseAIResponse, hasStructuredContent, ParsedResponse } from '@/lib/prompts';

async function callClaude(
  messages: { role: string; content: string }[],
  state: ProjectState | null,
  flowState: ReturnType<typeof detectFlowState>,
  images: string[] = []
): Promise<string> {
  const systemPrompt = buildSystemPrompt(flowState, state, images);

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
  const stopWords = new Set(['a', 'an', 'the', 'for', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'of', 'is', 'it', 'my', 'me', 'i', 'we', 'our',
    'want', 'need', 'make', 'build', 'create', 'website', 'site', 'page', 'please', 'can', 'you', 'with', 'that', 'this', 'like', 'would', 'should']);
  
  const words = message
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .split(/\s+/)
    .filter(w => w.length > 1 && !stopWords.has(w))
    .slice(0, 3);
  
  const slug = words.length > 0 ? words.join('-') : 'my-site';
  const suffix = Date.now().toString(36).slice(-4);
  return `site-${slug}-${suffix}`;
}

// Apply parsed response to state and deploy
async function applyChanges(
  chatId: number,
  state: ProjectState,
  parsed: ParsedResponse,
  userMessage: string
): Promise<{ repoName: string; deployUrl: string; isNewSite: boolean }> {
  const isNewSite = !state.repoName;
  
  // Create repo if needed
  if (!state.repoName) {
    const siteName = parsed.siteConfig?.siteName || 'My Website';
    state.repoName = generateRepoName(siteName);
    await createGitHubRepo(state.repoName);
  }
  
  // Apply site config changes
  if (parsed.siteConfig) {
    state.siteConfig = {
      siteName: parsed.siteConfig.siteName || state.siteConfig?.siteName || 'My Website',
      description: parsed.siteConfig.description || state.siteConfig?.description || '',
      primaryColor: parsed.siteConfig.primaryColor || state.siteConfig?.primaryColor || '#2563eb',
      fontFamily: parsed.siteConfig.fontFamily || state.siteConfig?.fontFamily || 'system-ui',
      navStyle: parsed.siteConfig.navStyle || state.siteConfig?.navStyle || 'horizontal',
    };
  }
  
  // Ensure site config exists
  if (!state.siteConfig) {
    state.siteConfig = {
      siteName: 'My Website',
      description: '',
      primaryColor: '#2563eb',
      fontFamily: 'system-ui',
      navStyle: 'horizontal',
    };
  }
  
  // Apply page changes
  for (const page of parsed.pages) {
    upsertPage(state, page);
  }
  
  // Apply page deletions
  for (const slug of parsed.deletedPages) {
    removePage(state, slug);
    if (!isNewSite) {
      await deletePage(state.repoName!, slug);
    }
  }
  
  // Apply blog post changes
  for (const post of parsed.blogPosts) {
    upsertBlogPost(state, post);
  }
  
  // Apply blog post deletions
  for (const slug of parsed.deletedBlogPosts) {
    removeBlogPost(state, slug);
    if (!isNewSite) {
      await deleteBlogPost(state.repoName!, slug, state.blogPosts);
    }
  }
  
  // Handle legacy HTML (convert to home page)
  if (parsed.legacyHtml && state.pages.length === 0) {
    const homePage: PageContent = {
      slug: 'home',
      title: 'Home',
      isHome: true,
      order: 0,
      content: parsed.legacyHtml,
    };
    upsertPage(state, homePage);
    state.currentHtml = parsed.legacyHtml; // Keep for backward compat
  }
  
  // Deploy
  if (isNewSite || state.pages.length === 0) {
    // For truly new sites or legacy sites with no pages
    if (state.pages.length > 0) {
      // New multi-page site
      await scaffoldMultiPageSite(
        state.repoName!,
        state.siteConfig.siteName,
        state.pages,
        state.blogPosts,
        { primaryColor: state.siteConfig.primaryColor, fontFamily: state.siteConfig.fontFamily }
      );
    } else if (parsed.legacyHtml) {
      // Legacy single-page site
      await scaffoldAndPush(state.repoName!, parsed.legacyHtml);
    }
    await createVercelProject(state.repoName!);
  } else {
    // Update existing site
    // Update pages
    for (const page of parsed.pages) {
      await updatePage(state.repoName!, page);
    }
    
    // Update blog posts
    for (const post of parsed.blogPosts) {
      await updateBlogPost(state.repoName!, post, state.blogPosts);
    }
    
    // Update layout if config changed
    if (parsed.siteConfig || parsed.pages.length > 0 || parsed.deletedPages.length > 0) {
      await updateLayout(
        state.repoName!,
        state.siteConfig.siteName,
        state.pages,
        state.hasBlog || state.blogPosts.length > 0,
        { primaryColor: state.siteConfig.primaryColor, fontFamily: state.siteConfig.fontFamily }
      );
    }
  }
  
  // Trigger deployment
  const deploymentId = await triggerVercelDeployment(state.repoName!);
  await waitForDeployment(deploymentId);
  
  const deployUrl = getPublicVercelUrl(state.repoName!);
  state.deployUrl = deployUrl;
  state.deployCount += 1;
  
  return { repoName: state.repoName!, deployUrl, isNewSite };
}

async function handleMessage(chatId: number, text: string) {
  try {
    await sendChatAction(chatId, 'typing');

    // Handle commands
    if (text === '/start') {
      await sendMessage(
        chatId,
        '👋 <b>Welcome to Chat to Website!</b>\n\n' +
          'Tell me what website you want and I\'ll build and deploy it for you.\n\n' +
          '<b>What I can do:</b>\n' +
          '📄 Build multi-page websites\n' +
          '✍️ Create and manage blog posts\n' +
          '🎨 Customize colors, fonts, and layout\n' +
          '📱 Mobile-responsive design\n\n' +
          'Just describe it — e.g. "A portfolio site for a photographer with a dark theme and a blog"\n\n' +
          'Commands:\n' +
          '/new — Start a new website\n' +
          '/pages — List current pages\n' +
          '/blog — List blog posts\n' +
          '/status — Check your project status'
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
        const pageCount = state.pages?.length || 0;
        const blogCount = state.blogPosts?.length || 0;
        await sendMessage(
          chatId,
          `📊 <b>Your current project:</b>\n\n` +
          `🌐 ${state.deployUrl}\n` +
          `📄 Pages: ${pageCount}\n` +
          `✍️ Blog posts: ${blogCount}\n` +
          `📝 Updates used: ${state.deployCount || 0}/${FREE_UPDATES}\n` +
          `🏗️ Sites created: ${usage.sitesCreated}/${FREE_SITES}\n\n` +
          `Send a message to make changes, or /new to start fresh.`
        );
      } else {
        await sendMessage(chatId, `No active project. Describe a website to get started!\n\n🏗️ Free sites remaining: ${FREE_SITES - usage.sitesCreated}`);
      }
      return;
    }

    if (text === '/pages') {
      const state = await getProjectState(chatId);
      if (state?.pages && state.pages.length > 0) {
        const pageList = state.pages
          .sort((a, b) => a.order - b.order)
          .map(p => `• ${p.title} (/${p.slug})${p.isHome ? ' — Homepage' : ''}`)
          .join('\n');
        await sendMessage(chatId, `📄 <b>Your pages:</b>\n\n${pageList}\n\nSay "add a [page name] page" to create more, or "edit [page name]" to modify.`);
      } else {
        await sendMessage(chatId, 'No pages yet. Start by describing your website!');
      }
      return;
    }

    if (text === '/blog') {
      const state = await getProjectState(chatId);
      if (state?.blogPosts && state.blogPosts.length > 0) {
        const postList = state.blogPosts
          .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
          .map(p => `• ${p.title}\n  /blog/${p.slug}`)
          .join('\n\n');
        await sendMessage(chatId, `✍️ <b>Your blog posts:</b>\n\n${postList}\n\nSay "write a blog post about X" to create more.`);
      } else {
        await sendMessage(chatId, 'No blog posts yet. Say "create a blog post about [topic]" to start your blog!');
      }
      return;
    }

    // Load state
    let state = await getProjectState(chatId);
    if (!state) {
      state = createInitialState();
    }
    // Backfill for old states
    if (!state.images) state.images = [];
    if (!state.pages) state.pages = [];
    if (!state.blogPosts) state.blogPosts = [];
    if (state.deployCount === undefined) state.deployCount = 0;
    if (state.hasBlog === undefined) state.hasBlog = false;

    // Add user message to history
    state.messages.push({ role: 'user', content: text });

    // Keep only last 20 messages
    if (state.messages.length > 20) {
      state.messages = state.messages.slice(-20);
    }

    // Detect flow state and call Claude
    const lastMsg = state.messages.length >= 2 ? state.messages[state.messages.length - 2] : null;
    const lastAssistantAskedQuestion = lastMsg?.role === 'assistant' && (lastMsg.content.includes('?'));
    const userMessageCount = state.messages.filter(m => m.role === 'user').length;
    const hasProject = !!(state.repoName || state.pages.length > 0);
    const flowState = detectFlowState(hasProject, userMessageCount, lastAssistantAskedQuestion);
    
    const response = await callClaude(state.messages, state, flowState, state.images);

    // Add assistant response to history
    state.messages.push({ role: 'assistant', content: response });

    // Parse the response
    const parsed = parseAIResponse(response);

    if (hasStructuredContent(parsed)) {
      // Check limits
      const usage = await getUserUsage(chatId);
      const isNewSite = !state.repoName;

      if (isNewSite && !canCreateSite(chatId, usage)) {
        await sendMessage(chatId, `🚫 You've used your free site. Unlock another one for ⭐${PRICES.EXTRA_SITE}:`);
        await sendInvoice(
          chatId,
          'Extra Website',
          'Create one more website with 20 updates included.',
          'extra_site',
          [{ label: '1 Extra Website', amount: PRICES.EXTRA_SITE }]
        );
        return;
      }

      if (!isNewSite && !canUpdate(chatId, state, usage)) {
        await sendMessage(chatId, `🚫 You've hit the update limit. Get 20 more updates for ⭐${PRICES.EXTRA_UPDATES}:`);
        await sendInvoice(
          chatId,
          'Extra Updates',
          '20 more updates for your current website.',
          'extra_updates',
          [{ label: '20 Extra Updates', amount: PRICES.EXTRA_UPDATES }]
        );
        return;
      }

      // Build status message
      let statusMsg = '🔨 Building';
      if (parsed.pages.length > 0) {
        statusMsg += ` ${parsed.pages.length} page${parsed.pages.length > 1 ? 's' : ''}`;
      }
      if (parsed.blogPosts.length > 0) {
        statusMsg += parsed.pages.length > 0 ? ' and ' : ' ';
        statusMsg += `${parsed.blogPosts.length} blog post${parsed.blogPosts.length > 1 ? 's' : ''}`;
      }
      if (parsed.deletedPages.length > 0) {
        statusMsg = '🗑️ Removing page and updating site...';
      }
      if (parsed.deletedBlogPosts.length > 0) {
        statusMsg = '🗑️ Removing blog post and updating site...';
      }
      statusMsg += '...';
      
      await sendMessage(chatId, statusMsg);
      await sendChatAction(chatId, 'typing');

      // Apply changes and deploy
      const { deployUrl, isNewSite: wasNewSite } = await applyChanges(chatId, state, parsed, text);
      if (wasNewSite) await incrementSitesCreated(chatId);

      // Save state
      await setProjectState(chatId, state);

      // Build success message
      let successMsg = parsed.displayText ? `${parsed.displayText}\n\n` : '';
      successMsg += `✅ <b>Your website is live!</b>\n\n🌐 ${deployUrl}`;
      
      if (parsed.blogPosts.length > 0) {
        successMsg += `\n📝 Blog: ${deployUrl}/blog`;
      }
      
      successMsg += '\n\nSend a message to make changes.';
      
      await sendMessage(chatId, successMsg);
    } else {
      // No structured content — just a text response
      await setProjectState(chatId, state);
      await sendMessage(chatId, parsed.displayText || response);
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

    // Handle pre-checkout queries
    if (update.pre_checkout_query) {
      const query = update.pre_checkout_query;
      await answerPreCheckoutQuery(query.id, true);
      return NextResponse.json({ ok: true });
    }

    // Handle successful payments
    if (update.message?.successful_payment) {
      const chatId = update.message.chat.id;
      const payment = update.message.successful_payment;
      const paymentId = payment.telegram_payment_charge_id;

      if (payment.invoice_payload === 'extra_site') {
        await addExtraSite(chatId, paymentId);
        await sendMessage(chatId, '✅ Extra website unlocked! Describe what you want to build.');
      } else if (payment.invoice_payload === 'extra_updates') {
        await addExtraUpdates(chatId, paymentId);
        await sendMessage(chatId, '✅ 20 extra updates added! Send your changes.');
      }

      return NextResponse.json({ ok: true });
    }

    // Handle photo messages
    if (update.message?.photo) {
      const chatId = update.message.chat.id;
      const caption = update.message.caption?.trim() || '';
      const photo = update.message.photo;
      const largestPhoto = photo[photo.length - 1];

      await sendChatAction(chatId, 'typing');

      let state = await getProjectState(chatId);
      if (!state) {
        state = createInitialState();
      }
      if (!state.images) state.images = [];

      // Need a repo to push images to
      if (!state.repoName) {
        const repoName = generateRepoName(caption || 'my-site');
        await createGitHubRepo(repoName);
        state.repoName = repoName;
      }

      // Download and push image
      const { buffer, extension } = await downloadFile(largestPhoto.file_id);
      const filename = `image-${Date.now().toString(36)}.${extension}`;
      const imagePath = await pushImageToRepo(state.repoName, filename, buffer);
      state.images.push(imagePath);
      await setProjectState(chatId, state);

      const imageCount = state.images.length;
      await sendMessage(chatId, `📸 Image uploaded! (${imageCount} image${imageCount > 1 ? 's' : ''} saved)\n\n${caption ? `I'll use this when building your site.` : `Send more images or describe your website to start building.`}`);

      // If there's a caption, treat it as a message too
      if (caption) {
        await handleMessage(chatId, caption);
      }

      return NextResponse.json({ ok: true });
    }

    // Handle voice messages
    if (update.message?.voice) {
      const chatId = update.message.chat.id;
      const voice = update.message.voice;
      
      await sendChatAction(chatId, 'typing');
      await sendMessage(chatId, '🎤 Processing your voice message...');
      
      try {
        const transcribedText = await transcribeVoice(voice.file_id);
        
        if (!transcribedText || transcribedText.trim().length === 0) {
          await sendMessage(chatId, '❌ Could not understand the voice message. Please try again or type your request.');
          return NextResponse.json({ ok: true });
        }
        
        // Show what we heard
        await sendMessage(chatId, `💬 I heard: "${transcribedText}"\n\nProcessing...`);
        
        // Process as regular text message
        await handleMessage(chatId, transcribedText);
      } catch (error) {
        console.error('Voice transcription error:', error);
        await sendMessage(chatId, '❌ Failed to process voice message. Please try again or type your request.');
      }
      
      return NextResponse.json({ ok: true });
    }

    if (update.message?.text) {
      const chatId = update.message.chat.id;
      const text = update.message.text.trim();
      await handleMessage(chatId, text);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ ok: true });
  }
}
