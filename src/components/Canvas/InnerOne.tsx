import { useEffect, useMemo } from "react";
import * as THREE from "three";
import { useThree } from "@react-three/fiber";
import { MeshTransmissionMaterial } from "@react-three/drei";
import { createBottleMaterial } from "../../three/materials/bottleMaterial";
import { useControls } from "leva";
import { CLEAR_GLASS_CONFIG, LIQUID_MATERIAL_CONFIG } from "../../config/levaConfig";

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
  const liquidConfig = useControls("Liquid Material Config", LIQUID_MATERIAL_CONFIG);

  const { glassMeshes, liquidMeshes } = useMemo(() => {
    const glass: THREE.Mesh[] = [];
    const liquid: THREE.Mesh[] = [];

    meshes.forEach((mesh) => {
      if (isOuterGlassMesh(mesh)) {
        glass.push(mesh);
      } else {
        liquid.push(mesh);
      }
    });

    return { glassMeshes: glass, liquidMeshes: liquid };
  }, [meshes]);

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
        const isGlass = isOuterGlassMesh(mesh);

        if (!isGlass) {
          // Liquid mesh: renderOrder = 1 (Renders BEFORE the glass container shell)
          mesh.renderOrder = 1;
          mesh.scale.set(0.993, 0.995, 0.993);

          let physMat = mesh.material as THREE.MeshPhysicalMaterial;
          if (!physMat.isMeshPhysicalMaterial) {
            physMat = new THREE.MeshPhysicalMaterial();
            mesh.material = physMat;
          }

          physMat.color.set(liquidConfig.color);
          physMat.transmission = liquidConfig.transmission;
          physMat.thickness = liquidConfig.thickness;
          physMat.attenuationColor = new THREE.Color(liquidConfig.attenuationColor);
          physMat.attenuationDistance = liquidConfig.attenuationDistance;
          physMat.ior = liquidConfig.ior;
          physMat.roughness = liquidConfig.roughness;
          physMat.clearcoat = 0.8;
          physMat.clearcoatRoughness = 0.02;
          physMat.envMapIntensity = liquidConfig.envMapIntensity;
          physMat.transparent = true;
          physMat.depthWrite = true;
          physMat.side = THREE.FrontSide;
          physMat.needsUpdate = true;
        } else {
          // Glass shell: renderOrder = 5 (Renders AFTER the inner liquid and cork)
          mesh.renderOrder = 5;
          mesh.frustumCulled = false;
        }
        return; 
      }

      mesh.material = blackMaterial;
    });
  }, [meshes, innerOneVariant, blackMaterial, gl, liquidConfig]);

  if (meshes.length === 0) return null;
  return (
    <>
      {/* 1. Render Liquid Meshes FIRST at renderOrder = 1 */}
      {liquidMeshes.map((mesh, i) => (
        <primitive key={`liquid-${i}`} object={mesh} />
      ))}

      {/* 2. Render Glass Outer Shell SECOND at renderOrder = 5 */}
      {glassMeshes.map((mesh, i) => (
        <primitive key={`glass-${i}`} object={mesh}>
          {innerOneVariant === "transparent" && (
            <MeshTransmissionMaterial
              backside={glassConfig.backside}
              thickness={glassConfig.thickness}
              ior={glassConfig.ior}
              chromaticAberration={glassConfig.chromaticAberration}
              transmission={1}
              clearcoat={1}
              clearcoatRoughness={0}
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
