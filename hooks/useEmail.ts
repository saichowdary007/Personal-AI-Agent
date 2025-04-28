import { useState } from 'react';
import { toast } from 'react-hot-toast';

export interface EmailOptions {
  tone?: 'professional' | 'casual' | 'formal' | 'friendly';
  format?: 'full' | 'reply' | 'forward';
}

interface EmailResponse {
  content: string;
  metadata: {
    tone?: string;
    format?: string;
    model?: string;
    [key: string]: any;
  };
}

export function useEmail() {
  const [result, setResult] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateEmail = async (prompt: string, options: EmailOptions = {}) => {
    if (!prompt.trim()) {
      setError('Please enter email details');
      return null;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      // Get auth token from localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('You must be logged in to generate emails');
      }

      const response = await fetch('/api/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          prompt,
          options
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Error: ${response.status}`);
      }

      const data: EmailResponse = await response.json();
      setResult(data.content);
      setMetadata(data.metadata);
      return data;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to generate email';
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setResult(null);
    setMetadata(null);
    setError(null);
  };

  return {
    generateEmail,
    result,
    metadata,
    isLoading,
    error,
    reset
  };
} 