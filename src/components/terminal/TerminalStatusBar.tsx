'use client';
import { useState, useEffect } from 'react';

interface TerminalStatusBarProps {
  connected: boolean;
  accessLevel: number;
  walletAddress: string | null;
}

export default function TerminalStatusBar({ connected, accessLevel, walletAddress }: TerminalStatusBarProps) {
  const [currentTime, setCurrentTime] = useState('');
  
  // Update the time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  const getAccessLevelText = () => {
    switch(accessLevel) {
      case 0: return 'GUEST';
      case 1: return 'INITIATE';
      case 2: return 'OPERATIVE';
      default: return 'GUEST';
    }
  };
  
  return (
    <div className="bg-gray-900 border-t border-green-500/30 p-1 text-xs text-gray-500 flex justify-between">
      <div>
        <span className="mr-3">STATUS: {connected ? 'CONNECTED' : 'DISCONNECTED'}</span>
        {connected && walletAddress && <span className="hidden sm:inline">WALLET: {walletAddress}</span>}
      </div>
      <div>
        ACCESS LEVEL: {getAccessLevelText()}
      </div>
      <div className="hidden sm:block">
        E3-TERM // {currentTime}
      </div>
    </div>
  );
}