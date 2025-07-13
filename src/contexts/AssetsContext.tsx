// src/contexts/AssetsContext.tsx

'use client';
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useWalletIntegration } from './WalletContext';

// Define the Eagle type
export type Eagle = {
  id: string;
  name: string;
  rarity: string;
  traits: string[] | {
    plumage?: string;
    eyes?: string;
    beak?: string;
    background?: string;
    accessories?: string;
    [key: string]: string | undefined;
  };
  power: number;
  mintDate: string | number;
  image?: string; // Added image property
};

type AssetsContextType = {
  eagles: Eagle[];
  addEagle: (eagle: Eagle) => void;
  removeEagle: (eagleId: string) => void;
  getEagle: (eagleId: string) => Eagle | undefined;
  selectedEagle: Eagle | null;
  setSelectedEagle: (eagle: Eagle | null) => void;
};

const AssetsContext = createContext<AssetsContextType | undefined>(undefined);

// Example default eagles for testing
const DEFAULT_EAGLES: Eagle[] = [
  {
    id: 'E3D-001',
    name: 'Eagle Guardian Alpha',
    rarity: 'Legendary',
    traits: ['Iridescent Gold', 'Sapphire Eyes', 'Titanium Beak', 'Nebula Background', 'Quantum Shield'],
    power: 95,
    mintDate: '6/30/2025, 5:00:00 PM',
    image: 'https://i.ibb.co/VVc9kvL/eagle-nft.jpg'
  },
  {
    id: 'E3D-042',
    name: 'Shadow Wing',
    rarity: 'Epic',
    traits: ['Obsidian Feathers', 'Ruby Eyes', 'Diamond Claws', 'Night Sky Background'],
    power: 78,
    mintDate: '7/1/2025, 3:15:00 PM',
    image: 'https://i.ibb.co/VVc9kvL/eagle-nft.jpg'
  },
  {
    id: 'E3D-083',
    name: 'Storm Talon',
    rarity: 'Rare',
    traits: ['Electric Blue', 'Crystal Eyes', 'Lightning Strike'],
    power: 62,
    mintDate: '7/2/2025, 1:30:00 PM',
    image: 'https://i.ibb.co/VVc9kvL/eagle-nft.jpg'
  }
];

export function AssetsProvider({ children }: { children: ReactNode }) {
  const { connected } = useWalletIntegration();
  const [eagles, setEagles] = useState<Eagle[]>([]);
  const [selectedEagle, setSelectedEagle] = useState<Eagle | null>(null);

  // Reset eagles when wallet disconnects or connects
  useEffect(() => {
    if (!connected) {
      setEagles([]);
      setSelectedEagle(null);
    } else {
      // Load default eagles when connected (for testing)
      setEagles(DEFAULT_EAGLES);
    }
  }, [connected]);

  const addEagle = (eagle: Eagle) => {
    setEagles(prev => {
      // Check if eagle already exists
      const exists = prev.some(e => e.id === eagle.id);
      if (exists) {
        return prev;
      }
      return [...prev, eagle];
    });
  };

  const removeEagle = (eagleId: string) => {
    setEagles(prev => prev.filter(eagle => eagle.id !== eagleId));
    if (selectedEagle && selectedEagle.id === eagleId) {
      setSelectedEagle(null);
    }
  };

  const getEagle = (eagleId: string) => {
    return eagles.find(eagle => eagle.id === eagleId);
  };

  return (
    <AssetsContext.Provider value={{
      eagles,
      addEagle,
      removeEagle,
      getEagle,
      selectedEagle,
      setSelectedEagle
    }}>
      {children}
    </AssetsContext.Provider>
  );
}

// Hook for easy context access
export function useAssets() {
  const context = useContext(AssetsContext);
  if (context === undefined) {
    throw new Error('useAssets must be used within an AssetsProvider');
  }
  return context;
}