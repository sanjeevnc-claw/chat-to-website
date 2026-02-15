import { readFileSync } from 'fs';
import { join } from 'path';
import { PageContent, BlogPost, ProjectState } from './store';

const PROMPTS_DIR = join(process.cwd(), 'src', 'prompts');

function load(filename: string): string {
  return readFileSync(join(PROMPTS_DIR, filename), 'utf-8');
}

// Cache on first load
let _cache: Record<string, string> = {};

function get(name: string): string {
  if (!_cache[name]) {
    _cache[name] = load(`${name}.md`);
  }
  return _cache[name];
}

export type FlowState = 'first-visit' | 'gathering' | 'building' | 'iteration';

export function detectFlowState(
  hasProject: boolean,
  messageCount: number,
  lastAssistantAskedQuestion: boolean
): FlowState {
  if (hasProject) return 'iteration';
  if (messageCount === 1) return 'first-visit'; // First user message
  if (lastAssistantAskedQuestion) return 'gathering';
  return 'building';
}

// Format pages for context
function formatPagesContext(pages: PageContent[]): string {
  if (pages.length === 0) return 'No pages created yet.';
  
  return pages.map(p => {
    const homeIndicator = p.isHome ? ' (Homepage)' : '';
    return `## ${p.title}${homeIndicator}
Slug: ${p.slug}
Order: ${p.order}
Content:
\`\`\`html
${p.content}
\`\`\``;
  }).join('\n\n');
}

// Format blog posts for context
function formatBlogContext(posts: BlogPost[]): string {
  if (posts.length === 0) return 'No blog posts yet.';
  
  return posts.map(p => `## ${p.title}
Slug: ${p.slug}
Published: ${p.publishedAt}
Description: ${p.description}
Content:
\`\`\`markdown
${p.content}
\`\`\`
`).join('\n\n');
}

// Format site config for context  
function formatSiteConfig(state: ProjectState): string {
  if (!state.siteConfig) {
    return 'Site config not set.';
  }
  return `Site Name: ${state.siteConfig.siteName}
Description: ${state.siteConfig.description}
Primary Color: ${state.siteConfig.primaryColor}
Font: ${state.siteConfig.fontFamily}`;
}

export function buildSystemPrompt(
  flowState: FlowState,
  state: ProjectState | null,
  images: string[] = []
): string {
  // Always load base
  let prompt = get('base');

  // Add flow-specific instructions
  switch (flowState) {
    case 'first-visit':
      prompt += '\n\n' + get('first-visit');
      prompt += '\n\n' + get('gathering');
      break;
    case 'gathering':
      prompt += '\n\n' + get('gathering');
      prompt += '\n\n' + get('building');
      break;
    case 'building':
      prompt += '\n\n' + get('building');
      break;
    case 'iteration':
      prompt += '\n\n' + get('iteration');
      prompt += '\n\n' + get('building');
      break;
  }

  // Always add edge cases
  prompt += '\n\n' + get('edge-cases');

  // Add current state context for iteration
  if (state && flowState === 'iteration') {
    prompt += '\n\n---\n\n# CURRENT WEBSITE STATE\n\n';
    
    // Site config
    prompt += '## Site Configuration\n';
    prompt += formatSiteConfig(state);
    prompt += '\n\n';
    
    // Pages
    prompt += '## Current Pages\n';
    prompt += formatPagesContext(state.pages);
    prompt += '\n\n';
    
    // Blog posts
    if (state.hasBlog || state.blogPosts.length > 0) {
      prompt += '## Blog Posts\n';
      prompt += formatBlogContext(state.blogPosts);
      prompt += '\n\n';
    }
    
    // Legacy HTML fallback
    if (state.pages.length === 0 && state.currentHtml) {
      prompt += '## Legacy Single-Page HTML\n';
      prompt += `\`\`\`html\n${state.currentHtml}\n\`\`\``;
    }
  }

  // Add available images
  if (images.length > 0) {
    prompt += '\n\n## Available Images\n';
    prompt += 'The user has uploaded the following images. Use them with <img> tags:\n';
    prompt += images.map(img => `- ${img}`).join('\n');
    prompt += '\n\nUse these images where appropriate (hero sections, galleries, about sections, etc). Use descriptive alt text.';
  }

  return prompt;
}

// Parse AI response to extract structured content
export interface ParsedResponse {
  displayText: string;
  pages: PageContent[];
  blogPosts: BlogPost[];
  deletedPages: string[];
  deletedBlogPosts: string[];
  siteConfig: Partial<{
    siteName: string;
    description: string;
    primaryColor: string;
    fontFamily: string;
    navStyle: 'horizontal' | 'hamburger';
  }> | null;
  legacyHtml: string | null;
}

export function parseAIResponse(content: string): ParsedResponse {
  const result: ParsedResponse = {
    displayText: content,
    pages: [],
    blogPosts: [],
    deletedPages: [],
    deletedBlogPosts: [],
    siteConfig: null,
    legacyHtml: null,
  };
  
  // Extract page blocks
  const pageMatches = content.matchAll(/```page\n([\s\S]*?)```/g);
  for (const match of pageMatches) {
    try {
      const page = JSON.parse(match[1].trim()) as PageContent;
      result.pages.push(page);
      result.displayText = result.displayText.replace(match[0], '');
    } catch (e) {
      console.error('Failed to parse page block:', e);
    }
  }
  
  // Extract blog post blocks
  const blogMatches = content.matchAll(/```blogpost\n([\s\S]*?)```/g);
  for (const match of blogMatches) {
    try {
      const post = JSON.parse(match[1].trim()) as Omit<BlogPost, 'publishedAt'>;
      result.blogPosts.push({
        ...post,
        publishedAt: new Date().toISOString(),
      });
      result.displayText = result.displayText.replace(match[0], '');
    } catch (e) {
      console.error('Failed to parse blogpost block:', e);
    }
  }
  
  // Extract delete page commands
  const deletePageMatches = content.matchAll(/```deletepage\n([\s\S]*?)```/g);
  for (const match of deletePageMatches) {
    try {
      const cmd = JSON.parse(match[1].trim()) as { slug: string };
      result.deletedPages.push(cmd.slug);
      result.displayText = result.displayText.replace(match[0], '');
    } catch (e) {
      console.error('Failed to parse deletepage block:', e);
    }
  }
  
  // Extract delete blog post commands
  const deleteBlogMatches = content.matchAll(/```deleteblogpost\n([\s\S]*?)```/g);
  for (const match of deleteBlogMatches) {
    try {
      const cmd = JSON.parse(match[1].trim()) as { slug: string };
      result.deletedBlogPosts.push(cmd.slug);
      result.displayText = result.displayText.replace(match[0], '');
    } catch (e) {
      console.error('Failed to parse deleteblogpost block:', e);
    }
  }
  
  // Extract site config
  const configMatch = content.match(/```siteconfig\n([\s\S]*?)```/);
  if (configMatch) {
    try {
      result.siteConfig = JSON.parse(configMatch[1].trim());
      result.displayText = result.displayText.replace(configMatch[0], '');
    } catch (e) {
      console.error('Failed to parse siteconfig block:', e);
    }
  }
  
  // Extract legacy HTML (fallback)
  const htmlMatch = content.match(/```html\n([\s\S]*?)```/);
  if (htmlMatch) {
    result.legacyHtml = htmlMatch[1].trim();
    result.displayText = result.displayText.replace(htmlMatch[0], '');
  }
  
  // Clean up display text
  result.displayText = result.displayText.trim();
  
  return result;
}

// Check if response has any structured content
export function hasStructuredContent(parsed: ParsedResponse): boolean {
  return (
    parsed.pages.length > 0 ||
    parsed.blogPosts.length > 0 ||
    parsed.deletedPages.length > 0 ||
    parsed.deletedBlogPosts.length > 0 ||
    parsed.siteConfig !== null ||
    parsed.legacyHtml !== null
  );
}
