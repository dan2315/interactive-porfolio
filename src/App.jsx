import "./App.css";
import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import AnimatedCamera from "./components/3d/AnimatedCamera";
import CameraControls from "./components/3d/CameraControls";

import Html3d from "./components/3d/Html3d";
import GLTFModel from "./components/3d/GLTFModel";
import LoadingScreen from "./components/LoadingScreen";
import { AssetManagerProvider } from "./contexts/AssetManagerContext";
import Cartridge, { CartridgeType } from "./components/3d/Cartridge";
import { Physics } from "@react-three/rapier";
import BoxColliders from "./components/3d/BoxColliders";
import GameConsole from "./components/3d/GameConsole";
import { GameConsoleContext, GameConsoleProvider } from "./contexts/GameConsoleContext";
import HtmlContent from "./components/HtmlContent";
import { useContextBridge } from "@react-three/drei";

function App() {
  const [currentView, setCurrentView] = useState("initial");
  const controlRef = useRef();

  const ContextBridge = useContextBridge(GameConsoleContext);

  useEffect(() => {
    setCurrentView("initial");
  }, []);


  return (
    <>
      <AssetManagerProvider>
      <GameConsoleProvider>
        <Canvas style={{ height: "100vh" }} gl={{ stencil: true }}>
          <ContextBridge>
          <Suspense fallback={null}>
            <CameraControls ref={controlRef} />
            <AnimatedCamera view={currentView} controlRef={controlRef} />
            <ambientLight intensity={0.2} />
            <directionalLight color="white" position={[-1, 3, 5]} intensity={1.8} />

            <Physics gravity={[0, -9.81, 0]}>
              <BoxColliders/>
              <GLTFModel id="greenHill" url="/models/scene.glb" />
              <GameConsole id="console" position={[-31.8, 4.71, 7.15]} rotation={[0, -1, 0]}/>
              <Cartridge id={CartridgeType.main}
                visualOffset = {[0, 0, 0.06]} 
                initialPosition = {[-32.5, 5.07, 7.5]}
                colliderSize = {[0.15, 0.025, 0.17]}
               />
               <Cartridge id={CartridgeType.additional}
                visualOffset = {[0, 0, 0.06]} 
                initialPosition = {[-32.5, 4.87, 7.5]}
                colliderSize = {[0.15, 0.025, 0.17]}
               />
               <Cartridge id={CartridgeType.admin}
                visualOffset = {[0, 0, 0.06]} 
                initialPosition = {[-32.5, 4.97, 7.5]}
                colliderSize = {[0.15, 0.025, 0.17]}
               />
            </Physics>
            <Html3d
              position={[-33.23, 5.47, 6.45]}
              rotation={[0, (Math.PI / 180) * -30, 0]}
              scale={[0.0009, 0.0009, 0.0009]}
            >
              <div className="app-container">
                <HtmlContent/>
              </div>
            </Html3d>
          </Suspense>
          </ContextBridge>
        </Canvas>

        <LoadingScreen />
      </GameConsoleProvider>
      </AssetManagerProvider>
    </>
  );
}

export default App;
