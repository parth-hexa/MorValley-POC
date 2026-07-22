import { makeAutoObservable } from "mobx";
import { Bottle3DManager } from "./Bottle3DManager";

export class Product3DManager {
  private _bottle3DManager: Bottle3DManager;

  public constructor() {
    this._bottle3DManager = new Bottle3DManager();
    makeAutoObservable(this);
  }

  public get bottle3DManager(): Bottle3DManager {
    return this._bottle3DManager;
  }
}
