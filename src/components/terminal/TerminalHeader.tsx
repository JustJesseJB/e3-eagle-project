// src/components/terminal/TerminalHeader.tsx

'use client';

interface TerminalHeaderProps {
  glitchEffect: boolean;
  connected: boolean;
}

export default function TerminalHeader({ glitchEffect, connected }: TerminalHeaderProps) {
  return (
    <div className="bg-gray-900 border-b border-green-500/30 p-2 flex justify-between items-center">
      <div className="flex items-center">
        <div className="w-8 h-8 bg-black border border-green-500 flex items-center justify-center mr-2">
          <span className="text-xs">E3</span>
        </div>
        <span className={`text-sm ${glitchEffect ? 'text-red-500' : ''}`}>EAGLE-TERM v0.3.7 [ALPHA]</span>
      </div>
      <div className="flex space-x-3">
        <div className={`w-3 h-3 rounded-full ${connected ? 'bg-green-500' : 'bg-red-500'}`}></div>
        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
        <div className="w-3 h-3 rounded-full bg-green-900"></div>
      </div>
    </div>
  );
}