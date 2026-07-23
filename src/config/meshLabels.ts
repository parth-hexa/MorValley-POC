/**
 * These labels are used to map parts of a 3D GLTF model (by name) 
 * to their respective roles in the application (InnerOne, InnerTwo, Outer).
 * 
 * All strings should be LOWERCASE. The matching is case-insensitive.
 */
export const MESH_LABELS = {
  // InnerTwo represents the cap, seal, or wrapper.
  innerTwo: [
    "rogador_reserva_red_750_ml_1",
    "cap",
    "top_mtr",
    "seal_mtr",
    "mesh005_1",
    "mesh005_2"
  ],

  // InnerOne represents the liquid or inner glass layer.
  // Note: Since this array is checked AFTER innerTwo, "mesh005" 
  // will safely match the base mesh without stealing "mesh005_1".
  innerOne: [
    "rogador_reserva_red_750_ml",
    "inner",
    "mesh005"
  ],

  // Outer represents the primary exterior glass layer.
  outer: [
    "outer",
    "glass"
  ]
};
