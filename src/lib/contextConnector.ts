// src/lib/contextConnector.ts

import { useEffect } from 'react';
import { setWalletIntegration, setAdminContext } from './commands/walletCommands';
import { setAssetsContext } from './commands/assetsCommands';
import { setChatContexts } from './commands/chatCommands';
import { useWalletIntegration } from '@/contexts/WalletContext';
import { useAssets } from '@/contexts/AssetsContext';
import { useAdmin } from '@/contexts/AdminContext';

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
    
    // Connect chat contexts for showcase command functionality
    setChatContexts(walletIntegration, assetsContext);
    
    console.log('All contexts connected to command handlers');
  }, [walletIntegration, assetsContext, adminContext]);
}