"use client";
import React from 'react';
import { usePathname } from 'next/navigation';
import { User } from 'lucide-react';
import Link from 'next/link';

const PAGE_TITLES: Record<string, string> = {
  '/chat': 'Chat',
  '/code': 'Code Helper',
  '/translate': 'Translator',
  '/settings': 'Settings',
};

function getPageTitle(pathname: string): string {
  return PAGE_TITLES[pathname] || 'Personal AI Assistant';
}

const Header: React.FC = () => {
  const pathname = usePathname();
  const title = getPageTitle(pathname ?? '');

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-zinc-200 bg-white px-4 dark:border-zinc-800 dark:bg-zinc-900 md:px-8">
      {/* Left: Folder name and App Title */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-zinc-500 dark:text-zinc-400">Personal-AI-Agent</span>
        <span className="text-lg font-bold tracking-tight">AI Assistant</span>
      </div>
      {/* Center: Dynamic Page Title */}
      <div className="hidden flex-1 text-center md:block">
        <span className="text-base font-medium">{title}</span>
      </div>
      {/* Right: User Avatar */}
      <div className="flex items-center">
        <Link href="/login" className="flex items-center justify-center rounded-full bg-zinc-100 p-2 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700">
          <User size={20} />
        </Link>
      </div>
    </header>
  );
};

export default Header;

/*
Key Points:
- Left: folder name and app title.
- Center: dynamic page title based on route.
- Right: user avatar.
- Responsive and sticky.
- Accessible: folder name and app title have text.
*/
