import { useRef, useState } from "react";
import GLTFModel from "./GLTFModel";
import * as THREE from "three";
import { CuboidCollider, RigidBody } from "@react-three/rapier";
import { Vector3 } from "three";

function BoxColliders() {
    const [colliders, setColliders] = useState([]);
    const loaded = useRef(false);

    const handleLoad = (gltf) => {
        if (loaded.current) return;
        loaded.current = true;
        const found = []

        gltf.scene.traverse(obj => {
            if (!obj.isMesh) return;
            if (!obj.name.startsWith("COLLIDER")) return;

            const position = new THREE.Vector3();
            const quaternion = new THREE.Quaternion();
            const scale = new THREE.Vector3();

            obj.matrixWorld.decompose(position, quaternion, scale);

            const geometry = obj.geometry;
            geometry.computeBoundingBox();

            const size = new THREE.Vector3();
            geometry.boundingBox.getSize(size);

            size.multiply(scale);
            found.push({
                position: [position.x, position.y, position.z],
                rotation: [quaternion.x, quaternion.y, quaternion.z, quaternion.w],
                size: [size.x / 2, size.y / 2, size.z / 2],
            });
        })

        setColliders(found);
    }

    return(
        <>
        <GLTFModel url="/models/boxcolliders.glb" id="colliders" onLoad={handleLoad} hide />
        <RigidBody type="fixed">
            {colliders.map((c, i) => 
                <CuboidCollider
                    key={i}
                    args={c.size}
                    position={c.position}
                    quaternion={c.rotation}
                />
            )}
        </RigidBody>
        </>
    )
}

export default BoxColliders;