// src/lib/commands/chatCommands.ts

import { TerminalEntry } from '@/contexts/TerminalContext';
import { commandRegistry, CommandHandler } from './commandProcessor';
import { useWalletIntegration } from '@/contexts/WalletContext';
import { useAssets } from '@/contexts/AssetsContext';
import { shortenAddress } from '@/utils/addresses';

// Helper function to get wallet and assets context outside of React components
let walletIntegration: ReturnType<typeof useWalletIntegration> | null = null;
let assetsContext: ReturnType<typeof useAssets> | null = null;

export function setChatContexts(
  wallet: ReturnType<typeof useWalletIntegration>,
  assets: ReturnType<typeof useAssets>
): void {
  walletIntegration = wallet;
  assetsContext = assets;
  console.log("Chat contexts set in commands");
}

// Demo users for the chat feature
const chatUsers = [
  {
    name: 'EagleOne',
    color: 'text-purple-400'
  },
  {
    name: 'Talon42',
    color: 'text-green-400'
  },
  {
    name: 'WingCommander',
    color: 'text-yellow-400'
  },
  {
    name: 'NestWatcher',
    color: 'text-cyan-400'
  },
  {
    name: 'DigitalEagle',
    color: 'text-red-400'
  }
];

// Chat command - opens the chat panel
export const handleChatCommand: CommandHandler = async (): Promise<TerminalEntry[]> => {
  return [
    { type: 'system', text: 'Opening community chat panel...' }
  ];
};

// Showcase command - displays an Eagle in the chat
export const handleShowcaseCommand: CommandHandler = async (args: string[]): Promise<TerminalEntry[]> => {
  if (!walletIntegration || !assetsContext) {
    return [
      { type: 'error', text: 'Context not available for showcase command' },
      { type: 'system', text: 'Please try again or refresh the page' }
    ];
  }

  // Check if wallet is connected
  if (!walletIntegration.connected) {
    return [
      { type: 'error', text: 'Wallet not connected' },
      { type: 'system', text: 'Please connect your wallet first with /connect' }
    ];
  }

  // Check if eagle ID was provided
  if (!args.length) {
    return [
      { type: 'error', text: 'No Eagle ID provided' },
      { type: 'system', text: 'Usage: /showcase [eagle-id]' }
    ];
  }

  const eagleId = args[0].toUpperCase();
  
  // Find the eagle in the user's collection
  const eagle = assetsContext.eagles.find(e => e.id === eagleId);
  
  if (!eagle) {
    return [
      { type: 'error', text: `Eagle with ID "${eagleId}" not found in your collection.` },
      { type: 'system', text: 'Use "/assets" to view your Eagles.' }
    ];
  }

  // Get a random response from a community member
  const randomUser = chatUsers[Math.floor(Math.random() * chatUsers.length)];
  const responses = [
    "wow, that's an amazing Eagle!",
    "nice find! I've been looking for one like that.",
    "the rarity on that one is insane!",
    "those traits are super rare, congrats!",
    "I'll give you 50 SOL for that right now!",
    "that's one of the best Eagles I've seen!",
    "the coloring on that one is perfect.",
    "holy moly, when did you mint that?",
    "that's got to be worth a fortune!"
  ];
  const randomResponse = responses[Math.floor(Math.random() * responses.length)];

  // Format the eagle's traits for display
  let traitsText = "";
  if (Array.isArray(eagle.traits)) {
    traitsText = eagle.traits.join(", ");
  } else if (typeof eagle.traits === 'object' && eagle.traits !== null) {
    const traits = eagle.traits as any;
    traitsText = Object.entries(traits)
      .map(([key, value]) => `${key}: ${value}`)
      .join(", ");
  }

  return [
    { type: 'system', text: `Showcasing ${eagle.id} in community chat...` },
    { type: 'success', text: `You shared ${eagle.id} (${eagle.rarity})` },
    { type: 'system', text: `--- COMMUNITY CHAT ---` },
    { type: 'data', text: `You: Check out my ${eagle.rarity} Eagle - ${eagle.id}!` },
    { type: 'data', text: `You: It has the following traits: ${traitsText}` },
    { type: 'data', text: `${randomUser.name}: ${randomResponse}` },
    { type: 'data', text: `System: Eagle ${eagle.id} has been added to the showcase channel.` }
  ];
};

// Register chat commands
export function registerChatCommands(): void {
  commandRegistry.register('/chat', handleChatCommand);
  commandRegistry.register('/showcase', handleShowcaseCommand);
  console.log("Chat commands registered");
}