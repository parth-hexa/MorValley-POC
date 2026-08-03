import { useEffect, useMemo } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { createWaxMaterial } from "../../three/materials/bottleMaterial";
import { COPPER_CAP, VAX_COP_CAP, WAX_CAP } from "../../config/capMaterials";

export interface MeshComponentProps {
  meshes: THREE.Mesh[];
  innerTwoVariant?: "copper" | "wax" | "vaxCop" | "default";
}

export function Cap({
  meshes,
  innerTwoVariant = "default",
}: MeshComponentProps) {
  const { gl } = useThree();
  const waxMaterial = useMemo(() => createWaxMaterial(), []);

  useEffect(() => {
    meshes.forEach((mesh) => {
      if (!mesh.material) return;

      let targetMaterial = mesh.material as THREE.MeshStandardMaterial;

      if (targetMaterial.map) {
        targetMaterial.map.anisotropy = gl.capabilities.getMaxAnisotropy();
        targetMaterial.map.needsUpdate = true;
      }
      if (targetMaterial.normalMap) {
        targetMaterial.normalMap.anisotropy = gl.capabilities.getMaxAnisotropy();
        targetMaterial.normalScale.set(WAX_CAP.normalScale, WAX_CAP.normalScale);
        targetMaterial.normalMap.needsUpdate = true;
      }

      if (innerTwoVariant === "default") {
        mesh.renderOrder = 2;
        targetMaterial.roughness = 0.5;
        return;
      }

      if (innerTwoVariant === "wax") {
        waxMaterial.color.set(WAX_CAP.color);
        waxMaterial.metalness = 0;
        waxMaterial.roughness = 0.35;
        waxMaterial.thickness = 2;
        waxMaterial.needsUpdate = true;

        if (targetMaterial.map) {
          waxMaterial.map = targetMaterial.map;
          waxMaterial.map.anisotropy = gl.capabilities.getMaxAnisotropy();
        }

        if (targetMaterial.normalMap) {
          waxMaterial.normalMap = targetMaterial.normalMap;
          waxMaterial.normalMap.anisotropy = gl.capabilities.getMaxAnisotropy();
          waxMaterial.normalScale.set(WAX_CAP.normalScale, WAX_CAP.normalScale);
        }

        mesh.material = waxMaterial;
        return;
      }

      if (innerTwoVariant === "vaxCop") {
        if (!(targetMaterial as any).isCustomVaxCop) {
          targetMaterial = targetMaterial.clone();
          (targetMaterial as any).isCustomVaxCop = true;
          mesh.material = targetMaterial;
        }
        targetMaterial.color.set(VAX_COP_CAP.color);
        targetMaterial.needsUpdate = true;
        return;
      }

      // innerTwoVariant === "copper"
      if (!(targetMaterial as any).isCustomCopper) {
        targetMaterial = targetMaterial.clone();
        (targetMaterial as any).isCustomCopper = true;

        if (targetMaterial.map) {
          targetMaterial.map.anisotropy = gl.capabilities.getMaxAnisotropy();
          targetMaterial.map.needsUpdate = true;
        }

        if (targetMaterial.normalMap) {
          targetMaterial.normalMap.anisotropy =
            gl.capabilities.getMaxAnisotropy();
          targetMaterial.normalScale.set(
            COPPER_CAP.normalScale,
            COPPER_CAP.normalScale,
          );
          targetMaterial.normalMap.needsUpdate = true;
        }
        mesh.material = targetMaterial;
      }

      targetMaterial.color.set(COPPER_CAP.color);
      targetMaterial.metalness = COPPER_CAP.metalness;
      targetMaterial.roughness = COPPER_CAP.roughness;
      targetMaterial.envMapIntensity = COPPER_CAP.envMapIntensity;
      if (targetMaterial.normalMap) {
        targetMaterial.normalScale.set(
          COPPER_CAP.normalScale,
          COPPER_CAP.normalScale,
        );
      }
      targetMaterial.needsUpdate = true;
    });
  }, [meshes, gl, innerTwoVariant, waxMaterial]);

  if (meshes.length === 0) return null;
  return (
    <>
      {meshes.map((mesh, index) => (
        <primitive key={`innerTwo-${index}`} object={mesh} />
      ))}
    </>
  );
}
