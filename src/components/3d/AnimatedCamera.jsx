import { useThree } from "@react-three/fiber";
import { useEffect } from "react";

const CAMERA_VIEWS = {
  initial:  { position: [-33.491, 5.47, 6.9], lookAt: [-33.23, 5.47, 6.45] },
  top:   { position: [0, 10, 0], lookAt: [0, 0, 0] },
  side:  { position: [-8, 2, 0], lookAt: [0, 0, 0] },
  close: { position: [2, 1, 2], lookAt: [0, 1, 0] },
};

function AnimatedCamera({ view, controlRef }) {
  const { camera } = useThree();
  useEffect(() => {
    camera.position.set(CAMERA_VIEWS[view].position[0], CAMERA_VIEWS[view].position[1], CAMERA_VIEWS[view].position[2])
    controlRef.current.target.set(CAMERA_VIEWS[view].lookAt[0], CAMERA_VIEWS[view].lookAt[1], CAMERA_VIEWS[view].lookAt[2])
  })
  return <perspectiveCamera position={CAMERA_VIEWS[view].position} lookAt={CAMERA_VIEWS[view].lookAt}/>;
}

export default AnimatedCamera;