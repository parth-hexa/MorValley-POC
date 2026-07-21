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

/**
 * Loads a glass model per the "Static Model Loading" requirement: models are
 * expected at public/models/*.glb and loaded directly, no backend involved.
 *
 * No real .glb files ship with this scaffold, so this loader attempts the
 * real asset first (so dropping real files into public/models "just works")
 * and transparently falls back to a procedural placeholder glass otherwise.
 * Progress callback fires 0 -> 100 either way, so the loading UI behaves
 * identically for real assets and the fallback.
 */
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
    onProgress?.(100);
    return { object: gltf.scene, fromAsset: true };
  } catch {
    // Expected in this scaffold (no bundled .glb yet) — simulate a brief,
    // deterministic load so the loading overlay always has something to show.
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
      percent = Math.min(100, percent + 20 + Math.random() * 20);
      onProgress?.(Math.round(percent));
      if (percent >= 100) {
        resolve({ object: generateProceduralGlass(config.id), fromAsset: false });
      } else {
        setTimeout(step, 90);
      }
    };
    setTimeout(step, 90);
  });
}
