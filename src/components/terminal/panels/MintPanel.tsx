// src/components/terminal/panels/MintPanel.tsx

'use client';
import { useState } from 'react';
import { useWalletIntegration } from '@/contexts/WalletContext';
import { useTerminal } from '@/contexts/TerminalContext';

export default function MintPanel() {
  const [mintQuantity, setMintQuantity] = useState(1);
  const [mintingInProgress, setMintingInProgress] = useState(false);
  
  const { connected, connectWallet, simulateWalletConnection } = useWalletIntegration();
  const { addEntries } = useTerminal();
  
  // Generate random Eagle NFT data
  const generateRandomEagle = () => {
    const rarities = ['Common', 'Rare', 'Epic', 'Legendary'];
    const rarityWeights = [0.6, 0.25, 0.1, 0.05];
    const traitCategories = [
      ['Red Eyes', 'Blue Eyes', 'Green Eyes', 'Purple Eyes'],
      ['Battle Scar', 'Gold Beak', 'Titanium Claws', 'None'],
      ['Alpha Plumage', 'Steel Feathers', 'Royal Crown', 'None'],
      ['Mountain Background', 'Space Background', 'Ocean Background', 'Desert Background']
    ];
    
    // Determine rarity
    const rarityRoll = Math.random();
    let rarityIndex = 0;
    let accumWeight = 0;
    
    for (let i = 0; i < rarityWeights.length; i++) {
      accumWeight += rarityWeights[i];
      if (rarityRoll <= accumWeight) {
        rarityIndex = i;
        break;
      }
    }
    
    const rarity = rarities[rarityIndex];
    
    // Generate traits (1-3 traits based on rarity)
    const traitCount = Math.min(1 + rarityIndex, 3);
    const traits: string[] = [];
    
    for (let i = 0; i < traitCount; i++) {
      const category = traitCategories[i];
      const trait = category[Math.floor(Math.random() * category.length)];
      if (trait !== 'None') {
        traits.push(trait);
      }
    }
    
    // Generate power level based on rarity
    const basePower = [10, 30, 60, 100][rarityIndex];
    const powerVariance = basePower * 0.2; // 20% variance
    const power = Math.floor(basePower + (Math.random() * 2 - 1) * powerVariance);
    
    return {
      id: `Eagle #${Math.floor(Math.random() * 10000)}`,
      rarity,
      traits,
      power
    };
  };
  
  // Handle NFT minting
  const handleMint = async () => {
    // Check if wallet is connected
    if (!connected) {
      addEntries([
        { type: 'error' as const, text: 'ERROR: Wallet not connected' },
        { type: 'system' as const, text: 'Use /connect to connect your wallet before minting' }
      ]);
      return;
    }
    
    setMintingInProgress(true);
    
    // Simulate blockchain delay
    setTimeout(() => {
      const newMints = [];
      for (let i = 0; i < mintQuantity; i++) {
        newMints.push(generateRandomEagle());
      }
      
      setMintingInProgress(false);
      
      // Add to terminal history
      const responses = [
        { type: 'system' as const, text: `Processing mint transaction...` },
        { type: 'success' as const, text: `Successfully minted ${mintQuantity} E3 Eagle${mintQuantity > 1 ? 's' : ''}!` },
        { type: 'data' as const, text: newMints.map(eagle => eagle.id).join(', ') }
      ];
      
      addEntries(responses);
      
    }, 3000); // 3 second simulated blockchain time
  };
  
  // Simulate wallet connection (for testing only)
  const handleSimulateWallet = () => {
    try {
      // Use the simulateWalletConnection function directly
      simulateWalletConnection();
      
      // Notify the user in the terminal
      addEntries([
        { type: 'system' as const, text: 'Simulating wallet connection...' },
        { type: 'success' as const, text: 'Connected to simulated wallet: 8xH5f...q3B7' }
      ]);
    } catch (error) {
      console.error('Error simulating wallet:', error);
      addEntries([
        { type: 'error' as const, text: 'Failed to simulate wallet connection' },
        { type: 'system' as const, text: 'Please refresh the page and try again' }
      ]);
    }
  };
  
  return (
    <div>
      <div className="mb-4 text-center">
        <div className="inline-block p-1 border border-cyan-500/50 rounded mb-2">
          <div 
            className="w-40 h-40 bg-gradient-to-r from-blue-900 to-purple-900 flex items-center justify-center"
          >
            <img 
              src="https://i.ibb.co/VVc9kvL/eagle-nft.jpg" 
              alt="E3 Eagle NFT" 
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYwIiBoZWlnaHQ9IjE2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMkQzNzQ4Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMjAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGFsaWdubWVudC1iYXNlbGluZT0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlLCBzYW5zLXNlcmlmIiBmaWxsPSIjOEJFOUZEIj5FM0VhZ2xlIE5GVDwvdGV4dD48L3N2Zz4=';
              }}
            />
          </div>
        </div>
        <div className="text-cyan-400 text-sm">E3 EAGLE NFT</div>
        <div className="text-gray-400 text-xs">Series Alpha</div>
      </div>
      
      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Price:</span>
          <span className="text-white">1.5 SOL</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Available:</span>
          <span className="text-white">731 / 1000</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Status:</span>
          <span className="text-green-400">LIVE</span>
        </div>
        
        <div className="flex items-center justify-between mt-2 mb-4">
          <span className="text-gray-400">Quantity:</span>
          <div className="flex items-center">
            <button 
              className="w-8 h-8 bg-gray-800 text-white flex items-center justify-center rounded-l touch-manipulation"
              onClick={() => mintQuantity > 1 && setMintQuantity(mintQuantity - 1)}
            >-</button>
            <div className="w-10 h-8 bg-gray-900 text-white flex items-center justify-center">
              {mintQuantity}
            </div>
            <button 
              className="w-8 h-8 bg-gray-800 text-white flex items-center justify-center rounded-r touch-manipulation"
              onClick={() => mintQuantity < 5 && setMintQuantity(mintQuantity + 1)}
            >+</button>
          </div>
        </div>
        
        <div className="pt-2">
          <button 
            className={`w-full ${
              mintingInProgress || !connected
                ? 'bg-gray-700 text-gray-300' 
                : 'bg-gradient-to-r from-cyan-900 to-blue-900 hover:from-cyan-800 hover:to-blue-800 text-cyan-300'
            } p-3 rounded border border-cyan-700/50 transition relative touch-manipulation`}
            onClick={handleMint}
            disabled={mintingInProgress || !connected}
          >
            {mintingInProgress ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin mr-2 h-4 w-4 border-2 border-cyan-300 border-t-transparent rounded-full"></div>
                MINTING...
              </div>
            ) : !connected ? (
              'CONNECT WALLET FIRST'
            ) : (
              'MINT E3 EAGLE'
            )}
          </button>
        </div>
        
        {!connected && (
          <div className="pt-2">
            <button 
              className="w-full bg-gray-800 text-yellow-300 p-2 rounded border border-yellow-700/50 transition touch-manipulation"
              onClick={handleSimulateWallet}
            >
              SIMULATE WALLET CONNECTION
            </button>
          </div>
        )}
        
        <div className="text-gray-600 text-xs text-center mt-2">
          ENCRYPTED TRANSACTION PROTOCOL
        </div>
      </div>
    </div>
  );
}