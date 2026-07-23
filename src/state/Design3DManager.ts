import { makeAutoObservable, runInAction } from "mobx";
import type * as THREE from "three";
import type { BottleModelConfig, BottleType } from "./types";
import { Product3DManager } from "./Product3DManager";
import { MeshManager } from "./MeshManager";

import { DEFAULT_CAMERA_STATE, type CameraState } from "../three/camera/cameraConfig";

/**
 * Owns everything 3D: the loaded object, camera/environment/renderer state,
 * and load progress. Per the PRD this is the only manager allowed to touch
 * Three.js objects directly — components read from it, they don't reach
 * into three/ themselves.
 */
export class Design3DManager {
  private _currentModel: BottleType | null = null;
  private _sceneInitialized = false;
  private _isOverlayVisible = true; // Tracks if the global loading overlay is currently visible
  private _cameraState: CameraState = DEFAULT_CAMERA_STATE;
  private _product3DManager: Product3DManager;
  private _meshManager: MeshManager;

  public constructor() {
    this._product3DManager = new Product3DManager();
    this._meshManager = new MeshManager();
    makeAutoObservable(this);
  }

  public get product3DManager(): Product3DManager {
    return this._product3DManager;
  }

  public get meshManager(): MeshManager {
    return this._meshManager;
  }

  public get currentModel(): BottleType | null {
    return this._currentModel;
  }
  public setCurrentModel(value: BottleType | null) {
    this._currentModel = value;
  }
  public get isOverlayVisible(): boolean {
    return this._isOverlayVisible;
  }
  public setIsOverlayVisible(value: boolean) {
    this._isOverlayVisible = value;
  }

  public get sceneInitialized(): boolean {
    return this._sceneInitialized;
  }
  public setSceneInitialized(value: boolean) {
    this._sceneInitialized = value;
  }


  public get cameraState(): CameraState {
    return this._cameraState;
  }
  public setCameraState(partial: Partial<CameraState>) {
    this._cameraState = { ...this.cameraState, ...partial };
  }


}
