import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useApiClient } from './useApiClient';

interface SummarizeOptions {
  format?: 'paragraph' | 'bullets' | 'outline';
  maxLength?: number;
}

interface SummarizeResponse {
  content: string;
  metadata: {
    source_type?: string;
    original_length?: number;
    summary_length?: number;
    format?: string;
    usage?: any;
    [key: string]: any;
  };
}

export function useSummarize() {
  const [result, setResult] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { fetchFromApi } = useApiClient();

  const summarizeText = async (text: string, options: SummarizeOptions = {}) => {
    if (!text.trim()) {
      setError('Please enter text to summarize');
      return null;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetchFromApi('/api/summarize', {
        method: 'POST',
        body: {
          content: text,
          options
        }
      });
      
      if (response.error) {
        throw new Error(response.error);
      }

      setResult(response.data.content);
      setMetadata(response.data.metadata);
      return response.data;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to summarize text';
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const summarizeFile = async (file: File, options: SummarizeOptions = {}) => {
    if (!file) {
      setError('Please select a file to summarize');
      return null;
    }

    setIsLoading(true);
    setError(null);
    
    // For file uploads, we need to use FormData, so we can't use the standard fetchFromApi directly
    const token = localStorage.getItem('token');
    if (!token) {
      setError('You must be logged in to summarize files');
      setIsLoading(false);
      toast.error('You must be logged in to summarize files');
      return null;
    }
    
    const formData = new FormData();
    formData.append('file', file);
    
    // Add options as JSON string
    formData.append('options', JSON.stringify(options));
    
    try {
      const response = await fetch('/api/summarize/file', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Error: ${response.status}`);
      }

      const data: SummarizeResponse = await response.json();
      setResult(data.content);
      setMetadata(data.metadata);
      return data;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to summarize file';
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
    summarizeText,
    summarizeFile,
    result,
    metadata,
    isLoading,
    error,
    reset
  };
} 