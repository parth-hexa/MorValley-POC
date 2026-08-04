import { useEffect } from "react";
import { useThree } from "@react-three/fiber";
import { useControls } from "leva";
import * as THREE from "three";

export type { MeshComponentProps } from "../../types/canvas";

type BottleStickerProps = {
  meshes: THREE.Mesh[];
  polygonOffsetFactor: number;
  innerOneVariant?: string;
};

/**
 * Label / sticker meshes. Myo clear glass (MeshTransmissionMaterial) still
 * Z-fights coplanar labels — front labels skip depth testing so they composite
 * cleanly on top of the glass pass.
 */
export function BottleSticker({
  meshes,
  polygonOffsetFactor,
  innerOneVariant = "black",
}: BottleStickerProps) {
  const { gl } = useThree();
  const isMyo = innerOneVariant === "transparent";

  const { offsetFactor, offsetUnits, inflate } = useControls(
    "Sticker / Label",
    {
      offsetFactor: {
        value: polygonOffsetFactor,
        min: -64,
        max: 64,
        step: 1,
        label: "Polygon Offset Factor",
      },
      offsetUnits: {
        value: polygonOffsetFactor,
        min: -64,
        max: 64,
        step: 1,
        label: "Polygon Offset Units",
      },
      inflate: {
        value: isMyo ? 1.008 : 1,
        min: 1,
        max: 1.05,
        step: 0.001,
        label: "Surface Inflate",
      },
    },
    { collapsed: false },
    [polygonOffsetFactor, isMyo]
  );

  useEffect(() => {
    meshes.forEach((mesh) => {
      mesh.frustumCulled = false;

      if (!mesh.userData.baseScale) {
        mesh.userData.baseScale = mesh.scale.clone();
      }
      const base = mesh.userData.baseScale as THREE.Vector3;
      mesh.scale.set(base.x * inflate, base.y * inflate, base.z * inflate);

      // Determine if this mesh is on the front or back of the bottle
      let isFront = true;
      if (mesh.geometry) {
        mesh.geometry.computeBoundingBox();
        mesh.geometry.computeBoundingSphere();

        if (mesh.geometry.boundingBox) {
          const center = new THREE.Vector3();
          mesh.geometry.boundingBox.getCenter(center);

          // Sum the local geometry center and the mesh position to get the relative Z offset
          const zPos = center.z + mesh.position.z;
          if (zPos < -0.05) {
            isFront = false;
          }
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
        mat.polygonOffsetFactor = offsetFactor;
        mat.polygonOffsetUnits = offsetUnits;
        // Myo: keep labels in the opaque pass (alphaTest) so MeshTransmission /
        // physical transmission can't composite over them after the transparent sort.
        if (isMyo) {
          mat.transparent = true;
          mat.depthTest = true;
          mat.depthWrite = true;
          mesh.renderOrder = isFront ? 3 : 1;
          mat.side = THREE.FrontSide;
        } else {
          mat.transparent = true;
          mat.alphaTest = 0;
          mat.depthTest = true;
          mat.depthWrite = true;
          mat.side = THREE.DoubleSide;
        }
        mat.needsUpdate = true;
      }
    });
  }, [meshes, gl, offsetFactor, offsetUnits, inflate, isMyo]);

  if (meshes.length === 0) return null;

  return (
    <>
      {meshes.map((mesh, i) => (
        <primitive key={`outer-${i}`} object={mesh} />
      ))}
    </>
  );
}
