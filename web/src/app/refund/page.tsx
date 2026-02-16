import Link from 'next/link';

export const metadata = {
  title: 'Refund Policy — Chat to Website',
  description: 'Refund Policy for Chat to Website by The Yencee Labs',
};

export default function RefundPage() {
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
          <h1 className="text-4xl font-semibold text-black mb-4">Refund Policy</h1>
          <p className="text-gray-500">Effective Date: February 2026</p>
        </header>

        <div className="prose prose-gray max-w-none text-gray-600 space-y-8">
          <p>
            We want you to be satisfied with Chat to Website. This policy outlines 
            the conditions under which we offer refunds.
          </p>

          <section>
            <h2 className="text-2xl font-semibold text-black mb-4">Eligibility</h2>
            <p>You may request a refund if:</p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Your request is made within 7 days of purchase</li>
              <li>You have used less than 50% of purchased credits</li>
              <li>Technical issues prevented you from using the service</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-black mb-4">Non-Refundable</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Purchases made more than 7 days ago</li>
              <li>Credits that have been substantially used (50%+)</li>
              <li>Free credits or promotional offers</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-black mb-4">How to Request</h2>
            <ol className="list-decimal pl-6 space-y-2">
              <li>
                Email us at{' '}
                <a href="mailto:support@yenceelabs.com" className="text-black underline">
                  support@yenceelabs.com
                </a>
              </li>
              <li>Include your Telegram username or email</li>
              <li>Provide your transaction/order ID</li>
              <li>Explain the reason for your request</li>
            </ol>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-black mb-4">Processing</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>We respond within 2 business days</li>
              <li>Approved refunds processed within 5-10 business days</li>
              <li>Refunds go to the original payment method</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-black mb-4">Contact</h2>
            <p>
              Questions? Contact us at:{' '}
              <a href="mailto:support@yenceelabs.com" className="text-black underline">
                support@yenceelabs.com
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
