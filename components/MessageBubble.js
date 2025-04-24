import React from 'react';
import styles from '../styles/MessageBubble.module.css';

export default function MessageBubble({ from, children }) {
  const isUser = from === 'You';
  return (
    <div className={isUser ? styles.userBubble : styles.aiBubble}>
      <span className={styles.from}>{from}:</span> {children}
    </div>
  );
}
