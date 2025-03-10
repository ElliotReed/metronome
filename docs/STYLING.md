# Styling

Styled with vanilla css.

Styles are scoped using css nesting.

Custom properties for global reach in global.css

## Reset

normalize.css imported in src/index.tsx, top-level component.

## Root

In src/global.css

### Custom Properties

Use kebab case.

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