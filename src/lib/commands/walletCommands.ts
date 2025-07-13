// src/lib/commands/walletCommands.ts

import { TerminalEntry } from '@/contexts/TerminalContext';
import { commandRegistry, CommandHandler } from './commandProcessor';
import { useWalletIntegration } from '@/contexts/WalletContext';

// Helper function to get wallet integration outside of React components
let walletIntegration: ReturnType<typeof useWalletIntegration> | null = null;

export function setWalletIntegration(integration: ReturnType<typeof useWalletIntegration>) {
  walletIntegration = integration;
  console.log("Wallet integration set in commands", walletIntegration);
}

// Connect command - handles wallet connection
export const handleConnectCommand: CommandHandler = async (): Promise<TerminalEntry[]> => {
  console.log("Connect command called, wallet integration:", walletIntegration);
  
  // Check if we have access to wallet integration
  if (!walletIntegration) {
    return [
      { type: 'error' as const, text: 'Wallet integration not available' },
      { type: 'system' as const, text: 'Please try again or refresh the page' }
    ];
  }

  try {
    // Use the simulate wallet connection directly to avoid errors
    walletIntegration.simulateWalletConnection();
    
    // Return success message
    return [
      { type: 'system' as const, text: 'Connecting to wallet...' },
      { type: 'success' as const, text: `Connected to ${walletIntegration.shortenedAddress || '8xH5f...q3B7'}` },
      { type: 'system' as const, text: 'Scanning for Eagle identifiers...' },
      { type: 'warning' as const, text: 'Access level: 1 - INITIATE' },
      { type: 'hidden' as const, text: 'Use /classified to access restricted data' }
    ];
  } catch (error) {
    console.error('Error in connect command:', error);
    return [
      { type: 'error' as const, text: 'Failed to connect wallet' },
      { type: 'system' as const, text: 'Try using the "SIMULATE WALLET CONNECTION" button on the mint panel' }
    ];
  }
};

// Disconnect command
export const handleDisconnectCommand: CommandHandler = async (): Promise<TerminalEntry[]> => {
  // Check if we have access to wallet integration
  if (!walletIntegration) {
    return [
      { type: 'error' as const, text: 'Wallet integration not available' },
      { type: 'system' as const, text: 'Please try again or refresh the page' }
    ];
  }
  
  // Check if wallet is connected
  if (!walletIntegration.connected) {
    return [
      { type: 'error' as const, text: 'No wallet connected' },
      { type: 'system' as const, text: 'Use /connect to connect a wallet first' }
    ];
  }
  
  // Disconnect wallet
  await walletIntegration.disconnectWallet();
  
  return [
    { type: 'system' as const, text: 'Disconnecting wallet...' },
    { type: 'success' as const, text: 'Wallet disconnected successfully.' },
    { type: 'warning' as const, text: 'Access level reverted to GUEST' }
  ];
};

// Wallet info command
export const handleWalletInfoCommand: CommandHandler = async (): Promise<TerminalEntry[]> => {
  // Check if we have access to wallet integration
  if (!walletIntegration) {
    return [
      { type: 'error' as const, text: 'Wallet integration not available' },
      { type: 'system' as const, text: 'Please try again or refresh the page' }
    ];
  }
  
  // Check if wallet is connected
  if (!walletIntegration.connected) {
    return [
      { type: 'error' as const, text: 'No wallet connected' },
      { type: 'system' as const, text: 'Use /connect to connect a wallet' }
    ];
  }
  
  return [
    { type: 'system' as const, text: 'WALLET STATUS:' },
    { type: 'data' as const, text: 'Connection: Active' },
    { type: 'data' as const, text: `Address: ${walletIntegration.shortenedAddress || '8xH5f...q3B7'}` },
    { type: 'data' as const, text: 'Network: Devnet' },
    { type: 'data' as const, text: 'Balance: 5.24 SOL' },
  ];
};

// Register wallet commands
export function registerWalletCommands(): void {
  commandRegistry.register('/connect', handleConnectCommand);
  commandRegistry.register('/disconnect', handleDisconnectCommand);
  commandRegistry.register('/wallet', handleWalletInfoCommand);
  console.log("Wallet commands registered");
}