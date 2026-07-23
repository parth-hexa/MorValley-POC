import { useEffect, useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useStores } from "./useStores";
import { useBottleLoader } from "./useBottleLoader";

export function useBottleModel() {
  const { design3DManager } = useStores();
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
      innerOne: null as THREE.Mesh | null,
      innerTwo: null as THREE.Mesh | null,
      outer: null as THREE.Mesh | null,
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

        if (
          name.includes("Rogador_Reserva_Red_750_ML_1") ||
          name.includes("cap") ||
          name.includes("top_mtr") ||
          name.includes("seal_mtr")
        ) {
          result.innerTwo = mesh;
        } else if (
          name.includes("Rogador_Reserva_Red_750_ML") ||
          name.includes("inner")
        ) {
          result.innerOne = mesh;
        } else if (
          name.toLowerCase().includes("outer") ||
          name.toLowerCase().includes("glass")
        ) {
          result.outer = mesh;
        }
      }
    });

    return result;
  }, [loadedObject]);

  return {
    groupRef,
    loadedObject,
    meshes
  };
}
