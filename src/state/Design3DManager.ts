import { makeAutoObservable, runInAction } from "mobx";
import type * as THREE from "three";
import type { BottleModelConfig, BottleType } from "./types";
import { Product3DManager } from "./Product3DManager";
import { ModelLoader } from "../three/loaders/modelLoader";
import { disposeObject3D } from "../utils/disposeObject";

import { DEFAULT_CAMERA_STATE, type CameraState } from "../three/camera/cameraConfig";

/**
 * Owns everything 3D: the loaded object, camera/environment/renderer state,
 * and load progress. Per the PRD this is the only manager allowed to touch
 * Three.js objects directly — components read from it, they don't reach
 * into three/ themselves.
 */
export class Design3DManager {
  private _currentModel: BottleType | null = null;
  private _loadedObject: THREE.Object3D | null = null;
  private _isLoading = false;
  private _loadingProgress = 0;
  private _sceneInitialized = false;
  private _cameraState: CameraState = DEFAULT_CAMERA_STATE;
  private _product3DManager: Product3DManager;

  /** Monotonically increasing token used to ignore stale async loads. */
  private loadToken = 0;

  public constructor() {
    this._product3DManager = new Product3DManager();
    makeAutoObservable(this);
  }

  public get product3DManager(): Product3DManager {
    return this._product3DManager;
  }

  public get currentModel(): BottleType | null {
    return this._currentModel;
  }
  public setCurrentModel(value: BottleType | null) {
    this._currentModel = value;
  }

  public get loadedObject(): THREE.Object3D | null {
    return this._loadedObject;
  }
  public setLoadedObject(value: THREE.Object3D | null) {
    this._loadedObject = value;
  }

  public get isLoading(): boolean {
    return this._isLoading;
  }
  public setIsLoading(value: boolean) {
    this._isLoading = value;
  }

  public get loadingProgress(): number {
    return this._loadingProgress;
  }
  public setLoadingProgress(value: number) {
    this._loadingProgress = value;
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

  /**
   * Loads a new bottle model, disposing the previous one first. Guards
   * against duplicate/overlapping loads per the "Prevent duplicate model
   * loading" performance requirement.
   */
  public async loadModel(config: BottleModelConfig): Promise<void> {
    if (this.isLoading && this.currentModel === config.id) return;

    const token = ++this.loadToken;

    runInAction(() => {
      this.setIsLoading(true);
      this.setLoadingProgress(0);
    });

    try {
      const { object } = await ModelLoader.loadBottleModel(config, (percent) => {
        if (token !== this.loadToken) return; // a newer load superseded this one
        runInAction(() => {
          this.setLoadingProgress(percent);
        });
      });

      if (token !== this.loadToken) {
        // A newer selection arrived while this one was in flight — discard.
        disposeObject3D(object);
        return;
      }

      runInAction(() => {
        disposeObject3D(this.loadedObject);
        this.setLoadedObject(object);
        this.setCurrentModel(config.id);
      });
    } finally {
      if (token === this.loadToken) {
        runInAction(() => {
          this.setIsLoading(false);
        });
      }
    }
  }

  public disposeCurrentModel() {
    disposeObject3D(this.loadedObject);
    this.setLoadedObject(null);
    this.setCurrentModel(null);
  }
}
