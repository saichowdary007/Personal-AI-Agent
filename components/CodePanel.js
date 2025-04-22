import React, { useState } from 'react';
import styles from '../styles/CodePanel.module.css';

export default function CodePanel({ token }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCode = async (e) => {
    e.preventDefault();
    setLoading(true); setError(''); setOutput('');
    try {
      const res = await fetch('http://localhost:8000/assist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ type: 'code', content: input }),
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setOutput(data.content);
    } catch (err) {
      setError('Failed to process code.');
    }
    setLoading(false);
  };

  return (
    <section className={styles.panel}>
      <h2>Code Assistant</h2>
      <form onSubmit={handleCode} className={styles.form}>
        <textarea
          className={styles.input}
          placeholder="Paste code or describe your coding problem..."
          value={input}
          onChange={e => setInput(e.target.value)}
          rows={4}
        />
        <button type="submit" className={styles.btn} disabled={loading || !input.trim()}>
          {loading ? 'Processing...' : 'Ask AI'}
        </button>
      </form>
      {output && <div className={styles.result}><strong>AI Response:</strong><br />{output}</div>}
      {error && <div className={styles.error}>{error}</div>}
    </section>
  );
}
