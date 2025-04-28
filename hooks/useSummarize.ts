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
        type: 'summarize',
        content: text,
        parameters: {
          max_length: options.maxLength || 500,
          format: options.format || 'paragraph'
        }
      });
      
      if (response.content) {
        setSummary(response.content);
        return response.content;
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
      // For file uploads, we need to use the dedicated file upload endpoint
      // and then reference the file in the assist request
      const formData = new FormData();
      formData.append('file', file);
      
      // First upload the file
      const uploadResponse = await apiClient.postFormData('/api/summarize/file', formData);
      
      if (uploadResponse && uploadResponse.content) {
        setSummary(uploadResponse.content);
        return uploadResponse.content;
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