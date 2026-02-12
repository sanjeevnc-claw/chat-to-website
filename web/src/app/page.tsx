'use client';

import ChatWindow from '@/components/chat/ChatWindow';

export default function Home() {
  return (
    <main className="h-screen flex">
      <div className="flex flex-col w-full">
        <ChatWindow />
      </div>
    </main>
  );
}
