'use client';

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBolt, faClock, faCheck, faShieldHalved } from '@fortawesome/free-solid-svg-icons';
import { AlgorithmMetrics } from '@/types/dsa';

interface ComparisonTableProps {
  baselineName: string;
  optimizedName: string;
  baseline: AlgorithmMetrics;
  optimized: AlgorithmMetrics;
  stepLabel?: string;
}

export default function ComparisonTable({
  baselineName,
  optimizedName,
  baseline,
  optimized,
  stepLabel = 'Số bước kiểm tra',
}: ComparisonTableProps) {
  const baseTime = baseline.execution_time_ns;
  const optTime = optimized.execution_time_ns;
  const speedup = optTime > 0 ? (baseTime / optTime).toFixed(1) : '1.0';

  const baseSteps = baseline.comparisons ?? baseline.checks ?? baseline.count ?? 0;
  const optSteps = optimized.comparisons ?? optimized.checks ?? optimized.count ?? 0;

  return (
    <div className="w-full glass-card p-6 rounded-2xl border border-white/10 shadow-2xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 mb-5 border-b border-white/10">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <FontAwesomeIcon icon={faShieldHalved} className="text-indigo-400" />
            Đối Sánh Hiệu Năng Trực Tiếp (Live Benchmark)
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">Dữ liệu đo đạc thực nghiệm tức thì từ Native C++ Engine</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
          <FontAwesomeIcon icon={faBolt} />
          <span>Tăng tốc xấp xỉ ~{speedup}x</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Baseline Card */}
        <div className="p-4 rounded-xl bg-gray-900/60 border border-rose-500/20">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-400">Giải pháp Baseline</span>
            <span className="px-2 py-0.5 rounded text-xs font-mono bg-rose-500/10 text-rose-300 border border-rose-500/30">
              {baseline.complexity}
            </span>
          </div>
          <h4 className="text-sm font-semibold text-gray-200 mb-3">{baselineName}</h4>
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between text-gray-400">
              <span className="flex items-center gap-1.5">
                <FontAwesomeIcon icon={faClock} className="text-gray-500" />
                Thời gian thực thi:
              </span>
              <span className="font-mono text-white font-medium">{baseTime.toLocaleString()} ns</span>
            </div>
            <div className="flex items-center justify-between text-gray-400">
              <span className="flex items-center gap-1.5">
                <FontAwesomeIcon icon={faCheck} className="text-gray-500" />
                {stepLabel}:
              </span>
              <span className="font-mono text-rose-300 font-medium">{baseSteps.toLocaleString()} bước</span>
            </div>
          </div>
        </div>

        {/* Optimized Card */}
        <div className="p-4 rounded-xl bg-indigo-950/40 border border-indigo-500/30 shadow-inner">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Giải pháp Tối ưu (DSA)</span>
            <span className="px-2 py-0.5 rounded text-xs font-mono bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
              {optimized.complexity}
            </span>
          </div>
          <h4 className="text-sm font-semibold text-white mb-3">{optimizedName}</h4>
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between text-gray-300">
              <span className="flex items-center gap-1.5">
                <FontAwesomeIcon icon={faClock} className="text-indigo-400" />
                Thời gian thực thi:
              </span>
              <span className="font-mono text-emerald-400 font-bold">{optTime.toLocaleString()} ns</span>
            </div>
            <div className="flex items-center justify-between text-gray-300">
              <span className="flex items-center gap-1.5">
                <FontAwesomeIcon icon={faCheck} className="text-indigo-400" />
                {stepLabel}:
              </span>
              <span className="font-mono text-emerald-300 font-bold">{optSteps.toLocaleString()} bước</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
