import React, { useEffect } from 'react';

interface NoiseBackgroundGeneratorProps {
  //  CSS variable name to get the color from (e.g. '--clr-primary') 
  sourceColorVar: string;
  //  CSS variable name to set the noise background to  (e.g. '--bg-noise-primary') 
  targetBackgroundVar: string;
  //  Fallback color if the source variable isn't found
  fallbackColor?: string;
  //  Noise opacity (0-1)
  opacity?: number;
  // Noise frequency (higher = finer grain)
  baseFrequency?: number;
  // Noise complexity (higher = more detail) 
  numOctaves?: number;
}

// Generates an SVG noise background and sets it as a CSS variable
export const NoiseBackgroundGenerator: React.FC<NoiseBackgroundGeneratorProps> = ({
  sourceColorVar,
  targetBackgroundVar,
  fallbackColor = '#929691', // --clr-primary
  opacity = 0.4,
  baseFrequency = 0.7,
  numOctaves = 10
}) => {
  useEffect(() => {
    // Get the color from CSS variables
    const color = getComputedStyle(document.documentElement)
      .getPropertyValue(`${sourceColorVar}`)
      .trim() || fallbackColor;

    // Create SVG with noise filter using the color
    const svg = `
      <svg xmlns='http://www.w3.org/2000/svg' width='500' height='500'>
        <filter id='noise'>
          <feTurbulence 
            type='fractalNoise' 
            baseFrequency='${baseFrequency}' 
            numOctaves='${numOctaves}' 
            stitchTiles='stitch'
          />
        </filter>
        <rect width='500' height='500' fill='${color}' />
        <rect width='500' height='500' filter='url(#noise)' opacity='${opacity}'/>
      </svg>
    `;

    // Properly encode the SVG for use in CSS
    const encodedSvg = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;

    // Set the CSS variable globally
    document.documentElement.style.setProperty(`${targetBackgroundVar}`, `url("${encodedSvg}")`);
  }, [sourceColorVar, targetBackgroundVar, fallbackColor, opacity, baseFrequency, numOctaves]);

  return null;
};
