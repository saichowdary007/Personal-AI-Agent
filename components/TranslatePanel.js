import React, { useState } from 'react';
import styles from '../styles/TranslatePanel.module.css';

const LANGUAGES = [
  'English', 'French', 'Spanish', 'German', 'Italian', 'Chinese', 'Japanese', 'Korean', 'Hindi', 'Arabic'
];

export default function TranslatePanel({ token }) {
  const [input, setInput] = useState('');
  const [target, setTarget] = useState('French');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTranslate = async (e) => {
    e.preventDefault();
    setLoading(true); setError(''); setResult('');
    try {
      const res = await fetch('http://localhost:8000/assist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ type: 'translate', content: input, parameters: { target_language: target } }),
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setResult(data.content);
    } catch (err) {
      setError('Failed to translate.');
    }
    setLoading(false);
  };

  return (
    <section className={styles.panel}>
      <h2>Translate Text</h2>
      <form onSubmit={handleTranslate} className={styles.form}>
        <textarea
          className={styles.input}
          placeholder="Enter text to translate..."
          value={input}
          onChange={e => setInput(e.target.value)}
          rows={3}
        />
        <select
          className={styles.select}
          value={target}
          onChange={e => setTarget(e.target.value)}
        >
          {LANGUAGES.map(lang => <option key={lang} value={lang}>{lang}</option>)}
        </select>
        <button type="submit" className={styles.btn} disabled={loading || !input.trim()}>
          {loading ? 'Translating...' : 'Translate'}
        </button>
      </form>
      {result && <div className={styles.result}><strong>Translation:</strong> {result}</div>}
      {error && <div className={styles.error}>{error}</div>}
    </section>
  );
}
