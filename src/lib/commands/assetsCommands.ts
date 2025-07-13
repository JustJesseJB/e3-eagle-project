// src/lib/commands/assetsCommands.ts

import { TerminalEntry } from '@/contexts/TerminalContext';
import { commandRegistry, CommandHandler } from './commandProcessor';
import { useAssets, Eagle } from '@/contexts/AssetsContext';

// Helper function to get assets context outside of React components
let assetsContext: ReturnType<typeof useAssets> | null = null;

export function setAssetsContext(context: ReturnType<typeof useAssets>) {
  assetsContext = context;
  console.log("Assets context set in commands", assetsContext);
}

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

// Demo NFT data - this will be used only if assets context is not available
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
    mintDate: new Date('2025-07-01').getTime(),
    power: 95
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
    mintDate: new Date('2025-07-02').getTime(),
    power: 78
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
    mintDate: new Date('2025-07-03').getTime(),
    power: 62
  }
];

// Assets command - shows user's Eagle NFTs
export const handleAssetsCommand: CommandHandler = async (): Promise<TerminalEntry[]> => {
  const response: TerminalEntry[] = [
    { type: 'system', text: 'Scanning wallet for Eagle NFTs...' },
  ];
  
  // Simulate loading time
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Use Eagles from context if available, otherwise fall back to demo data
  const eagles = assetsContext?.eagles || [];
  
  if (eagles.length === 0) {
    response.push(
      { type: 'warning', text: 'No Eagles found in connected wallet.' },
      { type: 'system', text: 'Use "/mint" to acquire your first Eagle NFT.' }
    );
    return response;
  }
  
  response.push(
    { type: 'success', text: `Found ${eagles.length} Eagles in your collection:` }
  );
  
  // Add each eagle to the response
  eagles.forEach(eagle => {
    const mintDate = typeof eagle.mintDate === 'string' 
      ? eagle.mintDate 
      : new Date(eagle.mintDate).toLocaleDateString();
      
    response.push({
      type: 'data',
      text: `${eagle.id}: ${eagle.name} (${eagle.rarity}) - Minted: ${mintDate}`,
      eagleId: eagle.id // This will be used for interaction in the UI
    });
  });
  
  response.push(
    { type: 'system', text: 'Click on an Eagle ID to view details' },
    { type: 'system', text: 'or use "/inspect [eagle-id]" for detailed information.' }
  );
  
  return response;
};

// Inspect command - shows details for a specific Eagle
export const handleInspectCommand: CommandHandler = async (args: string[]): Promise<TerminalEntry[]> => {
  if (args.length === 0) {
    return [
      { type: 'error', text: 'Please specify an Eagle ID to inspect.' },
      { type: 'system', text: 'Usage: /inspect [eagle-id]' },
      { type: 'system', text: 'Example: /inspect E3G-001' }
    ];
  }
  
  const eagleId = args[0].toUpperCase();
  
  // Try to get eagle from context, fall back to demo data if context not available
  let eagle: Eagle | undefined;
  
  if (assetsContext) {
    eagle = assetsContext.eagles.find(e => e.id === eagleId);
    
    // If found, set as selected eagle for modal display
    if (eagle) {
      assetsContext.setSelectedEagle(eagle);
    }
  } else {
    // Fall back to demo data if context not available
    eagle = demoNFTs.find(nft => nft.id === eagleId) as any;
  }
  
  if (!eagle) {
    return [
      { type: 'error', text: `Eagle with ID "${eagleId}" not found in your collection.` },
      { type: 'system', text: 'Use "/assets" to view your Eagles.' }
    ];
  }
  
  // Simulate loading time
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Create response with basic eagle info
  const response: TerminalEntry[] = [
    { type: 'system', text: `--- EAGLE INSPECTION: ${eagle.id} ---` },
    { type: 'data', text: `Name: ${eagle.name}` },
    { type: 'data', text: `Rarity: ${eagle.rarity}` }
  ];
  
  // Handle mintDate based on format
  if (typeof eagle.mintDate === 'string') {
    response.push({ type: 'data', text: `Mint Date: ${eagle.mintDate}` });
  } else if (typeof eagle.mintDate === 'number') {
    response.push({ type: 'data', text: `Mint Date: ${new Date(eagle.mintDate).toLocaleString()}` });
  }
  
  response.push({ type: 'data', text: '---' });
  response.push({ type: 'data', text: 'TRAITS:' });
  
  // Handle traits based on format (object or array)
  if (Array.isArray(eagle.traits)) {
    // If traits is an array (new format)
    eagle.traits.forEach(trait => {
      response.push({ type: 'data', text: `• ${trait}` });
    });
  } else if (typeof eagle.traits === 'object' && eagle.traits !== null) {
    // If traits is an object (original format)
    const traits = eagle.traits as any;
    Object.keys(traits).forEach(key => {
      response.push({ type: 'data', text: `• ${key.charAt(0).toUpperCase() + key.slice(1)}: ${traits[key]}` });
    });
  }
  
  response.push({ type: 'data', text: '---' });
  response.push({ type: 'system', text: 'ACTIONS:' });
  response.push({ type: 'command', text: `/showcase ${eagle.id} - Showcase this Eagle in community chat` });
  response.push({ type: 'command', text: `/marketplace view ${eagle.id} - View on marketplace` });
  
  return response;
};

// Register assets commands
export function registerAssetsCommands(): void {
  commandRegistry.register('/assets', handleAssetsCommand);
  commandRegistry.register('/inspect', handleInspectCommand);
  console.log("Assets commands registered");
}