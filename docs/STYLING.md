# Styling

Styled with vanilla css.

Styles are scoped using css nesting.

Custom properties for global reach in global.css

### Contents

- [Conceptualization](#conceptualization)
- [Reset](#reset)
- [Root](#root)
- [Common](#common)
- [Main Layout Grid](#main-layout-grid)
- [Background Noise Generator](#background-noise-generator)

---

## Conceptualization

- A container should only set it's intrinsic properties, not content placement.
- Use named grid class for the containers margins

## Reset

normalize.css imported in src/index.tsx, top-level component.

## Root

In src/global.css 

### Preloader

src/preloader.css for initial spinner.

### Custom Properties

Use kebab case.

## Common

common.css is imported in App.tsx for utility styles.

## Main Layout Grid

  Grid to set several page with padding the main-layout-grid creates the grid with default pad-start for children

  Override styles per child. 

  - main-layout-grid__full-width 
  - main-layout-grid__centered

  **Only Tempo Tapper has this been fully implemented.**

## Background Noise Generator

This component allows the creation of svg's for tiling as background image.

The images are output to the html element as inline svgs which are then availabe everywhere.

The component is used in the App.tsx for generation at App mount.

### Usage

```css
background-image: var(--noise-light);
```

The previous version defined the class directly:

```css
.noise-dark {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' width='500' height='500'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.7' numOctaves='10' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='500' height='500' fill='%2332312e'/%3E%3Crect width='500' height='500' filter='url(%23n)' opacity='0.4'/%3E%3C/svg%3E");
} 
```