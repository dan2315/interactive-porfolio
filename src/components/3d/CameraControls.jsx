import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

function CameraControls() {
  return (
    <OrbitControls
      makeDefault
      enableDamping={true}
      dampingFactor={0.05}

      mouseButtons={{
        LEFT: THREE.MOUSE.NONE,
        MIDDLE: THREE.MOUSE.ROTATE,
        RIGHT: THREE.MOUSE.ROTATE,
      }}

      rotateSpeed={0.8}
    />
  );
}

export default CameraControls;