import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { ContactShadows } from "@react-three/drei";
import { observer } from "mobx-react-lite";
import { useStores } from "../../hooks/useStores";
import { Lighting } from "./Lighting";
import { EnvironmentSetup } from "./EnvironmentSetup";
import { CameraControls } from "./CameraControls";
import { GlassModel } from "./GlassModel";
import "./Scene.css";

/**
 * The full-screen R3F canvas. Owns rendering only — model selection and
 * loading state live in MobX, this component just reflects it.
 */
export const Scene = observer(function Scene() {
  const { design3DManager } = useStores();

  return (
    <div className="scene">
      <Canvas
        shadows
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        onCreated={() => design3DManager.setSceneInitialized(true)}
      >
        <color attach="background" args={["#150a0d"]} />
        <fog attach="fog" args={["#150a0d", 6, 12]} />
        <Suspense fallback={null}>
          <EnvironmentSetup />
          <Lighting />
          <GlassModel />
          <ContactShadows
            position={[0, -1.05, 0]}
            opacity={0.45}
            scale={6}
            blur={2.4}
            far={2}
            color="#0a0304"
          />
        </Suspense>
        <CameraControls />
      </Canvas>
    </div>
  );
});
