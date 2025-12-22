import { useCursor } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { CuboidCollider, RigidBody, useRapier } from "@react-three/rapier";
import { useEffect, useRef, useState } from "react";
import GLTFModel from "./GLTFModel";
import * as THREE from "three";

function InteractiveGLTFModel({ id, url, onLoad, visualOffset, initialPosition, colliderSize, ...props }) {
    const rigidBody = useRef();
    const { camera } = useThree();
    const { rapier } = useRapier();
    const [hovered, setHovered] = useState(false);
    const dragging = useRef(false);

    useCursor(hovered);

    const plane = useRef(new THREE.Plane());
    const raycaster = useRef(new THREE.Raycaster());
    const mouse = useRef(new THREE.Vector2());

    const onPointerDown = (e) => {
        e.stopPropagation();
        dragging.current = true;
        rigidBody.current.setEnabledRotations(false, false, false);
        rigidBody.current.setBodyType(rapier.RigidBodyType.KinematicPositionBased);

        const bodyPos = rigidBody.current.translation();
        const worldPos = new THREE.Vector3(bodyPos.x, bodyPos.y, bodyPos.z);

        const normal = new THREE.Vector3();
        camera.getWorldDirection(normal);

        plane.current.setFromNormalAndCoplanarPoint(normal, worldPos);
    };

    useEffect(() => {
        const handlePointerMove = (e) => {
            if (!dragging.current) return;

            mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
            mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;

            raycaster.current.setFromCamera(mouse.current, camera);

            const point = new THREE.Vector3();
            if (raycaster.current.ray.intersectPlane(plane.current, point)) {
                rigidBody.current.setNextKinematicTranslation(point);
            }
        };

        const handlePointerUp = () => {
            if (!dragging.current) return;

            dragging.current = false;

            rigidBody.current.setBodyType(
                rapier.RigidBodyType.Dynamic
            );
            rigidBody.current.wakeUp();
        };

        window.addEventListener("pointermove", handlePointerMove);
        window.addEventListener("pointerup", handlePointerUp);
        window.addEventListener("pointercancel", handlePointerUp);

        return () => {
            window.removeEventListener("pointermove", handlePointerMove);
            window.removeEventListener("pointerup", handlePointerUp);
            window.removeEventListener("pointercancel", handlePointerUp);
        };
    }, []);

    return(
        <RigidBody position={[-32.5, 4.77, 7.5]} ref={rigidBody} type="kinematicPosition">
            <CuboidCollider args={[0.15, 0.025, 0.17]} />
            <group position={visualOffset}>

            <GLTFModel
                id={id}
                url={url}
                onLoad={onLoad}
                onPointerOver={() => setHovered(true)}
                onPointerOut={() => setHovered(false)}
                onPointerDown={onPointerDown}
                {...props}
                />
            </group>
        </RigidBody>
    )
}

export default InteractiveGLTFModel;