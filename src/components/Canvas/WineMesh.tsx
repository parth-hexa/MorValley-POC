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
  const { scaleX, scaleY, scaleZ, color, attenuationColor } = useControls("Wine Liquid Controls", {
    scaleX: { value: MYO_LIQUID.scale.x, min: 0.5, max: 2.0, step: 0.001, label: "Scale X" },
    scaleY: { value: MYO_LIQUID.scale.y, min: 0.5, max: 2.0, step: 0.001, label: "Scale Y" },
    scaleZ: { value: MYO_LIQUID.scale.z, min: 0.5, max: 2.0, step: 0.001, label: "Scale Z" },
    color: { value: MYO_LIQUID.color, label: "Color" },
    attenuationColor: { value: MYO_LIQUID.attenuationColor, label: "Attenuation Color" },
  });

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

  useEffect(() => {
    wineMaterial.color.set(color);
    wineMaterial.attenuationColor.set(attenuationColor);
  }, [wineMaterial, color, attenuationColor]);

  useEffect(() => {
    meshes.forEach((mesh) => {
      if (!mesh) return;

      if (innerOneVariant === "transparent") {
        mesh.renderOrder = 2;
        mesh.scale.set(scaleX, scaleY, scaleZ);
        mesh.material = wineMaterial;
        mesh.visible = true;
      }
    });
  }, [meshes, innerOneVariant, wineMaterial, scaleX, scaleY, scaleZ]);

  if (meshes.length === 0) return null;

  return (
    <>
      {meshes.map((mesh, i) => (
        <primitive key={`wine-${i}`} object={mesh} />
      ))}
    </>
  );
}
