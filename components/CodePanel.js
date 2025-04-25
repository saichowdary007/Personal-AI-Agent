import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';

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
    <section className="max-w-xl mx-auto p-4 bg-white dark:bg-gray-900 rounded-lg shadow flex flex-col gap-4">
      <h2 className="text-lg font-bold mb-2">AI Code Assistant</h2>
      <form onSubmit={handleCode} className="flex flex-col gap-2">
        <textarea
          className="rounded border border-gray-300 dark:border-gray-700 p-2 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Paste code or describe what you want..."
          value={input}
          onChange={e => setInput(e.target.value)}
          rows={3}
        />
        <div className="flex flex-wrap items-center gap-4">
          <label htmlFor="code-action" className="text-sm">Action:</label>
          <select
            id="code-action"
            value={action}
            onChange={e => setAction(e.target.value)}
            className="rounded border border-gray-300 dark:border-gray-700 p-1 bg-gray-50 dark:bg-gray-800"
          >
            <option value="explain">Explain</option>
            <option value="debug">Debug</option>
            <option value="improve">Improve</option>
            <option value="document">Document</option>
            <option value="convert">Convert Language</option>
          </select>
          <label htmlFor="code-language" className="text-sm ml-2">Language:</label>
          <select
            id="code-language"
            value={language}
            onChange={e => setLanguage(e.target.value)}
            className="rounded border border-gray-300 dark:border-gray-700 p-1 bg-gray-50 dark:bg-gray-800"
          >
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
        <button
          type="submit"
          className="px-4 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition disabled:opacity-50"
          disabled={loading || !isInputValid}
        >
          {loading ? 'Processing...' : 'Ask AI'}
        </button>
      </form>
      {output && (
        <div className="bg-gray-100 dark:bg-gray-800 rounded p-3 mt-2">
          <strong>AI Response:</strong>
          <ReactMarkdown className="prose prose-sm dark:prose-invert">{output}</ReactMarkdown>
        </div>
      )}
      {error && <div className="text-red-600 bg-red-50 dark:bg-red-900 rounded p-2">{error}</div>}
    </section>
  );
}
