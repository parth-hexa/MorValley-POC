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

const isOuterGlassMesh = (mesh: THREE.Mesh): boolean => {
  const name = (mesh.name || "").toLowerCase();
  const matName = Array.isArray(mesh.material)
    ? mesh.material.map((m) => m.name.toLowerCase()).join(" ")
    : (mesh.material?.name || "").toLowerCase();

  // If mesh is specifically the wine liquid, do not treat as glass outer shell
  if (name.includes("inner_02") || matName.includes("wine")) {
    return false;
  }
  return true;
};

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
        const mat = mesh.material as THREE.MeshStandardMaterial;
        if (mat) {
          if (mat.map) {
            mat.map.anisotropy = gl.capabilities.getMaxAnisotropy();
          }
          if (mat.normalMap) {
            mat.normalMap.anisotropy = gl.capabilities.getMaxAnisotropy();
          }
          // Enable transparency and depth handling on liquid material
          if (!isOuterGlassMesh(mesh)) {
            mat.transparent = true;
            mat.depthWrite = true;
            mat.needsUpdate = true;
          }
        }
        return; 
      }

      mesh.material = blackMaterial;
    });
  }, [meshes, innerOneVariant, blackMaterial, gl]);

  if (meshes.length === 0) return null;
  return (
    <>
      {meshes.map((mesh, i) => {
        const isGlass = isOuterGlassMesh(mesh);
        return (
          <primitive key={`innerOne-${i}`} object={mesh}>
            {innerOneVariant === "transparent" && isGlass && (
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
        );
      })}
    </>
  );
}
