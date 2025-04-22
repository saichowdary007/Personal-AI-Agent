import React from 'react';
import { FaComments, FaFileAlt, FaEnvelope, FaTasks, FaLanguage, FaCode } from 'react-icons/fa';
import styles from '../styles/Sidebar.module.css';

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
    <nav className={styles.sidebar}>
      
      <ul className={styles.navList}>
        {NAV_ITEMS.map(item => (
          <li key={item.key}>
            <button
              className={active === item.key ? styles.active : ''}
              onClick={() => onNavigate(item.key)}
              aria-label={item.label}
            >
              <span className={styles.icon}>{item.icon}</span>
              {item.label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
