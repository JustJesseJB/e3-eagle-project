'use client';
import { useState, useEffect } from 'react';

interface TerminalStatusBarProps {
  connected: boolean;
}

export default function TerminalStatusBar({ connected }: TerminalStatusBarProps) {
  const [currentTime, setCurrentTime] = useState('');
  
  // Update the time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  return (
    <div className="bg-gray-900 border-t border-green-500/30 p-1 text-xs text-gray-500 flex justify-between">
      <div>
        <span className="mr-3">STATUS: {connected ? 'CONNECTED' : 'DISCONNECTED'}</span>
      </div>
      <div>
        ACCESS LEVEL: {connected ? 'USER' : 'GUEST'}
      </div>
      <div>
        E3-TERM // {currentTime}
      </div>
    </div>
  );
}