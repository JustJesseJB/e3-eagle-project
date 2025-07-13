'use client';
import { forwardRef } from 'react';
import { TerminalEntry } from '@/contexts/TerminalContext';

interface TerminalOutputProps {
  history: TerminalEntry[];
}

// Forward ref to access the DOM element for auto-scrolling
const TerminalOutput = forwardRef<HTMLDivElement, TerminalOutputProps>(
  function TerminalOutput({ history }, ref) {
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
    );
  }
);

export default TerminalOutput;