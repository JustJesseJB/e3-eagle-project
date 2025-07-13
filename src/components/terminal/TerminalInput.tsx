// src/components/terminal/TerminalInput.tsx

'use client';
import { useState, KeyboardEvent, forwardRef } from 'react';

interface TerminalInputProps {
  onSubmit: (input: string) => void;
  isReady?: boolean;
}

const TerminalInput = forwardRef<HTMLInputElement, TerminalInputProps>(
  function TerminalInput({ onSubmit, isReady = true }, ref) {
    const [input, setInput] = useState('');
    const [commandHistory, setCommandHistory] = useState<string[]>([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    
    // Handle form submission
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      
      if (input.trim()) {
        // Add to command history
        setCommandHistory(prev => [input, ...prev].slice(0, 50)); // Keep last 50 commands
        
        // Pass to parent component
        onSubmit(input);
        
        // Clear input
        setInput('');
        setHistoryIndex(-1);
      }
    };
    
    // Handle keyboard navigation for command history
    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        
        // Navigate up through command history
        if (historyIndex < commandHistory.length - 1) {
          const newIndex = historyIndex + 1;
          setHistoryIndex(newIndex);
          setInput(commandHistory[newIndex]);
        }
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        
        // Navigate down through command history
        if (historyIndex > 0) {
          const newIndex = historyIndex - 1;
          setHistoryIndex(newIndex);
          setInput(commandHistory[newIndex]);
        } else if (historyIndex === 0) {
          // Return to empty input
          setHistoryIndex(-1);
          setInput('');
        }
      } else if (e.key === 'Tab') {
        e.preventDefault();
        
        // Basic command auto-completion
        const basicCommands = [
          '/help', '/clear', '/connect', '/mint', 
          '/assets', '/chat', '/socials', '/marketplace',
          '/scan', '/inspect', '/classified'
        ];
        
        if (input.startsWith('/')) {
          const matches = basicCommands.filter(cmd => 
            cmd.startsWith(input) && cmd !== input
          );
          
          if (matches.length === 1) {
            setInput(matches[0]);
          }
        }
      }
    };
    
    return (
      <form onSubmit={handleSubmit} className="border-t border-green-800/50 p-2 backdrop-blur-sm">
        <div className="flex items-center">
          <span className="text-green-500 mr-2">&gt;</span>
          <input
            ref={ref}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent text-white focus:outline-none"
            placeholder="Enter command..."
            autoFocus
            disabled={!isReady}
          />
        </div>
      </form>
    );
  }
);

export default TerminalInput;