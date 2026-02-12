import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();

export interface ProjectState {
  repoName: string | null;
  currentHtml: string | null;
  deployUrl: string | null;
  messages: { role: string; content: string }[];
}

const KEY_PREFIX = 'project:';

export async function getProjectState(chatId: number): Promise<ProjectState | null> {
  const data = await redis.get<ProjectState>(`${KEY_PREFIX}${chatId}`);
  return data;
}

export async function setProjectState(chatId: number, state: ProjectState): Promise<void> {
  await redis.set(`${KEY_PREFIX}${chatId}`, state);
}

export async function resetProjectState(chatId: number): Promise<void> {
  await redis.del(`${KEY_PREFIX}${chatId}`);
}
