'use client';

import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faLayerGroup,
  faTrophy,
  faBolt,
  faFire,
  faSitemap,
} from '@fortawesome/free-solid-svg-icons';
import RequirementBanner from '@/components/layout/RequirementBanner';
import ModeSelector from '@/components/layout/ModeSelector';
import ModuleHeader from '@/components/ui/ModuleHeader';
import MetricCard from '@/components/ui/MetricCard';
import ComparisonTable from '@/components/ui/ComparisonTable';
import ComplexityCard from '@/components/ui/ComplexityCard';
import HeapTreeVisualizer from '@/components/visualizer/HeapTreeVisualizer';
import BookCard from '@/components/ui/BookCard';
import { MC2Response } from '@/types/dsa';

export default function MC2Page() {
  const [data, setData] = useState<MC2Response | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchMC2 = () => {
    setLoading(true);
    fetch(`/api/bridge?mode=mc2&top=5`)
      .then((res) => res.json())
      .then((resData: MC2Response) => {
        setData(resData);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchMC2();
  }, []);

  return (
    <div className="w-full space-y-5">
      {/* Top Criteria & Mode Selector */}
      <RequirementBanner />
      <ModeSelector />

      {/* Module Header */}
      <ModuleHeader
        moduleCode="MC2"
        dsaName="MAX HEAP"
        title="Tài liệu được mượn nhiều nhất"
        description="Xác định cuốn sách có lượt mượn cao nhất tại vị trí gốc heap[0] với chi phí truy xuất hằng số O(1)."
        complexityLabel="Peek Max"
        complexityValue="O(1)"
        childrenRight={
          <button
            onClick={fetchMC2}
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-medium text-xs transition-colors flex items-center gap-1.5"
          >
            <FontAwesomeIcon icon={faTrophy} />
            <span>{loading ? 'Đang trích xuất...' : 'Lấy tài liệu ưu tiên cao nhất'}</span>
          </button>
        }
      />

      {/* Metrics */}
      {data && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          <MetricCard
            title="PEEK TIME"
            value={`${data.optimized.execution_time_ns} ns`}
            subtitle="Native C++ Engine"
            icon={faBolt}
          />
          <MetricCard
            title="HEAP COMPARISONS"
            value="1"
            subtitle="Truy xuất trực tiếp heap[0]"
            icon={faTrophy}
          />
          <MetricCard
            title="BASELINE COMPARISONS"
            value={`${data.baseline.comparisons} lần`}
            subtitle="Quét tuần tự Linear Max Scan"
            icon={faLayerGroup}
          />
          <MetricCard
            title="TRẠNG THÁI GỐC HEAP"
            value={data.top_books[0]?.book_id || 'N/A'}
            subtitle={`${data.top_books[0]?.borrow_count || 0} lượt mượn`}
            icon={faFire}
          />
        </div>
      )}

      {/* Result Panel: Highest Borrowed Book */}
      {data && data.top_books.length > 0 && (
        <div className="p-5 rounded-xl bg-amber-50/60 border border-amber-200 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-amber-200">
            <h3 className="text-sm font-bold text-amber-900 flex items-center gap-2">
              <FontAwesomeIcon icon={faTrophy} className="text-amber-600" />
              Tài Liệu Ưu Tiên Cao Nhất (Root Element)
            </h3>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-amber-200 text-amber-900">
              #1 MAX BORROW
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            <div>
              <div className="text-lg font-bold text-gray-900">{data.top_books[0].title}</div>
              <p className="text-xs text-gray-600 mt-0.5">
                Mã sách: <span className="font-mono font-bold text-blue-700">{data.top_books[0].book_id}</span> • Tác giả: {data.top_books[0].author} • Thể loại: {data.top_books[0].category}
              </p>
            </div>
            <div className="flex items-center justify-end gap-3 text-right">
              <div>
                <div className="text-2xl font-black text-amber-800 font-mono">{data.top_books[0].borrow_count}</div>
                <div className="text-[11px] text-gray-500 font-medium">Lượt mượn tích lũy</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Heap Visualizer: Binary Tree & Array */}
      {data && (
        <HeapTreeVisualizer books={data.top_books} />
      )}

      {/* Benchmark & Complexity */}
      {data && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <ComparisonTable
              baselineName="Linear Max Scan (Quét tìm cực đại tuyến tính)"
              optimizedName="Max-Heap (Cây đống cực đại mảng 1 chiều)"
              baseline={data.baseline}
              optimized={data.optimized}
              stepLabel="Số phép so sánh tìm phần tử lớn nhất"
            />
          </div>
          <div className="lg:col-span-1">
            <ComplexityCard
              averageTime="Peek: O(1)"
              worstTime="Extract/Update: O(log n)"
              spaceComplexity="O(n) Mảng liên tục"
              notes="Floyd's algorithm xây dựng đống trong O(n). Lấy phần tử cực đại trong O(1) và tái cân bằng đống sau khi trích xuất trong O(log n)."
            />
          </div>
        </div>
      )}
    </div>
  );
}
