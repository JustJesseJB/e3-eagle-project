'use client';

interface EagleDetailModalProps {
  eagle: {
    id: string;
    rarity: string;
    traits: string[];
    power: number;
  };
  onClose: () => void;
}

export default function EagleDetailModal({ eagle, onClose }: EagleDetailModalProps) {
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
    <div 
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" 
      onClick={onClose}
    >
      <div 
        className="bg-black border border-cyan-500 shadow-[0_0_30px_rgba(0,255,255,0.3)] rounded max-w-md w-full max-h-[90vh] overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal header */}
        <div className="bg-gradient-to-r from-blue-900 to-purple-900 p-2 text-center relative">
          <h3 className="text-cyan-300 font-bold">CLASSIFIED E3 DATABASE</h3>
          <button 
            className="absolute right-2 top-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-xs"
            onClick={onClose}
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
                alt={eagle.id}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYwIiBoZWlnaHQ9IjE2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMkQzNzQ4Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMjAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGFsaWdubWVudC1iYXNlbGluZT0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlLCBzYW5zLXNlcmlmIiBmaWxsPSIjOEJFOUZEIj5FM0VhZ2xlIE5GVDwvdGV4dD48L3N2Zz4=';
                }}
              />
            </div>
            <div className="text-center">
              <h4 className="text-white text-lg">{eagle.id}</h4>
              <p className={`${getRarityColor(eagle.rarity)} text-sm`}>{eagle.rarity}</p>
            </div>
          </div>
          
          {/* Eagle stats */}
          <div className="space-y-4">
            <div className="bg-gray-900/50 border border-cyan-900/30 rounded p-3">
              <h5 className="text-cyan-400 mb-2 text-sm">TRAITS</h5>
              {eagle.traits.length > 0 ? (
                <ul className="space-y-1">
                  {eagle.traits.map((trait, index) => (
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
                  style={{ width: `${(eagle.power / 120) * 100}%` }}
                ></div>
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-gray-500 text-xs">0</span>
                <span className="text-cyan-300 text-xs">{eagle.power}</span>
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
                onClick={onClose}
              >
                CLOSE SECURE PORTAL
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}