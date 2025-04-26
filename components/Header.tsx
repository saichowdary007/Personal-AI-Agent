"use client";
import React from 'react';
import UserAvatarDropdown from '@/components/UserAvatarDropdown';
import { usePathname } from 'next/navigation';

const PAGE_TITLES: Record<string, string> = {
  '/chat': 'Chat',
  '/history': 'History',
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
      {/* Left: Logo and App Title */}
      <div className="flex items-center gap-2">
        <img src="/logo.svg" alt="App Logo" className="size-8" />
        <span className="text-lg font-bold tracking-tight">AI Assistant</span>
      </div>
      {/* Center: Dynamic Page Title */}
      <div className="hidden flex-1 text-center md:block">
        <span className="text-base font-medium">{title}</span>
      </div>
      {/* Right: User Avatar Dropdown */}
      <div className="flex items-center">
        <UserAvatarDropdown />
      </div>
    </header>
  );
};

export default Header;

/*
Key Points:
- Left: logo and app title.
- Center: dynamic page title based on route.
- Right: user avatar dropdown.
- Responsive and sticky.
- Accessible: logo has alt text.
*/
