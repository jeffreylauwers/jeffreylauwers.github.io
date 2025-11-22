/**
 * Random OKLCH Color Generator
 * Generates random colors that respect light/dark mode preferences
 */

(function() {
  'use strict';

  function getSystemTheme() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function generateRandomOKLCH() {
    const isDark = getSystemTheme() === 'dark';
    
    // Generate random hue (0-360)
    const hue = Math.random() * 360;
    
    // Generate random chroma (0.05-0.15 for subtle, professional colors)
    const chroma = 0.05 + Math.random() * 0.10;
    
    // Set lightness based on theme for good contrast
    let bgLightness, textLightness;
    
    if (isDark) {
      // Dark mode: dark background, light text
      bgLightness = 0.15 + Math.random() * 0.10; // 15-25%
      textLightness = 0.88 + Math.random() * 0.08; // 88-96%
    } else {
      // Light mode: light background, dark text
      bgLightness = 0.88 + Math.random() * 0.08; // 88-96%
      textLightness = 0.18 + Math.random() * 0.10; // 18-28%
    }
    
    // Create complementary hues for variety
    const bgHue = hue;
    const textHue = (hue + 180 + (Math.random() * 60 - 30)) % 360;
    
    const background = `oklch(${bgLightness.toFixed(2)} ${chroma.toFixed(3)} ${bgHue.toFixed(0)})`;
    const text = `oklch(${textLightness.toFixed(2)} ${(chroma * 0.6).toFixed(3)} ${textHue.toFixed(0)})`;
    
    return { background, text };
  }

  function applyColors(colors) {
    document.body.style.backgroundColor = colors.background;
    document.body.style.color = colors.text;
    
    // Save to localStorage
    try {
      localStorage.setItem('savedColors', JSON.stringify(colors));
    } catch (e) {
      // Silent fail if localStorage is not available
    }
  }

  function randomizeColors() {
    const colors = generateRandomOKLCH();
    applyColors(colors);
  }

  function initializeColors() {
    // Check if we have saved colors
    try {
      const saved = localStorage.getItem('savedColors');
      
      if (saved) {
        const colors = JSON.parse(saved);
        applyColors(colors);
      } else {
        randomizeColors();
      }
    } catch (e) {
      // If localStorage fails, just generate new colors
      randomizeColors();
    }
  }

  // Listen for system theme changes and regenerate colors
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function() {
    randomizeColors();
  });

  // Initialize on page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeColors);
  } else {
    initializeColors();
  }

  // Expose randomizeColors globally if needed
  window.randomizeColors = randomizeColors;
})();
