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
            The AI Site Builder
          </h1>
          
          <p className="text-xl text-gray-600 mb-6 max-w-xl mx-auto leading-relaxed">
            Describe your website. Watch AI build it. Go live in 60 seconds.
          </p>
          
          <p className="text-lg text-gray-500 mb-12 max-w-lg mx-auto">
            No templates. No drag-and-drop. Just tell our AI what you want 
            and get a real, multi-page website instantly deployed.
          </p>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
          <Link
            href="/try"
            className="flex-1 text-center bg-black text-white px-6 py-3 rounded-md font-medium hover:bg-gray-900 transition"
          >
            Build Your Site Free
          </Link>
          <a
            href="https://t.me/Chat2WebsiteNC_bot"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 text-center border border-gray-200 text-black px-6 py-3 rounded-md font-medium hover:border-gray-400 transition"
          >
            Use Telegram Bot
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
            <p className="text-sm text-gray-400 mb-4 text-center">See it in action</p>
            <div className="space-y-4 max-w-md mx-auto">
              <div className="bg-gray-100 rounded-lg px-4 py-3 text-gray-900 text-sm">
                Build a portfolio site for a photographer with a dark theme, gallery pages, and a blog
              </div>
              <div className="bg-black rounded-lg px-4 py-3 text-white text-sm ml-8">
                Building your website now... ✨
              </div>
              <div className="bg-black rounded-lg px-4 py-3 text-white text-sm ml-8">
                ✅ Your website is live!<br/>
                <span className="text-gray-300">🌐 photo-portfolio-x7k2.vercel.app</span><br/>
                <span className="text-gray-400 text-xs mt-1 block">4 pages · blog ready · mobile responsive</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="border-t border-gray-200" />

      {/* How it's different */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wide mb-8">
            Not Another Website Builder
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="font-semibold text-gray-400 mb-4 line-through">Traditional Builders</h3>
              <ul className="space-y-3 text-sm text-gray-500">
                <li className="flex items-start gap-2"><span>❌</span> Pick a template</li>
                <li className="flex items-start gap-2"><span>❌</span> Drag and drop blocks</li>
                <li className="flex items-start gap-2"><span>❌</span> Write all the copy yourself</li>
                <li className="flex items-start gap-2"><span>❌</span> Configure settings for hours</li>
                <li className="flex items-start gap-2"><span>❌</span> $15-30/month subscription</li>
              </ul>
            </div>
            
            <div className="border border-black rounded-lg p-6 bg-black text-white">
              <h3 className="font-semibold mb-4">The AI Site Builder</h3>
              <ul className="space-y-3 text-sm text-gray-300">
                <li className="flex items-start gap-2"><span>✓</span> Describe what you want</li>
                <li className="flex items-start gap-2"><span>✓</span> AI creates unique design</li>
                <li className="flex items-start gap-2"><span>✓</span> AI writes your content</li>
                <li className="flex items-start gap-2"><span>✓</span> Live in under 60 seconds</li>
                <li className="flex items-start gap-2"><span>✓</span> Start free, pay only when you need more</li>
              </ul>
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
                <p className="text-gray-600">Home, About, Contact, Services, Portfolio — as many pages as you need. Not a single-page limitation.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <span className="text-xl">✍️</span>
              <div>
                <h3 className="font-semibold text-black mb-1">Built-in Blog</h3>
                <p className="text-gray-600">Say "write a blog post about X" and get a full, SEO-friendly article. Build your content library via chat.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <span className="text-xl">🎨</span>
              <div>
                <h3 className="font-semibold text-black mb-1">Unique Designs</h3>
                <p className="text-gray-600">No cookie-cutter templates. The AI creates a custom design based on your description and industry.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <span className="text-xl">📱</span>
              <div>
                <h3 className="font-semibold text-black mb-1">Mobile Responsive</h3>
                <p className="text-gray-600">Every site looks great on phones, tablets, and desktops. No extra work required.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <span className="text-xl">🚀</span>
              <div>
                <h3 className="font-semibold text-black mb-1">Instant Deploy</h3>
                <p className="text-gray-600">Your site goes live immediately. No waiting, no manual publishing, no configuration.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <span className="text-xl">🎤</span>
              <div>
                <h3 className="font-semibold text-black mb-1">Voice Input</h3>
                <p className="text-gray-600">Send a voice note describing your site. We transcribe it and build exactly what you described.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <span className="text-xl">💻</span>
              <div>
                <h3 className="font-semibold text-black mb-1">Real Code, Real Ownership</h3>
                <p className="text-gray-600">Your site is real Next.js code in GitHub. Export it anytime. No vendor lock-in.</p>
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
              <h3 className="font-semibold text-black mb-2">Start chatting</h3>
              <p className="text-gray-600 text-sm">
                Open the web chat or Telegram bot. No account needed.
              </p>
            </div>
            
            <div>
              <div className="text-2xl mb-3">02</div>
              <h3 className="font-semibold text-black mb-2">Describe your site</h3>
              <p className="text-gray-600 text-sm">
                "A portfolio for a UX designer with case studies and dark mode"
              </p>
            </div>
            
            <div>
              <div className="text-2xl mb-3">03</div>
              <h3 className="font-semibold text-black mb-2">AI builds it</h3>
              <p className="text-gray-600 text-sm">
                Multiple pages, real content, custom design — all generated.
              </p>
            </div>
            
            <div>
              <div className="text-2xl mb-3">04</div>
              <h3 className="font-semibold text-black mb-2">You're live</h3>
              <p className="text-gray-600 text-sm">
                Get your URL instantly. Share it with the world.
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
              { emoji: '📸', title: 'Photography Portfolio', prompt: '"Portfolio for a wedding photographer with dark theme and galleries"' },
              { emoji: '🏪', title: 'Local Business', prompt: '"Website for my coffee shop with menu, hours, and location"' },
              { emoji: '💼', title: 'Freelancer Site', prompt: '"Personal site for a copywriter with testimonials and case studies"' },
              { emoji: '🚀', title: 'Startup Landing', prompt: '"Landing page for our AI tool with features and pricing"' },
              { emoji: '🎓', title: 'Course/Workshop', prompt: '"Site for my photography workshop with schedule and signup"' },
              { emoji: '👨‍💻', title: 'Developer Portfolio', prompt: '"Portfolio showing my GitHub projects and tech blog"' },
              { emoji: '🍕', title: 'Restaurant', prompt: '"Website for Italian restaurant with menu and reservations"' },
              { emoji: '🏋️', title: 'Fitness Coach', prompt: '"Personal trainer site with programs and booking"' },
              { emoji: '🎵', title: 'Musician/Band', prompt: '"Band website with tour dates, music, and merch"' },
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
            Simple Pricing
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="font-semibold text-black text-lg mb-2">Free</h3>
              <p className="text-gray-500 text-sm mb-6">Try it out, no strings attached</p>
              <div className="text-3xl font-semibold text-black mb-6">$0</div>
              <ul className="space-y-3 text-sm text-gray-600 mb-8">
                <li className="flex items-center gap-2"><span className="text-black">→</span> 1 website</li>
                <li className="flex items-center gap-2"><span className="text-black">→</span> 20 updates/edits</li>
                <li className="flex items-center gap-2"><span className="text-black">→</span> Multi-page support</li>
                <li className="flex items-center gap-2"><span className="text-black">→</span> Blog included</li>
                <li className="flex items-center gap-2"><span className="text-black">→</span> Voice input</li>
              </ul>
              <Link
                href="/try"
                className="block w-full text-center border border-gray-200 text-black px-6 py-3 rounded-md font-medium hover:border-gray-400 transition"
              >
                Start Free
              </Link>
            </div>
            
            <div className="border border-black rounded-lg p-6 bg-black text-white">
              <h3 className="font-semibold text-lg mb-2">Credit Packs</h3>
              <p className="text-gray-400 text-sm mb-6">More sites, more updates, more power</p>
              <div className="text-3xl font-semibold mb-6">From ₹400</div>
              <ul className="space-y-3 text-sm text-gray-300 mb-8">
                <li className="flex items-center gap-2"><span className="text-white">→</span> Starter: ₹400 / $5 — 50 credits</li>
                <li className="flex items-center gap-2"><span className="text-white">→</span> Builder: ₹1,200 / $15 — 200 credits</li>
                <li className="flex items-center gap-2"><span className="text-white">→</span> Pro: ₹2,400 / $30 — 500 credits</li>
                <li className="flex items-center gap-2"><span className="text-white">→</span> UPI, cards, international accepted</li>
              </ul>
              <Link
                href="/pricing"
                className="block w-full text-center bg-white text-black px-6 py-3 rounded-md font-medium hover:bg-gray-100 transition"
              >
                View Full Pricing
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
                a: 'Absolutely not. Just describe what you want in plain English (or send a voice note). The AI handles everything.'
              },
              {
                q: 'Can I use my own domain?',
                a: 'Custom domains are coming soon! For now, you get a free .vercel.app URL that works perfectly.'
              },
              {
                q: 'What if I want to change something?',
                a: 'Just send another message like "make the header blue" or "add a testimonials section." Changes deploy instantly.'
              },
              {
                q: 'Is the website really mine?',
                a: 'Yes. The code lives in GitHub. You can export it, modify it, or self-host it anytime. No lock-in.'
              },
              {
                q: 'How does the blog work?',
                a: 'Say "write a blog post about X" and the AI creates a full, formatted article. Great for SEO and content marketing.'
              },
              {
                q: 'What counts as a "credit"?',
                a: 'Each AI interaction (building, updating, adding pages, writing posts) uses credits. See the pricing page for details.'
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
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Stop procrastinating. Stop overthinking. Describe what you want and be live in 60 seconds.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <Link
              href="/try"
              className="flex-1 text-center bg-black text-white px-6 py-3 rounded-md font-medium hover:bg-gray-900 transition"
            >
              Build Your Site Free
            </Link>
            <a
              href="https://t.me/Chat2WebsiteNC_bot"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 text-center border border-gray-200 text-black px-6 py-3 rounded-md font-medium hover:border-gray-400 transition"
            >
              Use Telegram Bot
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-12">
        <div className="max-w-3xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <p className="font-semibold text-black">The AI Site Builder</p>
              <p className="text-sm text-gray-400 mt-1">A product by The Yencee Labs</p>
            </div>
            <div className="flex flex-wrap gap-6 text-sm text-gray-400">
              <Link href="/pricing" className="hover:text-black transition">Pricing</Link>
              <Link href="/blog" className="hover:text-black transition">Blog</Link>
              <a href="https://t.me/Chat2WebsiteNC_bot" target="_blank" rel="noopener noreferrer" className="hover:text-black transition">Telegram</a>
              <a href="https://twitter.com/yaboraiyan" target="_blank" rel="noopener noreferrer" className="hover:text-black transition">Twitter</a>
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
