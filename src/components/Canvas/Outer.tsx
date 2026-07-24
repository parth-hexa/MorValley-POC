import { useEffect } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";

export type { MeshComponentProps } from "./InnerOne";

export function Outer({ meshes }: { meshes: THREE.Mesh[] }) {
  const { gl } = useThree();

  useEffect(() => {
    meshes.forEach((mesh) => {
      // Disable Frustum Culling so outer labels never disappear when rotating camera
      mesh.frustumCulled = false;
      mesh.renderOrder = 10; // High render order ensures labels render on top of transmissive glass

      if (mesh.geometry) {
        mesh.geometry.computeBoundingBox();
        mesh.geometry.computeBoundingSphere();
      }

      // Ensure anisotropy and double-sided rendering for labels
      if (mesh.material) {
        const mat = mesh.material as THREE.MeshStandardMaterial;
        if (mat.map) {
          mat.map.anisotropy = gl.capabilities.getMaxAnisotropy();
        }
        if (mat.normalMap) {
          mat.normalMap.anisotropy = gl.capabilities.getMaxAnisotropy();
        }
        mat.polygonOffset = true;
        mat.polygonOffsetFactor = -4;
        mat.polygonOffsetUnits = -4;
        mat.side = THREE.FrontSide;
        mat.needsUpdate = true;
      }
    });
  }, [meshes, gl]);

  if (meshes.length === 0) return null;

  return (
    <>
      {meshes.map((mesh, i) => (
        <primitive key={`outer-${i}`} object={mesh} />
      ))}
    </>
  );
}
