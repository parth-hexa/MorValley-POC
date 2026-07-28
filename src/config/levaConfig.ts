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

export const VAX_COP_MATERIAL_CONFIG = {
  color: { value: "#ff7c3b", label: "Color" },
};

export const CLEAR_GLASS_CONFIG = {
  color: { value: "#ffffff", label: "Glass Color" },
  attenuationColor: { value: "#ffffff", label: "Attenuation Color" },
  attenuationDistance: {
    value: 1.0,
    min: 0.1,
    max: 10,
    step: 0.1,
    label: "Attenuation Distance",
  },
  thickness: {
    value: 0.35,
    min: 0,
    max: 5,
    step: 0.05,
    label: "Glass Wall Thickness",
  },
  ior: { value: 1.52, min: 1, max: 2.3, step: 0.01, label: "IOR" },
  roughness: { value: 0.02, min: 0, max: 1, step: 0.01, label: "Roughness" },
  chromaticAberration: {
    value: 0.04,
    min: 0,
    max: 1,
    step: 0.01,
    label: "Chromatic Aberration",
  },
  backside: true,
};

export const LIQUID_MATERIAL_CONFIG = {
  color: { value: "#ffa800", label: "Liquid Base Color" },
  attenuationColor: { value: "#c23c02", label: "Absorption Color (Edges)" },
  attenuationDistance: {
    value: 0.6,
    min: 0.05,
    max: 5,
    step: 0.05,
    label: "Absorption Distance",
  },
  transmission: {
    value: 0.85,
    min: 0,
    max: 1,
    step: 0.01,
    label: "Transmission",
  },
  thickness: {
    value: 1.2,
    min: 0,
    max: 10,
    step: 0.1,
    label: "Volume Thickness",
  },
  ior: { value: 1.333, min: 1, max: 2, step: 0.01, label: "Liquid IOR" },
  roughness: { value: 0.37, min: 0, max: 1, step: 0.01, label: "Roughness" },
  reflectivity: {
    value: 0.11,
    min: 0,
    max: 1,
    step: 0.01,
    label: "Reflectivity",
  },
  envMapIntensity: {
    value: 1.8,
    min: 0,
    max: 10,
    step: 0.1,
    label: "Env Intensity",
  },
};

export const VOLUMETRIC_WINE_SHADER_CONFIG = {
  lightColor: { value: "#b77a00", label: "Light Tone (Bottom & Edge)" },
  darkColor: { value: "#c23c02", label: "Dark Tone (Center & Top)" },
  transmission: { value: 0.85, min: 0.0, max: 1.0, step: 0.01, label: "Transmission" },
  attenuationDistance: { value: 2.5, min: 0.1, max: 10.0, step: 0.1, label: "Absorption Distance" },
  thickness: { value: 1.5, min: 0.0, max: 10.0, step: 0.1, label: "Volume Thickness" },
  bottomLightness: { value: 0.5, min: 0.0, max: 1.0, step: 0.05, label: "Bottom Lightness Boost" },
  ior: { value: 1.333, min: 1.0, max: 2.0, step: 0.01, label: "Liquid IOR" },
  roughness: { value: 0.12, min: 0.0, max: 1.0, step: 0.01, label: "Roughness" },
  envMapIntensity: { value: 2.2, min: 0.0, max: 10.0, step: 0.1, label: "Env Intensity" },
};

