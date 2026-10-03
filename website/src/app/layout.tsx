import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import '@fortawesome/fontawesome-svg-core/styles.css';
import { config } from '@fortawesome/fontawesome-svg-core';

config.autoAddCss = false;

export const metadata: Metadata = {
  title: 'Hệ Thống Quản Lý Thư Viện & Mô Hình Hóa Thuật Toán (DSA)',
  description: 'Mô hình hóa và đối sánh hiệu năng các cấu trúc dữ liệu bộ nhớ chính (MC1, MC2, RQ1, RQ2, RQ3).',
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
        <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </main>
        <footer className="w-full border-t border-gray-200 py-4 px-6 text-center text-xs text-gray-500 bg-white">
          <p>
            Học phần Cấu trúc Dữ liệu và Giải thuật (261DASA230179_06) — Nhóm 06 — GVHD: ThS. Bảo Vũ Đình (T-Bao)
          </p>
        </footer>
      </body>
    </html>
  );
}
