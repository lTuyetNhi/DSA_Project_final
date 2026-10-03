'use client';

import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faLayerGroup,
  faFire,
  faTrophy,
  faSitemap,
  faTable,
  faBolt,
  faChartLine,
} from '@fortawesome/free-solid-svg-icons';
import ComparisonTable from '@/components/ui/ComparisonTable';
import BookCard from '@/components/ui/BookCard';
import MetricCard from '@/components/ui/MetricCard';
import { MC2Response, Book } from '@/types/dsa';

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
    <div className="w-full space-y-8">
      {/* Module Header */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-white/10 bg-gradient-to-br from-amber-950/40 via-gray-900/90 to-gray-950">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-3">
              <FontAwesomeIcon icon={faTrophy} />
              <span>Module MC2 — Cây Đống Cực Đại Max-Heap</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Truy Xuất Top Sách Mượn Nhiều Nhất Trong O(1)
            </h1>
            <p className="text-sm text-gray-300 mt-1 max-w-2xl">
              Xây dựng cây đống bằng giải thuật Floyd's Build Heap trong thời gian tuyến tính $O(N)$. Phần tử có lượt mượn cao nhất luôn nằm tại vị trí gốc `heap[0]`.
            </p>
          </div>

          {/* Top-K Selector Controls */}
          <div className="flex items-center gap-2 bg-gray-900/90 p-1.5 rounded-2xl border border-white/10">
            <span className="text-xs text-gray-400 pl-3 pr-1 font-semibold">Chọn Top K:</span>
            {topOptions.map((k) => (
              <button
                key={k}
                onClick={() => {
                  setTopK(k);
                  fetchMC2(k);
                }}
                disabled={loading}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  topK === k
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-gray-950 shadow-md shadow-amber-500/20'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                Top {k}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Real-time C++ Metrics */}
      {data && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Thời Gian Lấy Gốc Max-Heap"
            value={data.optimized.execution_time_ns}
            unit="nanoseconds"
            subtitle="Đo trực tiếp từ Native C++ Engine"
            icon={faBolt}
            variant="emerald"
          />
          <MetricCard
            title="Số Phép So Sánh Max-Heap"
            value={data.optimized.comparisons ?? 1}
            unit="phép toán"
            subtitle="Truy xuất tức thì phần tử heap[0]"
            icon={faTrophy}
            variant="amber"
          />
          <MetricCard
            title="Số Phép Quét Baseline"
            value={data.baseline.comparisons ?? 10}
            unit="lần so sánh"
            subtitle="Phải duyệt qua toàn bộ N cuốn sách"
            icon={faLayerGroup}
            variant="rose"
          />
          <MetricCard
            title="Độ Phức Tạp Lấy Cực Đại"
            value="O(1)"
            subtitle="Trích xuất logarit O(log N)"
            icon={faSitemap}
            variant="cyan"
            trend="Tối ưu tuyệt đối"
          />
        </div>
      )}

      {/* Max-Heap Binary Tree & Array Visualizer */}
      {data && data.top_books.length > 0 && (
        <div className="glass-card p-6 rounded-2xl border border-white/10 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/10">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <FontAwesomeIcon icon={faSitemap} className="text-amber-400" />
                Mô Hình Hóa Hai Góc Nhìn Cấu Trúc Max-Heap
              </h3>
              <p className="text-xs text-gray-400">Mảng 1 chiều liên tục trong RAM đại diện cho Cây nhị phân hoàn chỉnh</p>
            </div>
            <span className="text-xs font-mono px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30">
              Cha = (i-1)/2 | Con Trái = 2i+1 | Con Phải = 2i+2
            </span>
          </div>

          {/* Array View Representation */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
              <FontAwesomeIcon icon={faTable} className="text-indigo-400" />
              1. Biểu Diễn Mảng Bộ Nhớ Liên Tục (Contiguous Array in RAM)
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-3">
              {data.top_books.map((b, idx) => (
                <div
                  key={b.book_id}
                  className={`p-3 rounded-xl border text-center space-y-1 ${
                    idx === 0
                      ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 ring-1 ring-amber-400/40 shadow-lg shadow-amber-500/10'
                      : 'bg-gray-900/80 border-white/10 text-gray-300'
                  }`}
                >
                  <div className="text-[10px] font-mono text-gray-400">heap[{idx}] {idx === 0 && '👑 ROOT'}</div>
                  <div className="text-xs font-bold text-white truncate">{b.book_id}</div>
                  <div className="text-xs font-mono text-amber-400 flex items-center justify-center gap-1">
                    <FontAwesomeIcon icon={faFire} className="text-[10px]" />
                    {b.borrow_count} lượt
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tree Node Hierarchy */}
          <div className="space-y-2 pt-4 border-t border-white/5">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
              <FontAwesomeIcon icon={faSitemap} className="text-amber-400" />
              2. Đỉnh Cực Đại (Max-Heap Root Element)
            </span>
            <div className="p-4 rounded-xl bg-gradient-to-r from-amber-950/50 via-gray-900 to-amber-950/30 border border-amber-500/30 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center text-xl font-black">
                  👑
                </div>
                <div>
                  <div className="text-xs text-amber-300 font-semibold uppercase">Đầu Sách Mượn Nhiều Nhất Hệ Thống</div>
                  <div className="text-base font-bold text-white">{data.top_books[0].title}</div>
                  <div className="text-xs text-gray-400">Mã sách: {data.top_books[0].book_id} — Tác giả: {data.top_books[0].author}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-black text-amber-400">{data.top_books[0].borrow_count}</div>
                <div className="text-[11px] text-gray-400">Lượt mượn</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Live Benchmark Comparison Table */}
      {data && (
        <ComparisonTable
          baselineName="Tìm Max Tuyến Tính (Linear Max Scan)"
          optimizedName="Cây Đống Cực Đại (Max-Heap In-Memory)"
          baseline={data.baseline}
          optimized={data.optimized}
          stepLabel="Số phép so sánh tìm phần tử lớn nhất"
        />
      )}

      {/* Top K Books Grid */}
      {data && (
        <div className="glass-card p-6 rounded-2xl border border-white/10 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <FontAwesomeIcon icon={faTrophy} className="text-amber-400" />
              Danh Sách Xếp Hạng Top {topK} Sách Mượn Nhiều Nhất
            </h3>
            <span className="text-xs font-mono text-gray-400">
              Được trích xuất tuần tự qua cơ chế Heapify-Down
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.top_books.map((b, index) => (
              <BookCard key={b.book_id} book={b} rank={index + 1} highlight={index === 0} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
