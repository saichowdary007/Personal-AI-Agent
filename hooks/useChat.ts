import { useState, useEffect, useCallback } from 'react';
import { useApiClient } from './useApiClient';

type MessageRole = 'system' | 'user' | 'assistant';

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
}

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { fetchFromApi } = useApiClient();

  // Load initial greeting
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: '0',
          role: 'assistant',
          content: 'Hello! How can I help you today?',
        },
      ]);
    }
  }, [messages.length]);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;

    setIsLoading(true);
    setError(null);

    // Add user message immediately
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
    };
    setMessages((prev) => [...prev, userMessage]);

    try {
      // Try to use our Next.js API endpoint first (handles token authentication)
      // Get token from localStorage and add Authorization header
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const data = await response.json();
      
      // Extract assistant message
      if (data.messages && data.messages.length >= 2) {
        const assistantResponse = data.messages[1];
        const assistantMessage: Message = {
          id: assistantResponse.id || Date.now().toString(),
          role: 'assistant',
          content: assistantResponse.content,
        };
        setMessages((prev) => [...prev, assistantMessage]);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err: any) {
      console.error('Error in chat:', err);
      setError(err.message || 'Failed to send message');
      
      // Fall back to our direct backend authenticated API client
      try {
        const result = await fetchFromApi('/assist', {
          method: 'POST',
          body: {
            type: 'chat',
            content,
          },
        });

        if (result.error) {
          throw new Error(result.error);
        }

        if (result.data) {
          const assistantMessage: Message = {
            id: Date.now().toString(),
            role: 'assistant',
            content: result.data.content || 'Sorry, I could not process your request.',
          };
          setMessages((prev) => [...prev, assistantMessage]);
          setError(null);
        }
      } catch (backendErr: any) {
        console.error('Backend fallback error:', backendErr);
        // Add error message as assistant
        const errorMessage: Message = {
          id: Date.now().toString(),
          role: 'assistant',
          content: 'Sorry, I encountered an error. Please try again later.',
        };
        setMessages((prev) => [...prev, errorMessage]);
      }
    } finally {
      setIsLoading(false);
    }
  }, [fetchFromApi]);

  const clearChat = useCallback(() => {
    setMessages([
      {
        id: '0',
        role: 'assistant',
        content: 'Hello! How can I help you today?',
      },
    ]);
    setError(null);
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearChat,
  };
}

/*
Key Points:
- SWR for fetching chat messages.
- sendMessage posts to /api/chat and refreshes.
- Handles loading, error, and retry.
- Type-safe ChatMessage interface.
*/
