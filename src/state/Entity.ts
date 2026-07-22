import { makeObservable, observable } from "mobx";
import { Element } from "./Element";

export class Entity extends Element {
  private _x: number;
  private _y: number;
  private _rotation: number;
  private _scaleX: number;
  private _scaleY: number;
  private _opacity: number;

  public constructor(id: string, name: string = "Entity") {
    super(id, name);
    this._x = 0;
    this._y = 0;
    this._rotation = 0;
    this._scaleX = 1;
    this._scaleY = 1;
    this._opacity = 1;

    makeObservable<this, "_x" | "_y" | "_rotation" | "_scaleX" | "_scaleY" | "_opacity">(this, {
      _x: observable,
      _y: observable,
      _rotation: observable,
      _scaleX: observable,
      _scaleY: observable,
      _opacity: observable,
    });
  }

  public get x(): number {
    return this._x;
  }
  public setX(value: number) {
    this._x = value;
  }

  public get y(): number {
    return this._y;
  }
  public setY(value: number) {
    this._y = value;
  }

  public get rotation(): number {
    return this._rotation;
  }
  public setRotation(value: number) {
    this._rotation = value;
  }

  public get scaleX(): number {
    return this._scaleX;
  }
  public setScaleX(value: number) {
    this._scaleX = value;
  }

  public get scaleY(): number {
    return this._scaleY;
  }
  public setScaleY(value: number) {
    this._scaleY = value;
  }

  public get opacity(): number {
    return this._opacity;
  }
  public setOpacity(value: number) {
    this._opacity = value;
  }
}
