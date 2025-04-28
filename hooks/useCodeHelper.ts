import { useState } from 'react';
import { toast } from 'react-hot-toast';

export function useCodeHelper() {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('python');
  const [output, setOutput] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
        body: JSON.stringify({ code, language }),
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
