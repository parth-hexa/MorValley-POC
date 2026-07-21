import { Design3DManager } from "./Design3DManager";
import { DesignManager } from "./DesignManager";

/**
 * Single root of the MobX state tree — the "Single Source of Truth" the
 * PRD calls for. No other global state managers should exist; new domains
 * of state get added as a new child manager here, not as a new singleton.
 */
export class StateManager {
  readonly design3DManager: Design3DManager;
  readonly designManager: DesignManager;

  constructor() {
    this.design3DManager = new Design3DManager();
    this.designManager = new DesignManager(this.design3DManager);
  }
}
