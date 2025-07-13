// src/components/terminal/TerminalOutput.tsx

'use client';
import { forwardRef } from 'react';
import { TerminalEntry } from '@/contexts/TerminalContext';

interface TerminalOutputProps {
  history: TerminalEntry[];
  glitchEffect?: boolean;
}

// Forward ref to access the DOM element for auto-scrolling
const TerminalOutput = forwardRef<HTMLDivElement, TerminalOutputProps>(
  function TerminalOutput({ history, glitchEffect }, ref) {
    return (
      <div 
        ref={ref}
        className="flex-1 p-4 overflow-y-auto terminal-bg relative"
        style={{ 
          background: 'linear-gradient(rgba(0,20,0,0.7), rgba(0,10,0,0.7))',
          boxShadow: 'inset 0 0 30px rgba(0,50,0,0.3)',
          textShadow: '0 0 5px rgba(0,255,0,0.5)',
          minHeight: '200px'
        }}
      >
        {/* Initial boot sequence */}
        <div className="text-gray-500 mb-2">
          <p>Initializing E3 Terminal...</p>
          <p>BIOS v1.0.3 loaded</p>
          <p>Checking system integrity... OK</p>
          <p>Loading security protocols... OK</p>
          <p>Establishing blockchain connection... OK</p>
          <p>Initializing Solana interface... OK</p>
          <p className="text-yellow-400 mt-2">E3 TERMINAL READY</p>
          <p>Type <span className="text-white">/help</span> for available commands</p>
        </div>
        
        {/* Terminal history */}
        <div>
          {history.map((entry, i) => (
            <div 
              key={i} 
              className={`
                ${entry.type === 'input' ? 'text-white' : ''}
                ${entry.type === 'system' ? 'text-green-400' : ''}
                ${entry.type === 'error' ? 'text-red-400' : ''}
                ${entry.type === 'warning' ? 'text-yellow-400' : ''}
                ${entry.type === 'success' ? 'text-cyan-400' : ''}
                ${entry.type === 'command' ? 'text-purple-400' : ''}
                ${entry.type === 'data' ? 'text-gray-400' : ''}
                ${entry.type === 'glitch' ? 'text-red-500 glitch-text' : ''}
                ${entry.type === 'hidden' ? 'text-gray-900 hover:text-gray-500 cursor-help' : ''}
                ${entry.eagleId ? 'cursor-pointer hover:bg-green-900/20' : ''}
                mb-1
              `}
              data-eagle-id={entry.eagleId}
            >
              {entry.text}
            </div>
          ))}
        </div>
      </div>
    );
  }
);

export default TerminalOutput;