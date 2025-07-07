import chroma from 'chroma-js';
import cb from 'color-blind';
const getContrastRatio = (color1, color2) => {
    try {
        return chroma.contrast(color1, color2);
    }
    catch {
        return 0;
    }
};
const hexToRgb = (hex) => {
    try {
        const [r, g, b] = chroma(hex).rgb();
        return { r, g, b };
    }
    catch {
        return null;
    }
};
const rgbToHex = (r, g, b) => {
    return chroma.rgb(r, g, b).hex();
};
const rgbToHsl = (r, g, b) => {
    const [h, s, l] = chroma.rgb(r, g, b).hsl();
    return [h * 1, s * 100, l * 100]; // scale s & l to 0–100
};
const hslToRgb = (h, s, l) => {
    const [r, g, b] = chroma.hsl(h, s / 100, l / 100).rgb();
    return { r: Math.round(r), g: Math.round(g), b: Math.round(b) };
};
const isValidHex = (color) => /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(color);
const findAccessibleColor = (color, background) => {
    if (!isValidHex(color) || !isValidHex(background))
        return color;
    const rgb = hexToRgb(color);
    const bgRgb = hexToRgb(background);
    if (!rgb || !bgRgb)
        return color;
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
        if (ratio >= 4.5)
            break;
    }
    return bestColor;
};
const simulateColorBlindness = (hex) => ({
    protanopia: cb.protanopia(hex),
    deuteranopia: cb.deuteranopia(hex),
    tritanopia: cb.tritanopia(hex),
});
export { getContrastRatio, hexToRgb, rgbToHex, rgbToHsl, hslToRgb, isValidHex, findAccessibleColor, simulateColorBlindness, };
