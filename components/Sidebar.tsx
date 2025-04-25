import React from 'react';
import { FaComments, FaFileAlt, FaEnvelope, FaTasks, FaLanguage, FaCode } from 'react-icons/fa';

interface SidebarProps {
  active: string;
  onNavigate: (key: string) => void;
}

const NAV_ITEMS = [
  { key: 'chat', label: 'Chat', icon: <FaComments /> },
  { key: 'summarize', label: 'Summarize', icon: <FaFileAlt /> },
  { key: 'email', label: 'Email', icon: <FaEnvelope /> },
  { key: 'todo', label: 'Todo', icon: <FaTasks /> },
  { key: 'translate', label: 'Translate', icon: <FaLanguage /> },
  { key: 'code', label: 'Code', icon: <FaCode /> },
];

const Sidebar: React.FC<SidebarProps> = ({ active, onNavigate }) => (
  <nav className="w-full sm:w-56 flex-shrink-0 bg-gray-100 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 min-h-screen">
    <ul className="flex flex-row sm:flex-col gap-2 p-2 sm:p-4">
      {NAV_ITEMS.map(item => (
        <li key={item.key}>
          <button
            className={`flex items-center gap-2 px-3 py-2 rounded w-full text-left transition font-medium \
              ${active === item.key
                ? 'bg-blue-600 text-white'
                : 'hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200'}`}
            onClick={() => onNavigate(item.key)}
            aria-label={item.label}
          >
            <span className="text-lg">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        </li>
      ))}
    </ul>
  </nav>
);

export default Sidebar;
