import React from 'react';
import { useGLTF } from '@react-three/drei';

function GreenHill() {
    const { scene } = useGLTF('/models/scene.glb');
    return <primitive object={scene} />;
}

export default GreenHill;