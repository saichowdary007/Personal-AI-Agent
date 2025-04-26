import { useState } from 'react';

export function useTranslator() {
  const [input, setInput] = useState('');
  const [sourceLang, setSourceLang] = useState('en');
  const [targetLang, setTargetLang] = useState('es');
  const [output, setOutput] = useState<string | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const translate = async () => {
    setIsTranslating(true);
    setError(null);
    setOutput(null);
    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ input, sourceLang, targetLang }),
      });
      if (!res.ok) throw new Error('Failed to translate');
      const data = await res.json();
      setOutput(data.output);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsTranslating(false);
    }
  };

  const retry = () => translate();

  return {
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
  };
}

/*
Key Points:
- Handles text input, source/target language, translation API call, and output.
- Posts to /api/translate.
- Type-safe and stateful.
*/
