import { observer } from "mobx-react-lite";
import { useStores } from "../../hooks/useStores";
import "./Header.css";

export const Header = observer(function Header() {
  const { designManager } = useStores();

  return (
    <header className="app-header">
      <div className="app-header__mark" aria-hidden="true">
        &#127863;
      </div>
      <div className="app-header__titles">
        <h1 className="app-header__title">Wine Glass Viewer</h1>
        <p className="app-header__subtitle">
          Viewing <span>{designManager.selectedModelConfig.name}</span>
        </p>
      </div>
    </header>
  );
});
