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
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin w-6 h-6 border-2 border-black border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 sticky top-0 z-50 bg-white">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="font-semibold text-black hover:text-gray-600 transition">
            Chat to Website
          </Link>

          <div className="flex items-center gap-4">
            {/* Credits indicator */}
            <button
              onClick={() => setShowStore(!showStore)}
              className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-md transition text-sm"
            >
              <span className="font-medium text-black">{credits}</span>
              <span className="text-gray-500">credits</span>
            </button>

            <button
              onClick={() => setShowStore(!showStore)}
              className="bg-black text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-900 transition"
            >
              Buy Credits
            </button>

            <a
              href="https://t.me/Chat2WebsiteNC_bot"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-black text-sm transition hidden md:block"
            >
              Use Telegram →
            </a>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-5xl mx-auto px-6 py-6">
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
            <div className="w-80 flex-shrink-0 hidden md:block">
              <CreditStore
                sessionId={sessionId}
                onPurchaseComplete={(newCredits) => {
                  handleCreditsChange(newCredits);
                  setShowStore(false);
                }}
              />

              <div className="mt-4 p-4 border border-gray-200 rounded-lg">
                <h4 className="font-medium text-black mb-2">Free trial</h4>
                <p className="text-sm text-gray-600">
                  You get 5 free credits to try. Each message costs 1 credit.
                </p>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Mobile credit store modal */}
      {showStore && (
        <div className="fixed inset-0 bg-black/30 z-50 md:hidden" onClick={() => setShowStore(false)}>
          <div
            className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl p-6 max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-1 bg-gray-200 rounded-full mx-auto mb-6" />
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
