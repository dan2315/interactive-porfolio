import { useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { CameraHelper, PerspectiveCamera, WebGLRenderTarget } from "three";

export function Prewarm() {
  const { scene, gl, size } = useThree();
  const dummyCamera = useRef();

  useEffect(() => {
    dummyCamera.current = new PerspectiveCamera(75, size.width / size.height, 0.1, 1000);
    dummyCamera.current.position.set(-25, 10, 20);

    // const helper = new CameraHelper(dummyCamera.current);
    // scene.add(helper);

    const rt = new WebGLRenderTarget(1, 1);
    gl.setRenderTarget(rt);
    gl.render(scene, dummyCamera.current);
    gl.setRenderTarget(null);

    rt.dispose();
  }, [gl, scene, size]);

  return null;
}