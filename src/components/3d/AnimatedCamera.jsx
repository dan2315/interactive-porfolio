import { OrbitControls } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from 'three'
import { BezierHelper, ControlPointHelper } from "../dev/3d/DebugHelpers";
import { useInputStore } from "../../stores/InputStores";
import { assistant } from "../../stores/AssistantStore";
import { scrollNearestAncestor } from "../../utils/customScroll";
import { useAppStore } from "../../stores/AppStore";

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

const MAX_LERP_ZOOM_DISTANCE = 0.2;

const MAX_YAW = THREE.MathUtils.degToRad(16);
const MAX_PITCH = THREE.MathUtils.degToRad(22);

const MOUSE_SENSITIVITY = 0.002;
const TOUCH_SENSITIVITY = 0.004;

function ControlledCamera({ view, debug }) {
  const { isFirstVisit } = useAppStore();
  const { camera } = useThree();
  const { getOwner: owner, claim, release } = useInputStore();

  const progress = useRef(0);
  const targetProgress = useRef(0);

  const rotation = useRef({ x: 0, y: 0 });
  const targetRotation = useRef({ x: 0, y: 0 });
  
  const hasReachedEnd = useRef(false);

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
    const handleOnWheel = (e) => {
      targetProgress.current += e.deltaY * 0.0005
      targetProgress.current = THREE.MathUtils.clamp(targetProgress.current, 0, 1)

      if (e.deltaY > 0 && targetProgress.current > 0.05) {
        targetProgress.current = 1;
        targetRotation.current = { x: 0, y: 0}
      } else if (e.deltaY < 0 && targetProgress.current < 0.95) {
        targetProgress.current = 0;
        targetRotation.current = { x: 0, y: 0}
      }
    }

    let lastX = 0
    let lastY = 0
    let isDown = false

    const onMouseDown = (e) => {
      if (!claim("camera")) return
      isDown = true
      lastX = e.clientX
      lastY = e.clientY
      e.stopPropagation();
    }

    const onMouseUp = () => {
      isDown = false
      if (targetProgress.current < 0.5) targetRotation.current = {x: 0, y: 0}
      release("camera")
    }

    const onMouseMove = (e) => {
      if (owner() !== "camera") return;
      if (targetProgress.current < 0.5 && !(e.buttons & 2)) return;
      if (!isDown) return
      const dx =  lastX - e.clientX
      const dy =  lastY - e.clientY
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

    const disableContextMenu = (e) => {
      e.preventDefault();
    };

    const onWheel = (e) => {
      if (!e.altKey) {
        handleOnWheel(e);
      } else {
        scrollNearestAncestor(e);
      }
      e.preventDefault();
    };
    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener("pointerdown", onMouseDown)
    window.addEventListener("pointerup", onMouseUp)
    window.addEventListener("pointermove", onMouseMove)

    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: true })

    window.addEventListener("contextmenu", disableContextMenu);

    return () => {
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener("pointerdown", onMouseDown)
      window.removeEventListener("pointerup", onMouseUp)
      window.removeEventListener("pointermove", onMouseMove)

      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove', onTouchMove)

      window.removeEventListener("contextmenu", disableContextMenu);
    }
  }, [])

  useFrame((_, delta) => {
    if (debug) return;

    let distance = targetProgress.current - progress.current;
    if (distance < 0) {
      distance = Math.max(distance, -MAX_LERP_ZOOM_DISTANCE)
    } else {
      distance = Math.min(distance, MAX_LERP_ZOOM_DISTANCE)
    }
    progress.current = THREE.MathUtils.lerp(
      progress.current,
      progress.current + distance,
      6 * delta
    );

    rotation.current.x = THREE.MathUtils.lerp(
      rotation.current.x,
      targetRotation.current.x,
      4 * delta
    );
    rotation.current.y = THREE.MathUtils.lerp(
      rotation.current.y,
      targetRotation.current.y,
      4 * delta
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

    if (!hasReachedEnd.current && 1 - progress.current < 0.01) {
      hasReachedEnd.current = true;
      if (isFirstVisit) {
        assistant.say({
          text: "Ohh... Looks like you tried to scroll the page. Use Alt + Wheel to scroll instead of zooming. Additionally you can press Shift to scroll faster.",
          timeToDisappear: 10000
        })
        assistant.say({
          text: "Did you know? You can swap the cartridge in the console to explore more content. Just drag a new one in!",
          timeToDisappear: 10000
        })
      }
    }
  })

  return <>
    {debug && debugElement}
    <perspectiveCamera />
  </>;
}

export default ControlledCamera;