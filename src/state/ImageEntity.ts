import { makeObservable, observable } from "mobx";
import { Entity } from "./Entity";

export class ImageEntity extends Entity {
  private _src: string;
  private _width: number;
  private _height: number;

  public constructor(id: string, src: string = "", name: string = "Image Entity") {
    super(id, name);
    this._src = src;
    this._width = 100;
    this._height = 100;

    makeObservable<this, "_src" | "_width" | "_height">(this, {
      _src: observable,
      _width: observable,
      _height: observable,
    });
  }

  public get src(): string {
    return this._src;
  }
  public setSrc(value: string) {
    this._src = value;
  }

  public get width(): number {
    return this._width;
  }
  public setWidth(value: number) {
    this._width = value;
  }

  public get height(): number {
    return this._height;
  }
  public setHeight(value: number) {
    this._height = value;
  }
}
