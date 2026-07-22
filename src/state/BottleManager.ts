import { makeAutoObservable } from "mobx";
import { ElementManager } from "./ElementManager";
import { DEFAULT_GLASS_ID, GLASS_CATALOG, type GlassType } from "./types";

export class BottleManager {
  private _elementManager: ElementManager;
  private _selectedModelId: GlassType = DEFAULT_GLASS_ID;

  public constructor() {
    this._elementManager = new ElementManager();
    makeAutoObservable(this);
  }

  public get elementManager(): ElementManager {
    return this._elementManager;
  }

  public get selectedModelId(): GlassType {
    return this._selectedModelId;
  }

  public setSelectedModelId(value: GlassType) {
    this._selectedModelId = value;
  }

  public get selectedModelConfig() {
    return GLASS_CATALOG.find((m) => m.id === this.selectedModelId) ?? GLASS_CATALOG[0];
  }
}
