import { makeAutoObservable } from "mobx";
import type * as THREE from "three";
import { disposeObject3D } from "../utils/disposeObject";

export class MeshManager {
  private _loadedObject: THREE.Object3D | null = null;

  public constructor() {
    makeAutoObservable(this);
  }

  public get loadedObject(): THREE.Object3D | null {
    return this._loadedObject;
  }

  public setLoadedObject(value: THREE.Object3D | null) {
    if (this._loadedObject && this._loadedObject !== value) {
      disposeObject3D(this._loadedObject);
    }
    this._loadedObject = value;
  }

  public disposeCurrentModel() {
    if (this._loadedObject) {
      disposeObject3D(this._loadedObject);
      this._loadedObject = null;
    }
  }
}
