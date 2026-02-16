import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy — Chat to Website',
  description: 'Privacy Policy for Chat to Website by The Yencee Labs',
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-white">
      <nav className="border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-6 py-4">
          <Link href="/" className="font-semibold text-black hover:opacity-70 transition">
            ← Chat to Website
          </Link>
        </div>
      </nav>

      <article className="max-w-3xl mx-auto px-6 py-16">
        <header className="mb-12">
          <h1 className="text-4xl font-semibold text-black mb-4">Privacy Policy</h1>
          <p className="text-gray-500">Effective Date: February 2026</p>
        </header>

        <div className="prose prose-gray max-w-none text-gray-600 space-y-8">
          <p>
            Chat to Website ("we," "our," or "us"), a product by The Yencee Labs, is committed 
            to protecting your privacy. This Privacy Policy explains how we collect, use, 
            disclose, and safeguard your information.
          </p>

          <section>
            <h2 className="text-2xl font-semibold text-black mb-4">Information We Collect</h2>
            <h3 className="text-lg font-medium text-black mb-2">Information You Provide</h3>
            <ul className="list-disc pl-6 space-y-1">
              <li>Telegram user information when you interact with our bot</li>
              <li>Website content you describe and create</li>
              <li>Payment information (processed securely via Stripe/Dodo Payments)</li>
            </ul>
            <h3 className="text-lg font-medium text-black mb-2 mt-4">Automatic Information</h3>
            <ul className="list-disc pl-6 space-y-1">
              <li>Usage data and analytics</li>
              <li>Device and browser information</li>
              <li>IP address</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-black mb-4">How We Use Your Information</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>To provide and maintain our website building service</li>
              <li>To process transactions and manage credits</li>
              <li>To improve our AI and service quality</li>
              <li>To communicate service updates</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-black mb-4">Data Sharing</h2>
            <p>We do not sell your personal information. We may share data with:</p>
            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li><strong>Vercel:</strong> Website hosting</li>
              <li><strong>Stripe/Dodo:</strong> Payment processing</li>
              <li><strong>Supabase:</strong> Database services</li>
              <li><strong>Anthropic:</strong> AI services</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-black mb-4">Your Rights</h2>
            <p>You have the right to access, correct, or delete your data. Contact us at privacy@yenceelabs.com.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-black mb-4">Contact Us</h2>
            <p>
              Questions? Contact us at:{' '}
              <a href="mailto:privacy@yenceelabs.com" className="text-black underline">
                privacy@yenceelabs.com
              </a>
            </p>
          </section>
        </div>
      </article>

      <footer className="border-t border-gray-200 py-8">
        <div className="max-w-3xl mx-auto px-6 text-center text-sm text-gray-500">
          <div className="flex justify-center gap-6 mb-4">
            <Link href="/privacy" className="hover:text-black transition">Privacy</Link>
            <Link href="/terms" className="hover:text-black transition">Terms</Link>
            <Link href="/refund" className="hover:text-black transition">Refunds</Link>
          </div>
          <p>© {new Date().getFullYear()} The Yencee Labs. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
