import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import styles from '../styles/SummarizePanel.module.css';

export default function SummarizePanel({ token }) {
  const [input, setInput] = useState('');
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [format, setFormat] = useState('paragraph');

  const isInputValid = input.trim().length >= 20 && input.trim().length <= 10000;

  const handleSummarize = async (e) => {
    e.preventDefault();
    setLoading(true); setError(''); setSummary('');
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/assist`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ type: 'summarize', content: input, parameters: { format } }),
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setSummary(data.content);
    } catch (err) {
      setError('Failed to summarize. Please check your input and try again.');
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
        <div className={styles.formatRow}>
          <label htmlFor="summary-format">Format:</label>
          <select id="summary-format" value={format} onChange={e => setFormat(e.target.value)}>
            <option value="paragraph">Paragraph</option>
            <option value="bullets">Bullets</option>
            <option value="outline">Outline</option>
          </select>
        </div>
        <button type="submit" className={styles.btn} disabled={loading || !isInputValid}>
          {loading ? 'Summarizing...' : 'Summarize'}
        </button>
      </form>
      {summary && (
        <div className={styles.result}>
          <strong>Summary:</strong>
          <ReactMarkdown>{summary}</ReactMarkdown>
        </div>
      )}
      {error && <div className={styles.error}>{error}</div>}
    </section>
  );
}
