export type GlassType = "wine-glass-1";

export interface GlassModelConfig {
  id: GlassType;
  name: string;
  glbPath: string;
  note: string;
}

export const GLASS_CATALOG: GlassModelConfig[] = [
  {
    id: "wine-glass-1",
    name: "MorValley Glass",
    glbPath: "/models/Wine_Glass_1.glb",
    note: "Crafted crystal wine glass",
  },
];

export const DEFAULT_GLASS_ID: GlassType = "wine-glass-1";
