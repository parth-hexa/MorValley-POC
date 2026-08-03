import { observer } from "mobx-react-lite";
import { useStores } from "../../hooks/useStores";
import { MYO_LIGHTING } from "../../config/myoRenderConfig";

/**
 * Default lighting for Rogador/Magnum. Myo clear-glass bottles use baked
 * studio lighting from MYO_LIGHTING.
 */
export const Lighting = observer(function Lighting() {
  const { designManager } = useStores();
  const selected =
    designManager.productManager.bottle2DManager.getSelectedBottle();
  const isMyo = selected?.innerOneVariant === "transparent";

  if (isMyo) {
    const { ambient, key, fill, front, point } = MYO_LIGHTING;
    return (
      <>
        <ambientLight intensity={ambient.intensity} color={ambient.color} />
        <directionalLight
          position={[...key.position]}
          intensity={key.intensity}
          color={key.color}
        />
        <directionalLight
          position={[...fill.position]}
          intensity={fill.intensity}
          color={fill.color}
        />
        <directionalLight
          position={[...front.position]}
          intensity={front.intensity}
          color={front.color}
        />
        <pointLight
          position={[...point.position]}
          intensity={point.intensity}
          color={point.color}
        />
      </>
    );
  }

  return (
    <>
      <ambientLight intensity={0.6} color="#ffffff" />
      <directionalLight position={[4, 6, 4]} intensity={1.8} color="#fff9f0" />
      <directionalLight position={[-4, 3, -3]} intensity={0.8} color="#e4ebf5" />
      <pointLight position={[0, -1, 3]} intensity={0.4} color="#c8d0bf" />
    </>
  );
});
