export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center max-w-xl px-6">
        <h1 className="text-4xl font-bold mb-4">Chat to Website</h1>
        <p className="text-lg text-gray-600 mb-8">
          Describe your website in Telegram. Get it live in 60 seconds.
        </p>
        <a
          href="https://t.me/chattowebsite_bot"
          className="inline-block bg-black text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-gray-800 transition"
        >
          Start Building →
        </a>
        <p className="mt-6 text-sm text-gray-400">No signup. No code. Just chat.</p>
      </div>
    </main>
  );
}
