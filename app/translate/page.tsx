"use client";
import React, { useState } from 'react';

const languages = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'ru', name: 'Russian' },
  { code: 'zh', name: 'Chinese' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'ar', name: 'Arabic' },
  { code: 'hi', name: 'Hindi' },
];

const TranslatorPage: React.FC = () => {
  const [sourceText, setSourceText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [sourceLanguage, setSourceLanguage] = useState('en');
  const [targetLanguage, setTargetLanguage] = useState('es');
  const [isLoading, setIsLoading] = useState(false);

  const handleTranslate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sourceText.trim()) return;

    setIsLoading(true);
    
    try {
      // Simulate API call - replace with actual implementation
      setTimeout(() => {
        setTranslatedText(`[Translated from ${sourceLanguage} to ${targetLanguage}]: ${sourceText}`);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error translating text:', error);
      setIsLoading(false);
    }
  };

  const handleSwapLanguages = () => {
    const temp = sourceLanguage;
    setSourceLanguage(targetLanguage);
    setTargetLanguage(temp);
    setTranslatedText('');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  return (
    <section className="mx-auto max-w-4xl p-4">
      <div className="mb-8">
        <h1 className="mb-2 text-2xl font-bold">Translator</h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          Translate text between multiple languages.
        </p>
      </div>

      <form onSubmit={handleTranslate}>
        <div className="grid gap-6 md:grid-cols-2">
          {/* Source Language Column */}
          <div className="flex flex-col">
            <div className="mb-2 flex items-center justify-between">
              <select
                value={sourceLanguage}
                onChange={(e) => setSourceLanguage(e.target.value)}
                className="rounded border border-zinc-300 bg-white px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                disabled={isLoading}
              >
                {languages.map((lang) => (
                  <option key={`source-${lang.code}`} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>
            <textarea
              value={sourceText}
              onChange={(e) => setSourceText(e.target.value)}
              placeholder="Enter text to translate"
              className="h-40 w-full rounded-md border border-zinc-300 p-3 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white"
              disabled={isLoading}
            />
          </div>

          {/* Center Controls */}
          <div className="flex flex-col items-center justify-center md:hidden">
            <button
              type="button"
              onClick={handleSwapLanguages}
              className="mb-2 rounded-full bg-zinc-100 p-2 text-zinc-700 hover:bg-zinc-200 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-600"
              aria-label="Swap languages"
              disabled={isLoading}
            >
              ⇅
            </button>
            <button
              type="submit"
              className="rounded-md bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:focus:ring-offset-zinc-800"
              disabled={isLoading || !sourceText.trim()}
            >
              {isLoading ? 'Translating...' : 'Translate'}
            </button>
          </div>

          {/* Target Language Column */}
          <div className="flex flex-col">
            <div className="mb-2 flex items-center justify-between">
              <select
                value={targetLanguage}
                onChange={(e) => setTargetLanguage(e.target.value)}
                className="rounded border border-zinc-300 bg-white px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                disabled={isLoading}
              >
                {languages.map((lang) => (
                  <option key={`target-${lang.code}`} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>
              {translatedText && (
                <button
                  type="button"
                  onClick={() => copyToClipboard(translatedText)}
                  className="rounded bg-zinc-100 px-2 py-1 text-xs text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-600"
                >
                  Copy
                </button>
              )}
            </div>
            <div className="relative h-40">
              <textarea
                value={translatedText}
                readOnly
                className="h-full w-full rounded-md border border-zinc-300 bg-zinc-50 p-3 focus:outline-none dark:border-zinc-600 dark:bg-zinc-900 dark:text-white"
                placeholder="Translation will appear here"
              />
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/75 dark:bg-zinc-800/75">
                  <div className="animate-pulse text-zinc-500 dark:text-zinc-400">Translating...</div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Desktop Controls */}
        <div className="mt-4 hidden items-center justify-center gap-4 md:flex">
          <button
            type="button"
            onClick={handleSwapLanguages}
            className="rounded-full bg-zinc-100 p-2 text-zinc-700 hover:bg-zinc-200 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-600"
            aria-label="Swap languages"
            disabled={isLoading}
          >
            ⇄
          </button>
          <button
            type="submit"
            className="rounded-md bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:focus:ring-offset-zinc-800"
            disabled={isLoading || !sourceText.trim()}
          >
            {isLoading ? 'Translating...' : 'Translate'}
          </button>
        </div>
      </form>
    </section>
  );
};

export default TranslatorPage;
