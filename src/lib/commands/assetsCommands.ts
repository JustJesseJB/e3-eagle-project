import { TerminalEntry } from '@/contexts/TerminalContext';
import { commandRegistry, CommandHandler } from './commandProcessor';

// Demo NFT data - in a real implementation this would come from the blockchain
const demoNFTs = [
  {
    id: 'E3G-001',
    name: 'Eagle Guardian Alpha',
    image: 'eagle_guardian_alpha.png',
    rarity: 'Legendary',
    traits: {
      plumage: 'Iridescent Gold',
      eyes: 'Sapphire',
      beak: 'Titanium',
      background: 'Nebula',
      accessories: 'Quantum Shield'
    },
    mintDate: new Date('2025-07-01').getTime()
  },
  {
    id: 'E3G-042',
    name: 'Shadow Wing',
    image: 'shadow_wing.png',
    rarity: 'Epic',
    traits: {
      plumage: 'Midnight Black',
      eyes: 'Crimson',
      beak: 'Obsidian',
      background: 'Eclipse',
      accessories: 'Stealth Visor'
    },
    mintDate: new Date('2025-07-02').getTime()
  },
  {
    id: 'E3G-103',
    name: 'Storm Talon',
    image: 'storm_talon.png',
    rarity: 'Rare',
    traits: {
      plumage: 'Electric Blue',
      eyes: 'Lightning White',
      beak: 'Steel',
      background: 'Thunderstorm',
      accessories: 'Voltage Gauntlets'
    },
    mintDate: new Date('2025-07-03').getTime()
  }
];

// Function to get rarity color for display
function getRarityColor(rarity: string): string {
  switch(rarity) {
    case 'Common': return 'text-gray-400';
    case 'Rare': return 'text-blue-400';
    case 'Epic': return 'text-purple-400';
    case 'Legendary': return 'text-yellow-400';
    default: return 'text-white';
  }
}

// Assets command - shows the user's NFT assets
export const handleAssetsCommand: CommandHandler = async (): Promise<TerminalEntry[]> => {
  const response: TerminalEntry[] = [
    { type: 'system', text: 'Scanning wallet for Eagle NFTs...' },
  ];
  
  // Simulate loading time
  await new Promise(resolve => setTimeout(resolve, 500));
  
  if (demoNFTs.length === 0) {
    response.push(
      { type: 'warning', text: 'No Eagles found in connected wallet.' },
      { type: 'system', text: 'Use "/mint" to acquire your first Eagle NFT.' }
    );
    return response;
  }
  
  response.push(
    { type: 'success', text: `Found ${demoNFTs.length} Eagles in your collection:` }
  );
  
  // Add each NFT to the response
  demoNFTs.forEach(nft => {
    response.push({
      type: 'data',
      text: `${nft.id}: ${nft.name} (${nft.rarity}) - Minted: ${new Date(nft.mintDate).toLocaleDateString()}`,
      eagleId: nft.id // This will be used for interaction in the UI
    });
  });
  
  response.push(
    { type: 'system', text: 'Click on an Eagle ID to view details' },
    { type: 'system', text: 'or use "/inspect [eagle-id]" for detailed information.' }
  );
  
  return response;
};

// Inspect command - shows detailed information about a specific NFT
export const handleInspectCommand: CommandHandler = async (args: string[]): Promise<TerminalEntry[]> => {
  if (args.length === 0) {
    return [
      { type: 'error', text: 'Please specify an Eagle ID to inspect.' },
      { type: 'system', text: 'Usage: /inspect [eagle-id]' },
      { type: 'system', text: 'Example: /inspect E3G-001' }
    ];
  }
  
  const eagleId = args[0].toUpperCase();
  const eagle = demoNFTs.find(nft => nft.id === eagleId);
  
  if (!eagle) {
    return [
      { type: 'error', text: `Eagle with ID "${eagleId}" not found in your collection.` },
      { type: 'system', text: 'Use "/assets" to view your Eagles.' }
    ];
  }
  
  // Simulate loading time
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return [
    { type: 'system', text: `--- EAGLE INSPECTION: ${eagle.id} ---` },
    { type: 'data', text: `Name: ${eagle.name}` },
    { type: 'data', text: `Rarity: ${eagle.rarity}` },
    { type: 'data', text: `Mint Date: ${new Date(eagle.mintDate).toLocaleString()}` },
    { type: 'data', text: '---' },
    { type: 'data', text: 'TRAITS:' },
    { type: 'data', text: `• Plumage: ${eagle.traits.plumage}` },
    { type: 'data', text: `• Eyes: ${eagle.traits.eyes}` },
    { type: 'data', text: `• Beak: ${eagle.traits.beak}` },
    { type: 'data', text: `• Background: ${eagle.traits.background}` },
    { type: 'data', text: `• Accessories: ${eagle.traits.accessories}` },
    { type: 'data', text: '---' },
    { type: 'system', text: 'ACTIONS:' },
    { type: 'command', text: `/showcase ${eagle.id} - Showcase this Eagle in community chat` },
    { type: 'command', text: `/marketplace view ${eagle.id} - View on marketplace` }
  ];
};

// Register assets commands
export function registerAssetsCommands(): void {
  commandRegistry.register('/assets', handleAssetsCommand);
  commandRegistry.register('/inspect', handleInspectCommand);
}