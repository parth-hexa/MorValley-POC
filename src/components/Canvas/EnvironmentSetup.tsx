import { Environment } from "@react-three/drei";
import { useControls } from "leva";
import { observer } from "mobx-react-lite";
import { useStores } from "../../hooks/useStores";
import { MYO_ENVIRONMENT } from "../../config/myoRenderConfig";

const DEFAULT_ENV_FILE = "/env/Wine_Bottle_Environment.exr";
const DEFAULT_ENV_INTENSITY = 0.2;

/**
 * Rogador/Magnum keep the custom wine EXR. Myo uses a studio preset;
 * rotation XYZ is tunable via Leva.
 */
export const EnvironmentSetup = observer(function EnvironmentSetup() {
  const { designManager } = useStores();
  const selected =
    designManager.productManager.bottle2DManager.getSelectedBottle();
  const isMyo = selected?.innerOneVariant === "transparent";

  const rotation = useControls(
    "Myo Env Rotation",
    {
      rotationX: {
        value: MYO_ENVIRONMENT.rotationX,
        min: -Math.PI,
        max: Math.PI,
        step: 0.01,
        label: "Rotation X",
      },
      rotationY: {
        value: MYO_ENVIRONMENT.rotationY,
        min: -Math.PI,
        max: Math.PI,
        step: 0.01,
        label: "Rotation Y",
      },
      rotationZ: {
        value: MYO_ENVIRONMENT.rotationZ,
        min: -Math.PI,
        max: Math.PI,
        step: 0.01,
        label: "Rotation Z",
      },
    },
    { collapsed: false },
    [isMyo]
  );

  if (isMyo) {
    return (
      <Environment
        preset={MYO_ENVIRONMENT.preset}
        environmentIntensity={MYO_ENVIRONMENT.intensity}
        blur={MYO_ENVIRONMENT.blur}
        environmentRotation={[
          rotation.rotationX,
          rotation.rotationY,
          rotation.rotationZ,
        ]}
      />
    );
  }

  return (
    <Environment
      files={DEFAULT_ENV_FILE}
      environmentIntensity={DEFAULT_ENV_INTENSITY}
    />
  );
});
