import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useApiClient } from './useApiClient';

export function useTranslator() {
  const [input, setInput] = useState('');
  const [sourceLang, setSourceLang] = useState('en');
  const [targetLang, setTargetLang] = useState('es');
  const [output, setOutput] = useState<string | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { fetchFromApi } = useApiClient();

  const translate = async () => {
    if (!input.trim()) {
      setError('Please enter text to translate');
      return;
    }

    setIsTranslating(true);
    setError(null);
    setOutput(null);
    
    try {
      const response = await fetchFromApi('/assist', {
        method: 'POST',
        body: { 
          type: 'translate',
          content: input,
          parameters: {
            source_language: sourceLang,
            target_language: targetLang
          }
        }
      });
      
      if (response.error) {
        throw new Error(response.error);
      }
      
      setOutput(response.data.content);
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
- Uses the unified /assist endpoint with proper request structure.
- Type-safe and stateful.
*/
