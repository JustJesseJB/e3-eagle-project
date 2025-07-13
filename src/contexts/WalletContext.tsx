// src/contexts/WalletContext.tsx

'use client';
import { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import { 
  ConnectionProvider,
  WalletProvider, 
  useWallet,
  useConnection
} from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom';
import { SolflareWalletAdapter } from '@solana/wallet-adapter-solflare'; 
import { BackpackWalletAdapter } from '@solana/wallet-adapter-backpack';
import { BraveWalletAdapter } from '@solana/wallet-adapter-brave';
import { CoinbaseWalletAdapter } from '@solana/wallet-adapter-coinbase';
import { LedgerWalletAdapter } from '@solana/wallet-adapter-ledger';
import { clusterApiUrl } from '@solana/web3.js';
import { shortenAddress } from '@/utils/addresses';

// Add Solana property to window type
declare global {
  interface Window {
    solana?: any;
  }
}

// Create internal wallet context for our app-specific wallet functionality
const InternalWalletContext = createContext<{
  shortenedAddress: string | null;
  isConnecting: boolean;
  connected: boolean; 
  connectWallet: () => Promise<void>;
  disconnectWallet: () => Promise<void>;
  simulateWalletConnection: () => void;
  publicKey: string | null;
  showWalletModal: boolean;
  setShowWalletModal: (show: boolean) => void;
}>({
  shortenedAddress: null,
  isConnecting: false,
  connected: false,
  connectWallet: async () => {},
  disconnectWallet: async () => {},
  simulateWalletConnection: () => {},
  publicKey: null,
  showWalletModal: false,
  setShowWalletModal: () => {},
});

export interface WalletEvents {
  onConnectedChange: Set<(connected: boolean) => void>;
  subscribeToConnectionChanges(callback: (connected: boolean) => void): () => void;
  notifyConnectionChange(connected: boolean): void;
}

// Event system for wallet state changes
export const walletEvents: WalletEvents = {
  onConnectedChange: new Set<(connected: boolean) => void>(),
  
  // Method to subscribe to connection changes
  subscribeToConnectionChanges(callback: (connected: boolean) => void): () => void {
    this.onConnectedChange.add(callback);
    return () => {
      this.onConnectedChange.delete(callback);
    };
  },
  
  // Method to notify all subscribers
  notifyConnectionChange(connected: boolean): void {
    this.onConnectedChange.forEach(callback => callback(connected));
  }
};

// Generate a random address for simulation
const generateRandomAddress = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 44; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// Custom component to initialize wallet integration
function WalletInitializer({ children }: { children: ReactNode }) {
  const { publicKey, connect, disconnect, connecting, connected } = useWallet();
  const { connection } = useConnection();
  
  const [isSimulatedWallet, setIsSimulatedWallet] = useState(false);
  const [simulatedAddress, setSimulatedAddress] = useState('8xH5f...q3B7');
  const [simulatedPublicKey, setSimulatedPublicKey] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [showWalletModal, setShowWalletModal] = useState(false);
  
  // Update connection status based on real or simulated wallet
  useEffect(() => {
    const newConnectedStatus = connected || isSimulatedWallet;
    setIsConnected(newConnectedStatus);
    walletEvents.notifyConnectionChange(newConnectedStatus);
  }, [connected, isSimulatedWallet]);
  
  // Set up shortened address display
  const realShortenedAddress = publicKey 
    ? shortenAddress(publicKey.toString())
    : null;
  
  const displayAddress = isSimulatedWallet 
    ? simulatedAddress
    : realShortenedAddress;
  
  const actualPublicKey = isSimulatedWallet
    ? simulatedPublicKey
    : publicKey?.toString() || null;
  
  // Connect to wallet
  const connectWallet = async () => {
    try {
      if (connecting) return;
      
      await connect();
    } catch (error) {
      console.error('Error connecting to wallet:', error);
    }
  };
  
  // Disconnect wallet
  const disconnectWallet = async () => {
    try {
      if (isSimulatedWallet) {
        setIsSimulatedWallet(false);
        setSimulatedAddress('');
        setSimulatedPublicKey(null);
      } else {
        await disconnect();
      }
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
    }
  };
  
  // Simulate wallet connection
  const simulateWalletConnection = () => {
    console.log("Simulating wallet connection");
    const fullAddress = generateRandomAddress();
    setIsSimulatedWallet(true);
    setSimulatedAddress(shortenAddress(fullAddress));
    setSimulatedPublicKey(fullAddress);
  };
  
  return (
    <InternalWalletContext.Provider value={{
      shortenedAddress: displayAddress,
      isConnecting: connecting,
      connected: isConnected,
      connectWallet,
      disconnectWallet,
      simulateWalletConnection,
      publicKey: actualPublicKey,
      showWalletModal,
      setShowWalletModal
    }}>
      {children}
    </InternalWalletContext.Provider>
  );
}

// Main wallet provider component
export function WalletContextProvider({ children }: { children: ReactNode }) {
  // Set up wallet adapters
  const network = WalletAdapterNetwork.Devnet;
  const endpoint = clusterApiUrl(network);
  
  const wallets = [
    new PhantomWalletAdapter(),
    new SolflareWalletAdapter(),
    new BackpackWalletAdapter(),
    new BraveWalletAdapter(),
    new CoinbaseWalletAdapter(),
    new LedgerWalletAdapter()
  ];
  
  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect={false}>
        <WalletInitializer>
          {children}
        </WalletInitializer>
      </WalletProvider>
    </ConnectionProvider>
  );
}

// Hook for easy context access
export function useWalletIntegration() {
  return useContext(InternalWalletContext);
}