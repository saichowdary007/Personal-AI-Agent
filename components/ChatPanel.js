import React, { useRef, useEffect } from 'react';
import MessageBubble from './MessageBubble';
import ReactMarkdown from 'react-markdown';

export default function ChatPanel({ messages, content, setContent, onSend, loading, typing }) {
  console.log("Current messages:", messages);
  const bottomRef = useRef(null);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  return (
    <section className="min-h-screen flex flex-col relative z-10 bg-white dark:bg-gray-900">
      {/* Message History */}
      <div className="flex-1 overflow-y-auto px-2 py-4 sm:px-4">
        {messages.map((msg, idx) => (
          <MessageBubble key={idx} from={msg.from}>
            <ReactMarkdown className="prose prose-sm sm:prose-base dark:prose-invert">{msg.content || msg.text}</ReactMarkdown>
          </MessageBubble>
        ))}
        {typing && (
          <div className="flex items-center gap-2 mt-2 text-gray-500 dark:text-gray-300">
            <span className="animate-bounce w-2 h-2 rounded-full bg-gray-400"></span>
            <span className="animate-bounce w-2 h-2 rounded-full bg-gray-400 delay-75"></span>
            <span className="animate-bounce w-2 h-2 rounded-full bg-gray-400 delay-150"></span>
            <span>AI is typing…</span>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
      {/* Input Row */}
      <form
        className="flex items-center gap-2 p-2 sm:p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 sticky bottom-0"
        onSubmit={onSend}
      >
        <input
          type="text"
          placeholder="Type a message"
          value={content}
          onChange={e => setContent(e.target.value)}
          disabled={loading}
          className="flex-1 rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-base bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
        <button
          type="submit"
          disabled={loading || !content.trim()}
          className="px-4 py-2 rounded-md bg-blue-600 text-white font-semibold hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? 'Sending...' : 'Send'}
        </button>
      </form>
    </section>
  );
}
