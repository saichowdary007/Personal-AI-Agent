import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
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

  const isInputValid = input.trim().length >= 2;

  const handleTranslate = async (e) => {
    e.preventDefault();
    setError(''); setResult('');
    if (!token) {
      setError('You must be logged in to use the translation feature. Please sign in.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8000/assist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include',
        body: JSON.stringify({ type: 'translate', content: input, parameters: { target_language: target } }),
      });
      if (res.status === 401) {
        setError('Session expired or unauthorized. Please log in again.');
        setLoading(false);
        return;
      }
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setResult(data.content);
    } catch (err) {
      setError('Failed to translate. Please check your input and try again.');
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
        <button type="submit" className={styles.btn} disabled={loading || !isInputValid}>
          {loading ? 'Translating...' : 'Translate'}
        </button>
      </form>
      {result && (
        <div className={styles.result}>
          <strong>Translation:</strong>
          <ReactMarkdown>{result}</ReactMarkdown>
        </div>
      )}
      {error && <div className={styles.error}>{error}</div>}
    </section>
  );
}
