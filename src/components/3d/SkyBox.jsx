import { useThree, useLoader } from "@react-three/fiber";
import * as THREE from "three";

function SkyBox() {
  const path = '/textures/skybox2';
  const textureCube = useLoader(
    THREE.CubeTextureLoader,
    [[
      path + '/px.png',
      path + '/nx.png',
      path + '/py.png',
      path + '/ny.png',
      path + '/pz.png',
      path + '/nz.png'
    ]]
  );

  const { scene } = useThree();
  scene.background = textureCube[0];

  return null;
}

export default SkyBox;