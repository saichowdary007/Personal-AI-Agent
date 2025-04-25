import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';

interface SummarizePanelProps {
  token: string;
}

const SummarizePanel: React.FC<SummarizePanelProps> = ({ token }) => {
  const [input, setInput] = useState('');
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [format, setFormat] = useState<'paragraph' | 'bullets' | 'outline'>('paragraph');

  const isInputValid = input.trim().length >= 20 && input.trim().length <= 10000;

  const handleSummarize = async (e: React.FormEvent<HTMLFormElement>) => {
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
    <section className="max-w-xl mx-auto p-4 bg-white dark:bg-gray-900 rounded-lg shadow flex flex-col gap-4">
      <h2 className="text-lg font-bold mb-2">Summarize Text</h2>
      <form onSubmit={handleSummarize} className="flex flex-col gap-2">
        <textarea
          className="rounded border border-gray-300 dark:border-gray-700 p-2 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Paste text to summarize..."
          value={input}
          onChange={e => setInput(e.target.value)}
          rows={4}
        />
        <div className="flex flex-wrap items-center gap-4">
          <label htmlFor="summary-format" className="text-sm">Format:</label>
          <select
            id="summary-format"
            value={format}
            onChange={e => setFormat(e.target.value as 'paragraph' | 'bullets' | 'outline')}
            className="rounded border border-gray-300 dark:border-gray-700 p-1 bg-gray-50 dark:bg-gray-800"
          >
            <option value="paragraph">Paragraph</option>
            <option value="bullets">Bullets</option>
            <option value="outline">Outline</option>
          </select>
        </div>
        <button
          type="submit"
          className="px-4 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition disabled:opacity-50"
          disabled={loading || !isInputValid}
        >
          {loading ? 'Summarizing...' : 'Summarize'}
        </button>
      </form>
      {summary && (
        <div className="bg-gray-100 dark:bg-gray-800 rounded p-3 mt-2">
          <strong>Summary:</strong>
          <div className="prose prose-sm dark:prose-invert">
            <ReactMarkdown>{summary}</ReactMarkdown>
          </div>
        </div>
      )}
      {error && <div className="text-red-600 bg-red-50 dark:bg-red-900 rounded p-2">{error}</div>}
    </section>
  );
};

export default SummarizePanel;
