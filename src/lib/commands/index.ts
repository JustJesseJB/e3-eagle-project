import { registerBasicCommands } from './basicCommands';
import { registerWalletCommands } from './walletCommands';
import { registerChatCommands } from './chatCommands';
import { registerAssetsCommands } from './assetsCommands';
import { registerMarketplaceCommands } from './marketplaceCommands';
import { registerSocialsCommands } from './socialsCommands';

/**
 * Registers all commands with the command registry.
 * This should be called once during application initialization.
 */
export function registerAllCommands(): void {
  // Register commands from each category
  registerBasicCommands();
  registerWalletCommands();
  registerChatCommands();
  registerAssetsCommands();
  registerMarketplaceCommands();
  registerSocialsCommands();
  
  console.log('All terminal commands registered successfully');
}