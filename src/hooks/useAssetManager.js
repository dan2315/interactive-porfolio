// hooks/useAssetManager.js
import { useState, useCallback, useEffect, useMemo } from 'react';

export function useAssetManager() {
  const [assets, setAssets] = useState({});
  const [isComplete, setIsComplete] = useState(false);

  // Register a new asset to track
  const registerAsset = useCallback((id, metadata = {}) => {
    setAssets(prev => {
      // Don't re-register if already exists
      if (prev[id]) return prev;
      
      return {
        ...prev,
        [id]: {
          id,
          loaded: 0,
          total: 0,
          progress: 0,
          status: 'pending',
          error: null,
          ...metadata
        }
      };
    });
  }, []);

  // Update asset progress
  const updateAssetProgress = useCallback((id, { loaded, total, progress }) => {
    setAssets(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        loaded,
        total,
        progress,
        status: progress >= 100 ? 'loaded' : 'loading'
      }
    }));
  }, []);

  // Mark asset as loaded
  const setAssetLoaded = useCallback((id) => {
    setAssets(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        progress: 100,
        status: 'loaded'
      }
    }));
  }, []);

  const setAssetError = useCallback((id, error) => {
    setAssets(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        status: 'error',
        error
      }
    }));
  }, []);

  const totalProgress = useMemo(() => {
    const assetArray = Object.values(assets);
    if (assetArray.length === 0) return 0;

    const totalBytes = assetArray.reduce((sum, asset) => sum + (asset.total || 0), 0);
    const loadedBytes = assetArray.reduce((sum, asset) => sum + (asset.loaded || 0), 0);

    if (totalBytes === 0) return 0;

    return (loadedBytes / totalBytes) * 100;
  }, [assets]);

  // Get byte statistics
  const byteStats = useMemo(() => {
    const assetArray = Object.values(assets);
    const totalBytes = assetArray.reduce((sum, asset) => sum + (asset.total || 0), 0);
    const loadedBytes = assetArray.reduce((sum, asset) => sum + (asset.loaded || 0), 0);
    
    return {
      totalBytes,
      loadedBytes,
      totalMB: (totalBytes / 1024 / 1024).toFixed(2),
      loadedMB: (loadedBytes / 1024 / 1024).toFixed(2)
    };
  }, [assets]);

  // Calculate counts
  const assetCount = useMemo(() => Object.keys(assets).length, [assets]);
  const loadedCount = useMemo(() => 
    Object.values(assets).filter(a => a.status === 'loaded').length, 
    [assets]
  );
  const errorCount = useMemo(() => 
    Object.values(assets).filter(a => a.status === 'error').length, 
    [assets]
  );

  // Check if all assets are loaded
  useEffect(() => {
    const assetArray = Object.values(assets);
    if (assetArray.length === 0) {
      setIsComplete(false);
      return;
    }

    const allComplete = assetArray.every(
      asset => asset.status === 'loaded' || asset.status === 'error'
    );
    
    if (allComplete !== isComplete) {
      setIsComplete(allComplete);
    }
  }, [assets, isComplete]);

  return {
    assets,
    registerAsset,
    updateAssetProgress,
    setAssetLoaded,
    setAssetError,
    totalProgress,
    byteStats,
    isComplete,
    assetCount,
    loadedCount,
    errorCount
  };
}