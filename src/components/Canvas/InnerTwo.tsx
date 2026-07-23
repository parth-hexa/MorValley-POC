import { useEffect, useMemo } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useControls } from "leva";
import { createWaxMaterial } from "../../three/materials/bottleMaterial";
import { COPPER_MATERIAL_CONFIG, DEFAULT_CAP_CONFIG } from "../../config/levaConfig";

export interface MeshComponentProps {
  meshes: THREE.Mesh[];
  innerTwoVariant?: "copper" | "wax" | "default";
}

export function InnerTwo({ meshes, innerTwoVariant = "default" }: MeshComponentProps) {
  const { gl } = useThree();
  const waxMaterial = useMemo(() => createWaxMaterial(), []);

  const { defaultColor: waxColor } = useControls("Wax Cap Material", DEFAULT_CAP_CONFIG);
  const copperConfig = useControls("Copper Cap Material", COPPER_MATERIAL_CONFIG);

  useEffect(() => {
    meshes.forEach((mesh) => {
      if (!mesh.material) return;
      
      let targetMaterial = mesh.material as THREE.MeshStandardMaterial;

      if (innerTwoVariant === "default") {
        // Just leave the original GLTF material, only apply anisotropy
        if (targetMaterial.normalMap) {
          targetMaterial.normalMap.anisotropy = gl.capabilities.getMaxAnisotropy();
          targetMaterial.normalMap.needsUpdate = true;
        }
        return;
      }
      
      if (innerTwoVariant === "wax") {
        waxMaterial.color.set(waxColor);
        waxMaterial.needsUpdate = true;
        
        // If the mesh has a normal map from the GLTF, apply it to our wax material and fix anisotropy
        if (targetMaterial.normalMap && waxMaterial.normalMap !== targetMaterial.normalMap) {
          waxMaterial.normalMap = targetMaterial.normalMap;
          waxMaterial.normalMap.anisotropy = gl.capabilities.getMaxAnisotropy();
        }
        
        mesh.material = waxMaterial;
        return;
      }
      
      // innerTwoVariant === "copper"
      if (!(targetMaterial as any).isCustomCopper) {
        targetMaterial = targetMaterial.clone();
        (targetMaterial as any).isCustomCopper = true;
        targetMaterial.map = null; // Remove base map so it doesn't darken the custom color
        
        if (targetMaterial.normalMap) {
          targetMaterial.normalMap.anisotropy = gl.capabilities.getMaxAnisotropy();
          targetMaterial.normalMap.needsUpdate = true;
        }
        mesh.material = targetMaterial;
      }
      
      // Apply vibrant copper properties dynamically from Leva
      targetMaterial.color.set(copperConfig.color);
      targetMaterial.metalness = copperConfig.metalness;
      targetMaterial.roughness = copperConfig.roughness;
      targetMaterial.envMapIntensity = copperConfig.envMapIntensity;
      targetMaterial.needsUpdate = true;
    });
  }, [meshes, gl, innerTwoVariant, copperConfig, waxColor, waxMaterial]);

  if (meshes.length === 0) return null;
  return (
    <>
      {meshes.map((mesh, index) => (
        <primitive key={`innerTwo-${index}`} object={mesh} />
      ))}
    </>
  );
}
