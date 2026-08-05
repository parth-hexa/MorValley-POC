/**
 * Baked Myo 10/20 Anos render settings.
 * Only applied when innerOneVariant === "transparent".
 */

export const MYO_ENV_FILE = "/env/buikslotermeerplein_2k.hdr";

export const MYO_LIQUID = {
  color: "#ffcf96",
  attenuationColor: "#5c1608",
  attenuationDistance: 1.3,
  opacity: 1.0,
  ior: 1.33,
  bounces: 3,
  fresnel: 0.5,
  aberrationStrength: 0.006,
  fastChroma: false,
  normalSmoothing: 1.0,
  correctMips: false,
  blurScale: 1.35,
  envIntensity: 1.0,
  envCubeSize: 1024,
  weldNormals: false,
  scale: { x: 1, y: 1, z: 1 } as const,
} as const;

export const MYO_GLASS = {
  backside: true,
  samples: 16,
  resolution: 2048,
  thickness: 0.95,
  ior: 1.52,
  reflectivity: 0.5,
  chromaticAberration: 0.02,
  anisotropicBlur: 0.08,
  transmission: 1,
  clearcoat: 1.0,
  clearcoatRoughness: 0.02,
  envMapIntensity: 1,
  color: "#ffffff",
  attenuationColor: "#cad6c3",
  attenuationDistance: 1.8,
  roughness: 0.02,
  metalness: 0,
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

export const MYO_RENDER = {
  dpr: [1.5, 2.5] as [number, number],
} as const;
