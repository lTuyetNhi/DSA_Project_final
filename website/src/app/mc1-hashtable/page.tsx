'use client';

import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBolt,
  faSearch,
  faCalculator,
  faMicrochip,
  faCheckCircle,
  faTimesCircle,
  faLayerGroup,
  faArrowRight,
  faCode,
} from '@fortawesome/free-solid-svg-icons';
import ComparisonTable from '@/components/ui/ComparisonTable';
import BookCard from '@/components/ui/BookCard';
import MetricCard from '@/components/ui/MetricCard';
import { MC1Response } from '@/types/dsa';

export default function MC1Page() {
  const [targetId, setTargetId] = useState('B001');
  const [data, setData] = useState<MC1Response | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchMC1 = (idToSearch: string) => {
    setLoading(true);
    fetch(`/api/bridge?mode=mc1&id=${encodeURIComponent(idToSearch)}`)
      .then((res) => res.json())
      .then((resData: MC1Response) => {
        setData(resData);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchMC1(targetId);
  }, []);

  const sampleIds = ['B001', 'B002', 'B003', 'B007', 'B010', 'B999'];

  return (
    <div className="w-full space-y-8">
      {/* Module Header */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-white/10 bg-gradient-to-br from-indigo-950/40 via-gray-900/90 to-gray-950">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-3">
              <FontAwesomeIcon icon={faBolt} />
              <span>Module MC1 — Cấu Trúc Bảng Băm Xích Rời</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Tra Cứu Mã Sách Tức Thời Trong O(1)
            </h1>
            <p className="text-sm text-gray-300 mt-1 max-w-2xl">
              Sử dụng hàm băm DJB2 phân tán đều kết hợp bảng băm kích thước số nguyên tố lớn ($100.003$) để triệt tiêu hiện tượng va chạm phân cụm.
            </p>
          </div>

          {/* Search Input Box */}
          <div className="w-full md:w-auto flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <div className="relative flex-1 md:w-64">
                <input
                  type="text"
                  value={targetId}
                  onChange={(e) => setTargetId(e.target.value.toUpperCase())}
                  onKeyDown={(e) => e.key === 'Enter' && fetchMC1(targetId)}
                  placeholder="Nhập mã sách (VD: B001)..."
                  className="w-full px-4 py-2.5 rounded-xl bg-gray-900 border border-white/15 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 font-mono"
                />
              </div>
              <button
                onClick={() => fetchMC1(targetId)}
                disabled={loading}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-md shadow-indigo-600/30 transition-all flex items-center gap-2"
              >
                <FontAwesomeIcon icon={faSearch} />
                <span>{loading ? 'Đang băm...' : 'Tra Cứu'}</span>
              </button>
            </div>

            {/* Quick Select IDs */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] text-gray-400">Mã mẫu:</span>
              {sampleIds.map((id) => (
                <button
                  key={id}
                  onClick={() => {
                    setTargetId(id);
                    fetchMC1(id);
                  }}
                  className={`px-2 py-0.5 rounded text-xs font-mono transition-all ${
                    targetId === id
                      ? 'bg-indigo-500 text-white font-bold'
                      : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {id}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Real-time C++ Metrics */}
      {data && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Thời Gian Băm & Tra Cứu"
            value={data.optimized.execution_time_ns}
            unit="nanoseconds"
            subtitle="Đo trực tiếp từ Native C++ Engine"
            icon={faBolt}
            variant="emerald"
          />
          <MetricCard
            title="Số Phép So Sánh (DSA)"
            value={data.optimized.comparisons ?? 0}
            unit="phép toán"
            subtitle="Chỉ 1 lần tính băm và định vị Bucket"
            icon={faCalculator}
            variant="indigo"
          />
          <MetricCard
            title="Số Phép Quét Tuyến Tính (Baseline)"
            value={data.baseline.comparisons ?? 0}
            unit="lần so sánh"
            subtitle={`Phải quét qua ${data.baseline.comparisons} phần tử trong mảng`}
            icon={faLayerGroup}
            variant="rose"
          />
          <MetricCard
            title="Trạng Thái Tìm Thấy"
            value={data.optimized.found ? 'Tìm thấy' : 'Không tồn tại'}
            subtitle={data.optimized.found ? `Khớp cuốn sách mã ${data.target_id}` : 'Mã sách không có trong thư viện'}
            icon={data.optimized.found ? faCheckCircle : faTimesCircle}
            variant={data.optimized.found ? 'emerald' : 'amber'}
          />
        </div>
      )}

      {/* DJB2 Hash Function Breakdown Visualizer */}
      {data && (
        <div className="glass-card p-6 rounded-2xl border border-white/10 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <FontAwesomeIcon icon={faCalculator} className="text-indigo-400" />
              Mô Phỏng Trực Quan Hàm Băm DJB2 (Dan Bernstein Algorithm)
            </h3>
            <span className="text-xs font-mono px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/30">
              Công thức: hash = ((hash &lt;&lt; 5) + hash) + c
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-gray-900/80 border border-white/5 space-y-1">
              <span className="text-xs text-gray-400 uppercase tracking-wider">Chuỗi Khóa Đầu Vào</span>
              <div className="text-xl font-mono font-bold text-indigo-300">"{data.target_id}"</div>
              <p className="text-[11px] text-gray-500">Ký tự được duyệt từng byte qua mã ASCII</p>
            </div>

            <div className="p-4 rounded-xl bg-gray-900/80 border border-white/5 space-y-1">
              <span className="text-xs text-gray-400 uppercase tracking-wider">Giá Trị Băm Nguyên Thủy (Raw Hash)</span>
              <div className="text-xl font-mono font-bold text-emerald-400">{data.hash_info.raw_hash.toLocaleString()}</div>
              <p className="text-[11px] text-gray-500">Khởi tạo hash=5381 nhân 33 mỗi bước</p>
            </div>

            <div className="p-4 rounded-xl bg-indigo-950/60 border border-indigo-500/30 space-y-1">
              <span className="text-xs text-indigo-300 uppercase tracking-wider font-semibold">Chỉ Số Bucket Đích (Slot)</span>
              <div className="text-xl font-mono font-bold text-cyan-300">
                Bucket #{data.hash_info.bucket_index.toLocaleString()}
              </div>
              <p className="text-[11px] text-indigo-400">Modulo Số nguyên tố 100.003</p>
            </div>
          </div>
        </div>
      )}

      {/* Live Benchmark Comparison Table */}
      {data && (
        <ComparisonTable
          baselineName="Tìm kiếm Tuyến tính (Linear Search)"
          optimizedName="Bảng băm Xích rời (Separate Chaining Hash Table)"
          baseline={data.baseline}
          optimized={data.optimized}
          stepLabel="Số phép so sánh mã sách"
        />
      )}

      {/* Found Book Card Display */}
      {data && data.book && (
        <div className="glass-card p-6 rounded-2xl border border-white/10 space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <FontAwesomeIcon icon={faCheckCircle} className="text-emerald-400" />
            Kết Quả Sách Được Định Vị Trực Tiếp Từ Bộ Nhớ
          </h3>
          <div className="max-w-md">
            <BookCard book={data.book} highlight={true} />
          </div>
        </div>
      )}
    </div>
  );
}
