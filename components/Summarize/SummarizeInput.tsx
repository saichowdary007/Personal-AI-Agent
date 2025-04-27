"use client";
import React, { useState, useRef } from 'react';
import { toast } from 'react-hot-toast';

interface SummarizeInputProps {
  onSummarizeText: (text: string) => Promise<any>;
  onSummarizeFile: (file: File) => Promise<any>;
  isLoading: boolean;
}

const SummarizeInput: React.FC<SummarizeInputProps> = ({
  onSummarizeText,
  onSummarizeFile,
  isLoading
}) => {
  const [text, setText] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) {
      toast.error('Please enter some text to summarize');
      return;
    }
    onSummarizeText(text);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    const allowedTypes = ['application/pdf', 'text/plain'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Only PDF and TXT files are supported');
      return;
    }

    // Check file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB');
      return;
    }

    onSummarizeFile(file);
  };

  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-700 dark:bg-zinc-800">
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="text-to-summarize" className="mb-2 block font-medium text-zinc-700 dark:text-zinc-300">
            Text to Summarize
          </label>
          <textarea
            id="text-to-summarize"
            className="w-full rounded-md border border-zinc-300 p-3 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-900 dark:text-white"
            rows={8}
            placeholder="Paste text here to generate a summary..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={isLoading}
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="submit"
            className="rounded-md bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:focus:ring-offset-zinc-800"
            disabled={isLoading || !text.trim()}
          >
            {isLoading ? 'Summarizing...' : 'Summarize Text'}
          </button>

          <span className="text-sm text-zinc-500 dark:text-zinc-400">or</span>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="rounded-md bg-zinc-100 px-4 py-2 font-medium text-zinc-800 transition-colors hover:bg-zinc-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-600 dark:focus:ring-offset-zinc-800"
            disabled={isLoading}
          >
            Upload Document
          </button>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept=".pdf,.txt"
            onChange={handleFileUpload}
            disabled={isLoading}
          />
        </div>
      </form>
    </div>
  );
};

export default SummarizeInput; 