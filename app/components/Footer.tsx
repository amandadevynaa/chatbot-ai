export default function Footer() {
  return (
    <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Copyright */}
          <div className="text-sm text-gray-500 dark:text-gray-400">
            © 2025 Kantor Pertanahan Kab. Grobogan. All rights reserved.
          </div>

          {/* Service Links */}
          <div className="flex flex-wrap gap-6 justify-center md:justify-end">
            <button className="flex items-center gap-2 text-sm transition-colors" style={{ color: '#665243' }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#4d3d32'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#665243'}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Layanan Pertanahan
            </button>

            <button className="flex items-center gap-2 text-sm text-orange-600 hover:text-orange-800 dark:text-orange-400 dark:hover:text-orange-300 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Cek Berkas
            </button>

            <button className="flex items-center gap-2 text-sm text-pink-600 hover:text-pink-800 dark:text-pink-400 dark:hover:text-pink-300 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Halo Kakantah
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}