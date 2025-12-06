import { useThree } from "@react-three/fiber";
import { useSpring } from '@react-spring/web';
import { a } from '@react-spring/three';
import { useEffect } from "react";

const CAMERA_VIEWS = {
  home:  { position: [5, 5, 5], lookAt: [0, 0, 0] },
  top:   { position: [0, 10, 0], lookAt: [0, 0, 0] },
  side:  { position: [-8, 2, 0], lookAt: [0, 0, 0] },
  close: { position: [2, 1, 2], lookAt: [0, 1, 0] },
};

function AnimatedCamera({ view }) {
  const { camera } = useThree();

  const { position } = useSpring({
    position: CAMERA_VIEWS[view].position,
    config: { mass: 1, tension: 120, friction: 26 },
  });

  useEffect(() => {
    const target = CAMERA_VIEWS[view].lookAt;
    camera.lookAt(...target);
  }, [camera, view]);

  return <a.perspectiveCamera position={position} />;
}

export default AnimatedCamera;
