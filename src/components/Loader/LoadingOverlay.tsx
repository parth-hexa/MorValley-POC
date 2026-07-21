import { useProgress } from "@react-three/drei";
import { observer } from "mobx-react-lite";
import { useStores } from "../../hooks/useStores";
import "./LoadingOverlay.css";

const GLASS_OUTLINE =
  "M22,8 L78,8 L64,88 L64,124 L82,124 L82,132 L18,132 L18,124 L36,124 L36,88 Z";

/**
 * Overlay shown during model transitions and asset loading.
 * Integrates @react-three/drei's useProgress hook for automatic Drei/R3F asset tracking,
 * combined with MobX loading state for robust model transitions.
 */
export const LoadingOverlay = observer(function LoadingOverlay() {
  const { design3DManager } = useStores();
  const { active, progress } = useProgress();

  const isVisible = active || design3DManager.isLoading;
  const currentProgress = active ? Math.round(progress) : design3DManager.loadingProgress;

  const fillTop = 132 - (124 * Math.max(4, currentProgress)) / 100;

  return (
    <div className={`loading-overlay${isVisible ? " is-visible" : ""}`} aria-hidden={!isVisible}>
      <div className="loading-overlay__panel">
        <svg viewBox="0 0 100 140" className="pour-glass" aria-hidden="true">
          <defs>
            <clipPath id="pourClip">
              <rect x="0" y={fillTop} width="100" height={140 - fillTop} />
            </clipPath>
          </defs>
          <path d={GLASS_OUTLINE} className="pour-glass__outline" />
          <path d={GLASS_OUTLINE} className="pour-glass__fill" clipPath="url(#pourClip)" />
        </svg>
        <p className="loading-overlay__label">
          Pouring <span className="loading-overlay__percent">{currentProgress}%</span>
        </p>
      </div>
    </div>
  );
});
