import { useMemo } from "react";
import * as THREE from "three";
import { MeshTransmissionMaterial, useGLTF } from "@react-three/drei";
import { useControls } from "leva";
import { MYO_GLASS } from "../../config/myoRenderConfig";

type ClientBottleGltfProps = {
  glbPath: string;
};

function ancestryNames(obj: THREE.Object3D): string {
  const parts: string[] = [];
  let curr: THREE.Object3D | null = obj;
  while (curr) {
    if (curr.name) parts.push(curr.name.toLowerCase());
    curr = curr.parent;
  }
  return parts.join(" ");
}

function materialNames(mesh: THREE.Mesh): string {
  if (!mesh.material) return "";
  if (Array.isArray(mesh.material)) {
    return mesh.material.map((m) => (m.name || "").toLowerCase()).join(" ");
  }
  return (mesh.material.name || "").toLowerCase();
}

function isStickerMesh(mesh: THREE.Mesh): boolean {
  const names = `${ancestryNames(mesh)} ${materialNames(mesh)}`;
  return names.includes("label") || names.includes("print area");
}

/**
 * Porto 10YO: bottle.001 = glass (Material.002) + wine (Material.006).
 * bottle.002 = Plastic neck — not the glass body. Caps are "bottle cap.*".
 */
function isBottleGlassMesh(mesh: THREE.Mesh): boolean {
  const ancestry = ancestryNames(mesh);
  const mats = materialNames(mesh);

  if (ancestry.includes("bottle cap")) return false;
  if (mats.includes("plastic") || mats.includes("wood")) return false;
  if (mats.includes("label") || mats.includes("print area")) return false;

  // Glass prim on the main bottle body only
  if (mats.includes("material.002")) return true;

  // Fallback: under bottle.001, but not the wine prim
  if (ancestry.includes("bottle.001") && !mats.includes("material.006")) {
    return true;
  }

  return false;
}

/**
 * Client GLB via useGLTF. Stickers get transparent=true; bottle glass body uses
 * MeshTransmissionMaterial with Leva-tunable props.
 */
export function ClientBottleGltf({ glbPath }: ClientBottleGltfProps) {
  const { scene } = useGLTF(glbPath);

  const glass = useControls(
    "Client Glass Transmission",
    {
      backside: { value: MYO_GLASS.backside, label: "Backside" },
      samples: { value: MYO_GLASS.samples, min: 1, max: 32, step: 1, label: "Samples" },
      resolution: {
        value: MYO_GLASS.resolution,
        min: 256,
        max: 2048,
        step: 256,
        label: "Resolution",
      },
      thickness: {
        value: MYO_GLASS.thickness,
        min: 0,
        max: 10,
        step: 0.05,
        label: "Thickness",
      },
      ior: { value: MYO_GLASS.ior, min: 1, max: 2.5, step: 0.01, label: "IOR" },
      chromaticAberration: {
        value: MYO_GLASS.chromaticAberration,
        min: 0,
        max: 1,
        step: 0.01,
        label: "Chromatic Aberration",
      },
      anisotropicBlur: {
        value: MYO_GLASS.anisotropicBlur,
        min: 0,
        max: 1,
        step: 0.01,
        label: "Anisotropic Blur",
      },
      transmission: { value: 1, min: 0, max: 1, step: 0.01, label: "Transmission" },
      clearcoat: { value: 1, min: 0, max: 1, step: 0.01, label: "Clearcoat" },
      clearcoatRoughness: {
        value: 0,
        min: 0,
        max: 1,
        step: 0.01,
        label: "Clearcoat Roughness",
      },
      color: { value: MYO_GLASS.color, label: "Color" },
      attenuationColor: {
        value: MYO_GLASS.attenuationColor,
        label: "Attenuation Color",
      },
      attenuationDistance: {
        value: MYO_GLASS.attenuationDistance,
        min: 0.01,
        max: 20,
        step: 0.05,
        label: "Attenuation Distance",
      },
      roughness: {
        value: MYO_GLASS.roughness,
        min: 0,
        max: 1,
        step: 0.01,
        label: "Roughness",
      },
      metalness: {
        value: MYO_GLASS.metalness,
        min: 0,
        max: 1,
        step: 0.01,
        label: "Metalness",
      },
    },
    { collapsed: false }
  );

  const { bottleMeshes, restRoot } = useMemo(() => {
    const cloned = scene.clone(true);

    const box = new THREE.Box3().setFromObject(cloned);
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    if (maxDim > 0) {
      cloned.scale.setScalar(2.0 / maxDim);
    }

    const scaledBox = new THREE.Box3().setFromObject(cloned);
    const scaledCenter = scaledBox.getCenter(new THREE.Vector3());
    cloned.position.x = -scaledCenter.x;
    cloned.position.y = -scaledBox.min.y - 1.0;
    cloned.position.z = -scaledCenter.z;

    cloned.updateMatrixWorld(true);

    const bottles: THREE.Mesh[] = [];
    const detach: THREE.Mesh[] = [];

    cloned.traverse((child) => {
      if (!(child as THREE.Mesh).isMesh) return;
      const mesh = child as THREE.Mesh;

      if (isStickerMesh(mesh)) {
        const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
        materials.forEach((mat) => {
          if (!mat) return;
          mat.transparent = true;
          mat.needsUpdate = true;
        });
      }

      if (isBottleGlassMesh(mesh)) {
        detach.push(mesh);
      }
    });

    detach.forEach((mesh) => {
      mesh.updateWorldMatrix(true, false);
      mesh.matrix.copy(mesh.matrixWorld);
      mesh.matrix.decompose(mesh.position, mesh.quaternion, mesh.scale);
      mesh.removeFromParent();
      mesh.frustumCulled = false;
      mesh.renderOrder = 5;
      bottles.push(mesh);
    });

    return { bottleMeshes: bottles, restRoot: cloned };
  }, [scene]);

  return (
    <group>
      {bottleMeshes.map((mesh, i) => (
        <primitive key={`client-glass-${i}`} object={mesh}>
          <MeshTransmissionMaterial
            backside={glass.backside}
            samples={glass.samples}
            resolution={glass.resolution}
            thickness={glass.thickness}
            ior={glass.ior}
            chromaticAberration={glass.chromaticAberration}
            anisotropicBlur={glass.anisotropicBlur}
            transmission={glass.transmission}
            clearcoat={glass.clearcoat}
            clearcoatRoughness={glass.clearcoatRoughness}
            color={glass.color}
            attenuationColor={glass.attenuationColor}
            attenuationDistance={glass.attenuationDistance}
            roughness={glass.roughness}
            metalness={glass.metalness}
          />
        </primitive>
      ))}
      <primitive object={restRoot} />
    </group>
  );
}
