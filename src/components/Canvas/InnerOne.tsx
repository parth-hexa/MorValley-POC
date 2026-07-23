import { useEffect, useMemo } from "react";
import * as THREE from "three";
import { createBottleMaterial } from "../../three/materials/bottleMaterial";

export interface MeshComponentProps {
  meshes: THREE.Mesh[];
}

export function InnerOne({ meshes }: MeshComponentProps) {
  const bottleMaterial = useMemo(() => createBottleMaterial(), []);

  useEffect(() => {
    meshes.forEach(mesh => {
      mesh.material = bottleMaterial;
    });
  }, [meshes, bottleMaterial]);

  if (meshes.length === 0) return null;
  return (
    <>
      {meshes.map((mesh, i) => (
        <primitive key={`innerOne-${i}`} object={mesh} />
      ))}
    </>
  );
}
