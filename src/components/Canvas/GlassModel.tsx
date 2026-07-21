import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { observer } from "mobx-react-lite";
import * as THREE from "three";
import { useStores } from "../../hooks/useStores";

/**
 * Renders whatever Design3DManager currently has loaded. Scale-based grow-in
 * doubles as the "new model fades in" requirement from the PRD — a true
 * opacity fade reads poorly on transmissive glass materials, so we animate
 * scale with an ease-out curve instead, plus a slow idle rotation so the
 * glass reads as three-dimensional even before the user touches the camera.
 */
export const GlassModel = observer(function GlassModel() {
  const { design3DManager } = useStores();
  const groupRef = useRef<THREE.Group>(null);
  const progressRef = useRef(0);

  useEffect(() => {
    progressRef.current = 0;
  }, [design3DManager.loadedObject]);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    progressRef.current = Math.min(1, progressRef.current + delta * 1.6);
    const eased = 1 - Math.pow(1 - progressRef.current, 3);
    groupRef.current.scale.setScalar(eased);
    groupRef.current.rotation.y += delta * 0.12;
  });

  if (!design3DManager.loadedObject) return null;

  return (
    <group ref={groupRef} scale={0}>
      <primitive object={design3DManager.loadedObject} />
    </group>
  );
});
