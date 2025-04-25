import React from 'react';

export default function Header({ user, onLogout }) {
  return (
    <header className="w-full flex items-center justify-between px-4 py-3 bg-blue-700 text-white shadow-sm">
      <div className="text-xl font-bold tracking-tight">Personal AI Assistant</div>
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium bg-blue-900 px-3 py-1 rounded-full">{user?.username || 'Guest'}</span>
        <button
          onClick={onLogout}
          className="px-3 py-1 rounded bg-white text-blue-700 font-semibold hover:bg-gray-100 transition"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
