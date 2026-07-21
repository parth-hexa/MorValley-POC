import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import type { GlassModelConfig } from "../../state/types";
import { generateProceduralGlass } from "../scene/proceduralGlass";

const gltfLoader = new GLTFLoader();

export interface LoadResult {
  object: THREE.Object3D;
  /** true if a real bundled .glb was found and used, false if we fell back. */
  fromAsset: boolean;
}

export async function loadGlassModel(
  config: GlassModelConfig,
  onProgress?: (percent: number) => void
): Promise<LoadResult> {
  try {
    const gltf = await gltfLoader.loadAsync(config.glbPath, (event) => {
      if (event.total > 0) {
        onProgress?.(Math.min(100, Math.round((event.loaded / event.total) * 100)));
      }
    });

    const model = gltf.scene;

    // Calculate bounds & normalize model scale and position
    const box = new THREE.Box3().setFromObject(model);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());

    const maxDim = Math.max(size.x, size.y, size.z);
    if (maxDim > 0) {
      const targetSize = 2.0;
      const scaleFactor = targetSize / maxDim;
      model.scale.setScalar(scaleFactor);
    }

    // Re-calculate box after scaling to position base at y = -1.0
    const scaledBox = new THREE.Box3().setFromObject(model);
    const scaledCenter = scaledBox.getCenter(new THREE.Vector3());
    
    model.position.x = -scaledCenter.x;
    model.position.y = -scaledBox.min.y - 1.0;
    model.position.z = -scaledCenter.z;

    // Prepare meshes and materials for glass rendering
    model.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        if (mesh.material) {
          const mat = mesh.material as THREE.MeshStandardMaterial;
          mat.side = THREE.DoubleSide;
          mat.needsUpdate = true;
        }
      }
    });

    onProgress?.(100);
    return { object: model, fromAsset: true };
  } catch (err) {
    console.error("Error loading GLTF model:", err);
    return simulateProceduralLoad(config, onProgress);
  }
}

function simulateProceduralLoad(
  config: GlassModelConfig,
  onProgress?: (percent: number) => void
): Promise<LoadResult> {
  return new Promise((resolve) => {
    let percent = 0;
    const step = () => {
      percent = Math.min(100, percent + 25);
      onProgress?.(Math.round(percent));
      if (percent >= 100) {
        resolve({ object: generateProceduralGlass(config.id), fromAsset: false });
      } else {
        setTimeout(step, 80);
      }
    };
    setTimeout(step, 80);
  });
}
