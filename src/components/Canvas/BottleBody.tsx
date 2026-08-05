import { useEffect, useMemo } from "react";
import * as THREE from "three";
import { useThree } from "@react-three/fiber";
import { MeshTransmissionMaterial } from "@react-three/drei";
import { useControls } from "leva";
import { createBottleMaterial } from "../../three/materials/bottleMaterial";
import { MYO_GLASS } from "../../config/myoRenderConfig";
import type { MeshComponentProps } from "../../types/canvas";

/**
 * Bottle body: black glass for Rogador/Magnum, clear transmission for Myo.
 * Myo glass props are baked for transparent bottles only.
 */
export function BottleBody({ meshes, innerOneVariant = "black" }: MeshComponentProps) {
  const { gl } = useThree();
  const blackMaterial = useMemo(() => createBottleMaterial(), []);

  const isMyo = innerOneVariant === "transparent";
  // Slightly shrink Myo glass so coplanar labels sit outside the transmission surface.
  const glassXZ = isMyo ? 0.985 : 1;

  const glassProps = useControls(
    "MYO Glass Transmission",
    {
      backside: { value: MYO_GLASS.backside, label: "Backside" },
      samples: { value: MYO_GLASS.samples, min: 1, max: 32, step: 1, label: "Samples" },
      resolution: { value: MYO_GLASS.resolution, min: 256, max: 2048, step: 256, label: "Resolution" },
      thickness: { value: MYO_GLASS.thickness, min: 0, max: 10, step: 0.05, label: "Thickness" },
      ior: { value: MYO_GLASS.ior, min: 1, max: 2.5, step: 0.01, label: "IOR" },
      reflectivity: { value: MYO_GLASS.reflectivity, min: 0, max: 1, step: 0.01, label: "Reflectivity" },
      chromaticAberration: { value: MYO_GLASS.chromaticAberration, min: 0, max: 1, step: 0.01, label: "Chromatic Aberration" },
      anisotropicBlur: { value: MYO_GLASS.anisotropicBlur, min: 0, max: 1, step: 0.01, label: "Anisotropic Blur" },
      transmission: { value: 1, min: 0, max: 1, step: 0.01, label: "Transmission" },
      clearcoat: { value: 1.0, min: 0, max: 1, step: 0.01, label: "Clearcoat" },
      clearcoatRoughness: { value: 0.02, min: 0, max: 1, step: 0.01, label: "Clearcoat Roughness" },
      envMapIntensity: { value: 1, min: 0, max: 5, step: 0.05, label: "EnvMap Intensity" },
      color: { value: MYO_GLASS.color, label: "Color" },
      attenuationColor: { value: MYO_GLASS.attenuationColor, label: "Attenuation Color" },
      attenuationDistance: { value: MYO_GLASS.attenuationDistance, min: 0.01, max: 20, step: 0.05, label: "Attenuation Distance" },
      roughness: { value: MYO_GLASS.roughness, min: 0, max: 1, step: 0.01, label: "Roughness" },
      metalness: { value: MYO_GLASS.metalness, min: 0, max: 1, step: 0.01, label: "Metalness" },
      scaleX: {
        value: glassXZ,
        min: 0.5,
        max: 1.5,
        step: 0.001,
        label: "Scale X",
      },
      scaleY: {
        value: 1,
        min: 0.5,
        max: 1.5,
        step: 0.001,
        label: "Scale Y",
      },
      scaleZ: {
        value: glassXZ,
        min: 0.5,
        max: 1.5,
        step: 0.001,
        label: "Scale Z",
      },
    },
    { collapsed: false },
    [glassXZ]
  );

  useEffect(() => {
    meshes.forEach((mesh) => {
      if (!mesh.material) return;

      if (innerOneVariant === "default") {
        const mat = mesh.material as THREE.MeshStandardMaterial;
        if (mat.normalMap) {
          mat.normalMap.anisotropy = gl.capabilities.getMaxAnisotropy();
          mat.normalMap.needsUpdate = true;
        }
        return;
      }

      if (innerOneVariant === "transparent") {
        mesh.renderOrder = 5;
        mesh.frustumCulled = false;
        mesh.scale.set(glassProps.scaleX, glassProps.scaleY, glassProps.scaleZ);
        return;
      }

      mesh.material = blackMaterial;
    });
  }, [meshes, innerOneVariant, blackMaterial, gl, glassProps]);

  if (meshes.length === 0) return null;

  return (
    <>
      {meshes.map((mesh, i) => (
        <primitive key={`glass-${i}`} object={mesh}>
          {innerOneVariant === "transparent" && (
            <MeshTransmissionMaterial
              backside={glassProps.backside}
              samples={glassProps.samples}
              resolution={glassProps.resolution}
              thickness={glassProps.thickness}
              ior={glassProps.ior}
              reflectivity={glassProps.reflectivity}
              chromaticAberration={glassProps.chromaticAberration}
              anisotropicBlur={glassProps.anisotropicBlur}
              transmission={glassProps.transmission}
              clearcoat={glassProps.clearcoat}
              clearcoatRoughness={glassProps.clearcoatRoughness}
              envMapIntensity={glassProps.envMapIntensity}
              color={glassProps.color}
              attenuationColor={glassProps.attenuationColor}
              attenuationDistance={glassProps.attenuationDistance}
              roughness={glassProps.roughness}
              metalness={glassProps.metalness}
            />
          )}
        </primitive>
      ))}
    </>
  );
}
