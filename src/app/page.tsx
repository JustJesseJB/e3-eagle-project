"use client";
import { useState, useEffect, useRef } from 'react';

export default function Home() {
  const [isClient, setIsClient] = useState(false);
  const [terminalInput, setTerminalInput] = useState('');
  const [terminalHistory, setTerminalHistory] = useState<any[]>([]);
  const [connected, setConnected] = useState(false);
  const [accessLevel, setAccessLevel] = useState(0);
  const [showTrollbox, setShowTrollbox] = useState(false);
  const [mintWindowOpen, setMintWindowOpen] = useState(false);
  const [showHiddenMessage, setShowHiddenMessage] = useState(false);
  const [glitchEffect, setGlitchEffect] = useState(false);
  const [showSecretPanel, setShowSecretPanel] = useState(false);
  const [mintingInProgress, setMintingInProgress] = useState(false);
  const [mintedNFTs, setMintedNFTs] = useState<{id: string, rarity: string, traits: string[], power: number}[]>([]);
  const [mintQuantity, setMintQuantity] = useState(1);
  const [chatMessages, setChatMessages] = useState<{user: string, message: string}[]>([
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
  const [chatInput, setChatInput] = useState('');
  const [selectedEagle, setSelectedEagle] = useState<{id: string, rarity: string, traits: string[], power: number} | null>(null);
  
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Simulate random glitch effects
  useEffect(() => {
    const glitchInterval = setInterval(() => {
      if (Math.random() > 0.92) {
        setGlitchEffect(true);
        setTimeout(() => setGlitchEffect(false), 200);
      }
    }, 3000);
    
    return () => clearInterval(glitchInterval);
  }, []);

  // Set client-side rendering
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Auto-scroll terminal to bottom when new content is added
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [terminalHistory]);

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
      
      // Random message every 5-20 seconds when chat is open
      if (showTrollbox && Math.random() > 0.7) {
        const randomUser = users[Math.floor(Math.random() * users.length)];
        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
        
        setChatMessages(prev => [...prev, { user: randomUser, message: randomMessage }]);
      }
    };

    const interval = setInterval(simulateChatActivity, 5000 + Math.random() * 15000);
    return () => clearInterval(interval);
  }, [showTrollbox]);

  // Focus on input field when terminal is clicked
  useEffect(() => {
    const handleClick = () => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    };
    
    if (terminalRef.current) {
      terminalRef.current.addEventListener('click', handleClick);
    }
    
    return () => {
      if (terminalRef.current) {
        terminalRef.current.removeEventListener('click', handleClick);
      }
    };
  }, []);

  // Close modal when escape key is pressed
  useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedEagle) {
        setSelectedEagle(null);
      }
    };
    
    window.addEventListener('keydown', handleEscapeKey);
    return () => window.removeEventListener('keydown', handleEscapeKey);
  }, [selectedEagle]);

  // Toggle panels function for better mobile experience
  const togglePanel = (panelName: 'mint' | 'chat' | 'secret') => {
    // Close all panels first
    setMintWindowOpen(false);
    setShowTrollbox(false);
    setShowSecretPanel(false);
    
    // Then open the requested one
    if (panelName === 'mint') setMintWindowOpen(true);
    if (panelName === 'chat') setShowTrollbox(true);
    if (panelName === 'secret') setShowSecretPanel(true);
    
    // On mobile, scroll to the panel
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      setTimeout(() => {
        window.scrollTo({
          top: document.body.scrollHeight,
          behavior: 'smooth'
        });
      }, 100);
    }
  };

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
  const handleMint = () => {
    // Check if wallet is connected
    if (!connected) {
      setTerminalHistory(prev => [
        ...prev,
        { type: 'error', text: 'ERROR: Wallet not connected' },
        { type: 'system', text: 'Use /connect to connect your wallet before minting' }
      ]);
      setMintWindowOpen(false);
      return;
    }
    
    setMintingInProgress(true);
    
    // Simulate blockchain delay
    setTimeout(() => {
      const newMints = [];
      for (let i = 0; i < mintQuantity; i++) {
        newMints.push(generateRandomEagle());
      }
      
      setMintedNFTs([...mintedNFTs, ...newMints]);
      setMintingInProgress(false);
      
      // Add to terminal history
      const responses = [
        { type: 'system', text: `Processing mint transaction...` },
        { type: 'success', text: `Successfully minted ${mintQuantity} E3 Eagle${mintQuantity > 1 ? 's' : ''}!` },
        { type: 'data', text: newMints.map(eagle => eagle.id).join(', ') }
      ];
      
      setTerminalHistory(prev => [...prev, ...responses]);
      
    }, 3000); // 3 second simulated blockchain time
  };

  // Handle chat message submission
  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (chatInput.trim() === '') return;
    
    // Add user message
    setChatMessages(prev => [...prev, { user: 'You', message: chatInput }]);
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

  // Process commands entered by the user
  const processCommand = (cmd: string) => {
    const command = cmd.trim().toLowerCase();
    let response = [];
    
    // Add command to history
    setTerminalHistory(prev => [...prev, { type: 'input', text: `> ${cmd}` }]);
    
    // Process different commands
    if (command === '/help' || command === 'help') {
      response = [
        { type: 'system', text: 'E3 TERMINAL COMMAND INDEX:' },
        { type: 'command', text: '-- CORE COMMANDS --' },
        { type: 'command', text: '/help - Show available commands' },
        { type: 'command', text: '/connect - Connect wallet' },
        { type: 'command', text: '/clear - Clear terminal' },
        { type: 'command', text: '-- NFT COMMANDS --' },
        { type: 'command', text: '/mint - Open mint interface' },
        { type: 'command', text: '/gallery - View your Eagle collection' },
        { type: 'command', text: '-- COMMUNITY --' },
        { type: 'command', text: '/chat - Open community channel' },
      ];
      
      // Show advanced commands based on access level
      if (accessLevel >= 1) {
        response.push({ type: 'command', text: '-- ADVANCED --' });
        response.push({ type: 'command', text: '/scan - Scan network for Eagles' });
        if (mintedNFTs.length > 0) {
          response.push({ type: 'command', text: '/inspect [eagle-id] - View detailed Eagle information' });
        }
      }
      
      // Easter egg - hint at hidden commands
      if (Math.random() > 0.8) {
        response.push({ type: 'hidden', text: 'Additional commands exist but are not documented...' });
      }
    } 
    else if (command === '/clear' || command === 'clear') {
      setTerminalHistory([]);
      setTerminalInput('');
      return;
    }
    else if (command === '/connect' || command === 'connect') {
      setConnected(true);
      response = [
        { type: 'system', text: 'Connecting to wallet...' },
        { type: 'success', text: 'Connected to 8xH5f...q3B7' },
        { type: 'system', text: 'Scanning for Eagle identifiers...' },
        { type: 'warning', text: 'Access level: 1 - INITIATE' },
        { type: 'hidden', text: 'Use /classified to access restricted data' }
      ];
      setAccessLevel(1);
    }
    else if (command === '/mint' || command === 'mint') {
      togglePanel('mint');
      response = [
        { type: 'system', text: 'Initializing mint protocol...' },
        { type: 'success', text: 'Mint window activated' }
      ];
      
      if (!connected) {
        response.push({ type: 'warning', text: 'Wallet connection required for minting' });
      }
    }
    else if (command === '/gallery' || command === 'gallery') {
      if (mintedNFTs.length === 0) {
        response = [
          { type: 'system', text: 'No E3 Eagles found in your collection.' },
          { type: 'system', text: 'Use /mint to acquire your first Eagle.' }
        ];
      } else {
        response = [
          { type: 'system', text: 'Accessing E3 Eagle collection...' },
          { type: 'success', text: `Found ${mintedNFTs.length} Eagle${mintedNFTs.length > 1 ? 's' : ''} in your collection:` },
          ...mintedNFTs.map(eagle => (
            { 
              type: 'data', 
              text: `${eagle.id} - ${eagle.rarity} (Power: ${eagle.power})`,
              eagleId: eagle.id 
            }
          ))
        ];
        
        response.push({ type: 'system', text: 'Use /inspect [eagle-id] to view detailed information' });
      }
    }
    else if (command.startsWith('/inspect ') || command.startsWith('inspect ')) {
      const eagleId = command.split(' ').slice(1).join(' ');
      const eagle = mintedNFTs.find(e => e.id.toLowerCase() === eagleId.toLowerCase());
      
      if (!eagle) {
        const similarEagle = mintedNFTs.find(e => e.id.toLowerCase().includes(eagleId.toLowerCase()));
        
        if (similarEagle) {
          response = [
            { type: 'error', text: `Eagle "${eagleId}" not found.` },
            { type: 'system', text: `Did you mean "${similarEagle.id}"?` }
          ];
        } else {
          response = [
            { type: 'error', text: `Eagle "${eagleId}" not found in your collection.` },
            { type: 'system', text: 'Use /gallery to view your Eagles.' }
          ];
        }
      } else {
        setSelectedEagle(eagle);
        response = [
          { type: 'system', text: `Accessing secure database...` },
          { type: 'success', text: `Eagle ${eagle.id} data retrieved.` },
          { type: 'system', text: `Opening secure viewing portal...` }
        ];
      }
    }
    else if (command === '/chat' || command === 'chat') {
      togglePanel('chat');
      response = [
        { type: 'system', text: 'Establishing secure channel...' },
        { type: 'success', text: 'E3 communication channel open' }
      ];
    }
    else if ((command === '/scan' || command === 'scan') && accessLevel >= 1) {
      response = [
        { type: 'system', text: 'Scanning blockchain for Eagle signatures...' },
        { type: 'system', text: 'Found 731 Eagles in circulation' },
        { type: 'system', text: 'Rarity analysis:' },
        { type: 'data', text: '- Legendary: 12' },
        { type: 'data', text: '- Epic: 89' },
        { type: 'data', text: '- Rare: 243' },
        { type: 'data', text: '- Common: 387' },
        { type: 'error', text: 'ERR: SZP://182.41.11.0/REDACTED' },
      ];
      
      // Hidden message trigger
      if (Math.random() > 0.7) {
        setTimeout(() => {
          setShowHiddenMessage(true);
          setTimeout(() => setShowHiddenMessage(false), 1500);
        }, 2000);
      }
    }
    else if ((command === '/classified' || command === 'classified') && accessLevel >= 1) {
      togglePanel('secret');
      response = [
        { type: 'error', text: 'WARNING: UNAUTHORIZED ACCESS ATTEMPT' },
        { type: 'system', text: 'Initiating trace protocol...' },
        { type: 'system', text: '...' },
        { type: 'success', text: 'Identity confirmed. Welcome, Operative.' },
        { type: 'warning', text: 'LEVEL 2 CLEARANCE GRANTED' }
      ];
      setAccessLevel(2);
    }
    else if ((command === '/decode' || command === 'decode') && accessLevel >= 2) {
      const binaryMessage = '01001110 01000101 01011000 01010100 00100000 01000100 01010010 01001111 01010000 00100000 00110111 00101111 00110001 00110101';
      
      response = [
        { type: 'system', text: 'Decoding binary message...' },
        { type: 'warning', text: 'WARNING: ACCESSING RESTRICTED INFORMATION' },
        { type: 'success', text: 'Message decoded: "NEXT DROP 7/15"' },
        { type: 'error', text: 'Connection terminated by remote host' }
      ];
      
      // Flash effect
      setGlitchEffect(true);
      setTimeout(() => setGlitchEffect(false), 1000);
    }
    else if ((command === '/coordinates' || command === 'coordinates') && accessLevel >= 2) {
      response = [
        { type: 'system', text: 'Analyzing coordinates 37°14\'06.0"N 115°48\'40.0"W...' },
        { type: 'warning', text: 'LOCATION IDENTIFIED: AREA 51 FACILITY' },
        { type: 'system', text: 'Searching for related Eagle artifacts...' },
        { type: 'success', text: 'Found reference to hidden collection: "Alien Eagle"' },
        { type: 'error', text: 'Further access restricted. Clearance level 3 required.' }
      ];
    }
    else if (command === '') {
      return;
    }
    else {
      response = [
        { type: 'error', text: `Command not recognized: ${command}` },
        { type: 'system', text: 'Type /help for available commands' }
      ];
      
      // Easter egg - random cryptic response
      if (Math.random() > 0.8) {
        response.push({ type: 'glitch', text: 'E̵̛͖͊R̴̡̗̓̕Ř̸̹̂O̶̰̍̈́R̷̰̦̽:̶͈̓͋ ̶̮̍S̶̻̉̓E̷̮̚Q̷̫̈́̉U̵̪͝E̶̛̼̱̒N̶̳̈́C̸̜̍E̶̩̎ ̸̼̮̔̀C̸̲̰̓̊O̷̠͑Ṛ̶̡̔R̸͚͑U̶̥̞̔P̷͎̂T̶̼̐̈E̴̪̼̎D̸̲̈́̍' });
      }
    }
    
    // Add responses to history
    setTerminalHistory(prev => [...prev, ...response]);
    
    // Clear input
    setTerminalInput('');
  };

  // Handle clicking on an Eagle in the gallery
  const handleEagleClick = (eagleId: string) => {
    const eagle = mintedNFTs.find(e => e.id === eagleId);
    if (eagle) {
      setSelectedEagle(eagle);
    }
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    processCommand(terminalInput);
  };

  if (!isClient) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-green-500">
        Initializing Terminal...
      </div>
    );
  }

  // Determine rarity color
  const getRarityColor = (rarity: string) => {
    switch(rarity) {
      case 'Common': return 'text-gray-400';
      case 'Rare': return 'text-blue-400';
      case 'Epic': return 'text-purple-400';
      case 'Legendary': return 'text-yellow-400';
      default: return 'text-white';
    }
  };

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono flex flex-col">
      {/* Terminal header */}
      <div className="bg-gray-900 border-b border-green-500/30 p-2 flex justify-between items-center">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-black border border-green-500 flex items-center justify-center mr-2">
            <span className="text-xs">E3</span>
          </div>
          <span className={`text-sm ${glitchEffect ? 'text-red-500' : ''}`}>EAGLE-TERM v0.3.7 [ALPHA]</span>
        </div>
        <div className="flex space-x-3">
          <div className={`w-3 h-3 rounded-full ${connected ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-900"></div>
        </div>
      </div>
      
      {/* Main terminal container - FIXED FOR BOTH MOBILE AND DESKTOP */}
      <div className="flex-1 p-2 md:p-4 flex flex-col md:flex-row gap-4 overflow-auto">
        {/* Main terminal */}
        <div className="flex-1 border border-green-500/30 bg-black rounded shadow-[0_0_15px_rgba(0,255,0,0.1)] backdrop-blur-sm overflow-hidden flex flex-col">
          {/* Terminal output */}
          <div 
            ref={terminalRef}
            className="flex-1 p-4 overflow-y-auto terminal-bg relative"
            style={{ 
              background: 'linear-gradient(rgba(0,20,0,0.7), rgba(0,10,0,0.7))',
              boxShadow: 'inset 0 0 30px rgba(0,50,0,0.3)',
              textShadow: '0 0 5px rgba(0,255,0,0.5)',
              minHeight: '200px'
            }}
          >
            {/* Initial boot sequence */}
            <div className="text-gray-500 mb-2">
              <p>Initializing E3 Terminal...</p>
              <p>BIOS v1.0.3 loaded</p>
              <p>Checking system integrity... OK</p>
              <p>Loading security protocols... OK</p>
              <p>Establishing blockchain connection... OK</p>
              <p>Initializing Solana interface... OK</p>
              <p className="text-yellow-400 mt-2">E3 TERMINAL READY</p>
              <p>Type <span className="text-white">/help</span> for available commands</p>
            </div>
            
            {/* Terminal history */}
            <div>
              {terminalHistory.map((entry, i) => (
                <div 
                  key={i} 
                  className={`
                    ${entry.type === 'input' ? 'text-white' : ''}
                    ${entry.type === 'system' ? 'text-green-400' : ''}
                    ${entry.type === 'error' ? 'text-red-400' : ''}
                    ${entry.type === 'warning' ? 'text-yellow-400' : ''}
                    ${entry.type === 'success' ? 'text-cyan-400' : ''}
                    ${entry.type === 'command' ? 'text-purple-400' : ''}
                    ${entry.type === 'data' ? 'text-gray-400' : ''}
                    ${entry.type === 'glitch' ? 'text-red-500 glitch-text' : ''}
                    ${entry.type === 'hidden' ? 'text-gray-900 hover:text-gray-500 cursor-help' : ''}
                    ${entry.eagleId ? 'cursor-pointer hover:underline' : ''}
                    mb-1
                  `}
                  onClick={() => entry.eagleId && handleEagleClick(entry.eagleId)}
                >
                  {entry.text}
                </div>
              ))}
            </div>
            
            {/* Hidden message that flashes briefly */}
            {showHiddenMessage && (
              <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-red-500 opacity-60 text-xl font-bold animate-pulse">
                THE EAGLES ARE WATCHING
              </div>
            )}
          </div>
          
          {/* Terminal input */}
          <form onSubmit={handleSubmit} className="border-t border-green-800/50 p-2 backdrop-blur-sm">
            <div className="flex items-center">
              <span className="text-green-500 mr-2">&gt;</span>
              <input
                ref={inputRef}
                type="text"
                value={terminalInput}
                onChange={(e) => setTerminalInput(e.target.value)}
                className="flex-1 bg-transparent text-white focus:outline-none"
                placeholder="Enter command..."
                autoFocus
              />
            </div>
          </form>
        </div>
        
        {/* Side panel - conditionally rendered - FIXED FOR BOTH MOBILE AND DESKTOP */}
        {(mintWindowOpen || showTrollbox || showSecretPanel) && (
          <div className="h-auto min-h-[320px] border border-blue-500/30 bg-black rounded shadow-[0_0_15px_rgba(0,0,255,0.1)] mb-4 md:mb-0 md:w-80">
            {/* Panel header */}
            <div className="bg-gray-900 border-b border-blue-500/30 p-2 flex justify-between items-center sticky top-0">
              <div>
                {mintWindowOpen && <span className="text-cyan-400 text-sm">MINT PROTOCOL</span>}
                {showTrollbox && <span className="text-purple-400 text-sm">EAGLE COMM-LINK</span>}
                {showSecretPanel && <span className="text-red-400 text-sm">CLASSIFIED INTEL</span>}
              </div>
              <div className="flex space-x-2">
                <button 
                  className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-xs"
                  onClick={() => {
                    setMintWindowOpen(false);
                    setShowTrollbox(false);
                    setShowSecretPanel(false);
                  }}
                  aria-label="Close panel"
                >
                  x
                </button>
              </div>
            </div>
            
            {/* Panel content */}
            <div className="p-3 overflow-y-auto" style={{ maxHeight: '60vh' }}>
              {mintWindowOpen && (
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
                    
                    <div className="text-gray-600 text-xs text-center mt-2">
                      ENCRYPTED TRANSACTION PROTOCOL
                    </div>
                  </div>
                </div>
              )}
              
              {showTrollbox && (
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
                        placeholder="Send message..."
                      />
                      <button 
                        type="submit" 
                        className="bg-gray-800 text-white px-4 rounded-r border border-l-0 border-gray-700 touch-manipulation"
                      >
                        &gt;
                      </button>
                    </div>
                  </form>
                </div>
              )}
              
              {showSecretPanel && (
                <div>
                  <div className="border border-red-500/30 p-3 mb-3 bg-gray-900/50">
                    <div className="text-red-400 text-sm mb-1">CLASSIFIED INFORMATION</div>
                    <div className="text-gray-400 text-xs">
                      Access Level: <span className="text-yellow-400">2 - OPERATIVE</span>
                    </div>
                  </div>
                  
                  <div className="space-y-3 text-sm">
                    <div className="text-gray-400">Project E3 Status: <span className="text-green-400">ACTIVE</span></div>
                    <div className="text-gray-400">Phase 1: <span className="text-green-400">COMPLETE</span></div>
                    <div className="text-gray-400">Phase 2: <span className="text-yellow-400">IN PROGRESS</span></div>
                    <div className="text-gray-400">Phase 3: <span className="text-red-400">PENDING</span></div>
                    
                    <div className="border-t border-gray-800 pt-2">
                      <div className="text-yellow-400 mb-1">TRANSMISSION INTERCEPTED:</div>
                      <div className="text-gray-500 font-mono text-xs">
                        &lt;01001110 01000101 01011000 01010100 00100000 01000100 01010010 01001111 01010000 00100000 00110111 00101111 00110001 00110101&gt;
                      </div>
                    </div>
                    
                    <div className="border-t border-gray-800 pt-2">
                      <div className="text-yellow-400 mb-1">COORDINATES:</div>
                      <div className="text-white font-mono">37°14'06.0"N 115°48'40.0"W</div>
                    </div>
                    
                    <div className="text-center mt-4">
                      <button 
                        className="bg-red-900/50 text-red-300 px-4 py-2 rounded border border-red-700/30 text-xs hover:bg-red-800/50 transition touch-manipulation"
                        onClick={() => processCommand('/decode')}
                      >
                        DECRYPT FULL MESSAGE
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* Status bar - Fixed with sticky positioning */}
      <div className="sticky bottom-0 bg-gray-900 border-t border-green-500/30 p-1 text-xs text-gray-500 flex justify-between z-10">
        <div>
          <span className="mr-3">STATUS: {connected ? 'CONNECTED' : 'DISCONNECTED'}</span>
          {connected && <span className="hidden sm:inline">WALLET: 8xH5f...q3B7</span>}
        </div>
        <div>
          ACCESS LEVEL: {accessLevel === 0 ? 'GUEST' : accessLevel === 1 ? 'INITIATE' : 'OPERATIVE'}
        </div>
        <div className="hidden sm:block">
          E3-TERM // {new Date().toLocaleTimeString()}
        </div>
      </div>
      
      {/* Eagle Detail Modal */}
      {selectedEagle && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => setSelectedEagle(null)}>
          <div 
            className="bg-black border border-cyan-500 shadow-[0_0_30px_rgba(0,255,255,0.3)] rounded max-w-md w-full max-h-[90vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="bg-gradient-to-r from-blue-900 to-purple-900 p-2 text-center relative">
              <h3 className="text-cyan-300 font-bold">CLASSIFIED E3 DATABASE</h3>
              <button 
                className="absolute right-2 top-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-xs"
                onClick={() => setSelectedEagle(null)}
              >
                x
              </button>
            </div>
            
            {/* Modal body */}
            <div className="p-4">
              {/* Eagle preview */}
              <div className="mb-4 flex flex-col items-center">
                <div className="w-40 h-40 border-2 border-cyan-700/50 rounded mb-2 overflow-hidden">
                  <img 
                    src="https://i.ibb.co/VVc9kvL/eagle-nft.jpg"
                    alt={selectedEagle.id}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYwIiBoZWlnaHQ9IjE2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMkQzNzQ4Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMjAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGFsaWdubWVudC1iYXNlbGluZT0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlLCBzYW5zLXNlcmlmIiBmaWxsPSIjOEJFOUZEIj5FM0VhZ2xlIE5GVDwvdGV4dD48L3N2Zz4=';
                    }}
                  />
                </div>
                <div className="text-center">
                  <h4 className="text-white text-lg">{selectedEagle.id}</h4>
                  <p className={`${getRarityColor(selectedEagle.rarity)} text-sm`}>{selectedEagle.rarity}</p>
                </div>
              </div>
              
              {/* Eagle stats */}
              <div className="space-y-4">
                <div className="bg-gray-900/50 border border-cyan-900/30 rounded p-3">
                  <h5 className="text-cyan-400 mb-2 text-sm">TRAITS</h5>
                  {selectedEagle.traits.length > 0 ? (
                    <ul className="space-y-1">
                      {selectedEagle.traits.map((trait, index) => (
                        <li key={index} className="text-gray-300 text-sm flex items-center">
                          <span className="w-2 h-2 bg-cyan-500 rounded-full mr-2"></span>
                          {trait}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500 text-sm">No special traits</p>
                  )}
                </div>
                
                <div className="bg-gray-900/50 border border-cyan-900/30 rounded p-3">
                  <h5 className="text-cyan-400 mb-2 text-sm">POWER LEVEL</h5>
                  <div className="w-full h-4 bg-gray-800 rounded overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-500 to-cyan-400"
                      style={{ width: `${(selectedEagle.power / 120) * 100}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-gray-500 text-xs">0</span>
                    <span className="text-cyan-300 text-xs">{selectedEagle.power}</span>
                    <span className="text-gray-500 text-xs">120</span>
                  </div>
                </div>
                
                <div className="bg-gray-900/50 border border-cyan-900/30 rounded p-3">
                  <h5 className="text-cyan-400 mb-2 text-sm">EAGLE DNA</h5>
                  <div className="text-gray-400 text-xs font-mono overflow-x-auto">
                    {Array.from({ length: 4 }, (_, i) => (
                      <div key={i} className="mb-1">
                        {Array.from({ length: 16 }, () => 
                          Math.floor(Math.random() * 16).toString(16)
                        ).join('')}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="text-center mt-4">
                  <button 
                    className="bg-gradient-to-r from-cyan-900 to-blue-900 hover:from-cyan-800 hover:to-blue-800 text-cyan-300 px-4 py-2 rounded border border-cyan-700/50 text-sm transition"
                    onClick={() => setSelectedEagle(null)}
                  >
                    CLOSE SECURE PORTAL
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Scan line effect */}
      <div 
        className="fixed top-0 left-0 w-full h-screen pointer-events-none opacity-10 scan-line"
        style={{
          background: 'linear-gradient(transparent 50%, rgba(0, 0, 0, 0.5) 50%)',
          backgroundSize: '100% 4px',
        }}
      ></div>
      
      {/* CSS for effects */}
      <style jsx>{`
        .terminal-bg::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: repeating-linear-gradient(
            0deg,
            rgba(0, 50, 0, 0.15),
            rgba(0, 50, 0, 0.15) 1px,
            transparent 1px,
            transparent 2px
          );
          pointer-events: none;
        }
        
        .glitch-text {
          animation: glitch 0.3s infinite;
        }
        
        @keyframes glitch {
          0% { transform: translate(0) }
          20% { transform: translate(-2px, 2px) }
          40% { transform: translate(-2px, -2px) }
          60% { transform: translate(2px, 2px) }
          80% { transform: translate(2px, -2px) }
          100% { transform: translate(0) }
        }
        
        .scan-line {
          animation: scan 8s linear infinite;
        }
        
        @keyframes scan {
          0% { transform: translateY(-100vh) }
          100% { transform: translateY(100vh) }
        }
        
        .touch-manipulation {
          touch-action: manipulation;
        }
      `}</style>
    </div>
  );
}