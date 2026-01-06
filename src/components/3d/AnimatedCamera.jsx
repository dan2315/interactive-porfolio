import { OrbitControls } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from 'three'
import { BezierHelper, ControlPointHelper } from "../dev/3d/DebugHelpers";

const CAMERA_VIEWS = {
  initial:  new THREE.CubicBezierCurve3(
    new THREE.Vector3(-33.512, 5.475, 6.93),
    new THREE.Vector3(-33.725, 5.475, 7.3),
    new THREE.Vector3(-33.7, 5.475, 7.2),
    new THREE.Vector3(-34, 5.6, 7.5),
  ),
  top:   { position: [0, 10, 0], lookAt: [0, 0, 0] },
  side:  { position: [-8, 2, 0], lookAt: [0, 0, 0] },
  close: { position: [2, 1, 2], lookAt: [0, 1, 0] },
};

const MAX_YAW = THREE.MathUtils.degToRad(16);
const MAX_PITCH = THREE.MathUtils.degToRad(22);

const MOUSE_SENSITIVITY = 0.002;
const TOUCH_SENSITIVITY = 0.004;

function ControlledCamera({ view, debug }) {
  const { camera } = useThree();
  const progress = useRef(0);
  const targetProgress = useRef(0);

  const rotation = useRef({ x: 0, y: 0 });
  const targetRotation = useRef({ x: 0, y: 0 });

  const curve = CAMERA_VIEWS[view];
  const debugElement = <>
    <OrbitControls makeDefault position0={[-33.512, 5.475, 6.93]}/>
    <BezierHelper curve={curve} debug/>
    <ControlPointHelper position={curve.v0}  />
    <ControlPointHelper position={curve.v1}  />
    <ControlPointHelper position={curve.v2} end />
    <ControlPointHelper position={curve.v3} end />
  </>

  useEffect(() => {
    const onWheel = (e) => {
      targetProgress.current += e.deltaY * 0.0005
      targetProgress.current = THREE.MathUtils.clamp(
        targetProgress.current,
        0,
        1
      )
    }

    let lastX = 0
    let lastY = 0
    let isDown = false

    const onMouseDown = (e) => {
      isDown = true
      lastX = e.clientX
      lastY = e.clientY
    }

    const onMouseUp = () => {
      isDown = false
    }

    const onMouseMove = (e) => {
      if (!isDown) return

      const dx = e.clientX - lastX
      const dy = e.clientY - lastY
      lastX = e.clientX
      lastY = e.clientY

      targetRotation.current.y = THREE.MathUtils.clamp(
        targetRotation.current.y - dx * MOUSE_SENSITIVITY,
        -MAX_YAW,
        MAX_YAW
      )

      targetRotation.current.x = THREE.MathUtils.clamp(
        targetRotation.current.x - dy * MOUSE_SENSITIVITY,
        -MAX_PITCH,
        MAX_PITCH
      )
    }

    let lastZoom = 0
    const onTouchStart = (e) => {
      lastZoom = e.touches[0].clientY
    }

    const onTouchMove = (e) => {
      const delta = lastZoom - e.touches[0].clientY
      lastZoom = e.touches[0].clientY
      targetProgress.current += delta * 0.001
      targetProgress.current = THREE.MathUtils.clamp(
        targetProgress.current,
        0,
        1
      )
    }

    window.addEventListener('wheel', onWheel, { passive: true })
    window.addEventListener("mousedown", onMouseDown)
    window.addEventListener("mouseup", onMouseUp)
    window.addEventListener("mousemove", onMouseMove)

    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: true })

    return () => {
      window.removeEventListener("mousedown", onMouseDown)
      window.removeEventListener("mouseup", onMouseUp)
      window.removeEventListener("mousemove", onMouseMove)

      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove', onTouchMove)
    }
  }, [])



  useFrame((_, delta) => {
    if (debug) return;

    progress.current = THREE.MathUtils.lerp(
      progress.current,
      targetProgress.current,
      0.08
    );
    rotation.current.x = THREE.MathUtils.lerp(
      rotation.current.x,
      targetRotation.current.x,
      0.08
    );
    rotation.current.y = THREE.MathUtils.lerp(
      rotation.current.y,
      targetRotation.current.y,
      0.08
    );

    const pos = curve.getPointAt(progress.current);
    const tangent = curve.getTangentAt(progress.current).normalize();
    const forward = tangent.clone().multiplyScalar(-1);

    const yawQuat = new THREE.Quaternion().setFromAxisAngle(
      new THREE.Vector3(0, 1, 0),
      rotation.current.y
    )

    const pitchQuat = new THREE.Quaternion().setFromAxisAngle(
      new THREE.Vector3(1, 0, 0),
      rotation.current.x
    )

    forward.applyQuaternion(yawQuat)
    forward.applyQuaternion(pitchQuat)

    camera.position.copy(pos)
    camera.up.set(0, 1, 0)
    camera.lookAt(
      pos.clone().add(forward)
    )
  })

  return <>
    {debug && debugElement}
    <perspectiveCamera />
  </>;
}

export default ControlledCamera;