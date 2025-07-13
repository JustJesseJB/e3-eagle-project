// src/contexts/TerminalContext.tsx

'use client';
import { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';
import { walletEvents } from './WalletContext';

// Define types for terminal entries
export type TerminalEntryType = 
  | 'input' 
  | 'system' 
  | 'error' 
  | 'warning' 
  | 'success' 
  | 'command' 
  | 'data'
  | 'glitch'
  | 'hidden';

export type TerminalEntry = {
  type: TerminalEntryType;
  text: string;
  eagleId?: string; // Optional ID for eagle-related entries
  timestamp?: number; // When the entry was created
};

// Terminal context state type
type TerminalContextType = {
  history: TerminalEntry[];
  addEntry: (entry: TerminalEntry) => void;
  addEntries: (entries: TerminalEntry[]) => void;
  clearTerminal: () => void;
  connected: boolean;
  setConnected: (status: boolean) => void;
  accessLevel: number;
  setAccessLevel: (level: number) => void;
  glitchEffect: boolean;
  triggerGlitch: () => void;
};

// Create the context with a default value
const TerminalContext = createContext<TerminalContextType | undefined>(undefined);

// Provider component
export function TerminalProvider({ children }: { children: ReactNode }) {
  const [history, setHistory] = useState<TerminalEntry[]>([]);
  const [connected, setConnected] = useState(false);
  const [accessLevel, setAccessLevel] = useState(0);
  const [glitchEffect, setGlitchEffect] = useState(false);

  // Subscribe to wallet connection changes
  useEffect(() => {
    const unsubscribe = walletEvents.subscribeToConnectionChanges((isConnected) => {
      setConnected(isConnected);
      
      // Optional: Add a terminal message when connection state changes
      if (isConnected) {
        setHistory(prev => [...prev, {
          type: 'success',
          text: 'Wallet connected successfully.',
          timestamp: Date.now()
        }]);
        
        // Set access level to 1 when connected
        setAccessLevel(1);
      } else if (history.length > 0) { // Only add disconnect message if there's already history
        setHistory(prev => [...prev, {
          type: 'system',
          text: 'Wallet disconnected.',
          timestamp: Date.now()
        }]);
        
        // Reset access level when disconnected
        setAccessLevel(0);
      }
    });
    
    return () => unsubscribe();
  }, [history.length]);

  // Add a single entry to the terminal
  const addEntry = useCallback((entry: TerminalEntry) => {
    setHistory(prev => [...prev, {
      ...entry,
      timestamp: entry.timestamp || Date.now()
    }]);
  }, []);

  // Add multiple entries to the terminal
  const addEntries = useCallback((entries: TerminalEntry[]) => {
    setHistory(prev => [
      ...prev, 
      ...entries.map(entry => ({
        ...entry,
        timestamp: entry.timestamp || Date.now()
      }))
    ]);
  }, []);

  // Clear the terminal history
  const clearTerminal = useCallback(() => {
    setHistory([]);
  }, []);

  // Trigger a glitch effect
  const triggerGlitch = useCallback(() => {
    setGlitchEffect(true);
    setTimeout(() => setGlitchEffect(false), 1500);
  }, []);

  return (
    <TerminalContext.Provider value={{
      history,
      addEntry,
      addEntries,
      clearTerminal,
      connected,
      setConnected,
      accessLevel,
      setAccessLevel,
      glitchEffect,
      triggerGlitch
    }}>
      {children}
    </TerminalContext.Provider>
  );
}

// Hook for easy context access
export function useTerminal() {
  const context = useContext(TerminalContext);
  if (context === undefined) {
    throw new Error('useTerminal must be used within a TerminalProvider');
  }
  return context;
}