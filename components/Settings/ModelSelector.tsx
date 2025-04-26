"use client";
import React from 'react';
import { useSettings } from '@/hooks/useSettings';

const MODELS = [
  { value: 'gpt-4', label: 'GPT-4' },
  { value: 'gpt-3.5', label: 'GPT-3.5' },
  { value: 'custom', label: 'Custom Model' },
];

const ModelSelector: React.FC = () => {
  const { model, setModel } = useSettings();

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor="model-select" className="font-medium">Model</label>
      <select
        id="model-select"
        value={model}
        onChange={e => setModel(e.target.value)}
        className="w-48 rounded border border-zinc-300 bg-white px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-900"
      >
        {MODELS.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
};

export default ModelSelector;

/*
Key Points:
- Accessible dropdown for model selection.
- Uses useSettings hook for state.
*/
