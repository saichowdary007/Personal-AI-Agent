"use client";
import React from 'react';
import { useCodeHelper } from '@/hooks/useCodeHelper';
import CodeEditor from '@/components/CodeHelper/CodeEditor';
import RunButton from '@/components/CodeHelper/RunButton';
import { toast } from 'react-hot-toast';

const CodeHelperPage: React.FC = () => {
  const {
    code,
    setCode,
    language,
    setLanguage,
    output,
    isRunning,
    error,
    runCode,
    prompt,
    setPrompt,
    isGenerating,
    generateCode
  } = useCodeHelper();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  return (
    <section className="mx-auto max-w-4xl p-4">
      <div className="mb-8">
        <h1 className="mb-2 text-2xl font-bold">Code Helper</h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          Generate and run code with AI assistance.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-[1fr_1fr]">
        <div>
          <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-700 dark:bg-zinc-800">
            <div className="mb-4">
              <label htmlFor="prompt" className="mb-2 block font-medium text-zinc-700 dark:text-zinc-300">
                Describe what code you need
              </label>
              <textarea
                id="prompt"
                className="w-full rounded-md border border-zinc-300 p-3 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-900 dark:text-white"
                rows={5}
                placeholder="E.g., 'Create a function that sorts an array of objects by a specific property'"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                disabled={isGenerating}
              />
            </div>

            <div className="mb-4">
              <label htmlFor="language" className="mb-2 block font-medium text-zinc-700 dark:text-zinc-300">
                Language
              </label>
              <select
                id="language"
                className="w-full rounded-md border border-zinc-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-900 dark:text-white"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                disabled={isGenerating || isRunning}
              >
                <option value="javascript">JavaScript</option>
                <option value="typescript">TypeScript</option>
                <option value="python">Python</option>
                <option value="java">Java</option>
                <option value="csharp">C#</option>
                <option value="cpp">C++</option>
                <option value="go">Go</option>
                <option value="rust">Rust</option>
                <option value="php">PHP</option>
                <option value="ruby">Ruby</option>
              </select>
            </div>

            <button
              onClick={generateCode}
              className="mb-4 w-full rounded-md bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:focus:ring-offset-zinc-800"
              disabled={isGenerating || !prompt.trim()}
            >
              {isGenerating ? 'Generating...' : 'Generate Code'}
            </button>

            <div className="mb-4">
              <label htmlFor="code-editor" className="mb-2 block font-medium text-zinc-700 dark:text-zinc-300">
                Code
              </label>
              <CodeEditor
                value={code}
                language={language}
                onChange={setCode}
                disabled={isRunning}
              />
            </div>

            <div className="flex justify-between">
              <RunButton
                onClick={runCode}
                loading={isRunning}
                disabled={!code.trim()}
              />
              
              <button
                onClick={() => copyToClipboard(code)}
                className="rounded px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-700"
                disabled={!code.trim()}
              >
                Copy Code
              </button>
            </div>

            {error && (
              <div className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-400">
                {error}
              </div>
            )}
          </div>
        </div>

        <div>
          <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-700 dark:bg-zinc-800">
            <h3 className="mb-2 font-semibold text-zinc-700 dark:text-zinc-300">Output</h3>
            {isRunning ? (
              <div className="h-48 animate-pulse rounded bg-zinc-100 dark:bg-zinc-700"></div>
            ) : (
              <pre className="h-48 overflow-auto rounded bg-zinc-50 p-3 text-sm font-mono dark:bg-zinc-900">
                {output || 'Run your code to see the output here.'}
              </pre>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CodeHelperPage;
