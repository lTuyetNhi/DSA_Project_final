'use client';

import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChartLine,
  faBolt,
  faMicrochip,
  faMemory,
  faServer,
  faGaugeHigh,
} from '@fortawesome/free-solid-svg-icons';
import MetricCard from '@/components/ui/MetricCard';
import { BenchmarkResponse } from '@/types/dsa';

export default function BenchmarkPage() {
  const [datasetSize, setDatasetSize] = useState(10000);
  const [data, setData] = useState<BenchmarkResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const sizes = [100, 1000, 10000, 100000, 500000, 1000000];

  const runBenchmark = (size: number) => {
    setLoading(true);
    fetch(`/api/bridge?mode=benchmark&size=${size}`)
      .then((res) => res.json())
      .then((resData: BenchmarkResponse) => {
        setData(resData);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    runBenchmark(datasetSize);
  }, []);

  const formatTime = (ns: number) => {
    if (ns >= 1000000) return `${(ns / 1000000).toFixed(2)} ms`;
    if (ns >= 1000) return `${(ns / 1000).toFixed(2)} μs`;
    return `${ns.toLocaleString()} ns`;
  };

  return (
    <div className="w-full space-y-6">
      {/* Module Header */}
      <div className="p-6 rounded-xl bg-white border border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-block px-2.5 py-0.5 rounded text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 mb-2">
              Trung tâm đo kiểm hiệu năng thực nghiệm (Multi-Scale Benchmark)
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              Đo Đạc Tốc Độ Xử Lý Trực Tiếp Trên Native C++
            </h1>
            <p className="text-xs text-gray-600 mt-1 max-w-2xl">
              Thực nghiệm từ $N = 100$ đến $N = 1.000.000$ bản ghi với đồng hồ độ chính xác cao (`std::chrono::high_resolution_clock`).
            </p>
          </div>

          {/* Dataset Size Selector */}
          <div className="flex flex-col gap-1.5">
            <span className="text-xs text-gray-600 font-medium">Chọn quy mô dữ liệu (N):</span>
            <div className="flex flex-wrap gap-1.5 bg-gray-50 p-1.5 rounded-lg border border-gray-200">
              {sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    setDatasetSize(s);
                    runBenchmark(s);
                  }}
                  disabled={loading}
                  className={`px-3 py-1 rounded text-xs font-mono font-bold transition-colors ${
                    datasetSize === s
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  N = {s >= 1000000 ? '1M' : s >= 1000 ? `${s / 1000}k` : s}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Metrics */}
      {data && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Quy mô bản ghi (N)"
            value={data.dataset_size.toLocaleString()}
            unit="bản ghi"
            subtitle="Nạp trực tiếp trong RAM"
            icon={faServer}
          />
          <MetricCard
            title="Tốc độ Bảng băm (MC1)"
            value={formatTime(data.results[0]?.optimized_time_ns || 0)}
            subtitle={`Tăng tốc ~${data.results[0]?.speedup?.toFixed(0)}x`}
            icon={faBolt}
          />
          <MetricCard
            title="Tốc độ Max-Heap (MC2)"
            value={formatTime(data.results[1]?.optimized_time_ns || 0)}
            subtitle={`Tăng tốc ~${data.results[1]?.speedup?.toFixed(0)}x`}
            icon={faGaugeHigh}
          />
          <MetricCard
            title="Tốc độ Chỉ mục ngược (RQ3)"
            value={formatTime(data.results[3]?.optimized_time_ns || 0)}
            subtitle={`Tăng tốc ~${data.results[3]?.speedup?.toFixed(0)}x`}
            icon={faMicrochip}
          />
        </div>
      )}

      {/* Benchmark Table */}
      {data && (
        <div className="p-5 rounded-xl bg-white border border-gray-200 space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-gray-200">
            <div>
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <FontAwesomeIcon icon={faChartLine} className="text-blue-600" />
                Kết Quả Đo Kiểm Thực Nghiệm (N = {data.dataset_size.toLocaleString()} bản ghi)
              </h3>
            </div>
            {loading && (
              <span className="text-xs font-semibold text-blue-600 animate-pulse">
                Đang đo kiểm C++...
              </span>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gray-200 text-gray-500 uppercase">
                  <th className="py-2.5 px-3">Module</th>
                  <th className="py-2.5 px-3">Bài Toán</th>
                  <th className="py-2.5 px-3">Thời Gian Baseline</th>
                  <th className="py-2.5 px-3">Thời Gian Tối Ưu (DSA)</th>
                  <th className="py-2.5 px-3">Số Bước (Baseline / Tối ưu)</th>
                  <th className="py-2.5 px-3 text-center">Hệ Số Tăng Tốc</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data.results.map((item) => (
                  <tr key={item.module} className="hover:bg-gray-50">
                    <td className="py-2.5 px-3 font-mono font-bold text-blue-700">
                      {item.module}
                    </td>
                    <td className="py-2.5 px-3 font-medium text-gray-900">{item.name}</td>
                    <td className="py-2.5 px-3 font-mono text-rose-700">
                      {formatTime(item.baseline_time_ns)}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-emerald-700 font-bold">
                      {formatTime(item.optimized_time_ns)}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-gray-600">
                      <span className="text-rose-600">{item.baseline_steps.toLocaleString()}</span> /{' '}
                      <span className="text-emerald-600 font-bold">{item.optimized_steps.toLocaleString()}</span>
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        ~{item.speedup.toFixed(1)}x
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Memory Hierarchy Analysis */}
      <div className="p-5 rounded-xl bg-white border border-gray-200 space-y-3">
        <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
          <FontAwesomeIcon icon={faMemory} className="text-blue-600" />
          Phân Tích Chuyên Sâu Về Bản Chất Phân Cấp Bộ Nhớ (CPU Cache Hierarchy)
        </h3>
        <p className="text-xs text-gray-600 leading-relaxed">
          Sự chênh lệch tốc độ vượt trội ở quy mô lớn bắt nguồn trực tiếp từ kiến trúc bộ nhớ vi xử lý:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
          <div className="p-3 rounded-lg bg-gray-50 border border-gray-200 space-y-1">
            <h4 className="text-xs font-bold text-rose-800">
              1. Điểm nghẽn Quét tuyến tính (Baseline)
            </h4>
            <p className="text-[11px] text-gray-600 leading-relaxed">
              Duyệt mảng lớn gây liên tục CPU Cache Miss, buộc phải nạp tuần tự từ RAM chính với độ trễ cao.
            </p>
          </div>

          <div className="p-3 rounded-lg bg-gray-50 border border-gray-200 space-y-1">
            <h4 className="text-xs font-bold text-emerald-800">
              2. Tính cục bộ của Bảng băm & Max-Heap
            </h4>
            <p className="text-[11px] text-gray-600 leading-relaxed">
              Max-Heap lưu liền mạch trên mảng tận dụng CPU L1 Cache. Bảng băm chỉ truy xuất đúng 1 ô nhớ mục tiêu trong $O(1)$.
            </p>
          </div>

          <div className="p-3 rounded-lg bg-gray-50 border border-gray-200 space-y-1">
            <h4 className="text-xs font-bold text-blue-800">
              3. Cơ chế tỉa nhánh Cây AVL
            </h4>
            <p className="text-[11px] text-gray-600 leading-relaxed">
              Bỏ qua hàng trăm nghìn nút không liên quan, chỉ duyệt qua số lượng nút tối thiểu tương ứng chiều cao $\log_2 N$.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
