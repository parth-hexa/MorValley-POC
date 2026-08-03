import { Environment } from "@react-three/drei";
import { useControls } from "leva";
import { observer } from "mobx-react-lite";
import { useStores } from "../../hooks/useStores";
import { MYO_ENVIRONMENT } from "../../config/myoRenderConfig";

const DEFAULT_ENV_FILE = "/env/Wine_Bottle_Environment.exr";
const DEFAULT_ENV_INTENSITY = 0.3;

/**
 * Rogador/Magnum keep the custom wine EXR. Myo uses a studio preset;
 * rotation XYZ is tunable via Leva.
 */
export const EnvironmentSetup = observer(function EnvironmentSetup() {
  const { designManager } = useStores();
  const selected =
    designManager.productManager.bottle2DManager.getSelectedBottle();
  const isMyo = selected?.innerOneVariant === "transparent";

  const controls = useControls(
    "Environment Controls",
    {
      defaultEnvIntensity: {
        value: DEFAULT_ENV_INTENSITY,
        min: 0,
        max: 5,
        step: 0.05,
        label: "Default Env Intensity",
      },
      myoIntensity: {
        value: MYO_ENVIRONMENT.intensity,
        min: 0,
        max: 5,
        step: 0.05,
        label: "Myo Env Intensity",
      },
      myoBlur: {
        value: MYO_ENVIRONMENT.blur,
        min: 0,
        max: 1,
        step: 0.01,
        label: "Myo Env Blur",
      },
      myoPreset: {
        value: MYO_ENVIRONMENT.preset,
        options: [
          "sunset",
          "dawn",
          "night",
          "warehouse",
          "forest",
          "apartment",
          "studio",
          "city",
          "park",
          "lobby",
        ],
        label: "Myo Env Preset",
      },
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
        files="/env/ferndale_studio_11_1k.hdr"
        environmentIntensity={controls.myoIntensity}
        blur={controls.myoBlur}
        environmentRotation={[
          controls.rotationX,
          controls.rotationY,
          controls.rotationZ,
        ]}
      />
    );
  }

  return (
    <Environment
      files={DEFAULT_ENV_FILE}
      environmentIntensity={controls.defaultEnvIntensity}
    />
  );
});
