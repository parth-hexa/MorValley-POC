import { observer } from "mobx-react-lite";
import { useStores } from "../../hooks/useStores";
import "./LoadingOverlay.css";

const GLASS_OUTLINE =
  "M22,8 L78,8 L64,88 L64,124 L82,124 L82,132 L18,132 L18,124 L36,124 L36,88 Z";

/**
 * Full-canvas overlay shown during model transitions. Blocks interaction
 * (pointer-events) while a load is in flight, per the PRD requirement that
 * the user should never interact with a half-loaded scene. The fill level
 * of the glass silhouette tracks Design3DManager.loadingProgress.
 */
export const LoadingOverlay = observer(function LoadingOverlay() {
  const { design3DManager } = useStores();
  const { isLoading, loadingProgress } = design3DManager;

  const fillTop = 132 - (124 * Math.max(4, loadingProgress)) / 100;

  return (
    <div className={`loading-overlay${isLoading ? " is-visible" : ""}`} aria-hidden={!isLoading}>
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
          Pouring <span className="loading-overlay__percent">{loadingProgress}%</span>
        </p>
      </div>
    </div>
  );
});
