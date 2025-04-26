import { useState } from 'react';

export function useCodeHelper() {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('python');
  const [output, setOutput] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runCode = async () => {
    setIsRunning(true);
    setError(null);
    setOutput(null);
    try {
      const res = await fetch('/api/code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ code, language }),
      });
      if (!res.ok) throw new Error('Failed to run code');
      const data = await res.json();
      setOutput(data.output);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsRunning(false);
    }
  };

  return {
    code,
    setCode,
    language,
    setLanguage,
    output,
    isRunning,
    error,
    runCode,
  };
}

/*
Key Points:
- Handles code input, language, execution, and output.
- Posts to /api/code and returns output or error.
- Type-safe and stateful.
*/
