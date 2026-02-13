export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="max-w-3xl mx-auto px-6 pt-20 pb-16 text-center">
        <div className="inline-block bg-blue-50 text-blue-600 text-sm font-medium px-3 py-1 rounded-full mb-6">
          No signup. No code. No design tools.
        </div>
        <h1 className="text-5xl font-bold tracking-tight text-gray-900 mb-6">
          Describe your website.
          <br />
          <span className="text-blue-600">Get it live in 60 seconds.</span>
        </h1>
        <p className="text-xl text-gray-500 mb-10 max-w-xl mx-auto">
          Tell our Telegram bot what you want. It builds a real website and deploys it instantly. Change anything by chatting.
        </p>
        <a
          href="https://t.me/Chat2WebsiteNC_bot"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-[#0088cc] text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-[#006da3] transition shadow-lg shadow-blue-200"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
          </svg>
          Open in Telegram
        </a>
        <p className="mt-4 text-sm text-gray-400">
          Free to start · 1 website · 20 updates included
        </p>
      </section>

      {/* How it works */}
      <section className="max-w-4xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-12">How it works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center text-2xl font-bold mx-auto mb-4">1</div>
            <h3 className="font-semibold text-gray-900 mb-2">Describe it</h3>
            <p className="text-gray-500 text-sm">&ldquo;A portfolio site for a photographer with a dark theme and grid gallery&rdquo;</p>
          </div>
          <div className="text-center">
            <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center text-2xl font-bold mx-auto mb-4">2</div>
            <h3 className="font-semibold text-gray-900 mb-2">AI builds it</h3>
            <p className="text-gray-500 text-sm">Claude generates a complete, mobile-responsive website in seconds. No templates.</p>
          </div>
          <div className="text-center">
            <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center text-2xl font-bold mx-auto mb-4">3</div>
            <h3 className="font-semibold text-gray-900 mb-2">It&apos;s live</h3>
            <p className="text-gray-500 text-sm">Auto-deployed with a public URL. Share it, iterate on it, or keep chatting to refine.</p>
          </div>
        </div>
      </section>

      {/* Use cases */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-12">What people build</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { emoji: '🏪', title: 'Business pages', desc: 'Bakery menu, salon services, consulting practice' },
              { emoji: '📸', title: 'Portfolios', desc: 'Photography, design, writing, freelance work' },
              { emoji: '🚀', title: 'Landing pages', desc: 'Product launches, waitlists, coming soon pages' },
              { emoji: '🎉', title: 'Event pages', desc: 'Weddings, birthdays, meetups, conferences' },
              { emoji: '👤', title: 'Personal sites', desc: 'Bio links, resumes, personal homepages' },
              { emoji: '💡', title: 'Project pages', desc: 'Side projects, open source, startup ideas' },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-4 bg-white p-4 rounded-xl">
                <span className="text-2xl">{item.emoji}</span>
                <div>
                  <h3 className="font-semibold text-gray-900">{item.title}</h3>
                  <p className="text-sm text-gray-500">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-3xl mx-auto px-6 py-20 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to build?</h2>
        <p className="text-gray-500 mb-8">Open the bot, describe your site, and watch it go live.</p>
        <a
          href="https://t.me/Chat2WebsiteNC_bot"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-gray-900 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-700 transition"
        >
          Start Building →
        </a>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8 text-center text-sm text-gray-400">
        Built by <a href="https://sanjeevnc.com" className="underline hover:text-gray-600">Sanjeev NC</a> · Powered by Claude
      </footer>
    </main>
  );
}
