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
    console.log('Initial authentication check, token exists:', !!token);
    setIsAuthenticated(!!token);
  }, []);

  const fetchFromApi = useCallback(async <T = any>(
    endpoint: string,
    options: ApiOptions = {}
  ): Promise<ApiResponse<T>> => {
    setLoading(true);
    console.log(`API Request to ${endpoint} started`);
    
    try {
      // Get the token from localStorage
      const token = localStorage.getItem('token');
      console.log('Using token:', token ? 'exists' : 'missing');
      
      if (!token) {
        // Redirect to login if no token
        console.log('No token found, redirecting to login');
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
        console.log('Request body:', options.body);
      }
      
      // Use the environment variable or fall back to the Render backend URL
      const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://127.0.0.1:8001';
      const fullUrl = `${baseUrl}${endpoint}`;
      console.log('Making request to:', fullUrl);
      
      // Make the request
      const response = await fetch(fullUrl, fetchOptions);
      console.log('Response status:', response.status);
      
      // Check for successful response
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error('Error response:', errorData);
        const errorMessage = errorData?.detail || errorData?.error || `API error: ${response.status}`;
        
        // Handle auth errors by clearing token and redirecting
        if (response.status === 401) {
          console.log('Auth error, clearing token');
          localStorage.removeItem('token');
          setIsAuthenticated(false);
          router.push('/login');
        }
        
        throw new Error(errorMessage);
      }
      
      // Parse and return the response data
      const data = await response.json();
      console.log('Response data:', data);
      
      return { data, error: null, loading: false };
    } catch (error: any) {
      console.error('API request failed:', error);
      return { data: null, error: error.message || 'Unknown error', loading: false };
    } finally {
      setLoading(false);
      console.log(`API Request to ${endpoint} completed`);
    }
  }, [router]);
  
  return {
    loading,
    isAuthenticated,
    fetchFromApi,
  };
} 