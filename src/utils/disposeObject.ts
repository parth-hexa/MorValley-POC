import * as THREE from "three";

function disposeMaterial(material: THREE.Material) {
  // Dispose any texture maps attached to the material.
  Object.values(material).forEach((value) => {
    if (value instanceof THREE.Texture) {
      value.dispose();
    }
  });
  material.dispose();
}

/**
 * Recursively disposes geometries, materials, and textures on an object
 * graph. Required per the PRD performance requirements: "Dispose previous
 * model correctly" / "Avoid memory leaks".
 */
export function disposeObject3D(object: THREE.Object3D | null | undefined) {
  if (!object) return;

  object.traverse((child) => {
    const mesh = child as THREE.Mesh;
    if (mesh.geometry) {
      mesh.geometry.dispose();
    }
    if (mesh.material) {
      if (Array.isArray(mesh.material)) {
        mesh.material.forEach(disposeMaterial);
      } else {
        disposeMaterial(mesh.material);
      }
    }
  });

  object.parent?.remove(object);
}
