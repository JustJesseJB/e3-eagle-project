// src/contexts/AdminContext.tsx

'use client';
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useWalletIntegration } from './WalletContext';

// Define configuration options
export type NetworkType = 'devnet' | 'mainnet-beta';

export type AdminConfig = {
  // General settings
  networkType: NetworkType;
  mintEnabled: boolean;
  maxSupply: number;
  currentSupply: number;
  mintPrice: number;  // in SOL
  
  // Feature toggles
  enableSimulatedWallet: boolean;
  enableSimulatedChat: boolean;
  enableRealWalletOption: boolean;
  
  // Admin wallet addresses (these addresses can access admin features)
  adminWallets: string[];
};

// Initial default configuration
const DEFAULT_CONFIG: AdminConfig = {
  networkType: 'devnet',
  mintEnabled: true,
  maxSupply: 10000,
  currentSupply: 124,
  mintPrice: 1.5,
  
  enableSimulatedWallet: true,
  enableSimulatedChat: true,
  enableRealWalletOption: true,
  
  adminWallets: [
    'ADMIN_WALLET_ADDRESS_1',  // Replace with your actual wallet address
    'ADMIN_WALLET_ADDRESS_2'   // Optional additional admin wallet
  ]
};

type AdminContextType = {
  config: AdminConfig;
  updateConfig: (newConfig: Partial<AdminConfig>) => void;
  isAdmin: boolean;
  showAdminPanel: boolean;
  setShowAdminPanel: (show: boolean) => void;
  saveConfigToLocalStorage: () => void;
  loadConfigFromLocalStorage: () => void;
};

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<AdminConfig>(DEFAULT_CONFIG);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const { connected, shortenedAddress, publicKey } = useWalletIntegration();

  // Check if current wallet is admin
  const isAdmin = connected && publicKey ? 
    config.adminWallets.includes(publicKey.toString()) : 
    false;

  // Load config from localStorage on initial render
  useEffect(() => {
    loadConfigFromLocalStorage();
  }, []);

  // Update config (partial updates)
  const updateConfig = (newConfig: Partial<AdminConfig>) => {
    setConfig(prev => ({
      ...prev,
      ...newConfig
    }));
  };

  // Save current config to localStorage
  const saveConfigToLocalStorage = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('e3-admin-config', JSON.stringify(config));
      console.log('Admin config saved to localStorage');
    }
  };

  // Load config from localStorage
  const loadConfigFromLocalStorage = () => {
    if (typeof window !== 'undefined') {
      const savedConfig = localStorage.getItem('e3-admin-config');
      if (savedConfig) {
        try {
          const parsedConfig = JSON.parse(savedConfig);
          setConfig(parsedConfig);
          console.log('Admin config loaded from localStorage');
        } catch (error) {
          console.error('Error parsing admin config from localStorage:', error);
        }
      }
    }
  };

  return (
    <AdminContext.Provider value={{
      config,
      updateConfig,
      isAdmin,
      showAdminPanel,
      setShowAdminPanel,
      saveConfigToLocalStorage,
      loadConfigFromLocalStorage
    }}>
      {children}
    </AdminContext.Provider>
  );
}

// Hook for easy context access
export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}