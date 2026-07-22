import { makeAutoObservable } from "mobx";
import type { Design3DManager } from "./Design3DManager";
import { ProductManager } from "./ProductManager";
import type { GlassType, GlassModelConfig } from "./types";

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

  public get isLoading(): boolean {
    return this.design3DManager.isLoading;
  }

  public async selectModel(modelId: GlassType) {
    const bottle2DManager = this.productManager.bottle2DManager;
    if (modelId === bottle2DManager.selectedBottleId && this.design3DManager.currentModel === modelId) {
      return;
    }
    
    const bottle = bottle2DManager.getBottleById(modelId);
    if (bottle) {
      bottle2DManager.setSelectedBottleId(modelId);
      const config: GlassModelConfig = {
        id: bottle.id,
        name: bottle.name,
        glbPath: bottle.glbPath,
        note: bottle.note
      };
      await this.design3DManager.loadModel(config);
    }
  }
}
