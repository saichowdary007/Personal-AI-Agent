"use client";
import React from 'react';
import { useTheme } from '@/hooks/useTheme';

const ThemeSwitcher: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="flex items-center gap-2 rounded-lg bg-zinc-200 px-4 py-2 font-semibold text-zinc-800 transition-colors hover:bg-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-600"
      aria-label="Toggle dark/light theme"
    >
      {theme === 'dark' ? '🌙 Dark' : '☀️ Light'} Mode
    </button>
  );
};

export default ThemeSwitcher;

/*
Key Points:
- Accessible button to toggle dark/light mode.
- Uses useTheme hook for state.
*/
