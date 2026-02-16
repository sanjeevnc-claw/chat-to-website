'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import WebChat from '@/components/WebChat';
import CreditStore from '@/components/CreditStore';

// Generate a random session ID for guest users
function generateSessionId() {
  return 'web_' + Math.random().toString(36).substring(2, 15);
}

export default function TryPage() {
  const [sessionId, setSessionId] = useState<string>('');
  const [credits, setCredits] = useState(5); // Free credits for trial
  const [showStore, setShowStore] = useState(false);

  useEffect(() => {
    // Get or create session ID from localStorage
    const storedSessionId = localStorage.getItem('c2w_session_id');
    const storedCredits = localStorage.getItem('c2w_credits');

    if (storedSessionId) {
      setSessionId(storedSessionId);
    } else {
      const newSessionId = generateSessionId();
      localStorage.setItem('c2w_session_id', newSessionId);
      setSessionId(newSessionId);
    }

    if (storedCredits) {
      setCredits(parseInt(storedCredits, 10));
    } else {
      localStorage.setItem('c2w_credits', '5');
    }
  }, []);

  const handleCreditsChange = (newCredits: number) => {
    setCredits(newCredits);
    localStorage.setItem('c2w_credits', newCredits.toString());
  };

  if (!sessionId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold text-gray-900">Chat to Website</span>
          </Link>

          <div className="flex items-center gap-4">
            {/* Credits indicator */}
            <button
              onClick={() => setShowStore(!showStore)}
              className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-full transition"
            >
              <span className="text-lg">🪙</span>
              <span className="font-semibold text-gray-900">{credits}</span>
              <span className="text-gray-500 text-sm">credits</span>
            </button>

            <button
              onClick={() => setShowStore(!showStore)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition"
            >
              Buy Credits
            </button>

            <a
              href="https://t.me/Chat2WebsiteNC_bot"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-gray-700 text-sm"
            >
              Use Telegram instead →
            </a>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Chat section */}
          <div className="flex-1">
            <div className="h-[calc(100vh-140px)]">
              <WebChat
                sessionId={sessionId}
                credits={credits}
                onCreditsChange={handleCreditsChange}
              />
            </div>
          </div>

          {/* Credit store sidebar (toggle on mobile) */}
          {showStore && (
            <div className="w-80 flex-shrink-0">
              <CreditStore
                sessionId={sessionId}
                onPurchaseComplete={(newCredits) => {
                  handleCreditsChange(newCredits);
                  setShowStore(false);
                }}
              />

              <div className="mt-4 p-4 bg-blue-50 rounded-xl">
                <h4 className="font-semibold text-blue-900 mb-2">💡 Free trial</h4>
                <p className="text-sm text-blue-700">
                  You get 5 free credits to try. Each message costs 1 credit.
                  Buy more when you need them!
                </p>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Mobile credit store modal */}
      {showStore && (
        <div className="fixed inset-0 bg-black/50 z-50 md:hidden" onClick={() => setShowStore(false)}>
          <div
            className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6 max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-4" />
            <CreditStore
              sessionId={sessionId}
              onPurchaseComplete={(newCredits) => {
                handleCreditsChange(newCredits);
                setShowStore(false);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
