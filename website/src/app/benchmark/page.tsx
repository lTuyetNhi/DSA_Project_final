'use client';

import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChartLine,
  faBolt,
  faServer,
  faGaugeHigh,
  faPlay,
  faMemory,
  faShieldHalved,
} from '@fortawesome/free-solid-svg-icons';
import RequirementBanner from '@/components/layout/RequirementBanner';
import ModeSelector from '@/components/layout/ModeSelector';
import ModuleHeader from '@/components/ui/ModuleHeader';
import MetricCard from '@/components/ui/MetricCard';
import { BenchmarkResponse } from '@/types/dsa';

export default function BenchmarkPage() {
  const [datasetSize, setDatasetSize] = useState(10000);
  const [data, setData] = useState<BenchmarkResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const sizes = [1000, 10000, 100000, 500000, 1000000];

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
    <div className="w-full space-y-5">
      {/* Top Criteria & Mode Selector */}
      <RequirementBanner />
      <ModeSelector />

      {/* Module Header */}
      <ModuleHeader
        moduleCode="BENCHMARK"
        dsaName="EMPIRICAL SUITE"
        title="Đo kiểm hiệu năng đối sánh thuật toán"
        description="So sánh cấu trúc dữ liệu được chọn với phương án baseline tương ứng trên các tập dữ liệu thực nghiệm từ 1.000 đến 1.000.000 bản ghi."
        complexityLabel="Maximum Speedup"
        complexityValue="~48.000x"
        childrenRight={
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs text-gray-500 font-medium">Quy mô N:</span>
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
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
                  }`}
                >
                  {s >= 1000000 ? '1M' : s >= 1000 ? `${s / 1000}k` : s}
                </button>
              ))}
              <button
                onClick={() => runBenchmark(datasetSize)}
                disabled={loading}
                className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium transition-colors flex items-center gap-1"
              >
                <FontAwesomeIcon icon={faPlay} className="text-[10px]" />
                <span>{loading ? 'Đang chạy...' : 'Chạy lại'}</span>
              </button>
            </div>
          </div>
        }
      />

      {/* Metrics */}
      {data && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          <MetricCard
            title="DATASET ACTIVE (N)"
            value={data.dataset_size.toLocaleString()}
            unit="bản ghi"
            subtitle="Nạp trực tiếp trong RAM"
            icon={faServer}
          />
          <MetricCard
            title="MC1 HASH TABLE"
            value={formatTime(data.results[0]?.optimized_time_ns || 0)}
            subtitle={`Tăng tốc ~${data.results[0]?.speedup?.toFixed(0)}x`}
            icon={faBolt}
          />
          <MetricCard
            title="MC2 MAX-HEAP"
            value={formatTime(data.results[1]?.optimized_time_ns || 0)}
            subtitle={`Tăng tốc ~${data.results[1]?.speedup?.toFixed(0)}x`}
            icon={faGaugeHigh}
          />
          <MetricCard
            title="RQ3 INVERTED INDEX"
            value={formatTime(data.results[3]?.optimized_time_ns || 0)}
            subtitle={`Tăng tốc ~${data.results[3]?.speedup?.toFixed(0)}x`}
            icon={faChartLine}
          />
        </div>
      )}

      {/* Benchmark Results Table */}
      {data && (
        <div className="p-5 rounded-xl bg-white border border-gray-200 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-gray-100">
            <div>
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <FontAwesomeIcon icon={faChartLine} className="text-blue-600" />
                Kết Quả Đo Kiểm Thực Nghiệm (N = {data.dataset_size.toLocaleString()} bản ghi)
              </h3>
            </div>
            {loading && (
              <span className="text-xs font-semibold text-blue-600 animate-pulse">
                Đang thực thi C++ Engine...
              </span>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gray-200 text-gray-500 uppercase tracking-wider">
                  <th className="py-2.5 px-3">Module</th>
                  <th className="py-2.5 px-3">Bài Toán & Nghiệp Vụ</th>
                  <th className="py-2.5 px-3">Phương Án Baseline</th>
                  <th className="py-2.5 px-3">Phương Án Tối Ưu (DSA)</th>
                  <th className="py-2.5 px-3">Số Thao Tác (Base / Tối ưu)</th>
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

      {/* Theoretical Complexity vs Empirical Latency */}
      <div className="p-5 rounded-xl bg-white border border-gray-200 space-y-3">
        <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
          <FontAwesomeIcon icon={faMemory} className="text-blue-600" />
          Phân Biệt: Độ Phức Tạp Lý Thuyết và Thời Gian Đo Thực Nghiệm
        </h3>
        <p className="text-xs text-gray-600 leading-relaxed">
          Độ phức tạp Big-O biểu thị tốc độ tăng trưởng tiệm cận lý thuyết khi kích thước dữ liệu $N \to \infty$. Thời gian đo đạc thực nghiệm phản ánh trực tiếp sự tương tác giữa cấu trúc dữ liệu với kiến trúc vi xử lý và hệ thống bộ nhớ đệm CPU L1/L2/L3.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
          <div className="p-3 rounded-lg bg-gray-50 border border-gray-200 space-y-1">
            <h4 className="text-xs font-bold text-rose-800">
              1. Hiện tượng Cache Miss ở Baseline
            </h4>
            <p className="text-[11px] text-gray-600 leading-relaxed">
              Duyệt qua $1.000.000$ bản ghi vượt xa bộ nhớ đệm L1/L2, khiến CPU liên tục phải nạp từ RAM chính với độ trễ cao.
            </p>
          </div>

          <div className="p-3 rounded-lg bg-gray-50 border border-gray-200 space-y-1">
            <h4 className="text-xs font-bold text-emerald-800">
              2. Tính cục bộ (Spatial Locality) của DSA
            </h4>
            <p className="text-[11px] text-gray-600 leading-relaxed">
              Max-Heap và Bảng băm chỉ truy xuất đúng các ô nhớ mục tiêu, tận dụng tối đa dữ liệu đã có sẵn trong CPU Cache.
            </p>
          </div>

          <div className="p-3 rounded-lg bg-gray-50 border border-gray-200 space-y-1">
            <h4 className="text-xs font-bold text-blue-800">
              3. Tỉa nhánh Logarit của Cây AVL
            </h4>
            <p className="text-[11px] text-gray-600 leading-relaxed">
              Bỏ qua hàng trăm nghìn nhánh không liên quan, chỉ duyệt tối thiểu $\approx 20$ nút ở quy mô $1.000.000$ bản ghi.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
