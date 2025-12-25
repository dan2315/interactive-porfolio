import { useFrame, useThree } from "@react-three/fiber";

function CameraSync({ mainCameraRef }) {
  const { camera } = useThree();

  useFrame(() => {
    if (mainCameraRef.current) {
      camera.position.copy(mainCameraRef.current.position);
      camera.rotation.copy(mainCameraRef.current.rotation);
      camera.quaternion.copy(mainCameraRef.current.quaternion);
      camera.updateProjectionMatrix();
    }
  });

  return null;
}

export default CameraSync;