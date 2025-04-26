"use client";
import React from 'react';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import ErrorState from '@/components/ErrorState';
import { useTranslator } from '@/hooks/useTranslator';

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Spanish' },
  { code: 'fr', label: 'French' },
  { code: 'de', label: 'German' },
  { code: 'zh', label: 'Chinese' },
  // ...add more as needed
];

const TranslatorPanel: React.FC = () => {
  const {
    input,
    setInput,
    sourceLang,
    setSourceLang,
    targetLang,
    setTargetLang,
    output,
    isTranslating,
    error,
    translate,
    retry,
  } = useTranslator();

  return (
    <form className="mx-auto flex max-w-lg flex-col gap-4" onSubmit={e => {e.preventDefault(); translate();}} aria-label="Translator">
      <div className="flex gap-2">
        <label htmlFor="source-lang" className="font-medium">From</label>
        <select
          id="source-lang"
          value={sourceLang}
          onChange={e => setSourceLang(e.target.value)}
          className="rounded border border-zinc-300 bg-white px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-900"
          disabled={isTranslating}
        >
          {LANGUAGES.map(lang => (
            <option key={lang.code} value={lang.code}>{lang.label}</option>
          ))}
        </select>
        <label htmlFor="target-lang" className="ml-4 font-medium">To</label>
        <select
          id="target-lang"
          value={targetLang}
          onChange={e => setTargetLang(e.target.value)}
          className="rounded border border-zinc-300 bg-white px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-900"
          disabled={isTranslating}
        >
          {LANGUAGES.map(lang => (
            <option key={lang.code} value={lang.code}>{lang.label}</option>
          ))}
        </select>
      </div>
      <textarea
        className="h-32 w-full resize-y rounded-lg border border-zinc-300 bg-zinc-50 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-900"
        value={input}
        onChange={e => setInput(e.target.value)}
        aria-label="Text to translate"
        placeholder="Enter text to translate..."
        disabled={isTranslating}
        required
      />
      <button
        type="submit"
        className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
        disabled={isTranslating || !input.trim()}
        aria-disabled={isTranslating || !input.trim()}
      >
        {isTranslating ? 'Translating...' : 'Translate'}
      </button>
      {isTranslating && <LoadingSkeleton className="h-8 w-full" />}
      {output && (
        <div className="mt-2 whitespace-pre-wrap rounded bg-zinc-100 p-3 text-base text-zinc-800 dark:bg-zinc-800 dark:text-zinc-100">
          <span className="font-semibold">Translation:</span>\n{output}
        </div>
      )}
      {error && (
        <ErrorState message={error} onRetry={retry} />
      )}
    </form>
  );
};

export default TranslatorPanel;

/*
Key Points:
- Language selectors, textarea input, translate button, and output.
- Accessible and responsive.
- Uses useTranslator hook for state and API.
*/
