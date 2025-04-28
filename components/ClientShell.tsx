"use client";
import React, { ReactNode, useEffect } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import ErrorBoundary from "@/components/ErrorBoundary";

interface ClientShellProps {
  children: ReactNode;
}

const ClientShell: React.FC<ClientShellProps> = ({ children }) => {
  useEffect(() => {
    // Apply dark mode on client side based on saved preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Add meta viewport tag for better mobile experience
    const viewport = document.querySelector('meta[name="viewport"]');
    if (!viewport) {
      const meta = document.createElement('meta');
      meta.name = 'viewport';
      meta.content = 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0, viewport-fit=cover';
      document.head.appendChild(meta);
    }
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-2 sm:p-4 md:p-8 overflow-auto" tabIndex={-1} id="main-content">
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
        </main>
      </div>
    </div>
  );
};

export default ClientShell;
