import { useEffect, useMemo } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useControls } from "leva";
import { createWaxMaterial } from "../../three/materials/bottleMaterial";
import {
  COPPER_MATERIAL_CONFIG,
  DEFAULT_CAP_CONFIG,
} from "../../config/levaConfig";

export interface MeshComponentProps {
  meshes: THREE.Mesh[];
  innerTwoVariant?: "copper" | "wax" | "default";
}

export function InnerTwo({
  meshes,
  innerTwoVariant = "default",
}: MeshComponentProps) {
  const { gl } = useThree();
  const waxMaterial = useMemo(() => createWaxMaterial(), []);

  const waxConfig = useControls("Wax Cap Material", DEFAULT_CAP_CONFIG);
  const copperConfig = useControls(
    "Copper Cap Material",
    COPPER_MATERIAL_CONFIG,
  );

  useEffect(() => {
    meshes.forEach((mesh) => {
      if (!mesh.material) return;

      let targetMaterial = mesh.material as THREE.MeshStandardMaterial;

      // Fix anisotropy on diffuse map and normalMap for maximum sharpness
      if (targetMaterial.map) {
        targetMaterial.map.anisotropy = gl.capabilities.getMaxAnisotropy();
        targetMaterial.map.needsUpdate = true;
      }
      if (targetMaterial.normalMap) {
        targetMaterial.normalMap.anisotropy =
          gl.capabilities.getMaxAnisotropy();
        targetMaterial.normalScale.set(
          waxConfig.normalScale,
          waxConfig.normalScale,
        );
        targetMaterial.normalMap.needsUpdate = true;
      }

      if (innerTwoVariant === "default") {
        targetMaterial.roughness = 0.5;
        return;
      }

      if (innerTwoVariant === "wax") {
        waxMaterial.color.set(waxConfig.defaultColor);
        waxMaterial.metalness = 0;
        waxMaterial.roughness = 0.25;
        waxMaterial.thickness = 2;
        waxMaterial.needsUpdate = true;

        // Preserve base map (seal logo) if present so seal artwork remains crisp
        if (targetMaterial.map) {
          waxMaterial.map = targetMaterial.map;
          waxMaterial.map.anisotropy = gl.capabilities.getMaxAnisotropy();
        }

        // Apply normal map and bump depth
        if (targetMaterial.normalMap) {
          waxMaterial.normalMap = targetMaterial.normalMap;
          waxMaterial.normalMap.anisotropy = gl.capabilities.getMaxAnisotropy();
          waxMaterial.normalScale.set(
            waxConfig.normalScale,
            waxConfig.normalScale,
          );
        }

        mesh.material = waxMaterial;
        return;
      }

      // innerTwoVariant === "copper"
      if (!(targetMaterial as any).isCustomCopper) {
        targetMaterial = targetMaterial.clone();
        (targetMaterial as any).isCustomCopper = true;

        if (targetMaterial.normalMap) {
          targetMaterial.normalMap.anisotropy =
            gl.capabilities.getMaxAnisotropy();
          targetMaterial.normalScale.set(
            copperConfig.normalScale,
            copperConfig.normalScale,
          );
          targetMaterial.normalMap.needsUpdate = true;
        }
        mesh.material = targetMaterial;
      }

      // Apply vibrant copper properties dynamically from Leva
      targetMaterial.color.set(copperConfig.color);
      targetMaterial.metalness = copperConfig.metalness;
      targetMaterial.roughness = copperConfig.roughness;
      targetMaterial.envMapIntensity = copperConfig.envMapIntensity;
      if (targetMaterial.normalMap) {
        targetMaterial.normalScale.set(
          copperConfig.normalScale,
          copperConfig.normalScale,
        );
      }
      targetMaterial.needsUpdate = true;
    });
  }, [meshes, gl, innerTwoVariant, copperConfig, waxConfig, waxMaterial]);

  if (meshes.length === 0) return null;
  return (
    <>
      {meshes.map((mesh, index) => (
        <primitive key={`innerTwo-${index}`} object={mesh} />
      ))}
    </>
  );
}
