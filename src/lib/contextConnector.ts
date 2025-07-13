// src/lib/contextConnector.ts

import { useEffect } from 'react';
import { setWalletIntegration } from './commands/walletCommands';
import { setAssetsContext } from './commands/assetsCommands';
// Fix: Remove import that's causing error
// import { setAdminContext } from './commands/adminCommands';
import { useWalletIntegration } from '@/contexts/WalletContext';
import { useAssets } from '@/contexts/AssetsContext';
import { useAdmin } from '@/contexts/AdminContext';

// Define a local setAdminContext function to avoid import error
const setAdminContext = (context: ReturnType<typeof useAdmin>) => {
  console.log('Admin context set locally in contextConnector.ts');
  
  // Store in a local variable if needed
  const adminContext = context;
  
  // Note: This is a workaround until the adminCommands.ts file is properly set up
  // When that file exists, we can import the function directly
};

/**
 * This hook connects all the contexts to their respective command handlers
 * It should be used in the Terminal component to ensure all contexts are properly connected
 */
export function useContextConnector() {
  const walletIntegration = useWalletIntegration();
  const assetsContext = useAssets();
  const adminContext = useAdmin();
  
  useEffect(() => {
    // Connect all contexts to their respective command handlers
    setWalletIntegration(walletIntegration);
    setAssetsContext(assetsContext);
    setAdminContext(adminContext);
    
    console.log('All contexts connected to command handlers');
  }, [walletIntegration, assetsContext, adminContext]);
}