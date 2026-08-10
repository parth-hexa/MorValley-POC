import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { useThree } from "@react-three/fiber";

type EnvCacheKey = string;

const cubeCache = new Map<
  EnvCacheKey,
  { target: THREE.WebGLCubeRenderTarget; refCount: number }
>();

function cacheKey(env: THREE.Texture, size: number) {
  return `${env.uuid}:${size}`;
}

/**
 * Mipmapped cube map for ray-traced refraction, built from scene.environment.
 *
 * Uses the HDR that EnvironmentSetup already loaded — no second useEnvironment
 * call — and caches the cube so StrictMode remounts do not dispose a texture
 * that is still bound to the liquid material.
 */
export function useRefractionEnvMap(size = 1024) {
  const gl = useThree((state) => state.gl);
  const sceneEnv = useThree((state) => state.scene.environment);
  const [cubeMap, setCubeMap] = useState<THREE.CubeTexture | null>(null);
  const activeKey = useRef<EnvCacheKey | null>(null);

  useEffect(() => {
    if (!sceneEnv) {
      setCubeMap(null);
      return;
    }

    if (sceneEnv.mapping === THREE.CubeReflectionMapping) {
      setCubeMap(sceneEnv as THREE.CubeTexture);
      return;
    }

    const key = cacheKey(sceneEnv, size);
    activeKey.current = key;

    let entry = cubeCache.get(key);
    if (!entry) {
      const equirect = sceneEnv as THREE.Texture;
      const previous = {
        generateMipmaps: equirect.generateMipmaps,
        minFilter: equirect.minFilter,
        magFilter: equirect.magFilter,
      };

      equirect.generateMipmaps = true;
      equirect.minFilter = THREE.LinearMipmapLinearFilter;
      equirect.magFilter = THREE.LinearFilter;

      const target = new THREE.WebGLCubeRenderTarget(size, {
        type: THREE.HalfFloatType,
        // Real mip chain so the shader can pull a heavily blurred sample for
        // the "flat" env lookup, not just the sharp face texture.
        generateMipmaps: true,
        minFilter: THREE.LinearMipmapLinearFilter,
        magFilter: THREE.LinearFilter,
      });
      target.fromEquirectangularTexture(gl, equirect);

      equirect.generateMipmaps = previous.generateMipmaps;
      equirect.minFilter = previous.minFilter;
      equirect.magFilter = previous.magFilter;

      entry = { target, refCount: 0 };
      cubeCache.set(key, entry);
    }

    entry.refCount += 1;
    setCubeMap(entry.target.texture);

    return () => {
      const cached = cubeCache.get(key);
      if (!cached) return;
      cached.refCount -= 1;
      if (cached.refCount <= 0) {
        cached.target.dispose();
        cubeCache.delete(key);
      }
      if (activeKey.current === key) {
        activeKey.current = null;
      }
    };
  }, [sceneEnv, gl, size]);

  return cubeMap;
}
