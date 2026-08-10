import * as THREE from "three";
import { shaderMaterial } from "@react-three/drei";
import {
  MeshBVH,
  MeshBVHUniformStruct,
  SAH,
  FloatVertexAttributeTexture,
  shaderStructs,
  shaderIntersectFunction,
} from "three-mesh-bvh";
import { mergeVertices } from "three/examples/jsm/utils/BufferGeometryUtils.js";

/**
 * Ray-traced liquid material derived from drei's MeshRefractionMaterial.
 *
 * Two things it adds over the original, both aimed at the punt (bottle base),
 * where the original breaks down:
 *
 * 1. Interpolated hit normals. The BVH intersection only reports a flat
 *    triangle normal, so every internal bounce refracts off a hard facet and
 *    the curved base resolves into visible polygons. Vertex normals are
 *    interpolated across the hit triangle instead.
 * 2. Beer-Lambert absorption over the traced path. The original tints by a
 *    single colour regardless of how far light travelled through the liquid,
 *    which flattens the gradient. Port reads honey-gold where the layer is
 *    thin and deep mahogany through the body, and that is purely a function
 *    of path length.
 */

const vertexShader = /* glsl */ `
  uniform mat4 viewMatrixInverse;

  varying vec3 vWorldPosition;
  varying vec3 vNormal;
  varying mat4 vModelMatrixInverse;

  void main() {
    vModelMatrixInverse = inverse(modelMatrix);
    vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
    vNormal = normalize((viewMatrixInverse * vec4(normalMatrix * normal, 0.0)).xyz);
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  precision highp isampler2D;
  precision highp usampler2D;

  varying vec3 vWorldPosition;
  varying vec3 vNormal;
  varying mat4 vModelMatrixInverse;

  #ifdef ENVMAP_TYPE_CUBEM
    uniform samplerCube envMap;
  #else
    uniform sampler2D envMap;
  #endif

  ${shaderStructs}
  ${shaderIntersectFunction}

  uniform BVH bvh;
  uniform sampler2D normalAttribute;

  uniform float bounces;
  uniform float ior;
  uniform bool correctMips;
  uniform float blurScale;
  uniform float normalSmoothing;
  uniform float aberrationStrength;
  uniform float fresnel;
  uniform float envIntensity;
  // How much of the sharp, refracted scene shows through vs. a heavily
  // blurred wash of the same env (keeps the light/colour, loses the mirror).
  uniform float envDetail;
  uniform vec3 color;
  uniform vec3 attenuationColor;
  uniform float attenuationDistance;
  uniform float pathNormalization;
  uniform float opacity;
  uniform vec2 resolution;

  uniform mat4 modelMatrix;
  uniform mat4 projectionMatrixInverse;
  uniform mat4 viewMatrixInverse;

  #include <common>

  float fresnelFunc(vec3 viewDirection, vec3 worldNormal) {
    return pow(1.0 + dot(viewDirection, worldNormal), 10.0);
  }

  // Transmittance after travelling 'dist' through a medium that fades to
  // attColor over attDistance. Matches three's volume attenuation.
  vec3 volumeAttenuation(float dist, vec3 attColor, float attDist) {
    if (attDist > 999.0) return vec3(1.0);
    vec3 attCoeff = -log(max(attColor, vec3(1e-4))) / max(attDist, 1e-4);
    return exp(-attCoeff * max(dist, 0.0));
  }

  // The BVH reports a flat face normal, already flipped to face the incoming
  // ray via 'side'. Vertex normals point outwards, so they need the same flip
  // before the two can be blended.
  vec3 resolveHitNormal(uvec4 faceIndices, vec3 barycoord, vec3 faceNormal, float side) {
    if (normalSmoothing <= 0.0) return faceNormal;

    vec3 vertexNormal = textureSampleBarycoord(normalAttribute, barycoord, faceIndices.xyz).xyz;
    if (dot(vertexNormal, vertexNormal) < 1e-8) return faceNormal;

    vertexNormal = normalize(vertexNormal) * side;
    return normalize(mix(faceNormal, vertexNormal, normalSmoothing));
  }

  // Refracts into the liquid, follows total internal reflections until the ray
  // escapes, and reports how far it travelled inside.
  vec3 traceInterior(
    vec3 incoming, vec3 normal, float rayIor, mat4 modelMatrixInverse, out float pathLength
  ) {
    pathLength = 0.0;

    vec3 rayDirection = refract(incoming, normal, 1.0 / rayIor);
    vec3 rayOrigin = vWorldPosition + rayDirection * 0.001;
    rayOrigin = (modelMatrixInverse * vec4(rayOrigin, 1.0)).xyz;
    rayDirection = normalize((modelMatrixInverse * vec4(rayDirection, 0.0)).xyz);

    for (float i = 0.0; i < bounces; i++) {
      uvec4 faceIndices = uvec4(0u);
      vec3 faceNormal = vec3(0.0, 0.0, 1.0);
      vec3 barycoord = vec3(0.0);
      float side = 1.0;
      float dist = 0.0;

      bool hit = bvhIntersectFirstHit(
        bvh, rayOrigin, rayDirection, faceIndices, faceNormal, barycoord, side, dist
      );
      if (!hit) break;

      pathLength += max(dist, 0.0);

      vec3 hitNormal = resolveHitNormal(faceIndices, barycoord, faceNormal, side);
      vec3 hitPos = rayOrigin + rayDirection * max(dist - 0.001, 0.0);

      vec3 exitDirection = refract(rayDirection, hitNormal, rayIor);
      if (length(exitDirection) != 0.0) {
        rayDirection = exitDirection;
        break;
      }

      rayDirection = reflect(rayDirection, hitNormal);
      rayOrigin = hitPos + rayDirection * 0.01;
    }

    return normalize((modelMatrix * vec4(rayDirection, 0.0)).xyz);
  }

  // Where refracted rays diverge sharply — the punt especially — the screen
  // space derivative of the ray itself is large, which pulls a coarser mip and
  // filters the chaos instead of aliasing it. correctMips keeps the original
  // behaviour of always sampling a sharp mip.
  #ifdef ENVMAP_TYPE_CUBEM
    vec3 sampleEnv(vec3 rayDirection, vec3 directionCamPerfect) {
      vec3 grad = correctMips ? directionCamPerfect : rayDirection;
      vec3 sharp = textureGrad(
        envMap, rayDirection, dFdx(grad) * blurScale, dFdy(grad) * blurScale
      ).rgb;
      // Forced coarse mip — no readable scenery, just the env's overall tone.
      vec3 flat_ = textureLod(envMap, rayDirection, 8.0).rgb;
      return mix(flat_, sharp, clamp(envDetail, 0.0, 1.0));
    }
  #else
    vec3 sampleEnv(vec3 rayDirection, vec3 directionCamPerfect) {
      vec2 uvv = equirectUv(rayDirection);
      vec2 grad = correctMips ? equirectUv(directionCamPerfect) : uvv;
      vec3 sharp = textureGrad(
        envMap, uvv, dFdx(grad) * blurScale, dFdy(grad) * blurScale
      ).rgb;
      vec3 flat_ = textureLod(envMap, uvv, 8.0).rgb;
      return mix(flat_, sharp, clamp(envDetail, 0.0, 1.0));
    }
  #endif

  void main() {
    vec2 uv = gl_FragCoord.xy / resolution;
    vec3 directionCamPerfect = (projectionMatrixInverse * vec4(uv * 2.0 - 1.0, 0.0, 1.0)).xyz;
    directionCamPerfect = normalize((viewMatrixInverse * vec4(directionCamPerfect, 0.0)).xyz);

    vec3 normal = normalize(vNormal);
    vec3 viewDirection = normalize(vWorldPosition - cameraPosition);

    float pathLength = 0.0;
    vec3 envColor;

    #ifdef CHROMATIC_ABERRATIONS
      vec3 dirG = traceInterior(viewDirection, normal, max(ior, 1.0), vModelMatrixInverse, pathLength);
      #ifdef FAST_CHROMA
        vec3 dirR = normalize(dirG + vec3(aberrationStrength / 2.0));
        vec3 dirB = normalize(dirG - vec3(aberrationStrength / 2.0));
      #else
        float pathR = 0.0;
        float pathB = 0.0;
        vec3 dirR = traceInterior(
          viewDirection, normal, max(ior * (1.0 - aberrationStrength), 1.0), vModelMatrixInverse, pathR
        );
        vec3 dirB = traceInterior(
          viewDirection, normal, max(ior * (1.0 + aberrationStrength), 1.0), vModelMatrixInverse, pathB
        );
        pathLength = (pathR + pathLength + pathB) / 3.0;
      #endif
      envColor = vec3(
        sampleEnv(dirR, directionCamPerfect).r,
        sampleEnv(dirG, directionCamPerfect).g,
        sampleEnv(dirB, directionCamPerfect).b
      );
    #else
      vec3 dir = traceInterior(viewDirection, normal, max(ior, 1.0), vModelMatrixInverse, pathLength);
      envColor = sampleEnv(dir, directionCamPerfect);
    #endif

    vec3 absorption = volumeAttenuation(
      pathLength * pathNormalization, attenuationColor, attenuationDistance
    );
    vec3 finalColor = envColor * envIntensity * color * absorption;

    float nFresnel = clamp(fresnelFunc(viewDirection, normal) * fresnel, 0.0, 1.0);
    gl_FragColor = vec4(mix(finalColor, vec3(1.0), nFresnel), opacity);

    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

export const WineRefractionMaterialImpl = shaderMaterial(
  {
    envMap: null as THREE.Texture | null,
    normalAttribute: null as THREE.Texture | null,
    bvh: new MeshBVHUniformStruct(),
    bounces: 3,
    ior: 1.35,
    correctMips: false as boolean,
    blurScale: 1.0,
    normalSmoothing: 1,
    aberrationStrength: 0.015,
    fresnel: 0,
    envIntensity: 1,
    envDetail: 0.35,
    color: new THREE.Color("white"),
    attenuationColor: new THREE.Color("black"),
    attenuationDistance: 1,
    pathNormalization: 1,
    opacity: 1,
    resolution: new THREE.Vector2(),
    viewMatrixInverse: new THREE.Matrix4(),
    projectionMatrixInverse: new THREE.Matrix4(),
  },
  vertexShader,
  fragmentShader
);

export interface WineRefractionGeometryData {
  bvh: MeshBVHUniformStruct;
  normalAttribute: FloatVertexAttributeTexture;
  /**
   * Converts an accumulated local-space path length into a 0..1-ish fraction of
   * a full traversal, so absorption distance stays meaningful across models of
   * different scales.
   */
  pathNormalization: number;
  dispose: () => void;
}

/**
 * Builds the BVH and matching vertex-normal lookup the shader traces against.
 *
 * MeshBVH needs non-indexed geometry, and the reported face indices address the
 * position attribute of that same geometry — so the normal texture has to be
 * derived from it rather than from the original mesh.
 */
export function buildWineRefractionGeometryData(
  geometry: THREE.BufferGeometry,
  { weldNormals = false }: { weldNormals?: boolean } = {}
): WineRefractionGeometryData {
  let source = geometry.clone();

  // Escape hatch for flat-shaded exports: welding split vertices before
  // recomputing normals is what turns a faceted punt into a smooth dome.
  if (weldNormals) {
    source = mergeVertices(source);
    source.computeVertexNormals();
  } else if (!source.attributes.normal) {
    source.computeVertexNormals();
  }

  const nonIndexed = source.toNonIndexed();
  source.dispose();

  const bvh = new MeshBVHUniformStruct();
  bvh.updateFrom(new MeshBVH(nonIndexed, { strategy: SAH }));

  const normalAttribute = new FloatVertexAttributeTexture();
  normalAttribute.updateFrom(nonIndexed.attributes.normal as THREE.BufferAttribute);

  nonIndexed.computeBoundingSphere();
  const radius = nonIndexed.boundingSphere?.radius ?? 1;
  nonIndexed.dispose();

  return {
    bvh,
    normalAttribute,
    pathNormalization: 1 / Math.max(radius * 2, 1e-4),
    dispose: () => normalAttribute.dispose(),
  };
}
