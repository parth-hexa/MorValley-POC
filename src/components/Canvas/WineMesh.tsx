import { useEffect, useMemo } from "react";
import * as THREE from "three";
import { useControls } from "leva";
import { VOLUMETRIC_WINE_SHADER_CONFIG } from "../../config/levaConfig";
import type { MeshComponentProps } from "../../types/canvas";

export function WineMesh({ meshes, innerOneVariant = "black" }: MeshComponentProps) {
  const liquidConfig = useControls("Wine Volume Shader", VOLUMETRIC_WINE_SHADER_CONFIG);

  const wineMaterial = useMemo(() => {
    const mat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#ba9666"),
      transmission: 0.85,
      opacity: 0.88,
      transparent: true,
      depthWrite: true,
      metalness: 0.0,
      roughness: 0.12,
      ior: 1.333,
      thickness: 1.5,
      attenuationColor: new THREE.Color("#b62929"),
      attenuationDistance: 2.5,
      side: THREE.FrontSide,
    });

    const lightColorUniform = { value: new THREE.Color("#ba9666") };
    const darkColorUniform = { value: new THREE.Color("#b62929") };
    const bottomLightnessUniform = { value: 0.5 };

    mat.onBeforeCompile = (shader) => {
      shader.uniforms.uLightColor = lightColorUniform;
      shader.uniforms.uDarkColor = darkColorUniform;
      shader.uniforms.uBottomLightness = bottomLightnessUniform;

      (mat as any).userData.lightColorUniform = lightColorUniform;
      (mat as any).userData.darkColorUniform = darkColorUniform;
      (mat as any).userData.bottomLightnessUniform = bottomLightnessUniform;

      shader.vertexShader = shader.vertexShader.replace(
        `void main() {`,
        /* glsl */ `
          varying vec3 vModelPosition;
          void main() {
            vModelPosition = position;
        `
      );

      shader.fragmentShader = shader.fragmentShader.replace(
        `void main() {`,
        /* glsl */ `
          varying vec3 vModelPosition;
          uniform vec3 uLightColor;
          uniform vec3 uDarkColor;
          uniform float uBottomLightness;
          void main() {
        `
      );

      shader.fragmentShader = shader.fragmentShader.replace(
        `vec4 diffuseColor = vec4( diffuse, opacity );`,
        /* glsl */ `
          vec3 vN = normalize( vNormal );
          vec3 vV = normalize( - vViewPosition );
          
          float yNorm = clamp( ( vModelPosition.y - 1.26 ) / ( 147.19 - 1.26 ), 0.0, 1.0 );
          float centerFactor = clamp( abs( dot( vN, vV ) ), 0.02, 1.0 );
          
          float darkMix = clamp( pow( centerFactor, 0.55 ) * ( 0.35 + yNorm * 0.95 ), 0.0, 1.0 );
          vec3 volumetricColor = mix( uLightColor, uDarkColor, darkMix );

          float edgeGlow = pow( 1.0 - centerFactor, 2.5 );
          float bottomGlow = ( 1.0 - yNorm ) * uBottomLightness;
          volumetricColor += uLightColor * ( edgeGlow * 0.35 + bottomGlow * 0.45 );

          float dynamicOpacity = mix( 0.65, 0.92, darkMix );
          vec4 diffuseColor = vec4( volumetricColor, dynamicOpacity );
        `
      );
    };

    return mat;
  }, []);

  useEffect(() => {
    const lightUniform = (wineMaterial as any).userData.lightColorUniform;
    const darkUniform = (wineMaterial as any).userData.darkColorUniform;
    const bottomLightnessUniform = (wineMaterial as any).userData.bottomLightnessUniform;

    if (lightUniform) lightUniform.value.set(liquidConfig.lightColor);
    if (darkUniform) darkUniform.value.set(liquidConfig.darkColor);
    if (bottomLightnessUniform) bottomLightnessUniform.value = liquidConfig.bottomLightness;

    wineMaterial.transmission = liquidConfig.transmission;
    wineMaterial.attenuationDistance = liquidConfig.attenuationDistance;
    wineMaterial.thickness = liquidConfig.thickness;
    wineMaterial.ior = liquidConfig.ior;
    wineMaterial.roughness = liquidConfig.roughness;
    wineMaterial.envMapIntensity = liquidConfig.envMapIntensity;
    wineMaterial.needsUpdate = true;
  }, [liquidConfig, wineMaterial]);

  useEffect(() => {
    meshes.forEach((mesh) => {
      if (!mesh) return;

      if (innerOneVariant === "transparent") {
        mesh.renderOrder = 1;
        mesh.scale.set(0.993, 0.995, 0.993);
        mesh.material = wineMaterial;
        mesh.visible = true;
      }
    });
  }, [meshes, innerOneVariant, wineMaterial]);

  if (meshes.length === 0) return null;

  return (
    <>
      {meshes.map((mesh, i) => (
        <primitive key={`wine-${i}`} object={mesh} />
      ))}
    </>
  );
}
