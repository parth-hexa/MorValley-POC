import { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { ContactShadows } from "@react-three/drei";
import { observer } from "mobx-react-lite";
import { useStores } from "../../hooks/useStores";
import { Lighting } from "./Lighting";
import { EnvironmentSetup } from "./EnvironmentSetup";
import { CameraControls } from "./CameraControls";
import { BottleModel } from "./BottleModel";
import { LogoBackDrop } from "./LogoBackDrop";
import "./Scene.css";

const DEFAULT_GRADIENT =
  "radial-gradient(74.98% 200.05% at 49.96% 55.42%, #153A28 0%, #215A3E 3.53%, #215A3E 35.8%, #153A28 84.05%)";

/**
 * The full-screen R3F canvas. Owns rendering only — model selection and
 * loading state live in MobX, this component just reflects it.
 */
export const Scene = observer(function Scene() {
  const { designManager, design3DManager } = useStores();
  const selectedBottle =
    designManager.productManager.bottle2DManager.getSelectedBottle();
  const targetGradient =
    selectedBottle?.backgroundGradient || DEFAULT_GRADIENT;

  const [bgLayers, setBgLayers] = useState({
    activeGradient: targetGradient,
    previousGradient: "",
    isFading: false,
  });

  useEffect(() => {
    setBgLayers((prev) => {
      if (prev.activeGradient === targetGradient && !prev.isFading) {
        return prev;
      }
      return {
        activeGradient: targetGradient,
        previousGradient:
          prev.activeGradient !== targetGradient
            ? prev.activeGradient
            : prev.previousGradient,
        isFading: true,
      };
    });

    const timer = setTimeout(() => {
      setBgLayers({
        activeGradient: targetGradient,
        previousGradient: "",
        isFading: false,
      });
    }, 800);

    return () => clearTimeout(timer);
  }, [selectedBottle?.id, targetGradient]);

  return (
    <div className="scene">
      {bgLayers.previousGradient && (
        <div
          className="scene-bg"
          style={{
            background: bgLayers.previousGradient,
            opacity: bgLayers.isFading ? 0 : 1,
          }}
        />
      )}
      <div
        className="scene-bg"
        style={{
          background: bgLayers.activeGradient,
          opacity: 1,
          animation: bgLayers.isFading ? "fadeInBg 0.8s ease-in-out" : "none",
        }}
      />
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
        <Suspense fallback={null}>
          <EnvironmentSetup />
          <Lighting />
          <BottleModel />
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
