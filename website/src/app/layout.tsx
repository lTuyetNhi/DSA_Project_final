import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import '@fortawesome/fontawesome-svg-core/styles.css';
import { config } from '@fortawesome/fontawesome-svg-core';

// Prevent FontAwesome from adding its CSS automatically since we imported it
config.autoAddCss = false;

export const metadata: Metadata = {
  title: 'DSA Library Records & Decision Engine | Interactive Visualizer',
  description: 'Trực quan hóa cấu trúc dữ liệu và giải thuật bộ nhớ chính kết nối trực tiếp C++ Native Engine (MC1, MC2, RQ1, RQ2, RQ3).',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className="dark">
      <body className="bg-[#0b0f19] text-gray-100 min-h-screen flex flex-col antialiased selection:bg-indigo-500 selection:text-white">
        <Navbar />
        <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </main>
        <footer className="w-full border-t border-white/5 py-4 px-6 text-center text-xs text-gray-500 bg-gray-950/50">
          <p>
            Học phần Cấu trúc Dữ liệu và Giải thuật (261DASA230179_06) — Nhóm 06 — GVHD: ThS. Bảo Vũ Đình (T-Bao)
          </p>
        </footer>
      </body>
    </html>
  );
}
