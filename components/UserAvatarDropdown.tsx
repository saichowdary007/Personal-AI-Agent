"use client";
import React, { useState, useRef } from 'react';
import { useUser } from '@/hooks/useUser';

const UserAvatarDropdown: React.FC = () => {
  const { user, logout } = useUser();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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
          alt={user?.name || 'User'}
          className="size-10 rounded-full border border-zinc-300 shadow-sm dark:border-zinc-700"
        />
      </button>
      {open && (
        <div
          className="animate-fade-in absolute right-0 z-40 mt-2 w-40 rounded-lg border border-zinc-200 bg-white py-2 shadow-lg dark:border-zinc-800 dark:bg-zinc-900"
          role="menu"
        >
          <button
            className="w-full px-4 py-2 text-left transition-colors hover:bg-zinc-100 focus:bg-zinc-100 dark:hover:bg-zinc-800 dark:focus:bg-zinc-800"
            role="menuitem"
            onClick={() => {/* TODO: Navigate to profile */ setOpen(false)}}
          >
            Profile
          </button>
          <button
            className="w-full px-4 py-2 text-left text-red-500 transition-colors hover:bg-zinc-100 focus:bg-zinc-100 dark:hover:bg-zinc-800 dark:focus:bg-zinc-800"
            role="menuitem"
            onClick={() => { logout(); setOpen(false); }}
          >
            Logout
          </button>
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
