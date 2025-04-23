import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import styles from '../styles/EmailPanel.module.css';

export default function EmailPanel({ token }) {
  const [prompt, setPrompt] = useState('');
  const [draft, setDraft] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [tone, setTone] = useState('professional');
  const [format, setFormat] = useState('full');

  const isInputValid = prompt.trim().length >= 10;

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
        body: JSON.stringify({ type: 'email', content: prompt, parameters: { tone, format } }),
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setDraft(data.content);
    } catch (err) {
      setError('Failed to draft email. Please check your input and try again.');
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
        <div className={styles.formatRow}>
          <label htmlFor="email-tone">Tone:</label>
          <select id="email-tone" value={tone} onChange={e => setTone(e.target.value)}>
            <option value="professional">Professional</option>
            <option value="friendly">Friendly</option>
            <option value="apologetic">Apologetic</option>
            <option value="concise">Concise</option>
            <option value="informal">Informal</option>
          </select>
          <label htmlFor="email-format" style={{marginLeft:12}}>Format:</label>
          <select id="email-format" value={format} onChange={e => setFormat(e.target.value)}>
            <option value="full">Full Email</option>
            <option value="reply">Reply</option>
            <option value="forward">Forward</option>
          </select>
        </div>
        <button type="submit" className={styles.btn} disabled={loading || !isInputValid}>
          {loading ? 'Drafting...' : 'Draft Email'}
        </button>
      </form>
      {draft && (
        <div className={styles.result}>
          <strong>Email Draft:</strong>
          <ReactMarkdown>{draft}</ReactMarkdown>
        </div>
      )}
      {error && <div className={styles.error}>{error}</div>}
    </section>
  );
}
