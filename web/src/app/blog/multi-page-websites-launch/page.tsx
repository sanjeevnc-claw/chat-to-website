import Link from 'next/link';

export default function BlogPost() {
  return (
    <main className="min-h-screen bg-white">
      <article className="max-w-3xl mx-auto px-6 py-16">
        <Link href="/blog" className="text-blue-600 hover:text-blue-700 text-sm font-medium mb-8 inline-block">
          ← Back to Blog
        </Link>
        
        <header className="mb-12">
          <div className="flex items-center gap-3 text-sm text-gray-400 mb-4">
            <span>February 14, 2026</span>
            <span>·</span>
            <span>4 min read</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Introducing Multi-Page Websites & Built-in Blogs
          </h1>
          <p className="text-xl text-gray-500">
            Our biggest update yet: create complete websites with multiple pages and a blog.
          </p>
        </header>

        <div className="prose prose-lg max-w-none">
          <p className="text-gray-600 leading-relaxed mb-6">
            When we launched Chat to Website, you could build a single-page landing site by chatting. Today, we&apos;re taking it much further.
          </p>

          <p className="text-gray-600 leading-relaxed mb-6">
            <strong>Multi-page websites and built-in blogs are now live.</strong> This means you can create complete websites — not just landing pages — all through conversation.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">What&apos;s New</h2>

          <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-3">📄 Multiple Pages</h3>
          <p className="text-gray-600 leading-relaxed mb-6">
            Ask for a homepage, about page, services page, contact page — as many as you need. The AI creates each one with appropriate content and adds them to your navigation automatically.
          </p>

          <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-3">✍️ Built-in Blog</h3>
          <p className="text-gray-600 leading-relaxed mb-6">
            Say &ldquo;write a blog post about [topic]&rdquo; and you get a full article. Posts are written in markdown, rendered beautifully, and automatically listed on your /blog page. Perfect for content marketing.
          </p>

          <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-3">🎨 Site-wide Styling</h3>
          <p className="text-gray-600 leading-relaxed mb-6">
            Colors, fonts, and design choices now apply across all pages. Change your primary color once, and every page updates. Consistency without the hassle.
          </p>

          <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-3">🔄 Page Management</h3>
          <p className="text-gray-600 leading-relaxed mb-6">
            New commands to manage your site:
          </p>
          <ul className="list-disc pl-6 mb-6 text-gray-600 space-y-2">
            <li><code className="bg-gray-100 px-2 py-1 rounded">/pages</code> — List all pages on your site</li>
            <li><code className="bg-gray-100 px-2 py-1 rounded">/blog</code> — List all blog posts</li>
            <li><code className="bg-gray-100 px-2 py-1 rounded">/status</code> — See site stats and usage</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Example Workflow</h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            Here&apos;s what building a complete business site looks like now:
          </p>

          <div className="bg-gray-900 rounded-xl p-6 mb-6 space-y-3 font-mono text-sm">
            <p className="text-green-400">You: Build a website for a digital marketing agency with home, services, about, and contact pages</p>
            <p className="text-blue-400">Bot: Building your website now... ✨</p>
            <p className="text-blue-400">Bot: ✅ Your website is live! 🌐 agency-xyz.vercel.app</p>
            <p className="text-green-400">You: Add a blog and write a post about SEO tips for small businesses</p>
            <p className="text-blue-400">Bot: Building 1 blog post... ✨</p>
            <p className="text-blue-400">Bot: ✅ Blog post published! 📝 agency-xyz.vercel.app/blog</p>
            <p className="text-green-400">You: Make the primary color orange</p>
            <p className="text-blue-400">Bot: Updating site... ✨</p>
            <p className="text-blue-400">Bot: ✅ Done! All pages now use orange.</p>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Technical Details</h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            Under the hood, we&apos;re now generating proper Next.js applications with:
          </p>
          <ul className="list-disc pl-6 mb-6 text-gray-600 space-y-2">
            <li>App Router for clean URLs</li>
            <li>Shared layout with persistent navigation</li>
            <li>Global CSS with CSS variables for theming</li>
            <li>Markdown blog posts with automatic listing</li>
            <li>Mobile-responsive design throughout</li>
          </ul>

          <p className="text-gray-600 leading-relaxed mb-6">
            Everything still deploys to Vercel instantly, and you can still export your code anytime.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">What&apos;s Next</h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            We&apos;re working on:
          </p>
          <ul className="list-disc pl-6 mb-6 text-gray-600 space-y-2">
            <li><strong>Contact forms</strong> that actually send emails</li>
            <li><strong>Custom domains</strong> — buy and connect your own domain through chat</li>
            <li><strong>SEO tools</strong> — auto-generated meta tags, sitemaps, and more</li>
            <li><strong>Templates</strong> — start from pre-built designs for common use cases</li>
          </ul>

          <div className="bg-blue-50 rounded-xl p-8 text-center mt-10">
            <h3 className="font-bold text-xl text-gray-900 mb-3">Try it now</h3>
            <p className="text-gray-600 mb-4">Build a multi-page website in under 2 minutes.</p>
            <a
              href="https://t.me/Chat2WebsiteNC_bot"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
            >
              Open Chat to Website →
            </a>
          </div>
        </div>
      </article>

      <footer className="border-t border-gray-100 py-8 text-center text-sm text-gray-400">
        <Link href="/" className="hover:text-gray-600">Chat to Website</Link>
        {' · '}
        <Link href="/blog" className="hover:text-gray-600">Blog</Link>
      </footer>
    </main>
  );
}
