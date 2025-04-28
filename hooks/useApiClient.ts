import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export interface ApiOptions {
  method?: string;
  headers?: Record<string, string>;
  body?: any;
}

export interface ApiResponse<T = any> {
  data: T | null;
  error: string | null;
  loading: boolean;
}

export function useApiClient() {
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  // Check authentication status on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  const fetchFromApi = useCallback(async <T = any>(
    endpoint: string,
    options: ApiOptions = {}
  ): Promise<ApiResponse<T>> => {
    setLoading(true);
    
    try {
      // Get the token from localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        // Redirect to login if no token
        router.push('/login');
        return { data: null, error: 'Authentication required', loading: false };
      }
      
      // Set up the headers
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...options.headers,
      };
      
      // Add authentication if token exists
      headers['Authorization'] = `Bearer ${token}`;
      
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
      
      // Make the request
      const response = await fetch(`${baseUrl}${endpoint}`, fetchOptions);
      
      // Check for successful response
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const errorMessage = errorData?.detail || errorData?.error || `API error: ${response.status}`;
        
        // Handle auth errors by clearing token and redirecting
        if (response.status === 401) {
          localStorage.removeItem('token');
          setIsAuthenticated(false);
          router.push('/login');
        }
        
        throw new Error(errorMessage);
      }
      
      // Parse and return the response data
      const data = await response.json();
      
      return { data, error: null, loading: false };
    } catch (error: any) {
      return { data: null, error: error.message || 'Unknown error', loading: false };
    } finally {
      setLoading(false);
    }
  }, [router]);
  
  return {
    loading,
    isAuthenticated,
    fetchFromApi,
  };
} 