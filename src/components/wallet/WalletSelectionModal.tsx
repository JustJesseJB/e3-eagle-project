// src/components/wallet/WalletSelectionModal.tsx

'use client';
import { useWalletIntegration } from '@/contexts/WalletContext';
import { useAdmin } from '@/contexts/AdminContext';

interface WalletSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WalletSelectionModal({ isOpen, onClose }: WalletSelectionModalProps) {
  const { connectWallet, simulateWalletConnection } = useWalletIntegration();
  const { config } = useAdmin();
  
  if (!isOpen) return null;
  
  const handleConnectRealWallet = async () => {
    await connectWallet();
    onClose();
  };
  
  const handleUseSimulatedWallet = () => {
    simulateWalletConnection();
    onClose();
  };
  
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-green-500/30 max-w-md w-full rounded-lg shadow-xl overflow-hidden">
        {/* Modal header */}
        <div className="bg-gray-800 p-4 flex justify-between items-center border-b border-green-800/30">
          <h3 className="text-lg font-medium text-green-400">Connect Wallet</h3>
          <button 
            onClick={onClose}
            className="w-6 h-6 bg-red-500/80 rounded-full flex items-center justify-center text-white"
          >
            ×
          </button>
        </div>
        
        {/* Modal content */}
        <div className="p-6 space-y-6">
          <p className="text-white">Choose a wallet connection method:</p>
          
          <div className="space-y-4">
            {config.enableRealWalletOption && (
              <button
                onClick={handleConnectRealWallet}
                className="w-full bg-green-700/60 hover:bg-green-700/80 text-white py-3 px-4 rounded border border-green-600/30 transition flex items-center justify-center"
              >
                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                Connect Real Wallet
              </button>
            )}
            
            {config.enableSimulatedWallet && (
              <button
                onClick={handleUseSimulatedWallet}
                className="w-full bg-purple-700/60 hover:bg-purple-700/80 text-white py-3 px-4 rounded border border-purple-600/30 transition flex items-center justify-center"
              >
                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
                Use Simulated Wallet
              </button>
            )}
            
            <div className="text-xs text-gray-400 mt-4">
              <p>Real wallet requires a browser extension like Phantom, Solflare, or Backpack.</p>
              <p>Simulated wallet allows you to test the experience without a real connection.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}