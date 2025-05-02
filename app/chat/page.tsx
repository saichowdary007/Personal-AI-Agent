"use client";
import React, { useState, useRef, useEffect } from 'react';
import { useChat } from '@/hooks/useChat';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const ChatPage: React.FC = () => {
  const { messages, isLoading, error, sendMessage } = useChat();
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Scroll to bottom when messages change or loading state changes
  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);
  
  // Auto-focus input field when page loads and after sending a message
  useEffect(() => {
    // Short timeout to ensure the focus happens after any UI updates
    const focusTimer = setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
    
    return () => clearTimeout(focusTimer);
  }, [messages.length, isLoading]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    
    const text = inputText;
    setInputText('');
    await sendMessage(text);
  };

  return (
    <section className="mx-auto max-w-4xl p-4 h-[calc(100vh-100px)] flex flex-col">
      <div className="mb-4">
        <h1 className="mb-2 text-2xl font-bold">Chat Assistant</h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          Ask me anything and I'll do my best to help you.
        </p>
      </div>

      <div className="flex-1 overflow-auto mb-4 border border-zinc-200 rounded-lg p-4 bg-white dark:bg-zinc-800 dark:border-zinc-700">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-zinc-500">
            No messages yet. Start a conversation!
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg, index) => (
              <div 
                key={msg.id || index} 
                className={`p-3 rounded-lg ${
                  msg.role === 'user' 
                    ? 'bg-blue-100 dark:bg-blue-900/30 ml-12' 
                    : 'bg-zinc-100 dark:bg-zinc-700 mr-12'
                }`}
              >
                <div className="font-medium mb-1">
                  {msg.role === 'user' ? 'You' : 'Assistant'}
                </div>
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  {msg.role === 'user' ? (
                    <p>{msg.content}</p>
                  ) : (
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
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="p-3 rounded-lg bg-zinc-100 dark:bg-zinc-700 mr-12 animate-pulse">
                <div className="font-medium mb-1">Assistant</div>
                <div>Thinking...</div>
              </div>
            )}
            {/* Invisible element to scroll to */}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg dark:bg-red-900/20 dark:text-red-400">
          Error: {error}
        </div>
      )}

      <form onSubmit={handleSendMessage} className="flex gap-2">
        <input
          ref={inputRef}
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 p-3 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
          disabled={isLoading}
          autoFocus
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          disabled={isLoading || !inputText.trim()}
        >
          Send
        </button>
      </form>
    </section>
  );
};

export default ChatPage;
