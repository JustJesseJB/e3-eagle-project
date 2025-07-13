'use client';
import { useState, useEffect } from 'react';
import { TerminalProvider } from '@/contexts/TerminalContext';
import { WalletContextProvider } from '@/contexts/WalletContext';
import Terminal from '@/components/terminal/Terminal';
import '@/styles/terminal.css';

export default function Home() {
  const [isClient, setIsClient] = useState(false);
  
  // This ensures hydration mismatch doesn't occur
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  if (!isClient) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-green-500">
        Initializing Terminal...
      </div>
    );
  }
  
  return (
    <WalletContextProvider>
      <TerminalProvider>
        <div className="min-h-screen bg-black crt-effect">
          <Terminal />
          <div className="scanline"></div>
        </div>
      </TerminalProvider>
    </WalletContextProvider>
  );
}