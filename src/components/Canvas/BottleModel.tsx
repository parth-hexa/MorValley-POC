import { observer } from "mobx-react-lite";
import { InnerOne } from "./InnerOne";
import { InnerTwo } from "./InnerTwo";
import { Outer } from "./Outer";
import { useBottleModel } from "../../hooks/useBottleModel";

/**
 * Renders whatever Design3DManager currently has loaded. Scale-based grow-in
 * doubles as the "new model fades in" requirement from the PRD — a true
 * opacity fade reads poorly on transmissive glass materials, so we animate 
 * scale with an ease-out curve instead, plus a slow idle rotation so the
 * bottle reads as three-dimensional even before the user touches the camera.
 */
export const BottleModel = observer(function BottleModel() {
  const { groupRef, loadedObject, meshes } = useBottleModel();

  if (!loadedObject) return null;

  return (
    <group ref={groupRef}>
      <group
        position={loadedObject.position}
        rotation={loadedObject.rotation}
        scale={loadedObject.scale}
      >
        <InnerOne mesh={meshes.innerOne} />
        <InnerTwo mesh={meshes.innerTwo} />
        <Outer mesh={meshes.outer} />
      </group>
    </group>
  );
});
