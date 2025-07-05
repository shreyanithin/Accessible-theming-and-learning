'use client';
import { useState } from 'react';
import { Eye, Copy, Palette, Check, X, ExternalLink } from 'lucide-react';
import Link from 'next/link';

const ColorInput = ({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) => (
  <div className="space-y-2">
    <label className="text-sm font-medium text-gray-700">{label}</label>
    <div className="flex items-center space-x-3">
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-12 h-12 rounded-lg border-2 border-gray-200 cursor-pointer"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono text-sm"
        placeholder="#000000"
      />
    </div>
  </div>
);

const isValidHex = (color: string) => /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(color);

const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
};

const rgbToHex = (r: number, g: number, b: number) => 
  "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);

const getLuminance = (r: number, g: number, b: number) => {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
};

const getContrastRatio = (color1: string, color2: string) => {
  if (!isValidHex(color1) || !isValidHex(color2)) return 0;
  
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);
  if (!rgb1 || !rgb2) return 0;
  
  const lum1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
  const lum2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);
  
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  
  return (brightest + 0.05) / (darkest + 0.05);
};

const rgbToHsl = (r: number, g: number, b: number) => {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const diff = max - min;
  const add = max + min;
  const l = add * 0.5;
  
  let s = 0, h = 0;
  if (diff !== 0) {
    s = l < 0.5 ? diff / add : diff / (2 - add);
    switch (max) {
      case r: h = ((g - b) / diff) + (g < b ? 6 : 0); break;
      case g: h = (b - r) / diff + 2; break;
      case b: h = (r - g) / diff + 4; break;
    }
    h /= 6;
  }
  return [h * 360, s * 100, l * 100];
};

const hslToRgb = (h: number, s: number, l: number) => {
  h /= 360; s /= 100; l /= 100;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs((h * 6) % 2 - 1));
  const m = l - c / 2;
  let r = 0, g = 0, b = 0;
  
  if (h < 1/6) [r, g, b] = [c, x, 0];
  else if (h < 2/6) [r, g, b] = [x, c, 0];
  else if (h < 3/6) [r, g, b] = [0, c, x];
  else if (h < 4/6) [r, g, b] = [0, x, c];
  else if (h < 5/6) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  
  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255)
  };
};

const findAccessibleColor = (color: string, background: string) => {
  if (!isValidHex(color) || !isValidHex(background)) return color;
  
  const rgb = hexToRgb(color);
  const bgRgb = hexToRgb(background);
  if (!rgb || !bgRgb) return color;
  
  const [h, s, l] = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const bgLum = getLuminance(bgRgb.r, bgRgb.g, bgRgb.b);
  
  // Determine if we need to go darker or lighter
  const shouldGoDarker = bgLum > 0.5;
  
  // Start with current lightness and adjust incrementally
  let bestColor = color;
  let bestRatio = getContrastRatio(color, background);
  
  // Try adjusting lightness in steps
  for (let i = 1; i <= 50; i++) {
    const step = i * 2;
    const newL = shouldGoDarker ? Math.max(5, l - step) : Math.min(95, l + step);
    
    const newRgb = hslToRgb(h, s, newL);
    const newHex = rgbToHex(newRgb.r, newRgb.g, newRgb.b);
    const ratio = getContrastRatio(newHex, background);
    
    if (ratio > bestRatio) {
      bestColor = newHex;
      bestRatio = ratio;
    }
    
    // If we found a good ratio, stop here to stay close to original
    if (ratio >= 4.5) break;
  }
  
  return bestColor;
};

const ContrastBadge = ({ ratio, passes }: { ratio: number; passes: boolean }) => (
  <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
    passes ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
  }`}>
    {passes ? <Check className="w-3 h-3 mr-1" /> : <X className="w-3 h-3 mr-1" />}
    {ratio.toFixed(1)}:1 {passes ? 'PASS' : 'FAIL'}
  </div>
);

export default function AccessibleColorTool() {
  const [primary, setPrimary] = useState('#3b82f6');
  const [secondary, setSecondary] = useState('#10b981');
  const [text, setText] = useState('#1f2937');
  const [background] = useState('#ffffff');
  const [mode, setMode] = useState<'original' | 'accessible'>('original');
  const [copied, setCopied] = useState(false);

  // Calculate accessible alternatives
  const accessiblePrimary = findAccessibleColor(primary, background);
  const accessibleSecondary = findAccessibleColor(secondary, background);
  const accessibleText = findAccessibleColor(text, background);

  // Current colors based on mode
  const currentPrimary = mode === 'accessible' ? accessiblePrimary : primary;
  const currentSecondary = mode === 'accessible' ? accessibleSecondary : secondary;
  const currentText = mode === 'accessible' ? accessibleText : text;

  // Contrast calculations
  const primaryContrast = getContrastRatio(currentPrimary, background);
  const secondaryContrast = getContrastRatio(currentSecondary, background);
  const textContrast = getContrastRatio(currentText, background);

  const copyCSS = () => {
    const css = `:root {
  --primary: ${accessiblePrimary};
  --secondary: ${accessibleSecondary};
  --text: ${accessibleText};
  --background: ${background};
}`;
    navigator.clipboard.writeText(css);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500 rounded-full mb-4">
            <Palette className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Accessible Color Tool</h1>
          <p className="text-gray-600">Create WCAG-compliant color schemes</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Palette className="w-5 h-5 mr-2" /> Colors
              </h2>
              <div className="space-y-4">
                <ColorInput label="Primary" value={primary} onChange={setPrimary} />
                <ColorInput label="Secondary" value={secondary} onChange={setSecondary} />
                <ColorInput label="Text" value={text} onChange={setText} />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Eye className="w-5 h-5 mr-2" /> Contrast Analysis
              </h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Primary vs Background</span>
                  <ContrastBadge ratio={primaryContrast} passes={primaryContrast >= 4.5} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Secondary vs Background</span>
                  <ContrastBadge ratio={secondaryContrast} passes={secondaryContrast >= 4.5} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Text vs Background</span>
                  <ContrastBadge ratio={textContrast} passes={textContrast >= 4.5} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Accessible Alternatives</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 rounded border" style={{ backgroundColor: accessiblePrimary }} />
                    <span className="text-sm font-mono">{accessiblePrimary}</span>
                  </div>
                  <span className="text-xs text-gray-500">Primary ({getContrastRatio(accessiblePrimary, background).toFixed(1)}:1)</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 rounded border" style={{ backgroundColor: accessibleSecondary }} />
                    <span className="text-sm font-mono">{accessibleSecondary}</span>
                  </div>
                  <span className="text-xs text-gray-500">Secondary ({getContrastRatio(accessibleSecondary, background).toFixed(1)}:1)</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 rounded border" style={{ backgroundColor: accessibleText }} />
                    <span className="text-sm font-mono">{accessibleText}</span>
                  </div>
                  <span className="text-xs text-gray-500">Text ({getContrastRatio(accessibleText, background).toFixed(1)}:1)</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Preview Mode</h2>
                <button
                  onClick={() => setMode(m => m === 'original' ? 'accessible' : 'original')}
                  className={`px-4 py-2 rounded font-medium transition-colors ${
                    mode === 'accessible' 
                      ? 'bg-green-500 text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {mode === 'original' ? 'Show Accessible' : 'Show Original'}
                </button>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                {mode === 'original' ? 'Viewing original colors' : 'Viewing accessible colors'}
              </p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4" style={{ color: currentPrimary }}>
                Sample Component
              </h3>
              <p className="mb-4" style={{ color: currentText }}>
                This preview shows how your colors look in a real interface.
              </p>
              <div className="flex space-x-3">
                <button
                  className="px-4 py-2 rounded font-medium text-white"
                  style={{ backgroundColor: currentPrimary }}
                >
                  Primary Action
                </button>
                <button
                  className="px-4 py-2 rounded font-medium text-white"
                  style={{ backgroundColor: currentSecondary }}
                >
                  Secondary Action
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Export & Preview</h2>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => window.open('/preview', '_blank')}
                  className="flex items-center justify-center px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
                >
                  <ExternalLink className="w-4 h-4 mr-2" /> Live Preview
                </button>
                <button
                  onClick={copyCSS}
                  className={`flex items-center justify-center px-4 py-3 rounded-lg font-medium transition-colors ${
                    copied ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  <Copy className="w-4 h-4 mr-2" /> {copied ? 'Copied!' : 'Copy CSS'}
                </button>
              </div>
              <div className="mt-4 flex justify-center">
                <Link href="/preview" legacyBehavior>
                  <a className="px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold shadow hover:bg-purple-700 transition-colors text-lg focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2">
                    Try it yourself
                  </a>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}