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
            <span>February 15, 2026</span>
            <span>·</span>
            <span>3 min read</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            How to Build a Portfolio Website in 60 Seconds
          </h1>
          <p className="text-xl text-gray-500">
            A step-by-step guide to creating a stunning portfolio using just chat.
          </p>
        </header>

        <div className="prose prose-lg max-w-none">
          <p className="text-gray-600 leading-relaxed mb-6">
            Building a portfolio website used to take days. You&apos;d pick a template, customize it, struggle with the design, write copy, upload images, configure hosting... the list goes on. Not anymore.
          </p>

          <p className="text-gray-600 leading-relaxed mb-6">
            With Chat to Website, you describe what you want, and AI builds a complete, professional portfolio in about 60 seconds. Here&apos;s how to do it.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Step 1: Open the Bot</h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            Click <a href="https://t.me/Chat2WebsiteNC_bot" className="text-blue-600 hover:underline">this link</a> to open the Chat to Website bot in Telegram. No signup needed — just start chatting.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Step 2: Describe Your Portfolio</h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            Be specific but don&apos;t overthink it. Here are some example prompts that work great:
          </p>

          <div className="bg-gray-50 rounded-xl p-6 mb-6 space-y-4">
            <p className="text-gray-700 italic">&ldquo;Build a portfolio for a UX designer with a dark theme, case studies page, about page, and contact form&rdquo;</p>
            <p className="text-gray-700 italic">&ldquo;Portfolio for a wedding photographer with a gallery organized by event type&rdquo;</p>
            <p className="text-gray-700 italic">&ldquo;Minimal portfolio for a freelance writer with work samples and a blog&rdquo;</p>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Step 3: Watch It Build</h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            The AI will create multiple pages — typically a homepage, about page, portfolio/work page, and contact page. Navigation is added automatically. The whole thing deploys to a live URL in under a minute.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Step 4: Refine It</h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            Not quite right? Just chat to make changes:
          </p>

          <ul className="list-disc pl-6 mb-6 text-gray-600 space-y-2">
            <li>&ldquo;Make the header background navy blue&rdquo;</li>
            <li>&ldquo;Add a testimonials section to the homepage&rdquo;</li>
            <li>&ldquo;Change the font to something more modern&rdquo;</li>
            <li>&ldquo;Add a blog section&rdquo;</li>
          </ul>

          <p className="text-gray-600 leading-relaxed mb-6">
            Each change deploys instantly. Keep iterating until it&apos;s perfect.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Pro Tips</h2>
          <ul className="list-disc pl-6 mb-6 text-gray-600 space-y-2">
            <li><strong>Upload your own images:</strong> Send photos directly in Telegram and they&apos;ll be used in your site.</li>
            <li><strong>Be specific about style:</strong> &ldquo;dark theme&rdquo;, &ldquo;minimal&rdquo;, &ldquo;bold and colorful&rdquo; — the AI understands these.</li>
            <li><strong>Request multiple pages upfront:</strong> It&apos;s easier than adding them one by one later.</li>
            <li><strong>Add a blog:</strong> Say &ldquo;write a blog post about [topic]&rdquo; to start content marketing.</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Ready to Try?</h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            Stop procrastinating on that portfolio. Open the bot, describe your ideal site, and have it live before you finish your coffee.
          </p>

          <div className="bg-blue-50 rounded-xl p-8 text-center mt-10">
            <h3 className="font-bold text-xl text-gray-900 mb-3">Build your portfolio now</h3>
            <p className="text-gray-600 mb-4">It&apos;s free to start. No signup required.</p>
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

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8 text-center text-sm text-gray-400">
        <Link href="/" className="hover:text-gray-600">Chat to Website</Link>
        {' · '}
        <Link href="/blog" className="hover:text-gray-600">Blog</Link>
      </footer>
    </main>
  );
}
