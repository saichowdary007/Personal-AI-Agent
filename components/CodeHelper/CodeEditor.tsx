import React, { useState } from 'react';

interface CodeEditorProps {
  value: string;
  language: string;
  onChange: (val: string) => void;
  disabled?: boolean;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ value, language, onChange, disabled }) => {
  // For real syntax highlighting, integrate e.g. react-simple-code-editor + Prism (not shown here)
  return (
    <textarea
      className="h-48 w-full resize-y rounded-lg border border-zinc-300 bg-zinc-50 p-3 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-900"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      spellCheck={false}
      aria-label="Code editor"
      disabled={disabled}
    />
  );
};

export default CodeEditor;

/*
Key Points:
- Controlled textarea for code input.
- Type-safe props.
- Accessible: aria-label, disables when running.
- For real syntax highlighting, integrate Prism or similar (stub for now).
*/
