import { PageContent, BlogPost } from './store';

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

async function deleteFile(owner: string, repo: string, path: string, message: string) {
  try {
    const existing = await fetch(`${GITHUB_API}/repos/${owner}/${repo}/contents/${path}`, {
      headers: githubHeaders(),
    });
    if (existing.ok) {
      const data = await existing.json();
      await fetch(`${GITHUB_API}/repos/${owner}/${repo}/contents/${path}`, {
        method: 'DELETE',
        headers: githubHeaders(),
        body: JSON.stringify({ message, sha: data.sha }),
      });
    }
  } catch {}
}

// Escape HTML for safe embedding in TSX template strings
function escapeForTemplate(html: string): string {
  return html.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$/g, '\\$');
}

// Generate shared layout with navigation
function generateLayout(
  siteName: string, 
  pages: PageContent[], 
  hasBlog: boolean,
  siteConfig: { primaryColor: string; fontFamily: string } | null
): string {
  const sortedPages = [...pages].sort((a, b) => a.order - b.order);
  const primaryColor = siteConfig?.primaryColor || '#2563eb';
  const fontFamily = siteConfig?.fontFamily || 'system-ui, -apple-system, sans-serif';
  
  const navItems = sortedPages
    .filter(p => !p.isHome)
    .map(p => `    { name: '${p.title}', href: '/${p.slug}' },`)
    .join('\n');
  
  const blogNav = hasBlog ? `    { name: 'Blog', href: '/blog' },` : '';
  
  return `import './globals.css';
import Link from 'next/link';

export const metadata = {
  title: '${siteName}',
  description: 'Built with Chat-to-Website',
};

const navItems = [
  { name: 'Home', href: '/' },
${navItems}
${blogNav}
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <style>{\`
          :root {
            --primary: ${primaryColor};
            --font-family: ${fontFamily};
          }
        \`}</style>
      </head>
      <body>
        <nav className="site-nav">
          <div className="nav-container">
            <Link href="/" className="logo">${siteName}</Link>
            <div className="nav-links">
              {navItems.map(item => (
                <Link key={item.href} href={item.href} className="nav-link">
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        </nav>
        <main>{children}</main>
        <footer className="site-footer">
          <p>© ${new Date().getFullYear()} ${siteName}. All rights reserved.</p>
        </footer>
      </body>
    </html>
  );
}
`;
}

// Generate global CSS
function generateGlobalCss(siteConfig: { primaryColor: string; fontFamily: string } | null): string {
  const primaryColor = siteConfig?.primaryColor || '#2563eb';
  const fontFamily = siteConfig?.fontFamily || 'system-ui, -apple-system, sans-serif';
  
  return `* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: var(--font-family, ${fontFamily});
  line-height: 1.6;
  color: #1f2937;
  background: #ffffff;
}

.site-nav {
  background: #ffffff;
  border-bottom: 1px solid #e5e7eb;
  padding: 1rem 0;
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary, ${primaryColor});
  text-decoration: none;
}

.nav-links {
  display: flex;
  gap: 2rem;
}

.nav-link {
  color: #4b5563;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
}

.nav-link:hover {
  color: var(--primary, ${primaryColor});
}

.site-footer {
  background: #f9fafb;
  border-top: 1px solid #e5e7eb;
  padding: 2rem;
  text-align: center;
  color: #6b7280;
  margin-top: 4rem;
}

/* Page content */
.page-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
}

/* Blog styles */
.blog-list {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
}

.blog-post-card {
  border-bottom: 1px solid #e5e7eb;
  padding: 2rem 0;
}

.blog-post-card:last-child {
  border-bottom: none;
}

.blog-post-card h2 {
  margin-bottom: 0.5rem;
}

.blog-post-card h2 a {
  color: #1f2937;
  text-decoration: none;
}

.blog-post-card h2 a:hover {
  color: var(--primary, ${primaryColor});
}

.blog-post-card .date {
  color: #6b7280;
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
}

.blog-post-card .description {
  color: #4b5563;
}

.blog-post {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
}

.blog-post h1 {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

.blog-post .meta {
  color: #6b7280;
  margin-bottom: 2rem;
}

.blog-post .content {
  line-height: 1.8;
}

.blog-post .content h2 {
  margin-top: 2rem;
  margin-bottom: 1rem;
}

.blog-post .content p {
  margin-bottom: 1.5rem;
}

.blog-post .content ul, .blog-post .content ol {
  margin-bottom: 1.5rem;
  padding-left: 1.5rem;
}

/* Responsive */
@media (max-width: 768px) {
  .nav-links {
    gap: 1rem;
    font-size: 0.875rem;
  }
  
  .blog-post h1 {
    font-size: 1.75rem;
  }
}
`;
}

// Generate a page component
function generatePageComponent(page: PageContent): string {
  const escapedContent = escapeForTemplate(page.content);
  return `export default function ${page.slug === 'home' ? 'Home' : page.title.replace(/[^a-zA-Z0-9]/g, '')}Page() {
  return (
    <div className="page-content" dangerouslySetInnerHTML={{ __html: \`${escapedContent}\` }} />
  );
}
`;
}

// Generate blog listing page
function generateBlogListPage(posts: BlogPost[]): string {
  const sortedPosts = [...posts].sort((a, b) => 
    new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
  
  const postCards = sortedPosts.map(post => `
        <article className="blog-post-card">
          <h2><Link href="/blog/${post.slug}">${post.title}</Link></h2>
          <p className="date">{new Date('${post.publishedAt}').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          <p className="description">${post.description}</p>
        </article>`).join('\n');

  return `import Link from 'next/link';

export default function BlogPage() {
  return (
    <div className="blog-list">
      <h1 style={{ marginBottom: '2rem' }}>Blog</h1>
      ${postCards || '<p>No posts yet. Check back soon!</p>'}
    </div>
  );
}
`;
}

// Generate individual blog post page
function generateBlogPostPage(post: BlogPost): string {
  // Simple markdown to HTML conversion
  const htmlContent = post.content
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/^(.+)$/gm, (match) => {
      if (match.startsWith('<')) return match;
      return `<p>${match}</p>`;
    });

  const escapedContent = escapeForTemplate(htmlContent);

  return `import Link from 'next/link';

export default function BlogPost() {
  return (
    <article className="blog-post">
      <Link href="/blog" style={{ color: 'var(--primary)', marginBottom: '1rem', display: 'inline-block' }}>← Back to Blog</Link>
      <h1>${post.title}</h1>
      <p className="meta">{new Date('${post.publishedAt}').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
      <div className="content" dangerouslySetInnerHTML={{ __html: \`${escapedContent}\` }} />
    </article>
  );
}
`;
}

// Legacy: Scaffold single-page site
export async function scaffoldAndPush(repoName: string, html: string) {
  const owner = await getOwner();
  const escapedHtml = escapeForTemplate(html);

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

// NEW: Scaffold multi-page site with blog support
export async function scaffoldMultiPageSite(
  repoName: string,
  siteName: string,
  pages: PageContent[],
  blogPosts: BlogPost[],
  siteConfig: { primaryColor: string; fontFamily: string } | null
) {
  const owner = await getOwner();
  const hasBlog = blogPosts.length > 0;
  
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
    'src/app/globals.css': generateGlobalCss(siteConfig),
    'src/app/layout.tsx': generateLayout(siteName, pages, hasBlog, siteConfig),
  };

  // Add page files
  for (const page of pages) {
    if (page.isHome || page.slug === 'home') {
      files['src/app/page.tsx'] = generatePageComponent(page);
    } else {
      files[`src/app/${page.slug}/page.tsx`] = generatePageComponent(page);
    }
  }

  // Add blog files if there are posts
  if (hasBlog) {
    files['src/app/blog/page.tsx'] = generateBlogListPage(blogPosts);
    
    for (const post of blogPosts) {
      files[`src/app/blog/${post.slug}/page.tsx`] = generateBlogPostPage(post);
    }
  }

  // Push all files
  for (const [path, content] of Object.entries(files)) {
    await pushFile(owner, repoName, path, content, `Add ${path}`);
    await new Promise(r => setTimeout(r, 300));
  }
}

// Update a specific page in a multi-page site
export async function updatePage(repoName: string, page: PageContent) {
  const owner = await getOwner();
  const path = page.isHome || page.slug === 'home' 
    ? 'src/app/page.tsx' 
    : `src/app/${page.slug}/page.tsx`;
  
  await pushFile(owner, repoName, path, generatePageComponent(page), `Update ${page.title} page`);
}

// Delete a page from a multi-page site
export async function deletePage(repoName: string, slug: string) {
  const owner = await getOwner();
  await deleteFile(owner, repoName, `src/app/${slug}/page.tsx`, `Delete ${slug} page`);
}

// Add or update a blog post
export async function updateBlogPost(repoName: string, post: BlogPost, allPosts: BlogPost[]) {
  const owner = await getOwner();
  
  // Update the individual post page
  await pushFile(
    owner, 
    repoName, 
    `src/app/blog/${post.slug}/page.tsx`, 
    generateBlogPostPage(post), 
    `Update blog post: ${post.title}`
  );
  
  // Update the blog listing page
  await pushFile(
    owner,
    repoName,
    'src/app/blog/page.tsx',
    generateBlogListPage(allPosts),
    'Update blog listing'
  );
}

// Delete a blog post
export async function deleteBlogPost(repoName: string, slug: string, remainingPosts: BlogPost[]) {
  const owner = await getOwner();
  await deleteFile(owner, repoName, `src/app/blog/${slug}/page.tsx`, `Delete blog post: ${slug}`);
  
  // Update blog listing
  await pushFile(
    owner,
    repoName,
    'src/app/blog/page.tsx',
    generateBlogListPage(remainingPosts),
    'Update blog listing after deletion'
  );
}

// Update the layout (navigation, site config)
export async function updateLayout(
  repoName: string,
  siteName: string,
  pages: PageContent[],
  hasBlog: boolean,
  siteConfig: { primaryColor: string; fontFamily: string } | null
) {
  const owner = await getOwner();
  await pushFile(
    owner,
    repoName,
    'src/app/layout.tsx',
    generateLayout(siteName, pages, hasBlog, siteConfig),
    'Update site layout'
  );
  await pushFile(
    owner,
    repoName,
    'src/app/globals.css',
    generateGlobalCss(siteConfig),
    'Update global styles'
  );
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

// Legacy: Update single page HTML
export async function updateProjectHtml(repoName: string, html: string) {
  const owner = await getOwner();
  const escapedHtml = escapeForTemplate(html);
  const pageTsx = `export default function Home() {
  return (
    <div dangerouslySetInnerHTML={{ __html: \`${escapedHtml}\` }} />
  );
}`;
  await pushFile(owner, repoName, 'src/app/page.tsx', pageTsx, 'Update website');
}

export async function pushImageToRepo(
  repoName: string,
  filename: string,
  imageBuffer: Buffer
): Promise<string> {
  const owner = await getOwner();
  const path = `public/${filename}`;
  const content = imageBuffer.toString('base64');

  const existingRes = await fetch(`${GITHUB_API}/repos/${owner}/${repoName}/contents/${path}`, {
    headers: githubHeaders(),
  });
  const body: Record<string, string> = {
    message: `Add image ${filename}`,
    content,
  };
  if (existingRes.ok) {
    const existing = await existingRes.json();
    body.sha = existing.sha;
  }

  const res = await fetch(`${GITHUB_API}/repos/${owner}/${repoName}/contents/${path}`, {
    method: 'PUT',
    headers: githubHeaders(),
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(`GitHub push image failed: ${JSON.stringify(err)}`);
  }
  return `/${filename}`;
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
