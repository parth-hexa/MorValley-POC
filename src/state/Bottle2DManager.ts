import { makeAutoObservable } from "mobx";
import type { Bottle } from "./Bottle";
import type { BottleType } from "./types";

export class Bottle2DManager {
  private _bottles: Bottle[] = [];
  private _selectedBottleId: BottleType | null = null;

  public constructor() {
    makeAutoObservable(this);
  }

  public get bottles(): Bottle[] {
    return this._bottles;
  }

  public get selectedBottleId(): BottleType | null {
    return this._selectedBottleId;
  }

  public setSelectedBottleId(value: BottleType | null) {
    this._selectedBottleId = value;
  }

  public addBottle(bottle: Bottle) {
    this._bottles.push(bottle);
  }

  public getBottleById(id: BottleType): Bottle | undefined {
    return this._bottles.find((b) => b.id === id);
  }

  public getSelectedBottle(): Bottle | undefined {
    if (!this._selectedBottleId) return undefined;
    return this.getBottleById(this._selectedBottleId);
  }
}
