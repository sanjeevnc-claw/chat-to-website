'use client';

import { useState } from 'react';
import { ChatWindow } from '@/components/chat/ChatWindow';
import { Sparkles, ArrowRight, Globe, Zap, CreditCard } from 'lucide-react';

export default function Home() {
  const [started, setStarted] = useState(false);

  if (started) {
    return <ChatWindow />;
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center max-w-3xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8">
            <Sparkles className="w-4 h-4" />
            AI-Powered Website Builder
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-4 sm:mb-6 px-2">
            Build your website
            <span className="text-primary"> by chatting</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl text-muted-foreground mb-8 sm:mb-12 max-w-2xl mx-auto px-4">
            Describe your business, get a professional website. 
            No coding required. No design skills needed. 
            Just have a conversation.
          </p>

          {/* CTA Button */}
          <button
            onClick={() => setStarted(true)}
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-lg font-semibold text-lg hover:bg-primary/90 transition-colors shadow-lg shadow-primary/25"
          >
            Start Building
            <ArrowRight className="w-5 h-5" />
          </button>

          {/* Trust text */}
          <p className="text-sm text-muted-foreground mt-4">
            Free to start • No credit card required
          </p>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mt-24 max-w-4xl mx-auto">
          <div className="text-center p-6">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">AI-Powered Design</h3>
            <p className="text-muted-foreground text-sm">
              Describe what you want. Our AI creates a beautiful, professional website tailored to your business.
            </p>
          </div>

          <div className="text-center p-6">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Zap className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">Instant Preview</h3>
            <p className="text-muted-foreground text-sm">
              See your website come to life in seconds. Make changes by simply asking. Deploy when ready.
            </p>
          </div>

          <div className="text-center p-6">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Globe className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">Custom Domain</h3>
            <p className="text-muted-foreground text-sm">
              Get your own domain with one click. We handle everything - registration, DNS, SSL. All automatic.
            </p>
          </div>
        </div>

        {/* How it works */}
        <div className="mt-24 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-12">How it works</h2>
          
          <div className="space-y-6">
            <div className="flex gap-4 items-start">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold shrink-0">
                1
              </div>
              <div>
                <h3 className="font-semibold mb-1">Describe your business</h3>
                <p className="text-muted-foreground text-sm">
                  Tell us about your business, upload your logo, and share any websites you like for inspiration.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold shrink-0">
                2
              </div>
              <div>
                <h3 className="font-semibold mb-1">Review and refine</h3>
                <p className="text-muted-foreground text-sm">
                  Get an instant preview. Ask for any changes - "make the header darker", "add a contact form" - and watch it update.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold shrink-0">
                3
              </div>
              <div>
                <h3 className="font-semibold mb-1">Go live</h3>
                <p className="text-muted-foreground text-sm">
                  Deploy your website with one click. Add a custom domain if you want. You're live in minutes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t py-8 mt-24">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2026 Stitchflow. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
