import chroma from "chroma-js";
import cb from "color-blind";

/* ---------- Contrast helpers ---------- */

export const isValidHex = (color: string) =>
  /^#([0-9A-Fa-f]{3}){1,2}$/.test(color);

export const contrast = (fg: string, bg: string) => {
  if (!isValidHex(fg) || !isValidHex(bg)) return 0;
  return Number(chroma.contrast(fg, bg).toFixed(2));
};

export const passesWCAG = (fg: string, bg: string) => contrast(fg, bg) >= 4.5;



/* ---------- Color‑blind simulation ---------- */
export type BlindType = "protanopia" | "deuteranopia" | "tritanopia";

export const simulateBlindness = (hex: string, type: BlindType) =>
  (cb)[type](hex) as string;



/* ---------- Accessible‑alternative ----------
   Darken/lighten until WCAG passes, keep hue famliy */

export const suggestAccessible = (
  hex: string,
  bg: string,
  step = 0.1,
  limit = 3
): string => {
  if (!isValidHex(hex) || !isValidHex(bg)) return hex;

  let c = chroma(hex);
  for (let i = 0; i < limit * 10; i++) {
    if (passesWCAG(c.hex(), bg)) return c.hex();
    c = contrast(c.hex(), bg) < 4.5 ? c.darken(step) : c;
  }
  return c.hex();
};

