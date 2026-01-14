import { useFrame, useThree } from '@react-three/fiber';
import { QueryClientProvider } from '@tanstack/react-query';
import { useCallback, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { CSS3DRenderer, CSS3DObject } from 'three/examples/jsm/Addons.js';
import { queryClient } from '../..';
import * as THREE from "three";


const BASE_FOV = 75;
const BASE_ASPECT = 16 / 9;
    

function Html3d({ position, rotation, scale, children }) {
    const { camera, gl: glRenderer, scene, size } = useThree();
    const rendererRef = useRef();
    const rootRef = useRef();
    const groupRef = useRef();

    useEffect(() => {
        const css3dRenderer = new CSS3DRenderer();
        css3dRenderer.domElement.style.position = 'absolute';
        css3dRenderer.domElement.style.top = '0px';
        css3dRenderer.domElement.style.zIndex = '10';
        css3dRenderer.domElement.style.transformOrigin = 'top left';
        css3dRenderer.domElement.id = "CSS3D";

        glRenderer.domElement.style.position = 'absolute';;
        glRenderer.domElement.style.zIndex = '1';
        glRenderer.domElement.style.pointerEvents = 'none';

        const parent = glRenderer.domElement.parentElement;
        if (parent) {
            parent.insertBefore(css3dRenderer.domElement, glRenderer.domElement);
        }
        rendererRef.current = css3dRenderer;

        const element = document.createElement('div')

        const root = createRoot(element);
        root.render(
            <QueryClientProvider client={queryClient}>
                <div>
                    {children}
                </div>
            </QueryClientProvider>
        );

        rootRef.current = root;
        
        const holder = new THREE.Group();
        holder.position.set(...position);
        holder.rotation.set(...rotation);
        holder.scale.set(...scale);

        const css3dObject = new CSS3DObject(element)
        
        holder.add(css3dObject)

        let wf = 1920 * 0.9;
        let hf = 1080 * 0.9;
        var geometry = new THREE.PlaneGeometry(wf, hf);
        var material = new THREE.MeshBasicMaterial();
        material.color.set('black'); 
        material.opacity = 0;
        material.blending = THREE.NoBlending;
        material.side = THREE.DoubleSide;
        var plane = new THREE.Mesh(geometry, material);
        holder.add(plane)

        groupRef.current = holder;
        scene.add(holder)

        return () => {
            scene.remove(css3dObject);
            css3dRenderer.domElement.remove();
        }
    }, [])

    const onResize = useCallback(() => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        const aspect = width / height;
    
        camera.aspect = aspect;
    
        if (aspect < BASE_ASPECT) {
            const baseFovRad = THREE.MathUtils.degToRad(BASE_FOV);
            const newFovRad = 2 * Math.atan(Math.tan(baseFovRad / 2) * (BASE_ASPECT / aspect));
            camera.fov = THREE.MathUtils.radToDeg(newFovRad);
        } else {
            camera.fov = BASE_FOV;
        }
    
        camera.updateProjectionMatrix();
    }, [camera])

    useEffect(() => {
        if (rendererRef.current) {
            rendererRef.current.setSize(size.width, size.height);
        }
        onResize();
    }, [size.width, size.height, onResize]);


    useFrame(() => {
        if (rendererRef.current) {
            rendererRef.current.render(scene, camera);
        }
        else { 
            console.warn("CSS3DRenderer not initialized yet.");
        }
    });
}

export default Html3d;