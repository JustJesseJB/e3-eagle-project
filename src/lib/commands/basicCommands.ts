import { TerminalEntry } from '@/contexts/TerminalContext';
import { commandRegistry, CommandHandler } from './commandProcessor';

// Help command - displays available commands
export const handleHelpCommand: CommandHandler = async (args: string[]): Promise<TerminalEntry[]> => {
  const commands = [
    { type: 'system', text: 'E3 TERMINAL COMMAND INDEX:' },
    { type: 'command', text: '-- CORE COMMANDS --' },
    { type: 'command', text: '/help - Show available commands' },
    { type: 'command', text: '/connect - Connect wallet' },
    { type: 'command', text: '/clear - Clear terminal' },
    { type: 'command', text: '-- NFT COMMANDS --' },
    { type: 'command', text: '/mint - Open mint interface' },
    { type: 'command', text: '/assets - View your Eagle collection' },
    { type: 'command', text: '-- COMMUNITY --' },
    { type: 'command', text: '/chat - Open community channel' },
    { type: 'command', text: '/socials - Access social media sharing' },
    { type: 'command', text: '/marketplace - Access NFT marketplaces' },
  ];
  
  // Add easter egg with small probability
  if (Math.random() > 0.8) {
    commands.push({ type: 'hidden', text: 'Additional commands exist but are not documented...' });
  }
  
  return commands as TerminalEntry[];
};

// Clear command - clears the terminal history
export const handleClearCommand: CommandHandler = async (): Promise<TerminalEntry[]> => {
  // This command will return an empty array,
  // and the terminal component will clear the history
  return [];
};

// Version command - shows terminal version
export const handleVersionCommand: CommandHandler = async (): Promise<TerminalEntry[]> => {
  return [
    { type: 'system', text: 'EAGLE-TERM v0.3.7 [ALPHA]' },
    { type: 'data', text: 'Build: 20250706.1' },
    { type: 'data', text: 'Solana Network: DEVNET' },
    { type: 'data', text: 'Runtime: NEXT.JS 15.3.4' },
  ];
};

// Assets command - renamed from 'gallery'
export const handleAssetsCommand: CommandHandler = async (): Promise<TerminalEntry[]> => {
  return [
    { type: 'system', text: 'Scanning wallet for Eagle NFTs...' },
    { type: 'system', text: 'Please connect a wallet to view your assets.' },
    // In the real implementation, this would scan the connected wallet
    // for NFTs and display them
  ];
};

// Socials command - for social media integration
export const handleSocialsCommand: CommandHandler = async (): Promise<TerminalEntry[]> => {
  return [
    { type: 'system', text: 'E3 SOCIAL CONNECTIONS:' },
    { type: 'command', text: '- Twitter: @E3_Eagle_Project' },
    { type: 'command', text: '- Discord: discord.gg/e3eagle' },
    { type: 'command', text: '- Telegram: t.me/e3eagle' },
    { type: 'system', text: 'Use "/share [platform] [message]" to post about your Eagles' },
  ];
};

// Marketplace command - for NFT marketplace integrations
export const handleMarketplaceCommand: CommandHandler = async (): Promise<TerminalEntry[]> => {
  return [
    { type: 'system', text: 'MARKETPLACE ACCESS:' },
    { type: 'command', text: '1. Tensor.Trade - Trade Eagles with advanced tools' },
    { type: 'command', text: '2. Magic Eden - Largest Solana NFT marketplace' },
    { type: 'system', text: 'Enter marketplace number to proceed:' },
    // In the real implementation, this would offer integration with
    // these marketplaces, potentially opening them in a new tab or iframe
  ];
};

// Echo command - repeats what the user typed (useful for testing)
export const handleEchoCommand: CommandHandler = async (args: string[]): Promise<TerminalEntry[]> => {
  const message = args.join(' ');
  return [
    { type: 'data', text: message || 'You did not provide any text to echo.' }
  ];
};

// Register all basic commands
export function registerBasicCommands(): void {
  commandRegistry.register('/help', handleHelpCommand);
  commandRegistry.register('/clear', handleClearCommand);
  commandRegistry.register('/version', handleVersionCommand);
  commandRegistry.register('/assets', handleAssetsCommand);
  commandRegistry.register('/socials', handleSocialsCommand);
  commandRegistry.register('/marketplace', handleMarketplaceCommand);
  commandRegistry.register('/echo', handleEchoCommand);
}