import { observer } from "mobx-react-lite";
import { useStores } from "../../hooks/useStores";
import "./ModelSelector.css";

/**
 * "A model selector is placed in the top-right corner" — implemented as a
 * floating card over the canvas rather than a full sidebar column, so the
 * glass itself stays the visual focus.
 */
export const ModelSelector = observer(function ModelSelector() {
  const { designManager } = useStores();
  const bottle2DManager = designManager.productManager.bottle2DManager;

  return (
    <div className="model-selector" role="radiogroup" aria-label="Glass models">
      <p className="model-selector__eyebrow">Bottle Models</p>
      <ul className="model-selector__list">
        {bottle2DManager.bottles.map((model) => {
          const isActive = bottle2DManager.selectedBottleId === model.id;
          return (
            <li key={model.id}>
              <button
                type="button"
                role="radio"
                aria-checked={isActive}
                className={`model-selector__item${isActive ? " is-active" : ""}`}
                onClick={() => designManager.selectModel(model.id)}
                disabled={isActive}
              >
                <span className="model-selector__indicator" aria-hidden="true" />
                <span className="model-selector__text">
                  <span className="model-selector__name">{model.name}</span>
                  <span className="model-selector__note">{model.note}</span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
});
