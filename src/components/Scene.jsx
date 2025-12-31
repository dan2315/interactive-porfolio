import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import AnimatedCamera from "./3d/AnimatedCamera";
import CameraControls from "./3d/CameraControls";

import Html3d from "./3d/Html3d";
import GLTFModel from "./3d/GLTFModel";
import LoadingScreen from "./LoadingScreen";
import { AssetManagerProvider } from "../contexts/AssetManagerContext";
import Cartridge, { CartridgeType } from "./3d/Cartridge";
import { Physics } from "@react-three/rapier";
import BoxColliders from "./3d/BoxColliders";
import GameConsole from "./3d/GameConsole";
import HtmlContent from "./HtmlContent";
import { useParams } from "react-router-dom";

function Scene() {
  const { cartridge, section } = useParams();
  const [currentView, setCurrentView] = useState("initial");
  const controlRef = useRef();
  const htmlRef = useRef();

  const activeCartridge = cartridge ?? null;
  const initSection = section ?? null;

  useEffect(() => {
    setCurrentView("initial");
  }, []);

  return (
    <>
      <AssetManagerProvider>
        <Canvas style={{ height: "100vh" }} gl={{ stencil: true }}>
          <Suspense fallback={null}>
            <CameraControls ref={controlRef} />
            <AnimatedCamera view={currentView} controlRef={controlRef} />
            <ambientLight intensity={0.2} />
            <directionalLight color="white" position={[-1, 3, 5]} intensity={2} />

            <Physics gravity={[0, -9.81, 0]}>
              <BoxColliders/>
              <GLTFModel id="greenHill" url="/models/scene.glb" />
              <GameConsole id="console" position={[-31.8, 4.71, 7.15]} rotation={[0, -1, 0]}/>
              <Cartridge id={CartridgeType.main}
                active = {activeCartridge === "main"}
                visualOffset = {[0, 0, 0.06]} 
                initialPosition = {[-32.5, 5.07, 7.5]}
                colliderSize = {[0.15, 0.025, 0.17]}
               />
               <Cartridge id={CartridgeType.additional}
                active = {activeCartridge === "additional"}
                visualOffset = {[0, 0, 0.06]} 
                initialPosition = {[-32.5, 4.87, 7.5]}
                colliderSize = {[0.15, 0.025, 0.17]}
               />
               <Cartridge id={CartridgeType.admin}
                active = {activeCartridge === "admin"}
                visualOffset = {[0, 0, 0.06]} 
                initialPosition = {[-32.5, 4.97, 7.5]}
                colliderSize = {[0.15, 0.025, 0.17]}
               />
            </Physics>

            <Html3d
              position={[-33.244, 5.475, 6.467]}
              rotation={[0, (Math.PI / 180) * -30, 0]}
              scale={[0.0009, 0.0009, 0.0009]}
            >
              <HtmlContent/>
            </Html3d>
          </Suspense>
        </Canvas>
        {htmlRef.current}
        <LoadingScreen />
      </AssetManagerProvider>
    </>
  );
}

export default Scene;