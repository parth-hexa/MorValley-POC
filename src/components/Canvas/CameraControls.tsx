import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { observer } from "mobx-react-lite";
import { useControls } from "leva";
import { useStores } from "../../hooks/useStores";
import { useLeva } from "../../hooks/useLeva";

export const CameraControls = observer(function CameraControls() {
  const { design3DManager } = useStores();
  const { cameraState } = design3DManager;
  const isDebug = useLeva();

  const debugControls = useControls(
    "Camera Controls",
    {
      minDistance: { value: 0.1, min: 0.01, max: 10, step: 0.05, label: "Min Distance (Zoom In)" },
      maxDistance: { value: 50, min: 1, max: 200, step: 1, label: "Max Distance (Zoom Out)" },
      minPolarAngle: { value: 0, min: 0, max: Math.PI, step: 0.05, label: "Min Polar Angle" },
      maxPolarAngle: { value: Math.PI, min: 0, max: Math.PI, step: 0.05, label: "Max Polar Angle" },
      enablePan: { value: true, label: "Enable Pan" },
    }
  );

  const minDistance = isDebug ? debugControls.minDistance : cameraState.minDistance;
  const maxDistance = isDebug ? debugControls.maxDistance : cameraState.maxDistance;
  const minPolarAngle = isDebug ? debugControls.minPolarAngle : Math.PI / 3.5;
  const maxPolarAngle = isDebug ? debugControls.maxPolarAngle : Math.PI / 2;
  const enablePan = isDebug ? debugControls.enablePan : false;

  return (
    <>
      <PerspectiveCamera
        makeDefault
        position={cameraState.position}
        fov={cameraState.fov}
      />
      <OrbitControls
        target={cameraState.target}
        enablePan={enablePan}
        minDistance={minDistance}
        maxDistance={maxDistance}
        maxPolarAngle={maxPolarAngle}
        minPolarAngle={minPolarAngle}
        enableDamping={true}
        dampingFactor={0.035}
        rotateSpeed={0.4}
        zoomSpeed={0.3}
      />
    </>
  );
});


