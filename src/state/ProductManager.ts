import { makeAutoObservable } from "mobx";
import { BottleManager } from "./BottleManager";

export class ProductManager {
  private _bottleManager: BottleManager;

  public constructor() {
    this._bottleManager = new BottleManager();
    makeAutoObservable(this);
  }

  public get bottleManager(): BottleManager {
    return this._bottleManager;
  }
}
