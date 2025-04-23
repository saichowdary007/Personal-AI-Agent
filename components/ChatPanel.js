import React, { useRef, useEffect } from 'react';
import MessageBubble from './MessageBubble';
import ReactMarkdown from 'react-markdown';
import styles from '../styles/ChatPanel.module.css';

export default function ChatPanel({ messages, content, setContent, onSend, loading, typing }) {
  const bottomRef = useRef(null);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  return (
    <section className={styles.chatPanel}>
      <div className={styles.history}>
        {messages.map((msg, idx) => (
          <MessageBubble key={idx} from={msg.from}>
            <ReactMarkdown>{msg.text}</ReactMarkdown>
          </MessageBubble>
        ))}
        {typing && (
          <div className={styles.typingIndicator}>
            <span className={styles.dot}></span>
            <span className={styles.dot}></span>
            <span className={styles.dot}></span>
            <span>AI is typing…</span>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
      <form className={styles.inputRow} onSubmit={onSend}>
        <input
          type="text"
          placeholder="Type a message"
          value={content}
          onChange={e => setContent(e.target.value)}
          disabled={loading}
          className={styles.input}
        />
        <button type="submit" className={styles.sendBtn} disabled={loading || !content.trim()}>
          {loading ? 'Sending...' : 'Send'}
        </button>
      </form>
    </section>
  );
}
