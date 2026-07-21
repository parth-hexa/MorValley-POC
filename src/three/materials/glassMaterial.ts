import * as THREE from "three";

/**
 * Creates a physically based glass material. Kept in one place so future
 * "material editing" work (see PRD future expansion) has a single source
 * to extend rather than hunting through geometry code.
 */
export function createGlassMaterial(): THREE.MeshPhysicalMaterial {
  return new THREE.MeshPhysicalMaterial({
    color: new THREE.Color("#f7fbfa"),
    metalness: 0,
    roughness: 0.03,
    transmission: 1,
    thickness: 0.35,
    ior: 1.5,
    envMapIntensity: 1.4,
    clearcoat: 0.4,
    clearcoatRoughness: 0.1,
    attenuationColor: new THREE.Color("#eef7f0"),
    attenuationDistance: 0.6,
    transparent: true,
    depthWrite: false,
  });
}

export function createBaseMaterial(): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    color: new THREE.Color("#e9e4de"),
    metalness: 0.05,
    roughness: 0.15,
  });
}
