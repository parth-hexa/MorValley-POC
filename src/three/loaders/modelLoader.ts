import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import type { BottleModelConfig } from "../../state/types";
import { generateProceduralBottle } from "../scene/proceduralBottle";

export interface LoadResult {
  object: THREE.Object3D;
  /** true if a real bundled .glb was found and used, false if we fell back. */
  fromAsset: boolean;
}

export class ModelLoader {
  private constructor() {} // Non-instantiable

  private static dracoLoader = new DRACOLoader().setDecoderPath("https://www.gstatic.com/draco/v1/decoders/");
  private static gltfLoader = new GLTFLoader().setDRACOLoader(ModelLoader.dracoLoader);

  /** In-memory cache for parsed GLB model templates to allow instant model switching. */
  private static modelCache = new Map<string, THREE.Object3D>();

  public static async loadBottleModel(
    config: BottleModelConfig,
    onProgress?: (percent: number) => void
  ): Promise<LoadResult> {
    // Check if model is already cached for instant switching
    if (ModelLoader.modelCache.has(config.glbPath)) {
      onProgress?.(100);
      const cachedModel = ModelLoader.modelCache.get(config.glbPath)!;
      return { object: cachedModel.clone(true), fromAsset: true };
    }

    try {
      const gltf = await ModelLoader.gltfLoader.loadAsync(config.glbPath, (event) => {
        if (event.total > 0) {
          onProgress?.(Math.min(100, Math.round((event.loaded / event.total) * 100)));
        }
      });

      const model = gltf.scene;

      // Calculate bounds & normalize model scale and position
      const box = new THREE.Box3().setFromObject(model);
      const size = box.getSize(new THREE.Vector3());
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

      model.traverse((child) => {
        const childName = child.name;

        let isWineLiquid = childName.includes("Rogador_Reserva_Red_750_ML") && !childName.includes("Rogador_Reserva_Red_750_ML_1");
        let isCap = childName.includes("Rogador_Reserva_Red_750_ML_1");
        let isOuterBottle = childName.toLowerCase().includes("outer");

        let isOuter = false;
        let isInner = false;

        // Generic fallback checks if not specifically matched
        if (!isWineLiquid && !isCap && !isOuterBottle) {
          let curr: THREE.Object3D | null = child;
          while (curr) {
            const n = curr.name.toLowerCase();
            if (n.includes("outer")) isOuter = true;
            if (n.includes("inner")) isInner = true;
            curr = curr.parent;
          }
        } else {
          isInner = isWineLiquid;
          isOuter = isOuterBottle;
        }

        if (isWineLiquid || isInner) {
          child.renderOrder = 1;
        } else if (isOuterBottle || isOuter) {
          child.renderOrder = 2;
        } else if (isCap) {
          child.renderOrder = 3;
        }

        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          mesh.castShadow = true;
          mesh.receiveShadow = true;
        }
      });

      // Save processed model template to cache
      ModelLoader.modelCache.set(config.glbPath, model);

      onProgress?.(100);
      return { object: model.clone(true), fromAsset: true };
    } catch (err) {
      console.error("Error loading GLTF model:", err);
      return ModelLoader.simulateProceduralLoad(config, onProgress);
    }
  }

  private static simulateProceduralLoad(
    config: BottleModelConfig,
    onProgress?: (percent: number) => void
  ): Promise<LoadResult> {
    return new Promise((resolve) => {
      let percent = 0;
      const step = () => {
        percent = Math.min(100, percent + 25);
        onProgress?.(Math.round(percent));
        if (percent >= 100) {
          resolve({ object: generateProceduralBottle(config.id), fromAsset: false });
        } else {
          setTimeout(step, 80);
        }
      };
      setTimeout(step, 80);
    });
  }
}
