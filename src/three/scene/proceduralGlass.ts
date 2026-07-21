import * as THREE from "three";
import { createGlassMaterial, createBaseMaterial } from "../materials/glassMaterial";
import type { GlassType } from "../../state/types";

/**
 * Profile points describe the lathe cross-section, from the base of the foot
 * (y = 0) up to the rim (highest y), all in "glass-space" units.
 * [radius, y]
 */
type Profile = [number, number][];

const PROFILES: Record<GlassType, Profile> = {
  classic: [
    [0.55, 0],
    [0.55, 0.03],
    [0.08, 0.08],
    [0.06, 0.55],
    [0.06, 0.6],
    [0.5, 0.95],
    [0.62, 1.3],
    [0.6, 1.75],
    [0.42, 2.05],
    [0.44, 2.08],
  ],
  bordeaux: [
    [0.6, 0],
    [0.6, 0.03],
    [0.08, 0.08],
    [0.07, 0.62],
    [0.07, 0.66],
    [0.58, 1.05],
    [0.72, 1.5],
    [0.68, 2.05],
    [0.46, 2.4],
    [0.48, 2.43],
  ],
  burgundy: [
    [0.62, 0],
    [0.62, 0.03],
    [0.09, 0.08],
    [0.07, 0.5],
    [0.07, 0.54],
    [0.68, 0.95],
    [0.86, 1.4],
    [0.78, 1.85],
    [0.48, 2.1],
    [0.5, 2.13],
  ],
  champagne: [
    [0.5, 0],
    [0.5, 0.03],
    [0.07, 0.08],
    [0.06, 0.9],
    [0.06, 0.94],
    [0.3, 1.3],
    [0.34, 2.1],
    [0.33, 2.7],
    [0.3, 2.95],
    [0.31, 2.97],
  ],
  stemless: [
    [0.42, 0],
    [0.5, 0.1],
    [0.56, 0.4],
    [0.58, 0.85],
    [0.5, 1.35],
    [0.42, 1.55],
    [0.43, 1.58],
  ],
};

/**
 * Builds a stand-in wine glass mesh for a given type using THREE.LatheGeometry.
 * This exists so the viewer is fully functional without real .glb assets in
 * public/models — the loader (see three/loaders/modelLoader.ts) falls back
 * to this when the real asset can't be fetched. Swapping in real GLBs later
 * requires no changes to consuming components.
 */
export function generateProceduralGlass(type: GlassType): THREE.Group {
  const profile = PROFILES[type];
  const points = profile.map(([r, y]) => new THREE.Vector2(r * 0.6, y * 0.6));

  const geometry = new THREE.LatheGeometry(points, 64);
  geometry.computeVertexNormals();

  const glass = new THREE.Mesh(geometry, createGlassMaterial());
  glass.castShadow = false;
  glass.receiveShadow = false;
  glass.name = `glass-${type}`;

  const group = new THREE.Group();
  group.name = `wine-glass-${type}`;
  group.add(glass);

  // Small foot disc for the stemmed variants to ground the silhouette visually.
  if (type !== "stemless") {
    const footGeometry = new THREE.CylinderGeometry(0.02, 0.02, 0.02, 32);
    const foot = new THREE.Mesh(footGeometry, createBaseMaterial());
    foot.visible = false; // reserved: kept out of view, avoids a harsh flat disc reflection
    group.add(foot);
  }

  group.position.y = -1;
  return group;
}
