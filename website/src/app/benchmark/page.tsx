'use client';

import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChartLine,
  faBolt,
  faMicrochip,
  faMemory,
  faPlay,
  faServer,
  faShieldHalved,
  faLayerGroup,
  faGaugeHigh,
} from '@fortawesome/free-solid-svg-icons';
import MetricCard from '@/components/ui/MetricCard';
import { BenchmarkResponse, BenchmarkItem } from '@/types/dsa';

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
    <div className="w-full space-y-8">
      {/* Module Header */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-white/10 bg-gradient-to-br from-cyan-950/40 via-gray-900/90 to-gray-950">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-semibold uppercase tracking-wider mb-3">
              <FontAwesomeIcon icon={faGaugeHigh} />
              <span>Trung Tâm Đo Kiểm Hiệu Năng Đa Quy Mô (Multi-Scale Empirical Benchmark)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Thử Nghiệm & Đo Đạc Tốc Độ Xử Lý Trực Tiếp
            </h1>
            <p className="text-sm text-gray-300 mt-1 max-w-2xl">
              Chạy đo kiểm hiệu năng thực tế từ $N = 100$ đến $N = 1.000.000$ bản ghi trực tiếp trên Native C++ Engine với đồng hồ đo thời gian có độ chính xác nano-giây (`std::chrono::high_resolution_clock`).
            </p>
          </div>

          {/* Dataset Size Selector */}
          <div className="flex flex-col gap-2">
            <span className="text-xs text-gray-400 font-semibold">Chọn Quy Mô Dữ Liệu (N):</span>
            <div className="flex flex-wrap gap-1.5 bg-gray-900/90 p-1.5 rounded-2xl border border-white/10">
              {sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    setDatasetSize(s);
                    runBenchmark(s);
                  }}
                  disabled={loading}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
                    datasetSize === s
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-gray-950 shadow-md shadow-cyan-500/20'
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  N = {s >= 1000000 ? '1M' : s >= 1000 ? `${s / 1000}k` : s}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Overview Metrics Cards */}
      {data && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Quy Mô Dữ Liệu Thử Nghiệm"
            value={data.dataset_size.toLocaleString()}
            unit="bản ghi"
            subtitle="Tập dữ liệu tổng hợp nạp trực tiếp vào RAM"
            icon={faServer}
            variant="cyan"
          />
          <MetricCard
            title="Tốc Độ Bảng Băm (MC1)"
            value={formatTime(data.results[0]?.optimized_time_ns || 0)}
            subtitle={`Tăng tốc ~${data.results[0]?.speedup?.toFixed(0)}x`}
            icon={faBolt}
            variant="emerald"
            trend="Tức thời"
          />
          <MetricCard
            title="Tốc Độ Max-Heap (MC2)"
            value={formatTime(data.results[1]?.optimized_time_ns || 0)}
            subtitle={`Tăng tốc ~${data.results[1]?.speedup?.toFixed(0)}x`}
            icon={faGaugeHigh}
            variant="amber"
            trend="Cực đại"
          />
          <MetricCard
            title="Tốc Độ Chỉ Mục Ngược (RQ3)"
            value={formatTime(data.results[3]?.optimized_time_ns || 0)}
            subtitle={`Tăng tốc ~${data.results[3]?.speedup?.toFixed(0)}x`}
            icon={faMicrochip}
            variant="indigo"
          />
        </div>
      )}

      {/* Detailed Benchmark Comparison Table */}
      {data && (
        <div className="glass-card p-6 rounded-2xl border border-white/10 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <FontAwesomeIcon icon={faChartLine} className="text-cyan-400" />
                Bảng Kết Quả Đo Kiểm Thực Nghiệm (N = {data.dataset_size.toLocaleString()} bản ghi)
              </h3>
              <p className="text-xs text-gray-400">Thời gian thực thi và số phép toán so sánh ghi nhận trực tiếp từ C++ Engine</p>
            </div>
            {loading && (
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 animate-pulse">
                Đang đo kiểm C++...
              </span>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 text-gray-400 uppercase tracking-wider">
                  <th className="py-3 px-4">Mã Module</th>
                  <th className="py-3 px-4">Bài Toán / Nghiệp Vụ</th>
                  <th className="py-3 px-4">Thời Gian Baseline</th>
                  <th className="py-3 px-4">Thời Gian Tối Ưu (DSA)</th>
                  <th className="py-3 px-4">Số Bước Baseline / Tối Ưu</th>
                  <th className="py-3 px-4 text-center">Hệ Số Tăng Tốc</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {data.results.map((item) => (
                  <tr key={item.module} className="hover:bg-white/5 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-indigo-300">
                      <span className="px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20">
                        {item.module}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-white">{item.name}</td>
                    <td className="py-3.5 px-4 font-mono text-rose-400 font-medium">
                      {formatTime(item.baseline_time_ns)}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-emerald-400 font-bold">
                      {formatTime(item.optimized_time_ns)}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-gray-400">
                      <span className="text-rose-300">{item.baseline_steps.toLocaleString()}</span> /{' '}
                      <span className="text-emerald-300 font-bold">{item.optimized_steps.toLocaleString()}</span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
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

      {/* Memory Hierarchy & Cache Analysis Section */}
      <div className="glass-card p-6 sm:p-8 rounded-2xl border border-white/10 space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <FontAwesomeIcon icon={faMemory} className="text-indigo-400" />
          Phân Tích Chuyên Sâu Về Bản Chất Phân Cấp Bộ Nhớ (CPU Cache Hierarchy)
        </h3>
        <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
          Sự phân hóa hiệu năng vượt trội khi quy mô dữ liệu mở rộng từ hàng chục nghìn lên một triệu phần tử không chỉ đơn thuần bắt nguồn từ sự suy giảm số lượng phép toán lý thuyết, mà còn gắn liền mật thiết với kiến trúc phân cấp bộ nhớ của vi xử lý:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-gray-900/80 border border-white/5 space-y-2">
            <h4 className="text-xs font-bold text-rose-300 uppercase tracking-wider">
              1. Điểm Nghẽn Quét Tuyến Tính (Baseline)
            </h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              Duyệt qua $1.000.000$ phần tử vượt xa dung lượng bộ nhớ đệm CPU L1/L2, dẫn đến hiện tượng liên tục Cache Miss và phải nạp tuần tự từ RAM chính với độ trễ cao (hàng chục nano-giây mỗi truy xuất).
            </p>
          </div>

          <div className="p-4 rounded-xl bg-gray-900/80 border border-white/5 space-y-2">
            <h4 className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
              2. Tối Ưu Hóa Cục Bộ Bộ Nhớ (Max-Heap & Hash)
            </h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              Max-Heap lưu trữ liền mạch trên mảng một chiều tận dụng tối đa Spatial Locality trong CPU L1 Cache. Bảng băm chỉ truy xuất đúng 1 ô nhớ mục tiêu trong $O(1)$ thay vì duyệt toàn mảng.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-gray-900/80 border border-white/5 space-y-2">
            <h4 className="text-xs font-bold text-cyan-300 uppercase tracking-wider">
              3. Cơ Chế Tỉa Nhánh Cây AVL
            </h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              Cây tự cân bằng AVL nhờ tính chất sắp xếp đã loại bỏ hàng trăm nghìn nút không thỏa điều kiện ngày quá hạn ngay từ các nút trên cao, chỉ duyệt qua số lượng nút tối thiểu tương ứng chiều cao $\log_2 N$.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
