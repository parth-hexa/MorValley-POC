import * as THREE from "three";

export interface MeshComponentProps {
  mesh: THREE.Mesh | null;
}

export function Outer({ mesh }: MeshComponentProps) {
  if (!mesh) return null;
  return <primitive object={mesh} />;
}
