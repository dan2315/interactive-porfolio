import { useFrame, useThree } from '@react-three/fiber';
import { QueryClientProvider } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { CSS3DRenderer, CSS3DObject } from 'three/examples/jsm/Addons.js';
import { queryClient } from '../..';

function Html3d({ position, rotation, scale, children }) {
    const { camera, gl, scene, size } = useThree();
    const css3dRef = useRef();
    const rendererRef = useRef();
    const rootRef = useRef();


    useEffect(() => {
        const css3dRenderer = new CSS3DRenderer();
        css3dRenderer.domElement.style.position = 'absolute';
        css3dRenderer.domElement.style.top = '0px';
        css3dRenderer.domElement.style.pointerEvents = 'none';

        const parent = gl.domElement.parentElement;
        if (parent) {
            parent.appendChild(css3dRenderer.domElement);
        }
        rendererRef.current = css3dRenderer;

        const element = document.createElement('div')
        element.style.pointerEvents = 'auto'

        const root = createRoot(element);
        root.render(
            <QueryClientProvider client={queryClient}>
                <div>
                    {children}
                </div>
            </QueryClientProvider>);

        rootRef.current = root;
        
        const css3dObject = new CSS3DObject(element)
        css3dObject.position.set(...position)
        css3dObject.rotation.set(...rotation)
        css3dObject.scale.set(...scale);
        
        scene.add(css3dObject)
        css3dRef.current = css3dObject

        return () => {
            scene.remove(css3dObject)
            css3dRenderer.domElement.remove()
        }
    }, [])

    useEffect(() => {
        if (rendererRef.current) {
            rendererRef.current.setSize(size.width, size.height);
        }
    }, [size.width, size.height]);


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