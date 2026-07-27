import { useMemo } from "react";
import * as THREE from "three";
import { InnerOne } from "./InnerOne";
import { WineMesh } from "./WineMesh";
import type { MeshComponentProps } from "../../types/canvas";

export type { MeshComponentProps };

export const isLiquidMesh = (mesh: THREE.Mesh): boolean => {
  if (mesh.userData.isLiquid !== undefined) {
    return mesh.userData.isLiquid;
  }

  const name = (mesh.name || "").toLowerCase();
  const parentName = (mesh.parent?.name || "").toLowerCase();
  let matName = "";
  if (mesh.material) {
    if (Array.isArray(mesh.material)) {
      matName = mesh.material.map((m) => (m.name || "").toLowerCase()).join(" ");
    } else {
      matName = (mesh.material.name || "").toLowerCase();
    }
  }

  const isLiquid =
    name.includes("inner_02") ||
    name.includes("wine") ||
    parentName.includes("inner_02") ||
    matName.includes("wine");

  mesh.userData.isLiquid = isLiquid;
  return isLiquid;
};

export function Inner({ meshes, innerOneVariant = "black" }: MeshComponentProps) {
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

  if (meshes.length === 0) return null;

  return (
    <>
      {/* 1. Render Liquid Meshes FIRST at renderOrder = 1 */}
      <WineMesh meshes={liquidMeshes} innerOneVariant={innerOneVariant} />

      {/* 2. Render Glass Outer Shell SECOND at renderOrder = 5 */}
      <InnerOne meshes={glassMeshes} innerOneVariant={innerOneVariant} />
    </>
  );
}
