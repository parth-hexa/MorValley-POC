import type * as THREE from "three";

/**
 * Cleanly unmounts and detaches a Three.js Object3D scene graph.
 * Preserves cached material templates for instant model switching without memory leaks.
 */
export function disposeObject3D(object: THREE.Object3D | null | undefined) {
  if (!object) return;
  object.parent?.remove(object);
}
