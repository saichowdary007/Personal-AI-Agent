"use client";
import React from 'react';
import { Settings } from 'lucide-react';
import { EmailOptions as EmailOptionsType } from '@/hooks/useEmail';

interface EmailOptionsProps {
  onOptionsChange: (options: EmailOptionsType) => void;
  options: EmailOptionsType;
}

const EmailOptions: React.FC<EmailOptionsProps> = ({
  onOptionsChange,
  options
}) => {
  const handleToneChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as EmailOptionsType['tone'];
    onOptionsChange({
      ...options,
      tone: value
    });
  };

  const handleFormatChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as EmailOptionsType['format'];
    onOptionsChange({
      ...options,
      format: value
    });
  };

  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-700 dark:bg-zinc-800">
      <div className="mb-3 flex items-center gap-2">
        <Settings size={18} className="text-zinc-500" />
        <h3 className="font-semibold text-zinc-700 dark:text-zinc-300">Email Options</h3>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="tone" className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Tone
          </label>
          <select
            id="tone"
            value={options.tone}
            onChange={handleToneChange}
            className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-900 dark:text-white"
          >
            <option value="professional">Professional</option>
            <option value="casual">Casual</option>
            <option value="formal">Formal</option>
            <option value="friendly">Friendly</option>
          </select>
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            Select the tone for your email
          </p>
        </div>

        <div>
          <label htmlFor="format" className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Format
          </label>
          <select
            id="format"
            value={options.format}
            onChange={handleFormatChange}
            className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-900 dark:text-white"
          >
            <option value="full">Full Email</option>
            <option value="reply">Reply Email</option>
            <option value="forward">Forward Email</option>
          </select>
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            Choose the email format
          </p>
        </div>

        <div className="rounded-md bg-blue-50 p-3 dark:bg-blue-900/20">
          <h4 className="font-medium text-blue-700 dark:text-blue-400">Email Writing Tips</h4>
          <ul className="mt-1 list-inside list-disc space-y-1 text-xs text-blue-600 dark:text-blue-300">
            <li>Be clear and concise</li>
            <li>Use a descriptive subject line</li>
            <li>Keep paragraphs short and focused</li>
            <li>Proofread before sending</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default EmailOptions; 