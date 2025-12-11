'use client';

import { useState, useRef, useEffect } from 'react';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

export default function MessageInput({ onSendMessage, isLoading }: MessageInputProps) {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [message]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSendMessage(message);
      setMessage('');
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  return (
    <div className="border-t border-gray-100 bg-white px-4 py-4">
      <div className="max-w-3xl mx-auto">
        <form onSubmit={handleSubmit} className="relative">
          <div className="flex items-end gap-3 bg-gray-50 rounded-2xl border border-gray-200 p-2 focus-within:border-blue-300 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
            {/* Text Input */}
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ketik pesan Anda..."
              disabled={isLoading}
              className="flex-1 resize-none bg-transparent px-3 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed min-h-[40px] max-h-[120px]"
              rows={1}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
            />

            {/* Send Button */}
            <button
              type="submit"
              disabled={!message.trim() || isLoading}
              className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-xl bg-blue-500 text-white disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed hover:bg-blue-600 active:scale-95 transition-all"
            >
              {isLoading ? (
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              )}
            </button>
          </div>
        </form>

        {/* Footer hint */}
        <p className="text-center text-xs text-gray-400 mt-3">
          Tekan Enter untuk mengirim · Shift+Enter untuk baris baru
        </p>
      </div>
    </div>
  );
}