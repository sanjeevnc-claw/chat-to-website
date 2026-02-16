import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="max-w-3xl mx-auto px-6 pt-24 pb-20">
        <div className="text-center">
          <p className="text-gray-500 text-sm tracking-wide uppercase mb-6">
            From The Yencee Labs
          </p>
          
          <h1 className="text-5xl md:text-6xl font-semibold tracking-tight text-black mb-6">
            Chat to Website
          </h1>
          
          <p className="text-xl text-gray-600 mb-6 max-w-xl mx-auto leading-relaxed">
            Describe your website. Get it live in 60 seconds.
          </p>
          
          <p className="text-lg text-gray-500 mb-12 max-w-lg mx-auto">
            Tell our bot what you want. It builds a real, multi-page website 
            with a blog and deploys it instantly.
          </p>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
          <Link
            href="/try"
            className="flex-1 text-center bg-black text-white px-6 py-3 rounded-md font-medium hover:bg-gray-900 transition"
          >
            Try Web Chat
          </Link>
          <a
            href="https://t.me/Chat2WebsiteNC_bot"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 text-center border border-gray-200 text-black px-6 py-3 rounded-md font-medium hover:border-gray-400 transition"
          >
            Use Telegram
          </a>
        </div>
        
        <p className="text-gray-400 text-sm text-center mt-4">
          No signup required · 1 free website · 20 updates included
        </p>
      </section>

      {/* Divider */}
      <div className="border-t border-gray-200" />

      {/* Demo */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-6">
          <div className="border border-gray-200 rounded-lg p-6 md:p-8">
            <p className="text-sm text-gray-400 mb-4 text-center">Example conversation</p>
            <div className="space-y-4 max-w-md mx-auto">
              <div className="bg-gray-100 rounded-lg px-4 py-3 text-gray-900 text-sm">
                Build a portfolio site for a photographer with a dark theme and a blog
              </div>
              <div className="bg-black rounded-lg px-4 py-3 text-white text-sm ml-8">
                Building your website now... ✨
              </div>
              <div className="bg-black rounded-lg px-4 py-3 text-white text-sm ml-8">
                ✅ Your website is live!<br/>
                <span className="text-gray-300">🌐 https://photo-portfolio-x7k2.vercel.app</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="border-t border-gray-200" />

      {/* Features */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wide mb-8">
            What You Get
          </h2>
          
          <div className="space-y-8">
            <div className="flex items-start gap-4">
              <span className="text-xl">📄</span>
              <div>
                <h3 className="font-semibold text-black mb-1">Multi-Page Websites</h3>
                <p className="text-gray-600">Home, About, Contact, Services — add as many pages as you need.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <span className="text-xl">✍️</span>
              <div>
                <h3 className="font-semibold text-black mb-1">Built-in Blog</h3>
                <p className="text-gray-600">Say "write a blog post about X" and get a full article instantly.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <span className="text-xl">🎨</span>
              <div>
                <h3 className="font-semibold text-black mb-1">Custom Design</h3>
                <p className="text-gray-600">The AI creates unique designs, not cookie-cutter templates.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <span className="text-xl">📱</span>
              <div>
                <h3 className="font-semibold text-black mb-1">Mobile Responsive</h3>
                <p className="text-gray-600">Every site looks great on phones, tablets, and desktops.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <span className="text-xl">🚀</span>
              <div>
                <h3 className="font-semibold text-black mb-1">Instant Deploy</h3>
                <p className="text-gray-600">Your site goes live immediately on a .vercel.app URL.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <span className="text-xl">🎤</span>
              <div>
                <h3 className="font-semibold text-black mb-1">Voice Messages</h3>
                <p className="text-gray-600">Send a voice note — we transcribe and build what you describe.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="border-t border-gray-200" />

      {/* How it works */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wide mb-8">
            How It Works
          </h2>
          
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="text-2xl mb-3">01</div>
              <h3 className="font-semibold text-black mb-2">Open the bot</h3>
              <p className="text-gray-600 text-sm">
                Click the link. No signup, no email, just start chatting.
              </p>
            </div>
            
            <div>
              <div className="text-2xl mb-3">02</div>
              <h3 className="font-semibold text-black mb-2">Describe your site</h3>
              <p className="text-gray-600 text-sm">
                "A portfolio for a UX designer with case studies"
              </p>
            </div>
            
            <div>
              <div className="text-2xl mb-3">03</div>
              <h3 className="font-semibold text-black mb-2">AI builds it</h3>
              <p className="text-gray-600 text-sm">
                Multiple pages, real content, professional design.
              </p>
            </div>
            
            <div>
              <div className="text-2xl mb-3">04</div>
              <h3 className="font-semibold text-black mb-2">It's live</h3>
              <p className="text-gray-600 text-sm">
                Get a public URL instantly. Share it anywhere.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="border-t border-gray-200" />

      {/* Use cases */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wide mb-8">
            What People Build
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { emoji: '📸', title: 'Photography Portfolio', prompt: '"Portfolio for a wedding photographer with galleries"' },
              { emoji: '🏪', title: 'Local Business', prompt: '"Website for a coffee shop with menu and hours"' },
              { emoji: '💼', title: 'Freelancer Site', prompt: '"Personal site for a copywriter with case studies"' },
              { emoji: '🚀', title: 'Startup Landing', prompt: '"Landing page for an AI tool with pricing"' },
              { emoji: '🎓', title: 'Course Page', prompt: '"Site for a workshop with schedule and pricing"' },
              { emoji: '👨‍💻', title: 'Developer Portfolio', prompt: '"Portfolio with GitHub projects and blog"' },
            ].map((item) => (
              <div key={item.title} className="border border-gray-200 rounded-lg p-5">
                <span className="text-2xl mb-3 block">{item.emoji}</span>
                <h3 className="font-semibold text-black mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500 italic">{item.prompt}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="border-t border-gray-200" />

      {/* Pricing */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wide mb-8">
            Pricing
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="font-semibold text-black text-lg mb-2">Free</h3>
              <p className="text-gray-500 text-sm mb-6">Perfect for trying it out</p>
              <div className="text-3xl font-semibold text-black mb-6">$0</div>
              <ul className="space-y-3 text-sm text-gray-600 mb-8">
                <li className="flex items-center gap-2"><span className="text-black">→</span> 1 website</li>
                <li className="flex items-center gap-2"><span className="text-black">→</span> 20 updates</li>
                <li className="flex items-center gap-2"><span className="text-black">→</span> Multi-page support</li>
                <li className="flex items-center gap-2"><span className="text-black">→</span> Blog included</li>
              </ul>
              <a
                href="https://t.me/Chat2WebsiteNC_bot"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center border border-gray-200 text-black px-6 py-3 rounded-md font-medium hover:border-gray-400 transition"
              >
                Start Free
              </a>
            </div>
            
            <div className="border border-black rounded-lg p-6 bg-black text-white">
              <h3 className="font-semibold text-lg mb-2">Credit Packs</h3>
              <p className="text-gray-400 text-sm mb-6">Buy credits for more sites and updates</p>
              <div className="text-3xl font-semibold mb-6">From $5</div>
              <ul className="space-y-3 text-sm text-gray-300 mb-8">
                <li className="flex items-center gap-2"><span className="text-white">→</span> 50 credits — $5</li>
                <li className="flex items-center gap-2"><span className="text-white">→</span> 200 credits — $15</li>
                <li className="flex items-center gap-2"><span className="text-white">→</span> 500 credits — $30</li>
                <li className="flex items-center gap-2"><span className="text-white">→</span> Pay with card or UPI</li>
              </ul>
              <Link
                href="/try"
                className="block w-full text-center bg-white text-black px-6 py-3 rounded-md font-medium hover:bg-gray-100 transition"
              >
                Get Credits
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="border-t border-gray-200" />

      {/* FAQ */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wide mb-8">
            Questions
          </h2>
          
          <div className="space-y-6">
            {[
              {
                q: 'Do I need to know how to code?',
                a: 'No. Just describe what you want in plain English.'
              },
              {
                q: 'Can I use my own domain?',
                a: 'Custom domains are coming soon. For now, you get a free .vercel.app URL.'
              },
              {
                q: 'What if I want to change something?',
                a: 'Just send another message. Changes deploy instantly.'
              },
              {
                q: 'Is the website really mine?',
                a: 'Yes. The code is in GitHub. Export and self-host anytime.'
              },
              {
                q: 'How does the blog work?',
                a: 'Say "write a blog post about X" — the AI creates a full article.'
              },
            ].map((faq) => (
              <div key={faq.q} className="border-b border-gray-100 pb-6">
                <h3 className="font-semibold text-black mb-2">{faq.q}</h3>
                <p className="text-gray-600">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="border-t border-gray-200" />

      {/* Final CTA */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-semibold text-black mb-4">
            Your website is one message away
          </h2>
          <p className="text-gray-600 mb-8">
            Stop overthinking. Start building. Go live today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <Link
              href="/try"
              className="flex-1 text-center bg-black text-white px-6 py-3 rounded-md font-medium hover:bg-gray-900 transition"
            >
              Try Web Chat
            </Link>
            <a
              href="https://t.me/Chat2WebsiteNC_bot"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 text-center border border-gray-200 text-black px-6 py-3 rounded-md font-medium hover:border-gray-400 transition"
            >
              Use Telegram
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-12">
        <div className="max-w-3xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <p className="font-semibold text-black">Chat to Website</p>
              <p className="text-sm text-gray-400 mt-1">A product by The Yencee Labs</p>
            </div>
            <div className="flex flex-wrap gap-6 text-sm text-gray-400">
              <Link href="/blog" className="hover:text-black transition">Blog</Link>
              <a href="https://t.me/Chat2WebsiteNC_bot" target="_blank" rel="noopener noreferrer" className="hover:text-black transition">Telegram</a>
              <a href="https://twitter.com/yenceesanjeev" target="_blank" rel="noopener noreferrer" className="hover:text-black transition">Twitter</a>
            </div>
          </div>
          <div className="flex flex-wrap gap-6 mt-6 text-sm text-gray-400">
            <Link href="/privacy" className="hover:text-black transition">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-black transition">Terms of Service</Link>
            <Link href="/refund" className="hover:text-black transition">Refund Policy</Link>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-100 text-sm text-gray-400">
            © {new Date().getFullYear()} The Yencee Labs. Built by humans + AI.
          </div>
        </div>
      </footer>
    </main>
  );
}
