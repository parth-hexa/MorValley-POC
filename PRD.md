# PRD.md

# Wine Glass Viewer
Version: 1.0

---

# Overview

## Product Name

**Wine Glass Viewer**

---

## Goal

The application is a lightweight 3D viewer for wine glasses.

The application is **NOT** a product configurator at this stage.

Its primary responsibility is to display different wine glass models with a clean UI while maintaining a scalable architecture for future design/configuration features.

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

- Render selected glass model
- Handle lighting
- Handle environment
- Handle camera
- Handle controls
- Render at high quality
- Maintain responsive layout

---

## 2. Static Model Loading

All models are bundled with the application.

Directory structure:

```
public/
    models/
        wine-glass-01.glb
        wine-glass-02.glb
        wine-glass-03.glb
        ...
```

No backend is required.

Models are loaded directly from the public folder.

---

## 3. Model Selector

A model selector is placed in the **top-right corner**.

Purpose:

- Display available wine glass models
- Allow switching between models

Possible UI:

```
Glass Models

○ Classic
○ Bordeaux
○ Burgundy
○ Champagne
○ Stemless
```

---

## 4. Model Switching

When a new model is selected:

1. Previous model begins unloading
2. Loading animation appears
3. New model loads
4. New model fades in
5. Loading animation disappears

The user should never see an empty canvas.

---

## 5. Loading Animation

A loading animation is shown during model transitions.

Requirements:

- Smooth fade
- Blocks interaction while loading
- Driven from MobX state
- Works for every model change

Example flow:

```
Select Model

↓

Loading Overlay

↓

Load GLB

↓

Render Model

↓

Hide Loader
```

---

## 6. Design Panel (Placeholder)

The UI contains a right-side design panel similar to the provided reference.

Current version is **display only**.

No editing functionality is included.

Purpose:

- Reserve layout
- Validate future UX
- Prepare for later configurator features

Sections may include:

- Design Elements
- Uploads
- Text
- Placeholder cards

No business logic is required.

---

# UI Layout

```
---------------------------------------------------------
Header

---------------------------------------------------------

Canvas

                Wine Glass

                    |

                    |

                    |

             Right Design Panel

---------------------------------------------------------
```

---

# State Management

The application follows a **Single Source of Truth** architecture.

MobX manages all application state.

---

# StateManager

A single root manager owns the entire application state.

```
StateManager
│
├── DesignManager
│
└── Design3DManager
```

No other global state managers should exist.

---

# DesignManager

Responsible for all future 2D/editor state.

Current responsibilities:

- Selected model ID
- Loading state
- UI panel state

Future responsibilities:

- Images
- Text
- Layers
- Colors
- Decals

---

# Design3DManager

Responsible for all 3D-related state.

Responsibilities:

- Loaded GLTF
- Camera state
- Environment
- Renderer state
- Current model
- Loading progress
- Scene initialization

Future responsibilities:

- Material editing
- Camera presets
- Animations
- Shadows

---

# Application Flow

```
Application Starts

↓

Initialize StateManager

↓

Initialize DesignManager

↓

Initialize Design3DManager

↓

Load Default Model

↓

Render Scene

↓

User Selects Model

↓

Show Loader

↓

Load GLB

↓

Replace Scene Model

↓

Hide Loader
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

state/
    StateManager.ts
    DesignManager.ts
    Design3DManager.ts

three/
    loaders/
    environment/
    materials/
    camera/
    scene/

hooks/

utils/

assets/

public/
    models/
```

---

# Rendering

Rendering engine:

- React Three Fiber

Responsibilities:

- Scene
- Camera
- Lights
- Environment
- Controls
- Model rendering

---

# Performance Requirements

- Load only one model at a time
- Dispose previous model correctly
- Avoid memory leaks
- Prevent duplicate model loading
- Keep UI responsive during transitions
- Smooth loading experience

---

# Future Expansion

The architecture should support future features without major refactoring.

Potential additions include:

- Image uploads
- Text engraving
- Logo placement
- Material customization
- Lighting presets
- Camera presets
- HDR environments
- Screenshot export
- Product configurator
- Cart integration
- Backend synchronization

---

# Out of Scope (Version 1)

The following features are intentionally excluded:

- Product customization
- Image uploads
- Text editing
- Logo placement
- Material editing
- Backend APIs
- Authentication
- Saving projects
- Export functionality
- Cart/Checkout
- Orders
- Payment integration
- Multi-user collaboration
- Undo/Redo
- History management

---

# Success Criteria

- Application launches successfully.
- Default wine glass loads from the public folder.
- User can switch between multiple models.
- Loading animation is displayed during model transitions.
- Previous models are properly disposed.
- UI matches the provided layout.
- MobX remains the single source of truth.
- Rendering is fully powered by React Three Fiber.
- Architecture is clean, modular, and ready for future configurator features.
