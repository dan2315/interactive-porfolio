import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame, useThree, extend } from '@react-three/fiber';
import { Water } from 'three/examples/jsm/objects/Water';
import * as THREE from 'three';

extend({ Water });

function WaterSurface() {
  const waterRef = useRef();
  const { scene } = useThree();

  const waterGeometry = useMemo(() => new THREE.PlaneGeometry(500, 500), []);

  const water = useMemo(() => {
    return new Water(waterGeometry, {
      textureWidth: 512,
      textureHeight: 512,
      waterNormals: new THREE.TextureLoader().load(
        '/textures/water_normals.jpeg',
        (texture) => {
          texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        }
      ),
      sunDirection: new THREE.Vector3(),
      sunColor: 0xffffff,
      waterColor: 0x001e0f,
      distortionScale: 3.7,
      fog: scene.fog !== undefined
    });
  }, [waterGeometry, scene.fog]);

  useEffect(() => {
    water.rotation.x = -Math.PI / 2;
    water.position.y = -5;
  }, [water]);

  useFrame((state, delta) => {
    if (water.material.uniforms.time) {
      water.material.uniforms.time.value += delta*0.2;
    }
  });

  return <primitive object={water} ref={waterRef} />;
}

export default WaterSurface;