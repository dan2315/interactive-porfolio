import { useEffect, useState, useRef } from 'react';
import { useAssetManagerContext } from '../../contexts/AssetManagerContext';
import { loadGLTF } from '../../utils/gltfLoader';
import * as THREE from "three"
import { Outlines } from '@react-three/drei';
import { Select } from '@react-three/postprocessing';

function GLTFModel({ id, url, contentLength, onLoad, outlineEnabled, ...props }) {
  const [model, setModel] = useState(null);
  const { registerAsset, updateAssetProgress, setAssetLoaded, setAssetError } = useAssetManagerContext();
  const registered = useRef(false);
  const loaded = useRef(false);

  useEffect(() => {
    if (!registered.current) {
      registerAsset(id, { type: 'gltf', url });
      registered.current = true;
    }

    let cancelled = false;

    const loadModel = async () => {
      if (loaded.current) return;
      try {
        const gltf = await loadGLTF(url, contentLength, ({ loaded, total, progress }) => {
          updateAssetProgress(id, { loaded, total, progress });
        });
        if (cancelled) return;

        gltf.scene.traverse((obj) => {
          if (!obj.isMesh) return;

          obj.castShadow = true;
          obj.receiveShadow = true;

          const mat = obj.material;
          if (!mat) return;

          if (mat.map) {
            mat.map.colorSpace = THREE.SRGBColorSpace;
            mat.map.flipY = false;
          }

          if (mat.emissiveMap) {
            mat.emissiveMap.colorSpace = THREE.SRGBColorSpace;
            mat.emissiveMap.flipY = false;
          }

          if (mat.normalMap) mat.normalMap.flipY = false;
          if (mat.roughnessMap) mat.roughnessMap.flipY = false;
          if (mat.metalnessMap) mat.metalnessMap.flipY = false;
          if (mat.aoMap) mat.aoMap.flipY = false;

          mat.needsUpdate = true;
        });

        setModel(gltf.scene);
        setAssetLoaded(id);
        onLoad?.(gltf);
        loaded.current = true;

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
    };
  }, [id, url, registerAsset, updateAssetProgress, setAssetLoaded, setAssetError, onLoad, contentLength]);


  return model && !props.hide ? <>
  <Select>
    <primitive object={model} {...props} />
    </Select>
  </> : null;
}

export default GLTFModel;