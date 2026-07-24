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

const isLiquidMesh = (mesh: THREE.Mesh): boolean => {
  const name = (mesh.name || "").toLowerCase();
  const parentName = (mesh.parent?.name || "").toLowerCase();
  const matName = Array.isArray(mesh.material)
    ? mesh.material.map((m) => m.name.toLowerCase()).join(" ")
    : (mesh.material?.name || "").toLowerCase();

  // Specifically target the Inner_02 wine liquid slab mesh
  return (
    name.includes("inner_02") ||
    parentName.includes("inner_02") ||
    matName.includes("wine")
  );
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
      if (isLiquidMesh(mesh)) {
        liquid.push(mesh);
      } else {
        glass.push(mesh);
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
        const isLiquid = isLiquidMesh(mesh);

        if (isLiquid) {
          // Liquid mesh (Inner_02): renderOrder = 1 (Renders BEFORE the glass container shell)
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
          physMat.clearcoat = 0.5;
          physMat.clearcoatRoughness = 0.02;
          physMat.envMapIntensity = liquidConfig.envMapIntensity;
          physMat.transparent = true;
          physMat.depthWrite = true;
          physMat.side = THREE.FrontSide;
          physMat.needsUpdate = true;
          console.log('hhh')
        } else {
          // Glass shell (Inner_01): renderOrder = 5 (Renders AFTER the inner liquid and cork)
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
