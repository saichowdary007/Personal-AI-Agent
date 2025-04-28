"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ErrorBoundary from '@/components/ErrorBoundary';
import TodoList from '../components/Todo/TodoList';

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
    <div className="p-4 md:p-8">
      <TodoList />
    </div>
  );
};

export default Home;
