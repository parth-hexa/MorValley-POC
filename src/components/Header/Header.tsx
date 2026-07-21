import { observer } from "mobx-react-lite";
import { useStores } from "../../hooks/useStores";
import "./Header.css";

export const Header = observer(function Header() {
  const { designManager } = useStores();

  return (
    <header className="app-header">
      <div className="app-header__left">
        <span className="app-header__brand">MORVALLEY</span>
      </div>

      <div className="app-header__center">
        <h1 className="app-header__title">Wine Bottle Viewer</h1>
        <span className="app-header__subtitle">
          {designManager.selectedModelConfig.name} Collection
        </span>
      </div>

      <div className="app-header__right">
        <span className="app-header__tag">Edition 1.0</span>
      </div>
    </header>
  );
});
