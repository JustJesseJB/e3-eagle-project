import { Connection, PublicKey } from '@solana/web3.js';
import { shortenAddress } from '@/utils/addresses';

// Define NFT type
export type NFT = {
  mint: string;
  name: string;
  symbol: string;
  image?: string;
  attributes?: { trait_type: string; value: string }[];
  collection?: {
    name: string;
    family?: string;
  };
  rarityRank?: number;
  rarityTier?: string;
};

/**
 * Fetches NFTs owned by a wallet
 * @param connection Solana connection
 * @param owner Wallet public key
 * @param collectionId Optional collection filter
 * @returns Array of NFTs
 */
export async function fetchNFTs(
  connection: Connection,
  owner: PublicKey,
  collectionId?: string
): Promise<NFT[]> {
  try {
    // In a real implementation, this would query the Solana blockchain
    // using methods like getParsedTokenAccountsByOwner or a service like
    // Helius, Metaplex, etc.
    
    // For now, we'll return mock data
    return [
      {
        mint: 'E3G001xyz123abc456def789ghi',
        name: 'Eagle Guardian Alpha',
        symbol: 'E3G',
        image: 'https://example.com/eagle1.png',
        attributes: [
          { trait_type: 'Plumage', value: 'Iridescent Gold' },
          { trait_type: 'Eyes', value: 'Sapphire' },
          { trait_type: 'Beak', value: 'Titanium' },
          { trait_type: 'Background', value: 'Nebula' },
          { trait_type: 'Accessories', value: 'Quantum Shield' }
        ],
        collection: {
          name: 'E3 Eagles',
          family: 'Genesis'
        },
        rarityRank: 3,
        rarityTier: 'Legendary'
      },
      {
        mint: 'E3G042abc789def456ghi123xyz',
        name: 'Shadow Wing',
        symbol: 'E3G',
        image: 'https://example.com/eagle2.png',
        attributes: [
          { trait_type: 'Plumage', value: 'Midnight Black' },
          { trait_type: 'Eyes', value: 'Crimson' },
          { trait_type: 'Beak', value: 'Obsidian' },
          { trait_type: 'Background', value: 'Eclipse' },
          { trait_type: 'Accessories', value: 'Stealth Visor' }
        ],
        collection: {
          name: 'E3 Eagles',
          family: 'Genesis'
        },
        rarityRank: 42,
        rarityTier: 'Epic'
      }
    ];
  } catch (error) {
    console.error('Error fetching NFTs:', error);
    return [];
  }
}

/**
 * Fetches detailed metadata for an NFT
 * @param connection Solana connection
 * @param mintAddress NFT mint address
 * @returns NFT metadata or null if not found
 */
export async function fetchNFTMetadata(
  connection: Connection,
  mintAddress: string
): Promise<NFT | null> {
  try {
    // In a real implementation, this would fetch the NFT metadata
    // from the blockchain or from a metadata service
    
    // For now, we'll return mock data
    const nfts = [
      {
        mint: 'E3G001xyz123abc456def789ghi',
        name: 'Eagle Guardian Alpha',
        symbol: 'E3G',
        image: 'https://example.com/eagle1.png',
        attributes: [
          { trait_type: 'Plumage', value: 'Iridescent Gold' },
          { trait_type: 'Eyes', value: 'Sapphire' },
          { trait_type: 'Beak', value: 'Titanium' },
          { trait_type: 'Background', value: 'Nebula' },
          { trait_type: 'Accessories', value: 'Quantum Shield' }
        ],
        collection: {
          name: 'E3 Eagles',
          family: 'Genesis'
        },
        rarityRank: 3,
        rarityTier: 'Legendary'
      },
      {
        mint: 'E3G042abc789def456ghi123xyz',
        name: 'Shadow Wing',
        symbol: 'E3G',
        image: 'https://example.com/eagle2.png',
        attributes: [
          { trait_type: 'Plumage', value: 'Midnight Black' },
          { trait_type: 'Eyes', value: 'Crimson' },
          { trait_type: 'Beak', value: 'Obsidian' },
          { trait_type: 'Background', value: 'Eclipse' },
          { trait_type: 'Accessories', value: 'Stealth Visor' }
        ],
        collection: {
          name: 'E3 Eagles',
          family: 'Genesis'
        },
        rarityRank: 42,
        rarityTier: 'Epic'
      }
    ];
    
    return nfts.find(nft => nft.mint === mintAddress) || null;
  } catch (error) {
    console.error('Error fetching NFT metadata:', error);
    return null;
  }
}

/**
 * Get the color associated with a rarity tier
 * @param rarity Rarity tier string
 * @returns CSS color class
 */
export function getRarityColor(rarity: string | undefined): string {
  if (!rarity) return 'text-white';
  
  switch(rarity.toLowerCase()) {
    case 'common': return 'text-gray-400';
    case 'uncommon': return 'text-green-400';
    case 'rare': return 'text-blue-400';
    case 'epic': return 'text-purple-400';
    case 'legendary': return 'text-yellow-400';
    case 'mythic': return 'text-red-400';
    default: return 'text-white';
  }
}

/**
 * Formats an NFT ID for display in the terminal
 * @param mint Mint address
 * @returns Formatted ID string
 */
export function formatNFTId(mint: string): string {
  // Use the first and last few characters of the mint address
  const shortened = shortenAddress(mint, 3, 3);
  return `E3G-${shortened.replace('...', '-')}`;
}