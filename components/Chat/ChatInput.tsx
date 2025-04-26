"use client";
import React, { useState } from 'react';
import { useChat } from '@/hooks/useChat';

const ChatInput: React.FC = () => {
  const [input, setInput] = useState('');
  const { sendMessage, isSending } = useChat();

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    await sendMessage(input);
    setInput('');
  };

  return (
    <form className="mt-4 flex items-center gap-2" onSubmit={handleSend} aria-label="Send message">
      <input
        type="text"
        className="flex-1 rounded-lg border border-zinc-300 bg-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-900"
        placeholder="Type your message..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        aria-label="Message input"
        disabled={isSending}
        required
      />
      <button
        type="submit"
        className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
        disabled={isSending || !input.trim()}
        aria-disabled={isSending || !input.trim()}
      >
        {isSending ? 'Sending...' : 'Send'}
      </button>
    </form>
  );
};

export default ChatInput;

/*
Key Points:
- Controlled input for chat message.
- Calls sendMessage from useChat hook.
- Accessible: aria-labels, disables when sending.
*/
