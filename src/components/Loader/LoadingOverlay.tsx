import { useProgress } from "@react-three/drei";
import { observer } from "mobx-react-lite";
import React, { useEffect, useRef, useState } from "react";
import "./LoadingOverlay.css";
import { useStores } from "../../hooks/useStores";

const GLASS_OUTLINE =
  "M22,8 L78,8 L64,88 L64,124 L82,124 L82,132 L18,132 L18,124 L36,124 L36,88 Z";

/**
 * Overlay shown during model transitions and asset loading.
 * Integrates @react-three/drei's useProgress hook for automatic asset tracking,
 * with smooth animation and delayed hiding.
 */
export const LoadingOverlay = observer(function LoadingOverlay() {
  const { design3DManager } = useStores();
  const { active, progress } = useProgress();
  const [isVisible, setIsVisible] = useState(false);

  const rectRef = useRef<SVGRectElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const currentProgress = useRef(0);

  // Smooth animation loop for the loader fill
  useEffect(() => {
    let animationFrameId: number;

    const animate = () => {
      // Lerp the progress value
      currentProgress.current += (progress - currentProgress.current) * 0.05;

      if (rectRef.current) {
        // Calculate clipping boundary based on current interpolated progress
        const fillTop =
          132 - (124 * Math.max(4, currentProgress.current)) / 100;
        rectRef.current.setAttribute("y", fillTop.toString());
        rectRef.current.setAttribute("height", (140 - fillTop).toString());
      }

      if (textRef.current) {
        textRef.current.innerText = `${Math.round(currentProgress.current)}%`;
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => cancelAnimationFrame(animationFrameId);
  }, [progress]);

  // Handle visibility logic with delay on completion
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    if (active || progress < 100) {
      setIsVisible(true);
      design3DManager.setIsOverlayVisible(true);
    } else if (progress === 100) {
      // Keep loader visible briefly after reaching 100% so users can actually read it
      timer = setTimeout(() => {
        setIsVisible(false);
        design3DManager.setIsOverlayVisible(false);
      }, 1500);
    }

    return () => clearTimeout(timer);
  }, [active, progress, design3DManager]);

  return (
    <div
      className={`loading-overlay${isVisible ? " is-visible" : ""}`}
      aria-hidden={!isVisible}
    >
      <div className="loading-overlay__panel">
        <svg viewBox="0 0 100 140" className="pour-glass" aria-hidden="true">
          <defs>
            <clipPath id="pourClip">
              <rect ref={rectRef} x="0" y="132" width="100" height="8" />
            </clipPath>
          </defs>
          <path d={GLASS_OUTLINE} className="pour-glass__outline" />
          <path
            d={GLASS_OUTLINE}
            className="pour-glass__fill"
            clipPath="url(#pourClip)"
          />
        </svg>
        <p className="loading-overlay__label">
          Pouring{" "}
          <span ref={textRef} className="loading-overlay__percent">
            0%
          </span>
        </p>
      </div>
    </div>
  );
});
