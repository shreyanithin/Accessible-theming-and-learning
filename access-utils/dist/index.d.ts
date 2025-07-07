declare const getContrastRatio: (color1: string, color2: string) => number;
declare const hexToRgb: (hex: string) => {
    r: number;
    g: number;
    b: number;
} | null;
declare const rgbToHex: (r: number, g: number, b: number) => string;
declare const rgbToHsl: (r: number, g: number, b: number) => number[];
declare const hslToRgb: (h: number, s: number, l: number) => {
    r: number;
    g: number;
    b: number;
};
declare const isValidHex: (color: string) => boolean;
declare const findAccessibleColor: (color: string, background: string) => string;
declare const simulateColorBlindness: (hex: string) => {
    protanopia: string;
    deuteranopia: string;
    tritanopia: string;
};
export { getContrastRatio, hexToRgb, rgbToHex, rgbToHsl, hslToRgb, isValidHex, findAccessibleColor, simulateColorBlindness, };
