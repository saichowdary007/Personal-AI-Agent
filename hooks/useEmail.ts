import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useApiClient } from './useApiClient';

export interface EmailOptions {
  tone?: 'professional' | 'casual' | 'formal' | 'friendly';
  format?: 'full' | 'reply' | 'forward';
}

interface EmailResponse {
  output: string;
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
  const { fetchFromApi } = useApiClient();

  const generateEmail = async (prompt: string, options: EmailOptions = {}) => {
    if (!prompt.trim()) {
      setError('Please enter email details');
      return null;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetchFromApi('/assist', {
        method: 'POST',
        body: {
          type: 'email',
          content: prompt,
          parameters: {
            tone: options.tone || 'professional',
            format: options.format || 'full',
          }
        }
      });
      
      if (response.error) {
        throw new Error(response.error);
      }

      setResult(response.data.content);
      setMetadata(response.data.metadata || {});
      return response.data;
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