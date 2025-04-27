"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
  { href: '/chat', label: 'Chat', icon: '💬' },
  { href: '/summarize', label: 'Summarize', icon: '📝' },
  { href: '/email', label: 'Email', icon: '✉️' },
  { href: '/code', label: 'Code Helper', icon: '💻' },
  { href: '/translate', label: 'Translator', icon: '🌐' },
  { href: '/settings', label: 'Settings', icon: '⚙️' },
];

const Sidebar: React.FC = () => {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <nav
      aria-label="Sidebar navigation"
      className={`fixed left-0 top-16 z-20 h-full w-64 border-r border-zinc-200 bg-white transition-transform duration-300 dark:border-zinc-800 dark:bg-zinc-900 md:sticky md:top-0 md:h-auto md:w-56 ${open ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
    >
      {/* Mobile toggle button */}
      <button
        className="absolute right-2 top-2 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 md:hidden"
        aria-label={open ? 'Close sidebar' : 'Open sidebar'}
        onClick={() => setOpen((v) => !v)}
      >
        <span aria-hidden>{open ? '✖️' : '☰'}</span>
      </button>
      <ul className="mt-16 flex flex-col gap-2 px-4 md:mt-8">
        {NAV_ITEMS.map(({ href, label, icon }) => (
          <li key={href}>
            <Link
              href={href}
              className={`flex items-center gap-3 rounded-lg px-4 py-2 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                pathname === href
                  ? 'bg-blue-100 text-blue-600 dark:bg-zinc-800 dark:text-blue-300'
                  : 'text-zinc-700 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-800'
              }`}
              aria-current={pathname === href ? 'page' : undefined}
              tabIndex={0}
            >
              <span className="text-xl" aria-hidden>{icon}</span>
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Sidebar;

/*
Key Points:
- Collapsible on mobile, sticky on desktop.
- Nav items highlight active route.
- Accessible: ARIA labels, focus ring, aria-current.
- Responsive with smooth transitions.
*/
