import React, { useState } from 'react';
import styles from '../styles/EmailPanel.module.css';

export default function EmailPanel({ token }) {
  const [prompt, setPrompt] = useState('');
  const [draft, setDraft] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDraft = async (e) => {
    e.preventDefault();
    setLoading(true); setError(''); setDraft('');
    try {
      const res = await fetch('http://localhost:8000/assist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ type: 'email', content: prompt }),
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setDraft(data.content);
    } catch (err) {
      setError('Failed to draft email.');
    }
    setLoading(false);
  };

  return (
    <section className={styles.panel}>
      <h2>Email Drafting</h2>
      <form onSubmit={handleDraft} className={styles.form}>
        <textarea
          className={styles.input}
          placeholder="Describe the email you want to draft..."
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          rows={3}
        />
        <button type="submit" className={styles.btn} disabled={loading || !prompt.trim()}>
          {loading ? 'Drafting...' : 'Draft Email'}
        </button>
      </form>
      {draft && <div className={styles.result}><strong>Email Draft:</strong><br />{draft}</div>}
      {error && <div className={styles.error}>{error}</div>}
    </section>
  );
}
