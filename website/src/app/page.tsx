'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBookOpen,
  faBolt,
  faLayerGroup,
  faCodeBranch,
  faChartLine,
  faFolderOpen,
  faArrowRight,
  faDatabase,
  faSitemap,
} from '@fortawesome/free-solid-svg-icons';
import RequirementBanner from '@/components/layout/RequirementBanner';
import ModeSelector from '@/components/layout/ModeSelector';
import MetricCard from '@/components/ui/MetricCard';
import BookCard from '@/components/ui/BookCard';
import { Book, BorrowRecord } from '@/types/dsa';

export default function HomePage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [records, setRecords] = useState<BorrowRecord[]>([]);

  useEffect(() => {
    fetch('/api/bridge?mode=data')
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 'success') {
          setBooks(data.books || []);
          setRecords(data.borrow_records || []);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  const modules = [
    {
      href: '/mc1-hashtable',
      tag: 'MC1 (Bắt buộc)',
      title: 'Tra cứu sách theo mã',
      dsa: 'Hash Table (Separate Chaining)',
      desc: 'Băm mã sách bằng hàm DJB2 kết hợp kích thước số nguyên tố 100.003 để định vị ô nhớ tức thời.',
      complexity: 'Average: O(1)',
      icon: faBolt,
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
    },
    {
      href: '/mc2-maxheap',
      tag: 'MC2 (Bắt buộc)',
      title: 'Tài liệu mượn nhiều nhất',
      dsa: 'Max-Heap (Floyd Build)',
      desc: 'Cấu trúc đống cực đại mảng 1 chiều liên tục trong RAM. Đỉnh cực đại luôn nằm tại heap[0].',
      complexity: 'Peek: O(1)',
      icon: faLayerGroup,
      badgeColor: 'bg-amber-50 text-amber-800 border-amber-200',
    },
    {
      href: '/rq1-category',
      tag: 'RQ1 (Tự chọn)',
      title: 'Tra cứu sách theo thể loại',
      dsa: 'Category Hash Index',
      desc: 'Băm thể loại sách để lấy toàn bộ danh sách tài liệu cùng nhóm trong một thao tác O(1+K).',
      complexity: 'Total: O(1 + K)',
      icon: faFolderOpen,
      badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
    },
    {
      href: '/rq2-avltree',
      tag: 'RQ2 (Tự chọn)',
      title: 'Theo dõi tài liệu quá hạn',
      dsa: 'AVL Tree (Self-Balancing)',
      desc: 'Quản lý phiếu mượn theo ngày hẹn trả. Chiều cao cây luôn đảm bảo logarit nhờ 4 phép quay LL, RR, LR, RL.',
      complexity: 'Query: O(log N + K)',
      icon: faCodeBranch,
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    {
      href: '/rq3-invertedindex',
      tag: 'RQ3 (Tự chọn)',
      title: 'Tìm kiếm sách theo từ khóa',
      dsa: 'Inverted Index Hash Table',
      desc: 'Tách tiêu đề thành từ khóa chuẩn hóa và tra cứu Posting List, loại bỏ phép quét so khớp xâu O(N × M).',
      complexity: 'Lookup: O(1 + K)',
      icon: faBookOpen,
      badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    },
    {
      href: '/benchmark',
      tag: 'BENCHMARK SUITE',
      title: 'Đo kiểm hiệu năng đa quy mô',
      dsa: 'Empirical Benchmark Engine',
      desc: 'Đối sánh trực tiếp thời gian thực thi (ns/μs) và số phép so sánh từ N=100 đến N=1.000.000 bản ghi.',
      complexity: 'Speedup: ~48.000x',
      icon: faChartLine,
      badgeColor: 'bg-cyan-50 text-cyan-800 border-cyan-200',
    },
  ];

  return (
    <div className="w-full space-y-5">
      {/* Requirement Banner */}
      <RequirementBanner />

      {/* Mode Selector */}
      <ModeSelector />

      {/* System Architecture Box */}
      <div className="p-5 rounded-xl bg-white border border-gray-200 space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-gray-100">
          <h2 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
            <FontAwesomeIcon icon={faSitemap} className="text-blue-600 text-xs" />
            Kiến Trúc Động Cơ DSA Bộ Nhớ Chính (In-Memory Engine Architecture)
          </h2>
          <span className="text-[11px] font-mono text-gray-500">C++20 Core & Native JSON Bridge</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-lg bg-gray-50 border border-gray-200 space-y-1">
            <div className="text-[10px] text-gray-500 font-bold uppercase">1. Tầng Trình Diễn (Presentation)</div>
            <div className="text-xs font-semibold text-gray-900">Next.js Web Visualizer + TUI CLI</div>
            <p className="text-[11px] text-gray-500">Giao diện điều khiển & Trực quan hóa từng bước thuật toán</p>
          </div>

          <div className="p-3 rounded-lg bg-blue-50/70 border border-blue-200 space-y-1">
            <div className="text-[10px] text-blue-700 font-bold uppercase">2. Tầng Cấu Trúc Dữ Liệu (DSA Core)</div>
            <div className="text-xs font-semibold text-blue-900">Hash Table • Max-Heap • AVL Tree • Inverted Index</div>
            <p className="text-[11px] text-blue-800">Cài đặt C++ nguyên bản không dùng thư viện ngoài</p>
          </div>

          <div className="p-3 rounded-lg bg-gray-50 border border-gray-200 space-y-1">
            <div className="text-[10px] text-gray-500 font-bold uppercase">3. Tầng Lưu Trữ (Persistence)</div>
            <div className="text-xs font-semibold text-gray-900">JSON FileStore (RAM Sync)</div>
            <p className="text-[11px] text-gray-500">Nạp & Đồng bộ dữ liệu sách, phiếu mượn bền vững</p>
          </div>
        </div>
      </div>

      {/* Modules Cards Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
            Các Module Thuật Toán & Cấu Trúc Dữ Liệu
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {modules.map((m) => (
            <Link
              key={m.href}
              href={m.href}
              className="p-4 rounded-xl bg-white border border-gray-200 hover:border-blue-400 transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <span className={`px-2 py-0.5 rounded text-[11px] font-bold border ${m.badgeColor}`}>
                    {m.tag}
                  </span>
                  <span className="text-[11px] font-mono text-gray-600 bg-gray-50 px-2 py-0.5 rounded border border-gray-200">
                    {m.complexity}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-gray-900 mb-0.5">
                  {m.title}
                </h4>
                <div className="text-xs font-medium text-blue-700 font-mono mb-2">{m.dsa}</div>
                <p className="text-xs text-gray-500 leading-relaxed mb-4">{m.desc}</p>
              </div>

              <div className="pt-2.5 border-t border-gray-100 flex items-center justify-between text-xs font-semibold text-blue-700">
                <span>Mô hình hóa & Thử nghiệm</span>
                <FontAwesomeIcon icon={faArrowRight} className="text-[10px]" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Data Records Preview */}
      <div className="p-5 rounded-xl bg-white border border-gray-200 space-y-3">
        <div className="flex items-center justify-between pb-3 border-b border-gray-200">
          <div>
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <FontAwesomeIcon icon={faDatabase} className="text-blue-600" />
              Tập Dữ Liệu Khởi Tạo Trong Bộ Nhớ RAM
            </h3>
            <p className="text-xs text-gray-500">Nạp từ data/books.json vào C++ Native Engine</p>
          </div>
          <span className="text-xs font-mono px-2.5 py-0.5 rounded bg-gray-100 text-gray-700 border border-gray-200 font-semibold">
            {books.length} đầu sách
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
          {books.map((b) => (
            <BookCard key={b.book_id} book={b} />
          ))}
        </div>
      </div>
    </div>
  );
}
