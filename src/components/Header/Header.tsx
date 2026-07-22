import { observer } from "mobx-react-lite";
import { useStores } from "../../hooks/useStores";
import "./Header.css";

export const Header = observer(() => {
  const { designManager } = useStores();

  return (
    <header className="app-header">
      <div className="app-header__left">
        <h1 className="app-header__logo">MorValley</h1>
        <div className="app-header__divider" />
        <span className="app-header__context">
          {designManager.productManager.bottleManager.selectedModelConfig.name} Collection
        </span>
      </div>
      <div className="app-header__right">
        {/* Placeholder for future top-nav actions (Save, Export, etc.) */}
      </div>
    </header>
  );
});
