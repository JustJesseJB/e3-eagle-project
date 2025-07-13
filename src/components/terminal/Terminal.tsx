'use client';
import { useEffect, useRef, useState } from 'react';
import { useTerminal } from '@/contexts/TerminalContext';
import { processCommandInput } from '@/lib/commands/commandProcessor';
import TerminalHeader from './TerminalHeader';
import TerminalOutput from './TerminalOutput';
import TerminalInput from './TerminalInput';
import TerminalStatusBar from './TerminalStatusBar';
import { registerAllCommands } from '@/lib/commands'; // Change to import the centralized registration

export default function Terminal() {
  const { 
    history, 
    addEntries, 
    clearTerminal,
    connected,
    glitchEffect
  } = useTerminal();
  
  const [isReady, setIsReady] = useState(false);
  const terminalRef = useRef<HTMLDivElement>(null);
  
  // Register commands on component mount
  useEffect(() => {
    console.log('Initializing terminal and registering all commands...');
    
    // Register all commands instead of just basic commands
    registerAllCommands();
    
    console.log('All commands registered successfully');
    setIsReady(true);
    
    // Display boot sequence
    const bootSequence = [
      { type: 'system' as const, text: 'Initializing E3 Terminal...' },
      { type: 'system' as const, text: 'BIOS v1.0.3 loaded' },
      { type: 'system' as const, text: 'Checking system integrity... OK' },
      { type: 'system' as const, text: 'Loading security protocols... OK' },
      { type: 'system' as const, text: 'Establishing blockchain connection... OK' },
      { type: 'system' as const, text: 'Initializing Solana interface... OK' },
      { type: 'warning' as const, text: 'E3 TERMINAL READY' },
      { type: 'system' as const, text: 'Type /help for available commands' }
    ];
    
    // Add boot sequence with a slight delay for effect
    setTimeout(() => {
      addEntries(bootSequence);
    }, 300);
  }, [addEntries]);
  
  // Auto-scroll terminal to bottom when new content is added
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);
  
  // Handle command submission
  const handleCommandSubmit = async (input: string) => {
    console.log('Processing command:', input); // Debug logging
    
    if (input.trim().toLowerCase() === '/clear' || input.trim().toLowerCase() === 'clear') {
      clearTerminal();
      return;
    }
    
    try {
      const commandResults = await processCommandInput(input);
      addEntries(commandResults);
    } catch (error) {
      console.error('Error processing command:', error);
      addEntries([
        { type: 'error', text: `Error processing command: ${(error as Error).message || 'Unknown error'}` }
      ]);
    }
  };
  
  // If not ready yet, show loading indicator
  if (!isReady) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-green-500">
        Initializing Terminal...
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-black text-green-400 font-mono flex flex-col">
      {/* Terminal header */}
      <TerminalHeader glitchEffect={glitchEffect} connected={connected} />
      
      {/* Main terminal container */}
      <div className="flex-1 p-2 md:p-4 flex flex-col md:flex-row gap-4 overflow-auto">
        {/* Main terminal */}
        <div className="flex-1 border border-green-500/30 bg-black rounded shadow-[0_0_15px_rgba(0,255,0,0.1)] backdrop-blur-sm overflow-hidden flex flex-col">
          {/* Terminal output */}
          <TerminalOutput ref={terminalRef} history={history} />
          
          {/* Terminal input */}
          <TerminalInput onSubmit={handleCommandSubmit} />
        </div>
      </div>
      
      {/* Status bar */}
      <TerminalStatusBar connected={connected} />
      
      {/* Scan line effect */}
      <div 
        className="fixed top-0 left-0 w-full h-screen pointer-events-none opacity-10"
        style={{
          background: 'linear-gradient(transparent 50%, rgba(0, 0, 0, 0.5) 50%)',
          backgroundSize: '100% 4px',
        }}
      ></div>
    </div>
  );
}