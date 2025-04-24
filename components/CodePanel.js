import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import styles from '../styles/CodePanel.module.css';

export default function CodePanel({ token }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [action, setAction] = useState('explain');
  const [language, setLanguage] = useState('python');

  const isInputValid = input.trim().length >= 5;

  const handleCode = async (e) => {
    e.preventDefault();
    setLoading(true); setError(''); setOutput('');
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/assist`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ type: 'code', content: input, parameters: { action, language } }),
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setOutput(data.content);
    } catch (err) {
      setError('Failed to process code. Please check your input and try again.');
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
        <div className={styles.formatRow}>
          <label htmlFor="code-action">Action:</label>
          <select id="code-action" value={action} onChange={e => setAction(e.target.value)}>
            <option value="explain">Explain</option>
            <option value="debug">Debug</option>
            <option value="improve">Improve</option>
            <option value="document">Document</option>
            <option value="convert">Convert Language</option>
          </select>
          <label htmlFor="code-lang" style={{marginLeft:12}}>Language:</label>
          <select id="code-lang" value={language} onChange={e => setLanguage(e.target.value)}>
            <option value="python">Python</option>
            <option value="javascript">JavaScript</option>
            <option value="typescript">TypeScript</option>
            <option value="java">Java</option>
            <option value="c++">C++</option>
            <option value="go">Go</option>
            <option value="bash">Bash</option>
            <option value="other">Other</option>
          </select>
        </div>
        <button type="submit" className={styles.btn} disabled={loading || !isInputValid}>
          {loading ? 'Processing...' : 'Ask AI'}
        </button>
      </form>
      {output && (
        <div className={styles.result}>
          <strong>AI Response:</strong>
          <ReactMarkdown>{output}</ReactMarkdown>
        </div>
      )}
      {error && <div className={styles.error}>{error}</div>}
    </section>
  );
}
