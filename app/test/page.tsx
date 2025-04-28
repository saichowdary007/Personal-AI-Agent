"use client";
import React, { useState, useEffect } from 'react';

export default function TestPage() {
  const [token, setToken] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    // Get token from localStorage when component mounts
    const storedToken = localStorage.getItem('token');
    setToken(storedToken);
  }, []);
  
  const testBackendConnection = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    
    try {
      const response = await fetch('/api/proxy-test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: 'https://personal-ai-agent-0wsk.onrender.com/assist',
          token: token,
          body: {
            type: 'chat',
            content: 'Hello from test page'
          }
        }),
      });
      
      const data = await response.json();
      setResult(data);
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to test connection');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Backend Connection Test</h1>
      
      <div className="mb-4">
        <p className="mb-2">Token Status: {token ? 'Present' : 'Missing'}</p>
        
        <button 
          onClick={testBackendConnection}
          disabled={loading || !token}
          className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
        >
          {loading ? 'Testing...' : 'Test Backend Connection'}
        </button>
      </div>
      
      {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-700 rounded">
          <h2 className="font-bold">Error:</h2>
          <p>{error}</p>
        </div>
      )}
      
      {result && (
        <div className="mb-4">
          <h2 className="font-bold mb-2">Result:</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-96">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
} 