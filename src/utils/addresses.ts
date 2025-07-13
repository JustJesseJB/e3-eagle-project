/**
 * Shortens a Solana address for display purposes
 * @param address The full address to shorten
 * @param startChars Number of characters to show at the start
 * @param endChars Number of characters to show at the end
 * @returns Shortened address with ellipsis
 */
export function shortenAddress(
  address: string | null | undefined,
  startChars = 4,
  endChars = 4
): string {
  if (!address) {
    return '';
  }
  
  if (address.length <= startChars + endChars) {
    return address;
  }
  
  return `${address.slice(0, startChars)}...${address.slice(-endChars)}`;
}

/**
 * Validates if a string is a valid Solana address
 * @param address Address to validate
 * @returns Whether the address is valid
 */
export function isValidSolanaAddress(address: string): boolean {
  // Basic validation - Solana addresses are 44 characters long and base58 encoded
  if (!address || address.length !== 44) {
    return false;
  }
  
  // More thorough validation would use PublicKey from @solana/web3.js
  // But this is a simple check for quick validation
  const base58Chars = /^[1-9A-HJ-NP-Za-km-z]+$/;
  return base58Chars.test(address);
}

/**
 * Generates a placeholder random wallet address for demo/testing
 * @returns A random string in the format of a Solana address
 */
export function generatePlaceholderAddress(): string {
  const chars = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
  let result = '';
  
  for (let i = 0; i < 44; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return result;
}