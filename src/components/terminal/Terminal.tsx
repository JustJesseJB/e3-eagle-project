'use client';
import { useEffect, useRef, useState } from 'react';
import { useTerminal } from '@/contexts/TerminalContext';
import { processCommandInput } from '@/lib/commands/commandProcessor';
import { registerAllCommands } from '@/lib/commands';
import { useWalletIntegration } from '@/contexts/WalletContext';
import TerminalHeader from './TerminalHeader';
import TerminalOutput from './TerminalOutput';
import TerminalInput from './TerminalInput';
import TerminalStatusBar from './TerminalStatusBar';
import ChatPanel from './panels/ChatPanel';
import MintPanel from './panels/MintPanel';
import SecretPanel from './panels/SecretPanel';
import EagleDetailModal from './modals/EagleDetailModal';

export default function Terminal() {
  const { 
    history, 
    addEntries, 
    clearTerminal,
    connected,
    glitchEffect,
    accessLevel,
    triggerGlitch
  } = useTerminal();
  
  const { connectWallet, shortenedAddress } = useWalletIntegration();
  
  const [isReady, setIsReady] = useState(false);
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Panel states
  const [showMintPanel, setShowMintPanel] = useState(false);
  const [showChatPanel, setShowChatPanel] = useState(false);
  const [showSecretPanel, setShowSecretPanel] = useState(false);
  
  // Eagle modal state
  const [selectedEagle, setSelectedEagle] = useState<{
    id: string, 
    rarity: string, 
    traits: string[], 
    power: number
  } | null>(null);
  
  // Random effects
  const [showHiddenMessage, setShowHiddenMessage] = useState(false);
  
  // Register commands on component mount
  useEffect(() => {
    console.log('Initializing terminal and registering all commands...');
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
    
    // Simulate random glitch effects
    const glitchInterval = setInterval(() => {
      if (Math.random() > 0.92) {
        triggerGlitch();
      }
    }, 3000);
    
    return () => clearInterval(glitchInterval);
  }, [addEntries, triggerGlitch]);
  
  // Auto-scroll terminal to bottom when new content is added
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);
  
  // Focus on input field when terminal is clicked
  useEffect(() => {
    const handleClick = () => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    };
    
    if (terminalRef.current) {
      terminalRef.current.addEventListener('click', handleClick);
    }
    
    return () => {
      if (terminalRef.current) {
        terminalRef.current.removeEventListener('click', handleClick);
      }
    };
  }, []);
  
  // Handle command submission
  const handleCommandSubmit = async (input: string) => {
    console.log('Processing command:', input);
    
    if (input.trim().toLowerCase() === '/clear' || input.trim().toLowerCase() === 'clear') {
      clearTerminal();
      return;
    }
    
    // Handle special commands that need UI interaction
    const command = input.trim().toLowerCase();
    if (command === '/mint' || command === 'mint') {
      togglePanel('mint');
    } else if (command === '/chat' || command === 'chat') {
      togglePanel('chat');
    } else if (command === '/classified' || command === 'classified') {
      togglePanel('secret');
    } else if (command.startsWith('/inspect ') || command.startsWith('inspect ')) {
      const eagleId = command.split(' ').slice(1).join(' ');
      // This would be replaced with actual Eagle lookup logic
      // For now, we'll create a dummy eagle for demonstration
      const dummyEagle = {
        id: eagleId || 'Eagle #1234',
        rarity: 'Legendary',
        traits: ['Gold Beak', 'Red Eyes', 'Alpha Plumage'],
        power: 85
      };
      setSelectedEagle(dummyEagle);
    }
    
    // Process the command through the command system
    try {
      const commandResults = await processCommandInput(input);
      addEntries(commandResults);
      
      // Special effects for certain commands
      if (command === '/scan' || command === 'scan') {
        // Show hidden message with delay
        setTimeout(() => {
          setShowHiddenMessage(true);
          setTimeout(() => setShowHiddenMessage(false), 1500);
        }, 2000);
      }
      
      if (command === '/decode' || command === 'decode') {
        // Trigger glitch effect
        triggerGlitch();
      }
      
    } catch (error) {
      console.error('Error processing command:', error);
      addEntries([
        { type: 'error', text: `Error processing command: ${(error as Error).message || 'Unknown error'}` }
      ]);
    }
  };
  
  // Toggle panels function for better mobile experience
  const togglePanel = (panelName: 'mint' | 'chat' | 'secret') => {
    // Close all panels first
    setShowMintPanel(false);
    setShowChatPanel(false);
    setShowSecretPanel(false);
    
    // Then open the requested one
    if (panelName === 'mint') setShowMintPanel(true);
    if (panelName === 'chat') setShowChatPanel(true);
    if (panelName === 'secret') setShowSecretPanel(true);
    
    // On mobile, scroll to the panel
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      setTimeout(() => {
        window.scrollTo({
          top: document.body.scrollHeight,
          behavior: 'smooth'
        });
      }, 100);
    }
  };
  
  // Handle eagle selection in the terminal
  const handleEagleClick = (eagleId: string) => {
    // This would be replaced with actual Eagle lookup logic
    // For now, we'll create a dummy eagle for demonstration
    const dummyEagle = {
      id: eagleId,
      rarity: 'Legendary',
      traits: ['Gold Beak', 'Red Eyes', 'Alpha Plumage'],
      power: 85
    };
    
    setSelectedEagle(dummyEagle);
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
          <div 
            ref={terminalRef}
            className="flex-1 p-4 overflow-y-auto terminal-bg relative"
            style={{ 
              background: 'linear-gradient(rgba(0,20,0,0.7), rgba(0,10,0,0.7))',
              boxShadow: 'inset 0 0 30px rgba(0,50,0,0.3)',
              textShadow: '0 0 5px rgba(0,255,0,0.5)',
              minHeight: '200px'
            }}
          >
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
                    ${entry.eagleId ? 'cursor-pointer hover:underline' : ''}
                    mb-1
                  `}
                  onClick={() => entry.eagleId && handleEagleClick(entry.eagleId)}
                >
                  {entry.text}
                </div>
              ))}
            </div>
            
            {/* Hidden message that flashes briefly */}
            {showHiddenMessage && (
              <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-red-500 opacity-60 text-xl font-bold animate-pulse">
                THE EAGLES ARE WATCHING
              </div>
            )}
          </div>
          
          {/* Terminal input */}
          <TerminalInput onSubmit={handleCommandSubmit} inputRef={inputRef} />
        </div>
        
        {/* Side panel - conditionally rendered */}
        {(showMintPanel || showChatPanel || showSecretPanel) && (
          <div className="h-auto min-h-[320px] border border-blue-500/30 bg-black rounded shadow-[0_0_15px_rgba(0,0,255,0.1)] mb-4 md:mb-0 md:w-80">
            {/* Panel header */}
            <div className="bg-gray-900 border-b border-blue-500/30 p-2 flex justify-between items-center sticky top-0">
              <div>
                {showMintPanel && <span className="text-cyan-400 text-sm">MINT PROTOCOL</span>}
                {showChatPanel && <span className="text-purple-400 text-sm">EAGLE COMM-LINK</span>}
                {showSecretPanel && <span className="text-red-400 text-sm">CLASSIFIED INTEL</span>}
              </div>
              <div className="flex space-x-2">
                <button 
                  className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-xs"
                  onClick={() => {
                    setShowMintPanel(false);
                    setShowChatPanel(false);
                    setShowSecretPanel(false);
                  }}
                  aria-label="Close panel"
                >
                  x
                </button>
              </div>
            </div>
            
            {/* Panel content */}
            <div className="p-3 overflow-y-auto" style={{ maxHeight: '60vh' }}>
              {showMintPanel && <MintPanel />}
              {showChatPanel && <ChatPanel />}
              {showSecretPanel && <SecretPanel />}
            </div>
          </div>
        )}
      </div>
      
      {/* Status bar */}
      <TerminalStatusBar 
        connected={connected} 
        accessLevel={accessLevel} 
        walletAddress={shortenedAddress} 
      />
      
      {/* Eagle Detail Modal */}
      {selectedEagle && (
        <EagleDetailModal 
          eagle={selectedEagle} 
          onClose={() => setSelectedEagle(null)} 
        />
      )}
      
      {/* Scan line effect */}
      <div 
        className="fixed top-0 left-0 w-full h-screen pointer-events-none opacity-10 scan-line"
        style={{
          background: 'linear-gradient(transparent 50%, rgba(0, 0, 0, 0.5) 50%)',
          backgroundSize: '100% 4px',
        }}
      ></div>
      
      {/* CSS for effects */}
      <style jsx>{`
        .terminal-bg::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: repeating-linear-gradient(
            0deg,
            rgba(0, 50, 0, 0.15),
            rgba(0, 50, 0, 0.15) 1px,
            transparent 1px,
            transparent 2px
          );
          pointer-events: none;
        }
        
        .glitch-text {
          animation: glitch 0.3s infinite;
        }
        
        @keyframes glitch {
          0% { transform: translate(0) }
          20% { transform: translate(-2px, 2px) }
          40% { transform: translate(-2px, -2px) }
          60% { transform: translate(2px, 2px) }
          80% { transform: translate(2px, -2px) }
          100% { transform: translate(0) }
        }
        
        .scan-line {
          animation: scan 8s linear infinite;
        }
        
        @keyframes scan {
          0% { transform: translateY(-100vh) }
          100% { transform: translateY(100vh) }
        }
      `}</style>
    </div>
  );
}