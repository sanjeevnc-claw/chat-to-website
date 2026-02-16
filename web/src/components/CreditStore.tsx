'use client';

import { useState, useEffect } from 'react';

interface CreditPackage {
  id: string;
  credits: number;
  priceUSD: number;
  priceINR: number;
  displayUSD: string;
  displayINR: string;
  popular?: boolean;
}

const PACKAGES: CreditPackage[] = [
  { id: 'starter', credits: 50, priceUSD: 5, priceINR: 400, displayUSD: '$5', displayINR: '₹400' },
  { id: 'builder', credits: 200, priceUSD: 15, priceINR: 1200, displayUSD: '$15', displayINR: '₹1,200', popular: true },
  { id: 'pro', credits: 500, priceUSD: 30, priceINR: 2400, displayUSD: '$30', displayINR: '₹2,400' },
];

interface CreditStoreProps {
  sessionId: string;
  onPurchaseComplete?: (newCredits: number) => void;
}

export default function CreditStore({ sessionId, onPurchaseComplete }: CreditStoreProps) {
  const [isIndia, setIsIndia] = useState(false);
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Detect location for payment provider selection
    const detectLocation = async () => {
      try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        setIsIndia(data.country_code === 'IN');
      } catch {
        // Default to global (Stripe)
        setIsIndia(false);
      }
    };
    detectLocation();
  }, []);

  const handlePurchase = async (pkg: CreditPackage) => {
    setIsLoading(pkg.id);
    setError(null);

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          packageId: pkg.id,
          provider: isIndia ? 'dodo' : 'stripe',
        }),
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      // Redirect to checkout URL
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start checkout');
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
      <h3 className="font-bold text-lg text-gray-900 mb-2">Buy Credits</h3>
      <p className="text-sm text-gray-500 mb-6">
        Each message costs 1 credit. Credits never expire.
      </p>

      {/* Location indicator */}
      <div className="flex items-center gap-2 mb-6 text-xs">
        <span className="text-gray-400">Paying from:</span>
        <button
          onClick={() => setIsIndia(false)}
          className={`px-3 py-1 rounded-full transition ${
            !isIndia ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'
          }`}
        >
          🌍 Global
        </button>
        <button
          onClick={() => setIsIndia(true)}
          className={`px-3 py-1 rounded-full transition ${
            isIndia ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
          }`}
        >
          🇮🇳 India
        </button>
      </div>

      {/* Packages */}
      <div className="space-y-3">
        {PACKAGES.map((pkg) => (
          <div
            key={pkg.id}
            className={`relative flex items-center justify-between p-4 rounded-xl border-2 transition ${
              pkg.popular
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            {pkg.popular && (
              <span className="absolute -top-2 left-4 bg-blue-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                BEST VALUE
              </span>
            )}

            <div>
              <p className="font-semibold text-gray-900">{pkg.credits} Credits</p>
              <p className="text-sm text-gray-500">
                {isIndia ? pkg.displayINR : pkg.displayUSD}
                <span className="text-gray-400 ml-1">
                  ({isIndia
                    ? `₹${(pkg.priceINR / pkg.credits).toFixed(1)}`
                    : `$${(pkg.priceUSD / pkg.credits).toFixed(2)}`}/credit)
                </span>
              </p>
            </div>

            <button
              onClick={() => handlePurchase(pkg)}
              disabled={isLoading === pkg.id}
              className={`px-5 py-2 rounded-lg font-medium transition ${
                pkg.popular
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-900 text-white hover:bg-gray-800'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isLoading === pkg.id ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                </span>
              ) : (
                'Buy'
              )}
            </button>
          </div>
        ))}
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          {error}
        </div>
      )}

      <p className="text-xs text-gray-400 mt-6 text-center">
        Secure payment via {isIndia ? 'Dodo Payments (UPI, Cards)' : 'Stripe'}
      </p>
    </div>
  );
}
