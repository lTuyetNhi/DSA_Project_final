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
} from '@fortawesome/free-solid-svg-icons';
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
      tag: 'MC1',
      title: 'Bảng băm tra cứu mã sách',
      subtitle: 'Separate Chaining & DJB2 Hash',
      desc: 'Ánh xạ mã sách sang bucket index trong O(1). Giải quyết va chạm bằng danh sách liên kết đơn xích rời.',
      badge: 'O(1) vs O(N)',
      icon: faBolt,
    },
    {
      href: '/mc2-maxheap',
      tag: 'MC2',
      title: 'Cây đống Max-Heap Top sách',
      subtitle: 'Floyd Build Heap & Peek O(1)',
      desc: 'Cấu trúc mảng 1 chiều liên tục biểu diễn cây nhị phân hoàn chỉnh. Trích xuất đầu sách mượn nhiều nhất trong O(1).',
      badge: 'O(1) peek / O(log N)',
      icon: faLayerGroup,
    },
    {
      href: '/rq1-category',
      tag: 'RQ1',
      title: 'Gom cụm thể loại sách',
      subtitle: 'Category Hash Table',
      desc: 'Băm thể loại sách để truy xuất toàn bộ các đầu sách cùng nhóm trong O(1+K), loại bỏ quét toàn thư viện.',
      badge: 'O(1 + K) vs O(N)',
      icon: faFolderOpen,
    },
    {
      href: '/rq2-avltree',
      tag: 'RQ2',
      title: 'Cây tự cân bằng AVL quá hạn',
      subtitle: 'Self-Balancing & 4 Rotations',
      desc: 'Quản lý phiếu mượn theo ngày hẹn trả. Chiều cao cây luôn đảm bảo logarit nhờ 4 phép quay LL, RR, LR, RL.',
      badge: 'O(log N + K)',
      icon: faCodeBranch,
    },
    {
      href: '/rq3-invertedindex',
      tag: 'RQ3',
      title: 'Chỉ mục ngược tìm từ khóa',
      subtitle: 'Inverted Index Full-Text Search',
      desc: 'Tách từ khóa tiêu đề sách và tra cứu Posting List nhanh chóng, triệt tiêu phép so khớp xâu O(N × M).',
      badge: 'O(1 + K) vs O(N×M)',
      icon: faBookOpen,
    },
    {
      href: '/benchmark',
      tag: 'BENCHMARK',
      title: 'Đo kiểm hiệu năng đa quy mô',
      subtitle: 'Multi-scale Empirical Engine',
      desc: 'Thử nghiệm trực tiếp từ N=100 đến N=1.000.000 bản ghi. Đạt hệ số tăng tốc lên đến 48.000x.',
      badge: 'Speedup ~48.000x',
      icon: faChartLine,
    },
  ];

  return (
    <div className="w-full space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-xl bg-white border border-gray-200">
        <div className="max-w-3xl space-y-2">
          <div className="inline-block px-2.5 py-0.5 rounded text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            Học phần Cấu trúc Dữ liệu và Giải thuật (261DASA230179_06)
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
            Hệ Thống Mô Hình Hóa & Đối Sánh Cấu Trúc Dữ Liệu Bộ Nhớ Chính
          </h1>
          <p className="text-sm text-gray-600 leading-relaxed">
            Ứng dụng cầu nối tương tác trực tiếp với Native C++ Engine. Trực quan hóa Bảng băm DJB2, Cây đống cực đại Max-Heap, Cây tự cân bằng AVL (4 phép quay) và Chỉ mục ngược Inverted Index.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <Link
              href="/benchmark"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs transition-colors"
            >
              <FontAwesomeIcon icon={faChartLine} />
              Chạy đo kiểm hiệu năng
            </Link>
            <Link
              href="/mc1-hashtable"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium text-xs transition-colors"
            >
              <FontAwesomeIcon icon={faBolt} />
              Module MC1 Bảng băm
            </Link>
          </div>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Tổng số bản ghi sách"
          value={books.length || 10}
          unit="cuốn"
          subtitle="Tập dữ liệu data/books.json"
          icon={faBookOpen}
        />
        <MetricCard
          title="Phiếu mượn / Quá hạn"
          value={records.length || 10}
          unit="phiếu"
          subtitle="Quản lý bởi Cây AVL"
          icon={faCodeBranch}
        />
        <MetricCard
          title="Độ tăng tốc tối đa"
          value="48.000x"
          subtitle="Max-Heap vs Quét mảng tại N=1M"
          icon={faBolt}
        />
        <MetricCard
          title="Độ phức tạp tra cứu"
          value="O(1)"
          subtitle="Bảng băm DJB2 Prime 100.003"
          icon={faLayerGroup}
        />
      </div>

      {/* Modules Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">Danh Sách Các Chế Độ Thuật Toán</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {modules.map((m) => (
            <Link
              key={m.href}
              href={m.href}
              className="p-5 rounded-xl bg-white border border-gray-200 hover:border-blue-500 transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2 py-0.5 rounded text-xs font-bold bg-gray-100 text-gray-800 border border-gray-200">
                    {m.tag}
                  </span>
                  <span className="text-[11px] font-mono text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                    {m.badge}
                  </span>
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-1">
                  {m.title}
                </h3>
                <p className="text-xs text-blue-600 font-medium mb-2">{m.subtitle}</p>
                <p className="text-xs text-gray-500 leading-relaxed mb-4">{m.desc}</p>
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-semibold text-blue-600">
                <span>Vào chế độ</span>
                <FontAwesomeIcon icon={faArrowRight} className="text-[11px]" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Dataset Preview */}
      <div className="p-5 rounded-xl bg-white border border-gray-200">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200">
          <div>
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <FontAwesomeIcon icon={faDatabase} className="text-blue-600 text-sm" />
              Dữ Liệu Thư Viện Trong Bộ Nhớ RAM
            </h3>
            <p className="text-xs text-gray-500">Nạp trực tiếp vào C++ Engine từ file JSON</p>
          </div>
          <span className="text-xs font-mono px-2.5 py-0.5 rounded bg-gray-100 text-gray-700 border border-gray-200">
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
