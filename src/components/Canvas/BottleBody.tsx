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

  const { scaleX, scaleY, scaleZ } = useControls(
    "Glass Bottle Scale",
    {
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
        mesh.scale.set(scaleX, scaleY, scaleZ);
        return;
      }

      mesh.material = blackMaterial;
    });
  }, [meshes, innerOneVariant, blackMaterial, gl, scaleX, scaleY, scaleZ]);

  if (meshes.length === 0) return null;

  return (
    <>
      {meshes.map((mesh, i) => (
        <primitive key={`glass-${i}`} object={mesh}>
          {innerOneVariant === "transparent" && (
            <MeshTransmissionMaterial
              backside={MYO_GLASS.backside}
              samples={MYO_GLASS.samples}
              resolution={MYO_GLASS.resolution}
              thickness={MYO_GLASS.thickness}
              ior={MYO_GLASS.ior}
              chromaticAberration={MYO_GLASS.chromaticAberration}
              anisotropicBlur={MYO_GLASS.anisotropicBlur}
              transmission={1}
              clearcoat={1}
              clearcoatRoughness={0}
              color={MYO_GLASS.color}
              attenuationColor={MYO_GLASS.attenuationColor}
              attenuationDistance={MYO_GLASS.attenuationDistance}
              roughness={MYO_GLASS.roughness}
              metalness={MYO_GLASS.metalness}
            />
          )}
        </primitive>
      ))}
    </>
  );
}
