import { useEffect, useState, useRef } from 'react';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { loadWithProgress, createBlobURL } from '../../utils/assetLoader';
import { useAssetManagerContext } from '../../contexts/AssetManagerContext';

function GLTFModel({ id, url, onLoad, ...props }) {
  const [model, setModel] = useState(null);
  const { registerAsset, updateAssetProgress, setAssetLoaded, setAssetError } = useAssetManagerContext();
  const registered = useRef(false);

  useEffect(() => {
    if (!registered.current) {
      registerAsset(id, { type: 'gltf', url });
      registered.current = true;
    }

    let cancelled = false;
    let blobURL = null;

    const loadModel = async () => {
      try {
        const data = await loadWithProgress(url, ({ loaded, total, progress }) => {
          if (!cancelled) {
            updateAssetProgress(id, { loaded, total, progress });
          }
        });

        if (cancelled) return;

        blobURL = createBlobURL(data, 'model/gltf-binary');

        const loader = new GLTFLoader();
        loader.load(
          blobURL,
          (gltf) => {
            if (!cancelled) {
              setModel(gltf.scene);
              setAssetLoaded(id);
              onLoad?.(gltf);
            }
          },
          undefined,
          (error) => {
            if (!cancelled) {
              console.error(`Error loading ${id}:`, error);
              setAssetError(id, error.message);
            }
          }
        );
      } catch (error) {
        if (!cancelled) {
          console.error(`Error downloading ${id}:`, error);
          setAssetError(id, error.message);
        }
      }
    };

    loadModel();

    return () => {
      cancelled = true;
      if (blobURL) {
        URL.revokeObjectURL(blobURL);
      }
    };
  }, [id, url, registerAsset, updateAssetProgress, setAssetLoaded, setAssetError, onLoad]);

  return model && !props.hide ? <primitive object={model} {...props} /> : null;
}

export default GLTFModel;