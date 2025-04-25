import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';

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
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/assist`, {
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
    <section className="max-w-xl mx-auto p-4 bg-white dark:bg-gray-900 rounded-lg shadow flex flex-col gap-4">
      <h2 className="text-lg font-bold mb-2">Translate Text</h2>
      <form onSubmit={handleTranslate} className="flex flex-col gap-2">
        <textarea
          className="rounded border border-gray-300 dark:border-gray-700 p-2 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter text to translate..."
          value={input}
          onChange={e => setInput(e.target.value)}
          rows={3}
        />
        <div className="flex flex-wrap items-center gap-4">
          <label htmlFor="target-language" className="text-sm">Target Language:</label>
          <select
            id="target-language"
            value={target}
            onChange={e => setTarget(e.target.value)}
            className="rounded border border-gray-300 dark:border-gray-700 p-1 bg-gray-50 dark:bg-gray-800"
          >
            {LANGUAGES.map(lang => <option key={lang} value={lang}>{lang}</option>)}
          </select>
        </div>
        <button
          type="submit"
          className="px-4 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition disabled:opacity-50"
          disabled={loading || !isInputValid}
        >
          {loading ? 'Translating...' : 'Translate'}
        </button>
      </form>
      {result && (
        <div className="bg-gray-100 dark:bg-gray-800 rounded p-3 mt-2">
          <strong>Translation:</strong>
          <ReactMarkdown className="prose prose-sm dark:prose-invert">{result}</ReactMarkdown>
        </div>
      )}
      {error && <div className="text-red-600 bg-red-50 dark:bg-red-900 rounded p-2">{error}</div>}
    </section>
  );
}
