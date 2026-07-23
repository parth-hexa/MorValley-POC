# FinalProductPRD.md

# Wine Bottle Configurator
Version: 1.1

---

# Overview

## Product Name

**Wine Bottle Configurator**

---

## Goal

The application is a lightweight 3D configurator for wine bottles.

Its primary responsibility is to display different wine bottle models with a clean UI and allow users to configure them by adding specific design elements (text and images) while maintaining a scalable, MobX-driven architecture.

Rendering will be powered by **React Three Fiber (R3F)**.

---

# Tech Stack

- React
- TypeScript
- Vite
- React Three Fiber (R3F)
- Three.js
- MobX
- Zustand ❌ (Not used)
- Redux ❌ (Not used)

---

# Core Features

## 1. 3D Canvas

The center of the application contains a full-screen R3F canvas.

Responsibilities:
- Render selected bottle model
- Handle lighting and environment (e.g., using local .exr maps)
- Handle camera controls
- Render at high quality with physical materials
- Maintain responsive layout
- **Canvas Controls:** Provide a UI overlay in the 3D scene with 3 buttons:
  - `+` (Zoom In)
  - `-` (Zoom Out)
  - `Reset Config` (Reset configuration and view)

## 2. Dynamic Data Loading (API Simulation)

Models and catalog data are no longer hardcoded in types. Instead, they are driven by a JSON structure.

- **`src/json/data.json`**: Acts as the catalog database.
- **`Parser.ts`**: Simulates an API fetch by parsing the JSON on application load and hydrating the state managers.

## 3. Model Selector

A model selector is placed in the **top-right corner**.

Purpose:
- Display available wine bottle models dynamically based on the parsed JSON data.
- Allow switching between models.

## 4. Bottle Configuration (Elements)

Users can add design elements to the selected bottle. Each bottle instance manages its own state via an isolated `ElementManager`.

**Element Rules:**
- A bottle can have a maximum of **2 elements**.
- Specifically, there can be exactly **1 Text Element** and **1 Image Element**.
- **Image Element Options:**
  1. Select from a fixed preset of images.
  2. Upload a custom image.
- **Element Manipulators:**
  In the right sidebar 2D panel, each element can be manipulated using three properties:
  1. **Size**
  2. **Position**
  3. **Rotation**
- **3D Placement (Safe Area):**
  Elements added in 3D will be constrained to a fixed "safe area." This safe area mapping is defined specifically for each of the 4 supported bottles.

*Note: No other features or element types are supported at this time.*

## 5. Model Switching

When a new model is selected:
1. Previous model begins unloading.
2. Loading animation/progress appears.
3. New model loads.
4. New model spins/rotates into view smoothly.
5. The UI switches to the isolated element state of the newly selected bottle.

## 6. Sharing & Exporting

Users can save and share their customized wine bottle designs.
- **PDF Export:** Users can download their final configuration in the form of a PDF document.
- **Sharable Link:** A unique configuration link can be generated and copied to the clipboard.
- **Social Sharing:** The generated link can be directly shared to connected social media accounts.

---

# UI Layout

```
---------------------------------------------------------
Header

---------------------------------------------------------

Canvas

                Wine Bottle

                    |

                    |

                    |

             Right Design Panel (Configurator)

---------------------------------------------------------
```

---

# State Management

The application follows a **Single Source of Truth** architecture using MobX. All state must be plain data (no Three.js objects inside MobX observables).

## State Architecture

```
StateManager (Root)
│
├── DesignManager (UI/Editor state)
│   └── ProductManager
│       └── Bottle2DManager
│           └── Bottle[] (Instances)
│               └── ElementManager (Text/Image limits)
│
└── Design3DManager (Three.js state)
    └── Product3DManager
```

## Domain Data Separation
- **`Bottle2DManager.ts`**: Manages the collection of all available bottle models.
- **`Bottle.ts`**: Represents a single instantiated bottle. Contains its own `ElementManager` to track its applied text and image elements.
- **`ElementManager.ts`**: Enforces the business logic (1 Text, 1 Image limit, image presets vs. uploads).

## Design3DManager
Responsible for all 3D-related state. It acts as the bridge between React components and Three.js memory management.

Responsibilities:
- Loaded GLTF (outside of MobX observables)
- Camera state
- Loading progress
- Scene initialization

---

# Application Flow

```
Application Starts
↓
Initialize StateManager (RootStore)
↓
Parser.ts loads data.json
↓
Populate Bottle2DManager with Bottle instances
↓
Load Default Model
↓
Render Scene
↓
User Selects Model
↓
Load GLB & Replace Scene Model
↓
User adds Text or Image Element via UI
↓
ElementManager updates state
↓
3D Canvas reflects configuration
```

---

# Folder Structure

```
src/
  components/
      Canvas/
      Layout/
      Sidebar/
      Header/
      Loader/
  json/
      data.json
  state/
      StateManager.ts
      ProductManager.ts
      Bottle2DManager.ts
      Bottle.ts
      DesignManager.ts
      Design3DManager.ts
  three/
      loaders/
      materials/
      camera/
      scene/
  hooks/
  utils/
      Parser.ts
  public/
      models/
      env/
```

---

# Rendering Requirements

- **React Three Fiber** handles the scene graph.
- Physical glass materials must look realistic using properties like `clearcoat`, `roughness`, and `ior`.
- Keep 3D objects isolated from MobX state to prevent tracking errors.

---

# Performance Requirements

- Load only one 3D model at a time into memory.
- Dispose previous geometries and materials correctly to avoid memory leaks.
- Prevent duplicate model loading if the user clicks rapidly.

---

# Success Criteria

- Application launches and parses `data.json` successfully.
- Default wine bottle loads automatically.
- User can switch models smoothly.
- User can add up to 1 Text element and 1 Image element per bottle.
- User can choose an image from a preset or upload their own.
- MobX remains the single source of truth for all configuration state.
- Architecture remains clean, modular, and cleanly separates 2D domain logic from 3D rendering.
