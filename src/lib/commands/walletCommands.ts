// src/lib/commands/walletCommands.ts

import { TerminalEntry } from '@/contexts/TerminalContext';
import { commandRegistry, CommandHandler } from './commandProcessor';
import { useWalletIntegration } from '@/contexts/WalletContext';

// Helper function to get wallet integration outside of React components
let walletIntegration: ReturnType<typeof useWalletIntegration> | null = null;

export function setWalletIntegration(integration: ReturnType<typeof useWalletIntegration>) {
  walletIntegration = integration;
}

// Connect command - handles wallet connection
export const handleConnectCommand: CommandHandler = async (): Promise<TerminalEntry[]> => {
  // Check if we have access to wallet integration
  if (!walletIntegration) {
    return [
      { type: 'error', text: 'Wallet integration not available' },
      { type: 'system', text: 'Please try again or refresh the page' }
    ];
  }

  try {
    // First try to connect to a real wallet
    await walletIntegration.connectWallet();
    
    // Return success message
    return [
      { type: 'system', text: 'Connecting to wallet...' },
      { type: 'success', text: `Connected to ${walletIntegration.shortenedAddress || '8xH5f...q3B7'}` },
      { type: 'system', text: 'Scanning for Eagle identifiers...' },
      { type: 'warning', text: 'Access level: 1 - INITIATE' },
      { type: 'hidden', text: 'Use /classified to access restricted data' }
    ];
  } catch (error) {
    console.error('Error in connect command:', error);
    return [
      { type: 'error', text: 'Failed to connect wallet' },
      { type: 'system', text: 'Try using the "SIMULATE WALLET CONNECTION" button on the mint panel' }
    ];
  }
};

// Disconnect command
export const handleDisconnectCommand: CommandHandler = async (): Promise<TerminalEntry[]> => {
  // Check if we have access to wallet integration
  if (!walletIntegration) {
    return [
      { type: 'error', text: 'Wallet integration not available' },
      { type: 'system', text: 'Please try again or refresh the page' }
    ];
  }
  
  // Check if wallet is connected
  if (!walletIntegration.connected) {
    return [
      { type: 'error', text: 'No wallet connected' },
      { type: 'system', text: 'Use /connect to connect a wallet first' }
    ];
  }
  
  // Disconnect wallet
  await walletIntegration.disconnectWallet();
  
  return [
    { type: 'system', text: 'Disconnecting wallet...' },
    { type: 'success', text: 'Wallet disconnected successfully.' },
    { type: 'warning', text: 'Access level reverted to GUEST' }
  ];
};

// Wallet info command
export const handleWalletInfoCommand: CommandHandler = async (): Promise<TerminalEntry[]> => {
  // Check if we have access to wallet integration
  if (!walletIntegration) {
    return [
      { type: 'error', text: 'Wallet integration not available' },
      { type: 'system', text: 'Please try again or refresh the page' }
    ];
  }
  
  // Check if wallet is connected
  if (!walletIntegration.connected) {
    return [
      { type: 'error', text: 'No wallet connected' },
      { type: 'system', text: 'Use /connect to connect a wallet' }
    ];
  }
  
  return [
    { type: 'system', text: 'WALLET STATUS:' },
    { type: 'data', text: 'Connection: Active' },
    { type: 'data', text: `Address: ${walletIntegration.shortenedAddress || '8xH5f...q3B7'}` },
    { type: 'data', text: 'Network: Devnet' },
    { type: 'data', text: 'Balance: 5.24 SOL' },
  ];
};

// Register wallet commands
export function registerWalletCommands(): void {
  commandRegistry.register('/connect', handleConnectCommand);
  commandRegistry.register('/disconnect', handleDisconnectCommand);
  commandRegistry.register('/wallet', handleWalletInfoCommand);
}