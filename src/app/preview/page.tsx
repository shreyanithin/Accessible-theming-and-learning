'use client';
import { useEffect, useState } from 'react';
import PreviewCard from '@/components/PreviewCard';

/* pulls vars already injected by main page when it opened the tab */
export default function PreviewPage() {
  const [mode, setMode] = useState<'original' | 'accessible'>('original');

  useEffect(() => {
    document.title = 'Theme Preview';
  }, []);

  const toggle = () => {
    const root = document.documentElement;
    const next = mode === 'original' ? 'accessible' : 'original';
    setMode(next);
    root.classList.toggle('accessible', next === 'accessible');
  };

  return (
    <main className="max-w-xl mx-auto p-6 space-y-6">
      <h1 className="text-xl font-bold">Live Theme Preview</h1>

      <button
        onClick={toggle}
        className="px-4 py-2 rounded bg-black text-white"
      >
        {mode === 'original' ? 'Show Accessible' : 'Show Original'}
      </button>

      <PreviewCard />
    </main>
  );
}
