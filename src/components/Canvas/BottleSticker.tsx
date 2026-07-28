import { useEffect } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";

export type { MeshComponentProps } from "../../types/canvas";

export function BottleSticker({ meshes }: { meshes: THREE.Mesh[] }) {
  const { gl } = useThree();

  useEffect(() => {
    meshes.forEach((mesh) => {
      mesh.frustumCulled = false;

      // Determine if this mesh is on the front or back of the bottle
      let isFront = true;
      if (mesh.geometry) {
        mesh.geometry.computeBoundingBox();
        mesh.geometry.computeBoundingSphere();
        
        const center = new THREE.Vector3();
        mesh.geometry.boundingBox.getCenter(center);
        
        // Sum the local geometry center and the mesh position to get the relative Z offset
        const zPos = center.z + mesh.position.z;
        if (zPos < -0.05) {
          isFront = false;
        }
      }

      // Assign renderOrder based on front/back position
      if (isFront) {
        // Front labels draw ON TOP of the glass (no refraction distortion)
        mesh.renderOrder = 6;
      } else {
        // Back labels draw BEHIND the wine and glass (so they are refracted)
        mesh.renderOrder = 1;
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
        mat.polygonOffsetFactor = 4;
        mat.polygonOffsetUnits = 4;
        mat.transparent = true;
        mat.depthTest = true;
        mat.depthWrite = true;
        mat.side = THREE.DoubleSide;
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
