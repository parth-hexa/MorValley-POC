import { Design3DManager } from "./Design3DManager";
import { DesignManager } from "./DesignManager";

/**
 * Single root of the MobX state tree — the "Single Source of Truth" the
 * PRD calls for. No other global state managers should exist; new domains
 * of state get added as a new child manager here, not as a new singleton.
 */
export class StateManager {
  private readonly _design3DManager: Design3DManager;
  private readonly _designManager: DesignManager;

  constructor() {
    this._design3DManager = new Design3DManager();
    this._designManager = new DesignManager(this._design3DManager);
  }

  get design3DManager(): Design3DManager {
    return this._design3DManager;
  }

  get designManager(): DesignManager {
    return this._designManager;
  }
}
