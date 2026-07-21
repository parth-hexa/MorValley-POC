import { useEffect, useState } from "react";
import { StateManager } from "./state/StateManager";
import { StateManagerContext } from "./hooks/useStores";
import { Layout } from "./components/Layout/Layout";

function App() {
  // Root manager is created once per app instance, per the "single root
  // manager owns the entire application state" requirement.
  const [stateManager] = useState(() => new StateManager());

  useEffect(() => {
    stateManager.designManager.loadDefaultModel();
  }, [stateManager]);

  return (
    <StateManagerContext.Provider value={stateManager}>
      <Layout />
    </StateManagerContext.Provider>
  );
}

export default App;
