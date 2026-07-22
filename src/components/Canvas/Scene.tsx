import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { ContactShadows } from "@react-three/drei";
import { observer } from "mobx-react-lite";
import { useStores } from "../../hooks/useStores";
import { Lighting } from "./Lighting";
import { EnvironmentSetup } from "./EnvironmentSetup";
import { CameraControls } from "./CameraControls";
import { GlassModel } from "./GlassModel";
import { LogoBackDrop } from "./LogoBackDrop";
import "./Scene.css";

/**
 * The full-screen R3F canvas. Owns rendering only — model selection and
 * loading state live in MobX, this component just reflects it.
 */
export const Scene = observer(function Scene() {
  const { design3DManager } = useStores();

  return (
    <div className="scene">
      <LogoBackDrop />
      <div className="scene-frame">
        <div className="corner top-left"></div>
        <div className="corner top-right"></div>
        <div className="corner bottom-left"></div>
        <div className="corner bottom-right"></div>
      </div>
      <Canvas
        shadows
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        onCreated={() => design3DManager.setSceneInitialized(true)}
      >
        {/* <color attach="background" args={["#7D9165"]} /> */}
        {/* <fog attach="fog" args={["#7D9165", 6, 14]} /> */}
        <Suspense fallback={null}>
          <EnvironmentSetup />
          <Lighting />
          <GlassModel />
          <ContactShadows
            position={[0, -1.0, 0]}
            opacity={0.35}
            scale={6}
            blur={1.8}
            far={2}
            color="#3a472d"
          />
        </Suspense>
        <CameraControls />
      </Canvas>
    </div>
  );
});
