// src/components/terminal/panels/SecretPanel.tsx

'use client';
import { useTerminal } from '@/contexts/TerminalContext';

export default function SecretPanel() {
  const { triggerGlitch, addEntries } = useTerminal();
  
  const handleDecodeCommand = () => {
    // Trigger glitch effect
    triggerGlitch();
    
    // Add decoded message to terminal
    setTimeout(() => {
      addEntries([
        { type: 'system', text: 'DECRYPTION ATTEMPT INITIATED' },
        { type: 'glitch', text: 'WARNING: UNAUTHORIZED ACCESS DETECTED' },
        { type: 'glitch', text: 'SECURITY PROTOCOLS ENGAGED' },
        { type: 'data', text: 'DECODING BINARY: "NEXT DROP 7/15"' },
        { type: 'data', text: 'COORDINATES IDENTIFIED: AREA 51 PROXIMITY' },
        { type: 'hidden', text: 'SECURITY LEVEL INCREASED TO PREVENT FURTHER INTRUSION' },
        { type: 'system', text: 'Connection stabilized. Further access restricted.' }
      ]);
    }, 800);
  };
  
  return (
    <div>
      <div className="border border-red-500/30 p-3 mb-3 bg-gray-900/50">
        <div className="text-red-400 text-sm mb-1">CLASSIFIED INFORMATION</div>
        <div className="text-gray-400 text-xs">
          Access Level: <span className="text-yellow-400">2 - OPERATIVE</span>
        </div>
      </div>
      
      <div className="space-y-3 text-sm">
        <div className="text-gray-400">Project E3 Status: <span className="text-green-400">ACTIVE</span></div>
        <div className="text-gray-400">Phase 1: <span className="text-green-400">COMPLETE</span></div>
        <div className="text-gray-400">Phase 2: <span className="text-yellow-400">IN PROGRESS</span></div>
        <div className="text-gray-400">Phase 3: <span className="text-red-400">PENDING</span></div>
        
        <div className="border-t border-gray-800 pt-2">
          <div className="text-yellow-400 mb-1">TRANSMISSION INTERCEPTED:</div>
          <div className="text-gray-500 font-mono text-xs">
            &lt;01001110 01000101 01011000 01010100 00100000 01000100 01010010 01001111 01010000 00100000 00110111 00101111 00110001 00110101&gt;
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-2">
          <div className="text-yellow-400 mb-1">COORDINATES:</div>
          <div className="text-white font-mono">37°14'06.0"N 115°48'40.0"W</div>
        </div>
        
        <div className="text-center mt-4">
          <button 
            className="bg-red-900/50 text-red-300 px-4 py-2 rounded border border-red-700/30 text-xs hover:bg-red-800/50 transition touch-manipulation"
            onClick={handleDecodeCommand}
          >
            DECRYPT FULL MESSAGE
          </button>
        </div>
      </div>
    </div>
  );
}