import { TerminalEntry } from '@/contexts/TerminalContext';
import { commandRegistry, CommandHandler } from './commandProcessor';
import { shortenAddress, generatePlaceholderAddress } from '@/utils/addresses';

// Simulate some chat users for demonstration
const demoUsers = [
  {
    walletId: '8xHy92Pj1CRMEsvEFKFqPPoXrL9UvG7HNbYzZMKGEsS9',
    displayName: 'Eagle_Commander',
    verified: true
  },
  {
    walletId: '6GzrJFQCREFvXuZHrx3RFHYDNqRzXcFgcBx5rKqDrwJP',
    displayName: 'crypto_wizard',
    verified: true
  },
  {
    walletId: '4vj7HqWcJxzf2LfUPBqGvPDcyPNNe1nGJJTXCPevM1AH',
    displayName: 'Sol_Surfer',
    verified: true
  }
];

// Demo chat messages
const demoMessages = [
  {
    walletId: '8xHy92Pj1CRMEsvEFKFqPPoXrL9UvG7HNbYzZMKGEsS9',
    message: 'Welcome to the Eagle Terminal chat. Authenticity verified by wallet signature.',
    timestamp: Date.now() - 3600000
  },
  {
    walletId: '6GzrJFQCREFvXuZHrx3RFHYDNqRzXcFgcBx5rKqDrwJP',
    message: 'Just minted my first Eagle! #E3-Legion',
    timestamp: Date.now() - 1800000
  },
  {
    walletId: '4vj7HqWcJxzf2LfUPBqGvPDcyPNNe1nGJJTXCPevM1AH',
    message: 'Anyone else unlock the hidden command?',
    timestamp: Date.now() - 600000
  }
];

// Chat command - opens the chat interface
export const handleChatCommand: CommandHandler = async (): Promise<TerminalEntry[]> => {
  const response: TerminalEntry[] = [
    { type: 'system', text: 'Connecting to E3 community channel...' },
    { type: 'success', text: 'Connected to E3 community channel' },
    { type: 'system', text: '--- EAGLE COMMUNITY CHAT ---' },
  ];
  
  // Add the demo messages to the response
  demoMessages.forEach(msg => {
    const user = demoUsers.find(u => u.walletId === msg.walletId);
    const displayName = user?.displayName || shortenAddress(msg.walletId);
    const verified = user?.verified ? '✓' : '';
    
    response.push({
      type: 'data',
      text: `[${new Date(msg.timestamp).toLocaleTimeString()}] ${displayName}${verified}: ${msg.message}`
    });
  });
  
  response.push(
    { type: 'system', text: '---' },
    { type: 'system', text: 'Type "/chat-send [message]" to send a message' },
    { type: 'system', text: 'Type "/chat-exit" to leave the chat' }
  );
  
  return response;
};

// Chat send command - sends a message to the chat
export const handleChatSendCommand: CommandHandler = async (args: string[]): Promise<TerminalEntry[]> => {
  const message = args.join(' ');
  
  if (!message) {
    return [{ type: 'error', text: 'Please provide a message to send' }];
  }
  
  // In a real implementation, this would send the message to a server
  // and include the wallet signature for verification
  return [
    { 
      type: 'data', 
      text: `[${new Date().toLocaleTimeString()}] YOU: ${message}` 
    },
    { 
      type: 'system', 
      text: 'Message sent to community channel' 
    }
  ];
};

// Chat exit command - closes the chat interface
export const handleChatExitCommand: CommandHandler = async (): Promise<TerminalEntry[]> => {
  return [
    { type: 'system', text: 'Disconnecting from E3 community channel...' },
    { type: 'success', text: 'Disconnected from community channel' }
  ];
};

// Register chat commands
export function registerChatCommands(): void {
  commandRegistry.register('/chat', handleChatCommand);
  commandRegistry.register('/chat-send', handleChatSendCommand);
  commandRegistry.register('/chat-exit', handleChatExitCommand);
}