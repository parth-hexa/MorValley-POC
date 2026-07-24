import { makeObservable, observable } from "mobx";

export class Element {
  private _id: string;
  private _name: string;
  private _visible: boolean;

  public constructor(id: string, name: string = "Element") {
    this._id = id;
    this._name = name;
    this._visible = true;

    makeObservable<this, "_id" | "_name" | "_visible">(this, {
      _id: observable,
      _name: observable,
      _visible: observable,
    });
  }

  public get id(): string {
    return this._id;
  }
  public setId(value: string) {
    this._id = value;
  }

  public get name(): string {
    return this._name;
  }
  public setName(value: string) {
    this._name = value;
  }

  public get visible(): boolean {
    return this._visible;
  }
  public setVisible(value: boolean) {
    this._visible = value;
  }
}
