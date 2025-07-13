// src/lib/commands/index.ts

import { registerBasicCommands } from './basicCommands';
import { registerWalletCommands } from './walletCommands';
import { registerChatCommands } from './chatCommands';
import { registerAssetsCommands } from './assetsCommands';
import { registerMarketplaceCommands } from './marketplaceCommands';
import { registerSocialsCommands } from './socialsCommands';
// Fix: Use direct function definition instead of import
// import { registerAdminCommands } from './adminCommands';
import { commandRegistry } from './commandProcessor';
import { TerminalEntry } from '@/contexts/TerminalContext';

// Define admin commands registration function directly to avoid import error
function registerAdminCommands(): void {
  console.log("Admin commands registered directly from index.ts");
  
  // Register admin commands directly here
  commandRegistry.register('/admin', async (): Promise<TerminalEntry[]> => {
    return [
      { type: 'system', text: 'Opening administrator control panel...' },
      { type: 'success', text: 'Administrator access granted' }
    ];
  });
  
  commandRegistry.register('/network', async (args: string[]): Promise<TerminalEntry[]> => {
    if (!args.length || (args[0] !== 'devnet' && args[0] !== 'mainnet')) {
      return [
        { type: 'error', text: 'Invalid network specified' },
        { type: 'system', text: 'Usage: /network [devnet|mainnet]' }
      ];
    }
    
    return [
      { type: 'system', text: `Switching network to ${args[0].toUpperCase()}...` },
      { type: 'success', text: `Network changed to ${args[0].toUpperCase()}` },
      { type: 'warning', text: 'Please refresh the page for changes to take effect.' }
    ];
  });
  
  commandRegistry.register('/minttoggle', async (args: string[]): Promise<TerminalEntry[]> => {
    if (!args.length || (args[0] !== 'on' && args[0] !== 'off')) {
      return [
        { type: 'error', text: 'Invalid toggle option specified' },
        { type: 'system', text: 'Usage: /minttoggle [on|off]' }
      ];
    }
    
    const mintEnabled = args[0] === 'on';
    
    return [
      { type: 'system', text: `${mintEnabled ? 'Enabling' : 'Disabling'} mint functionality...` },
      { type: 'success', text: `Mint functionality ${mintEnabled ? 'ENABLED' : 'DISABLED'}` }
    ];
  });
}

/**
 * Registers all commands with the command registry.
 * This should be called once during application initialization.
 */
export function registerAllCommands(): void {
  // Clear existing commands first to prevent duplicates
  (commandRegistry as any).commands = {};
  
  console.log("Registering all terminal commands...");
  
  // Register commands from each category
  registerBasicCommands();
  registerWalletCommands();
  registerChatCommands();
  registerAssetsCommands();
  registerMarketplaceCommands();
  registerSocialsCommands();
  registerAdminCommands(); // This now uses the local function
  
  // Add special panel commands explicitly
  commandRegistry.register('/mint', async (): Promise<TerminalEntry[]> => {
    return [{ type: 'system', text: 'Opening mint panel...' }];
  });
  
  commandRegistry.register('/chat', async (): Promise<TerminalEntry[]> => {
    return [{ type: 'system', text: 'Opening chat panel...' }];
  });
  
  commandRegistry.register('/classified', async (): Promise<TerminalEntry[]> => {
    return [{ type: 'system', text: 'Accessing classified information...' }];
  });
  
  // Debug: log all registered commands
  console.log("All commands registered:", Object.keys((commandRegistry as any).commands));
}