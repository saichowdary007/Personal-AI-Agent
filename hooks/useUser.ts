import { useState } from 'react';

export interface User {
  name: string;
  avatarUrl?: string;
}

export function useUser() {
  // In a real app, fetch user from API or context
  const [user, setUser] = useState<User | null>({
    name: 'Jane Doe',
    avatarUrl: '/avatar-default.png',
  });

  const logout = () => {
    // Clear user session/token (stub)
    setUser(null);
    // Optionally redirect to login
  };

  return { user, logout };
}

/*
Key Points:
- Manages user info and logout.
- Stub implementation for now; replace with real auth/session logic.
*/
