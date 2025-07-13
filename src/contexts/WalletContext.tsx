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

// Create internal wallet context for our app-specific wallet functionality
const InternalWalletContext = createContext<{
  shortenedAddress: string | null;
  isConnecting: boolean;
  connected: boolean; 
  connectWallet: () => Promise<void>;
  disconnectWallet: () => Promise<void>;
}>({
  shortenedAddress: null,
  isConnecting: false,
  connected: false,
  connectWallet: async () => {},
  disconnectWallet: async () => {},
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
  
  // Set up shortened address display
  const shortenedAddress = publicKey 
    ? `${publicKey.toString().substring(0, 4)}...${publicKey.toString().substring(publicKey.toString().length - 4)}`
    : null;
  
  // Connect wallet function
  const connectWallet = async () => {
    try {
      // Try to connect using the wallet adapter
      await connect();
    } catch (error) {
      console.error('Error connecting wallet:', error);
    }
  };
  
  // Disconnect wallet function
  const disconnectWallet = async () => {
    try {
      await disconnect();
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
    }
  };
  
  // Notify connection changes via event system
  useEffect(() => {
    walletEvents.notifyConnectionChange(connected);
  }, [connected]);
  
  return (
    <InternalWalletContext.Provider
      value={{
        shortenedAddress,
        isConnecting: connecting,
        connected,
        connectWallet,
        disconnectWallet
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