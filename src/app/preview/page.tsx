'use client';
import { useEffect, useState, useRef } from 'react';
import { 
  Settings, X, Eye, Palette, Download, Share2, Volume2, VolumeX, 
  Type, Zap, Target, CheckCircle,
  FileText, Accessibility
} from 'lucide-react';

const colorBlindnessTypes = [
  { 
    id: 'original', 
    name: 'Original', 
    description: 'Default colors',
    prevalence: 'Baseline',
    perception: 'Full color spectrum visible',
    impact: 'All colors appear as intended by the designer',
    suggestion: 'This is your original design - use as reference for comparisons'
  },
  { 
    id: 'protanopia', 
    name: 'Protanopia', 
    description: 'Red-blind (Missing L-cones)',
    prevalence: '1% of males, 0.01% of females',
    perception: 'Reds appear dark/black, red-green confusion, reduced brightness in red spectrum',
    impact: 'Red buttons may be invisible, red text unreadable, red/green traffic lights indistinguishable',
    suggestion: 'Enhanced contrast, avoid red-only indicators, use blue-yellow combinations instead'
  },
  { 
    id: 'deuteranopia', 
    name: 'Deuteranopia', 
    description: 'Green-blind (Missing M-cones)',
    prevalence: '1% of males, 0.01% of females',
    perception: 'Greens appear beige/brown, red-green confusion, difficulty with nature scenes',
    impact: 'Green success messages invisible, form validation unclear, navigation elements blend together',
    suggestion: 'Use blue-orange contrasts, add icons to color-coded elements, increase luminance differences'
  },
  { 
    id: 'tritanopia', 
    name: 'Tritanopia', 
    description: 'Blue-blind (Missing S-cones)',
    prevalence: '0.001% (very rare)',
    perception: 'Blues appear greenish, yellows look pink/red, blue-yellow confusion',
    impact: 'Blue links invisible, sky/water imagery confusing, blue UI elements blend with background',
    suggestion: 'Use red-green contrasts, avoid blue-only call-to-action buttons, increase saturation'
  },
  { 
    id: 'protanomaly', 
    name: 'Protanomaly', 
    description: 'Red-weak (Shifted L-cones)',
    prevalence: '1% of males, 0.03% of females',
    perception: 'Reds appear dim/faded, some red-green confusion, reduced red sensitivity',
    impact: 'Red warnings less noticeable, red text harder to read, red elements appear washed out',
    suggestion: 'Brighten red elements, use high contrast, combine with non-color indicators'
  },
  { 
    id: 'deuteranomaly', 
    name: 'Deuteranomaly', 
    description: 'Green-weak (Shifted M-cones)',
    prevalence: '5% of males, 0.4% of females',
    perception: 'Greens appear more red/brown, mild red-green confusion, most common type',
    impact: 'Subtle green elements missed, nature imagery appears brown, green success states unclear',
    suggestion: 'Increase green saturation, use complementary colors, add textual confirmations'
  },
  { 
    id: 'tritanomaly', 
    name: 'Tritanomaly', 
    description: 'Blue-weak (Shifted S-cones)',
    prevalence: '0.01% (rare)',
    perception: 'Blues appear less vibrant, mild blue-yellow confusion, reduced blue sensitivity',
    impact: 'Blue links less obvious, blue UI elements fade into background, ocean imagery affected',
    suggestion: 'Enhance blue saturation, use warmer contrasts, avoid blue-only important elements'
  },
  { 
    id: 'achromatopsia', 
    name: 'Achromatopsia', 
    description: 'Complete color blindness (No cone function)',
    prevalence: '0.003% (very rare)',
    perception: 'Only shades of gray, no color perception, extreme light sensitivity',
    impact: 'All color-coded information invisible, relies entirely on contrast and brightness',
    suggestion: 'High contrast only, strong brightness differences, texture/pattern alternatives'
  },
  { 
    id: 'monochromacy', 
    name: 'Monochromacy', 
    description: 'Single cone type functioning',
    prevalence: '0.01% (rare)',
    perception: 'Limited color range, mostly grayscale with slight color tints',
    impact: 'Most color distinctions lost, heavy reliance on brightness and contrast',
    suggestion: 'Extreme contrast ratios, avoid color-only communication, use shapes and patterns'
  },
  { 
    id: 'normalized', 
    name: 'Normalized', 
    description: 'Universal design for all vision types',
    prevalence: '100% accessible',
    perception: 'Optimized for maximum accessibility across all vision types',
    impact: 'Works for everyone - no one is excluded from your content',
    suggestion: 'High contrast, multiple indicators, WCAG AAA compliance, future-proof design'
  }
];

// Color transformation functions for different types of color blindness
const transformColor = (color: string, type: string) => {
  const hex = color.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16) / 255;
  const g = parseInt(hex.substr(2, 2), 16) / 255;
  const b = parseInt(hex.substr(4, 2), 16) / 255;
  
  let newR = r, newG = g, newB = b;
  
  switch (type) {
    case 'protanopia':
      newR = 0.567 * r + 0.433 * g;
      newG = 0.558 * r + 0.442 * g;
      newB = 0.242 * g + 0.758 * b;
      break;
    case 'deuteranopia':
      newR = 0.625 * r + 0.375 * g;
      newG = 0.7 * r + 0.3 * g;
      newB = 0.3 * g + 0.7 * b;
      break;
    case 'tritanopia':
      newR = 0.95 * r + 0.05 * g;
      newG = 0.433 * g + 0.567 * b;
      newB = 0.475 * g + 0.525 * b;
      break;
    case 'protanomaly':
      newR = 0.817 * r + 0.183 * g;
      newG = 0.333 * r + 0.667 * g;
      newB = 0.125 * g + 0.875 * b;
      break;
    case 'deuteranomaly':
      newR = 0.8 * r + 0.2 * g;
      newG = 0.258 * r + 0.742 * g;
      newB = 0.142 * g + 0.858 * b;
      break;
    case 'tritanomaly':
      newR = 0.967 * r + 0.033 * g;
      newG = 0.33 * g + 0.67 * b;
      newB = 0.33 * g + 0.67 * b;
      break;
    case 'achromatopsia':
    case 'monochromacy':
      const gray = 0.299 * r + 0.587 * g + 0.114 * b;
      newR = newG = newB = gray;
      break;
    case 'normalized':
      const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
      if (luminance < 0.5) {
        newR = Math.max(0, r * 0.8);
        newG = Math.max(0, g * 0.8);
        newB = Math.max(0, b * 0.8);
      } else {
        newR = Math.min(1, r * 1.2);
        newG = Math.min(1, g * 1.2);
        newB = Math.min(1, b * 1.2);
      }
      break;
  }
  
  const toHex = (val: number) => {
    const hex = Math.round(Math.max(0, Math.min(255, val * 255))).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  
  return `#${toHex(newR)}${toHex(newG)}${toHex(newB)}`;
};

// Calculate contrast ratio
const calculateContrastRatio = (color1: string, color2: string) => {
  const getLuminance = (color: string) => {
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16) / 255;
    const g = parseInt(hex.substr(2, 2), 16) / 255;
    const b = parseInt(hex.substr(4, 2), 16) / 255;
    
    const [rs, gs, bs] = [r, g, b].map(c => {
      if (c <= 0.03928) return c / 12.92;
      return Math.pow((c + 0.055) / 1.055, 2.4);
    });
    
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  };
  
  const l1 = getLuminance(color1);
  const l2 = getLuminance(color2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  
  return (lighter + 0.05) / (darker + 0.05);
};

// Get WCAG compliance level
const getWCAGLevel = (ratio: number, isLargeText: boolean = false) => {
  if (isLargeText) {
    if (ratio >= 3) return { level: 'AAA', status: 'pass' };
    if (ratio >= 4.5) return { level: 'AA', status: 'pass' };
    return { level: 'Fail', status: 'fail' };
  } else {
    if (ratio >= 7) return { level: 'AAA', status: 'pass' };
    if (ratio >= 4.5) return { level: 'AA', status: 'pass' };
    return { level: 'Fail', status: 'fail' };
  }
};

// TTS functionality
const speak = (text: string) => {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    speechSynthesis.speak(utterance);
  }
};

const PreviewCard = ({ 
  primaryColor, 
  secondaryColor, 
  textColor, 
  colorBlindnessType,
  fontSize = 'base',
  showFocusIndicators = false,
  enableTTS = false
}: {
  primaryColor: string;
  secondaryColor: string;
  textColor: string;
  colorBlindnessType: string;
  fontSize?: 'small' | 'base' | 'large' | 'xl' | '2xl';
  showFocusIndicators?: boolean;
  enableTTS?: boolean;
}) => {
  const transformedPrimary = transformColor(primaryColor, colorBlindnessType);
  const transformedSecondary = transformColor(secondaryColor, colorBlindnessType);
  const transformedText = transformColor(textColor, colorBlindnessType);
  
  const fontSizeClasses = {
    small: 'text-sm',
    base: 'text-base',
    large: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl'
  };
  
  const handleTTS = (text: string) => {
    if (enableTTS) {
      speak(text);
    }
  };
  
  return (
    <div className="w-full max-w-2xl mx-auto rounded-lg overflow-hidden shadow-lg border">
      {/* Header */}
      <header 
        className={`p-6 text-white`}
        style={{ backgroundColor: transformedPrimary, color: transformedText }}
      >
        <div className="flex items-center justify-between">
          <h1 
            className={`font-bold ${fontSizeClasses[fontSize]} ${fontSize === '2xl' ? 'text-3xl' : ''}`}
            onClick={() => handleTTS('Your Brand Header')}
            style={{ cursor: enableTTS ? 'pointer' : 'default' }}
          >
            Your Brand
          </h1>
          <nav className="flex space-x-4">
            {['Home', 'About', 'Contact'].map((item) => (
              <a 
                key={item}
                href="#" 
                className={`hover:opacity-80 transition-all ${fontSizeClasses[fontSize]} ${
                  showFocusIndicators ? 'focus:outline-2 focus:outline-white focus:outline-dashed' : ''
                }`}
                onClick={() => handleTTS(`${item} navigation link`)}
                style={{ cursor: enableTTS ? 'pointer' : 'default' }}
              >
                {item}
              </a>
            ))}
          </nav>
        </div>
      </header>
      
      {/* Hero Section */}
      <div 
        className="p-8 text-center"
        style={{ backgroundColor: transformedSecondary, color: transformedText }}
      >
        <h2 
          className={`font-bold mb-4 ${fontSizeClasses[fontSize]} ${fontSize === '2xl' ? 'text-4xl' : ''}`}
          onClick={() => handleTTS('Welcome to Our Platform')}
          style={{ cursor: enableTTS ? 'pointer' : 'default' }}
        >
          Welcome to Our Platform
        </h2>
        <p 
          className={`mb-6 opacity-90 ${fontSizeClasses[fontSize]}`}
          onClick={() => handleTTS('Experience the difference with accessible design that works for everyone')}
          style={{ cursor: enableTTS ? 'pointer' : 'default' }}
        >
          Experience the difference with accessible design that works for everyone
        </p>
        <button 
          className={`px-6 py-3 rounded-lg font-semibold transition-all hover:scale-105 ${fontSizeClasses[fontSize]} ${
            showFocusIndicators ? 'focus:outline-2 focus:outline-black focus:outline-dashed' : ''
          }`}
          style={{ 
            backgroundColor: transformedPrimary, 
            color: transformedText,
            border: `2px solid ${transformedPrimary}`
          }}
          onClick={() => handleTTS('Get Started button')}
        >
          Get Started
        </button>
      </div>
      
      {/* Content Cards */}
      <div className="p-6 grid md:grid-cols-2 gap-6 bg-gray-50">
        {[1, 2, 3, 4].map((item) => (
          <div key={item} className="bg-white rounded-lg p-4 shadow-sm">
            <div 
              className="w-full h-32 rounded mb-4"
              style={{ backgroundColor: transformedSecondary }}
            />
            <h3 
              className={`font-semibold mb-2 ${fontSizeClasses[fontSize]}`} 
              style={{ color: transformedText, cursor: enableTTS ? 'pointer' : 'default' }}
              onClick={() => handleTTS(`Feature ${item}`)}
            >
              Feature {item}
            </h3>
            <p className={`text-sm text-gray-600 ${fontSizeClasses[fontSize]}`}>
              Description of feature {item} and its benefits for your users.
            </p>
          </div>
        ))}
      </div>
      
      {/* Footer */}
      <footer 
        className="p-6 text-center"
        style={{ backgroundColor: transformedPrimary, color: transformedText }}
      >
        <p className={fontSizeClasses[fontSize]}>&copy; 2025 Your Brand. Accessible by design.</p>
      </footer>
    </div>
  );
};

export default function PreviewPage() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(true); // Start with sidebar open
  const [colorBlindnessType, setColorBlindnessType] = useState('original');
  const [primaryColor, setPrimaryColor] = useState('#3b82f6');
  const [secondaryColor, setSecondaryColor] = useState('#f3f4f6');
  const [textColor, setTextColor] = useState('#1f2937');
  const [showComparison, setShowComparison] = useState(false);
  const [fontSize, setFontSize] = useState<'small' | 'base' | 'large' | 'xl' | '2xl'>('base');
  const [showFocusIndicators, setShowFocusIndicators] = useState(false);
  const [enableTTS, setEnableTTS] = useState(false);
  const [poppedType, setPoppedType] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    document.title = 'Accessible Theme Preview';
  }, []);

  useEffect(() => {
    if (!poppedType) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setPoppedType(null);
    }
    function handleClick(e: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        setPoppedType(null);
      }
    }
    document.addEventListener('keydown', handleKey);
    document.addEventListener('mousedown', handleClick);
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.removeEventListener('mousedown', handleClick);
    };
  }, [poppedType]);

  useEffect(() => { setMounted(true); }, []);

  const exportPalette = () => {
    const palette = {
      original: {
        primary: primaryColor,
        secondary: secondaryColor,
        text: textColor
      },
      accessible: {
        primary: transformColor(primaryColor, colorBlindnessType),
        secondary: transformColor(secondaryColor, colorBlindnessType),
        text: transformColor(textColor, colorBlindnessType)
      },
      type: colorBlindnessType,
      contrastRatio: calculateContrastRatio(primaryColor, textColor),
      wcagLevel: getWCAGLevel(calculateContrastRatio(primaryColor, textColor))
    };
    
    const dataStr = JSON.stringify(palette, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'accessible-color-palette.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const toggleTTS = () => {
    if (enableTTS) {
      speechSynthesis.cancel();
    }
    setEnableTTS(!enableTTS);
  };

  const currentType = colorBlindnessTypes.find(type => type.id === colorBlindnessType);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${isSettingsOpen ? 'ml-0' : 'ml-0'}`}>
        <main className="h-full overflow-y-auto p-4">
          {/* Header */}
          <div className="max-w-6xl mx-auto mb-8">
            <div className="flex items-center justify-between bg-white rounded-lg p-8 shadow-md border-b-4 border-blue-600">
              <div>
                <h1 className="text-4xl font-extrabold text-blue-900 drop-shadow-sm">Live Theme Preview</h1>
                <p className="text-lg font-bold text-black mt-2 bg-yellow-100 px-3 py-1 rounded inline-block shadow-sm">
                  Currently viewing: <span className="font-extrabold text-blue-800">{currentType?.name}</span>
                  {currentType?.description && <span className="font-normal text-gray-700"> - {currentType.description}</span>}
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setShowComparison(!showComparison)}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  <span>{showComparison ? 'Hide' : 'Show'} Comparison</span>
                </button>
                <button
                  onClick={exportPalette}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Export Palette</span>
                </button>
                <button
                  onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                  className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <Settings className="w-4 h-4" />
                  <span>{isSettingsOpen ? 'Hide' : 'Show'} Settings</span>
                </button>
              </div>
            </div>
          </div>

          {/* Color Input Panel */}
          <div className="max-w-6xl mx-auto mb-8">
            <div className="bg-almond-50 rounded-lg p-6 shadow-sm">
              <h2 className="text-lg font-semibold mb-4 flex items-center text-black">
                <Palette className="w-5 h-5 mr-2" />
                Customize the colors you wish to use for your site
              </h2>
              {mounted && (
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">
                      Primary Color
                    </label>
                    <input
                      type="color"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="w-full h-12 rounded-lg border border-gray-300 cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">
                      Secondary Color
                    </label>
                    <input
                      type="color"
                      value={secondaryColor}
                      onChange={(e) => setSecondaryColor(e.target.value)}
                      className="w-full h-12 rounded-lg border border-gray-300 cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">
                      Text Color
                    </label>
                    <input
                      type="color"
                      value={textColor}
                      onChange={(e) => setTextColor(e.target.value)}
                      className="w-full h-12 rounded-lg border border-gray-300 cursor-pointer"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Preview Section */}
          <div className="max-w-6xl mx-auto">
            {showComparison ? (
              <div className="grid lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-center text-black">Original</h3>
                  <PreviewCard 
                    primaryColor={primaryColor}
                    secondaryColor={secondaryColor}
                    textColor={textColor}
                    colorBlindnessType="original"
                    fontSize={fontSize}
                    showFocusIndicators={showFocusIndicators}
                    enableTTS={enableTTS}
                  />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-center text-black">
                    {currentType?.name} View
                  </h3>
                  <PreviewCard 
                    primaryColor={primaryColor}
                    secondaryColor={secondaryColor}
                    textColor={textColor}
                    colorBlindnessType={colorBlindnessType}
                    fontSize={fontSize}
                    showFocusIndicators={showFocusIndicators}
                    enableTTS={enableTTS}
                  />
                </div>
              </div>
            ) : (
              <div className="flex justify-center">
                <PreviewCard 
                  primaryColor={primaryColor}
                  secondaryColor={secondaryColor}
                  textColor={textColor}
                  colorBlindnessType={colorBlindnessType}
                  fontSize={fontSize}
                  showFocusIndicators={showFocusIndicators}
                  enableTTS={enableTTS}
                />
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Only render sidebar and modal after mount to avoid hydration mismatch */}
      {mounted && isSettingsOpen && (
        <div className="w-96 bg-white shadow-xl overflow-y-auto border-l">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold flex items-center">
                <Accessibility className="w-5 h-5 mr-2" />
                Accessibility Settings
              </h2>
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Quick Actions */}
            <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
              <h3 className="font-semibold text-green-900 mb-3 flex items-center">
                <Zap className="w-4 h-4 mr-2" />
                Quick Actions
              </h3>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={toggleTTS}
                  className={`flex items-center justify-center space-x-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                    enableTTS 
                      ? 'bg-green-600 text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {enableTTS ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                  <span>TTS {enableTTS ? 'ON' : 'OFF'}</span>
                </button>
                <button
                  onClick={() => setShowFocusIndicators(!showFocusIndicators)}
                  className={`flex items-center justify-center space-x-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                    showFocusIndicators 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  <Target className="w-4 h-4" />
                  <span>Focus {showFocusIndicators ? 'ON' : 'OFF'}</span>
                </button>
              </div>
            </div>
            
            {/* Font Size Control */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                <Type className="w-4 h-4 mr-2" />
                Font Size
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {(['small', 'base', 'large', 'xl', '2xl'] as const).map((size) => (
                  <button
                    key={size}
                    onClick={() => setFontSize(size as 'small' | 'base' | 'large' | 'xl' | '2xl')}
                    className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                      fontSize === size 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {size.charAt(0).toUpperCase() + size.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Color Vision Types */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 flex items-center">
                <Eye className="w-5 h-5 mr-2" />
                Color Vision Types
              </h3>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {colorBlindnessTypes.map((type) => (
                  <div key={type.id} className="border rounded-lg p-3 hover:bg-gray-50 transition-colors">
                    <label className="flex items-start space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        name="colorBlindnessType"
                        value={type.id}
                        checked={colorBlindnessType === type.id}
                        onChange={(e) => setColorBlindnessType(e.target.value)}
                        className="w-4 h-4 text-blue-600 mt-1 flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-gray-900">{type.name}</span>
                          <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                            {type.prevalence}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{type.description}</p>
                        <div className="space-y-2 text-xs">
                          <div className="bg-red-50 p-2 rounded border-l-2 border-red-200">
                            <p className="font-medium text-red-800">How they see:</p>
                            <p className="text-red-700">{type.perception}</p>
                          </div>
                          <div className="bg-orange-50 p-2 rounded border-l-2 border-orange-200">
                            <p className="font-medium text-orange-800">Impact on websites:</p>
                            <p className="text-orange-700">{type.impact}</p>
                          </div>
                          <div className="bg-green-50 p-2 rounded border-l-2 border-green-200">
                            <p className="font-medium text-green-800">Our solution:</p>
                            <p className="text-green-700">{type.suggestion}</p>
                          </div>
                        </div>
                      </div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Accessibility Tips */}
            <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border border-blue-200">
              <h4 className="font-medium text-blue-900 mb-3 flex items-center">
                <CheckCircle className="w-4 h-4 mr-2" />
                Accessibility Design Tips
              </h4>
              <div className="grid grid-cols-1 gap-3 text-sm">
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-1.5 flex-shrink-0"></div>
                  <span className="text-blue-800">Use contrast ratios of 4.5:1 for normal text, 3:1 for large text (WCAG AA)</span>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-green-600 rounded-full mt-1.5 flex-shrink-0"></div>
                  <span className="text-green-800">Never rely solely on color - always add icons, patterns, or text labels</span>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-purple-600 rounded-full mt-1.5 flex-shrink-0"></div>
                  <span className="text-purple-800">Test with multiple vision types - 8% of men and 0.5% of women are affected</span>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-orange-600 rounded-full mt-1.5 flex-shrink-0"></div>
                  <span className="text-orange-800">Use the &apos;Normalized&apos; option for universal design that works for everyone</span>
                </div>
              </div>
            </div>
            
            {/* Global Impact */}
            <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
              <h4 className="font-medium text-purple-900 mb-2 flex items-center">
                <Share2 className="w-4 h-4 mr-2" />
                Global Impact
              </h4>
              <p className="text-sm text-purple-800 mb-2">
                <strong>300+ million people worldwide</strong> experience some form of color vision difference.
              </p>
              <p className="text-xs text-purple-700">
                By making your website accessible, you&apos;re not just following guidelines - you&apos;re including millions of users who might otherwise struggle with your content.
              </p>
            </div>
            
            {/* Export Section */}
            <div className="mt-6 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
              <h4 className="font-medium text-yellow-900 mb-3 flex items-center">
                <FileText className="w-4 h-4 mr-2" />
                Export & Share
              </h4>
              <div className="space-y-2">
                <button
                  onClick={exportPalette}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Export Color Palette</span>
                </button>
                <button
                  onClick={() => {
                    const url = window.location.href;
                    navigator.clipboard.writeText(url);
                    alert('URL copied to clipboard!');
                  }}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Copy Share URL</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}