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
  faServer,
  faMicrochip,
  faArrowRight,
  faCheckCircle,
  faDatabase,
  faMemory,
} from '@fortawesome/free-solid-svg-icons';
import MetricCard from '@/components/ui/MetricCard';
import BookCard from '@/components/ui/BookCard';
import { Book, BorrowRecord } from '@/types/dsa';

export default function HomePage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [records, setRecords] = useState<BorrowRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/bridge?mode=data')
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 'success') {
          setBooks(data.books || []);
          setRecords(data.borrow_records || []);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const modules = [
    {
      href: '/mc1-hashtable',
      tag: 'MC1',
      title: 'Bảng Băm Tra Cứu Mã Sách',
      subtitle: 'Separate Chaining & DJB2 Hash',
      desc: 'Ánh xạ mã sách sang bucket index trong O(1). Giải quyết va chạm bằng danh sách liên kết đơn xích rời.',
      badge: 'O(1) vs O(N)',
      color: 'from-blue-600/20 to-indigo-600/20 border-indigo-500/30 text-indigo-400',
      icon: faBolt,
    },
    {
      href: '/mc2-maxheap',
      tag: 'MC2',
      title: 'Cây Đống Max-Heap Top Sách',
      subtitle: 'Floyd Build Heap & Peek O(1)',
      desc: 'Cấu trúc mảng 1 chiều liên tục biểu diễn cây nhị phân hoàn chỉnh. Trích xuất đầu sách mượn nhiều nhất tức thì.',
      badge: 'O(1) peek / O(log N)',
      color: 'from-amber-600/20 to-orange-600/20 border-amber-500/30 text-amber-400',
      icon: faLayerGroup,
    },
    {
      href: '/rq1-category',
      tag: 'RQ1',
      title: 'Gom Cụm Thể Loại Sách',
      subtitle: 'Category Hash Table',
      desc: 'Băm thể loại sách để truy xuất toàn bộ các đầu sách cùng nhóm trong O(1+K), loại bỏ quét toàn thư viện.',
      badge: 'O(1 + K) vs O(N)',
      color: 'from-emerald-600/20 to-teal-600/20 border-emerald-500/30 text-emerald-400',
      icon: faLayerGroup,
    },
    {
      href: '/rq2-avltree',
      tag: 'RQ2',
      title: 'Cây Tự Cân Bằng AVL Quá Hạn',
      subtitle: 'Self-Balancing & 4 Rotations',
      desc: 'Quản lý phiếu mượn theo ngày hẹn trả. Chiều cao cây luôn đảm bảo logarit nhờ 4 phép quay LL, RR, LR, RL.',
      badge: 'O(log N + K)',
      color: 'from-rose-600/20 to-pink-600/20 border-rose-500/30 text-rose-400',
      icon: faCodeBranch,
    },
    {
      href: '/rq3-invertedindex',
      tag: 'RQ3',
      title: 'Chỉ Mục Ngược Tìm Từ Khóa',
      subtitle: 'Inverted Index Full-Text Search',
      desc: 'Tách từ khóa tiêu đề sách và tra cứu Posting List nhanh chóng, triệt tiêu phép so khớp xâu O(N × M).',
      badge: 'O(1 + K) vs O(N×M)',
      color: 'from-purple-600/20 to-indigo-600/20 border-purple-500/30 text-purple-400',
      icon: faBookOpen,
    },
    {
      href: '/benchmark',
      tag: 'BENCHMARK',
      title: 'Trung Tâm Đo Kiểm Hiệu Năng',
      subtitle: 'Multi-scale Empirical Engine',
      desc: 'Thử nghiệm trực tiếp đa quy mô từ N=100 đến N=1.000.000 bản ghi. Đạt hệ số tăng tốc lên đến 48.000x.',
      badge: 'Speedup ~48.000x',
      color: 'from-cyan-600/20 to-blue-600/20 border-cyan-500/30 text-cyan-400',
      icon: faChartLine,
    },
  ];

  return (
    <div className="w-full space-y-8">
      {/* Hero Banner Section */}
      <div className="relative w-full rounded-3xl overflow-hidden glass-card p-8 lg:p-12 border border-white/10 shadow-2xl bg-gradient-to-br from-indigo-950/60 via-gray-900/90 to-gray-950">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-4xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-semibold uppercase tracking-wider">
            <FontAwesomeIcon icon={faMicrochip} className="text-xs" />
            <span>In-Memory Decision & Records Engine (C++20 Native)</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Mô Hình Hóa & Trực Quan Hóa <br />
            <span className="bg-gradient-to-r from-indigo-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent">
              Cấu Trúc Dữ Liệu và Giải Thuật
            </span>
          </h1>

          <p className="text-base sm:text-lg text-gray-300 leading-relaxed max-w-3xl">
            Cầu nối tương tác trực tiếp với Native C++ Engine của Hệ thống Quản lý Thư viện. Trực quan hóa chi tiết từng bước băm (DJB2), phân cấp đống cực đại (Max-Heap), cân bằng cây AVL (4 phép quay) và đối chuẩn hiệu năng đa quy mô.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4">
            <Link
              href="/benchmark"
              className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-semibold text-sm shadow-lg shadow-indigo-500/25 transition-all hover:scale-105"
            >
              <FontAwesomeIcon icon={faChartLine} />
              Chạy Benchmark Ngay
            </Link>
            <Link
              href="/mc1-hashtable"
              className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-gray-200 border border-white/10 font-semibold text-sm transition-all"
            >
              <FontAwesomeIcon icon={faBolt} />
              Khám phá MC1 Bảng Băm
            </Link>
          </div>
        </div>
      </div>

      {/* Overview Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Tổng Số Bản Ghi Sách"
          value={books.length || 10}
          unit="cuốn"
          subtitle="Tập dữ liệu khởi tạo data/books.json"
          icon={faBookOpen}
          variant="indigo"
        />
        <MetricCard
          title="Phiếu Mượn / Quá Hạn"
          value={records.length || 10}
          unit="phiếu"
          subtitle="Quản lý bởi Cây tự cân bằng AVL"
          icon={faCodeBranch}
          variant="emerald"
        />
        <MetricCard
          title="Độ Tăng Tốc Tối Đa"
          value="48.000x"
          subtitle="Max-Heap vs Quét tuyến tính tại N=1M"
          icon={faBolt}
          variant="cyan"
          trend="Cực đại"
        />
        <MetricCard
          title="Độ Phức Tạp Tra Cứu"
          value="O(1)"
          subtitle="Bảng băm DJB2 Prime 100.003"
          icon={faMemory}
          variant="amber"
          trend="Hằng số"
        />
      </div>

      {/* Algorithm Modules Navigation Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Các Chế Độ Mô Hình Hóa Thuật Toán</h2>
            <p className="text-xs text-gray-400">Chọn chế độ để tương tác và quan sát chi tiết thuật toán chạy trên C++</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {modules.map((m) => (
            <Link
              key={m.href}
              href={m.href}
              className="group glass-card p-6 rounded-2xl border border-white/10 hover:border-indigo-500/40 transition-all duration-300 flex flex-col justify-between hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-1"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-bold bg-gradient-to-r ${m.color} border`}>
                    {m.tag}
                  </span>
                  <span className="text-xs font-mono text-gray-400 bg-white/5 px-2.5 py-1 rounded-md border border-white/5">
                    {m.badge}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors mb-1">
                  {m.title}
                </h3>
                <p className="text-xs font-medium text-indigo-400/90 mb-3">{m.subtitle}</p>
                <p className="text-xs text-gray-400 leading-relaxed mb-6">{m.desc}</p>
              </div>

              <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs font-semibold text-indigo-400 group-hover:text-indigo-300">
                <span>Trực quan hóa ngay</span>
                <FontAwesomeIcon icon={faArrowRight} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Dataset Preview Section */}
      <div className="glass-card p-6 rounded-2xl border border-white/10">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <FontAwesomeIcon icon={faDatabase} className="text-indigo-400" />
              Dữ Liệu Thư Viện Thực Tế Trong Bộ Nhớ
            </h3>
            <p className="text-xs text-gray-400">Danh sách tài liệu được nạp vào Native C++ Engine từ tệp JSON</p>
          </div>
          <span className="text-xs font-mono px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/30">
            {books.length} đầu sách
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {books.map((b) => (
            <BookCard key={b.book_id} book={b} />
          ))}
        </div>
      </div>
    </div>
  );
}
