// src/components/terminal/panels/MintPanel.tsx

'use client';
import { useState } from 'react';
import { useWalletIntegration } from '@/contexts/WalletContext';
import { useTerminal, TerminalEntry } from '@/contexts/TerminalContext';
import { useAdmin } from '@/contexts/AdminContext';
import { useAssets, Eagle } from '@/contexts/AssetsContext';

export default function MintPanel() {
  const [mintQuantity, setMintQuantity] = useState(1);
  const [mintingInProgress, setMintingInProgress] = useState(false);
  
  const { connected, connectWallet, simulateWalletConnection, setShowWalletModal } = useWalletIntegration();
  const { addEntries } = useTerminal();
  const { config } = useAdmin();
  const { addEagle } = useAssets();
  
  // Define rarities with proper type
  const rarities: string[] = ['Common', 'Rare', 'Epic', 'Legendary'];
  const rarityWeights: number[] = [0.6, 0.25, 0.1, 0.05];
  
  // Generate random Eagle NFT data
  const generateRandomEagle = (): Eagle => {
    const traitCategories: string[][] = [
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
    
    // Generate a unique eagle ID
    const idNumber = Math.floor(100 + Math.random() * 900); // 3-digit number between 100-999
    
    const names: Record<string, string[]> = {
      'Common': ['Scout', 'Hunter', 'Striker', 'Observer'],
      'Rare': ['Storm Talon', 'Sky Watcher', 'Dawn Rider', 'Cloud Striker'],
      'Epic': ['Shadow Wing', 'Thunder Beak', 'Frost Claw', 'Solar Gaze'],
      'Legendary': ['Eagle Guardian', 'Celestial Sovereign', 'Eternal Watcher', 'Quantum Eagle']
    };
    
    const nameOptions = names[rarity] || names['Common'];
    const name = nameOptions[Math.floor(Math.random() * nameOptions.length)];
    
    return {
      id: `E3D-${idNumber}`,
      name: `${name} ${rarity === 'Legendary' ? 'Alpha' : rarity === 'Epic' ? 'Prime' : ''}`,
      rarity,
      traits,
      power,
      mintDate: new Date().toLocaleString(),
      image: 'https://i.ibb.co/VVc9kvL/eagle-nft.jpg'
    };
  };
  
  // Handle NFT minting
  const handleMint = async () => {
    // Check if wallet is connected
    if (!connected) {
      addEntries([
        { type: 'error', text: 'ERROR: Wallet not connected' },
        { type: 'system', text: 'Use /connect to connect your wallet before minting' }
      ]);
      return;
    }
    
    // Check if minting is enabled in admin settings
    if (!config.mintEnabled) {
      addEntries([
        { type: 'error', text: 'ERROR: Minting is currently disabled' },
        { type: 'system', text: 'Please try again later' }
      ]);
      return;
    }
    
    setMintingInProgress(true);
    
    // Simulate blockchain delay
    setTimeout(() => {
      const newMints: Eagle[] = [];
      for (let i = 0; i < mintQuantity; i++) {
        const newEagle = generateRandomEagle();
        newMints.push(newEagle);
        
        // Add to assets context
        addEagle(newEagle);
      }
      
      setMintingInProgress(false);
      
      // Add to terminal history
      // Create an array of TerminalEntry objects with explicit types
      const responses: TerminalEntry[] = [
        { type: 'system', text: `Processing mint transaction...` },
        { type: 'success', text: `Successfully minted ${mintQuantity} E3 Eagle${mintQuantity > 1 ? 's' : ''}!` }
      ];
      
      // Add each eagle to the response
      newMints.forEach(eagle => {
        responses.push({
          type: 'data', 
          text: `${eagle.id} (${eagle.rarity})`, 
          eagleId: eagle.id
        });
      });
      
      responses.push({ type: 'system', text: 'Use "/assets" to view your collection.' });
      
      addEntries(responses);
    }, 2000);
  };
  
  // Handle connect wallet button
  const handleConnectWallet = () => {
    if (config.enableRealWalletOption && config.enableSimulatedWallet) {
      // Show wallet selection modal
      setShowWalletModal(true);
    } else if (config.enableRealWalletOption) {
      // Connect real wallet
      connectWallet();
    } else if (config.enableSimulatedWallet) {
      // Use simulated wallet
      simulateWalletConnection();
    }
  };
  
  return (
    <div className="space-y-4 text-sm">
      {/* Connection status */}
      {!connected ? (
        <div className="border border-yellow-500/30 p-3 bg-yellow-900/20 rounded">
          <div className="text-yellow-400 mb-2">Wallet not connected</div>
          <button 
            className="bg-green-700/50 text-white px-3 py-2 rounded text-xs w-full hover:bg-green-700/70 transition"
            onClick={handleConnectWallet}
          >
            Connect Wallet
          </button>
        </div>
      ) : (
        <div className="border border-green-500/30 p-3 bg-green-900/20 rounded">
          <div className="text-green-400 mb-1">Wallet Connected</div>
          <div className="text-gray-400 text-xs">Ready to mint Eagles</div>
        </div>
      )}
      
      {/* Mint options */}
      <div className="border border-blue-500/30 p-3 bg-blue-900/10 rounded">
        <div className="text-blue-400 mb-3">Mint Settings</div>
        
        <div className="mb-3">
          <label className="block text-gray-400 mb-1 text-xs">Quantity</label>
          <div className="flex">
            <button 
              className="bg-gray-800 px-3 py-1 rounded-l border border-gray-700"
              onClick={() => setMintQuantity(Math.max(1, mintQuantity - 1))}
            >
              -
            </button>
            <div className="bg-gray-900 px-4 py-1 border-t border-b border-gray-700 flex items-center justify-center min-w-[40px]">
              {mintQuantity}
            </div>
            <button 
              className="bg-gray-800 px-3 py-1 rounded-r border border-gray-700"
              onClick={() => setMintQuantity(Math.min(10, mintQuantity + 1))}
            >
              +
            </button>
          </div>
        </div>
        
        <div className="mb-3">
          <div className="text-gray-400 text-xs mb-1">Price per Eagle</div>
          <div className="text-white">{config.mintPrice} SOL</div>
        </div>
        
        <div className="mb-3">
          <div className="text-gray-400 text-xs mb-1">Total Cost</div>
          <div className="text-white">{(config.mintPrice * mintQuantity).toFixed(2)} SOL</div>
        </div>
        
        <button 
          className={`
            w-full py-2 rounded text-white mt-2
            ${mintingInProgress 
              ? 'bg-purple-700/50 cursor-not-allowed' 
              : connected
                ? 'bg-purple-700 hover:bg-purple-600 transition'
                : 'bg-gray-700/50 cursor-not-allowed'
            }
          `}
          onClick={handleMint}
          disabled={mintingInProgress || !connected}
        >
          {mintingInProgress 
            ? 'Minting...' 
            : `Mint ${mintQuantity} Eagle${mintQuantity > 1 ? 's' : ''}`
          }
        </button>
      </div>
      
      {/* Project info */}
      <div className="border border-gray-500/30 p-3 bg-gray-900/20 rounded">
        <div className="text-gray-400 mb-2">Project Info</div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <div className="text-gray-500">Network</div>
            <div className="text-white">{config.networkType === 'mainnet-beta' ? 'Mainnet' : 'Devnet'}</div>
          </div>
          <div>
            <div className="text-gray-500">Max Supply</div>
            <div className="text-white">{config.maxSupply.toLocaleString()}</div>
          </div>
          <div>
            <div className="text-gray-500">Minted</div>
            <div className="text-white">{config.currentSupply.toLocaleString()}</div>
          </div>
          <div>
            <div className="text-gray-500">Remaining</div>
            <div className="text-white">{(config.maxSupply - config.currentSupply).toLocaleString()}</div>
          </div>
        </div>
      </div>
    </div>
  );
}