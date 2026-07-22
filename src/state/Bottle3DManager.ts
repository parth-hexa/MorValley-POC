import { makeAutoObservable } from "mobx";
import { Element3DManager } from "./Element3DManager";

export class Bottle3DManager {
  private _element3DManager: Element3DManager;

  public constructor() {
    this._element3DManager = new Element3DManager();
    makeAutoObservable(this);
  }

  public get element3DManager(): Element3DManager {
    return this._element3DManager;
  }
}
