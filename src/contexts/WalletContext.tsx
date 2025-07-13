// src/contexts/WalletContext.tsx

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
}>({
  shortenedAddress: null,
  isConnecting: false,
  connected: false,
  connectWallet: async () => {},
  disconnectWallet: async () => {},
  simulateWalletConnection: () => {},
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

// Custom component to initialize wallet integration
function WalletInitializer({ children }: { children: ReactNode }) {
  const { publicKey, connect, disconnect, connecting, connected } = useWallet();
  const { connection } = useConnection();
  const [isSimulatedWallet, setIsSimulatedWallet] = useState(false);
  const [simulatedAddress, setSimulatedAddress] = useState('8xH5f...q3B7');
  const [isConnected, setIsConnected] = useState(false);
  
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
  
  // Connect wallet function
  const connectWallet = async () => {
    try {
      if (window && window.solana) {
        // Try to connect using the wallet adapter
        await connect();
      } else {
        // Fall back to simulated wallet if no real wallet available
        console.log('No wallet detected, using simulated wallet');
        setIsSimulatedWallet(true);
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
      // Fall back to simulated wallet on error
      console.log('Error connecting to wallet, using simulated wallet');
      setIsSimulatedWallet(true);
    }
  };
  
  // Disconnect wallet function
  const disconnectWallet = async () => {
    try {
      if (isSimulatedWallet) {
        setIsSimulatedWallet(false);
      } else {
        await disconnect();
      }
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
    }
  };
  
  // Simulate wallet connection (for testing)
  const simulateWalletConnection = () => {
    setIsSimulatedWallet(true);
  };
  
  return (
    <InternalWalletContext.Provider
      value={{
        shortenedAddress: displayAddress,
        isConnecting: connecting,
        connected: isConnected,
        connectWallet,
        disconnectWallet,
        simulateWalletConnection
      }}
    >
      {children}
    </InternalWalletContext.Provider>
  );
}

// Main wallet provider that wraps everything
export function WalletContextProvider({ children }: { children: ReactNode }) {
  // Set up Solana network
  const network = WalletAdapterNetwork.Devnet; // Change to Mainnet for production
  
  // Use a dedicated RPC endpoint for better reliability
  const endpoint = network === WalletAdapterNetwork.Devnet
    ? clusterApiUrl(network)  
    : 'https://solana-mainnet.g.alchemy.com/v2/your-api-key'; // Replace with your production RPC
  
  // Set up wallet adapters
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

// Custom hook to use our wallet functionality
export function useWalletIntegration() {
  return useContext(InternalWalletContext);
}