import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useApiClient } from './useApiClient';

export function useCodeHelper() {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('python');
  const [output, setOutput] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const { fetchFromApi } = useApiClient();

  const runCode = async () => {
    if (!code.trim()) {
      setError('Please enter code to run');
      return;
    }

    setIsRunning(true);
    setError(null);
    setOutput(null);
    
    try {
      const response = await fetchFromApi('/assist', {
        method: 'POST',
        body: { 
          type: 'code',
          content: code,
          parameters: {
            language,
            action: 'execute'
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
      setIsRunning(false);
    }
  };

  const generateCode = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt to generate code');
      return;
    }

    setIsGenerating(true);
    setError(null);
    
    try {
      const response = await fetchFromApi('/assist', {
        method: 'POST',
        body: { 
          type: 'code',
          content: prompt,
          parameters: {
            language,
            action: 'generate'
          }
        }
      });
      
      if (response.error) {
        throw new Error(response.error);
      }
      
      setCode(response.data.content || response.data.output);
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setIsGenerating(false);
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
    prompt,
    setPrompt,
    isGenerating,
    generateCode
  };
}

/*
Key Points:
- Handles code input, language, execution, and output.
- Posts to /api/code and returns output or error.
- Type-safe and stateful.
*/
