import { TerminalEntry } from '@/contexts/TerminalContext';
import { commandRegistry, CommandHandler } from './commandProcessor';

// Connect command - simulated for now, will be replaced with actual wallet connection
export const handleConnectCommand: CommandHandler = async (): Promise<TerminalEntry[]> => {
  // In the real implementation, this would trigger the wallet modal
  // and wait for the user to connect
  return [
    { type: 'system', text: 'Initializing wallet connection...' },
    { type: 'system', text: 'Please select a wallet provider from the popup.' },
    { type: 'warning', text: 'This command currently simulates a wallet connection.' },
    { type: 'warning', text: 'In the final implementation, this will integrate with real wallets.' },
  ];
};

// Disconnect command
export const handleDisconnectCommand: CommandHandler = async (): Promise<TerminalEntry[]> => {
  return [
    { type: 'system', text: 'Disconnecting wallet...' },
    { type: 'success', text: 'Wallet disconnected successfully.' },
  ];
};

// Wallet info command
export const handleWalletInfoCommand: CommandHandler = async (): Promise<TerminalEntry[]> => {
  return [
    { type: 'system', text: 'WALLET STATUS:' },
    { type: 'data', text: 'Connection: Simulated' },
    { type: 'data', text: 'Address: 8xHy...sS9' },
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