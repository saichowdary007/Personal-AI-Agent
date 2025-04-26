import React from 'react';
import ChatWindow from '@/components/Chat/ChatWindow';
import ChatInput from '@/components/Chat/ChatInput';

const ChatPage: React.FC = () => {
  return (
    <section aria-labelledby="chat-heading">
      <h1 id="chat-heading" className="sr-only">Chat</h1>
      <div className="mx-auto flex max-w-2xl flex-col gap-4">
        <ChatWindow />
        <ChatInput />
      </div>
    </section>
  );
};

export default ChatPage;
