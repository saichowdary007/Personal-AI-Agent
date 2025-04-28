"use client";
import React, { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

const SettingsPage: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Check if user has dark mode preference stored
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    if (darkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }
    setDarkMode(!darkMode);
  };

  return (
    <section className="mx-auto max-w-4xl p-4">
      <div className="mb-8">
        <h1 className="mb-2 text-2xl font-bold">Settings</h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          Customize your experience
        </p>
      </div>

      <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-700 dark:bg-zinc-800">
        <h2 className="mb-4 text-xl font-semibold">Appearance</h2>
        
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium">Dark Mode</h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Toggle between light and dark themes
            </p>
          </div>
          
          <button
            onClick={toggleDarkMode}
            className="size-8 text-white p-1 rounded-full transition-transform duration-150 ease-in-out"
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            <div 
              className={`flex h-8 w-8 transform items-center justify-center rounded-full bg-white text-zinc-800 shadow-md transition-transform duration-200 dark:bg-zinc-900 dark:text-zinc-200 ${
                darkMode ? 'translate-x-6' : ''
              }`}
            >
              {darkMode ? <Moon size={16} /> : <Sun size={16} />}
            </div>
          </button>
        </div>
      </div>

      <div className="mt-6 rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-700 dark:bg-zinc-800">
        <h2 className="mb-4 text-xl font-semibold">Account</h2>
        
        <div className="mb-6">
          <h3 className="font-medium">Profile</h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Manage your account information
          </p>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium">
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="your.email@example.com"
              className="w-full rounded-md border border-zinc-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-700 dark:text-white"
              disabled
            />
          </div>
          
          <div>
            <label htmlFor="name" className="mb-1 block text-sm font-medium">
              Name
            </label>
            <input
              type="text"
              id="name"
              placeholder="Your Name"
              className="w-full rounded-md border border-zinc-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-700 dark:text-white"
              disabled
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default SettingsPage;
