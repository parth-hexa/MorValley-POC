/**
 * These labels are used to map parts of a 3D GLTF model (by name) 
 * to their respective roles in the application (InnerOne, InnerTwo, Outer).
 * 
 * All strings should be LOWERCASE. The matching is case-insensitive.
 */
export const MESH_LABELS = {
  // InnerTwo represents the cap, seal, cork, or top wrapper.
  innerTwo: [
    "cap",
    "cork",
    "top_mtr",
    "seal_mtr",
    "cap_matr",
    "cork_mtr",
    "mesh.019",
    "mesh.020",
  ],

  // Outer represents exterior labels, printed text, and decals.
  outer: [
    "outer",
    "material.002",
    "material.003",
    "text-mtr",
    "text_mtr",
    "label",
    "decal",
    "rogador reserva red 750 ml.002"
  ],

  // InnerOne represents the liquid or inner glass bottle body.
  innerOne: [
    "inner",
    "glass",
    "material.007",
    "material",
    "rogador reserva red 750 ml"
  ]
};
