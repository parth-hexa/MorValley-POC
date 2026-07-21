import { Header } from "../Header/Header";
import { Scene } from "../Canvas/Scene";
import { ModelSelector } from "../Sidebar/ModelSelector";
import { DesignPanel } from "../Sidebar/DesignPanel";
import { LoadingOverlay } from "../Loader/LoadingOverlay";
import "./Layout.css";

export function Layout() {
  return (
    <div className="app-layout">
      <Header />
      <div className="app-body">
        <div className="canvas-stage">
          <Scene />
          <ModelSelector />
          <LoadingOverlay />
        </div>
        <DesignPanel />
      </div>
    </div>
  );
}
