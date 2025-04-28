"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ErrorBoundary from '@/components/ErrorBoundary';

interface User {
  id: string;
  name: string;
  // Add any other user fields needed
}

const getUserFromToken = (token: string | null): User | null => {
  // Dummy implementation: replace with real JWT decode logic if needed
  if (!token) return null;
  try {
    // Example: decode JWT and extract user info
    // const payload = JSON.parse(atob(token.split('.')[1]));
    // return { id: payload.sub, name: payload.name };
    return { id: '1', name: 'Demo User' };
  } catch {
    return null;
  }
};

const Home: React.FC = () => {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const t = localStorage.getItem('token');
    setToken(t);
    setUser(getUserFromToken(t));
    
    // Redirect to login if no token
    if (!t) {
      router.push('/login');
    }
  }, [router]);

  return (
    <div className="p-3 sm:p-4 md:p-8">
      <div className="w-full max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-5 sm:p-8 text-white">
            <h1 className="text-2xl sm:text-3xl font-bold">Welcome to Your AI Assistant</h1>
            <p className="mt-2 text-sm sm:text-base opacity-90">Your personal AI-powered productivity companion</p>
          </div>
          
          <div className="p-4 sm:p-6">
            <div className="grid grid-cols-1 gap-4 sm:gap-6">
              <div className="bg-blue-50 p-4 sm:p-5 rounded-lg border border-blue-100">
                <h2 className="text-lg sm:text-xl font-semibold text-blue-800 mb-2">Chat with AI</h2>
                <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">Ask questions, get recommendations, brainstorm ideas</p>
                <button 
                  onClick={() => router.push('/chat')}
                  className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors text-sm sm:text-base"
                >
                  Start Chatting
                </button>
              </div>
              
              <div className="bg-purple-50 p-4 sm:p-5 rounded-lg border border-purple-100">
                <h2 className="text-lg sm:text-xl font-semibold text-purple-800 mb-2">Translate Text</h2>
                <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">Translate content between different languages</p>
                <button 
                  onClick={() => router.push('/translate')}
                  className="w-full sm:w-auto bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition-colors text-sm sm:text-base"
                >
                  Translate Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
