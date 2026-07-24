export const COPPER_MATERIAL_CONFIG = {
  color: "#c35a10",
  envMapIntensity: { max: 10, min: 0, value: 2.0 },
  metalness: { max: 1, min: 0, value: 0.85 },
  normalScale: {
    label: "Normal Bump Strength",
    max: 10,
    min: 0,
    step: 0.1,
    value: 2.5,
  },
  roughness: { max: 1, min: 0, value: 0.68 },
};

export const DEFAULT_CAP_CONFIG = {
  defaultColor: { value: "#ffffff", label: "color" },
  normalScale: {
    value: 2.5,
    min: 0,
    max: 10,
    step: 0.1,
    label: "Normal Bump Strength",
  },
};

export const CLEAR_GLASS_CONFIG = {
  color: "#ffbca4",
  attenuationColor: "#9d705a", // Amber/Red port wine color
  attenuationDistance: { value: 0.1, min: 0.1, max: 10, step: 0.1 },
  thickness: { value: 0.5, min: 0, max: 10, step: 0.1 },
  ior: { value: 1.5, min: 1, max: 2.3, step: 0.01 },
  roughness: { value: 0.05, min: 0, max: 1, step: 0.01 },
  chromaticAberration: { value: 0.02, min: 0, max: 1, step: 0.01 },
  backside: true,
};
