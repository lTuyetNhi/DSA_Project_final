'use client';

import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFolderOpen,
  faSearch,
  faBolt,
  faListCheck,
  faLayerGroup,
  faBook,
} from '@fortawesome/free-solid-svg-icons';
import RequirementBanner from '@/components/layout/RequirementBanner';
import ModeSelector from '@/components/layout/ModeSelector';
import ModuleHeader from '@/components/ui/ModuleHeader';
import MetricCard from '@/components/ui/MetricCard';
import ComparisonTable from '@/components/ui/ComparisonTable';
import ComplexityCard from '@/components/ui/ComplexityCard';
import CategoryIndexVisualizer from '@/components/visualizer/CategoryIndexVisualizer';
import BookCard from '@/components/ui/BookCard';
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
    <div className="w-full space-y-5">
      {/* Top Criteria & Mode Selector */}
      <RequirementBanner />
      <ModeSelector />

      {/* Module Header */}
      <ModuleHeader
        moduleCode="RQ1"
        dsaName="CATEGORY HASH INDEX"
        title="Tra cứu sách theo thể loại"
        description="Băm tên thể loại để định vị danh sách tham chiếu (List of Book References) trong O(1+K), không quét toàn bộ thư viện."
        complexityLabel="Total lookup"
        complexityValue="O(1 + K)"
        childrenRight={
          <div className="flex items-center gap-2">
            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                fetchRQ1(e.target.value);
              }}
              className="px-3 py-1.5 rounded-lg border border-gray-300 text-gray-900 text-xs focus:outline-none focus:border-purple-500 bg-white font-medium"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <button
              onClick={() => fetchRQ1(category)}
              disabled={loading}
              className="px-4 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-medium text-xs transition-colors flex items-center gap-1.5"
            >
              <FontAwesomeIcon icon={faSearch} />
              <span>{loading ? 'Đang lọc...' : 'Tìm kiếm'}</span>
            </button>
          </div>
        }
      />

      {/* Metrics */}
      {data && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          <MetricCard
            title="FIND GROUP TIME"
            value={`${data.optimized.execution_time_ns} ns`}
            subtitle="Native C++ Engine"
            icon={faBolt}
          />
          <MetricCard
            title="TÀI LIỆU TRẢ VỀ (K)"
            value={`${data.books.length} cuốn`}
            subtitle={`Thể loại ${data.category}`}
            icon={faListCheck}
          />
          <MetricCard
            title="HASH LOOKUPS"
            value="1"
            subtitle="Định vị ô nhóm O(1)"
            icon={faFolderOpen}
          />
          <MetricCard
            title="BASELINE COMPARISONS"
            value={`${data.baseline.comparisons} lần`}
            subtitle="Quét tuần tự Linear Scan O(n)"
            icon={faLayerGroup}
          />
        </div>
      )}

      {/* Category Index Visualizer */}
      {data && (
        <CategoryIndexVisualizer category={data.category} books={data.books} />
      )}

      {/* Result Panel: Book List */}
      {data && (
        <div className="p-5 rounded-xl bg-white border border-gray-200 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-gray-100">
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <FontAwesomeIcon icon={faBook} className="text-purple-600" />
              Danh Sách Tài Liệu Thuộc "{data.category}" ({data.books.length} cuốn)
            </h3>
            <span className="text-xs font-mono text-purple-700 font-semibold">
              K = {data.books.length} phần tử
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {data.books.map((b) => (
              <BookCard key={b.book_id} book={b} highlight={true} />
            ))}
          </div>
        </div>
      )}

      {/* Benchmark & Complexity */}
      {data && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <ComparisonTable
              baselineName="Linear Category Scan (Quét mảng so khớp thể loại)"
              optimizedName="Category Hash Index (Bảng băm gom cụm thể loại)"
              baseline={data.baseline}
              optimized={data.optimized}
              stepLabel="Số phép kiểm tra tên thể loại"
            />
          </div>
          <div className="lg:col-span-1">
            <ComplexityCard
              averageTime="Find Group: O(1)"
              worstTime="Return: O(k)"
              spaceComplexity="O(n)"
              notes="Băm tên thể loại để lấy đầu danh sách liên kết trong O(1). Sau đó trích xuất K cuốn sách trong O(K). Tổng độ phức tạp là O(1 + K)."
            />
          </div>
        </div>
      )}
    </div>
  );
}
