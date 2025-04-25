import React from 'react';
import styles from '../styles/Header.module.css';

export default function Header({ user, onLogout }) {
  return (
    <header className={styles.header + ' ' + styles.layoutHeader}>
      <div className={styles.title}>Personal AI Assistant</div>
      <div className={styles.userSection}>
        <span className={styles.user}>{user?.username || 'Guest'}</span>
        <button onClick={onLogout} className={styles.logoutBtn}>Logout</button>
      </div>
    </header>
  );
}
