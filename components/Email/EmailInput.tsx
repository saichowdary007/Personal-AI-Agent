"use client";
import React, { useState } from 'react';

interface EmailInputProps {
  onSubmit: (prompt: string) => Promise<any>;
  isLoading: boolean;
}

const EmailInput: React.FC<EmailInputProps> = ({ onSubmit, isLoading }) => {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      onSubmit(prompt);
    }
  };

  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-700 dark:bg-zinc-800">
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="email-prompt" className="mb-2 block font-medium text-zinc-700 dark:text-zinc-300">
            Describe the email you want to draft
          </label>
          <textarea
            id="email-prompt"
            className="w-full rounded-md border border-zinc-300 p-3 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-900 dark:text-white"
            rows={6}
            placeholder="Examples: 'Write a professional email to my boss requesting a day off next Friday' or 'Draft a friendly follow-up email to a client who hasn't responded in two weeks'"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={isLoading}
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="rounded-md bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:focus:ring-offset-zinc-800"
            disabled={isLoading || !prompt.trim()}
          >
            {isLoading ? 'Generating...' : 'Generate Email'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EmailInput; 