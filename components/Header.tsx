"use client";
import React from 'react';
import { usePathname } from 'next/navigation';
import { User, LogOut } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const PAGE_TITLES: Record<string, string> = {
  '/': 'Dashboard',
  '/chat': 'Chat',
  '/code': 'Code Helper',
  '/translate': 'Translator',
  '/settings': 'Settings',
  '/summarize': 'Summarize',
  '/email': 'Email',
  '/test': 'Test Page',
};

function getPageTitle(pathname: string): string {
  return PAGE_TITLES[pathname] || 'Personal AI Assistant';
}

const Header: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const title = getPageTitle(pathname ?? '');

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  return (
    <header className="sticky top-0 z-30 flex h-14 sm:h-16 w-full items-center justify-between border-b border-zinc-200 bg-white px-3 sm:px-4 dark:border-zinc-800 dark:bg-zinc-900 md:px-8">
      {/* Left: App Title */}
      <div className="flex items-center gap-1 sm:gap-2">
        <span className="hidden sm:inline text-xs text-zinc-500 dark:text-zinc-400">AI</span>
        <span className="text-base sm:text-lg font-bold tracking-tight">Assistant</span>
      </div>
      
      {/* Center: Dynamic Page Title */}
      <div className="flex-1 text-center">
        <span className="text-sm sm:text-base font-medium">{title}</span>
      </div>
      
      {/* Right: User Controls */}
      <div className="flex items-center gap-2">
        <Link 
          href="/settings" 
          className="flex items-center justify-center rounded-full bg-zinc-100 p-1.5 sm:p-2 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
        >
          <User size={18} />
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center justify-center rounded-full bg-zinc-100 p-1.5 sm:p-2 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
          aria-label="Log out"
        >
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
};

export default Header;

/*
Key Points:
- Left: app title.
- Center: dynamic page title based on route.
- Right: user controls (settings and logout).
- Responsive and sticky.
- Accessible: app title has text.
*/
