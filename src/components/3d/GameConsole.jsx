import { useRef } from "react";
import GLTFModel from "./GLTFModel";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useConsole } from "../../contexts/GameConsoleContext";

function GameConsole({ position, rotation, ...props }) {
    const { setCartridgeId } = useConsole()
    const groupRef = useRef();
    const consoleRef = useRef();
    const ejectButtonRef = useRef();
    const cartridgeRef = useRef(null);
    const isInitialized = useRef(false);

    const onLoad = (gltf) => {
        const scene = gltf.scene;
        consoleRef.current = scene;

        scene.traverse((obj) => {
            if (obj.name === "EjectButton") {
              ejectButtonRef.current = obj;
              if (ejectButtonRef.current) {
                ejectButtonRef.current.userData.onPointerDown = (e) => {
                    e.stopPropagation();
                    consoleApi.eject();
                };
              }
            }
        });

        if (groupRef.current) {
            groupRef.current.userData.isConsole = true;
            groupRef.current.userData.consoleApi = consoleApi;
        }
    };

    useFrame(() => {
        if (!consoleRef.current || isInitialized.current || !groupRef.current) return;

        groupRef.current.updateMatrixWorld(true);

        let insertSlot = null;
        let readySlot = null;
        let ejectSlot = null;

        groupRef.current.traverse((obj) => {
            if (obj.name === "InsertSlot") {
                insertSlot = obj;
            }
            else if (obj.name === "ReadyToBeInsertedSlot") {
                readySlot = obj;
            }
            else if (obj.name === "EjectSlot") {
                ejectSlot = obj;
            }
        });

        if (insertSlot && readySlot) {
            const insertPos = new THREE.Vector3();
            const insertRot = new THREE.Quaternion();
            const insertedPos = new THREE.Vector3();
            const insertedRot = new THREE.Quaternion();
            const ejectedPos = new THREE.Vector3();
            const ejectedRot = new THREE.Quaternion();

            readySlot.getWorldPosition(insertPos);
            readySlot.getWorldQuaternion(insertRot);
            insertSlot.getWorldPosition(insertedPos);
            insertSlot.getWorldQuaternion(insertedRot);
            ejectSlot.getWorldPosition(ejectedPos);
            ejectSlot.getWorldQuaternion(ejectedRot);

            groupRef.current.userData.insertPosition = insertPos;
            groupRef.current.userData.insertRotation = insertRot;
            groupRef.current.userData.insertedPosition = insertedPos;
            groupRef.current.userData.insertedRotation = insertedRot;
            groupRef.current.userData.ejectedPosition = ejectedPos;
            groupRef.current.userData.ejectedRotation = ejectedRot;

            window.console.log("Console positions initialized:", {
                insert: insertPos,
                inserted: insertedPos,
            });

            isInitialized.current = true;
        }
    });

    const consoleApi = {
        setCartridge(cartridge) {
          cartridgeRef.current = cartridge;
          setCartridgeId(cartridge.getId());
        },

        isCartridgeInserted() {
          return cartridgeRef.current != null;
        },

        clearCartridge() {
            cartridgeRef.current = null;
        },

        eject() {
            if (!cartridgeRef.current) return;
            cartridgeRef.current.eject();
            cartridgeRef.current = null;
        },

        getInsertPose() {
            return {
                position: groupRef.current.userData.insertPosition,
                rotation: groupRef.current.userData.insertRotation,
            };
        },

        getInsertedPose() {
            return {
                position: groupRef.current.userData.insertedPosition,
                rotation: groupRef.current.userData.insertedRotation,
            };
        },

        getEjectPose() {
          return {
                position: groupRef.current.userData.ejectedPosition,
                rotation: groupRef.current.userData.ejectedRotation,
            };
        }
    };

    const handlePointerDown = (e) => {
      let obj = e.object;
      while (obj) {
        if (obj.userData?.onPointerDown) {
          obj.userData.onPointerDown(e);
          break;
        }
        obj = obj.parent;
      }
    }

    return (
        <group 
          ref={groupRef}
          position={position}
          rotation={rotation}
          onPointerDown={handlePointerDown}
           >
            <GLTFModel
                url={"/models/console.glb"}
                onLoad={onLoad}
                {...props}
            />
        </group>
    );
}

export default GameConsole;