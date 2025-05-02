"use client";
import React, { useEffect, useRef } from 'react';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import ErrorState from '@/components/ErrorState';
import { useChat } from '@/hooks/useChat';
import { XCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const ChatWindow: React.FC = () => {
  const { messages, isLoading, error } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Scroll to bottom when messages change or loading state changes
  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  if (isLoading && messages.length === 0) {
    return <LoadingSkeleton className="h-64 w-full" />;
  }

  if (error && messages.length === 0) {
    return (
      <div className="flex h-64 flex-col items-center justify-center rounded-lg border border-red-200 bg-red-50 p-4 text-center dark:border-red-800 dark:bg-red-900/20">
        <XCircle className="mb-2 size-8 text-red-500" />
        <h3 className="mb-1 text-lg font-semibold text-red-700 dark:text-red-400">Connection Error</h3>
        <p className="text-sm text-red-600 dark:text-red-300">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex max-h-[60vh] flex-col gap-4 overflow-y-auto rounded-lg border border-zinc-200 bg-zinc-50 p-2 dark:border-zinc-700 dark:bg-zinc-800">
      {messages.length === 0 ? (
        <div className="text-center text-zinc-400">No messages yet.</div>
      ) : (
        <>
          {messages.map((msg, i) => (
            <div key={msg.id || i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div 
                className={`max-w-xs rounded-lg px-4 py-2 md:max-w-md ${msg.role === 'user' ? 'bg-blue-500 text-white' : 'bg-zinc-200 text-zinc-900 dark:bg-zinc-700 dark:text-zinc-100'}`}
                aria-label={msg.role === 'user' ? 'User message' : 'AI message'}
              >
                {msg.role === 'user' ? (
                  <p>{msg.content}</p>
                ) : (
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />,
                        ul: ({node, ...props}) => <ul className="list-disc pl-6 mb-3" {...props} />,
                        ol: ({node, ...props}) => <ol className="list-decimal pl-6 mb-3" {...props} />,
                        li: ({node, ...props}) => <li className="mb-1" {...props} />,
                        h1: ({node, ...props}) => <h1 className="text-xl font-bold mb-2 mt-3" {...props} />,
                        h2: ({node, ...props}) => <h2 className="text-lg font-bold mb-2 mt-3" {...props} />,
                        h3: ({node, ...props}) => <h3 className="text-md font-bold mb-1 mt-2" {...props} />,
                        strong: ({node, ...props}) => <strong className="font-bold" {...props} />,
                        code: ({node, className, ...props}) => {
                          const match = /language-(\w+)/.exec(className || '');
                          const isInline = !match && (props.children?.toString() || '').split('\n').length <= 1;
                          return isInline ? 
                            <code className="bg-zinc-200 dark:bg-zinc-600 px-1 py-0.5 rounded" {...props} /> : 
                            <code className="block bg-zinc-200 dark:bg-zinc-600 p-2 rounded my-2 overflow-x-auto" {...props} />;
                        },
                        blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-zinc-300 dark:border-zinc-500 pl-3 py-1 italic my-2" {...props} />,
                      }}
                    >
                      {msg.content}
                    </ReactMarkdown>
                  </div>
                )}
              </div>
            </div>
          ))}
          {/* Invisible element to scroll to */}
          <div ref={messagesEndRef} />
        </>
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
