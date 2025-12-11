'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

interface ChatAreaProps {
  messages: Message[];
  isLoading: boolean;
  onQuickAction: (action: string) => void;
  registerMessageRef: (id: string, element: HTMLDivElement | null) => void;
}

export default function ChatArea({ messages, isLoading, onQuickAction, registerMessageRef }: ChatAreaProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Quick action suggestions
  const quickActions = [
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'Informasi Layanan',
      description: 'Layanan pertanahan',
      action: 'Apa saja layanan yang tersedia di Kantor Pertanahan Kabupaten Grobogan?'
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      title: 'Balik Nama/Waris',
      description: 'Prosedur & persyaratan',
      action: 'Bagaimana syarat balik nama sertifikat tanah?'
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      ),
      title: 'Kontak & Alamat',
      description: 'Hubungi kami',
      action: 'Berapa nomor kontak dan alamat BPN Grobogan?'
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'Jam Operasional',
      description: 'Waktu pelayanan',
      action: 'Berapa jam operasional Kantor Pertanahan Kabupaten Grobogan?'
    }
  ];

  // Show welcome screen when no messages
  if (messages.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-white overflow-y-auto">
        <div className="max-w-2xl w-full text-center">
          {/* Logo */}
          <div className="mb-6 flex justify-center">
            <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-lg">
              <Image
                src="/gribo.png"
                alt="BPN Grobogan Logo"
                width={64}
                height={64}
                className="object-cover w-full h-full"
              />
            </div>
          </div>

          {/* Welcome Text */}
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">
            Selamat Datang
          </h1>
          <p className="text-gray-500 mb-8 max-w-md mx-auto">
            Saya asisten virtual Kantor Pertanahan Kabupaten Grobogan. Ada yang bisa saya bantu hari ini?
          </p>

          {/* Quick Actions Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg mx-auto">
            {quickActions.map((item, index) => (
              <button
                key={index}
                onClick={() => onQuickAction(item.action)}
                className="flex items-start gap-3 p-4 bg-white border border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50/50 transition-all text-left group hover-lift"
              >
                <div className="p-2 rounded-lg bg-gray-100 text-gray-600 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                  {item.icon}
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 text-sm">{item.title}</h3>
                  <p className="text-xs text-gray-500">{item.description}</p>
                </div>
              </button>
            ))}
          </div>

          {/* Hint Text */}
          <p className="mt-8 text-xs text-gray-400">
            Ketik pertanyaan atau pilih topik di atas untuk memulai
          </p>
        </div>
      </div>
    );
  }

  // Show messages when chat started
  return (
    <div className="flex-1 overflow-y-auto bg-white chat-messages">
      <div className="max-w-3xl mx-auto px-4 py-6 space-y-4">
        {messages.map((message, index) => (
          <div
            key={message.id}
            ref={(el) => {
              if (message.role === 'user') {
                registerMessageRef(message.id, el);
              }
            }}
            className={`flex gap-3 message-animate ${message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            {/* Assistant Avatar */}
            {message.role === 'assistant' && (
              <div className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0 shadow-sm">
                <Image
                  src="/gribo.png"
                  alt="Bot Avatar"
                  width={32}
                  height={32}
                  className="object-cover w-full h-full"
                />
              </div>
            )}

            {/* Message Bubble */}
            <div
              className={`max-w-[75%] rounded-2xl px-4 py-3 ${message.role === 'user'
                ? 'bg-blue-500 text-white rounded-br-md'
                : 'bg-gray-100 text-gray-800 rounded-bl-md'
                }`}
            >
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
            </div>

            {/* User Avatar */}
            {message.role === 'user' && (
              <div className="w-8 h-8 rounded-lg bg-gray-200 flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            )}
          </div>
        ))}

        {/* Typing Indicator */}
        {isLoading && (
          <div className="flex gap-3 justify-start message-animate">
            <div className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0 shadow-sm">
              <Image
                src="/gribo.png"
                alt="Bot Avatar"
                width={32}
                height={32}
                className="object-cover w-full h-full"
              />
            </div>
            <div className="bg-gray-100 rounded-2xl rounded-bl-md px-4 py-3">
              <div className="flex gap-1.5">
                <span className="w-2 h-2 rounded-full bg-gray-400 typing-dot"></span>
                <span className="w-2 h-2 rounded-full bg-gray-400 typing-dot"></span>
                <span className="w-2 h-2 rounded-full bg-gray-400 typing-dot"></span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}