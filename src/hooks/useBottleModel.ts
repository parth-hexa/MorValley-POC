import { useEffect, useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useStores } from "./useStores";
import { useBottleLoader } from "./useBottleLoader";
import { MESH_LABELS } from "../config/meshLabels";

export function useBottleModel() {
  const { design3DManager, designManager } = useStores();
  useBottleLoader();

  const groupRef = useRef<THREE.Group>(null);
  const progressRef = useRef(0);
  const idleRotationRef = useRef(0);

  const loadedObject = design3DManager.meshManager.loadedObject;
  const isOverlayVisible = design3DManager.isOverlayVisible;

  useEffect(() => {
    progressRef.current = 0;
  }, [loadedObject]);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    
    if (isOverlayVisible) return;
    
    progressRef.current = Math.min(1, progressRef.current + delta * 1.6);
    const eased = 1 - Math.pow(1 - progressRef.current, 3);

    idleRotationRef.current += delta * 0.12;
    groupRef.current.rotation.y =
      idleRotationRef.current + (1 - eased) * (Math.PI / 2);
  });

  const meshes = useMemo(() => {
    const result = {
      innerOne: [] as THREE.Mesh[],
      innerTwo: [] as THREE.Mesh[],
      outer: [] as THREE.Mesh[],
    };

    if (!loadedObject) return result;

    const clonedRoot = loadedObject.clone(true);

    clonedRoot.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        const name = mesh.name;

        const accumulatedMatrix = new THREE.Matrix4();
        let curr: THREE.Object3D | null = mesh;
        while (curr && curr !== clonedRoot) {
          accumulatedMatrix.premultiply(curr.matrix);
          curr = curr.parent;
        }

        const position = new THREE.Vector3();
        const quaternion = new THREE.Quaternion();
        const scale = new THREE.Vector3();
        accumulatedMatrix.decompose(position, quaternion, scale);

        mesh.position.copy(position);
        mesh.quaternion.copy(quaternion);
        mesh.scale.copy(scale);

        const lowerName = name.toLowerCase();

        if (MESH_LABELS.innerTwo.some(label => lowerName.includes(label))) {
          result.innerTwo.push(mesh);
        } else if (MESH_LABELS.innerOne.some(label => lowerName.includes(label))) {
          result.innerOne.push(mesh);
        } else if (MESH_LABELS.outer.some(label => lowerName.includes(label))) {
          result.outer.push(mesh);
        }
      }
    });

    return result;
  }, [loadedObject]);

  const selectedBottleId = design3DManager.currentModel;
  const selectedBottle = designManager.productManager.bottle2DManager.getBottleById(selectedBottleId || "");
  const innerTwoVariant = selectedBottle?.innerTwoVariant || "default";

  return {
    groupRef,
    loadedObject,
    meshes,
    innerTwoVariant
  };
}
