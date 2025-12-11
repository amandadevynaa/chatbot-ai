'use client';

import Image from 'next/image';

interface HistoryItem {
  id: string;
  question: string;
  timestamp: Date;
}

interface SidebarProps {
  onNewChat: () => void;
  history: HistoryItem[];
  onHistoryClick: (messageId: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ onNewChat, history, onHistoryClick, isOpen, onClose }: SidebarProps) {
  // Format time for display
  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);

    if (minutes < 1) return 'Baru saja';
    if (minutes < 60) return `${minutes} menit lalu`;
    if (hours < 24) return `${hours} jam lalu`;
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
  };

  // Truncate long questions
  const truncateText = (text: string, maxLength: number = 40) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <>
      {/* Overlay for mobile */}
      <div
        className={`sidebar-overlay ${isOpen ? 'active' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sidebar Container */}
      <div className={`sidebar-container ${isOpen ? 'open' : ''}`}>
        {/* Header with Logo and Close Button */}
        <div className="p-5 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Modern Logo */}
              <div className="w-10 h-10 rounded-xl overflow-hidden shadow-md">
                <Image
                  src="/gribo.png"
                  alt="BPN Grobogan Logo"
                  width={40}
                  height={40}
                  className="object-cover w-full h-full"
                />
              </div>
              <div>
                <h1 className="font-semibold text-gray-900 text-sm">BPN Grobogan</h1>
              </div>
            </div>
            {/* Close button for mobile */}
            <button
              onClick={onClose}
              className="sidebar-close-btn p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Tutup sidebar"
            >
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* New Chat Button */}
        <div className="p-4">
          <button
            onClick={onNewChat}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm hover-lift"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Percakapan Baru
          </button>
        </div>

        {/* Chat History Section */}
        <div className="flex-1 px-4 overflow-y-auto">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Riwayat</span>
            {history.length > 0 && (
              <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                {history.length}
              </span>
            )}
          </div>

          {/* History List */}
          {history.length > 0 ? (
            <div className="space-y-1">
              {[...history].reverse().map((item, index) => (
                <button
                  key={item.id}
                  onClick={() => onHistoryClick(item.id)}
                  className="w-full text-left p-3 rounded-lg hover:bg-white hover:shadow-sm border border-transparent hover:border-gray-200 transition-all group"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="flex items-start gap-2.5">
                    <div className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors" style={{ backgroundColor: 'rgba(102, 82, 67, 0.15)' }}>
                      <svg className="w-3 h-3 transition-colors" style={{ color: '#665243' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-700 font-medium truncate transition-colors" style={{ '--hover-color': '#665243' } as React.CSSProperties}>
                        {truncateText(item.question)}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {formatTime(item.timestamp)}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="py-8 text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gray-100 flex items-center justify-center">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <p className="text-sm text-gray-400">Belum ada riwayat</p>
              <p className="text-xs text-gray-300 mt-1">Mulai percakapan untuk melihat riwayat</p>
            </div>
          )}
        </div>

      </div>
    </>
  );
}