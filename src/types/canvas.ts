import * as THREE from "three";

export interface MeshComponentProps {
  meshes: THREE.Mesh[];
  innerOneVariant?: "black" | "transparent" | "default";
}

export interface InnerTwoMeshComponentProps {
  meshes: THREE.Mesh[];
  innerTwoVariant?: "copper" | "wax" | "default";
}
