import { useCursor } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { CuboidCollider, RigidBody, useRapier } from "@react-three/rapier";
import { useEffect, useRef, useState } from "react";
import GLTFModel from "./GLTFModel";
import * as THREE from "three";

function InteractiveGLTFModel({ id, url, onLoad, visualOffset, initialPosition, colliderSize, ...props }) {
    const rigidBody = useRef();
    const { camera } = useThree();
    const [hovered, setHovered] = useState(false);
    const dragging = useRef(false);

    useCursor(hovered);

    const plane = useRef(new THREE.Plane());
    const raycaster = useRef(new THREE.Raycaster());
    const mouse = useRef(new THREE.Vector2());
    
    function updateMouse(mouse, e) {
        mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
        mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    }

    const onPointerDown = (e) => {
        e.stopPropagation();
        dragging.current = true;

        updateMouse(mouse, e);
        const bodyPos = rigidBody.current.translation();
        const worldPos = new THREE.Vector3(bodyPos.x, bodyPos.y, bodyPos.z);

        const normal = new THREE.Vector3();
        camera.getWorldDirection(normal);

        plane.current.setFromNormalAndCoplanarPoint(normal, worldPos);
    };

    useEffect(() => {
        const handlePointerMove = (e) => {
            if (!dragging.current) return;

            updateMouse(mouse, e);
        };

        const handlePointerUp = () => {
            if (!dragging.current) return;

            dragging.current = false;
            // rigidBody.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
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

    useFrame((_, delta) => {
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
        const maxSpeed = 6;

        dir.multiplyScalar(strength);
        // dir.clampLength(0, maxSpeed);

        body.setLinvel(
            { x: dir.x, y: dir.y, z: dir.z },
            true
        );
    })

    return(
        <RigidBody position={initialPosition} ref={rigidBody} type="dynamic">
            <CuboidCollider args={colliderSize} />
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

