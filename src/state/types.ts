export type GlassType =
  | "classic"
  | "bordeaux"
  | "burgundy"
  | "champagne"
  | "stemless";

export interface GlassModelConfig {
  id: GlassType;
  name: string;
  /** Path the static loader will try first, per the "models are bundled" requirement. */
  glbPath: string;
  /** One-line tasting-note style description shown in the selector. */
  note: string;
}

export const GLASS_CATALOG: GlassModelConfig[] = [
  {
    id: "classic",
    name: "Classic",
    glbPath: "/models/wine-glass-01.glb",
    note: "All-purpose silhouette, balanced bowl",
  },
  {
    id: "bordeaux",
    name: "Bordeaux",
    glbPath: "/models/wine-glass-02.glb",
    note: "Tall bowl for structured reds",
  },
  {
    id: "burgundy",
    name: "Burgundy",
    glbPath: "/models/wine-glass-03.glb",
    note: "Wide bowl to soften aromatics",
  },
  {
    id: "champagne",
    name: "Champagne",
    glbPath: "/models/wine-glass-04.glb",
    note: "Narrow flute, preserves the pour",
  },
  {
    id: "stemless",
    name: "Stemless",
    glbPath: "/models/wine-glass-05.glb",
    note: "No stem, casual pour",
  },
];

export const DEFAULT_GLASS_ID: GlassType = "classic";
