import type { Vector3Tuple } from "three";

export interface CameraState {
  position: Vector3Tuple;
  target: Vector3Tuple;
  fov: number;
  minDistance: number;
  maxDistance: number;
}

export const DEFAULT_CAMERA_STATE: CameraState = {
  position: [0, 0.3, 4.2],
  target: [0, 0.1, 0],
  fov: 35,
  minDistance: 4,
  maxDistance: 7,
};
