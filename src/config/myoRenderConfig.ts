/**
 * Baked Myo 10/20 Anos render settings.
 * Only applied when innerOneVariant === "transparent".
 */

export const MYO_LIQUID = {
  color: "#933f0a",
  attenuationColor: "#8b3a0a",
  opacity: 1,
  transmission: 0.72,
  attenuationDistance: 0.35,
  thickness: 1.3,
  ior: 1,
  roughness: 0.12,
  envMapIntensity: 0.4,
  scale: { x: 1.01, y: 1, z: 0.97 } as const,
} as const;

export const MYO_GLASS = {
  color: "#ffffff",
  attenuationColor: "#ffffff",
  attenuationDistance: 5,
  thickness: 2.2,
  ior: 1.5,
  roughness: 0,
  metalness: 0,
  chromaticAberration: 0.02,
  anisotropicBlur: 0.08,
  samples: 12,
  resolution: 1024,
  backside: true,
} as const;

export const MYO_ENVIRONMENT = {
  preset: "sunset" as const,
  intensity: 0.35,
  blur: 0,
  rotationX: 0,
  rotationY: -2.75,
  rotationZ: 0,
};

export const MYO_LIGHTING = {
  ambient: { intensity: 0.5, color: "#ffffff" },
  key: { intensity: 2.1, color: "#ffffff", position: [4, 8, 3] as const },
  fill: { intensity: 3.2, color: "#e8eef8", position: [-5, 4, -2] as const },
  front: { intensity: 1.15, color: "#ffffff", position: [0, 3, 7] as const },
  point: { intensity: 0.6, color: "#fff4e0", position: [0, -0.6, 2] as const },
} as const;
