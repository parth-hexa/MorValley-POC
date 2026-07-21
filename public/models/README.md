# Model assets

Per the PRD, this app expects real assets here:

```
public/models/wine-glass-01.glb   (Classic)
public/models/wine-glass-02.glb   (Bordeaux)
public/models/wine-glass-03.glb   (Burgundy)
public/models/wine-glass-04.glb   (Champagne)
public/models/wine-glass-05.glb   (Stemless)
```

No `.glb` files ship with this scaffold. `src/three/loaders/modelLoader.ts`
tries to fetch each path above first; if the file isn't found, it falls back
to a procedurally generated placeholder glass (`src/three/scene/proceduralGlass.ts`)
so the app is fully functional out of the box.

**To use real models:** drop correctly named `.glb` files into this folder.
No code changes are required — the loader will pick them up automatically
and the fallback simply won't trigger.
