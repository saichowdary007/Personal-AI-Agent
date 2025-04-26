"use client";
import React from 'react';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import ErrorState from '@/components/ErrorState';
import { useChat } from '@/hooks/useChat';

const ChatWindow: React.FC = () => {
  const { messages, isLoading, error, retry } = useChat();

  if (isLoading) {
    return <LoadingSkeleton className="h-64 w-full" />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={retry} />;
  }

  return (
    <div className="flex max-h-[60vh] flex-col gap-4 overflow-y-auto rounded-lg border border-zinc-200 bg-zinc-50 p-2 dark:border-zinc-700 dark:bg-zinc-800">
      {messages.length === 0 ? (
        <div className="text-center text-zinc-400">No messages yet.</div>
      ) : (
        messages.map((msg, i) => (
          <div key={msg.id || i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs rounded-lg px-4 py-2 md:max-w-md ${msg.role === 'user' ? 'bg-blue-500 text-white' : 'bg-zinc-200 text-zinc-900 dark:bg-zinc-700 dark:text-zinc-100'}`}
                 aria-label={msg.role === 'user' ? 'User message' : 'AI message'}>
              {msg.content}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ChatWindow;

/*
Key Points:
- Displays chat messages with different styles for user/AI.
- Shows loading skeleton and error state.
- Accessible: aria-label for message roles.
*/
