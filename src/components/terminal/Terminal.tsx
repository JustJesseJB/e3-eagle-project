// src/components/terminal/Terminal.tsx

'use client';
import { useEffect, useRef, useState } from 'react';
import { useTerminal } from '@/contexts/TerminalContext';
import { processCommandInput } from '@/lib/commands/commandProcessor';
import { registerAllCommands } from '@/lib/commands';
import { useWalletIntegration } from '@/contexts/WalletContext';
import { setWalletIntegration } from '@/lib/commands/walletCommands';
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
  
  const walletIntegration = useWalletIntegration();
  const { shortenedAddress } = walletIntegration;
  
  // Set wallet integration for command processor
  useEffect(() => {
    setWalletIntegration(walletIntegration);
  }, [walletIntegration]);
  
  const [isReady, setIsReady] = useState(false);
  const terminalRef = useRef<HTMLDivElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);
  
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
      { type: 'system' as const, text: 'BIOS v1.2.8 loaded successfully' },
      { type: 'system' as const, text: 'Loading terminal modules...' },
      { type: 'system' as const, text: 'Wallet integration: READY' },
      { type: 'system' as const, text: 'NFT Gallery: READY' },
      { type: 'system' as const, text: 'Secure Messaging: READY' },
      { type: 'system' as const, text: 'Blockchain Interface: READY' },
      { type: 'system' as const, text: 'Type /help for available commands' },
      { type: 'hidden' as const, text: 'HIDDEN SYSTEM LOG: EAGLE PROTOCOL ACTIVE' }
    ];
    
    // Add boot sequence entries with delay
    let index = 0;
    const interval = setInterval(() => {
      if (index < bootSequence.length) {
        addEntries([bootSequence[index]]);
        index++;
      } else {
        clearInterval(interval);
      }
    }, 300);
    
    // Clean up interval on unmount
    return () => clearInterval(interval);
  }, [addEntries]);
  
  // Auto-scroll terminal to bottom when new content is added
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [history]);
  
  // Process command input
  const handleCommandSubmit = async (command: string) => {
    // Add command to history
    addEntries([{ type: 'input' as const, text: command }]);
    
    // Process command
    const result = await processCommandInput(command);
    
    // Handle clear command directly
    if (command.trim().toLowerCase() === '/clear' || command.trim().toLowerCase() === 'clear') {
      clearTerminal();
      return;
    }
    
    // Check for panel commands
    if (command.trim().toLowerCase() === '/mint' || command.trim().toLowerCase() === 'mint') {
      setShowMintPanel(true);
      setShowChatPanel(false);
      setShowSecretPanel(false);
    } else if (command.trim().toLowerCase() === '/chat' || command.trim().toLowerCase() === 'chat') {
      setShowChatPanel(true);
      setShowMintPanel(false);
      setShowSecretPanel(false);
    } else if (command.trim().toLowerCase() === '/classified' || command.trim().toLowerCase() === 'classified') {
      if (connected && accessLevel > 0) {
        setShowSecretPanel(true);
        setShowMintPanel(false);
        setShowChatPanel(false);
      } else {
        addEntries([
          { type: 'error' as const, text: 'ACCESS DENIED: Insufficient clearance level' },
          { type: 'system' as const, text: 'Connect wallet and verify identity first.' }
        ]);
      }
    }
    
    // Add command output to history
    if (result.length > 0) {
      addEntries(result);
    }
    
    // Auto-scroll to bottom after command execution
    setTimeout(() => {
      if (outputRef.current) {
        outputRef.current.scrollTop = outputRef.current.scrollHeight;
      }
    }, 10);
    
    // Random chance for glitch effect
    if (Math.random() < 0.05) {
      triggerGlitch();
      
      // Random hidden message
      if (!showHiddenMessage && Math.random() < 0.3) {
        setShowHiddenMessage(true);
        setTimeout(() => {
          addEntries([
            { type: 'glitch' as const, text: 'EAGLE PROTOCOL BREACH DETECTED... SCANNING...' }
          ]);
          
          setTimeout(() => {
            setShowHiddenMessage(false);
          }, 1500);
        }, 500);
      }
    }
  };
  
  // Focus on input when terminal is clicked
  const focusInput = () => {
    // Use proper casting to HTMLInputElement to access focus method
    const inputElement = document.querySelector('input[type="text"]') as HTMLInputElement | null;
    if (inputElement) {
      inputElement.focus();
    }
  };
  
  return (
    <div 
      className="h-screen max-h-screen flex flex-col bg-black text-green-400 font-mono relative terminal-bg"
      onClick={focusInput}
      ref={terminalRef}
    >
      {/* Terminal header */}
      <TerminalHeader glitchEffect={glitchEffect} connected={connected} />
      
      {/* Main terminal area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Terminal output */}
        <div 
          className="flex-1 overflow-y-auto p-4"
          ref={outputRef}
        >
          <TerminalOutput history={history} />
        </div>
        
        {/* Side panels */}
        {(showMintPanel || showChatPanel || showSecretPanel) && (
          <div className="w-64 bg-gray-900 border-l border-green-900 flex flex-col shrink-0 animate-slide-in">
            {/* Panel header */}
            <div className="bg-gray-800 px-3 py-2 flex justify-between items-center">
              <div className="text-xs">
                {showMintPanel && <span className="text-cyan-400 text-sm">NFT MINT</span>}
                {showChatPanel && <span className="text-green-400 text-sm">SECURE LINK</span>}
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
      
      {/* Terminal input */}
      <div className="p-4 border-t border-green-900/30">
        <TerminalInput onSubmit={handleCommandSubmit} />
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