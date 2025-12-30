import { useCallback, useEffect, useRef, useState } from "react";
import InteractiveGLTFModel from "./InteractiveGLTFModel";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useRapier } from "@react-three/rapier";
import { useConsoleStore } from "../../stores/GameConsoleStore";

const RAY_LENGTH = 3;

const CartridgeState = Object.freeze({
  FREE: 0,
  READYTOBEINSERTED: 1,
  INSERTED: 2,
  EJECTING: 3,
});

function Cartridge({id, active, ...props}) {
    const consoleApi = useConsoleStore(s => s.consoleApi);
    const consoleReady = useConsoleStore(s => s.ready);
    const [state, setState] = useState(CartridgeState.FREE);
    const stateRef = useRef(CartridgeState.FREE);
    const [gameConsole, setGameConsole] = useState(null);
    const canGrab = state === CartridgeState.FREE;
    const { scene, camera } = useThree();
    const { rapier } = useRapier();
    const raycaster = useRef(new THREE.Raycaster());
    const rigidRef = useRef();
    const meshRef = useRef();
    const ejectProgress = useRef(0);

    const targetPosition = useRef(new THREE.Vector3());
    const targetRotation = useRef(new THREE.Quaternion());
    const lerpSpeed = 0.15;

    useEffect(() => {
        stateRef.current = state;
    }, [state])

    useEffect(() => {
        if (!active || !consoleReady) return;

        rigidRef.current.setBodyType(rapier.RigidBodyType.KinematicPositionBased);
        setGameConsole(consoleApi);
        insert(consoleApi);

    }, [active, consoleReady]);

    const findConsoleBeyondCartridge = useCallback((mousePosition) => {
        if (!meshRef.current) return null;

        raycaster.current.setFromCamera(mousePosition, camera);
        raycaster.current.ray.origin.copy(camera.position);
        raycaster.current.far = RAY_LENGTH;

        const hits = raycaster.current.intersectObjects(scene.children, true);
        
        for (const hit of hits) {
            let obj = hit.object;
            let depth = 0;
            
            while (obj && depth < 10) {
                
                if (obj.userData?.isConsole) {
                    return obj.userData.consoleApi;
                }
                
                obj = obj.parent;
                
                if (obj && obj.type === 'Scene') {
                    break;
                }
            }
        }

        return null;
    }, [camera, raycaster, scene.children]);
        
    const handleGrabStart = useCallback(() => {

    }, [])

    const handleGrabMove = useCallback((mousePosition) => {
        if (state === CartridgeState.FREE) {
            const foundConsole = findConsoleBeyondCartridge(mousePosition);
            if (foundConsole && !foundConsole.isCartridgeInserted()) {
                setGameConsole(foundConsole);
                moveToGetInsertedTransform(foundConsole);
                setState(CartridgeState.READYTOBEINSERTED);
            }
        } else if (state === CartridgeState.READYTOBEINSERTED) {
            const foundConsole = findConsoleBeyondCartridge(mousePosition);
            if (!foundConsole) {
                setGameConsole(null);
                setCartridgeFree();
                setState(CartridgeState.FREE);
            }
        }
    }, [findConsoleBeyondCartridge, state])

    const handleGrabEnd = useCallback(() => {
        if (state === CartridgeState.READYTOBEINSERTED) {
            insert(gameConsole);
        }
    }, [gameConsole, state])

    const moveToGetInsertedTransform = (gameConsole) => {
        const { position, rotation } = gameConsole.getInsertPose();

        rigidRef.current.setBodyType(rapier.RigidBodyType.KinematicPositionBased);
        targetPosition.current.copy(position);
        targetRotation.current.copy(rotation);
    };

    const setCartridgeFree = () => {
        rigidRef.current.setBodyType(rapier.RigidBodyType.Dynamic);
        rigidRef.current.wakeUp();
    };

    const insert = (gameConsole) => {
        const { position, rotation } = gameConsole.getInsertedPose();

        setState(CartridgeState.INSERTED);
        gameConsole.setCartridge({eject, getId});

        targetPosition.current.copy(position);
        targetRotation.current.copy(rotation);
    };

    const getId = () => {
        return id;
    }

    const eject = () => {
        if (stateRef.current !== CartridgeState.INSERTED) return;

        setState(CartridgeState.EJECTING);

        const { position } = consoleApi.getEjectPose();

        targetPosition.current.set(
            position.x,
            position.y,
            position.z
        );

        ejectProgress.current = 0;
    };

    const finishEject = () => {
        const body = rigidRef.current;

        body.setBodyType(rapier.RigidBodyType.Dynamic);
        body.wakeUp();

        body.applyImpulse(
            { x: 0, y: 0.25, z: -1.0 },
            true
        );
        
        setGameConsole(null);
        setState(CartridgeState.FREE);
    };

    useFrame((_, delta) => {
        if (state === CartridgeState.READYTOBEINSERTED || state === CartridgeState.INSERTED) {
            if (!rigidRef.current) return;

            const currentPos = rigidRef.current.translation();
            const currentRot = rigidRef.current.rotation();

            const newPos = new THREE.Vector3(
                currentPos.x,
                currentPos.y,
                currentPos.z
            ).lerp(targetPosition.current, lerpSpeed);

            const newRot = new THREE.Quaternion(
                currentRot.x,
                currentRot.y,
                currentRot.z,
                currentRot.w
            ).slerp(targetRotation.current, lerpSpeed);

            rigidRef.current.setNextKinematicTranslation(newPos);
            rigidRef.current.setNextKinematicRotation(newRot);
        } else if (state === CartridgeState.EJECTING) {
            ejectProgress.current += delta * 3;

            const t = Math.min(ejectProgress.current, 1);

            const start = gameConsole.getInsertedPose().position;
            const end = gameConsole.getEjectPose().position;

            const pos = new THREE.Vector3().lerpVectors(start, end, t);

            rigidRef.current.setNextKinematicTranslation(pos);

            if (t >= 1) {
                finishEject();
            }
        }
    });

    return (
        <InteractiveGLTFModel
            url="/models/cartridge.glb"
            id={"cartridge-" + id}
            canGrab={canGrab}
            onGrabStart={handleGrabStart}
            onGrabMove={handleGrabMove}
            onGrabEnd={handleGrabEnd}
            meshRef={meshRef}
            rigidRef={rigidRef}
            {...props}
        />
    )
}

export default Cartridge;
export const CartridgeType = { 
    main: 0,
    additional: 1,
    admin: 2
}