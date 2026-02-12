'use client';

import { useState } from 'react';
import ChatWindow from '@/components/chat/ChatWindow';

export default function Home() {
  const [showPreview, setShowPreview] = useState(false);
  const [previewCode, setPreviewCode] = useState<string>('');

  return (
    <main className="h-screen flex">
      {/* Chat - takes full width or left side */}
      <div className={`flex flex-col ${showPreview ? 'w-1/2 border-r border-gray-200' : 'w-full'}`}>
        <ChatWindow onCodeGenerated={setPreviewCode} />
      </div>

      {/* Preview toggle button - fixed on right edge */}
      <button
        onClick={() => setShowPreview(!showPreview)}
        className="fixed right-4 top-4 z-50 px-3 py-1.5 text-sm border border-gray-300 rounded hover:bg-gray-100 bg-white"
      >
        {showPreview ? 'Hide Preview' : 'Show Preview'}
      </button>

      {/* Preview panel */}
      {showPreview && (
        <div className="w-1/2 flex flex-col bg-gray-50">
          <div className="p-3 border-b border-gray-200 text-sm text-gray-500">
            Preview
          </div>
          <div className="flex-1 p-4">
            {previewCode ? (
              <iframe
                srcDoc={previewCode}
                className="w-full h-full border border-gray-200 rounded bg-white"
                sandbox="allow-scripts"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                Start chatting to see your website here
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
