import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Chat to Website',
  description: 'Build websites through conversation',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
