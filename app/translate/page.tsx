"use client";
import React from 'react';
import { toast } from 'react-hot-toast';
import { useTranslator } from '@/hooks/useTranslator';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// Languages supported by the translator
const languages = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'zh', name: 'Chinese' },
  { code: 'ru', name: 'Russian' },
  { code: 'ar', name: 'Arabic' },
  { code: 'hi', name: 'Hindi' },
  { code: 'bn', name: 'Bengali' },
  { code: 'tr', name: 'Turkish' },
  { code: 'vi', name: 'Vietnamese' },
  { code: 'sv', name: 'Swedish' },
  { code: 'nl', name: 'Dutch' },
];

const TranslatorPage: React.FC = () => {
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
  } = useTranslator();

  const handleTranslate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    await translate();
  };

  const handleSwapLanguages = () => {
    const temp = sourceLang;
    setSourceLang(targetLang);
    setTargetLang(temp);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  return (
    <section className="mx-auto max-w-4xl p-4">
      <div className="mb-8">
        <h1 className="mb-2 text-2xl font-bold">Translator</h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          Translate text between multiple languages.
        </p>
      </div>

      <form onSubmit={handleTranslate} className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="flex flex-col">
            <div className="mb-2 flex items-center justify-between">
              <select
                value={sourceLang}
                onChange={(e) => setSourceLang(e.target.value)}
                className="rounded border border-zinc-300 bg-white px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                disabled={isTranslating}
              >
                {languages.map((lang) => (
                  <option key={`source-${lang.code}`} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="h-40 w-full rounded-md border border-zinc-300 bg-white p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-900 dark:text-white"
              placeholder="Enter text to translate..."
              disabled={isTranslating}
            />
          </div>

          <div className="flex flex-col">
            <div className="mb-2 flex items-center justify-between">
              <select
                value={targetLang}
                onChange={(e) => setTargetLang(e.target.value)}
                className="rounded border border-zinc-300 bg-white px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                disabled={isTranslating}
              >
                {languages.map((lang) => (
                  <option key={`target-${lang.code}`} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>
              {output && (
                <button
                  type="button"
                  onClick={() => copyToClipboard(output)}
                  className="rounded bg-zinc-100 px-2 py-1 text-xs text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-600"
                >
                  Copy
                </button>
              )}
            </div>
            <div className="relative h-40">
              <div className="size-full rounded-md border border-zinc-300 bg-zinc-50 p-3 dark:border-zinc-600 dark:bg-zinc-900 dark:text-white overflow-auto">
                {output ? (
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />,
                        ul: ({node, ...props}) => <ul className="list-disc pl-6 mb-3" {...props} />,
                        ol: ({node, ...props}) => <ol className="list-decimal pl-6 mb-3" {...props} />,
                        li: ({node, ...props}) => <li className="mb-1" {...props} />,
                        h1: ({node, ...props}) => <h1 className="text-xl font-bold mb-2 mt-3" {...props} />,
                        h2: ({node, ...props}) => <h2 className="text-lg font-bold mb-2 mt-3" {...props} />,
                        h3: ({node, ...props}) => <h3 className="text-md font-bold mb-1 mt-2" {...props} />,
                        strong: ({node, ...props}) => <strong className="font-bold" {...props} />,
                        code: ({node, className, ...props}) => {
                          const match = /language-(\w+)/.exec(className || '');
                          const isInline = !match && (props.children?.toString() || '').split('\n').length <= 1;
                          return isInline ? 
                            <code className="bg-zinc-200 dark:bg-zinc-600 px-1 py-0.5 rounded" {...props} /> : 
                            <code className="block bg-zinc-200 dark:bg-zinc-600 p-2 rounded my-2 overflow-x-auto" {...props} />;
                        },
                        blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-zinc-300 dark:border-zinc-500 pl-3 py-1 italic my-2" {...props} />,
                      }}
                    >
                      {output}
                    </ReactMarkdown>
                  </div>
                ) : (
                  <span className="text-zinc-500">Translation will appear here</span>
                )}
              </div>
              {isTranslating && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/75 dark:bg-zinc-800/75">
                  <div className="animate-pulse text-zinc-500 dark:text-zinc-400">Translating...</div>
                </div>
              )}
              {error && (
                <div className="mt-2 rounded-md bg-red-50 p-2 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
                  {error}
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
            disabled={isTranslating}
          >
            ⇄
          </button>
          <button
            type="submit"
            className="rounded-md bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:focus:ring-offset-zinc-800"
            disabled={isTranslating || !input.trim()}
          >
            {isTranslating ? 'Translating...' : 'Translate'}
          </button>
        </div>
      </form>
    </section>
  );
};

export default TranslatorPage;
