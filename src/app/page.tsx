'use client';
import { useState } from 'react';
import { Eye, Copy, Palette, Check, X, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { findAccessibleColor, simulateColorBlindness, getContrastRatio } from 'access-utils';


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
        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono text-sm text-gray-400"
        placeholder="#000000"
      />
    </div>
  </div>
);


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
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-emerald-100 to-white p-6" suppressHydrationWarning>
      {/* Reference Book Button */}
      <div className="text-center mb-8">
        <div className="flex justify-between items-center mb-4 ">
          <div></div> {/* Spacer */}
          <button className="px-6 py-5 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors shadow-md text-xl">
            Reference Book
          </button>
        </div>
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500 rounded-full mb-4 ">
          <Palette className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-6xl font-bold text-gray-900 mb-2">Accessible Colour Tool</h1>
        <p className="text-2xl text-gray-600 pt-9 mb-20">Create WCAG-compliant colour schemes</p>
      </div>
      
      <div className="max-w-4xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center text-black">
                <Palette className="w-5 h-5 mr-2 " /> Colours
              </h2>
              <div className="space-y-4">
                <ColorInput label="Primary" value={primary} onChange={setPrimary} />
                <ColorInput label="Secondary" value={secondary} onChange={setSecondary} />
                <ColorInput label="Text" value={text} onChange={setText} />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center text-black">
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
              {/* Color Blindness Simulation Boxes */}
              <div className="mt-6">
                <h3 className="text-md font-semibold mb-2 text-gray-800">Color Blindness Simulation (Primary Color)</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {/* Normal */}
                  <div className="flex flex-col items-center p-3 bg-gray-50 rounded">
                    <div className="w-8 h-8 rounded border mb-2" style={{ backgroundColor: primary }} />
                    <span className="text-xs font-medium text-gray-700">Normal</span>
                    <span className="text-[10px] text-gray-500 font-mono">{primary}</span>
                  </div>
                  {/* Protanopia */}
                  <div className="flex flex-col items-center p-3 bg-gray-50 rounded">
                    <div className="w-8 h-8 rounded border mb-2" style={{ backgroundColor: simulateColorBlindness(primary).protanopia }} />
                    <span className="text-xs font-medium text-gray-700">Protanopia</span>
                    <span className="text-[10px] text-gray-500 font-mono">{simulateColorBlindness(primary).protanopia}</span>
                  </div>
                  {/* Deuteranopia */}
                  <div className="flex flex-col items-center p-3 bg-gray-50 rounded">
                    <div className="w-8 h-8 rounded border mb-2" style={{ backgroundColor: simulateColorBlindness(primary).deuteranopia }} />
                    <span className="text-xs font-medium text-gray-700">Deuteranopia</span>
                    <span className="text-[10px] text-gray-500 font-mono">{simulateColorBlindness(primary).deuteranopia}</span>
                  </div>
                  {/* Tritanopia */}
                  <div className="flex flex-col items-center p-3 bg-gray-50 rounded">
                    <div className="w-8 h-8 rounded border mb-2" style={{ backgroundColor: simulateColorBlindness(primary).tritanopia }} />
                    <span className="text-xs font-medium text-gray-700">Tritanopia</span>
                    <span className="text-[10px] text-gray-500 font-mono">{simulateColorBlindness(primary).tritanopia}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6 text-black">
              <h2 className="text-xl font-semibold mb-4">Accessible Alternatives</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 rounded border " style={{ backgroundColor: accessiblePrimary }} />
                    <span className="text-sm font-mono ">{accessiblePrimary}</span>
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
              <div className="flex items-center justify-between mb-4 text-black">
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
                <Link href="/preview" className="px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold shadow hover:bg-purple-700 transition-colors text-lg focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2">
                  Try it yourself
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}