import * as THREE from "three";

/**
 * Creates a physically based glass material. Kept in one place so future
 * "material editing" work (see PRD future expansion) has a single source
 * to extend rather than hunting through geometry code.
 */
export function createGlassMaterial2(): THREE.MeshPhysicalMaterial {
  return new THREE.MeshPhysicalMaterial({
    color: new THREE.Color("#5c5c5c"), // Base color must be white for transmission to work properly
    metalness: 0,
    roughness: 0.1,
    transmission: 1,
    thickness: 8, // Lower thickness makes it less opaque
    ior: 1.5,
    envMapIntensity: 1.4,
    // clearcoat: 0.4,
    // clearcoatRoughness: 0.1,
    attenuationColor: new THREE.Color("#2f4a2d"),
    attenuationDistance: 0.6, // Light travels further before darkening, making it translucent
    transparent: true,
    depthWrite: true,
  });
}
export function createGlassMaterial(): THREE.MeshPhysicalMaterial {
  return new THREE.MeshPhysicalMaterial({
    color: "#5c5c5c",
    transmission: 1,
    roughness: 0.15,
    thickness: 500,
    envMapIntensity: 4,
    attenuationColor: new THREE.Color("#acacac"),
    attenuationDistance: 1.3,
  });
}

export function createBaseMaterial(): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    color: new THREE.Color("#e9e4de"),
    metalness: 0.05,
    roughness: 0.15,
  });
}
