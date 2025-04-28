import { useState } from 'react';
import { toast } from 'react-hot-toast';

export function useTranslator() {
  const [input, setInput] = useState('');
  const [sourceLang, setSourceLang] = useState('en');
  const [targetLang, setTargetLang] = useState('es');
  const [output, setOutput] = useState<string | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const translate = async () => {
    if (!input.trim()) {
      setError('Please enter text to translate');
      return;
    }

    setIsTranslating(true);
    setError(null);
    setOutput(null);
    
    try {
      // Get auth token from localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('You must be logged in to translate');
      }

      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ input, sourceLang, targetLang }),
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to translate');
      }
      
      const data = await res.json();
      setOutput(data.output);
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message);
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
