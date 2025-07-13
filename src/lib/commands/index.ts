// src/lib/commands/index.ts

import { registerBasicCommands } from './basicCommands';
import { registerWalletCommands } from './walletCommands';
import { registerChatCommands } from './chatCommands';
import { registerAssetsCommands } from './assetsCommands';
import { registerMarketplaceCommands } from './marketplaceCommands';
import { registerSocialsCommands } from './socialsCommands';
import { commandRegistry } from './commandProcessor';

/**
 * Registers all commands with the command registry.
 * This should be called once during application initialization.
 */
export function registerAllCommands(): void {
  // Clear existing commands first to prevent duplicates
  // Note: Adding this line to ensure commands don't get registered multiple times
  (commandRegistry as any).commands = {};
  
  console.log("Registering all terminal commands...");
  
  // Register commands from each category
  registerBasicCommands();
  registerWalletCommands();
  registerChatCommands();
  registerAssetsCommands();
  registerMarketplaceCommands();
  registerSocialsCommands();
  
  // Debug: log all registered commands
  console.log("All commands registered:", Object.keys((commandRegistry as any).commands));
}