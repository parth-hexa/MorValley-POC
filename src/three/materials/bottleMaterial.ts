import * as THREE from "three";

/**
 * Creates a physically based glass material. Kept in one place so future
 * "material editing" work (see PRD future expansion) has a single source
 * to extend rather than hunting through geometry code.
 */
export function createBottleMaterial2(): THREE.MeshPhysicalMaterial {
  return new THREE.MeshPhysicalMaterial({
    color: "#612929",
    transmission: 1, // Full transmission for glass
    opacity: 1, // Must be 1 for transmission to work correctly
    metalness: 0,
    roughness: 0.1, // Slight roughness for realism
    ior: 1.5, // Index of Refraction (1.5 is typical for glass)
    thickness: 100, // Volume thickness for refraction/attenuation
    attenuationColor: new THREE.Color("#4a1b1b"), // Deep red absorption
    attenuationDistance: 10, // How far light travels before taking the color
    clearcoat: 0.5,
    clearcoatRoughness: 0.1,
    transparent: true,
    depthWrite: false, // Prevents occlusion issues with transmissive materials
  });
}
export function createBottleMaterial(): THREE.MeshPhysicalMaterial {
  return new THREE.MeshPhysicalMaterial({
    color: "#342f2f",
    transmission: 1,
    roughness: 0.09,
    thickness: 500,
    envMapIntensity: 4,
    attenuationColor: new THREE.Color("#d88d68"),
    attenuationDistance: 1.3,
    clearcoat: 0.8,
    clearcoatRoughness: 0,
    ior: 1.5,
  });
}

export function createBaseMaterial(): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    color: new THREE.Color("#e9e4de"),
    metalness: 0.05,
    roughness: 0.15,
  });
}

export function createWaxMaterial(): THREE.MeshPhysicalMaterial {
  return new THREE.MeshPhysicalMaterial({
    color: "#6c512e",
    metalness: 0,
    roughness: 0.45,
    transmission: 0.35,
    thickness: 2,
    ior: 1.44,
  });
}
