import { Outlines, useCursor } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { CuboidCollider, RigidBody } from "@react-three/rapier";
import { useEffect, useRef, useState } from "react";
import GLTFModel from "./GLTFModel";
import * as THREE from "three";

function InteractiveGLTFModel({
  id,
  url,
  onLoad,
  onGrabStart,
  onGrabMove,
  onGrabEnd,
  canGrab,
  meshRef,
  rigidRef,
  visualOffset,
  initialPosition,
  colliderSize,
  ...props
}) {
  const rigidBody = useRef();
  const groupRef = useRef();
  const { camera } = useThree();
  const [hovered, setHovered] = useState(false);
  const dragging = useRef(false);

  useCursor(hovered && canGrab);

  const plane = useRef(new THREE.Plane());
  const raycaster = useRef(new THREE.Raycaster());
  const mouse = useRef(new THREE.Vector2());

  function updateMouse(mouse, e) {
    mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
  }

  const onPointerDown = (e) => {
    if (!canGrab) return;
    dragging.current = true;
    e.stopPropagation();
    updateMouse(mouse, e);
    const bodyPos = rigidBody.current.translation();
    const worldPos = new THREE.Vector3(bodyPos.x, bodyPos.y, bodyPos.z);

    const normal = new THREE.Vector3();
    camera.getWorldDirection(normal);

    plane.current.setFromNormalAndCoplanarPoint(normal, worldPos);

    onGrabStart?.();
  };

  useEffect(() => {
    const handlePointerMove = (e) => {
      if (!dragging.current) return;
      updateMouse(mouse, e);
    };

    const handlePointerUp = () => {
      if (!dragging.current) return;
      dragging.current = false;
      onGrabEnd?.();
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
    window.addEventListener("pointercancel", handlePointerUp);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointercancel", handlePointerUp);
    };
  }, [onGrabEnd]);

  useEffect(() => {
    if (!groupRef.current || !hovered) return;

    groupRef.current.traverse((child) => {
      if (child.isMesh) {
        child.userData.outlineEnabled = true;
      }
    });

    return () => {
      if (!groupRef.current) return;
      groupRef.current.traverse((child) => {
        if (child.isMesh) {
          child.userData.outlineEnabled = false;
        }
      });
    };
  }, [hovered]);

  useFrame(() => {
    if (!dragging.current) return;

    raycaster.current.setFromCamera(mouse.current, camera);

    const point = new THREE.Vector3();
    if (!raycaster.current.ray.intersectPlane(plane.current, point)) return;

    const body = rigidBody.current;
    const bodyPos = body.translation();

    const dir = new THREE.Vector3(
      point.x - bodyPos.x,
      point.y - bodyPos.y,
      point.z - bodyPos.z
    );

    const strength = 5;
    dir.multiplyScalar(strength);

    body.setLinvel({ x: dir.x, y: dir.y, z: dir.z }, true);

    onGrabMove?.(mouse.current);
  });

  return (
    <RigidBody 
      ref={(rb) => {
        rigidBody.current = rb;
        if (rigidRef) rigidRef.current = rb;
      }}
      position={initialPosition}
      type="dynamic"
    >
      <CuboidCollider args={colliderSize} />
      <group
        ref={(g) => {
          groupRef.current = g;
          if (meshRef) meshRef.current = g;
        }}
        position={visualOffset}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onPointerDown={onPointerDown}
      >
        <GLTFModel id={id} url={url} onLoad={onLoad} {...props} />
        {hovered && (
          <Outlines 
            thickness={5} 
            color="cyan" 
            screenspace
            opacity={1}
            transparent
            angle={Math.PI}
          />
        )}
      </group>
    </RigidBody>
  );
}

export default InteractiveGLTFModel;