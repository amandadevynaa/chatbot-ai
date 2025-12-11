'use client';

import Image from 'next/image';

export default function Sidebar() {
  const handleNewChat = () => {
    // Handle new chat functionality
    console.log('New chat started');
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 w-80 h-full flex flex-col border-r border-gray-200 dark:border-gray-700">
      {/* Header with Logo and Title */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-blue-900 rounded-full flex items-center justify-center">
            <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
              <span className="text-blue-900 font-bold text-xs">P</span>
            </div>
          </div>
          <div>
            <h1 className="font-semibold text-gray-900 dark:text-white">Polsek Rembang</h1>
            <span className="text-sm text-green-600 flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              VIRTUAL ASSISTANT
            </span>
          </div>
        </div>
      </div>

      {/* New Chat Button */}
      <div className="p-4">
        <button
          onClick={handleNewChat}
          className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Chat
        </button>
      </div>

      {/* Spacer */}
      <div className="flex-1"></div>
    </div>
  );
}