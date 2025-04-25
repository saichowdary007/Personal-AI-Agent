import React, { ReactNode } from 'react';

interface MessageBubbleProps {
  from: string;
  children: ReactNode;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ from, children }) => {
  const isUser = from === 'You';
  return (
    <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} w-full`}>
      <span className="text-xs text-gray-400 mb-1">{from}:</span>
      <div
        className={`rounded-lg px-4 py-2 my-1 max-w-[80%] break-words shadow \
          ${isUser
            ? 'bg-blue-600 text-white self-end'
            : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 self-start'}
        `}
      >
        {children}
      </div>
    </div>
  );
};

export default MessageBubble;
