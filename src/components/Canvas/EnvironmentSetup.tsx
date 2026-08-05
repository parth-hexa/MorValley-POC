import { Environment } from "@react-three/drei";
import { useControls, button } from "leva";
import { observer } from "mobx-react-lite";
import { useStores } from "../../hooks/useStores";
import { MYO_ENVIRONMENT, MYO_LIQUID, MYO_GLASS } from "../../config/myoRenderConfig";
import { Bottle } from "../../state/Bottle";

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
      bgColor: {
        value: MYO_ENVIRONMENT.bgColor || "#cacecc",
        label: "Background Color",
        onChange: (c: string) => {
          const bgElem = document.querySelector(".scene-bg") as HTMLElement;
          if (bgElem) {
            bgElem.style.background = c;
          }
        },
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
      "Upload Custom GLB": button(() => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = ".glb,.gltf";
        input.onchange = (e: Event) => {
          const target = e.target as HTMLInputElement;
          if (target.files && target.files[0]) {
            const file = target.files[0];
            const blobUrl = URL.createObjectURL(file);
            const bottleId = `custom-gltf-${Date.now()}`;
            const customBottle = new Bottle(
              bottleId,
              `Uploaded: ${file.name.replace(/\.[^/.]+$/, "")}`,
              blobUrl,
              "Custom GLB",
              "default",
              "transparent",
              "radial-gradient(74.98% 200.05% at 49.96% 55.42%, #153A28 0%, #215A3E 3.53%, #215A3E 35.8%, #153A28 84.05%)",
              -16
            );

            // Register virtually into productManager catalog
            const bottleManager = designManager.productManager.bottle2DManager;
            bottleManager.addBottle(customBottle);
            bottleManager.setSelectedBottleId(bottleId);
          }
        };
        input.click();
      }),
      "Download Config JSON": button((get) => {
        const configData = {
          MYO_LIQUID: {
            color: get("MYO Liquid Material.Color"),
            attenuationColor: get("MYO Liquid Material.Attenuation Color"),
            opacity: get("MYO Liquid Material.Opacity"),
            transmission: get("MYO Liquid Material.Transmission"),
            attenuationDistance: get("MYO Liquid Material.Attenuation Dist"),
            thickness: get("MYO Liquid Material.Thickness"),
            ior: get("MYO Liquid Material.IOR"),
            roughness: get("MYO Liquid Material.Roughness"),
            envMapIntensity: get("MYO Liquid Material.EnvMap Intensity"),
            scale: {
              x: get("MYO Liquid Material.Scale X"),
              y: get("MYO Liquid Material.Scale Y"),
              z: get("MYO Liquid Material.Scale Z"),
            },
          },
          MYO_GLASS: {
            backside: get("MYO Glass Transmission.Backside"),
            samples: get("MYO Glass Transmission.Samples"),
            resolution: get("MYO Glass Transmission.Resolution"),
            thickness: get("MYO Glass Transmission.Thickness"),
            ior: get("MYO Glass Transmission.IOR"),
            reflectivity: get("MYO Glass Transmission.Reflectivity"),
            chromaticAberration: get("MYO Glass Transmission.Chromatic Aberration"),
            anisotropicBlur: get("MYO Glass Transmission.Anisotropic Blur"),
            transmission: get("MYO Glass Transmission.Transmission"),
            clearcoat: get("MYO Glass Transmission.Clearcoat"),
            clearcoatRoughness: get("MYO Glass Transmission.Clearcoat Roughness"),
            envMapIntensity: get("MYO Glass Transmission.EnvMap Intensity"),
            color: get("MYO Glass Transmission.Color"),
            attenuationColor: get("MYO Glass Transmission.Attenuation Color"),
            attenuationDistance: get("MYO Glass Transmission.Attenuation Distance"),
            roughness: get("MYO Glass Transmission.Roughness"),
            metalness: get("MYO Glass Transmission.Metalness"),
          },
          MYO_ENVIRONMENT: {
            preset: get("Environment Controls.Myo Env Preset"),
            intensity: get("Environment Controls.Myo Env Intensity"),
            blur: get("Environment Controls.Myo Env Blur"),
            rotationX: get("Environment Controls.Rotation X"),
            rotationY: get("Environment Controls.Rotation Y"),
            rotationZ: get("Environment Controls.Rotation Z"),
            bgColor: get("Environment Controls.Background Color"),
          },
        };
        const blob = new Blob([JSON.stringify(configData, null, 2)], {
          type: "application/json",
        });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "myoRenderConfig.json";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }),
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
