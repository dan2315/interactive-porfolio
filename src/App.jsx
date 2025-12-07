import './App.css';
import { Suspense, useEffect, useState } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import MainPage from './pages/Main';
import { Canvas } from '@react-three/fiber';
import { CameraControls, Preload } from '@react-three/drei';
import AnimatedCamera from './components/3d/AnimatedCamera';
import Html3d from './components/3d/Html3d';
import GreenHill from './components/3d/GreenHill';
import LoadingScreen from './components/LoadingScreen';


function App() {
  const [currentView, setCurrentView] = useState('home');

  useEffect(() => {
    setCurrentView('home');
  }, []);

  return (
    <>
    <Canvas style={{ height: "100vh" }}>
      <Suspense fallback={null}>  
        <GreenHill />
        <AnimatedCamera view={currentView} />
        <CameraControls />
        <ambientLight intensity={0.1} />
        <directionalLight color="white" position={[-1, 3, 5]} />
        <mesh>
          <boxGeometry args={[2,2,0.4]} />
          <meshStandardMaterial />
        </mesh>


        <Html3d>
          <Navbar/>
          <Router>
            <Routes>
              <Route path="/" element={<MainPage />} />
            </Routes>
          </Router>
        </Html3d>
      </Suspense>
    </Canvas>

    <LoadingScreen />
    </>
  );
}

export default App;
