import { useEffect, useMemo } from "react";
import * as THREE from "three";
import { createBottleMaterial } from "../../three/materials/bottleMaterial";

export interface MeshComponentProps {
  mesh: THREE.Mesh | null;
}

export function InnerOne({ mesh }: MeshComponentProps) {
  const bottleMaterial = useMemo(() => createBottleMaterial(), []);

  useEffect(() => {
    if (mesh) {
      mesh.material = bottleMaterial;
    }
  }, [mesh, bottleMaterial]);

  if (!mesh) return null;
  return <primitive object={mesh} />;
}
