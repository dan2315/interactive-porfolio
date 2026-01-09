import { useFrame, useThree } from "@react-three/fiber";
import { CuboidCollider, CylinderCollider, RigidBody, useRapier } from "@react-three/rapier";
import { useCallback, useEffect, useRef, useState } from "react";
import GLTFModel from "./GLTFModel";
import * as THREE from "three";
import { useSceneStore } from "../../stores/SceneStore";
import { ModifiedSelect } from "./SelectionAPI";
import { useInputStore } from "../../stores/InputStores";

function InteractiveGLTFModel({
  id,
  url,
  onLoad,
  onGrabStart,
  onGrabMove,
  onGrabEnd,
  canGrab = true,
  meshRef,
  rigidRef,
  visualOffset,
  initialPosition,
  colliderSize,
  colliderType,
  ...props
}) {
  const rigidBody = useRef();
  const groupRef = useRef();
  const { camera } = useThree();
  const [hovered, setHovered] = useState(false);
  const dragging = useRef(false);
  const resetTrigger = useSceneStore(s => s.resetTrigger);
  const {rapier} = useRapier();
 
  const plane = useRef(new THREE.Plane());
  const raycaster = useRef(new THREE.Raycaster());
  const mouse = useRef(new THREE.Vector2());
  const { getOwner: owner, claim, release } = useInputStore();

  useGrabCursor({
    hovered,
    dragging: dragging.current,
    canGrab
  });

  function useGrabCursor({ hovered, dragging, canGrab }) {
    useEffect(() => {
      const body = document.body;

      body.classList.remove("cursor-grab", "cursor-grabbing");

      if (dragging) {
        body.classList.add("cursor-grabbing");
      } else if (hovered && canGrab) {
        body.classList.add("cursor-grab");
      }

      return () => {
        body.classList.remove("cursor-grab", "cursor-grabbing");
      };
    }, [hovered, dragging, canGrab]);
  }

  function updateMouse(mouse, e) {
    mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
  }

  const onPointerDown = (e) => {
    if (!canGrab) return;
    if (!claim("objinteraction")) return
    
    dragging.current = true;
    updateMouse(mouse, e);
    const bodyPos = rigidBody.current.translation();
    const worldPos = new THREE.Vector3(bodyPos.x, bodyPos.y, bodyPos.z);
    
    const normal = new THREE.Vector3();
    camera.getWorldDirection(normal);
    
    plane.current.setFromNormalAndCoplanarPoint(normal, worldPos);
    
    onGrabStart?.();
    e.stopPropagation();
  };

  useEffect(() => {
    const handlePointerMove = (e) => {
      if (owner() !== "objinteraction")
      if (!dragging.current) return;
      updateMouse(mouse, e);
      e.stopPropagation();
    };

    const handlePointerUp = (e) => {
      if (!dragging.current) return;
      release("objinteraction");
      document.body.classList.remove("cursor-grab", "cursor-grabbing");
      
      dragging.current = false;
      onGrabEnd?.();
      e.stopPropagation();
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

  const reset = useCallback(() => {
    const rb = rigidBody.current;
    if (!rb || rb.isKinematic()) return;

    const position = new THREE.Vector3(
        initialPosition[0],
        initialPosition[1],
        initialPosition[2]
    );
    const rotation = new THREE.Quaternion(0, 0, 0, 1);
    rb.setTranslation(position, true);
    rb.setRotation(rotation, true);
    rb.setLinvel({ x: 0, y: 0, z: 0 }, true);
    rb.setAngvel({ x: 0, y: 0, z: 0 }, true);
    rb.wakeUp();

  }, [initialPosition.x, initialPosition.y, initialPosition.z, rapier.RigidBodyType.KinematicPositionBased]);

  useEffect(() => {
    if (resetTrigger > 0) {
      setTimeout(reset, 0);
    } 
  }, [resetTrigger])

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

  const collider = () => {
    switch (colliderType) {
      case "cylinder": return <CylinderCollider args={colliderSize}/>
      default: return <CuboidCollider args={colliderSize} />
    }
  }

  return (
    <RigidBody 
      ref={(rb) => {
        rigidBody.current = rb;
        if (rigidRef) rigidRef.current = rb;
      }}
      position={initialPosition}
      type="dynamic"
    >
      {collider()}
      <ModifiedSelect enabled={hovered && !dragging.current && canGrab}>
        <group
          ref={(g) => {
            groupRef.current = g;
            if (meshRef) meshRef.current = g;
          }}
          position={visualOffset}
          onPointerOver={(e) => {setHovered(true);e.stopPropagation()}}
          onPointerOut={() => setHovered(false)}
          onPointerDown={onPointerDown}
        >
            <GLTFModel id={id} url={url} onLoad={onLoad} {...props} />
        </group>
      </ModifiedSelect>
    </RigidBody>
  );
}

export default InteractiveGLTFModel;