'use client';

import { useState, useRef, useCallback } from 'react';
import Sidebar from "./components/Sidebar";
import ChatArea from "./components/ChatArea";
import MessageInput from "./components/MessageInput";

interface ImageData {
  data: string;
  mimeType: string;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  images?: ImageData[];
}

interface HistoryItem {
  id: string;
  question: string;
  timestamp: Date;
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const messageRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  const generateId = () => `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  const registerMessageRef = useCallback((id: string, element: HTMLDivElement | null) => {
    if (element) {
      messageRefs.current.set(id, element);
    } else {
      messageRefs.current.delete(id);
    }
  }, []);

  const scrollToMessage = useCallback((messageId: string) => {
    const element = messageRefs.current.get(messageId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      // Add highlight effect
      element.classList.add('highlight-message');
      setTimeout(() => {
        element.classList.remove('highlight-message');
      }, 2000);
    }
  }, []);

  const handleSendMessage = async (content: string, images?: ImageData[]) => {
    const messageId = generateId();

    // Add user message with images
    const userMessage: Message = {
      id: messageId,
      role: 'user',
      content,
      images
    };
    setMessages(prev => [...prev, userMessage]);

    // Add to history
    const historyQuestion = images && images.length > 0
      ? content
        ? `📷 ${content.substring(0, 30)}${content.length > 30 ? '...' : ''}`
        : `📷 Gambar (${images.length})`
      : content;

    const historyItem: HistoryItem = {
      id: messageId,
      question: historyQuestion,
      timestamp: new Date()
    };
    setHistory(prev => [...prev, historyItem]);

    setIsLoading(true);

    try {
      // Call API with images
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: content,
          images: images
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Add assistant message
        const assistantMessage: Message = {
          id: generateId(),
          role: 'assistant',
          content: data.message
        };
        setMessages(prev => [...prev, assistantMessage]);
      } else {
        // Add error message
        const errorMessage: Message = {
          id: generateId(),
          role: 'assistant',
          content: 'Maaf, terjadi kesalahan. Silakan coba lagi.'
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: generateId(),
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
    setHistory([]);
    messageRefs.current.clear();
  };

  const handleQuickAction = (action: string) => {
    handleSendMessage(action);
  };

  const handleHistoryClick = (messageId: string) => {
    scrollToMessage(messageId);
    // Close sidebar on mobile after selecting history item
    setSidebarOpen(false);
  };

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="flex h-screen bg-white">
      {/* Hamburger Menu Button - Fixed, hidden when sidebar is open */}
      <button
        onClick={toggleSidebar}
        className={`hamburger-btn ${sidebarOpen ? 'sidebar-open' : ''}`}
        aria-label="Toggle sidebar"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Sidebar */}
      <Sidebar
        onNewChat={handleNewChat}
        history={history}
        onHistoryClick={handleHistoryClick}
        isOpen={sidebarOpen}
        onClose={closeSidebar}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 main-content">
        {/* Chat Area */}
        <ChatArea
          messages={messages}
          isLoading={isLoading}
          onQuickAction={handleQuickAction}
          registerMessageRef={registerMessageRef}
        />

        {/* Message Input */}
        <MessageInput onSendMessage={handleSendMessage} isLoading={isLoading} />
      </div>
    </div>
  );
}
