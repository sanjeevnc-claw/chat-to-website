import Link from 'next/link';

const posts = [
  {
    slug: 'how-to-build-portfolio-in-60-seconds',
    title: 'How to Build a Portfolio Website in 60 Seconds',
    description: 'A step-by-step guide to creating a stunning portfolio using just chat.',
    date: '2026-02-15',
    readTime: '3 min read',
    gradient: 'from-blue-500 to-purple-600',
  },
  {
    slug: 'multi-page-websites-launch',
    title: 'Introducing Multi-Page Websites & Built-in Blogs',
    description: 'Our biggest update yet: create complete websites with multiple pages and a blog.',
    date: '2026-02-14',
    readTime: '4 min read',
    gradient: 'from-green-500 to-teal-600',
  },
  {
    slug: 'best-prompts-for-ai-websites',
    title: '10 Prompts to Get the Perfect AI-Generated Website',
    description: 'Master the art of describing your website for the best results.',
    date: '2026-02-12',
    readTime: '5 min read',
    gradient: 'from-orange-500 to-red-600',
  },
  {
    slug: 'why-chat-to-website',
    title: 'Why We Built Chat to Website',
    description: 'The story behind the simplest way to build and deploy a website.',
    date: '2026-02-10',
    readTime: '6 min read',
    gradient: 'from-pink-500 to-rose-600',
  },
];

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <section className="max-w-4xl mx-auto px-6 pt-16 pb-12">
        <Link href="/" className="text-blue-600 hover:text-blue-700 text-sm font-medium mb-6 inline-block">
          ← Back to Home
        </Link>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Blog</h1>
        <p className="text-xl text-gray-500">
          Tips, tutorials, and updates from the Chat to Website team.
        </p>
      </section>

      {/* Posts Grid */}
      <section className="max-w-4xl mx-auto px-6 pb-20">
        <div className="grid md:grid-cols-2 gap-8">
          {posts.map((post) => (
            <article key={post.slug} className="group">
              <Link href={`/blog/${post.slug}`}>
                <div className={`bg-gradient-to-br ${post.gradient} rounded-xl h-48 mb-4 group-hover:opacity-90 transition`}></div>
                <div className="flex items-center gap-3 text-sm text-gray-400 mb-2">
                  <span>{new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                  <span>·</span>
                  <span>{post.readTime}</span>
                </div>
                <h2 className="font-semibold text-gray-900 text-xl mb-2 group-hover:text-blue-600 transition">
                  {post.title}
                </h2>
                <p className="text-gray-500">{post.description}</p>
              </Link>
            </article>
          ))}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Stay updated</h2>
          <p className="text-gray-500 mb-6">
            Get notified when we publish new posts and release new features.
          </p>
          <a
            href="https://t.me/Chat2WebsiteNC_bot"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
          >
            Follow on Telegram
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8 text-center text-sm text-gray-400">
        <Link href="/" className="hover:text-gray-600">Chat to Website</Link>
        {' · '}
        Built by <a href="https://sanjeevnc.com" className="underline hover:text-gray-600">Sanjeev NC</a>
      </footer>
    </main>
  );
}
