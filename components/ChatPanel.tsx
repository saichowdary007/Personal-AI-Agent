import React from 'react';
import ChatWindow from '@/components/Chat/ChatWindow';
import ChatInput from '@/components/Chat/ChatInput';

const ChatPanel: React.FC = () => (
  <div className="flex flex-col gap-4">
    <ChatWindow />
    <ChatInput />
  </div>
);

export default ChatPanel;
