'use client';
import { useState, useEffect, useRef } from 'react';
import { useWalletIntegration } from '@/contexts/WalletContext';
import { shortenAddress } from '@/utils/addresses';

type ChatMessage = {
  user: string;
  message: string;
  walletId?: string;
};

export default function ChatPanel() {
  const { connected, shortenedAddress } = useWalletIntegration();
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {user: 'System', message: 'Welcome to the Eagle Comm-Link'},
    {user: 'EagleOne', message: 'anyone got the coordinates for the next drop?'},
    {user: 'Talon42', message: 'check the classified channel'},
    {user: 'WingCommander', message: 'Those level 1 clearance won\'t see it'},
    {user: 'NestWatcher', message: 'did anyone decode the message in the last mint?'},
    {user: 'DigitalEagle', message: '@EagleOne try running the /scan command with the token ID'},
    {user: 'EagleOne', message: 'oh wait I see it now. check the metadata'},
    {user: 'System', message: '[REDACTED MESSAGE]'},
    {user: 'Talon42', message: 'lol they\'re watching us'}
  ]);
  
  const chatContainerRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll chat to bottom when new messages arrive
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);
  
  // Simulate chat activity
  useEffect(() => {
    const simulateChatActivity = () => {
      const users = ['EagleOne', 'Talon42', 'WingCommander', 'NestWatcher', 'DigitalEagle'];
      const messages = [
        'anyone got coordinates for the next drop?',
        'check the binary in the classified section',
        'decoded the last message, points to July 15',
        'new rarity tier being added soon',
        'that area 51 reference isn\'t random',
        'found another hidden command',
        'the metadata has clues too',
        'eagle #249 sold for 58 SOL!',
        'dev team just dropped a hint in discord'
      ];
      
      // Random message every 5-20 seconds
      if (Math.random() > 0.7) {
        const randomUser = users[Math.floor(Math.random() * users.length)];
        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
        
        setChatMessages(prev => [...prev, { user: randomUser, message: randomMessage }]);
      }
    };

    const interval = setInterval(simulateChatActivity, 5000 + Math.random() * 15000);
    return () => clearInterval(interval);
  }, []);
  
  // Handle chat message submission
  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (chatInput.trim() === '' || !connected) return;
    
    // Add user message
    setChatMessages(prev => [...prev, { 
      user: 'You', 
      message: chatInput,
      walletId: shortenedAddress || undefined
    }]);
    setChatInput('');
    
    // Simulate response
    setTimeout(() => {
      if (Math.random() > 0.7) {
        const users = ['EagleOne', 'Talon42', 'WingCommander', 'NestWatcher', 'DigitalEagle'];
        const randomUser = users[Math.floor(Math.random() * users.length)];
        const responses = [
          'interesting theory...',
          'have you tried the classified section?',
          'not sure about that',
          'check the coordinates again',
          'that might be a clue',
          'I think you\'re onto something',
          'shhh they\'re listening',
          'did you decode the binary?'
        ];
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        setChatMessages(prev => [...prev, { user: randomUser, message: randomResponse }]);
      }
    }, 1000 + Math.random() * 2000);
  };
  
  return (
    <div className="h-full flex flex-col">
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto mb-2 text-sm"
        style={{ maxHeight: '50vh', minHeight: '200px' }}
      >
        {/* Chat messages */}
        {chatMessages.map((msg, i) => (
          <div key={i} className="mb-1">
            <span className={`
              ${msg.user === 'System' ? 'text-blue-400' : ''}
              ${msg.user === 'EagleOne' ? 'text-purple-400' : ''}
              ${msg.user === 'Talon42' ? 'text-green-400' : ''}
              ${msg.user === 'WingCommander' ? 'text-yellow-400' : ''}
              ${msg.user === 'NestWatcher' ? 'text-cyan-400' : ''}
              ${msg.user === 'DigitalEagle' ? 'text-red-400' : ''}
              ${msg.user === 'You' ? 'text-white' : ''}
            `}>
              {msg.user}:
            </span>{' '}
            <span className="text-gray-300">{msg.message}</span>
          </div>
        ))}
      </div>
      
      <form onSubmit={handleChatSubmit} className="border-t border-gray-800 pt-2">
        <div className="flex">
          <input 
            type="text" 
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            className="flex-1 bg-gray-900 text-white p-2 rounded-l border border-gray-700 text-sm"
            placeholder={connected ? "Send message..." : "Connect wallet to chat"}
            disabled={!connected}
          />
          <button 
            type="submit" 
            className={`bg-gray-800 text-white px-4 rounded-r border border-l-0 border-gray-700 touch-manipulation ${!connected ? 'opacity-50' : ''}`}
            disabled={!connected}
          >
            &gt;
          </button>
        </div>
      </form>
    </div>
  );
}