// src/lib/commands/marketplaceCommands.ts

import { TerminalEntry } from '@/contexts/TerminalContext';
import { commandRegistry, CommandHandler } from './commandProcessor';

// List of supported marketplaces
const MARKETPLACES = {
  tensor: {
    name: 'Tensor.Trade',
    url: 'https://tensor.trade/trade',
    description: 'Advanced trading tools with liquidity pools and concentrated orderbooks',
    collectionId: 'e3eagles'
  },
  magiceden: {
    name: 'Magic Eden',
    url: 'https://magiceden.io/marketplace',
    description: 'Largest Solana NFT marketplace with simple user interface',
    collectionId: 'e3eagles'
  },
  hyperspace: {
    name: 'Hyperspace',
    url: 'https://hyperspace.xyz/collection',
    description: 'Multi-chain NFT marketplace with analytics tools',
    collectionId: 'e3eagles'
  }
};

// Function to open URLs
const openURL = (url: string): void => {
  if (typeof window !== 'undefined') {
    // Open in a new tab
    window.open(url, '_blank');
  }
};

// Marketplace command - shows marketplace options
export const handleMarketplaceCommand: CommandHandler = async (args: string[]): Promise<TerminalEntry[]> => {
  // If specific marketplace is mentioned, handle it
  if (args.length > 0) {
    const marketplaceName = args[0].toLowerCase();
    
    if (marketplaceName === 'tensor' || marketplaceName === '1') {
      return handleTensorCommand(args.slice(1));
    } else if (marketplaceName === 'magiceden' || marketplaceName === '2') {
      return handleMagicEdenCommand(args.slice(1));
    } else if (marketplaceName === 'hyperspace' || marketplaceName === '3') {
      return handleHyperspaceCommand(args.slice(1));
    }
  }

  // Otherwise show list of marketplaces
  return [
    { type: 'system', text: 'MARKETPLACE ACCESS:' },
    { type: 'command', text: '1. Tensor.Trade - Advanced trading with liquidity pools' },
    { type: 'command', text: '2. Magic Eden - Largest Solana NFT marketplace' },
    { type: 'command', text: '3. Hyperspace - Multi-chain NFT marketplace with analytics' },
    { type: 'system', text: 'Enter "/marketplace [number]" or "/marketplace [name]" to proceed' },
    { type: 'system', text: 'Example: "/marketplace 1" or "/marketplace tensor"' }
  ];
};

// Tensor command - integrates with Tensor.Trade
export const handleTensorCommand: CommandHandler = async (args: string[]): Promise<TerminalEntry[]> => {
  // Build the URL for the collection on Tensor
  const marketplace = MARKETPLACES.tensor;
  const collectionUrl = `${marketplace.url}/${marketplace.collectionId}`;
  
  // Open the URL in a new tab
  openURL(collectionUrl);
  
  return [
    { type: 'system', text: 'Connecting to Tensor.Trade marketplace...' },
    { type: 'success', text: 'Connection established to Tensor.Trade' },
    { type: 'data', text: `Collection URL: ${collectionUrl}` },
    { type: 'system', text: 'Opening Tensor.Trade in a new window...' }
  ];
};

// Magic Eden command - integrates with Magic Eden
export const handleMagicEdenCommand: CommandHandler = async (args: string[]): Promise<TerminalEntry[]> => {
  // Build the URL for the collection on Magic Eden
  const marketplace = MARKETPLACES.magiceden;
  const collectionUrl = `${marketplace.url}/${marketplace.collectionId}`;
  
  // Open the URL in a new tab
  openURL(collectionUrl);
  
  return [
    { type: 'system', text: 'Connecting to Magic Eden marketplace...' },
    { type: 'success', text: 'Connection established to Magic Eden' },
    { type: 'data', text: `Collection URL: ${collectionUrl}` },
    { type: 'system', text: 'Opening Magic Eden in a new window...' }
  ];
};

// Hyperspace command - integrates with Hyperspace
export const handleHyperspaceCommand: CommandHandler = async (args: string[]): Promise<TerminalEntry[]> => {
  // Build the URL for the collection on Hyperspace
  const marketplace = MARKETPLACES.hyperspace;
  const collectionUrl = `${marketplace.url}/${marketplace.collectionId}`;
  
  // Open the URL in a new tab
  openURL(collectionUrl);
  
  return [
    { type: 'system', text: 'Connecting to Hyperspace marketplace...' },
    { type: 'success', text: 'Connection established to Hyperspace' },
    { type: 'data', text: `Collection URL: ${collectionUrl}` },
    { type: 'system', text: 'Opening Hyperspace in a new window...' }
  ];
};

// Register marketplace commands
export function registerMarketplaceCommands(): void {
  commandRegistry.register('/marketplace', handleMarketplaceCommand);
  commandRegistry.register('/tensor', handleTensorCommand);
  commandRegistry.register('/magiceden', handleMagicEdenCommand);
  commandRegistry.register('/hyperspace', handleHyperspaceCommand);
}