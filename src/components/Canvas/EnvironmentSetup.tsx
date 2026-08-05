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
        const liquidColor = get("MYO Liquid Material.Color");
        const configData = {
          MYO_LIQUID: {
            color: liquidColor ?? MYO_LIQUID.color,
            attenuationColor: get("MYO Liquid Material.Attenuation Color") ?? MYO_LIQUID.attenuationColor,
            opacity: get("MYO Liquid Material.Opacity") ?? MYO_LIQUID.opacity,
            transmission: get("MYO Liquid Material.Transmission") ?? MYO_LIQUID.transmission,
            attenuationDistance: get("MYO Liquid Material.Attenuation Dist") ?? MYO_LIQUID.attenuationDistance,
            thickness: get("MYO Liquid Material.Thickness") ?? MYO_LIQUID.thickness,
            ior: get("MYO Liquid Material.IOR") ?? MYO_LIQUID.ior,
            roughness: get("MYO Liquid Material.Roughness") ?? MYO_LIQUID.roughness,
            envMapIntensity: get("MYO Liquid Material.EnvMap Intensity") ?? MYO_LIQUID.envMapIntensity,
            scale: {
              x: get("MYO Liquid Material.Scale X") ?? MYO_LIQUID.scale.x,
              y: get("MYO Liquid Material.Scale Y") ?? MYO_LIQUID.scale.y,
              z: get("MYO Liquid Material.Scale Z") ?? MYO_LIQUID.scale.z,
            },
          },
          MYO_GLASS: {
            backside: get("MYO Glass Transmission.Backside") ?? MYO_GLASS.backside,
            samples: get("MYO Glass Transmission.Samples") ?? MYO_GLASS.samples,
            resolution: get("MYO Glass Transmission.Resolution") ?? MYO_GLASS.resolution,
            thickness: get("MYO Glass Transmission.Thickness") ?? MYO_GLASS.thickness,
            ior: get("MYO Glass Transmission.IOR") ?? MYO_GLASS.ior,
            reflectivity: get("MYO Glass Transmission.Reflectivity") ?? MYO_GLASS.reflectivity,
            chromaticAberration: get("MYO Glass Transmission.Chromatic Aberration") ?? MYO_GLASS.chromaticAberration,
            anisotropicBlur: get("MYO Glass Transmission.Anisotropic Blur") ?? MYO_GLASS.anisotropicBlur,
            transmission: get("MYO Glass Transmission.Transmission") ?? 1,
            clearcoat: get("MYO Glass Transmission.Clearcoat") ?? 1.0,
            clearcoatRoughness: get("MYO Glass Transmission.Clearcoat Roughness") ?? 0.02,
            envMapIntensity: get("MYO Glass Transmission.EnvMap Intensity") ?? 1,
            color: get("MYO Glass Transmission.Color") ?? MYO_GLASS.color,
            attenuationColor: get("MYO Glass Transmission.Attenuation Color") ?? MYO_GLASS.attenuationColor,
            attenuationDistance: get("MYO Glass Transmission.Attenuation Distance") ?? MYO_GLASS.attenuationDistance,
            roughness: get("MYO Glass Transmission.Roughness") ?? MYO_GLASS.roughness,
            metalness: get("MYO Glass Transmission.Metalness") ?? MYO_GLASS.metalness,
          },
          MYO_ENVIRONMENT: {
            preset: get("Environment Controls.Myo Env Preset") ?? MYO_ENVIRONMENT.preset,
            intensity: get("Environment Controls.Myo Env Intensity") ?? MYO_ENVIRONMENT.intensity,
            blur: get("Environment Controls.Myo Env Blur") ?? MYO_ENVIRONMENT.blur,
            rotationX: get("Environment Controls.Rotation X") ?? MYO_ENVIRONMENT.rotationX,
            rotationY: get("Environment Controls.Rotation Y") ?? MYO_ENVIRONMENT.rotationY,
            rotationZ: get("Environment Controls.Rotation Z") ?? MYO_ENVIRONMENT.rotationZ,
            bgColor: get("Environment Controls.Background Color") ?? MYO_ENVIRONMENT.bgColor,
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
        files="/env/buikslotermeerplein_2k.hdr"
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
