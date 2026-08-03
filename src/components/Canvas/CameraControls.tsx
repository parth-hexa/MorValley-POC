import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { observer } from "mobx-react-lite";
import { useStores } from "../../hooks/useStores";

export const CameraControls = observer(function CameraControls() {
  const { design3DManager } = useStores();
  const { cameraState } = design3DManager;

  return (
    <>
      <PerspectiveCamera
        makeDefault
        position={cameraState.position}
        fov={cameraState.fov}
      />
      <OrbitControls
        target={cameraState.target}
        enablePan={false}
        minDistance={cameraState.minDistance}
        maxDistance={cameraState.maxDistance}
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={Math.PI / 3.5}
        enableDamping={true}
        dampingFactor={0.035}
        rotateSpeed={0.4}
        zoomSpeed={0.3}
      />
    </>
  );
});
