'use client';

import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faLayerGroup,
  faTags,
  faBolt,
  faCheckCircle,
  faListCheck,
  faDatabase,
} from '@fortawesome/free-solid-svg-icons';
import ComparisonTable from '@/components/ui/ComparisonTable';
import BookCard from '@/components/ui/BookCard';
import MetricCard from '@/components/ui/MetricCard';
import { RQ1Response } from '@/types/dsa';

export default function RQ1Page() {
  const [category, setCategory] = useState('Software Engineering');
  const [data, setData] = useState<RQ1Response | null>(null);
  const [loading, setLoading] = useState(false);

  const categories = [
    'Software Engineering',
    'Computer Science',
    'Database',
    'Networking',
    'Operating System',
    'Mathematics',
  ];

  const fetchRQ1 = (cat: string) => {
    setLoading(true);
    fetch(`/api/bridge?mode=rq1&category=${encodeURIComponent(cat)}`)
      .then((res) => res.json())
      .then((resData: RQ1Response) => {
        setData(resData);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchRQ1(category);
  }, []);

  return (
    <div className="w-full space-y-8">
      {/* Module Header */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-white/10 bg-gradient-to-br from-emerald-950/40 via-gray-900/90 to-gray-950">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold uppercase tracking-wider mb-3">
              <FontAwesomeIcon icon={faTags} />
              <span>Module RQ1 — Bảng Băm Phân Cụm Thể Loại</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Gom Cụm & Lọc Toàn Bộ Sách Theo Thể Loại Trong O(1+K)
            </h1>
            <p className="text-sm text-gray-300 mt-1 max-w-2xl">
              Bài toán truy xuất <strong className="text-emerald-300">toàn bộ tất cả $K$ cuốn sách</strong> thuộc thể loại xác định thông qua việc băm trực tiếp tên thể loại, loại bỏ hoàn toàn chi phí quét tuyến tính $O(N)$.
            </p>
          </div>

          {/* Category Filter Badges */}
          <div className="flex flex-wrap gap-1.5 max-w-md">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setCategory(cat);
                  fetchRQ1(cat);
                }}
                disabled={loading}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  category === cat
                    ? 'bg-emerald-500 text-gray-950 font-bold shadow-md shadow-emerald-500/20'
                    : 'bg-white/5 text-gray-300 hover:text-white hover:bg-white/10 border border-white/5'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Real-time C++ Metrics */}
      {data && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Thời Gian Định Vị Nhóm"
            value={data.optimized.execution_time_ns}
            unit="nanoseconds"
            subtitle="Đo trực tiếp từ Native C++ Engine"
            icon={faBolt}
            variant="emerald"
          />
          <MetricCard
            title="Số Sách Trả Về (K)"
            value={data.books.length}
            unit="cuốn"
            subtitle={`Lọc đầy đủ toàn bộ sách thuộc ${data.category}`}
            icon={faListCheck}
            variant="cyan"
          />
          <MetricCard
            title="Số Phép So Sánh (DSA)"
            value={data.optimized.comparisons ?? 1}
            unit="phép toán"
            subtitle="1 lần băm nhóm + trích xuất K sách"
            icon={faTags}
            variant="indigo"
          />
          <MetricCard
            title="Số Lần Quét Tuyến Tính (Baseline)"
            value={data.baseline.comparisons ?? 10}
            unit="lần so sánh"
            subtitle="Phải duyệt qua toàn bộ N cuốn sách"
            icon={faLayerGroup}
            variant="rose"
          />
        </div>
      )}

      {/* Live Benchmark Comparison Table */}
      {data && (
        <ComparisonTable
          baselineName="Quét Tuyến Tính Thể Loại (Linear Category Scan)"
          optimizedName="Bảng Băm Gom Cụm Thể Loại (Category Hash Table)"
          baseline={data.baseline}
          optimized={data.optimized}
          stepLabel="Số phép kiểm tra tên thể loại"
        />
      )}

      {/* Result Books List */}
      {data && (
        <div className="glass-card p-6 rounded-2xl border border-white/10 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <FontAwesomeIcon icon={faCheckCircle} className="text-emerald-400" />
              Toàn Bộ Sách Thuộc Thể Loại "{data.category}" ({data.books.length} cuốn)
            </h3>
            <span className="text-xs font-mono px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
              Độ phức tạp: O(1 + K)
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.books.map((b) => (
              <BookCard key={b.book_id} book={b} highlight={true} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
