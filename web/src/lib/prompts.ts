import { readFileSync } from 'fs';
import { join } from 'path';

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

export function buildSystemPrompt(
  flowState: FlowState,
  currentHtml: string | null,
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

  // Add current HTML context for iteration
  if (currentHtml && flowState === 'iteration') {
    prompt += `\n\nCURRENT WEBSITE HTML:\n\`\`\`html\n${currentHtml}\n\`\`\``;
  }

  // Add available images
  if (images.length > 0) {
    prompt += `\n\nAVAILABLE IMAGES:\nThe user has uploaded the following images. Use them in the website with <img> tags. The paths are relative to the site root.\n${images.map(img => `- ${img}`).join('\n')}\n\nUse these images where they make sense (hero sections, galleries, about sections, etc). Use descriptive alt text based on context.`;
  }

  return prompt;
}
