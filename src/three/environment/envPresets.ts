/** Preset names supported by @react-three/drei's <Environment preset="..."/>. */
export type EnvironmentPreset =
  | "apartment"
  | "city"
  | "dawn"
  | "forest"
  | "lobby"
  | "night"
  | "park"
  | "studio"
  | "sunset"
  | "warehouse";

/** "apartment" gives soft, warm reflections that read well on clear glass. */
export const DEFAULT_ENVIRONMENT_PRESET: EnvironmentPreset = "dawn";
