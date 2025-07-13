// src/lib/commands/walletCommands.ts

import { TerminalEntry } from '@/contexts/TerminalContext';
import { commandRegistry, CommandHandler } from './commandProcessor';
import { useWalletIntegration } from '@/contexts/WalletContext';
import { useAdmin } from '@/contexts/AdminContext';

// Helper function to get wallet integration outside of React components
let walletIntegration: ReturnType<typeof useWalletIntegration> | null = null;
let adminContext: ReturnType<typeof useAdmin> | null = null;

export function setWalletIntegration(integration: ReturnType<typeof useWalletIntegration>) {
  walletIntegration = integration;
  console.log("Wallet integration set in commands", walletIntegration);
}

export function setAdminContext(admin: ReturnType<typeof useAdmin>) {
  adminContext = admin;
  console.log("Admin context set in wallet commands");
}

// Connect command - handles wallet connection
export const handleConnectCommand: CommandHandler = async (): Promise<TerminalEntry[]> => {
  console.log("Connect command called, wallet integration:", walletIntegration);
  
  // Check if we have access to wallet integration
  if (!walletIntegration) {
    return [
      { type: 'error', text: 'Wallet integration not available' },
      { type: 'system', text: 'Please try again or refresh the page' }
    ];
  }

  // Determine if we should show the wallet selection modal
  if (adminContext && 
      adminContext.config.enableRealWalletOption && 
      adminContext.config.enableSimulatedWallet) {
    // Show the modal for selecting wallet type
    console.log("Opening wallet selection modal");
    walletIntegration.setShowWalletModal(true);
    
    return [
      { type: 'system', text: 'Please select a wallet connection method...' }
    ];
  }
  
  // If only simulated wallet is enabled, use it automatically
  if (adminContext && 
      !adminContext.config.enableRealWalletOption && 
      adminContext.config.enableSimulatedWallet) {
    console.log("Using simulated wallet automatically");
    walletIntegration.simulateWalletConnection();
    
    return [
      { type: 'system', text: 'Connecting to simulated wallet...' },
      { type: 'success', text: `Connected to ${walletIntegration.shortenedAddress || '8xH5f...q3B7'}` },
      { type: 'system', text: 'Scanning for Eagle identifiers...' },
      { type: 'warning', text: 'Access level: 1 - INITIATE' },
      { type: 'hidden', text: 'Use /classified to access restricted data' }
    ];
  }
  
  // If only real wallet is enabled, try to connect to it
  if (adminContext && 
      adminContext.config.enableRealWalletOption && 
      !adminContext.config.enableSimulatedWallet) {
    try {
      console.log("Attempting to connect to real wallet");
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
      console.error('Error connecting to wallet:', error);
      return [
        { type: 'error', text: 'Failed to connect to wallet' },
        { type: 'system', text: 'Please make sure you have a Solana wallet extension installed' }
      ];
    }
  }

  // Fallback: If no admin context or specific config, show the modal if available
  try {
    console.log("No specific configuration, checking if modal is available");
    if (walletIntegration.setShowWalletModal) {
      walletIntegration.setShowWalletModal(true);
      return [
        { type: 'system', text: 'Please select a wallet connection method...' }
      ];
    } else {
      // If no modal function, simulate wallet connection
      console.log("No modal function available, using simulation");
      walletIntegration.simulateWalletConnection();
      
      // Return success message
      return [
        { type: 'system', text: 'Connecting to simulated wallet...' },
        { type: 'success', text: `Connected to ${walletIntegration.shortenedAddress || '8xH5f...q3B7'}` },
        { type: 'system', text: 'Scanning for Eagle identifiers...' },
        { type: 'warning', text: 'Access level: 1 - INITIATE' },
        { type: 'hidden', text: 'Use /classified to access restricted data' }
      ];
    }
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
    { type: 'data', text: 'Network: ' + (adminContext ? (adminContext.config.networkType === 'mainnet-beta' ? 'Mainnet' : 'Devnet') : 'Devnet') },
    { type: 'data', text: 'Balance: 5.24 SOL' },
  ];
};

// Register wallet commands
export function registerWalletCommands(): void {
  commandRegistry.register('/connect', handleConnectCommand);
  commandRegistry.register('/disconnect', handleDisconnectCommand);
  commandRegistry.register('/wallet', handleWalletInfoCommand);
  console.log("Wallet commands registered");
}