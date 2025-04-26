import { useState, useCallback } from 'react';
import useSWR from 'swr';

export interface ChatMessage {
  id?: string;
  role: 'user' | 'assistant';
  content: string;
}

const fetcher = (url: string) => fetch(url, { credentials: 'include' }).then(res => res.json());

export function useChat() {
  const { data, error, mutate, isLoading } = useSWR<{ messages: ChatMessage[] }>('/api/chat', fetcher);
  const [isSending, setIsSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);

  const sendMessage = useCallback(async (content: string) => {
    setIsSending(true);
    setSendError(null);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ content }),
      });
      if (!res.ok) throw new Error('Failed to send message');
      await mutate(); // Refresh chat
    } catch (err: any) {
      setSendError(err.message);
    } finally {
      setIsSending(false);
    }
  }, [mutate]);

  const retry = () => mutate();

  return {
    messages: data?.messages || [],
    isLoading,
    error: error ? (error.message || 'Failed to load chat') : sendError,
    isSending,
    sendMessage,
    retry,
  };
}

/*
Key Points:
- SWR for fetching chat messages.
- sendMessage posts to /api/chat and refreshes.
- Handles loading, error, and retry.
- Type-safe ChatMessage interface.
*/
