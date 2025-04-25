import React from 'react';
import { FaComments, FaFileAlt, FaEnvelope, FaTasks, FaLanguage, FaCode } from 'react-icons/fa';

const NAV_ITEMS = [
  { key: 'chat', label: 'Chat', icon: <FaComments /> },
  { key: 'summarize', label: 'Summarize', icon: <FaFileAlt /> },
  { key: 'email', label: 'Email', icon: <FaEnvelope /> },
  { key: 'todo', label: 'Todo', icon: <FaTasks /> },
  { key: 'translate', label: 'Translate', icon: <FaLanguage /> },
  { key: 'code', label: 'Code', icon: <FaCode /> },
];

export default function Sidebar({ active, onNavigate }) {
  return (
    <nav className="flex flex-col w-full sm:w-56 bg-gray-100 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 min-h-screen p-2 sm:p-4">
      <ul className="flex flex-row sm:flex-col gap-2 sm:gap-4 w-full">
        {NAV_ITEMS.map(item => (
          <li key={item.key} className="flex-1">
            <button
              className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg text-base font-medium transition
                ${active === item.key
                  ? 'bg-blue-600 text-white shadow'
                  : 'hover:bg-blue-200 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200'}
              `}
              onClick={() => onNavigate(item.key)}
              aria-label={item.label}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="hidden sm:inline">{item.label}</span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
