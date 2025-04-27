import { useState, useCallback } from 'react';

interface ApiOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: any;
  headers?: Record<string, string>;
}

interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  loading: boolean;
}

export function useApiClient() {
  const [loading, setLoading] = useState(false);

  const fetchFromApi = useCallback(async <T = any>(
    endpoint: string,
    options: ApiOptions = {}
  ): Promise<ApiResponse<T>> => {
    setLoading(true);
    
    try {
      // Get the token from localStorage
      const token = localStorage.getItem('token');
      console.log('Using token:', token);
      
      // Set up the headers
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...options.headers,
      };
      
      // Add authentication if token exists
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      // Create the fetch options
      const fetchOptions: RequestInit = {
        method: options.method || 'GET',
        headers,
        cache: 'no-store',
      };
      
      // Add body for non-GET requests
      if (options.method && options.method !== 'GET' && options.body) {
        fetchOptions.body = JSON.stringify(options.body);
      }
      
      // Use the environment variable or fall back to the Render backend URL
      const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://personal-ai-agent-0wsk.onrender.com';
      console.log('Making request to:', `${baseUrl}${endpoint}`);
      
      // Make the request
      const response = await fetch(`${baseUrl}${endpoint}`, fetchOptions);
      
      // Check for successful response
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error('Error response:', errorData);
        const errorMessage = errorData?.detail || errorData?.error || `API error: ${response.status}`;
        
        // Handle auth errors by clearing token
        if (response.status === 401) {
          console.log('Auth error, clearing token');
          localStorage.removeItem('token');
        }
        
        throw new Error(errorMessage);
      }
      
      // Parse and return the response data
      const data = await response.json();
      console.log('Response data:', data);
      
      // Only set the token if it exists in the response
      if (data.access_token) {
        console.log('Setting new token:', data.access_token);
        localStorage.setItem('token', data.access_token);
      }
      
      return { data, error: null, loading: false };
    } catch (error: any) {
      console.error('API request failed:', error);
      return { data: null, error: error.message || 'Unknown error', loading: false };
    } finally {
      setLoading(false);
    }
  }, []);
  
  return {
    loading,
    fetchFromApi,
  };
} 