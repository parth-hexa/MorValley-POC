import { shaderMaterial } from "@react-three/drei";
import { extend, type ThreeElement } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Subtle, elegant, photorealistic animated liquid GLSL shader.
 * Gentle fluid movement with rotation reactivity and high-contrast center luminance.
 * Follows rules 39-42 & 91.
 */
export const LiquidMaterial = shaderMaterial(
  {
    uTime: 0,
    uRotation: 0,
    uColor: new THREE.Color("#8b1e0f"),
    uRimColor: new THREE.Color("#210302"),
    uOpacity: 0.85,
    uSpeed: 0.35,
  },
  // Vertex Shader: Pass through UVs, normals, and position in View Space
  /* glsl */ `
    varying vec3 vNormal;
    varying vec3 vPosition;
    varying vec2 vUv;
    uniform float uTime;
    uniform float uSpeed;
    uniform float uRotation;

    void main() {
      vUv = uv;
      vNormal = normalize(normalMatrix * normal);
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      vPosition = mvPosition.xyz;
      gl_Position = projectionMatrix * mvPosition;
    }
  `,
  // Fragment Shader: Subtle, elegant fluid wave flow, caustics & rotation response
  /* glsl */ `
    varying vec3 vNormal;
    varying vec3 vPosition;
    varying vec2 vUv;
    uniform float uTime;
    uniform float uSpeed;
    uniform float uRotation;
    uniform vec3 uColor;
    uniform vec3 uRimColor;
    uniform float uOpacity;

    // Soft procedural fluid caustic pattern
    float causticPattern(vec2 uv, float t) {
      vec2 p = mod(uv * 6.28318530718, 6.28318530718) - 250.0;
      vec2 i = vec2(p);
      float c = 1.0;
      float inten = 0.005;

      for (int n = 0; n < 3; n++) {
        float timeOffset = t * (1.0 - (2.0 / float(n + 1)));
        i = p + vec2(cos(timeOffset - i.x) + sin(timeOffset + i.y), sin(timeOffset - i.y) + cos(timeOffset + i.x));
        c += 1.0 / length(vec2(p.x / (sin(i.x + timeOffset) / inten), p.y / (cos(i.y + timeOffset) / inten)));
      }
      c /= 3.0;
      c = 1.15 - pow(abs(c), 1.3);
      return clamp(pow(abs(c), 4.0), 0.0, 1.0);
    }

    void main() {
      vec3 viewDir = normalize(-vPosition);
      vec3 n = normalize(vNormal);

      // Slow, subtle fluid normal perturbation
      float t = uTime * uSpeed;
      float rotOffset = uRotation * 0.8;

      vec3 perturbedNormal = n;
      perturbedNormal.x += sin(vUv.y * 12.0 + t * 1.2 + rotOffset * 0.5) * 0.035;
      perturbedNormal.y += cos((vUv.x + rotOffset * 0.1) * 10.0 + t * 1.0) * 0.035;
      perturbedNormal = normalize(perturbedNormal);

      // Camera-relative center vs silhouette factor (INVARIANT to bottle rotation angle)
      float horizCenter = 1.0 - clamp(abs(n.x), 0.0, 1.0);
      float centerGlow = pow(horizCenter, 1.1);
      float viewCenter = clamp(n.z, 0.0, 1.0);
      float totalCenter = centerGlow * pow(viewCenter, 0.5);

      // Base color gradient: bright center vs deep dark edge absorption
      vec3 brightCenter = uColor * 2.0 + vec3(0.28, 0.09, 0.02);
      vec3 darkEdge = uRimColor * 0.35;
      vec3 baseColor = mix(darkEdge, brightCenter, totalCenter);
      baseColor += vec3(pow(totalCenter, 1.6) * 0.38 * uColor);

      // Subtle internal liquid wave streams
      float waveStream1 = sin(vUv.y * 12.0 - t * 1.2 + sin((vUv.x + rotOffset * 0.5) * 6.0 + t * 0.8) * 0.8);
      float waveStream2 = cos((vUv.y + rotOffset * 0.1) * 16.0 + t * 1.4 - cos((vUv.x + rotOffset * 0.5) * 8.0 - t * 1.0) * 0.8);
      float internalWaves = smoothstep(0.0, 0.9, waveStream1 * waveStream2);

      // Soft gentle wave ripples
      float waveRipples = sin(vUv.y * 20.0 + sin((vUv.x + rotOffset * 0.5) * 10.0 + t * 1.5) * 1.0 + t * 1.8) * 0.5 + 0.5;

      // Soft caustic light shimmer
      float caustics = causticPattern((vUv + vec2(rotOffset * 0.05, 0.0)) * 1.8, t * 0.3);

      // Combine color components with subtle, realistic fluid motion
      vec3 finalColor = baseColor 
        + vec3(internalWaves * 0.08 * uColor) 
        + vec3(waveRipples * 0.05 * uColor)
        + vec3(caustics * 0.08 * uColor);

      // Specular highlight streak along curvature
      vec3 lightDir = normalize(vec3(0.5, 1.0, 0.7));
      vec3 halfDir = normalize(lightDir + viewDir);
      float spec = pow(max(dot(perturbedNormal, halfDir), 0.0), 40.0);
      finalColor += vec3(spec * 0.65);

      gl_FragColor = vec4(finalColor, uOpacity);
    }
  `
);

// Enable alpha blending on prototype
LiquidMaterial.prototype.transparent = true;
LiquidMaterial.prototype.depthWrite = true;

extend({ LiquidMaterial });

declare module "@react-three/fiber" {
  interface ThreeElements {
    liquidMaterial: ThreeElement<typeof THREE.ShaderMaterial> & {
      uTime?: number;
      uRotation?: number;
      uColor?: THREE.ColorRepresentation;
      uRimColor?: THREE.ColorRepresentation;
      uOpacity?: number;
      uSpeed?: number;
      transparent?: boolean;
      depthWrite?: boolean;
    };
  }
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      liquidMaterial: ThreeElement<typeof THREE.ShaderMaterial> & {
        uTime?: number;
        uRotation?: number;
        uColor?: THREE.ColorRepresentation;
        uRimColor?: THREE.ColorRepresentation;
        uOpacity?: number;
        uSpeed?: number;
        transparent?: boolean;
        depthWrite?: boolean;
      };
    }
  }
}
