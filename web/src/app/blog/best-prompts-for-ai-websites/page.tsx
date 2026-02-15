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
            <span>February 12, 2026</span>
            <span>·</span>
            <span>5 min read</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            10 Prompts to Get the Perfect AI-Generated Website
          </h1>
          <p className="text-xl text-gray-500">
            Master the art of describing your website for the best results.
          </p>
        </header>

        <div className="prose prose-lg max-w-none">
          <p className="text-gray-600 leading-relaxed mb-6">
            The quality of your AI-generated website depends heavily on how you describe it. After watching thousands of sites get built, we&apos;ve identified what works best. Here are 10 prompts that consistently produce excellent results.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">1. The Detailed Portfolio</h2>
          <div className="bg-gray-50 rounded-xl p-6 mb-6">
            <p className="text-gray-700 italic">&ldquo;Build a portfolio for a UX designer with a dark theme. Include a homepage with featured projects, a work page with case studies organized by category, an about page with my background and skills, and a contact page with a form.&rdquo;</p>
          </div>
          <p className="text-gray-600 leading-relaxed mb-6">
            <strong>Why it works:</strong> Specifies the profession, visual style, and exact pages needed. The AI knows what content to generate for each page.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">2. The Local Business</h2>
          <div className="bg-gray-50 rounded-xl p-6 mb-6">
            <p className="text-gray-700 italic">&ldquo;Website for a coffee shop called Morning Brew in Brooklyn. Warm, inviting colors. Include our menu with coffee and pastries, our story (family-owned since 2015), location with hours, and a gallery of the space.&rdquo;</p>
          </div>
          <p className="text-gray-600 leading-relaxed mb-6">
            <strong>Why it works:</strong> Gives the business name, location, vibe, and specific pages. The AI can generate realistic menu items and backstory.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">3. The SaaS Landing</h2>
          <div className="bg-gray-50 rounded-xl p-6 mb-6">
            <p className="text-gray-700 italic">&ldquo;Landing page for an AI writing tool called WriteBot. Modern, clean design with blue accents. Hero section with headline and demo video placeholder, features section (3-4 key features), pricing table with free and pro tiers, testimonials, and FAQ.&rdquo;</p>
          </div>
          <p className="text-gray-600 leading-relaxed mb-6">
            <strong>Why it works:</strong> Describes the product type, specifies sections, and mentions the design direction. Perfect for startup MVPs.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">4. The Freelancer</h2>
          <div className="bg-gray-50 rounded-xl p-6 mb-6">
            <p className="text-gray-700 italic">&ldquo;Personal website for a freelance copywriter. Minimal and elegant. Homepage with a strong headline and brief intro, services page with my offerings and rates, portfolio with 4-5 sample projects, about page, and a blog.&rdquo;</p>
          </div>
          <p className="text-gray-600 leading-relaxed mb-6">
            <strong>Why it works:</strong> Professional context + style preference + specific page structure. Requesting a blog means content marketing is built in.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">5. The Event Page</h2>
          <div className="bg-gray-50 rounded-xl p-6 mb-6">
            <p className="text-gray-700 italic">&ldquo;Wedding website for Sarah & Mike, getting married June 15, 2026 in Napa Valley. Romantic, elegant design with soft colors. Include our story, event details with venue info, accommodation suggestions, RSVP info, and a photo gallery.&rdquo;</p>
          </div>
          <p className="text-gray-600 leading-relaxed mb-6">
            <strong>Why it works:</strong> Names, date, location, and mood are all specified. The AI generates appropriate romantic content.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">6. The Developer Portfolio</h2>
          <div className="bg-gray-50 rounded-xl p-6 mb-6">
            <p className="text-gray-700 italic">&ldquo;Portfolio for a full-stack developer. Dark mode, monospace accents, terminal-inspired design. Projects page with GitHub links, skills section with tech stack, about page with my journey into coding, blog for technical articles, and contact with email.&rdquo;</p>
          </div>
          <p className="text-gray-600 leading-relaxed mb-6">
            <strong>Why it works:</strong> Very specific visual style that matches the developer aesthetic. Includes all the right sections for a tech portfolio.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">7. The Course Creator</h2>
          <div className="bg-gray-50 rounded-xl p-6 mb-6">
            <p className="text-gray-700 italic">&ldquo;Website for an online photography course called Master Your Camera. Professional, inspiring design. Landing page with course overview and benefits, curriculum breakdown, instructor bio, testimonials from past students, and pricing with enrollment button.&rdquo;</p>
          </div>
          <p className="text-gray-600 leading-relaxed mb-6">
            <strong>Why it works:</strong> Clear course name, specific sections that build trust and encourage enrollment.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">8. The Artist Showcase</h2>
          <div className="bg-gray-50 rounded-xl p-6 mb-6">
            <p className="text-gray-700 italic">&ldquo;Portfolio for a digital illustrator. White background to let the art pop, minimal UI. Full-screen gallery grid on homepage, about page with artistic statement, commissions page with pricing and process, and contact form.&rdquo;</p>
          </div>
          <p className="text-gray-600 leading-relaxed mb-6">
            <strong>Why it works:</strong> Explicitly prioritizes the artwork with minimal distraction. Includes commercial info for potential clients.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">9. The Consultant</h2>
          <div className="bg-gray-50 rounded-xl p-6 mb-6">
            <p className="text-gray-700 italic">&ldquo;Website for a business consultant specializing in startup growth. Professional, trustworthy design with navy blue. Homepage with value proposition, services page with 4 consulting packages, case studies with results, about page with credentials, and booking/contact page.&rdquo;</p>
          </div>
          <p className="text-gray-600 leading-relaxed mb-6">
            <strong>Why it works:</strong> B2B tone established, specific color choice, and all the trust-building sections needed.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">10. The Personal Brand</h2>
          <div className="bg-gray-50 rounded-xl p-6 mb-6">
            <p className="text-gray-700 italic">&ldquo;Personal website for a tech content creator. Fun, energetic design with bold colors. Homepage with intro and latest content, about page with my story, blog for articles, speaking page for events, and links to social media.&rdquo;</p>
          </div>
          <p className="text-gray-600 leading-relaxed mb-6">
            <strong>Why it works:</strong> Matches the energy of a content creator, includes all platforms where they&apos;re active.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Key Takeaways</h2>
          <ul className="list-disc pl-6 mb-6 text-gray-600 space-y-2">
            <li><strong>Be specific about style:</strong> &ldquo;dark theme&rdquo;, &ldquo;minimal&rdquo;, &ldquo;warm colors&rdquo; — the AI understands these.</li>
            <li><strong>List your pages:</strong> Don&apos;t make the AI guess. Say exactly what pages you want.</li>
            <li><strong>Give context:</strong> What&apos;s the business? Who&apos;s it for? What&apos;s the goal?</li>
            <li><strong>Request a blog if you need one:</strong> It&apos;s built in, just ask for it.</li>
            <li><strong>Don&apos;t overthink:</strong> You can always refine after. Start with a solid prompt and iterate.</li>
          </ul>

          <div className="bg-blue-50 rounded-xl p-8 text-center mt-10">
            <h3 className="font-bold text-xl text-gray-900 mb-3">Try these prompts yourself</h3>
            <p className="text-gray-600 mb-4">Copy any prompt above, paste it into the bot, and see the magic.</p>
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
