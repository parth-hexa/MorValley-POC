import { makeAutoObservable } from "mobx";
import type { Design3DManager } from "./Design3DManager";
import { DEFAULT_GLASS_ID, GLASS_CATALOG, type GlassType } from "./types";

/**
 * Owns 2D/editor-facing state. Today that's just the selected model and
 * panel visibility; per the PRD this is where future design-tool state
 * (images, text, layers, colors, decals) will live, kept separate from the
 * raw 3D concerns in Design3DManager.
 */
export class DesignManager {
  selectedModelId: GlassType = DEFAULT_GLASS_ID;
  isDesignPanelOpen = true;

  private design3DManager: Design3DManager;

  constructor(design3DManager: Design3DManager) {
    this.design3DManager = design3DManager;
    makeAutoObservable<this, "design3DManager">(this, { design3DManager: false });
  }

  get isLoading(): boolean {
    return this.design3DManager.isLoading;
  }

  get selectedModelConfig() {
    return GLASS_CATALOG.find((m) => m.id === this.selectedModelId) ?? GLASS_CATALOG[0];
  }

  toggleDesignPanel() {
    this.isDesignPanelOpen = !this.isDesignPanelOpen;
  }

  async selectModel(modelId: GlassType) {
    if (modelId === this.selectedModelId && this.design3DManager.currentModel === modelId) {
      return;
    }
    this.selectedModelId = modelId;
    const config = GLASS_CATALOG.find((m) => m.id === modelId);
    if (config) {
      await this.design3DManager.loadModel(config);
    }
  }

  async loadDefaultModel() {
    await this.selectModel(DEFAULT_GLASS_ID);
  }
}
