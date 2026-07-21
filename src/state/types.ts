export type GlassType = string;

export interface GlassModelConfig {
  id: GlassType;
  name: string;
  glbPath: string;
  note: string;
}

export const GLASS_CATALOG: GlassModelConfig[] = [
  {
    id: "wine-glass-1",
    name: "Douro Reserva Rogador",
    glbPath: "/models/Wine_Glass_1.glb",
    note: "750ml",
  },
  {
    id: "wine-glass-2",
    name: "Magnum Douro Reserva",
    glbPath: "/models/Wine_Glass_2.glb",
    note: "1500ml",
  },
];

export const DEFAULT_GLASS_ID: GlassType = "wine-glass-1";
