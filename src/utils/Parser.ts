import type { StateManager } from "../state/StateManager";
import { Bottle } from "../state/Bottle";
import type { GlassModelConfig } from "../state/types";

// For now, we simulate an API fetch by directly importing the JSON.
// In the future, this can be swapped with a real `fetch('/api/data.json')`
import data from "../json/data.json";

export class Parser {
  public async loadData(stateManager: StateManager): Promise<void> {
    const { defaultGlassId, catalog } = data as { defaultGlassId: string; catalog: GlassModelConfig[] };

    const bottle2DManager = stateManager.designManager.productManager.bottle2DManager;

    // Parse the catalog array into Bottle instances
    for (const item of catalog) {
      if (!bottle2DManager.getBottleById(item.id)) {
        const bottle = new Bottle(item.id, item.name, item.glbPath, item.note);
        bottle2DManager.addBottle(bottle);
      }
    }

    // Load the default bottle model
    if (defaultGlassId) {
      await stateManager.designManager.selectModel(defaultGlassId);
    } else if (catalog.length > 0) {
      await stateManager.designManager.selectModel(catalog[0].id);
    }
  }
}
