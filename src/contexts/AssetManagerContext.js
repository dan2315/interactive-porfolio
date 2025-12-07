import { createContext, useContext } from 'react';
import { useAssetManager } from '../hooks/useAssetManager';

const AssetManagerContext = createContext(null);

export function AssetManagerProvider({ children }) {
  const manager = useAssetManager();
  
  return (
    <AssetManagerContext.Provider value={manager}>
      {children}
    </AssetManagerContext.Provider>
  );
}

export function useAssetManagerContext() {
  const context = useContext(AssetManagerContext);
  if (!context) {
    throw new Error('useAssetManagerContext must be used within AssetManagerProvider');
  }
  return context;
}