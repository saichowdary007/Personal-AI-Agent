import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export interface User {
  name: string;
  avatarUrl?: string;
}

export function useUser() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  // Check for token on component mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // In a real app, verify token and fetch user data
      setUser({
        name: 'Test User',
        avatarUrl: '/avatar-default.png',
      });
    }
  }, []);

  const logout = () => {
    // Clear token
    localStorage.removeItem('token');
    setUser(null);
    // Redirect to login
    router.push('/login');
  };

  return { user, logout };
}

/*
Key Points:
- Manages user info and logout.
- Stub implementation for now; replace with real auth/session logic.
*/
