/**
 * Baked Myo 10/20 Anos render settings.
 * Only applied when innerOneVariant === "transparent".
 */

export const MYO_LIQUID = {
  color: "#9b4b1a",
  attenuationColor: "#4d1502",
  opacity: 1.0,
  transmission: 0.28,
  attenuationDistance: 0.22,
  thickness: 12.0,
  ior: 1.33,
  roughness: 0.05,
  envMapIntensity: 0.8,
  scale: { x: 1, y: 1, z: 1 } as const,
} as const;

export const MYO_GLASS = {
  color: "#ffffff",
  attenuationColor: "#cad6c3",
  attenuationDistance: 1.8,
  thickness: 0.95,
  ior: 1.52,
  reflectivity: 0.5,
  roughness: 0.02,
  metalness: 0,
  chromaticAberration: 0.02,
  anisotropicBlur: 0.08,
  samples: 16,
  resolution: 1024,
  backside: true,
} as const;

export const MYO_ENVIRONMENT = {
  preset: "studio" as const,
  intensity: 0.8,
  blur: 0,
  rotationX: -1.57,
  rotationY: -2.75,
  rotationZ: -0.99,
  bgColor: "#cacecc",
};

export const MYO_LIGHTING = {
  ambient: { intensity: 0.5, color: "#ffffff" },
  key: { intensity: 2.1, color: "#ffffff", position: [4, 8, 3] as const },
  fill: { intensity: 3.2, color: "#e8eef8", position: [-5, 4, -2] as const },
  front: { intensity: 1.15, color: "#ffffff", position: [0, 3, 7] as const },
  point: { intensity: 0.6, color: "#fff4e0", position: [0, -0.6, 2] as const },
} as const;
