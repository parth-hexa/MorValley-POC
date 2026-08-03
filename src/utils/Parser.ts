import type { StateManager } from "../state/StateManager";
import { Bottle } from "../state/Bottle";
import { ModelLoader } from "../three/loaders/modelLoader";
import type { BottleModelConfig } from "../state/types";

// For now, we simulate an API fetch by directly importing the JSON.
// In the future, this can be swapped with a real `fetch('/api/data.json')`
import data from "../json/data.json";

export class Parser {
  public async loadData(stateManager: StateManager): Promise<void> {
    const { defaultBottleId, catalog } = data as {
      defaultBottleId: string;
      catalog: BottleModelConfig[];
    };

    const bottle2DManager =
      stateManager.designManager.productManager.bottle2DManager;

    // Parse the catalog array into Bottle instances
    for (const item of catalog) {
      const existing = bottle2DManager.getBottleById(item.id);
      if (existing) {
        existing.backgroundGradient = item.backgroundGradient;
        continue;
      }

      const bottle = new Bottle(
        item.id,
        item.name,
        item.glbPath,
        item.note,
        item.innerTwoVariant,
        item.innerOneVariant,
        item.backgroundGradient,
        item.labelPolygonOffset
      );
      bottle2DManager.addBottle(bottle);
    }

    // Load the default bottle model
    if (defaultBottleId) {
      const config =
        catalog.find((c) => c.id === defaultBottleId) || catalog[0];
      ModelLoader.preloadBottleModel(config);
      await stateManager.designManager.selectModel(config.id);
    } else if (catalog.length > 0) {
      ModelLoader.preloadBottleModel(catalog[0]);
      await stateManager.designManager.selectModel(catalog[0].id);
    }
  }
}
