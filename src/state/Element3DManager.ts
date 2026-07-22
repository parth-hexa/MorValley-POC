import { makeAutoObservable } from "mobx";
import type { TextEntity } from "./TextEntity";
import type { ImageEntity } from "./ImageEntity";

export class Element3DManager {
  private _texts: TextEntity[] = [];
  private _images: ImageEntity[] = [];

  public constructor() {
    makeAutoObservable(this);
  }

  public get texts(): TextEntity[] {
    return this._texts;
  }
  public setTexts(value: TextEntity[]) {
    this._texts = value;
  }

  public get images(): ImageEntity[] {
    return this._images;
  }
  public setImages(value: ImageEntity[]) {
    this._images = value;
  }

  public addText(textEntity: TextEntity) {
    this._texts.push(textEntity);
  }

  public removeText(id: string) {
    this._texts = this._texts.filter((t) => t.id !== id);
  }

  public addImage(imageEntity: ImageEntity) {
    this._images.push(imageEntity);
  }

  public removeImage(id: string) {
    this._images = this._images.filter((i) => i.id !== id);
  }

  public clearAll() {
    this._texts = [];
    this._images = [];
  }
}
