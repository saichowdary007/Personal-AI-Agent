"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
  { href: '/', label: 'Dashboard', icon: '🏠' },
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

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (open && window.innerWidth < 768) {
        const sidebar = document.getElementById('sidebar');
        if (sidebar && !sidebar.contains(event.target as Node)) {
          setOpen(false);
        }
      }
    };

    // Close sidebar when route changes on mobile
    const handleRouteChange = () => {
      if (window.innerWidth < 768) {
        setOpen(false);
      }
    };

    document.addEventListener('click', handleOutsideClick);
    window.addEventListener('resize', handleRouteChange);
    
    // Cleanup
    return () => {
      document.removeEventListener('click', handleOutsideClick);
      window.removeEventListener('resize', handleRouteChange);
    };
  }, [open, pathname]);

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div 
          className="fixed inset-0 bg-black/50 z-10 md:hidden" 
          aria-hidden="true"
        />
      )}
      
      {/* Mobile toggle button - outside the nav for better accessibility */}
      <button
        className="fixed left-4 top-20 z-30 rounded-full bg-blue-600 text-white p-3 shadow-lg md:hidden"
        aria-label={open ? 'Close sidebar' : 'Open sidebar'}
        onClick={() => setOpen((v) => !v)}
      >
        <span aria-hidden className="flex items-center justify-center w-5 h-5">
          {open ? '✖️' : '☰'}
        </span>
      </button>
      
      <nav
        id="sidebar"
        aria-label="Sidebar navigation"
        className={`fixed left-0 top-16 z-20 h-[calc(100vh-4rem)] w-72 overflow-y-auto border-r border-zinc-200 bg-white transition-transform duration-300 dark:border-zinc-800 dark:bg-zinc-900 md:sticky md:top-0 md:h-[calc(100vh-4rem)] md:w-56 ${open ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
      >
        <ul className="mt-4 flex flex-col gap-1 p-3">
          {NAV_ITEMS.map(({ href, label, icon }) => (
            <li key={href}>
              <Link
                href={href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  pathname === href
                    ? 'bg-blue-100 text-blue-600 dark:bg-zinc-800 dark:text-blue-300'
                    : 'text-zinc-700 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-800'
                }`}
                aria-current={pathname === href ? 'page' : undefined}
                tabIndex={0}
                onClick={() => window.innerWidth < 768 && setOpen(false)}
              >
                <span className="text-xl" aria-hidden>{icon}</span>
                <span className="text-sm md:text-base">{label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </>
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
