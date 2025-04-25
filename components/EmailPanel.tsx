import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';

interface EmailPanelProps {
  token: string;
}

const EmailPanel: React.FC<EmailPanelProps> = ({ token }) => {
  const [prompt, setPrompt] = useState('');
  const [draft, setDraft] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [tone, setTone] = useState('professional');
  const [format, setFormat] = useState<'full' | 'reply' | 'forward'>('full');

  const isInputValid = prompt.trim().length >= 10;

  const handleDraft = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true); setError(''); setDraft('');
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/assist`, {
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
    <section className="max-w-xl mx-auto p-4 bg-white dark:bg-gray-900 rounded-lg shadow flex flex-col gap-4">
      <h2 className="text-lg font-bold mb-2">Email Drafting</h2>
      <form onSubmit={handleDraft} className="flex flex-col gap-2">
        <textarea
          className="rounded border border-gray-300 dark:border-gray-700 p-2 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Describe the email you want to draft..."
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          rows={3}
        />
        <div className="flex flex-wrap items-center gap-4">
          <label htmlFor="email-tone" className="text-sm">Tone:</label>
          <select
            id="email-tone"
            value={tone}
            onChange={e => setTone(e.target.value)}
            className="rounded border border-gray-300 dark:border-gray-700 p-1 bg-gray-50 dark:bg-gray-800"
          >
            <option value="professional">Professional</option>
            <option value="friendly">Friendly</option>
            <option value="apologetic">Apologetic</option>
            <option value="concise">Concise</option>
            <option value="informal">Informal</option>
          </select>
          <label htmlFor="email-format" className="text-sm ml-2">Format:</label>
          <select
            id="email-format"
            value={format}
            onChange={e => setFormat(e.target.value as 'full' | 'reply' | 'forward')}
            className="rounded border border-gray-300 dark:border-gray-700 p-1 bg-gray-50 dark:bg-gray-800"
          >
            <option value="full">Full Email</option>
            <option value="reply">Reply</option>
            <option value="forward">Forward</option>
          </select>
        </div>
        <button
          type="submit"
          className="px-4 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition disabled:opacity-50"
          disabled={loading || !isInputValid}
        >
          {loading ? 'Drafting...' : 'Draft Email'}
        </button>
      </form>
      {draft && (
        <div className="bg-gray-100 dark:bg-gray-800 rounded p-3 mt-2">
          <strong>Email Draft:</strong>
          <div className="prose prose-sm dark:prose-invert">
            <ReactMarkdown>{draft}</ReactMarkdown>
          </div>
        </div>
      )}
      {error && <div className="text-red-600 bg-red-50 dark:bg-red-900 rounded p-2">{error}</div>}
    </section>
  );
};

export default EmailPanel;
