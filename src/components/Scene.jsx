import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import ControlledCamera from "./3d/AnimatedCamera";

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
import models from "../data/models.json"
import * as THREE from "three"
import { Environment, Outlines} from "@react-three/drei";
import DirectionalLight from "./3d/DirectionalLight";
import PostFX from "./3d/PostFX";
import SkyBox from "./3d/SkyBox";
import WaterSurface from "./3d/Water";
import ResetButton from "./3d/ResetButton";
import { ModifiedSelect, ModifiedSelection } from "./3d/SelectionAPI";
import InteractiveGLTFModel from "./3d/InteractiveGLTFModel";


function Scene() {
  const { cartridge, section } = useParams();
  const [currentView, setCurrentView] = useState("initial");
  const htmlRef = useRef();

  const activeCartridge = cartridge ?? null;
  const initSection = section ?? null;

  useEffect(() => {
    setCurrentView("initial");
  }, []);

  return (
    <>
      <AssetManagerProvider>
        <Canvas style={{ height: "100vh" }}
          shadows
          gl={{ 
            stencil: true,
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1,
            outputColorSpace: THREE.SRGBColorSpace 
          }}
          camera={{ fov: 75, near: 0.1, far: 1000 }}
          onCreated={({ gl }) => {
            gl.physicallyCorrectLights = true;
          }}
        >
          <Suspense fallback={null}>
            <ModifiedSelection>
            <ControlledCamera view={currentView}/>
            <Environment
              preset="lobby"
              background={false}
            />

            <DirectionalLight/>
            <SkyBox/>
            <WaterSurface/>

            <Physics gravity={[0, -9.81, 0]}>
              <GLTFModel id="greenHill" url={models.scene.path} contentLength={models.scene.contentLength}/>
              <GameConsole position={[-31.8, 4.71, 7.15]} rotation={[0, -1, 0]}/>
               <Cartridge id={CartridgeType.main}
                active = {activeCartridge === "main"}
                visualOffset = {[0, 0, 0.06]} 
                initialPosition = {[-32.8, 5.07, 7.3]}
                colliderSize = {[0.15, 0.025, 0.17]}
                />
                <Cartridge id={CartridgeType.additional}
                active = {activeCartridge === "additional"}
                visualOffset = {[0, 0, 0.06]} 
                initialPosition = {[-32.8, 4.87, 7.3]}
                colliderSize = {[0.15, 0.025, 0.17]}
                />
                <Cartridge id={CartridgeType.admin}
                active = {activeCartridge === "admin"}
                visualOffset = {[0, 0, 0.06]} 
                initialPosition = {[-32.8, 4.97, 7.3]}
                colliderSize = {[0.15, 0.025, 0.17]}
                />
               <InteractiveGLTFModel
                id={"cup"}
                url={models.cup.path}
                contentLength={models.cup.contentLength}
                initialPosition={[-32.5, 5, 7.7]}
                visualOffset = {[0, -0.09, 0]} 
                colliderSize = {[0.12, 0.1]}
                colliderType={"cylinder"}
                />
                <InteractiveGLTFModel
                id={"duck"}
                url={models.duck.path}
                contentLength={models.duck.contentLength}
                initialPosition={[-34.2, 5, 5.8]}
                colliderSize = {[0.1, 0.1, 0.1]}
                visualOffset = {[0, -0.09, 0]} 
                />
               <ResetButton/>
              <BoxColliders/>
            </Physics>

            <Html3d
              position={[-33.244, 5.475, 6.467]}
              rotation={[0, (Math.PI / 180) * -30, 0]}
              scale={[0.0009, 0.0009, 0.0009]}
              >
              <HtmlContent/>
            </Html3d>
            <PostFX/>
          </ModifiedSelection>
          </Suspense>
        </Canvas>
        {htmlRef.current}
        <LoadingScreen />
      </AssetManagerProvider>
    </>
  );
}

export default Scene;