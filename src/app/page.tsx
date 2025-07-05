'use client';
import { useState, useEffect } from 'react';
import ColorInput from '@/components/ColorInput';
import PreviewCard from '@/components/PreviewCard';
import {
  contrast,
  passesWCAG,
  simulateBlindness,
  suggestAccessible,
} from '@/lib/colorUtils';

type SimType = 'normal' | 'protanopia' | 'deuteranopia' | 'tritanopia';

export default function Home() {
  /* -------------- user‑selected colours -------------------- */
  const [primary, setPrimary] = useState('#ff0000');
  const [secondary, setSecondary] = useState('#00ff00');
  const [text, setText] = useState('#ffffff');

  /* -------------- generated accessible alternatives -------- */
  const [safe, setSafe] = useState({ p: '', s: '', t: '' });

  /* -------------- theme mode ------------------------------- */
  const [mode, setMode] = useState<'original' | 'accessible'>('original');

  /* Generate safer colours whenever user edits */
  useEffect(() => {
    setSafe({
      p: suggestAccessible(primary, '#fff'),
      s: suggestAccessible(secondary, '#fff'),
      t: suggestAccessible(text, primary),
    });
  }, [primary, secondary, text]);

  /* Inject CSS vars into <html> each render */
  useEffect(() => {
    const root = document.documentElement;
    const vars =
      mode === 'original'
        ? { '--primary': primary, '--secondary': secondary, '--text': text }
        : { '--primary': safe.p, '--secondary': safe.s, '--text': safe.t };

    Object.entries(vars).forEach(([k, v]) => root.style.setProperty(k, v));
    root.classList.toggle('accessible', mode === 'accessible');
  }, [mode, primary, secondary, text, safe]);

  /* Copy CSS snippet to clipboard */
  const copyCSS = () => {
    const css = `:root {\n  --primary:${safe.p};\n  --secondary:${safe.s};\n  --text:${safe.t};\n}`;
    navigator.clipboard.writeText(css);
    alert('CSS copied!');
  };

  /** Quick helper to render small simulation swatches */
  const Sim = ({ type }: {  type: SimType }) => (
    <div className="text-center">
      <div
        className="h-8 w-8 rounded mx-auto"
        style={{
          background:
            type === 'normal' ? primary : simulateBlindness(primary, type),
        }}
      />
      <span className="text-[10px]">{type}</span>
    </div>
  );

  return (
    <main className="max-w-xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold text-center">
         Accessible Theming Tool
      </h1>

      {/* *********  1. Brand colour inputs  ********* */}
      <section className="space-y-3">
        <ColorInput label="Primary" value={primary} onChange={setPrimary} />
        <ColorInput label="Secondary" value={secondary} onChange={setSecondary} />
        <ColorInput label="Text" value={text} onChange={setText} />
      </section>

      {/* *********  2. Contrast results  ********* */}
      <section className="text-sm space-y-1">
        <p>
          Text ↔ Primary contrast:{' '}
          <span
            className={passesWCAG(text, primary) ? 'text-green-600' : 'text-red-600'}
          >
            {contrast(text, primary)}
          </span>{' '}
          {passesWCAG(text, primary) ? 'PASS' : 'FAIL'}
        </p>
        <p>
          Text ↔ Secondary contrast:{' '}
          <span
            className={
              passesWCAG(text, secondary) ? 'text-green-600' : 'text-red-600'
            }
          >
            {contrast(text, secondary)}
          </span>{' '}
          {passesWCAG(text, secondary) ? 'PASS' : 'FAIL'}
        </p>
      </section>

      {/* *********  3. Color‑blind simulation swatches  ********* */}
      <section>
        <h2 className="font-semibold text-sm mb-1">Colour‑blind simulation</h2>
        <div className="flex gap-2">
          {(['normal', 'protanopia', 'deuteranopia', 'tritanopia'] as const).map(
            t => (
              <Sim key={t} type={t} />
            ),
          )}
        </div>
      </section>

      {/* *********  4. Accessible colour suggestions  ********* */}
      <section className="text-sm space-y-1">
        <h2 className="font-semibold">Suggested accessible colours</h2>
        <p>Primary → {safe.p}</p>
        <p>Secondary → {safe.s}</p>
      </section>

      {/* *********  5. Theme toggle  ********* */}
      <button
        onClick={() => setMode(m => (m === 'original' ? 'accessible' : 'original'))}
        className="px-4 py-2 rounded font-semibold bg-black text-white"
      >
        {mode === 'original' ? 'Use Accessible Theme' : 'Use Original Theme'}
      </button>

      {/* *********  6. Preview area  ********* */}
      <PreviewCard />

      {/* *********  7. Action buttons  ********* */}
      <div className="flex gap-4 mt-6">
        <button
          onClick={() => window.open('/preview', '_blank')}
          className="px-3 py-2 rounded border"
        >
          View Live Preview
        </button>

        <button onClick={copyCSS} className="px-3 py-2 rounded border">
          Copy CSS
        </button>
      </div>
    </main>
  );
}
