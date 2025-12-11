'use client';

import { useState } from 'react';
import Sidebar from "./components/Sidebar";
import ChatArea from "./components/ChatArea";
import MessageInput from "./components/MessageInput";

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (content: string) => {
    // Add user message
    const userMessage: Message = { role: 'user', content };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Call API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: content }),
      });

      const data = await response.json();

      if (data.success) {
        // Add assistant message
        const assistantMessage: Message = {
          role: 'assistant',
          content: data.message
        };
        setMessages(prev => [...prev, assistantMessage]);
      } else {
        // Add error message
        const errorMessage: Message = {
          role: 'assistant',
          content: 'Maaf, terjadi kesalahan. Silakan coba lagi.'
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        role: 'assistant',
        content: 'Maaf, terjadi kesalahan koneksi. Silakan coba lagi.'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewChat = () => {
    setMessages([]);
  };

  const handleQuickAction = (action: string) => {
    handleSendMessage(action);
  };

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <Sidebar onNewChat={handleNewChat} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Chat Area */}
        <ChatArea
          messages={messages}
          isLoading={isLoading}
          onQuickAction={handleQuickAction}
        />

        {/* Message Input */}
        <MessageInput onSendMessage={handleSendMessage} isLoading={isLoading} />
      </div>
    </div>
  );
}
