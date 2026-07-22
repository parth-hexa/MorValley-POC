import { makeAutoObservable } from "mobx";
import type { Bottle } from "./Bottle";
import type { GlassType } from "./types";

export class Bottle2DManager {
  private _bottles: Bottle[] = [];
  private _selectedBottleId: GlassType | null = null;

  public constructor() {
    makeAutoObservable(this);
  }

  public get bottles(): Bottle[] {
    return this._bottles;
  }

  public get selectedBottleId(): GlassType | null {
    return this._selectedBottleId;
  }

  public setSelectedBottleId(value: GlassType) {
    this._selectedBottleId = value;
  }

  public addBottle(bottle: Bottle) {
    this._bottles.push(bottle);
  }

  public getBottleById(id: GlassType): Bottle | undefined {
    return this._bottles.find((b) => b.id === id);
  }

  public getSelectedBottle(): Bottle | undefined {
    if (!this._selectedBottleId) return undefined;
    return this.getBottleById(this._selectedBottleId);
  }
}
