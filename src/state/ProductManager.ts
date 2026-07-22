import { makeAutoObservable } from "mobx";
import { Bottle2DManager } from "./Bottle2DManager";

export class ProductManager {
  private _bottle2DManager: Bottle2DManager;

  public constructor() {
    this._bottle2DManager = new Bottle2DManager();
    makeAutoObservable(this);
  }

  public get bottle2DManager(): Bottle2DManager {
    return this._bottle2DManager;
  }
}
