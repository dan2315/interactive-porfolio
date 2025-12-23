import "./App.css";
import { Suspense, useEffect, useRef, useState } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import ExperiencePage from "./pages/ExperiencePage";
import { Canvas } from "@react-three/fiber";
import AnimatedCamera from "./components/3d/AnimatedCamera";
import CameraControls from "./components/3d/CameraControls";

import Html3d from "./components/3d/Html3d";
import GLTFModel from "./components/3d/GLTFModel";
import LoadingScreen from "./components/LoadingScreen";
import { AssetManagerProvider } from "./contexts/AssetManagerContext";
import LeetCodePage from "./pages/LeetCodePage";
import ProjectsPage from "./pages/ProjectsPage";
import Cartridge from "./components/3d/Cartridge";
import { CuboidCollider, Physics, RigidBody } from "@react-three/rapier";
import BoxColliders from "./components/3d/BoxColliders";

function App() {
  const [currentView, setCurrentView] = useState("initial");
  const controlRef = useRef();

  useEffect(() => {
    setCurrentView("initial");
  }, []);

  return (
    <>
      <AssetManagerProvider>
        <Canvas style={{ height: "100vh" }}>
          <Suspense fallback={null}>
            <CameraControls ref={controlRef} />
            <AnimatedCamera view={currentView} controlRef={controlRef} />
            <ambientLight intensity={1} />
            <directionalLight color="white" position={[-1, 3, 5]} />

            <Physics debug gravity={[0, -9.81, 0]}>
              <BoxColliders/>
              <GLTFModel id="greenHill" url="/models/scene.glb" />
              <Cartridge id="main"
                visualOffset = {[0, 0, 0.06]} 
                initialPosition = {[-32.5, 4.77, 7.5]}
                colliderSize = {[0.15, 0.025, 0.17]}
               />
            </Physics>

            <Html3d
              position={[-33.23, 5.47, 6.45]}
              rotation={[0, (Math.PI / 180) * -30, 0]}
              scale={[0.0009, 0.0009, 0.0009]}
            >
              <div className="app-container">
                <Router>
                  <Navbar />
                  <Routes>
                    <Route path="/experiences" element={<ExperiencePage />} />
                    <Route path="/leetcode" element={<LeetCodePage />} />
                    <Route path="/projects" element={<ProjectsPage />} />
                  </Routes>
                </Router>
              </div>
            </Html3d>
          </Suspense>
        </Canvas>

        <LoadingScreen />
      </AssetManagerProvider>
    </>
  );
}

export default App;
