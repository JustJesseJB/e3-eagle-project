import type { Metadata, Viewport } from 'next';
import { GeistMono } from 'geist/font/mono';
import './globals.css';

export const metadata: Metadata = {
  title: 'E3 Eagle Terminal',
  description: 'Interactive terminal interface for the E3 Eagle NFT project on Solana',
  icons: {
    icon: '/favicon.ico',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${GeistMono.variable}`}>
      <body className="bg-black text-green-400 font-mono">
        {children}
      </body>
    </html>
  );
}