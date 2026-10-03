'use client';

import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faLayerGroup,
  faTrophy,
  faSitemap,
  faTable,
  faBolt,
  faFire,
} from '@fortawesome/free-solid-svg-icons';
import ComparisonTable from '@/components/ui/ComparisonTable';
import BookCard from '@/components/ui/BookCard';
import MetricCard from '@/components/ui/MetricCard';
import { MC2Response } from '@/types/dsa';

export default function MC2Page() {
  const [topK, setTopK] = useState(3);
  const [data, setData] = useState<MC2Response | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchMC2 = (kVal: number) => {
    setLoading(true);
    fetch(`/api/bridge?mode=mc2&top=${kVal}`)
      .then((res) => res.json())
      .then((resData: MC2Response) => {
        setData(resData);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchMC2(topK);
  }, []);

  const topOptions = [1, 3, 5, 10];

  return (
    <div className="w-full space-y-6">
      {/* Module Header */}
      <div className="p-6 rounded-xl bg-white border border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-block px-2.5 py-0.5 rounded text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200 mb-2">
              Module MC2 — Cây đống cực đại Max-Heap
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              Truy Xuất Top Sách Mượn Nhiều Nhất Trong O(1)
            </h1>
            <p className="text-xs text-gray-600 mt-1 max-w-2xl">
              Xây dựng cây đống bằng giải thuật Floyd's Build Heap tuyến tính $O(N)$. Phần tử có lượt mượn cao nhất luôn nằm tại vị trí gốc `heap[0]`.
            </p>
          </div>

          {/* Top-K Selector Controls */}
          <div className="flex items-center gap-1.5 bg-gray-50 p-1.5 rounded-lg border border-gray-200">
            <span className="text-xs text-gray-600 px-2 font-medium">Chọn Top:</span>
            {topOptions.map((k) => (
              <button
                key={k}
                onClick={() => {
                  setTopK(k);
                  fetchMC2(k);
                }}
                disabled={loading}
                className={`px-3 py-1 rounded text-xs font-bold transition-colors ${
                  topK === k
                    ? 'bg-amber-600 text-white'
                    : 'text-gray-700 hover:bg-gray-200'
                }`}
              >
                Top {k}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Metrics */}
      {data && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Thời gian lấy đỉnh Heap"
            value={data.optimized.execution_time_ns}
            unit="ns"
            subtitle="Đo trực tiếp từ C++ Engine"
            icon={faBolt}
          />
          <MetricCard
            title="Số phép so sánh (Heap)"
            value={data.optimized.comparisons ?? 1}
            unit="bước"
            subtitle="Truy xuất tức thì phần tử heap[0]"
            icon={faTrophy}
          />
          <MetricCard
            title="Số phép so sánh (Baseline)"
            value={data.baseline.comparisons ?? 10}
            unit="bước"
            subtitle="Duyệt qua toàn bộ N cuốn sách"
            icon={faLayerGroup}
          />
          <MetricCard
            title="Độ phức tạp lấy cực đại"
            value="O(1)"
            subtitle="Trích xuất O(log N)"
            icon={faSitemap}
          />
        </div>
      )}

      {/* Max-Heap Array & Root Visualizer */}
      {data && data.top_books.length > 0 && (
        <div className="p-5 rounded-xl bg-white border border-gray-200 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-gray-200">
            <div>
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <FontAwesomeIcon icon={faSitemap} className="text-amber-600" />
                Mô Hình Hóa Cấu Trúc Max-Heap Trên Mảng Bộ Nhớ
              </h3>
              <p className="text-xs text-gray-500">Mảng 1 chiều liên tục trong RAM đại diện cho Cây nhị phân hoàn chỉnh</p>
            </div>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-gray-100 text-gray-700 border border-gray-200">
              Cha = (i-1)/2 | Con Trái = 2i+1 | Con Phải = 2i+2
            </span>
          </div>

          {/* Array View */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
              <FontAwesomeIcon icon={faTable} className="text-gray-500" />
              1. Biểu diễn mảng 1 chiều liên tục trong RAM
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-2">
              {data.top_books.map((b, idx) => (
                <div
                  key={b.book_id}
                  className={`p-2.5 rounded-lg border text-center space-y-1 ${
                    idx === 0
                      ? 'bg-amber-50 border-amber-300 text-amber-900 font-medium'
                      : 'bg-gray-50 border-gray-200 text-gray-800'
                  }`}
                >
                  <div className="text-[10px] font-mono text-gray-500">heap[{idx}] {idx === 0 && '(Gốc)'}</div>
                  <div className="text-xs font-bold truncate">{b.book_id}</div>
                  <div className="text-xs font-mono text-amber-700 flex items-center justify-center gap-1">
                    <FontAwesomeIcon icon={faFire} className="text-[10px] text-amber-500" />
                    {b.borrow_count} lượt
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Root Element Highlight */}
          <div className="p-4 rounded-lg bg-amber-50/70 border border-amber-200 flex items-center justify-between">
            <div>
              <div className="text-xs text-amber-800 font-bold uppercase">Đầu Sách Mượn Nhiều Nhất Hệ Thống (Root)</div>
              <div className="text-sm font-bold text-gray-900">{data.top_books[0].title}</div>
              <div className="text-xs text-gray-600">Mã sách: {data.top_books[0].book_id} — Tác giả: {data.top_books[0].author}</div>
            </div>
            <div className="text-right">
              <div className="text-xl font-black text-amber-800">{data.top_books[0].borrow_count}</div>
              <div className="text-[11px] text-gray-500">Lượt mượn</div>
            </div>
          </div>
        </div>
      )}

      {/* Comparison Table */}
      {data && (
        <ComparisonTable
          baselineName="Tìm Max Tuyến Tính (Linear Max Scan)"
          optimizedName="Cây Đống Cực Đại (Max-Heap In-Memory)"
          baseline={data.baseline}
          optimized={data.optimized}
          stepLabel="Số phép so sánh tìm phần tử lớn nhất"
        />
      )}

      {/* Top Books Grid */}
      {data && (
        <div className="p-5 rounded-xl bg-white border border-gray-200 space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-gray-200">
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <FontAwesomeIcon icon={faTrophy} className="text-amber-600" />
              Danh Sách Xếp Hạng Top {topK} Sách Mượn Nhiều Nhất
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {data.top_books.map((b, index) => (
              <BookCard key={b.book_id} book={b} rank={index + 1} highlight={index === 0} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
