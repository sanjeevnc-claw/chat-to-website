import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();

const FREE_SITES = 1;
const FREE_UPDATES = 20;

export interface ProjectState {
  repoName: string | null;
  currentHtml: string | null;
  deployUrl: string | null;
  messages: { role: string; content: string }[];
  deployCount: number; // number of deploys for this project
}

export interface UserUsage {
  sitesCreated: number;
  // could add payment status later
}

const KEY_PREFIX = 'project:';
const USAGE_PREFIX = 'usage:';

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

export async function getUserUsage(chatId: number): Promise<UserUsage> {
  const data = await redis.get<UserUsage>(`${USAGE_PREFIX}${chatId}`);
  return data || { sitesCreated: 0 };
}

export async function incrementSitesCreated(chatId: number): Promise<void> {
  const usage = await getUserUsage(chatId);
  usage.sitesCreated += 1;
  await redis.set(`${USAGE_PREFIX}${chatId}`, usage);
}

export function canCreateSite(usage: UserUsage): boolean {
  return usage.sitesCreated < FREE_SITES;
}

export function canUpdate(state: ProjectState): boolean {
  return state.deployCount < FREE_UPDATES;
}

export { FREE_SITES, FREE_UPDATES };
