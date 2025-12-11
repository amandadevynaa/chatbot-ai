'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

interface MessageInputProps {
  onSendMessage: (message: string, images?: { data: string; mimeType: string }[]) => void;
  isLoading: boolean;
}

interface AttachedFile {
  id: string;
  file: File;
  preview: string;
  type: 'image' | 'document';
  data: string;
  mimeType: string;
}

export default function MessageInput({ onSendMessage, isLoading }: MessageInputProps) {
  const [message, setMessage] = useState('');
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([]);
  const [showUploadMenu, setShowUploadMenu] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const uploadMenuRef = useRef<HTMLDivElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [message]);

  // Close upload menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (uploadMenuRef.current && !uploadMenuRef.current.contains(event.target as Node)) {
        setShowUploadMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    for (const file of Array.from(files)) {
      // Check if it's an image or document
      const isImage = file.type.startsWith('image/');
      const isDocument = file.type === 'application/pdf' ||
        file.type.includes('document') ||
        file.type.includes('text');

      if (!isImage && !isDocument) {
        alert('Format file tidak didukung. Gunakan gambar (JPG, PNG, GIF, WebP) atau dokumen (PDF, TXT).');
        continue;
      }

      // Limit file size to 10MB
      if (file.size > 10 * 1024 * 1024) {
        alert('Ukuran file maksimal 10MB.');
        continue;
      }

      // Read file as base64
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        const base64Data = result.split(',')[1]; // Remove data:mime;base64, prefix

        const newFile: AttachedFile = {
          id: `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          file,
          preview: isImage ? result : '/document-icon.svg',
          type: isImage ? 'image' : 'document',
          data: base64Data,
          mimeType: file.type
        };

        setAttachedFiles(prev => [...prev, newFile]);
      };
      reader.readAsDataURL(file);
    }

    setShowUploadMenu(false);
    // Reset input
    e.target.value = '';
  };

  const removeFile = (fileId: string) => {
    setAttachedFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if ((message.trim() || attachedFiles.length > 0) && !isLoading) {
      const images = attachedFiles.map(f => ({
        data: f.data,
        mimeType: f.mimeType
      }));

      onSendMessage(message, images.length > 0 ? images : undefined);
      setMessage('');
      setAttachedFiles([]);
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const canSubmit = (message.trim() || attachedFiles.length > 0) && !isLoading;

  return (
    <div className="border-t border-gray-100 bg-white px-4 py-4">
      <div className="max-w-3xl mx-auto">
        <form onSubmit={handleSubmit} className="relative">
          <div
            className="flex flex-col bg-gray-50 rounded-2xl border border-gray-200 p-2 transition-all"
            style={{ '--focus-color': '#665243' } as React.CSSProperties}
          >
            {/* Attached Files Preview */}
            {attachedFiles.length > 0 && (
              <div className="flex flex-wrap gap-2 px-2 pt-2 pb-3 border-b border-gray-200 mb-2">
                {attachedFiles.map((file) => (
                  <div
                    key={file.id}
                    className="relative group"
                  >
                    {file.type === 'image' ? (
                      <div className="w-20 h-20 rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                        <Image
                          src={file.preview}
                          alt="Preview"
                          width={80}
                          height={80}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-20 h-20 rounded-lg border border-gray-200 shadow-sm bg-white flex flex-col items-center justify-center p-2">
                        <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span className="text-xs text-gray-500 mt-1 truncate max-w-full">
                          {file.file.name.slice(0, 8)}...
                        </span>
                      </div>
                    )}
                    {/* Remove button */}
                    <button
                      type="button"
                      onClick={() => removeFile(file.id)}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:bg-red-600"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-end gap-2">
              {/* Upload Button */}
              <div className="relative" ref={uploadMenuRef}>
                <button
                  type="button"
                  onClick={() => setShowUploadMenu(!showUploadMenu)}
                  className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-xl text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                  title="Upload file"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                  </svg>
                </button>

                {/* Upload Menu Dropdown */}
                {showUploadMenu && (
                  <div className="absolute bottom-full left-0 mb-2 bg-white rounded-xl shadow-lg border border-gray-200 py-2 min-w-[180px] z-50 upload-menu-animate">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <span>Upload Gambar</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        const input = document.createElement('input');
                        input.type = 'file';
                        input.accept = '.pdf,.doc,.docx,.txt';
                        input.onchange = (e) => handleFileSelect(e as unknown as React.ChangeEvent<HTMLInputElement>);
                        input.click();
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <span>Upload Dokumen</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => cameraInputRef.current?.click()}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                        <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <span>Ambil Foto</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Hidden File Inputs */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileSelect}
                className="hidden"
              />
              {/* Camera Input - uses capture to open camera directly on mobile */}
              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="user"
                onChange={handleFileSelect}
                className="hidden"
              />

              {/* Text Input */}
              <textarea
                ref={textareaRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={attachedFiles.length > 0 ? "Tambahkan pesan (opsional)..." : "Ketik pesan Anda..."}
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
                disabled={!canSubmit}
                className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-xl text-white disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed active:scale-95 transition-all"
                style={{ backgroundColor: !canSubmit ? undefined : '#665243' }}
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
          </div>
        </form>

        {/* Footer hint */}
        <p className="text-center text-xs text-gray-400 mt-3">
          Tekan Enter untuk mengirim · Shift+Enter untuk baris baru · Klik 📎 untuk upload
        </p>
      </div>
    </div>
  );
}