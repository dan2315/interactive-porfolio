import { useHelper } from "@react-three/drei"
import * as THREE from "three"
import { useMemo, useRef } from "react"

function BezierHelper({ curve, debug }) {
  const lineRef = useRef()

  const geometry = useMemo(() => {
    const points = curve.getPoints(100)
    return new THREE.BufferGeometry().setFromPoints(points)
  }, [curve])

  useHelper(
    debug && lineRef,
    THREE.BoxHelper,
    "hotpink"
  )

  return (
    <line ref={lineRef} geometry={geometry}>
      <lineBasicMaterial color="hotpink" />
    </line>
  )
}

function ControlPointHelper({ position, end }) {
  const ref = useRef()
  return <>
      <mesh position={[position.x, position.y, position.z]}>
        <sphereGeometry args={[0.034]} />
        <meshBasicMaterial color={end ? "blue" : "red"} />
    </mesh>
    <object3D ref={ref} position={[position.x, position.y, position.z]} />
  </>
}


export {BezierHelper, ControlPointHelper};