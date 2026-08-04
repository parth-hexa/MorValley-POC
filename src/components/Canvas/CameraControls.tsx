import { useLayoutEffect, useRef } from "react";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { observer } from "mobx-react-lite";
import type { PerspectiveCamera as PerspectiveCameraImpl } from "three";
import { useStores } from "../../hooks/useStores";

/**
 * Camera + orbit. Position/fov are applied once from store so React re-renders
 * do not overwrite OrbitControls dolly/rotate (which made zoom feel broken).
 */
export const CameraControls = observer(function CameraControls() {
  const { design3DManager } = useStores();
  const { cameraState } = design3DManager;
  const cameraRef = useRef<PerspectiveCameraImpl>(null);
  const seededRef = useRef(false);

  useLayoutEffect(() => {
    const camera = cameraRef.current;
    if (!camera || seededRef.current) return;

    camera.position.set(...cameraState.position);
    camera.fov = cameraState.fov;
    camera.updateProjectionMatrix();
    seededRef.current = true;
  }, [cameraState.position, cameraState.fov]);

  return (
    <>
      <PerspectiveCamera makeDefault ref={cameraRef} />
      <OrbitControls
        makeDefault
        target={cameraState.target}
        enablePan={false}
        minDistance={cameraState.minDistance}
        maxDistance={cameraState.maxDistance}
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={Math.PI / 3.5}
        enableDamping
        dampingFactor={0.08}
        rotateSpeed={0.55}
        zoomSpeed={0.85}
      />
    </>
  );
});
