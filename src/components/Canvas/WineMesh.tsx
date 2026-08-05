import { useEffect, useMemo } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { useControls } from "leva";
import { MYO_LIQUID } from "../../config/myoRenderConfig";
import { useDebugMode } from "../../hooks/useDebugMode";
import { useRefractionEnvMap } from "../../hooks/useRefractionEnvMap";
import {
  WineRefractionMaterialImpl,
  buildWineRefractionGeometryData,
} from "../../three/materials/wineRefractionMaterial";
import type { MeshComponentProps } from "../../types/canvas";

export interface MyoLiquidSettings {
  bounces: number;
  ior: number;
  fresnel: number;
  color: string;
  attenuationColor: string;
  attenuationDistance: number;
  envIntensity: number;
  normalSmoothing: number;
  blurScale: number;
  correctMips: boolean;
  aberrationStrength: number;
  fastChroma: boolean;
  weldNormals: boolean;
  envCubeSize: number;
  scaleX: number;
  scaleY: number;
  scaleZ: number;
}

const BAKED_LIQUID_SETTINGS: MyoLiquidSettings = {
  bounces: MYO_LIQUID.bounces,
  ior: MYO_LIQUID.ior,
  fresnel: MYO_LIQUID.fresnel,
  color: MYO_LIQUID.color,
  attenuationColor: MYO_LIQUID.attenuationColor,
  attenuationDistance: MYO_LIQUID.attenuationDistance,
  envIntensity: MYO_LIQUID.envIntensity,
  normalSmoothing: MYO_LIQUID.normalSmoothing,
  blurScale: MYO_LIQUID.blurScale,
  correctMips: MYO_LIQUID.correctMips,
  aberrationStrength: MYO_LIQUID.aberrationStrength,
  fastChroma: MYO_LIQUID.fastChroma,
  weldNormals: MYO_LIQUID.weldNormals,
  envCubeSize: MYO_LIQUID.envCubeSize,
  scaleX: MYO_LIQUID.scale.x,
  scaleY: MYO_LIQUID.scale.y,
  scaleZ: MYO_LIQUID.scale.z,
};

const LIQUID_CONTROLS = {
  bounces: { value: MYO_LIQUID.bounces, min: 1, max: 8, step: 1, label: "Bounces" },
  ior: { value: MYO_LIQUID.ior, min: 1, max: 3, step: 0.01, label: "IOR" },
  fresnel: { value: MYO_LIQUID.fresnel, min: 0, max: 1, step: 0.01, label: "Fresnel" },
  color: { value: MYO_LIQUID.color, label: "Thin Colour" },
  attenuationColor: { value: MYO_LIQUID.attenuationColor, label: "Deep Colour" },
  attenuationDistance: {
    value: MYO_LIQUID.attenuationDistance,
    min: 0.05,
    max: 3,
    step: 0.01,
    label: "Absorption Dist",
  },
  envIntensity: {
    value: MYO_LIQUID.envIntensity,
    min: 0,
    max: 3,
    step: 0.05,
    label: "EnvMap Intensity",
  },
  normalSmoothing: {
    value: MYO_LIQUID.normalSmoothing,
    min: 0,
    max: 1,
    step: 0.01,
    label: "Normal Smoothing",
  },
  blurScale: {
    value: MYO_LIQUID.blurScale,
    min: 0.25,
    max: 8,
    step: 0.05,
    label: "Env Blur Scale",
  },
  correctMips: { value: MYO_LIQUID.correctMips, label: "Correct Mips" },
  aberrationStrength: {
    value: MYO_LIQUID.aberrationStrength,
    min: 0,
    max: 0.1,
    step: 0.005,
    label: "Aberration",
  },
  fastChroma: { value: MYO_LIQUID.fastChroma, label: "Fast Chroma" },
  weldNormals: { value: MYO_LIQUID.weldNormals, label: "Weld Normals" },
  envCubeSize: {
    value: MYO_LIQUID.envCubeSize,
    options: [512, 1024, 2048],
    label: "Env Cube Size",
  },
  scaleX: { value: MYO_LIQUID.scale.x, min: 0.5, max: 1.5, step: 0.001, label: "Scale X" },
  scaleY: { value: MYO_LIQUID.scale.y, min: 0.5, max: 1.5, step: 0.001, label: "Scale Y" },
  scaleZ: { value: MYO_LIQUID.scale.z, min: 0.5, max: 1.5, step: 0.001, label: "Scale Z" },
} as const;

/**
 * Liquid mesh for Myo clear-glass bottles, ray-traced against its own geometry.
 */
export function WineMesh({ meshes, innerOneVariant = "black" }: MeshComponentProps) {
  const isDebug = useDebugMode();

  if (meshes.length === 0) return null;

  if (innerOneVariant !== "transparent") {
    return (
      <>
        {meshes.map((mesh, i) => (
          <primitive key={`wine-${i}`} object={mesh} />
        ))}
      </>
    );
  }

  if (isDebug) {
    return <DebugMyoLiquid meshes={meshes} />;
  }

  return <MyoLiquid meshes={meshes} settings={BAKED_LIQUID_SETTINGS} />;
}

/** Leva tuning — only mounted in ?debug mode so localStorage cannot override baked config. */
function DebugMyoLiquid({ meshes }: { meshes: THREE.Mesh[] }) {
  const settings = useControls("MYO Liquid Refraction Material", LIQUID_CONTROLS, {
    collapsed: false,
  });
  return <MyoLiquid meshes={meshes} settings={settings} />;
}

function MyoLiquid({ meshes, settings }: { meshes: THREE.Mesh[]; settings: MyoLiquidSettings }) {
  const cubeEnvMap = useRefractionEnvMap(settings.envCubeSize);
  const sceneEnv = useThree((state) => state.scene.environment);
  const envMap = cubeEnvMap ?? sceneEnv;

  return (
    <>
      {meshes.map((mesh, i) => (
        <LiquidSurface
          key={`wine-${i}`}
          mesh={mesh}
          envMap={envMap}
          settings={settings}
        />
      ))}
    </>
  );
}

function LiquidSurface({
  mesh,
  envMap,
  settings,
}: {
  mesh: THREE.Mesh;
  envMap: THREE.Texture | null;
  settings: MyoLiquidSettings;
}) {
  const size = useThree((state) => state.size);
  const dpr = useThree((state) => state.viewport.dpr);

  const material = useMemo(() => new WineRefractionMaterialImpl(), []);

  const geometryData = useMemo(
    () => buildWineRefractionGeometryData(mesh.geometry, { weldNormals: settings.weldNormals }),
    [mesh.geometry, settings.weldNormals]
  );

  useEffect(() => () => geometryData.dispose(), [geometryData]);
  useEffect(() => () => material.dispose(), [material]);

  useEffect(() => {
    mesh.renderOrder = 2;
    mesh.visible = true;
    mesh.scale.set(settings.scaleX, settings.scaleY, settings.scaleZ);
  }, [mesh, settings.scaleX, settings.scaleY, settings.scaleZ]);

  useEffect(() => {
    material.bvh = geometryData.bvh;
    material.normalAttribute = geometryData.normalAttribute;
    material.pathNormalization = geometryData.pathNormalization;
  }, [material, geometryData]);

  useEffect(() => {
    if (!envMap) return;

    material.envMap = envMap;
    material.bounces = settings.bounces;
    material.ior = settings.ior;
    material.fresnel = settings.fresnel;
    material.envIntensity = settings.envIntensity;
    material.normalSmoothing = settings.normalSmoothing;
    material.blurScale = settings.blurScale;
    material.correctMips = settings.correctMips;
    material.aberrationStrength = settings.aberrationStrength;
    material.attenuationDistance = settings.attenuationDistance;
    material.opacity = MYO_LIQUID.opacity;
    material.color.set(settings.color);
    material.attenuationColor.set(settings.attenuationColor);

    const defines: Record<string, string> = {};
    if (envMap.mapping === THREE.CubeReflectionMapping) defines.ENVMAP_TYPE_CUBEM = "";
    if (settings.aberrationStrength > 0) defines.CHROMATIC_ABERRATIONS = "";
    if (settings.fastChroma) defines.FAST_CHROMA = "";

    if (JSON.stringify(material.defines) !== JSON.stringify(defines)) {
      material.defines = defines;
      material.needsUpdate = true;
    }
  }, [material, envMap, settings]);

  useEffect(() => {
    material.resolution.set(size.width * dpr, size.height * dpr);
  }, [material, size, dpr]);

  useFrame(({ camera }) => {
    material.viewMatrixInverse = camera.matrixWorld;
    material.projectionMatrixInverse = camera.projectionMatrixInverse;
  });

  if (!envMap) return null;

  return <primitive object={mesh} material={material} />;
}
