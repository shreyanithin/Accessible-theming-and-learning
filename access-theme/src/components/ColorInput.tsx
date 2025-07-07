'use client';
import { Dispatch, SetStateAction } from 'react';

/** Small reusable colour‑picker row */
type Props = {
  label: string;
  value: string;
  onChange: Dispatch<SetStateAction<string>>;
};

export default function ColorInput({ label, value, onChange }: Props) {
  return (
    <div className="flex items-center gap-2">
      <span className="w-24 font-medium">{label}</span>

      {/* native colour picker */}
      <input
        type="color"
        value={value}
        onChange={e => onChange(e.target.value)}
        className="h-10 w-10 border rounded"
      />

      {/* hex textbox */}
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-28 px-2 py-1 border rounded text-sm text-black bg-gray-50"
      />
    </div>
  );
}

