// src/components/admin/AdminPanel.tsx

'use client';
import { useState, useEffect } from 'react';
import { useAdmin, NetworkType } from '@/contexts/AdminContext';

export default function AdminPanel() {
  const { 
    config, 
    updateConfig, 
    saveConfigToLocalStorage,
    loadConfigFromLocalStorage,
    setShowAdminPanel
  } = useAdmin();

  const [localConfig, setLocalConfig] = useState({ ...config });

  // Update local config when global config changes
  useEffect(() => {
    setLocalConfig({ ...config });
  }, [config]);

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    // Handle different input types
    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement;
      setLocalConfig({
        ...localConfig,
        [name]: checked
      });
    } else if (type === 'number') {
      setLocalConfig({
        ...localConfig,
        [name]: parseFloat(value)
      });
    } else {
      setLocalConfig({
        ...localConfig,
        [name]: value
      });
    }
  };

  // Save changes
  const handleSave = () => {
    updateConfig(localConfig);
    saveConfigToLocalStorage();
  };

  // Discard changes
  const handleCancel = () => {
    setLocalConfig({ ...config });
    setShowAdminPanel(false);
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-green-500/30 w-full max-w-2xl rounded-lg shadow-xl overflow-auto max-h-[90vh]">
        {/* Header */}
        <div className="bg-gray-800 p-4 flex justify-between items-center border-b border-green-800/30">
          <h2 className="text-lg font-medium text-green-400">E3 Admin Dashboard</h2>
          <button 
            onClick={() => setShowAdminPanel(false)}
            className="w-6 h-6 bg-red-500/80 rounded-full flex items-center justify-center text-white"
          >
            ×
          </button>
        </div>
        
        {/* Content */}
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Network Settings */}
            <div className="space-y-4">
              <h3 className="text-green-400 text-md border-b border-green-800/30 pb-1">Network Settings</h3>
              
              <div>
                <label className="block text-gray-400 mb-1 text-sm">Network</label>
                <select 
                  name="networkType"
                  value={localConfig.networkType}
                  onChange={handleChange}
                  className="w-full bg-gray-800 text-white rounded border border-gray-700 p-2"
                >
                  <option value="devnet">Devnet</option>
                  <option value="mainnet-beta">Mainnet</option>
                </select>
              </div>
              
              <div>
                <label className="block text-gray-400 mb-1 text-sm">Mint Status</label>
                <div className="flex items-center">
                  <input 
                    type="checkbox"
                    name="mintEnabled"
                    checked={localConfig.mintEnabled}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <span className="text-white">Enable Minting</span>
                </div>
              </div>
              
              <div>
                <label className="block text-gray-400 mb-1 text-sm">Mint Price (SOL)</label>
                <input 
                  type="number"
                  name="mintPrice"
                  value={localConfig.mintPrice}
                  onChange={handleChange}
                  step="0.1"
                  min="0"
                  className="w-full bg-gray-800 text-white rounded border border-gray-700 p-2"
                />
              </div>
              
              <div>
                <label className="block text-gray-400 mb-1 text-sm">Max Supply</label>
                <input 
                  type="number"
                  name="maxSupply"
                  value={localConfig.maxSupply}
                  onChange={handleChange}
                  className="w-full bg-gray-800 text-white rounded border border-gray-700 p-2"
                />
              </div>
              
              <div>
                <label className="block text-gray-400 mb-1 text-sm">Current Supply</label>
                <input 
                  type="number"
                  name="currentSupply"
                  value={localConfig.currentSupply}
                  onChange={handleChange}
                  className="w-full bg-gray-800 text-white rounded border border-gray-700 p-2"
                />
              </div>
            </div>
            
            {/* Feature Toggles */}
            <div className="space-y-4">
              <h3 className="text-green-400 text-md border-b border-green-800/30 pb-1">Feature Toggles</h3>
              
              <div>
                <label className="block text-gray-400 mb-1 text-sm">Wallet Options</label>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input 
                      type="checkbox"
                      name="enableRealWalletOption"
                      checked={localConfig.enableRealWalletOption}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    <span className="text-white">Enable Real Wallet Connection</span>
                  </div>
                  
                  <div className="flex items-center">
                    <input 
                      type="checkbox"
                      name="enableSimulatedWallet"
                      checked={localConfig.enableSimulatedWallet}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    <span className="text-white">Enable Simulated Wallet</span>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-gray-400 mb-1 text-sm">Chat Settings</label>
                <div className="flex items-center">
                  <input 
                    type="checkbox"
                    name="enableSimulatedChat"
                    checked={localConfig.enableSimulatedChat}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <span className="text-white">Enable Simulated Chat</span>
                </div>
              </div>
              
              <div>
                <label className="block text-gray-400 mb-1 text-sm">Admin Wallets</label>
                <textarea 
                  name="adminWallets"
                  value={localConfig.adminWallets.join('\n')}
                  onChange={(e) => {
                    setLocalConfig({
                      ...localConfig,
                      adminWallets: e.target.value.split('\n').filter(wallet => wallet.trim() !== '')
                    });
                  }}
                  rows={3}
                  className="w-full bg-gray-800 text-white rounded border border-gray-700 p-2 font-mono text-xs"
                  placeholder="Enter admin wallet addresses, one per line"
                />
              </div>
            </div>
          </div>
          
          {/* Status and Actions */}
          <div className="mt-6 pt-4 border-t border-green-800/30">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-gray-400 text-sm">Current Network: <span className="text-green-400">{config.networkType.toUpperCase()}</span></div>
                <div className="text-gray-400 text-sm">Mint Status: 
                  <span className={config.mintEnabled ? 'text-green-400 ml-1' : 'text-red-400 ml-1'}>
                    {config.mintEnabled ? 'ACTIVE' : 'DISABLED'}
                  </span>
                </div>
              </div>
              
              <div className="flex space-x-3">
                <button 
                  onClick={handleCancel}
                  className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSave}
                  className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}