"use client";
import React, { useState } from 'react';
import { Settings } from 'lucide-react';

interface SummarizeOptionsProps {
  onOptionsChange?: (options: any) => void;
}

const SummarizeOptions: React.FC<SummarizeOptionsProps> = ({
  onOptionsChange
}) => {
  const [format, setFormat] = useState<'paragraph' | 'bullets' | 'outline'>('paragraph');
  const [maxLength, setMaxLength] = useState<number>(500);

  // Update options when changed
  const handleFormatChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newFormat = e.target.value as 'paragraph' | 'bullets' | 'outline';
    setFormat(newFormat);
    if (onOptionsChange) {
      onOptionsChange({ format: newFormat, maxLength });
    }
  };

  const handleLengthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newLength = parseInt(e.target.value);
    setMaxLength(newLength);
    if (onOptionsChange) {
      onOptionsChange({ format, maxLength: newLength });
    }
  };

  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-700 dark:bg-zinc-800">
      <div className="mb-3 flex items-center gap-2">
        <Settings size={18} className="text-zinc-500" />
        <h3 className="font-semibold text-zinc-700 dark:text-zinc-300">Summary Options</h3>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="format" className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Format
          </label>
          <select
            id="format"
            value={format}
            onChange={handleFormatChange}
            className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-900 dark:text-white"
          >
            <option value="paragraph">Paragraph</option>
            <option value="bullets">Bullet Points</option>
            <option value="outline">Outline</option>
          </select>
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            Choose how the summary should be structured
          </p>
        </div>

        <div>
          <label htmlFor="max-length" className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Maximum Length
          </label>
          <div className="flex items-center gap-3">
            <input
              id="max-length"
              type="range"
              min="100"
              max="1000"
              step="50"
              value={maxLength}
              onChange={handleLengthChange}
              className="w-full"
            />
            <span className="w-16 text-center text-sm text-zinc-700 dark:text-zinc-300">
              {maxLength}
            </span>
          </div>
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            Target length in characters for the summary
          </p>
        </div>

        <div className="rounded-md bg-blue-50 p-3 dark:bg-blue-900/20">
          <h4 className="font-medium text-blue-700 dark:text-blue-400">Pro Tips</h4>
          <ul className="mt-1 list-inside list-disc space-y-1 text-xs text-blue-600 dark:text-blue-300">
            <li>Use bullets for key points extraction</li>
            <li>Outlines work best for structured content</li>
            <li>For articles, shorter summaries (300-500 chars) are often clearer</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SummarizeOptions; 