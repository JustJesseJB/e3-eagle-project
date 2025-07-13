// src/lib/commands/adminCommands.ts

import { TerminalEntry } from '@/contexts/TerminalContext';
import { commandRegistry, CommandHandler } from './commandProcessor';
import { useAdmin } from '@/contexts/AdminContext';

// Helper function to get admin context outside of React components
let adminContext: ReturnType<typeof useAdmin> | null = null;

export function setAdminContext(context: ReturnType<typeof useAdmin>) {
  adminContext = context;
}

// Admin command - opens admin panel if authorized
export const handleAdminCommand: CommandHandler = async (): Promise<TerminalEntry[]> => {
  // Check if we have access to admin context
  if (!adminContext) {
    return [
      { type: 'error', text: 'Admin context not available' },
      { type: 'system', text: 'Please try again or refresh the page' }
    ];
  }

  const { isAdmin, setShowAdminPanel } = adminContext;
  
  if (!isAdmin) {
    return [
      { type: 'error', text: 'ACCESS DENIED: Administrator privileges required' },
      { type: 'system', text: 'This command is restricted to authorized personnel only.' }
    ];
  }
  
  // Show admin panel
  setShowAdminPanel(true);
  
  return [
    { type: 'system', text: 'Opening administrator control panel...' },
    { type: 'success', text: 'Administrator access granted' }
  ];
};

// Network command - change network if authorized
export const handleNetworkCommand: CommandHandler = async (args: string[]): Promise<TerminalEntry[]> => {
  // Check if we have access to admin context
  if (!adminContext) {
    return [
      { type: 'error', text: 'Admin context not available' },
      { type: 'system', text: 'Please try again or refresh the page' }
    ];
  }

  const { isAdmin, config, updateConfig, saveConfigToLocalStorage } = adminContext;
  
  if (!isAdmin) {
    return [
      { type: 'error', text: 'ACCESS DENIED: Administrator privileges required' },
      { type: 'system', text: 'This command is restricted to authorized personnel only.' }
    ];
  }
  
  // Check for network argument
  if (!args.length || (args[0] !== 'devnet' && args[0] !== 'mainnet')) {
    return [
      { type: 'error', text: 'Invalid network specified' },
      { type: 'system', text: 'Usage: /network [devnet|mainnet]' }
    ];
  }
  
  const networkType = args[0] === 'mainnet' ? 'mainnet-beta' : 'devnet';
  
  // Update network
  updateConfig({ networkType });
  saveConfigToLocalStorage();
  
  return [
    { type: 'system', text: `Switching network to ${args[0].toUpperCase()}...` },
    { type: 'success', text: `Network changed to ${args[0].toUpperCase()}` },
    { type: 'warning', text: 'Please refresh the page for changes to take effect.' }
  ];
};

// Toggle mint command - enable/disable minting if authorized
export const handleMintToggleCommand: CommandHandler = async (args: string[]): Promise<TerminalEntry[]> => {
  // Check if we have access to admin context
  if (!adminContext) {
    return [
      { type: 'error', text: 'Admin context not available' },
      { type: 'system', text: 'Please try again or refresh the page' }
    ];
  }

  const { isAdmin, config, updateConfig, saveConfigToLocalStorage } = adminContext;
  
  if (!isAdmin) {
    return [
      { type: 'error', text: 'ACCESS DENIED: Administrator privileges required' },
      { type: 'system', text: 'This command is restricted to authorized personnel only.' }
    ];
  }
  
  // Check for toggle argument
  if (!args.length || (args[0] !== 'on' && args[0] !== 'off')) {
    return [
      { type: 'error', text: 'Invalid toggle option specified' },
      { type: 'system', text: 'Usage: /minttoggle [on|off]' }
    ];
  }
  
  const mintEnabled = args[0] === 'on';
  
  // Update mint status
  updateConfig({ mintEnabled });
  saveConfigToLocalStorage();
  
  return [
    { type: 'system', text: `${mintEnabled ? 'Enabling' : 'Disabling'} mint functionality...` },
    { type: 'success', text: `Mint functionality ${mintEnabled ? 'ENABLED' : 'DISABLED'}` }
  ];
};

// Register admin commands
export function registerAdminCommands(): void {
  commandRegistry.register('/admin', handleAdminCommand);
  commandRegistry.register('/network', handleNetworkCommand);
  commandRegistry.register('/minttoggle', handleMintToggleCommand);
  console.log("Admin commands registered");
}