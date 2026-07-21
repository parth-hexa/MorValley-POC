# Design.md

# Wine Glass Viewer – Design Guidelines

This document defines the visual language of the application. Every screen, component, and future feature should follow these principles to maintain a premium, elegant, and luxury wine brand aesthetic.

---

# Design Philosophy

The UI should feel:

- Premium
- Minimal
- Editorial
- Luxury
- Spacious
- Calm
- Timeless

The interface should never feel like a typical SaaS dashboard.

Instead, it should resemble a luxury wine brand website where the product is the primary focus.

---

# Inspiration

Primary inspiration comes from the provided Morvalley website.

Characteristics:

- Large typography
- Lots of whitespace
- Thin borders
- Soft earthy colors
- Elegant serif fonts
- Minimal icons
- Almost no shadows
- Very few accent colors

---

# Color Palette

## Primary Background

Warm off-white instead of pure white.

```
#F7F6F2
```

---

## Secondary Background

Soft cream.

```
#F2F1EA
```

---

## Primary Accent

Muted sage green.

```
#7D9165
```

---

## Secondary Accent

Light sage.

```
#C8D0BF
```

---

## Text

Primary

```
#1A1A1A
```

Secondary

```
#555555
```

Muted

```
#888888
```

---

## Borders

Very thin.

```
#D8D8D8
```

1px only.

---

# Typography

## Headings

Elegant serif font.

Examples:

- Cormorant Garamond
- Bodoni
- Playfair Display

Characteristics:

- Large
- Thin
- High contrast
- Luxury appearance

---

## Body

Modern sans-serif.

Examples:

- Inter
- Manrope
- IBM Plex Sans

Readable and minimal.

---

# Layout

The application should always breathe.

Avoid crowded layouts.

Generous spacing is preferred over dense information.

Everything should align to a consistent grid.

---

# Overall Structure

```
------------------------------------------------

Header

------------------------------------------------

Canvas

                3D Viewer

                        Right Sidebar

------------------------------------------------
```

---

# Header

Height

```
80–100px
```

Contains:

- Logo centered
- Navigation/Menu on left
- Optional actions on right

Should remain visually lightweight.

---

# Canvas Area

The canvas is the hero section.

It occupies most of the viewport.

The glass model should always be the visual focus.

Nothing should visually compete with it.

---

# Right Sidebar

Inspired by the reference screenshots.

Characteristics:

- Rounded corners
- Sage green background
- Large padding
- Soft appearance

Contains placeholder sections such as:

- Model Selector
- Design Elements
- Upload
- Text

Future configurator tools will live here.

---

# Floating Toolbar

Floating action buttons should:

- Be vertically stacked
- Rounded
- Minimal
- Use line icons
- Match the sage color palette

Avoid large filled buttons.

---

# Cards

Cards should use:

- Large border radius
- Soft backgrounds
- No elevation
- No heavy shadows

Example

```
Radius

20px–28px
```

---

# Buttons

Buttons should be understated.

Preferred styles:

Primary

- Sage background
- White text

Secondary

- Transparent
- Thin border

Icon Buttons

- Circular
- Minimal
- Soft background

---

# Icons

Use outline icons whenever possible.

Recommended libraries:

- Lucide
- Remix Icons
- Heroicons

Icons should be:

- Thin
- Elegant
- Consistent

Avoid bulky icon sets.

---

# Borders

Use borders instead of shadows.

Preferred:

```
1px solid
```

Avoid thick outlines.

---

# Shadows

Very subtle.

Most components should have no shadow.

If needed:

```
0 4px 12px rgba(0,0,0,.05)
```

Never use heavy material-design shadows.

---

# Corners

Pure squared look matching the editorial Morvalley reference website.

Radius

```
0px
```

All elements (buttons, cards, panels, containers) must have sharp 90° edges with zero border radius.

---

# Animations

Animations should feel slow and premium.

Avoid bouncy interactions.

Recommended duration

```
200–350ms
```

Use:

- ease
- ease-in-out

Avoid spring animations unless specifically needed.

---

# Loading

During model changes:

- Fade current model
- Show centered loading indicator
- Fade in new model

No sudden popping.

---

# Spacing

Base spacing system

```
4
8
12
16
24
32
48
64
96
```

Always prefer larger spacing.

---

# Canvas Controls

Camera controls should feel invisible.

Interaction should be smooth.

Avoid showing large control widgets.

Only expose controls when necessary.

---

# Empty States

Empty states should be elegant.

Requirements:

- Simple icon
- Short title
- One descriptive sentence
- Large whitespace

Never use illustrations that distract from the product.

---

# Responsiveness

Desktop-first.

Breakpoints:

Desktop

```
≥1440px
```

Laptop

```
1200px
```

Tablet

```
768px
```

Mobile

```
<768px
```

Sidebar may collapse on smaller screens.

---

# Accessibility

Maintain sufficient contrast.

Interactive elements should:

- Have hover states
- Have keyboard focus styles
- Meet touch target guidelines

---

# Design Rules

Always:

- Keep layouts minimal.
- Use generous whitespace.
- Prioritize the 3D model.
- Maintain visual consistency.
- Use muted earthy colors.
- Prefer typography over decoration.
- Keep interactions subtle.
- Build reusable components.
- Design with future configurator features in mind.

Never:

- Use bright colors.
- Add unnecessary gradients.
- Use glassmorphism.
- Use neumorphism.
- Overuse shadows.
- Crowd the interface.
- Compete visually with the 3D viewer.
- Mix multiple design styles.
- Introduce inconsistent spacing or typography.

---

# Overall Experience

The application should feel less like a software tool and more like interacting with a luxury wine catalogue. Every UI decision should reinforce elegance, simplicity, and craftsmanship, ensuring that the 3D wine glass remains the centerpiece while the interface quietly supports the experience.