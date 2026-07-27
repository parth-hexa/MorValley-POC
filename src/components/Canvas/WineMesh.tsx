import { useEffect, useMemo } from "react";
import * as THREE from "three";
import { useControls } from "leva";
import { createWineMaterial } from "../../three/materials/bottleMaterial";
import { LIQUID_MATERIAL_CONFIG } from "../../config/levaConfig";
import type { MeshComponentProps } from "../../types/canvas";

export function WineMesh({ meshes, innerOneVariant = "black" }: MeshComponentProps) {
  const liquidConfig = useControls("Wine Material Config", LIQUID_MATERIAL_CONFIG);
  const wineMaterial = useMemo(() => createWineMaterial(), []);

  useEffect(() => {
    wineMaterial.color.set(liquidConfig.color);
    wineMaterial.attenuationColor.set(liquidConfig.attenuationColor);
    wineMaterial.attenuationDistance = liquidConfig.attenuationDistance;
    wineMaterial.transmission = liquidConfig.transmission;
    wineMaterial.thickness = liquidConfig.thickness;
    wineMaterial.ior = liquidConfig.ior;
    wineMaterial.roughness = liquidConfig.roughness;
    wineMaterial.reflectivity = liquidConfig.reflectivity;
    wineMaterial.envMapIntensity = liquidConfig.envMapIntensity;
    wineMaterial.needsUpdate = true;
  }, [liquidConfig, wineMaterial]);

  useEffect(() => {
    meshes.forEach((mesh) => {
      if (!mesh.material) return;

      if (innerOneVariant === "transparent") {
        // Liquid mesh (Inner_02): renderOrder = 1 (Renders BEFORE outer glass shell)
        mesh.renderOrder = 1;
        mesh.scale.set(0.993, 0.995, 0.993);
        mesh.material = wineMaterial;
      }
    });
  }, [meshes, innerOneVariant, wineMaterial]);

  if (meshes.length === 0) return null;

  return (
    <>
      {meshes.map((mesh, i) => (
        <primitive key={`wine-${i}`} object={mesh} />
      ))}
    </>
  );
}
