'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
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
  const [showCamera, setShowCamera] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const uploadMenuRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor;
      const isMobileDevice = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase());
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      const isSmallScreen = window.innerWidth <= 768;
      setIsMobile(isMobileDevice || (isTouchDevice && isSmallScreen));
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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

  // Initialize camera when modal opens
  useEffect(() => {
    if (showCamera) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showCamera]);

  // Attach stream to video element when available
  useEffect(() => {
    if (videoRef.current && cameraStream) {
      videoRef.current.srcObject = cameraStream;
    }
  }, [cameraStream]);

  const startCamera = async () => {
    try {
      setCameraError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment', // Use back camera by default
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });
      setCameraStream(stream);
    } catch (error) {
      console.error('Error accessing camera:', error);
      setCameraError('Tidak dapat mengakses kamera. Pastikan izin kamera sudah diberikan.');
    }
  };

  const stopCamera = useCallback(() => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
  }, [cameraStream]);

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;

    // Set canvas size to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw video frame to canvas
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0);

    // Convert to base64
    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
    const base64Data = dataUrl.split(',')[1];

    // Create file-like object
    const newFile: AttachedFile = {
      id: `photo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      file: new File([], `photo_${Date.now()}.jpg`, { type: 'image/jpeg' }),
      preview: dataUrl,
      type: 'image',
      data: base64Data,
      mimeType: 'image/jpeg'
    };

    setAttachedFiles(prev => [...prev, newFile]);
    setShowCamera(false);
  };

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

  // Handler untuk native camera capture (mobile)
  const handleCameraCapture = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    if (!file.type.startsWith('image/')) return;

    // Limit file size to 10MB
    if (file.size > 10 * 1024 * 1024) {
      alert('Ukuran file maksimal 10MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      const base64Data = result.split(',')[1];

      const newFile: AttachedFile = {
        id: `photo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        file,
        preview: result,
        type: 'image',
        data: base64Data,
        mimeType: file.type || 'image/jpeg'
      };

      setAttachedFiles(prev => [...prev, newFile]);
    };
    reader.readAsDataURL(file);

    setShowUploadMenu(false);
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
    <>
      {/* Camera Modal */}
      {showCamera && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl overflow-hidden max-w-lg w-full shadow-2xl">
            {/* Camera Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
              <h3 className="font-semibold text-gray-800">Ambil Foto</h3>
              <button
                onClick={() => setShowCamera(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Camera View */}
            <div className="relative bg-black aspect-video">
              {cameraError ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4">
                  <svg className="w-12 h-12 mb-3 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <p className="text-center text-sm">{cameraError}</p>
                  <button
                    onClick={startCamera}
                    className="mt-4 px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors text-sm"
                  >
                    Coba Lagi
                  </button>
                </div>
              ) : (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
              )}
              <canvas ref={canvasRef} className="hidden" />
            </div>

            {/* Camera Controls */}
            <div className="flex items-center justify-center gap-4 p-4 bg-gray-50">
              <button
                onClick={() => setShowCamera(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={capturePhoto}
                disabled={!cameraStream || !!cameraError}
                className="w-16 h-16 rounded-full bg-white border-4 border-gray-300 flex items-center justify-center hover:border-gray-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ boxShadow: '0 0 0 4px #665243' }}
              >
                <div className="w-12 h-12 rounded-full" style={{ backgroundColor: '#665243' }}></div>
              </button>
              <button
                onClick={startCamera}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                title="Ganti Kamera"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="border-t border-gray-100 bg-white px-4 py-4 mobile-safe-input-container">
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
                            unoptimized
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
                        onClick={() => {
                          fileInputRef.current?.click();
                          setShowUploadMenu(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                          <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <span className="whitespace-nowrap">Upload Gambar</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          const input = document.createElement('input');
                          input.type = 'file';
                          input.accept = '.pdf,.doc,.docx,.txt';
                          input.onchange = (e) => handleFileSelect(e as unknown as React.ChangeEvent<HTMLInputElement>);
                          input.click();
                          setShowUploadMenu(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                          <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <span className="whitespace-nowrap">Upload Dokumen</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          if (isMobile) {
                            // Use native camera on mobile
                            cameraInputRef.current?.click();
                          } else {
                            // Use webcam modal on desktop
                            setShowCamera(true);
                          }
                          setShowUploadMenu(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                          <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </div>
                        <span className="whitespace-nowrap">Ambil Foto</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Hidden File Input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                />

                {/* Hidden Camera Input for Mobile Native Capture */}
                <input
                  ref={cameraInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleCameraCapture}
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
    </>
  );
}