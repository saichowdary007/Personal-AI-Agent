import React, { useState } from 'react';
import styles from '../styles/SummarizePanel.module.css';

export default function SummarizePanel({ token }) {
  const [input, setInput] = useState('');
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSummarize = async (e) => {
    e.preventDefault();
    setLoading(true); setError(''); setSummary('');
    try {
      const res = await fetch('http://localhost:8000/assist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ type: 'summarize', content: input }),
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setSummary(data.content);
    } catch (err) {
      setError('Failed to summarize.');
    }
    setLoading(false);
  };

  return (
    <section className={styles.panel}>
      <h2>Summarize Text</h2>
      <form onSubmit={handleSummarize} className={styles.form}>
        <textarea
          className={styles.input}
          placeholder="Paste text to summarize..."
          value={input}
          onChange={e => setInput(e.target.value)}
          rows={4}
        />
        <button type="submit" className={styles.btn} disabled={loading || !input.trim()}>
          {loading ? 'Summarizing...' : 'Summarize'}
        </button>
      </form>
      {summary && <div className={styles.result}><strong>Summary:</strong> {summary}</div>}
      {error && <div className={styles.error}>{error}</div>}
    </section>
  );
}
