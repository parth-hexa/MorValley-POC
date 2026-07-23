import { useEffect, useRef } from "react";
import { runInAction } from "mobx";
import { useStores } from "./useStores";
import { ModelLoader } from "../three/loaders/modelLoader";
import type { BottleModelConfig } from "../state/types";
import { disposeObject3D } from "../utils/disposeObject";

/**
 * React hook that bridges MobX state and Three.js asset loading.
 * It observes `selectedBottleId` and automatically invokes the static
 * ModelLoader to fetch the asset, update loading progress in the store,
 * and finally mount the resulting mesh into the MeshManager.
 */
export function useBottleLoader() {
  const { designManager, design3DManager } = useStores();
  const bottle2DManager = designManager.productManager.bottle2DManager;
  const selectedBottleId = bottle2DManager.selectedBottleId;
  
  const loadTokenRef = useRef(0);

  useEffect(() => {
    if (!selectedBottleId) return;
    
    // Prevent reloading if it's already the current model in the 3D scene
    if (design3DManager.currentModel === selectedBottleId) return;

    const bottle = bottle2DManager.getBottleById(selectedBottleId);
    if (!bottle) return;

    const config: BottleModelConfig = {
      id: bottle.id,
      name: bottle.name,
      glbPath: bottle.glbPath,
      note: bottle.note,
      innerTwoVariant: bottle.innerTwoVariant
    };

    const token = ++loadTokenRef.current;
    let isCancelled = false;

    ModelLoader.loadBottleModel(config, () => {
      // Progress reporting removed, relies on R3F useProgress
    }).then(({ object }) => {
      if (token !== loadTokenRef.current || isCancelled) {
        // A newer selection arrived while this one was in flight, or the component unmounted.
        // Dispose this orphaned object to prevent a memory leak since it won't be given to MeshManager.
        disposeObject3D(object);
        return;
      }
      
      runInAction(() => {
        design3DManager.meshManager.setLoadedObject(object);
        design3DManager.setCurrentModel(config.id);
      });
    }).catch(err => {
      console.error("Failed to load model in useBottleLoader:", err);
    });

    // Cleanup function when component unmounts or selectedBottleId changes
    return () => {
      isCancelled = true;
    };
  }, [selectedBottleId, design3DManager, bottle2DManager]);
}
