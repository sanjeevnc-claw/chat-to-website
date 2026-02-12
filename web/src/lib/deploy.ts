const GITHUB_API = 'https://api.github.com';
const VERCEL_API = 'https://api.vercel.com';

let _cachedOwner: string | null = null;

function githubHeaders() {
  return {
    Authorization: `token ${process.env.GITHUB_TOKEN}`,
    Accept: 'application/vnd.github.v3+json',
    'Content-Type': 'application/json',
  };
}

function vercelHeaders() {
  return {
    Authorization: `Bearer ${process.env.VERCEL_TOKEN}`,
    'Content-Type': 'application/json',
  };
}

export function getPublicVercelUrl(repoName: string): string {
  return `https://${repoName}.vercel.app`;
}

async function getOwner(): Promise<string> {
  if (_cachedOwner) return _cachedOwner;
  const res = await fetch(`${GITHUB_API}/user`, { headers: githubHeaders() });
  if (!res.ok) throw new Error('Failed to get GitHub user from token');
  const data = await res.json();
  _cachedOwner = data.login;
  return data.login;
}

async function waitForRepo(owner: string, repoName: string, maxRetries = 8) {
  for (let i = 0; i < maxRetries; i++) {
    const res = await fetch(`${GITHUB_API}/repos/${owner}/${repoName}`, {
      headers: githubHeaders(),
    });
    if (res.ok) return;
    await new Promise(r => setTimeout(r, 2000));
  }
  throw new Error('Repo creation timed out');
}

export async function createGitHubRepo(name: string): Promise<string> {
  const owner = await getOwner();
  const res = await fetch(`${GITHUB_API}/user/repos`, {
    method: 'POST',
    headers: githubHeaders(),
    body: JSON.stringify({
      name,
      auto_init: true,
      private: false,
      description: `Generated website: ${name}`,
    }),
  });
  if (!res.ok) {
    const err = await res.json();
    if (res.status === 422 && JSON.stringify(err).includes('already exists')) {
      return `https://github.com/${owner}/${name}`;
    }
    throw new Error(`GitHub create repo failed: ${JSON.stringify(err)}`);
  }
  const data = await res.json();
  await waitForRepo(owner, name);
  return data.html_url as string;
}

async function pushFile(owner: string, repo: string, path: string, content: string, message: string) {
  let sha: string | undefined;
  try {
    const existing = await fetch(`${GITHUB_API}/repos/${owner}/${repo}/contents/${path}`, {
      headers: githubHeaders(),
    });
    if (existing.ok) {
      const data = await existing.json();
      sha = data.sha;
    }
  } catch {}

  const res = await fetch(`${GITHUB_API}/repos/${owner}/${repo}/contents/${path}`, {
    method: 'PUT',
    headers: githubHeaders(),
    body: JSON.stringify({
      message,
      content: Buffer.from(content).toString('base64'),
      ...(sha ? { sha } : {}),
    }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(`GitHub push file ${path} failed: ${JSON.stringify(err)}`);
  }
}

export async function scaffoldAndPush(repoName: string, html: string) {
  const owner = await getOwner();
  const escapedHtml = html.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$/g, '\\$');

  const files: Record<string, string> = {
    'package.json': JSON.stringify({
      name: repoName,
      version: '0.1.0',
      private: true,
      scripts: {
        dev: 'next dev',
        build: 'next build',
        start: 'next start',
      },
      dependencies: {
        next: '^14.0.0',
        react: '^18.2.0',
        'react-dom': '^18.2.0',
      },
      devDependencies: {
        typescript: '^5.4.0',
        '@types/node': '^20.12.0',
        '@types/react': '^18.3.0',
      },
    }, null, 2),
    'tsconfig.json': JSON.stringify({
      compilerOptions: {
        target: 'es5',
        lib: ['dom', 'dom.iterable', 'esnext'],
        allowJs: true,
        skipLibCheck: true,
        strict: false,
        noEmit: true,
        esModuleInterop: true,
        module: 'esnext',
        moduleResolution: 'bundler',
        resolveJsonModule: true,
        isolatedModules: true,
        jsx: 'preserve',
        incremental: true,
        plugins: [{ name: 'next' }],
        paths: { '@/*': ['./src/*'] },
      },
      include: ['next-env.d.ts', '**/*.ts', '**/*.tsx', '.next/types/**/*.ts'],
      exclude: ['node_modules'],
    }, null, 2),
    'next.config.js': `/** @type {import('next').NextConfig} */
const nextConfig = {};
module.exports = nextConfig;`,
    'src/app/layout.tsx': `export const metadata = { title: '${repoName}' };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}</body></html>;
}`,
    'src/app/page.tsx': `export default function Home() {
  return (
    <div dangerouslySetInnerHTML={{ __html: \`${escapedHtml}\` }} />
  );
}`,
  };

  for (const [path, content] of Object.entries(files)) {
    await pushFile(owner, repoName, path, content, `Add ${path}`);
    await new Promise(r => setTimeout(r, 500));
  }
}

export async function createVercelProject(repoName: string): Promise<string> {
  const owner = await getOwner();
  const res = await fetch(`${VERCEL_API}/v10/projects`, {
    method: 'POST',
    headers: vercelHeaders(),
    body: JSON.stringify({
      name: repoName,
      framework: 'nextjs',
      gitRepository: {
        type: 'github',
        repo: `${owner}/${repoName}`,
      },
    }),
  });

  if (!res.ok) {
    const err = await res.json();
    if (JSON.stringify(err).includes('already exist')) {
      return getPublicVercelUrl(repoName);
    }
    throw new Error(`Vercel create project failed: ${JSON.stringify(err)}`);
  }

  return getPublicVercelUrl(repoName);
}

export async function updateProjectHtml(repoName: string, html: string) {
  const owner = await getOwner();
  const escapedHtml = html.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$/g, '\\$');
  const pageTsx = `export default function Home() {
  return (
    <div dangerouslySetInnerHTML={{ __html: \`${escapedHtml}\` }} />
  );
}`;
  await pushFile(owner, repoName, 'src/app/page.tsx', pageTsx, 'Update website');
}

export async function getRepoUrl(repoName: string): Promise<string> {
  const owner = await getOwner();
  return `https://github.com/${owner}/${repoName}`;
}

export async function triggerVercelDeployment(repoName: string): Promise<string> {
  const owner = await getOwner();
  const res = await fetch(`${VERCEL_API}/v13/deployments`, {
    method: 'POST',
    headers: vercelHeaders(),
    body: JSON.stringify({
      name: repoName,
      gitSource: {
        type: 'github',
        org: owner,
        repo: repoName,
        ref: 'main',
      },
    }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(`Vercel deployment failed: ${JSON.stringify(err)}`);
  }

  const data = await res.json();
  return data.id as string;
}

export async function waitForDeployment(deploymentId: string, timeoutMs = 120000): Promise<void> {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    const res = await fetch(`${VERCEL_API}/v13/deployments/${deploymentId}`, {
      headers: vercelHeaders(),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.readyState === 'READY') {
        return;
      }
      if (data.readyState === 'ERROR' || data.readyState === 'CANCELED') {
        throw new Error(`Deployment ${data.readyState}: ${data.errorMessage || 'unknown error'}`);
      }
    }
    await new Promise(r => setTimeout(r, 3000));
  }
  throw new Error('Deployment timed out');
}
