import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 pt-20 pb-16 text-center">
        <div className="inline-block bg-blue-50 text-blue-600 text-sm font-medium px-3 py-1 rounded-full mb-6">
          🚀 Now with multi-page websites & blogs
        </div>
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-gray-900 mb-6">
          Describe your website.
          <br />
          <span className="text-blue-600">Get it live in 60 seconds.</span>
        </h1>
        <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto">
          Tell our Telegram bot what you want. It builds a real, multi-page website with a blog and deploys it instantly. Change anything by chatting.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/try"
            className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-blue-700 transition shadow-lg shadow-blue-200"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
            Try Web Chat
          </Link>
          <a
            href="https://t.me/Chat2WebsiteNC_bot"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-[#0088cc] text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-[#006da3] transition"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
            </svg>
            Use Telegram
          </a>
        </div>
        <p className="mt-4 text-sm text-gray-400">
          No signup required · 1 free website · 20 updates included
        </p>
      </section>

      {/* Demo Video / Screenshot placeholder */}
      <section className="max-w-4xl mx-auto px-6 pb-16">
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 md:p-12 text-center">
          <div className="bg-gray-700/50 rounded-xl p-6 border border-gray-600">
            <p className="text-gray-400 text-sm mb-2">💬 Example conversation</p>
            <div className="space-y-3 text-left max-w-md mx-auto">
              <div className="bg-gray-600/50 rounded-lg px-4 py-2 text-white text-sm">
                Build a portfolio site for a photographer with a dark theme and a blog
              </div>
              <div className="bg-blue-600/80 rounded-lg px-4 py-2 text-white text-sm ml-8">
                Building your website now... ✨
              </div>
              <div className="bg-blue-600/80 rounded-lg px-4 py-2 text-white text-sm ml-8">
                ✅ Your website is live!<br/>
                🌐 https://photo-portfolio-x7k2.vercel.app<br/>
                📝 Blog: /blog
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="bg-gray-50 py-20">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">Everything you need</h2>
          <p className="text-center text-gray-500 mb-12 max-w-2xl mx-auto">
            Not just a landing page generator. Build complete websites with multiple pages, blogs, and professional design.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center text-2xl mb-4">📄</div>
              <h3 className="font-semibold text-gray-900 text-lg mb-2">Multi-Page Websites</h3>
              <p className="text-gray-500 text-sm">Home, About, Contact, Services — add as many pages as you need. Navigation updates automatically.</p>
            </div>
            
            <div className="bg-white p-6 rounded-2xl shadow-sm">
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center text-2xl mb-4">✍️</div>
              <h3 className="font-semibold text-gray-900 text-lg mb-2">Built-in Blog</h3>
              <p className="text-gray-500 text-sm">Say &ldquo;write a blog post about X&rdquo; and get a full article. Markdown support, auto-listing page.</p>
            </div>
            
            <div className="bg-white p-6 rounded-2xl shadow-sm">
              <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center text-2xl mb-4">🎨</div>
              <h3 className="font-semibold text-gray-900 text-lg mb-2">Custom Design</h3>
              <p className="text-gray-500 text-sm">Choose colors, fonts, and style. The AI creates unique designs, not cookie-cutter templates.</p>
            </div>
            
            <div className="bg-white p-6 rounded-2xl shadow-sm">
              <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center text-2xl mb-4">📱</div>
              <h3 className="font-semibold text-gray-900 text-lg mb-2">Mobile Responsive</h3>
              <p className="text-gray-500 text-sm">Every site looks great on phones, tablets, and desktops. No extra work required.</p>
            </div>
            
            <div className="bg-white p-6 rounded-2xl shadow-sm">
              <div className="w-12 h-12 bg-red-100 text-red-600 rounded-xl flex items-center justify-center text-2xl mb-4">🚀</div>
              <h3 className="font-semibold text-gray-900 text-lg mb-2">Instant Deploy</h3>
              <p className="text-gray-500 text-sm">Your site goes live immediately on a .vercel.app URL. Share it anywhere, it&apos;s already hosted.</p>
            </div>
            
            <div className="bg-white p-6 rounded-2xl shadow-sm">
              <div className="w-12 h-12 bg-cyan-100 text-cyan-600 rounded-xl flex items-center justify-center text-2xl mb-4">🔄</div>
              <h3 className="font-semibold text-gray-900 text-lg mb-2">Edit by Chatting</h3>
              <p className="text-gray-500 text-sm">&ldquo;Make the header blue&rdquo; — changes deploy in seconds. No code, no dashboard, just chat.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">How it works</h2>
        <div className="grid md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center text-2xl font-bold mx-auto mb-4">1</div>
            <h3 className="font-semibold text-gray-900 mb-2">Open the bot</h3>
            <p className="text-gray-500 text-sm">Click the Telegram link. No signup, no email, just start chatting.</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center text-2xl font-bold mx-auto mb-4">2</div>
            <h3 className="font-semibold text-gray-900 mb-2">Describe your site</h3>
            <p className="text-gray-500 text-sm">&ldquo;A portfolio for a UX designer with case studies and a contact page&rdquo;</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center text-2xl font-bold mx-auto mb-4">3</div>
            <h3 className="font-semibold text-gray-900 mb-2">AI builds it</h3>
            <p className="text-gray-500 text-sm">Claude generates multiple pages with real content, professional design, and proper structure.</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center text-2xl font-bold mx-auto mb-4">4</div>
            <h3 className="font-semibold text-gray-900 mb-2">It&apos;s live!</h3>
            <p className="text-gray-500 text-sm">Get a public URL instantly. Share it, keep editing, or add blog posts.</p>
          </div>
        </div>
      </section>

      {/* Use cases */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">What people build</h2>
          <p className="text-center text-gray-500 mb-12">Real use cases from real users</p>
          
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { 
                emoji: '📸', 
                title: 'Photography Portfolio', 
                desc: 'Dark theme, grid gallery, about page, contact form. Perfect for showcasing your work.',
                example: '"Portfolio for a wedding photographer with galleries organized by event"'
              },
              { 
                emoji: '🏪', 
                title: 'Local Business', 
                desc: 'Menu, services, location, hours. Everything a small business needs online.',
                example: '"Website for a coffee shop with our menu, story, and Instagram feed"'
              },
              { 
                emoji: '💼', 
                title: 'Freelancer Site', 
                desc: 'Services, pricing, testimonials, blog. Win more clients with a professional presence.',
                example: '"Personal site for a freelance copywriter with case studies and a blog"'
              },
              { 
                emoji: '🚀', 
                title: 'Startup Landing', 
                desc: 'Product features, pricing, waitlist signup. Launch your idea fast.',
                example: '"Landing page for an AI writing tool with features, pricing, and waitlist"'
              },
              { 
                emoji: '🎓', 
                title: 'Course / Workshop', 
                desc: 'Curriculum, instructor bio, registration info. Perfect for educators.',
                example: '"Site for a photography workshop with schedule, pricing, and instructor bio"'
              },
              { 
                emoji: '🎉', 
                title: 'Event Page', 
                desc: 'Date, location, RSVP info, schedule. Beautiful event pages in minutes.',
                example: '"Wedding website with our story, venue info, and RSVP details"'
              },
              { 
                emoji: '👨‍💻', 
                title: 'Developer Portfolio', 
                desc: 'Projects, skills, blog posts. Show off your code and writing.',
                example: '"Developer portfolio with GitHub projects, blog, and contact page"'
              },
              { 
                emoji: '🎨', 
                title: 'Artist Showcase', 
                desc: 'Gallery, bio, commissions info. Let your art speak for itself.',
                example: '"Portfolio for a digital artist with gallery, commission prices, and about page"'
              },
              { 
                emoji: '📝', 
                title: 'Writer / Blogger', 
                desc: 'Blog with categories, about page, newsletter signup.',
                example: '"Personal blog for a tech writer with articles and an about page"'
              },
            ].map((item) => (
              <div key={item.title} className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition">
                <span className="text-3xl mb-4 block">{item.emoji}</span>
                <h3 className="font-semibold text-gray-900 text-lg mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm mb-3">{item.desc}</p>
                <p className="text-xs text-blue-600 bg-blue-50 px-3 py-2 rounded-lg italic">{item.example}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">From the Blog</h2>
          <p className="text-center text-gray-500 mb-12">Tips, tutorials, and updates</p>
          
          <div className="grid md:grid-cols-3 gap-8">
            <article className="group">
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl h-40 mb-4"></div>
              <p className="text-sm text-gray-400 mb-2">February 15, 2026</p>
              <h3 className="font-semibold text-gray-900 text-lg mb-2 group-hover:text-blue-600 transition">
                <Link href="/blog/how-to-build-portfolio-in-60-seconds">
                  How to Build a Portfolio Website in 60 Seconds
                </Link>
              </h3>
              <p className="text-gray-500 text-sm">A step-by-step guide to creating a stunning portfolio using just chat.</p>
            </article>
            
            <article className="group">
              <div className="bg-gradient-to-br from-green-500 to-teal-600 rounded-xl h-40 mb-4"></div>
              <p className="text-sm text-gray-400 mb-2">February 14, 2026</p>
              <h3 className="font-semibold text-gray-900 text-lg mb-2 group-hover:text-blue-600 transition">
                <Link href="/blog/multi-page-websites-launch">
                  Introducing Multi-Page Websites & Built-in Blogs
                </Link>
              </h3>
              <p className="text-gray-500 text-sm">Our biggest update yet: create complete websites with multiple pages and a blog.</p>
            </article>
            
            <article className="group">
              <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-xl h-40 mb-4"></div>
              <p className="text-sm text-gray-400 mb-2">February 12, 2026</p>
              <h3 className="font-semibold text-gray-900 text-lg mb-2 group-hover:text-blue-600 transition">
                <Link href="/blog/best-prompts-for-ai-websites">
                  10 Prompts to Get the Perfect AI-Generated Website
                </Link>
              </h3>
              <p className="text-gray-500 text-sm">Master the art of describing your website for the best results.</p>
            </article>
          </div>
          
          <div className="text-center mt-10">
            <Link 
              href="/blog"
              className="inline-flex items-center gap-2 text-blue-600 font-medium hover:text-blue-700"
            >
              View all posts →
            </Link>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">Simple pricing</h2>
          <p className="text-center text-gray-500 mb-12">Start free, pay only if you need more</p>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
            <div className="bg-white p-8 rounded-2xl shadow-sm border-2 border-gray-100">
              <h3 className="font-bold text-xl text-gray-900 mb-2">Free</h3>
              <p className="text-gray-500 text-sm mb-6">Perfect for trying it out</p>
              <div className="text-4xl font-bold text-gray-900 mb-6">$0</div>
              <ul className="space-y-3 text-sm text-gray-600 mb-8">
                <li className="flex items-center gap-2"><span className="text-green-500">✓</span> 1 website</li>
                <li className="flex items-center gap-2"><span className="text-green-500">✓</span> 20 updates</li>
                <li className="flex items-center gap-2"><span className="text-green-500">✓</span> Multi-page support</li>
                <li className="flex items-center gap-2"><span className="text-green-500">✓</span> Blog included</li>
                <li className="flex items-center gap-2"><span className="text-green-500">✓</span> .vercel.app URL</li>
              </ul>
              <a
                href="https://t.me/Chat2WebsiteNC_bot"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-200 transition"
              >
                Start Free
              </a>
            </div>
            
            <div className="bg-blue-600 p-8 rounded-2xl shadow-lg text-white relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                MOST POPULAR
              </div>
              <h3 className="font-bold text-xl mb-2">Extra Sites & Updates</h3>
              <p className="text-blue-200 text-sm mb-6">Pay as you grow via Telegram Stars</p>
              <div className="text-4xl font-bold mb-6">⭐ 50</div>
              <ul className="space-y-3 text-sm text-blue-100 mb-8">
                <li className="flex items-center gap-2"><span>✓</span> +1 additional website</li>
                <li className="flex items-center gap-2"><span>✓</span> 20 updates included</li>
                <li className="flex items-center gap-2"><span>✓</span> Pay with Telegram Stars</li>
                <li className="flex items-center gap-2"><span>✓</span> Instant activation</li>
                <li className="flex items-center gap-2 opacity-60">• Custom domains coming soon</li>
              </ul>
              <a
                href="https://t.me/Chat2WebsiteNC_bot"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center bg-white text-blue-600 px-6 py-3 rounded-xl font-semibold hover:bg-blue-50 transition"
              >
                Get Started
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Frequently asked questions</h2>
          
          <div className="space-y-6">
            {[
              {
                q: 'Do I need to know how to code?',
                a: 'Nope! Just describe what you want in plain English. The AI handles all the technical stuff.'
              },
              {
                q: 'Can I use my own domain?',
                a: 'Custom domains are coming soon! For now, you get a free .vercel.app URL that you can share anywhere.'
              },
              {
                q: 'What if I want to change something later?',
                a: 'Just send another message! Say "make the header blue" or "add a pricing section" and changes deploy instantly.'
              },
              {
                q: 'Is the website really mine?',
                a: 'Yes! The code is stored in a GitHub repository. You can export it anytime and host it yourself if you want.'
              },
              {
                q: 'How does the blog work?',
                a: 'Say "write a blog post about [topic]" and the AI creates a full article. All posts appear on your /blog page automatically.'
              },
              {
                q: 'What are Telegram Stars?',
                a: 'Telegram Stars are Telegram\'s in-app currency. You can buy them directly in Telegram to pay for extra websites or updates.'
              },
            ].map((faq) => (
              <div key={faq.q} className="border-b border-gray-100 pb-6">
                <h3 className="font-semibold text-gray-900 mb-2">{faq.q}</h3>
                <p className="text-gray-500">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-gray-900 py-20">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Your website is one message away
          </h2>
          <p className="text-gray-400 mb-8 text-lg">
            Stop overthinking. Start building. Go live today.
          </p>
          <a
            href="https://t.me/Chat2WebsiteNC_bot"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-10 py-5 rounded-xl text-xl font-semibold hover:bg-blue-700 transition shadow-lg"
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
              <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
            </svg>
            Open Chat2Website Bot
          </a>
          <p className="mt-6 text-gray-500 text-sm">
            Takes 60 seconds · No signup · No credit card
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-12">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
              <p className="font-semibold text-gray-900 mb-1">Chat to Website</p>
              <p className="text-sm text-gray-400">Built by <a href="https://sanjeevnc.com" className="underline hover:text-gray-600">Sanjeev NC</a> · Powered by Claude</p>
            </div>
            <div className="flex gap-6 text-sm text-gray-500">
              <Link href="/blog" className="hover:text-gray-900">Blog</Link>
              <a href="https://t.me/Chat2WebsiteNC_bot" className="hover:text-gray-900">Telegram</a>
              <a href="https://twitter.com/yenceesanjeev" className="hover:text-gray-900">Twitter</a>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-100 text-center text-sm text-gray-400">
            © {new Date().getFullYear()} The Yencee Labs. All rights reserved.
          </div>
        </div>
      </footer>
    </main>
  );
}
