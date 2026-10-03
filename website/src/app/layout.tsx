import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import '@fortawesome/fontawesome-svg-core/styles.css';
import { config } from '@fortawesome/fontawesome-svg-core';

config.autoAddCss = false;

export const metadata: Metadata = {
  title: 'DSA Library Performance Dashboard | C++ High Performance Engine',
  description: 'Bảng điều khiển đo kiểm hiệu năng và mô hình hóa cấu trúc dữ liệu bộ nhớ chính.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className="bg-gray-50 text-gray-900 min-h-screen flex flex-col antialiased">
        <Navbar />
        <main className="flex-1 w-full max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-8 py-5">
          {children}
        </main>
        <footer className="w-full border-t border-gray-200 py-3.5 px-6 text-center text-xs text-gray-500 bg-white">
          <p>
            Dự án Cấu Trúc Dữ Liệu & Giải Thuật (DASA230179_06) • Next.js + Tailwind CSS + C++20 Core
          </p>
        </footer>
      </body>
    </html>
  );
}
