'use client';

import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTags,
  faBolt,
  faCheckCircle,
  faListCheck,
  faLayerGroup,
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
    <div className="w-full space-y-6">
      {/* Module Header */}
      <div className="p-6 rounded-xl bg-white border border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-block px-2.5 py-0.5 rounded text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 mb-2">
              Module RQ1 — Bảng băm phân cụm thể loại
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              Gom Cụm & Lọc Toàn Bộ Sách Theo Thể Loại Trong O(1+K)
            </h1>
            <p className="text-xs text-gray-600 mt-1 max-w-2xl">
              Truy xuất <strong>toàn bộ tất cả $K$ cuốn sách</strong> thuộc thể loại xác định trong một nhóm băm, không phải xếp hạng Top-K.
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
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  category === cat
                    ? 'bg-emerald-600 text-white font-bold'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Metrics */}
      {data && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Thời gian định vị nhóm"
            value={data.optimized.execution_time_ns}
            unit="ns"
            subtitle="Đo trực tiếp từ C++ Engine"
            icon={faBolt}
          />
          <MetricCard
            title="Số sách trả về (K)"
            value={data.books.length}
            unit="cuốn"
            subtitle={`Thể loại ${data.category}`}
            icon={faListCheck}
          />
          <MetricCard
            title="Số phép so sánh (DSA)"
            value={data.optimized.comparisons ?? 1}
            unit="bước"
            subtitle="1 lần băm nhóm + trích xuất K sách"
            icon={faTags}
          />
          <MetricCard
            title="Số lần quét (Baseline)"
            value={data.baseline.comparisons ?? 10}
            unit="bước"
            subtitle="Phải duyệt qua toàn bộ N cuốn"
            icon={faLayerGroup}
          />
        </div>
      )}

      {/* Comparison Table */}
      {data && (
        <ComparisonTable
          baselineName="Quét Tuyến Tính Thể Loại (Linear Category Scan)"
          optimizedName="Bảng Băm Gom Cụm Thể Loại (Category Hash Table)"
          baseline={data.baseline}
          optimized={data.optimized}
          stepLabel="Số phép kiểm tra tên thể loại"
        />
      )}

      {/* Books List */}
      {data && (
        <div className="p-5 rounded-xl bg-white border border-gray-200 space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-gray-200">
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <FontAwesomeIcon icon={faCheckCircle} className="text-emerald-600" />
              Toàn Bộ Sách Thuộc Thể Loại "{data.category}" ({data.books.length} cuốn)
            </h3>
            <span className="text-xs font-mono text-gray-500">
              Độ phức tạp: O(1 + K)
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {data.books.map((b) => (
              <BookCard key={b.book_id} book={b} highlight={true} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
