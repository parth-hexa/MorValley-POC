import { useEffect, useState } from "react";
import { StateManager } from "./state/StateManager";
import { StateManagerContext } from "./hooks/useStores";
import { Layout } from "./components/Layout/Layout";
import { Parser } from "./utils/Parser";

function App() {
  // Root manager is created once per app instance, per the "single root
  // manager owns the entire application state" requirement.
  const [stateManager] = useState(() => new StateManager());

  useEffect(() => {
    const parser = new Parser();
    parser.loadData(stateManager);
  }, [stateManager]);

  return (
    <StateManagerContext.Provider value={stateManager}>
      <Layout />
    </StateManagerContext.Provider>
  );
}

export default App;
