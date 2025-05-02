"use client";
import React, { useState, useEffect, useRef } from 'react';
import { useCodeHelper } from '@/hooks/useCodeHelper';
import CodeEditor from '@/components/CodeHelper/CodeEditor';
import RunButton from '@/components/CodeHelper/RunButton';
import { toast } from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

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
    generateCode,
    codeExplanation,
    clearOutput,
    clearAll
  } = useCodeHelper();
  
  // Keep track of what's currently displayed in the output area
  const [displayMode, setDisplayMode] = useState<'execution' | 'explanation'>('execution');
  const [displayedOutput, setDisplayedOutput] = useState<string | null>(null);
  
  // Add a ref to scroll to output when it changes
  const outputRef = useRef<HTMLDivElement>(null);

  // Update the displayed output when code is executed or generated
  useEffect(() => {
    if (output) {
      setDisplayMode('execution');
      setDisplayedOutput(output);
    } else if (codeExplanation) {
      setDisplayMode('explanation');
      setDisplayedOutput(codeExplanation);
    } else {
      setDisplayedOutput(null);
    }
    
    // Scroll to output section when it changes
    if ((output || codeExplanation) && outputRef.current) {
      if (window.innerWidth < 768) { // Only on mobile
        setTimeout(() => {
          outputRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, [output, codeExplanation]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };
  
  // Toggle between showing execution output and explanation
  const toggleOutputMode = () => {
    if (displayMode === 'execution' && codeExplanation) {
      setDisplayMode('explanation');
      setDisplayedOutput(codeExplanation);
    } else if (displayMode === 'explanation' && output) {
      setDisplayMode('execution');
      setDisplayedOutput(output);
    }
  };

  return (
    <section className="mx-auto max-w-4xl p-4">
      <div className="mb-8">
        <h1 className="mb-2 text-2xl font-bold">Code Helper</h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          Generate and run code with AI assistance.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <div className="mb-6 rounded-lg border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-700 dark:bg-zinc-800">
            <h3 className="mb-2 font-semibold text-zinc-700 dark:text-zinc-300">AI Code Generator</h3>
            <div className="mb-4">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe the code you need, e.g., 'Write a function to calculate Fibonacci numbers'"
                className="h-32 w-full rounded-md border border-zinc-300 bg-white p-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-900 dark:text-white"
                disabled={isGenerating}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="language" className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Language
              </label>
              <select
                id="language"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-900 dark:text-white"
                disabled={isGenerating}
              >
                <option value="python">Python</option>
                <option value="javascript">JavaScript</option>
                <option value="typescript">TypeScript</option>
                <option value="java">Java</option>
                <option value="c">C</option>
                <option value="cpp">C++</option>
                <option value="csharp">C#</option>
                <option value="php">PHP</option>
                <option value="ruby">Ruby</option>
                <option value="go">Go</option>
                <option value="rust">Rust</option>
                <option value="swift">Swift</option>
              </select>
            </div>
            <div className="flex justify-between">
              <button
                onClick={generateCode}
                className="rounded-md bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:focus:ring-offset-zinc-800"
                disabled={isGenerating || !prompt.trim()}
              >
                {isGenerating ? 'Generating...' : 'Generate Code'}
              </button>
              <button
                onClick={clearAll}
                className="rounded px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-700"
              >
                Clear All
              </button>
            </div>
          </div>

          <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-700 dark:bg-zinc-800">
            <h3 className="mb-2 font-semibold text-zinc-700 dark:text-zinc-300">Code Editor</h3>
            
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
              
              <div className="flex gap-2">
                <button
                  onClick={() => copyToClipboard(code)}
                  className="rounded px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-700"
                  disabled={!code.trim()}
                >
                  Copy Code
                </button>
                <button
                  onClick={() => setCode('')}
                  className="rounded px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-700"
                  disabled={!code.trim()}
                >
                  Clear
                </button>
              </div>
            </div>

            {error && (
              <div className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-400">
                {error}
              </div>
            )}
          </div>
        </div>

        <div ref={outputRef}>
          <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-700 dark:bg-zinc-800">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="font-semibold text-zinc-700 dark:text-zinc-300">
                {displayMode === 'execution' ? 'Execution Output' : 'Code Explanation'}
              </h3>
              <div className="flex gap-2">
                {output && codeExplanation && (
                  <button
                    onClick={toggleOutputMode}
                    className="rounded bg-zinc-100 px-2 py-1 text-xs text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-600"
                  >
                    Show {displayMode === 'execution' ? 'Explanation' : 'Output'}
                  </button>
                )}
                {displayedOutput && (
                  <>
                    <button
                      onClick={() => copyToClipboard(displayedOutput)}
                      className="rounded bg-zinc-100 px-2 py-1 text-xs text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-600"
                    >
                      Copy
                    </button>
                    <button
                      onClick={clearOutput}
                      className="rounded bg-zinc-100 px-2 py-1 text-xs text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-600"
                    >
                      Clear
                    </button>
                  </>
                )}
              </div>
            </div>
            {isRunning || isGenerating ? (
              <div className="h-[500px] animate-pulse rounded bg-zinc-100 dark:bg-zinc-700"></div>
            ) : (
              <div className="h-[500px] overflow-auto rounded bg-zinc-50 p-4 text-sm dark:bg-zinc-900">
                {displayedOutput ? (
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
                      {displayedOutput}
                    </ReactMarkdown>
                  </div>
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <span className="text-zinc-500">
                      {isGenerating ? 'Generating code...' : 'Run your code or generate code to see output here.'}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CodeHelperPage;
