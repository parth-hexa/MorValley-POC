import { makeAutoObservable } from "mobx";
import type { Design3DManager } from "./Design3DManager";
import { ProductManager } from "./ProductManager";
import type { BottleType, BottleModelConfig } from "./types";

/**
 * Owns 2D/editor-facing state. Today that's just the selected model and
 * panel visibility; per the PRD this is where future design-tool state
 * (images, text, layers, colors, decals) will live, kept separate from the
 * raw 3D concerns in Design3DManager.
 */
export class DesignManager {
  private _productManager: ProductManager;

  private design3DManager: Design3DManager;

  public constructor(design3DManager: Design3DManager) {
    this.design3DManager = design3DManager;
    this._productManager = new ProductManager();
    makeAutoObservable<this, "design3DManager">(this, { design3DManager: false });
  }

  public get productManager(): ProductManager {
    return this._productManager;
  }


  public selectModel(modelId: BottleType) {
    const bottle2DManager = this.productManager.bottle2DManager;
    if (modelId === bottle2DManager.selectedBottleId && this.design3DManager.currentModel === modelId) {
      return;
    }
    
    const bottle = bottle2DManager.getBottleById(modelId);
    if (bottle) {
      bottle2DManager.setSelectedBottleId(modelId);
      // The React layer (via useBottleLoader hook) will detect this state change 
      // and trigger the async loading process.
    }
  }
}
