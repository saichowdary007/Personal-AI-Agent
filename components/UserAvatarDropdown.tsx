"use client";
import React, { useState, useRef, useEffect } from 'react';
import { useUser } from '@/hooks/useUser';
import { useRouter } from 'next/navigation';

const UserAvatarDropdown: React.FC = () => {
  const { user, logout } = useUser();
  const [open, setOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Check login status
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  // Close dropdown when clicking outside
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogin = () => {
    router.push('/login');
    setOpen(false);
  };

  const handleLogout = () => {
    logout();
    setIsLoggedIn(false);
    setOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <img
          src={user?.avatarUrl || '/avatar-default.png'}
          alt={isLoggedIn ? (user?.name || 'User') : 'Not logged in'}
          className="size-10 rounded-full border border-zinc-300 shadow-sm dark:border-zinc-700"
        />
      </button>
      {open && (
        <div
          className="animate-fade-in absolute right-0 z-40 mt-2 w-40 rounded-lg border border-zinc-200 bg-white py-2 shadow-lg dark:border-zinc-800 dark:bg-zinc-900"
          role="menu"
        >
          {isLoggedIn ? (
            <>
              <button
                className="w-full px-4 py-2 text-left transition-colors hover:bg-zinc-100 focus:bg-zinc-100 dark:hover:bg-zinc-800 dark:focus:bg-zinc-800"
                role="menuitem"
                onClick={() => setOpen(false)}
              >
                Profile
              </button>
              <button
                className="w-full px-4 py-2 text-left text-red-500 transition-colors hover:bg-zinc-100 focus:bg-zinc-100 dark:hover:bg-zinc-800 dark:focus:bg-zinc-800"
                role="menuitem"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          ) : (
            <button
              className="w-full px-4 py-2 text-left transition-colors hover:bg-zinc-100 focus:bg-zinc-100 dark:hover:bg-zinc-800 dark:focus:bg-zinc-800"
              role="menuitem"
              onClick={handleLogin}
            >
              Login
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default UserAvatarDropdown;

/*
Key Points:
- Avatar button toggles dropdown.
- Dropdown: Profile and Logout actions.
- Accessible: ARIA roles, keyboard focus, alt text.
- Closes on outside click.
*/
