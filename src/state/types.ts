export type BottleType = string;

export interface BottleModelConfig {
  id: BottleType;
  name: string;
  glbPath: string;
  note: string;
  innerTwoVariant?: "copper" | "wax" | "default";
  innerOneVariant?: "black" | "transparent" | "default";
  backgroundGradient?: string;
}
