import { useState } from 'react';
import { useApiClient } from './useApiClient';
import { toast } from 'react-hot-toast';

interface SummarizeOptions {
  maxLength?: number;
  format?: 'paragraph' | 'bullets';
}

export function useSummarize() {
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const apiClient = useApiClient();

  const summarizeText = async (text: string, options: SummarizeOptions = {}) => {
    if (!text) {
      setError('Please provide text to summarize');
      toast.error('Please provide text to summarize');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const response = await apiClient.post('/assist', {
        text,
        max_length: options.maxLength || 500,
        format: options.format || 'paragraph'
      });
      
      if (response.summary) {
        setSummary(response.summary);
        return response.summary;
      } else {
        throw new Error('No summary returned from API');
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to summarize text';
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const summarizeFile = async (file: File, options: SummarizeOptions = {}) => {
    if (!file) {
      setError('Please provide a file to summarize');
      toast.error('Please provide a file to summarize');
      return null;
    }

    // Check file type
    const allowedTypes = ['application/pdf', 'text/plain'];
    if (!allowedTypes.includes(file.type)) {
      const errorMsg = 'Only PDF and TXT files are supported';
      setError(errorMsg);
      toast.error(errorMsg);
      return null;
    }

    // Check file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      const errorMsg = 'File size must be less than 10MB';
      setError(errorMsg);
      toast.error(errorMsg);
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('max_length', options.maxLength?.toString() || '500');
      formData.append('format', options.format || 'paragraph');

      const response = await apiClient.postFormData('/api/assist', formData);
      
      if (response.summary) {
        setSummary(response.summary);
        return response.summary;
      } else {
        throw new Error('No summary returned from API');
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to summarize file';
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setSummary(null);
    setError(null);
  };

  return {
    summarizeText,
    summarizeFile,
    loading,
    summary,
    error,
    reset
  };
} 