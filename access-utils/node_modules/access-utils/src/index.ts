import chroma from 'chroma-js';
import cb from 'color-blind';


const getContrastRatio = (color1: string, color2: string): number => {
  try {
    return chroma.contrast(color1, color2);
  } catch {
    return 0;
  }
};

const hexToRgb = (hex: string) => {
  try {
    const [r, g, b] = chroma(hex).rgb();
    return { r, g, b };
  } catch {
    return null;
  }
};

const rgbToHex = (r: number, g: number, b: number) => {
  return chroma.rgb(r, g, b).hex();
};

const rgbToHsl = (r: number, g: number, b: number) => {
  const [h, s, l] = chroma.rgb(r, g, b).hsl();
  return [h * 1, s * 100, l * 100]; // scale s & l to 0–100
};

const hslToRgb = (h: number, s: number, l: number) => {
  const [r, g, b] = chroma.hsl(h, s / 100, l / 100).rgb();
  return { r: Math.round(r), g: Math.round(g), b: Math.round(b) };
};

const isValidHex = (color: string) =>
  /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(color);

const findAccessibleColor = (color: string, background: string) => {
  if (!isValidHex(color) || !isValidHex(background)) return color;

  const rgb = hexToRgb(color);
  const bgRgb = hexToRgb(background);
  if (!rgb || !bgRgb) return color;

  const [h, s, l] = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const bgLum = chroma(background).luminance();
  const shouldGoDarker = bgLum > 0.5;

  let bestColor = color;
  let bestRatio = getContrastRatio(color, background);

  for (let i = 1; i <= 50; i++) {
    const step = i * 2;
    const newL = shouldGoDarker
      ? Math.max(5, l - step)
      : Math.min(95, l + step);
    const newRgb = hslToRgb(h, s, newL);
    const newHex = rgbToHex(newRgb.r, newRgb.g, newRgb.b);
    const ratio = getContrastRatio(newHex, background);

    if (ratio > bestRatio) {
      bestColor = newHex;
      bestRatio = ratio;
    }

    if (ratio >= 4.5) break;
  }

  return bestColor;
};

const simulateColorBlindness = (hex: string) => ({
  protanopia: cb.protanopia(hex),
  deuteranopia: cb.deuteranopia(hex),
  tritanopia: cb.tritanopia(hex),
});

export {
  getContrastRatio,
  hexToRgb,
  rgbToHex,
  rgbToHsl,
  hslToRgb,
  isValidHex,
  findAccessibleColor,
  simulateColorBlindness,
};
