import React from 'react';

interface HeaderProps {
  user: { username?: string } | null;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout }) => (
  <header className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
    <div className="text-xl font-bold text-gray-800 dark:text-white">Personal AI Assistant</div>
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-600 dark:text-gray-300">{user?.username || 'Guest'}</span>
      <button
        onClick={onLogout}
        className="px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600 transition text-sm"
      >
        Logout
      </button>
    </div>
  </header>
);

export default Header;
