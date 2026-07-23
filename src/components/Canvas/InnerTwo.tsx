import { useEffect } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";

export interface MeshComponentProps {
  mesh: THREE.Mesh | null;
}

export function InnerTwo({ mesh }: MeshComponentProps) {
  const { gl } = useThree();

  useEffect(() => {
    if (mesh && mesh.material) {
      const clonedMaterial = (mesh.material as THREE.MeshStandardMaterial).clone();
      
      // Remove base map so it doesn't darken the custom color
      clonedMaterial.map = null; 
      
      // Apply vibrant copper properties
      clonedMaterial.color.set("#d94b0d");
      clonedMaterial.metalness = 0.85;
      clonedMaterial.roughness = 0.35;
      clonedMaterial.envMapIntensity = 2.0;
      
      // Fix texture blurring at glancing angles/distances using Anisotropic Filtering
      const maxAnisotropy = gl.capabilities.getMaxAnisotropy();
      if (clonedMaterial.normalMap) {
        clonedMaterial.normalMap.anisotropy = maxAnisotropy;
        clonedMaterial.normalMap.needsUpdate = true;
      }
      
      clonedMaterial.needsUpdate = true;
      mesh.material = clonedMaterial;
    }
  }, [mesh, gl]);

  if (!mesh) return null;
  return <primitive object={mesh} />;
}
