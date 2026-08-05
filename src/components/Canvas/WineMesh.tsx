import { useEffect, useMemo } from "react";
import * as THREE from "three";
import { useControls } from "leva";
import { MYO_LIQUID } from "../../config/myoRenderConfig";
import type { MeshComponentProps } from "../../types/canvas";

/**
 * Liquid mesh for Myo clear-glass bottles (innerOneVariant === "transparent").
 * Settings are baked for Myo 10/20.
 */
export function WineMesh({ meshes, innerOneVariant = "black" }: MeshComponentProps) {
  const wineMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(MYO_LIQUID.color),
        attenuationColor: new THREE.Color(MYO_LIQUID.attenuationColor),
        attenuationDistance: MYO_LIQUID.attenuationDistance,
        transmission: MYO_LIQUID.transmission,
        opacity: MYO_LIQUID.opacity,
        transparent: true,
        depthWrite: false,
        metalness: 0,
        roughness: MYO_LIQUID.roughness,
        ior: MYO_LIQUID.ior,
        thickness: MYO_LIQUID.thickness,
        envMapIntensity: MYO_LIQUID.envMapIntensity,
        specularIntensity: 0.6,
        side: THREE.DoubleSide,
      }),
    []
  );

  const liquidProps = useControls(
    "MYO Liquid Material",
    {
      color: { value: MYO_LIQUID.color, label: "Color" },
      attenuationColor: { value: MYO_LIQUID.attenuationColor, label: "Attenuation Color" },
      opacity: { value: MYO_LIQUID.opacity, min: 0, max: 1, step: 0.01, label: "Opacity" },
      transmission: { value: MYO_LIQUID.transmission, min: 0, max: 1, step: 0.01, label: "Transmission" },
      attenuationDistance: { value: MYO_LIQUID.attenuationDistance, min: 0.01, max: 5, step: 0.05, label: "Attenuation Dist" },
      thickness: { value: MYO_LIQUID.thickness, min: 0, max: 10, step: 0.1, label: "Thickness" },
      ior: { value: MYO_LIQUID.ior, min: 1, max: 2.5, step: 0.01, label: "IOR" },
      roughness: { value: MYO_LIQUID.roughness, min: 0, max: 1, step: 0.01, label: "Roughness" },
      envMapIntensity: { value: MYO_LIQUID.envMapIntensity, min: 0, max: 2, step: 0.05, label: "EnvMap Intensity" },
      scaleX: {
        value: MYO_LIQUID.scale.x,
        min: 0.5,
        max: 1.5,
        step: 0.001,
        label: "Scale X",
      },
      scaleY: {
        value: MYO_LIQUID.scale.y,
        min: 0.5,
        max: 1.5,
        step: 0.001,
        label: "Scale Y",
      },
      scaleZ: {
        value: MYO_LIQUID.scale.z,
        min: 0.5,
        max: 1.5,
        step: 0.001,
        label: "Scale Z",
      },
    },
    { collapsed: false }
  );

  useEffect(() => {
    wineMaterial.color.set(liquidProps.color);
    wineMaterial.attenuationColor.set(liquidProps.attenuationColor);
    wineMaterial.opacity = liquidProps.opacity;
    wineMaterial.transmission = liquidProps.transmission;
    wineMaterial.attenuationDistance = liquidProps.attenuationDistance;
    wineMaterial.thickness = liquidProps.thickness;
    wineMaterial.ior = liquidProps.ior;
    wineMaterial.roughness = liquidProps.roughness;
    wineMaterial.envMapIntensity = liquidProps.envMapIntensity;
    wineMaterial.needsUpdate = true;

    meshes.forEach((mesh) => {
      if (!mesh) return;

      if (innerOneVariant === "transparent") {
        mesh.renderOrder = 2;
        mesh.scale.set(liquidProps.scaleX, liquidProps.scaleY, liquidProps.scaleZ);
        mesh.material = wineMaterial;
        mesh.visible = true;
      }
    });
  }, [meshes, innerOneVariant, wineMaterial, liquidProps]);

  if (meshes.length === 0) return null;

  return (
    <>
      {meshes.map((mesh, i) => (
        <primitive key={`wine-${i}`} object={mesh} />
      ))}
    </>
  );
}
