"use client";
import React, { useState } from 'react';

interface CodeResult {
  code: string;
  explanation: string;
}

const CodeHelperPage: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<CodeResult | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsLoading(true);
    
    try {
      // Simulate API call - replace with actual implementation
      setTimeout(() => {
        setResult({
          code: `// Example ${language} code\nfunction example() {\n  console.log("Hello World");\n  // Based on prompt: ${prompt}\n}`,
          explanation: `This is a simple example of ${language} code that would address: "${prompt}"`
        });
        setIsLoading(false);
      }, 1500);
    } catch (error) {
      console.error('Error generating code:', error);
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  return (
    <section className="mx-auto max-w-4xl p-4">
      <div className="mb-8">
        <h1 className="mb-2 text-2xl font-bold">Code Helper</h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          Describe what code you need, and I'll generate it for you.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-[1fr_1fr]">
        <div>
          <form onSubmit={handleSubmit} className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-700 dark:bg-zinc-800">
            <div className="mb-4">
              <label htmlFor="prompt" className="mb-2 block font-medium text-zinc-700 dark:text-zinc-300">
                Describe what you need
              </label>
              <textarea
                id="prompt"
                className="w-full rounded-md border border-zinc-300 p-3 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-900 dark:text-white"
                rows={5}
                placeholder="E.g., 'Create a function that sorts an array of objects by a specific property'"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                disabled={isLoading}
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
                disabled={isLoading}
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
              type="submit"
              className="w-full rounded-md bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:focus:ring-offset-zinc-800"
              disabled={isLoading || !prompt.trim()}
            >
              {isLoading ? 'Generating...' : 'Generate Code'}
            </button>
          </form>
        </div>

        <div>
          {isLoading && (
            <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-700 dark:bg-zinc-800">
              <div className="h-8 w-24 animate-pulse rounded bg-zinc-200 dark:bg-zinc-700"></div>
              <div className="mt-4 h-40 animate-pulse rounded bg-zinc-200 dark:bg-zinc-700"></div>
            </div>
          )}

          {!isLoading && result && (
            <div className="rounded-lg border border-zinc-200 bg-white shadow-sm dark:border-zinc-700 dark:bg-zinc-800">
              <div className="border-b border-zinc-200 p-4 dark:border-zinc-700">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-zinc-700 dark:text-zinc-300">Generated Code</h3>
                  <button
                    onClick={() => copyToClipboard(result.code)}
                    className="rounded bg-zinc-100 px-2 py-1 text-xs text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-600"
                  >
                    Copy
                  </button>
                </div>
                <pre className="mt-2 overflow-x-auto rounded bg-zinc-50 p-3 text-sm font-mono dark:bg-zinc-900">
                  {result.code}
                </pre>
              </div>

              <div className="p-4">
                <h3 className="mb-2 font-semibold text-zinc-700 dark:text-zinc-300">Explanation</h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">{result.explanation}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default CodeHelperPage;
