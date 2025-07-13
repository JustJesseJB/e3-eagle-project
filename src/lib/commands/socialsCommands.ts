import { TerminalEntry } from '@/contexts/TerminalContext';
import { commandRegistry, CommandHandler } from './commandProcessor';

// Social media platforms
const PLATFORMS = {
  twitter: {
    name: 'Twitter',
    url: 'https://twitter.com/intent/tweet',
    shareText: 'Just connected to the E3 Eagle Terminal! Check out this unique NFT project on Solana. #E3Eagles #Solana #NFT'
  },
  discord: {
    name: 'Discord',
    url: 'https://discord.gg/e3eagles', // Replace with actual Discord invite
    shareText: 'Join the E3 Eagles community on Discord!'
  },
  telegram: {
    name: 'Telegram',
    url: 'https://t.me/e3eagles', // Replace with actual Telegram group
    shareText: 'Join the E3 Eagles community on Telegram!'
  }
};

// Socials command - shows social media options
export const handleSocialsCommand: CommandHandler = async (args: string[]): Promise<TerminalEntry[]> => {
  // If specific platform is mentioned, handle it
  if (args.length > 0) {
    const platform = args[0].toLowerCase();
    
    if (platform === 'twitter' || platform === 'x' || platform === '1') {
      return handleTwitterCommand(args.slice(1));
    } else if (platform === 'discord' || platform === '2') {
      return handleDiscordCommand(args.slice(1));
    } else if (platform === 'telegram' || platform === 'tg' || platform === '3') {
      return handleTelegramCommand(args.slice(1));
    }
  }

  // Otherwise show list of social platforms
  return [
    { type: 'system', text: 'E3 SOCIAL CONNECTIONS:' },
    { type: 'command', text: '1. Twitter - Share your Eagles & project updates' },
    { type: 'command', text: '2. Discord - Join the Eagles community server' },
    { type: 'command', text: '3. Telegram - Connect with the Telegram group' },
    { type: 'system', text: 'Enter "/socials [platform]" to connect' },
    { type: 'system', text: 'Example: "/socials twitter"' }
  ];
};

// Twitter command - integrates with Twitter
export const handleTwitterCommand: CommandHandler = async (args: string[]): Promise<TerminalEntry[]> => {
  const customMessage = args.join(' ');
  const shareText = customMessage || PLATFORMS.twitter.shareText;
  
  // Encode the share text for a URL
  const encodedText = encodeURIComponent(shareText);
  const twitterUrl = `${PLATFORMS.twitter.url}?text=${encodedText}`;
  
  return [
    { type: 'system', text: 'Preparing Twitter share...' },
    { type: 'data', text: `Message: "${shareText}"` },
    { type: 'success', text: 'Twitter share link generated' },
    { type: 'system', text: `Link: ${twitterUrl}` },
    { 
      type: 'system', 
      text: '(In the final implementation, this would open a new browser tab with the pre-filled tweet)' 
    }
  ];
};

// Discord command - connects to Discord
export const handleDiscordCommand: CommandHandler = async (): Promise<TerminalEntry[]> => {
  return [
    { type: 'system', text: 'Connecting to E3 Eagles Discord community...' },
    { type: 'success', text: 'Discord invite link generated' },
    { type: 'system', text: `Link: ${PLATFORMS.discord.url}` },
    { 
      type: 'system', 
      text: '(In the final implementation, this would open the Discord invite in a new tab)' 
    }
  ];
};

// Telegram command - connects to Telegram
export const handleTelegramCommand: CommandHandler = async (): Promise<TerminalEntry[]> => {
  return [
    { type: 'system', text: 'Connecting to E3 Eagles Telegram group...' },
    { type: 'success', text: 'Telegram group link generated' },
    { type: 'system', text: `Link: ${PLATFORMS.telegram.url}` },
    { 
      type: 'system', 
      text: '(In the final implementation, this would open the Telegram group in a new tab)' 
    }
  ];
};

// Share command - for sharing to social media
export const handleShareCommand: CommandHandler = async (args: string[]): Promise<TerminalEntry[]> => {
  if (args.length < 2) {
    return [
      { type: 'error', text: 'Please specify a platform and message to share.' },
      { type: 'system', text: 'Usage: /share [platform] [message]' },
      { type: 'system', text: 'Example: /share twitter Just minted my first Eagle NFT!' }
    ];
  }
  
  const platform = args[0].toLowerCase();
  const message = args.slice(1).join(' ');
  
  if (platform === 'twitter' || platform === 'x') {
    return handleTwitterCommand([message]);
  } else if (platform === 'discord') {
    return [
      { type: 'warning', text: 'Direct message sharing to Discord is not supported.' },
      { type: 'system', text: 'Join our Discord server to share your message:' },
      { type: 'system', text: PLATFORMS.discord.url }
    ];
  } else if (platform === 'telegram' || platform === 'tg') {
    return [
      { type: 'warning', text: 'Direct message sharing to Telegram is not supported.' },
      { type: 'system', text: 'Join our Telegram group to share your message:' },
      { type: 'system', text: PLATFORMS.telegram.url }
    ];
  } else {
    return [
      { type: 'error', text: `Unsupported platform: ${platform}` },
      { type: 'system', text: 'Supported platforms: twitter, discord, telegram' }
    ];
  }
};

// Register social commands
export function registerSocialsCommands(): void {
  commandRegistry.register('/socials', handleSocialsCommand);
  commandRegistry.register('/twitter', handleTwitterCommand);
  commandRegistry.register('/discord', handleDiscordCommand);
  commandRegistry.register('/telegram', handleTelegramCommand);
  commandRegistry.register('/share', handleShareCommand);
}