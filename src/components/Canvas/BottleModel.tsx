import { observer } from "mobx-react-lite";
import { Inner } from "./Inner";
import { Cap } from "./Cap";
import { BottleSticker } from "./BottleSticker";
import { ClientBottleGltf } from "./ClientBottleGltf";
import { useBottleModel } from "../../hooks/useBottleModel";
import { useStores } from "../../hooks/useStores";

/**
 * Renders whatever Design3DManager currently has loaded. Scale-based grow-in
 * doubles as the "new model fades in" requirement from the PRD — a true
 * opacity fade reads poorly on transmissive glass materials, so we animate
 * scale with an ease-out curve instead, plus a slow idle rotation so the
 * bottle reads as three-dimensional even before the user touches the camera.
 */
export const BottleModel = observer(function BottleModel() {
  const { designManager } = useStores();
  const { groupRef, loadedObject, meshes, innerTwoVariant, innerOneVariant, labelPolygonOffset } =
    useBottleModel();

  const selectedBottle =
    designManager.productManager.bottle2DManager.getSelectedBottle();

  // Client Porto GLB: direct useGLTF, materials left as authored.
  if (selectedBottle?.id === "wine-glass-5") {
    return (
      <group ref={groupRef} dispose={null}>
        <ClientBottleGltf glbPath={selectedBottle.glbPath} />
      </group>
    );
  }

  if (!loadedObject) return null;

  return (
    <group ref={groupRef} dispose={null}>
      <group
        position={loadedObject.position}
        rotation={loadedObject.rotation}
        scale={loadedObject.scale}
      >
        <Inner meshes={meshes.innerOne} innerOneVariant={innerOneVariant} />
        <Cap meshes={meshes.innerTwo} innerTwoVariant={innerTwoVariant} />
        <BottleSticker
          meshes={meshes.outer}
          polygonOffsetFactor={labelPolygonOffset}
          innerOneVariant={innerOneVariant}
        />
      </group>
    </group>
  );
});
