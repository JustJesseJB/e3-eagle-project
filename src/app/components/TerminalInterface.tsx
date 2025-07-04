"use client";
import { useState, useEffect, useRef } from 'react';

export default function TerminalInterface() {
  const [terminalInput, setTerminalInput] = useState('');
  const [terminalHistory, setTerminalHistory] = useState<any[]>([]);
  const terminalRef = useRef<HTMLDivElement>(null);

  // Auto-scroll terminal to bottom when new content is added
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [terminalHistory]);

  // Process commands entered by the user
  const processCommand = (cmd: string) => {
    const command = cmd.trim().toLowerCase();
    let response = [];
    
    // Add command to history
    setTerminalHistory(prev => [...prev, { type: 'input', text: `> ${cmd}` }]);
    
    // Process different commands
    if (command === 'help') {
      response = [
        { type: 'system', text: 'Available commands:' },
        { type: 'command', text: '/help - Show available commands' },
        { type: 'command', text: '/clear - Clear terminal' },
      ];
    } 
    else if (command === 'clear') {
      setTerminalHistory([]);
      return;
    }
    else if (command === '') {
      return;
    }
    else {
      response = [
        { type: 'error', text: `Command not recognized: ${command}` },
        { type: 'system', text: 'Type /help for available commands' }
      ];
    }
    
    // Add responses to history
    setTerminalHistory(prev => [...prev, ...response]);
    
    // Clear input
    setTerminalInput('');
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    processCommand(terminalInput);
  };

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono flex flex-col">
      {/* Terminal header */}
      <div className="bg-gray-900 border-b border-green-500/30 p-2 flex justify-between items-center">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-black border border-green-500 flex items-center justify-center mr-2">
            <span className="text-xs">E3</span>
          </div>
          <span className="text-sm">EAGLE-TERM v0.3.7 [ALPHA]</span>
        </div>
        <div className="flex space-x-3">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-900"></div>
        </div>
      </div>
      
      {/* Main terminal container */}
      <div className="flex-1 p-4 overflow-hidden flex flex-col">
        {/* Terminal output */}
        <div 
          ref={terminalRef}
          className="flex-1 p-4 overflow-y-auto"
          style={{ 
            background: 'linear-gradient(rgba(0,20,0,0.7), rgba(0,10,0,0.7))',
            boxShadow: 'inset 0 0 30px rgba(0,50,0,0.3)',
            textShadow: '0 0 5px rgba(0,255,0,0.5)'
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
            {terminalHistory.map((entry, i) => (
              <div 
                key={i} 
                className={`
                  ${entry.type === 'input' ? 'text-white' : ''}
                  ${entry.type === 'system' ? 'text-green-400' : ''}
                  ${entry.type === 'error' ? 'text-red-400' : ''}
                  ${entry.type === 'warning' ? 'text-yellow-400' : ''}
                  ${entry.type === 'success' ? 'text-cyan-400' : ''}
                  ${entry.type === 'command' ? 'text-purple-400' : ''}
                  mb-1
                `}
              >
                {entry.text}
              </div>
            ))}
          </div>
        </div>
        
        {/* Terminal input */}
        <form onSubmit={handleSubmit} className="border-t border-green-800/50 p-2">
          <div className="flex items-center">
            <span className="text-green-500 mr-2">&gt;</span>
            <input
              type="text"
              value={terminalInput}
              onChange={(e) => setTerminalInput(e.target.value)}
              className="flex-1 bg-transparent text-white focus:outline-none"
              placeholder="Enter command..."
              autoFocus
            />
          </div>
        </form>
      </div>
      
      {/* Status bar */}
      <div className="bg-gray-900 border-t border-green-500/30 p-1 text-xs text-gray-500 flex justify-between">
        <div>
          <span className="mr-3">STATUS: DISCONNECTED</span>
        </div>
        <div>
          ACCESS LEVEL: GUEST
        </div>
        <div>
          E3-TERM // {new Date().toLocaleTimeString()}
        </div>
      </div>
      
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