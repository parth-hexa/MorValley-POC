import { makeAutoObservable } from "mobx";
import { ElementManager } from "./ElementManager";
import type { BottleType } from "./types";

export class Bottle {
  private _id: BottleType;
  private _name: string;
  private _glbPath: string;
  private _note: string;
  private _innerTwoVariant: "copper" | "wax" | "default";
  private _innerOneVariant: "black" | "transparent" | "default";
  private _backgroundGradient?: string;
  private _labelPolygonOffset: number;
  private _elementManager: ElementManager;

  public constructor(
    id: BottleType,
    name: string,
    glbPath: string,
    note: string,
    innerTwoVariant: "copper" | "wax" | "default" = "default",
    innerOneVariant: "black" | "transparent" | "default" = "black",
    backgroundGradient?: string,
    labelPolygonOffset: number = 4
  ) {
    this._id = id;
    this._name = name;
    this._glbPath = glbPath;
    this._note = note;
    this._innerTwoVariant = innerTwoVariant;
    this._innerOneVariant = innerOneVariant;
    this._backgroundGradient = backgroundGradient;
    this._labelPolygonOffset = labelPolygonOffset;
    this._elementManager = new ElementManager();
    
    makeAutoObservable(this);
  }

  public get id(): BottleType {
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

  public get innerTwoVariant(): "copper" | "wax" | "default" {
    return this._innerTwoVariant;
  }

  public get innerOneVariant(): "black" | "transparent" | "default" {
    return this._innerOneVariant;
  }

  public get backgroundGradient(): string | undefined {
    return this._backgroundGradient;
  }

  public get labelPolygonOffset(): number {
    return this._labelPolygonOffset;
  }
}
