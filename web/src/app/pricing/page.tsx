import Link from 'next/link';

export const metadata = {
  title: 'Pricing | Chat to Website',
  description: 'Simple, transparent pricing. Start free, buy credits when you need more.',
};

const plans = [
  {
    name: 'Free',
    description: 'Perfect for trying it out',
    price: { usd: '$0', inr: '₹0' },
    credits: '20 credits',
    features: [
      '1 website',
      '20 updates included',
      'Multi-page support',
      'Blog included',
      'Voice messages',
      'Mobile responsive',
    ],
    cta: {
      text: 'Start Free',
      href: 'https://t.me/Chat2WebsiteNC_bot',
      external: true,
    },
    popular: false,
  },
  {
    name: 'Starter',
    description: 'For personal projects',
    price: { usd: '$5', inr: '₹400' },
    credits: '50 credits',
    features: [
      '50 credits to use anytime',
      'Unlimited websites',
      'All features included',
      'Priority support',
      'Credits never expire',
    ],
    cta: {
      text: 'Buy Starter',
      href: '/try?plan=starter',
      external: false,
    },
    popular: false,
  },
  {
    name: 'Builder',
    description: 'For freelancers & agencies',
    price: { usd: '$15', inr: '₹1,200' },
    credits: '200 credits',
    features: [
      '200 credits to use anytime',
      'Unlimited websites',
      'All features included',
      'Priority support',
      'Best value per credit',
      'Credits never expire',
    ],
    cta: {
      text: 'Buy Builder',
      href: '/try?plan=builder',
      external: false,
    },
    popular: true,
  },
  {
    name: 'Pro',
    description: 'For power users',
    price: { usd: '$30', inr: '₹2,400' },
    credits: '500 credits',
    features: [
      '500 credits to use anytime',
      'Unlimited websites',
      'All features included',
      'Priority support',
      'Bulk discount',
      'Credits never expire',
    ],
    cta: {
      text: 'Buy Pro',
      href: '/try?plan=pro',
      external: false,
    },
    popular: false,
  },
];

const creditUsage = [
  { action: 'Generate a new website', credits: 5 },
  { action: 'Add a new page', credits: 2 },
  { action: 'Update existing content', credits: 1 },
  { action: 'Write a blog post', credits: 3 },
  { action: 'Change design/theme', credits: 2 },
];

const faqs = [
  {
    q: 'What can I do with credits?',
    a: 'Credits power all your website actions: creating new sites, adding pages, updating content, writing blog posts, and changing designs. Each action costs a small number of credits.',
  },
  {
    q: 'Do credits expire?',
    a: 'No. Credits never expire. Buy once, use whenever you need them.',
  },
  {
    q: 'Can I buy more credits later?',
    a: 'Yes! You can purchase additional credit packs anytime. Credits stack on top of your existing balance.',
  },
  {
    q: 'What payment methods do you accept?',
    a: 'We accept all major credit cards via Stripe (global) and UPI/cards via Dodo Payments (India). We auto-detect your location and show the best option.',
  },
  {
    q: 'Is there a refund policy?',
    a: 'Yes. If you\'re not satisfied within 7 days of purchase and haven\'t used more than 20% of your credits, we\'ll refund you in full. See our refund policy for details.',
  },
  {
    q: 'Do I need to create an account?',
    a: 'No signup required! Your credits are linked to your Telegram account or browser session. Just start chatting.',
  },
];

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="font-semibold text-black hover:text-gray-600 transition">
            ← Chat to Website
          </Link>
          <Link
            href="/try"
            className="text-sm bg-black text-white px-4 py-2 rounded-md hover:bg-gray-900 transition"
          >
            Try Now
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 pt-16 pb-12">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-black mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Start free. Buy credits when you need more. No subscriptions, no surprises.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="max-w-5xl mx-auto px-6 pb-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-lg p-6 ${
                plan.popular
                  ? 'border-2 border-black bg-black text-white'
                  : 'border border-gray-200'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white text-black text-xs font-medium px-3 py-1 rounded-full border border-black">
                  Most Popular
                </div>
              )}
              
              <h3 className={`font-semibold text-lg mb-1 ${plan.popular ? 'text-white' : 'text-black'}`}>
                {plan.name}
              </h3>
              <p className={`text-sm mb-4 ${plan.popular ? 'text-gray-400' : 'text-gray-500'}`}>
                {plan.description}
              </p>
              
              <div className="mb-2">
                <span className={`text-3xl font-semibold ${plan.popular ? 'text-white' : 'text-black'}`}>
                  {plan.price.usd}
                </span>
                {plan.price.inr !== '₹0' && (
                  <span className={`text-sm ml-2 ${plan.popular ? 'text-gray-400' : 'text-gray-500'}`}>
                    / {plan.price.inr}
                  </span>
                )}
              </div>
              <p className={`text-sm mb-6 ${plan.popular ? 'text-gray-300' : 'text-gray-600'}`}>
                {plan.credits}
              </p>
              
              <ul className={`space-y-2 text-sm mb-6 ${plan.popular ? 'text-gray-300' : 'text-gray-600'}`}>
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <span className={plan.popular ? 'text-white' : 'text-black'}>→</span>
                    {feature}
                  </li>
                ))}
              </ul>
              
              {plan.cta.external ? (
                <a
                  href={plan.cta.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`block w-full text-center px-4 py-3 rounded-md font-medium transition ${
                    plan.popular
                      ? 'bg-white text-black hover:bg-gray-100'
                      : 'border border-gray-200 text-black hover:border-gray-400'
                  }`}
                >
                  {plan.cta.text}
                </a>
              ) : (
                <Link
                  href={plan.cta.href}
                  className={`block w-full text-center px-4 py-3 rounded-md font-medium transition ${
                    plan.popular
                      ? 'bg-white text-black hover:bg-gray-100'
                      : 'bg-black text-white hover:bg-gray-900'
                  }`}
                >
                  {plan.cta.text}
                </Link>
              )}
            </div>
          ))}
        </div>
        
        <p className="text-center text-gray-400 text-sm mt-6">
          🇮🇳 Indian users: Pay in INR via UPI or cards. We auto-detect your location.
        </p>
      </section>

      {/* Divider */}
      <div className="border-t border-gray-200" />

      {/* Credit Usage */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wide mb-8">
            How Credits Work
          </h2>
          
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-6 py-3 text-sm font-medium text-gray-900">Action</th>
                  <th className="text-right px-6 py-3 text-sm font-medium text-gray-900">Credits</th>
                </tr>
              </thead>
              <tbody>
                {creditUsage.map((item, index) => (
                  <tr key={item.action} className={index !== creditUsage.length - 1 ? 'border-b border-gray-100' : ''}>
                    <td className="px-6 py-4 text-gray-600">{item.action}</td>
                    <td className="px-6 py-4 text-right font-medium text-black">{item.credits}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <p className="text-gray-500 text-sm mt-4">
            Example: With 50 credits, you could create 10 websites, or 1 website with 45 updates.
          </p>
        </div>
      </section>

      {/* Divider */}
      <div className="border-t border-gray-200" />

      {/* FAQ */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wide mb-8">
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-6">
            {faqs.map((faq) => (
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

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-semibold text-black mb-4">
            Ready to build your website?
          </h2>
          <p className="text-gray-600 mb-8">
            Start with 20 free credits. No credit card required.
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
              <Link href="/" className="hover:text-black transition">Home</Link>
              <Link href="/blog" className="hover:text-black transition">Blog</Link>
              <a href="https://t.me/Chat2WebsiteNC_bot" target="_blank" rel="noopener noreferrer" className="hover:text-black transition">Telegram</a>
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
