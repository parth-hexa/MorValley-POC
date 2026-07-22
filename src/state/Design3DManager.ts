import { makeAutoObservable, runInAction } from "mobx";
import type * as THREE from "three";
import type { GlassModelConfig, GlassType } from "./types";
import { loadGlassModel } from "../three/loaders/modelLoader";
import { disposeObject3D } from "../utils/disposeObject";
import {
  DEFAULT_ENVIRONMENT_PRESET,
  type EnvironmentPreset,
} from "../three/environment/envPresets";
import { DEFAULT_CAMERA_STATE, type CameraState } from "../three/camera/cameraConfig";

/**
 * Owns everything 3D: the loaded object, camera/environment/renderer state,
 * and load progress. Per the PRD this is the only manager allowed to touch
 * Three.js objects directly — components read from it, they don't reach
 * into three/ themselves.
 */
export class Design3DManager {
  private _currentModel: GlassType | null = null;
  private _loadedObject: THREE.Object3D | null = null;
  private _isLoading = false;
  private _loadingProgress = 0;
  private _sceneInitialized = false;
  private _environmentPreset: EnvironmentPreset = DEFAULT_ENVIRONMENT_PRESET;
  private _cameraState: CameraState = DEFAULT_CAMERA_STATE;

  /** Monotonically increasing token used to ignore stale async loads. */
  private loadToken = 0;

  constructor() {
    makeAutoObservable(this);
  }

  get currentModel(): GlassType | null {
    return this._currentModel;
  }
  set currentModel(value: GlassType | null) {
    this._currentModel = value;
  }

  get loadedObject(): THREE.Object3D | null {
    return this._loadedObject;
  }
  set loadedObject(value: THREE.Object3D | null) {
    this._loadedObject = value;
  }

  get isLoading(): boolean {
    return this._isLoading;
  }
  set isLoading(value: boolean) {
    this._isLoading = value;
  }

  get loadingProgress(): number {
    return this._loadingProgress;
  }
  set loadingProgress(value: number) {
    this._loadingProgress = value;
  }

  get sceneInitialized(): boolean {
    return this._sceneInitialized;
  }
  set sceneInitialized(value: boolean) {
    this._sceneInitialized = value;
  }

  get environmentPreset(): EnvironmentPreset {
    return this._environmentPreset;
  }
  set environmentPreset(value: EnvironmentPreset) {
    this._environmentPreset = value;
  }

  get cameraState(): CameraState {
    return this._cameraState;
  }
  set cameraState(value: CameraState) {
    this._cameraState = value;
  }

  setSceneInitialized(value: boolean) {
    this.sceneInitialized = value;
  }

  setEnvironmentPreset(preset: EnvironmentPreset) {
    this.environmentPreset = preset;
  }

  setCameraState(partial: Partial<CameraState>) {
    this.cameraState = { ...this.cameraState, ...partial };
  }

  /**
   * Loads a new glass model, disposing the previous one first. Guards
   * against duplicate/overlapping loads per the "Prevent duplicate model
   * loading" performance requirement.
   */
  async loadModel(config: GlassModelConfig): Promise<void> {
    if (this.isLoading && this.currentModel === config.id) return;

    const token = ++this.loadToken;

    runInAction(() => {
      this.isLoading = true;
      this.loadingProgress = 0;
    });

    try {
      const { object } = await loadGlassModel(config, (percent) => {
        if (token !== this.loadToken) return; // a newer load superseded this one
        runInAction(() => {
          this.loadingProgress = percent;
        });
      });

      if (token !== this.loadToken) {
        // A newer selection arrived while this one was in flight — discard.
        disposeObject3D(object);
        return;
      }

      runInAction(() => {
        disposeObject3D(this.loadedObject);
        this.loadedObject = object;
        this.currentModel = config.id;
      });
    } finally {
      if (token === this.loadToken) {
        runInAction(() => {
          this.isLoading = false;
        });
      }
    }
  }

  disposeCurrentModel() {
    disposeObject3D(this.loadedObject);
    this.loadedObject = null;
    this.currentModel = null;
  }
}
