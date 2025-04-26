"use client";
import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import ChatPanel from '@/components/ChatPanel';
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
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const t = localStorage.getItem('token');
    setToken(t);
    setUser(getUserFromToken(t));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  if (!token || !user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <h1 className="mb-4 text-2xl font-bold">Login Required</h1>
        <p className="mb-4">Please log in to access the assistant.</p>
        {/* Add your login form here or link to login page */}
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-4 md:p-8">
          <ChatPanel />
        </main>
      </div>
    </ErrorBoundary>
  );
};

export default Home;
