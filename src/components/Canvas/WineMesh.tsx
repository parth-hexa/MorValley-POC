import { useEffect } from "react";
import * as THREE from "three";
import { useThree } from "@react-three/fiber";
import { MeshRefractionMaterial } from "@react-three/drei";
import { useControls } from "leva";
import { MYO_LIQUID } from "../../config/myoRenderConfig";
import type { MeshComponentProps } from "../../types/canvas";

/**
 * Liquid mesh for Myo clear-glass bottles using MeshRefractionMaterial for ray-traced liquid refraction.
 */
export function WineMesh({ meshes, innerOneVariant = "black" }: MeshComponentProps) {
  const { scene } = useThree();

  const liquidProps = useControls(
    "MYO Liquid Refraction Material",
    {
      bounces: { value: 3, min: 1, max: 8, step: 1, label: "Bounces" },
      ior: { value: MYO_LIQUID.ior, min: 1, max: 3, step: 0.01, label: "IOR" },
      fresnel: { value: 0.5, min: 0, max: 1, step: 0.01, label: "Fresnel" },
      aberrationStrength: { value: 0.03, min: 0, max: 0.1, step: 0.005, label: "Aberration" },
      color: { value: MYO_LIQUID.color, label: "Color" },
      fastChroma: { value: true, label: "Fast Chroma" },
      scaleX: {
        value: MYO_LIQUID.scale.x,
        min: 0.5,
        max: 1.5,
        step: 0.001,
        label: "Scale X",
      },
      scaleY: {
        value: MYO_LIQUID.scale.y,
        min: 0.5,
        max: 1.5,
        step: 0.001,
        label: "Scale Y",
      },
      scaleZ: {
        value: MYO_LIQUID.scale.z,
        min: 0.5,
        max: 1.5,
        step: 0.001,
        label: "Scale Z",
      },
    },
    { collapsed: false }
  );

  useEffect(() => {
    meshes.forEach((mesh) => {
      if (!mesh) return;

      if (innerOneVariant === "transparent") {
        mesh.renderOrder = 2;
        mesh.scale.set(liquidProps.scaleX, liquidProps.scaleY, liquidProps.scaleZ);
        mesh.visible = true;
      }
    });
  }, [meshes, innerOneVariant, liquidProps]);

  if (meshes.length === 0) return null;

  const activeEnvMap = scene.environment || null;

  return (
    <>
      {meshes.map((mesh, i) => (
        <primitive key={`wine-${i}`} object={mesh}>
          {innerOneVariant === "transparent" && (
            <MeshRefractionMaterial
              envMap={activeEnvMap as THREE.CubeTexture}
              bounces={liquidProps.bounces}
              ior={liquidProps.ior}
              fresnel={liquidProps.fresnel}
              aberrationStrength={liquidProps.aberrationStrength}
              color={liquidProps.color}
              fastChroma={liquidProps.fastChroma}
            />
          )}
        </primitive>
      ))}
    </>
  );
}
