import { makeAutoObservable } from "mobx";
import { ElementManager } from "./ElementManager";
import type { GlassType } from "./types";

export class Bottle {
  private _id: GlassType;
  private _name: string;
  private _glbPath: string;
  private _note: string;
  private _elementManager: ElementManager;

  public constructor(id: GlassType, name: string, glbPath: string, note: string) {
    this._id = id;
    this._name = name;
    this._glbPath = glbPath;
    this._note = note;
    this._elementManager = new ElementManager();
    makeAutoObservable(this);
  }

  public get id(): GlassType {
    return this._id;
  }

  public get name(): string {
    return this._name;
  }

  public get glbPath(): string {
    return this._glbPath;
  }

  public get note(): string {
    return this._note;
  }

  public get elementManager(): ElementManager {
    return this._elementManager;
  }
}
