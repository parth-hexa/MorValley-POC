import { useEffect, useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { observer } from "mobx-react-lite";
import * as THREE from "three";
import { useStores } from "../../hooks/useStores";
import { createBottleMaterial } from "../../three/materials/bottleMaterial";

interface MeshComponentProps {
  mesh: THREE.Mesh | null;
}

export function InnerOne({ mesh }: MeshComponentProps) {
  const bottleMaterial = useMemo(() => createBottleMaterial(), []);

  useEffect(() => {
    if (mesh) {
      mesh.material = bottleMaterial;
    }
  }, [mesh, bottleMaterial]);

  if (!mesh) return null;
  return <primitive object={mesh} />;
}

export function InnerTwo({ mesh }: MeshComponentProps) {
  if (!mesh) return null;
  return <primitive object={mesh} />;
}

export function Outer({ mesh }: MeshComponentProps) {
  if (!mesh) return null;
  return <primitive object={mesh} />;
}

/**
 * Renders whatever Design3DManager currently has loaded. Scale-based grow-in
 * doubles as the "new model fades in" requirement from the PRD — a true
 * opacity fade reads poorly on transmissive glass materials, so we animate 
 * scale with an ease-out curve instead, plus a slow idle rotation so the
 * bottle reads as three-dimensional even before the user touches the camera.
 */
export const BottleModel = observer(function BottleModel() {
  const { design3DManager } = useStores();
  const groupRef = useRef<THREE.Group>(null);
  const progressRef = useRef(0);
  const idleRotationRef = useRef(0);

  useEffect(() => {
    progressRef.current = 0;
  }, [design3DManager.loadedObject]);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
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

    if (!design3DManager.loadedObject) return result;

    // Clone the loaded object so we don't mutate the cached source template
    const clonedRoot = design3DManager.loadedObject.clone(true);

    clonedRoot.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        const name = mesh.name;

        // Compute accumulated matrix relative to clonedRoot (excluding clonedRoot's own transform)
        const accumulatedMatrix = new THREE.Matrix4();
        let curr: THREE.Object3D | null = mesh;
        while (curr && curr !== clonedRoot) {
          accumulatedMatrix.premultiply(curr.matrix);
          curr = curr.parent;
        }

        // Apply accumulated transformations to the mesh
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
  }, [design3DManager.loadedObject]);

  if (!design3DManager.loadedObject) return null;

  return (
    <group ref={groupRef}>
      <group
        position={design3DManager.loadedObject.position}
        rotation={design3DManager.loadedObject.rotation}
        scale={design3DManager.loadedObject.scale}
      >
        <InnerOne mesh={meshes.innerOne} />
        <InnerTwo mesh={meshes.innerTwo} />
        <Outer mesh={meshes.outer} />
      </group>
    </group>
  );
});
