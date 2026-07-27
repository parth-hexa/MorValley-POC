import { shaderMaterial } from "@react-three/drei";
import { extend, type ThreeElement } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Volumetric Wine Shader Material with Vertical Height & Curvature Beer-Lambert Absorption.
 * 
 * Optical distribution:
 * - Center & Top: Deep dark mahogany wine tone (heavy volumetric absorption).
 * - Bottom portion (punt/base) & Near surface edges: Bright glowing light amber wine tone.
 */
export const VolumetricWineShaderMaterial = shaderMaterial(
  {
    uTime: 0,
    uLightColor: new THREE.Color("#ffa800"), // Light amber/ruby tone for bottom & edges
    uDarkColor: new THREE.Color("#c23c02"),  // Deep dark mahogany tone for center & top
    uAbsorption: new THREE.Vector3(0.08, 0.45, 1.80),
    uThicknessScale: 93.45,                  // Physical liquid diameter (93.45 units)
    uAttenuationDistance: 45.0,              // Distance d_0 for full absorption
    uIor: 1.333,
    uRoughness: 0.15,
    uEnvMapIntensity: 2.2,
    uWaveSpeed: 0.35,
    uBottomLightness: 0.45,                  // Extra lightness boost at bottom punt
  },
  // Vertex Shader
  /* glsl */ `
    #version 300 es
    precision highp float;

    in vec3 position;
    in vec3 normal;
    in vec2 uv;

    uniform mat4 modelViewMatrix;
    uniform mat4 projectionMatrix;
    uniform mat3 normalMatrix;

    out vec3 vViewPosition;
    out vec3 vViewNormal;
    out vec3 vModelPosition;
    out vec2 vUv;

    void main() {
      vUv = uv;
      vModelPosition = position;
      vec4 viewPosition = modelViewMatrix * vec4(position, 1.0);
      vViewPosition = viewPosition.xyz;
      vViewNormal = normalize(normalMatrix * normal);
      gl_Position = projectionMatrix * viewPosition;
    }
  `,
  // Fragment Shader
  /* glsl */ `
    #version 300 es
    precision highp float;

    in vec3 vViewPosition;
    in vec3 vViewNormal;
    in vec3 vModelPosition;
    in vec2 vUv;

    uniform vec3 uLightColor;
    uniform vec3 uDarkColor;
    uniform vec3 uAbsorption;
    uniform float uThicknessScale;
    uniform float uAttenuationDistance;
    uniform float uIor;
    uniform float uRoughness;
    uniform float uEnvMapIntensity;
    uniform float uTime;
    uniform float uWaveSpeed;
    uniform float uBottomLightness;

    out vec4 fragColor;

    float fresnelSchlick(float cosTheta, float r0) {
      return r0 + (1.0 - r0) * pow(clamp(1.0 - cosTheta, 0.0, 1.0), 5.0);
    }

    float fluidRipple(vec2 uv, float t) {
      vec2 p = uv * 8.0;
      float wave = sin(p.x * 1.5 + t) * cos(p.y * 1.5 + t * 0.8);
      wave += sin(p.y * 3.0 - t * 1.2) * 0.5;
      return wave * 0.5 + 0.5;
    }

    void main() {
      vec3 N = normalize(vViewNormal);
      vec3 V = normalize(-vViewPosition);
      float cosTheta = clamp(dot(N, V), 0.0, 1.0);

      float t = uTime * uWaveSpeed;
      float ripple = fluidRipple(vUv, t);

      float yNorm = clamp((vModelPosition.y - 1.26) / (147.19 - 1.26), 0.0, 1.0);
      float centerFactor = clamp(dot(N, V), 0.02, 1.0);

      float heightDarkening = mix(1.0 - uBottomLightness, 1.45, pow(yNorm, 0.8));
      float pathLength = uThicknessScale * pow(centerFactor, 0.5) * heightDarkening * (0.9 + ripple * 0.1);

      float normThickness = pathLength / max(uAttenuationDistance, 0.1);
      vec3 transmittance = exp(-uAbsorption * normThickness);

      float darkMix = clamp(pow(centerFactor, 0.6) * yNorm * 1.25, 0.0, 1.0);
      vec3 baseVolumetricColor = mix(uLightColor, uDarkColor, darkMix);

      vec3 liquidColor = mix(uDarkColor, baseVolumetricColor, transmittance);

      float edgeGlow = pow(1.0 - cosTheta, 3.0);
      float bottomGlow = (1.0 - yNorm) * uBottomLightness;
      liquidColor += uLightColor * (edgeGlow * 0.4 + bottomGlow * 0.5);

      float r0 = pow((1.0 - uIor) / (1.0 + uIor), 2.0);
      float F = fresnelSchlick(1.0 - cosTheta, r0);

      vec3 lightDir = normalize(vec3(0.6, 1.2, 0.8));
      vec3 H = normalize(lightDir + V);
      float specPower = mix(128.0, 16.0, uRoughness);
      float spec = pow(max(dot(N, H), 0.0), specPower) * uEnvMapIntensity;

      vec3 finalColor = mix(liquidColor, vec3(spec) + uLightColor * 0.25, F * 0.25);
      finalColor += vec3(spec * 0.35);

      fragColor = vec4(finalColor, 0.98);
    }
  `
);

VolumetricWineShaderMaterial.prototype.transparent = true;
VolumetricWineShaderMaterial.prototype.depthWrite = true;

extend({ VolumetricWineShaderMaterial });

declare module "@react-three/fiber" {
  interface ThreeElements {
    volumetricWineShaderMaterial: ThreeElement<typeof THREE.ShaderMaterial> & {
      uTime?: number;
      uLightColor?: THREE.ColorRepresentation;
      uDarkColor?: THREE.ColorRepresentation;
      uAbsorption?: THREE.Vector3;
      uThicknessScale?: number;
      uAttenuationDistance?: number;
      uIor?: number;
      uRoughness?: number;
      uEnvMapIntensity?: number;
      uWaveSpeed?: number;
      uBottomLightness?: number;
      transparent?: boolean;
      depthWrite?: boolean;
    };
  }
}
