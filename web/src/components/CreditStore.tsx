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
    <div className="border border-gray-200 rounded-lg p-6">
      <h3 className="font-semibold text-black mb-1">Buy Credits</h3>
      <p className="text-sm text-gray-500 mb-6">
        Each message costs 1 credit. Credits never expire.
      </p>

      {/* Location toggle */}
      <div className="flex items-center gap-2 mb-6 text-xs">
        <span className="text-gray-400">Region:</span>
        <button
          onClick={() => setIsIndia(false)}
          className={`px-3 py-1 rounded-md transition ${
            !isIndia ? 'bg-black text-white' : 'bg-gray-100 text-gray-600'
          }`}
        >
          Global
        </button>
        <button
          onClick={() => setIsIndia(true)}
          className={`px-3 py-1 rounded-md transition ${
            isIndia ? 'bg-black text-white' : 'bg-gray-100 text-gray-600'
          }`}
        >
          India
        </button>
      </div>

      {/* Packages */}
      <div className="space-y-3">
        {PACKAGES.map((pkg) => (
          <div
            key={pkg.id}
            className={`relative flex items-center justify-between p-4 rounded-lg border transition ${
              pkg.popular
                ? 'border-black'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            {pkg.popular && (
              <span className="absolute -top-2 left-4 bg-black text-white text-xs font-medium px-2 py-0.5 rounded">
                Best value
              </span>
            )}

            <div>
              <p className="font-medium text-black">{pkg.credits} Credits</p>
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
              className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                pkg.popular
                  ? 'bg-black text-white hover:bg-gray-900'
                  : 'border border-gray-200 text-black hover:border-gray-400'
              } disabled:opacity-50`}
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
        <div className="mt-4 p-3 border border-gray-200 rounded-md text-sm text-gray-600">
          {error}
        </div>
      )}

      <p className="text-xs text-gray-400 mt-6 text-center">
        Secure payment via {isIndia ? 'Dodo Payments' : 'Stripe'}
      </p>
    </div>
  );
}
