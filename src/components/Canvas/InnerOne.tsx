import { useEffect, useMemo } from "react";
import * as THREE from "three";
import { useThree } from "@react-three/fiber";
import { MeshTransmissionMaterial } from "@react-three/drei";
import { createBottleMaterial } from "../../three/materials/bottleMaterial";
import { useControls } from "leva";
import { CLEAR_GLASS_CONFIG } from "../../config/levaConfig";

export interface MeshComponentProps {
  meshes: THREE.Mesh[];
  innerOneVariant?: "black" | "transparent" | "default";
}

export function InnerOne({ meshes, innerOneVariant = "black" }: MeshComponentProps) {
  const { gl } = useThree();
  const blackMaterial = useMemo(() => createBottleMaterial(), []);

  const glassConfig = useControls("Clear Glass Config", CLEAR_GLASS_CONFIG);

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
        return; 
      }

      mesh.material = blackMaterial;
    });
  }, [meshes, innerOneVariant, blackMaterial, gl]);

  if (meshes.length === 0) return null;
  return (
    <>
      {meshes.map((mesh, i) => (
        <primitive key={`innerOne-${i}`} object={mesh}>
          {innerOneVariant === "transparent" && (
            <MeshTransmissionMaterial
              backside={glassConfig.backside}
              thickness={glassConfig.thickness}
              ior={glassConfig.ior}
              chromaticAberration={glassConfig.chromaticAberration}
              transmission={1}
              clearcoat={1}
              color={glassConfig.color}
              attenuationColor={glassConfig.attenuationColor}
              attenuationDistance={glassConfig.attenuationDistance}
              roughness={glassConfig.roughness}
            />
          )}
        </primitive>
      ))}
    </>
  );
}
