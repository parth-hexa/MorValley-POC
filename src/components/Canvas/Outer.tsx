import * as THREE from "three";

export type { MeshComponentProps } from "./InnerOne";

export function Outer({ meshes }: { meshes: THREE.Mesh[] }) {
  if (meshes.length === 0) return null;
  return (
    <>
      {meshes.map((mesh, i) => (
        <primitive key={`outer-${i}`} object={mesh} />
      ))}
    </>
  );
}
