import { createContext, useContext } from "react";
import { StateManager } from "../state/StateManager";

export const StateManagerContext = createContext<StateManager | null>(null);

export function useStores(): StateManager {
  const store = useContext(StateManagerContext);
  if (!store) {
    throw new Error("useStores must be used within a StateManagerContext.Provider");
  }
  return store;
}
