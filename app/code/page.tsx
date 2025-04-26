"use client";
import React from 'react';
import CodeEditor from '@/components/CodeHelper/CodeEditor';
import RunButton from '@/components/CodeHelper/RunButton';
import { useCodeHelper } from '@/hooks/useCodeHelper';

const LANGUAGE_OPTIONS = [
  { value: 'python', label: 'Python' },
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'bash', label: 'Bash' },
];

const CodeHelperSection: React.FC = () => {
  const {
    code,
    setCode,
    language,
    setLanguage,
    output,
    isRunning,
    error,
    runCode,
  } = useCodeHelper();

  return (
    <form className="mx-auto flex max-w-2xl flex-col gap-4" onSubmit={e => {e.preventDefault(); runCode();}} aria-label="Code Helper">
      <label htmlFor="language-select" className="font-medium">Language</label>
      <select
        id="language-select"
        value={language}
        onChange={e => setLanguage(e.target.value)}
        className="w-48 rounded border border-zinc-300 bg-white px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-900"
        disabled={isRunning}
      >
        {LANGUAGE_OPTIONS.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      <CodeEditor
        value={code}
        language={language}
        onChange={setCode}
        disabled={isRunning}
      />
      <div className="flex items-center gap-4">
        <RunButton onClick={runCode} loading={isRunning} disabled={!code.trim()} />
        {isRunning && <span className="text-zinc-500">Running...</span>}
      </div>
      {output && (
        <div className="mt-2 whitespace-pre-wrap rounded bg-zinc-100 p-3 font-mono text-sm text-zinc-800 dark:bg-zinc-800 dark:text-zinc-100">
          <span className="font-semibold">Output:</span>\n{output}
        </div>
      )}
      {error && (
        <div className="mt-2 rounded bg-red-100 p-3 text-sm text-red-700 dark:bg-red-900 dark:text-red-300" role="alert">
          {error}
        </div>
      )}
    </form>
  );
};

const CodeHelperPage: React.FC = () => {
  return (
    <section aria-labelledby="code-helper-heading">
      <h1 id="code-helper-heading" className="sr-only">Code Helper</h1>
      <CodeHelperSection />
    </section>
  );
};

export default CodeHelperPage;
