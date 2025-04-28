import { useState } from 'react';
import { toast } from 'react-hot-toast';

export function useCodeHelper() {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('python');
  const [output, setOutput] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const runCode = async () => {
    if (!code.trim()) {
      setError('Please enter code to run');
      return;
    }

    setIsRunning(true);
    setError(null);
    setOutput(null);
    
    try {
      // Get auth token from localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('You must be logged in to run code');
      }

      const res = await fetch('/api/code', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ code, language, mode: 'execute' }),
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to run code');
      }
      
      const data = await res.json();
      setOutput(data.output);
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
      // Get auth token from localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('You must be logged in to generate code');
      }

      const res = await fetch('/api/code', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          code: prompt, 
          language, 
          mode: 'generate' 
        }),
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to generate code');
      }
      
      const data = await res.json();
      setCode(data.output);
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
