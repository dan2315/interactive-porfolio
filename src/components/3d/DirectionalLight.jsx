import { useFrame } from "@react-three/fiber";
import { useRef } from "react";

            
function DirectionalLight() {

    const lightRef = useRef();

    useFrame(() => {
        if (lightRef.current) {
            lightRef.current.position.set(-28.5, 30, -15);
            lightRef.current.target.position.set(-40, 10, -10);
            lightRef.current.target.updateMatrixWorld();
        }
    });
        
    return (
        <directionalLight
            ref={lightRef}
            position={[-32, 30, -10]}
            intensity={2}
            castShadow
            shadow-mapSize={[4096, 4096]}
            shadow-radius={10}
            shadow-camera-near={1}
            shadow-camera-far={100}
            shadow-camera-left={-50}
            shadow-camera-right={50}
            shadow-camera-top={50}
            shadow-camera-bottom={-50}
            shadow-bias={-0.0004}
        /> 
    )
}

export default DirectionalLight;