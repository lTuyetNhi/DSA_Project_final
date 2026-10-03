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
    <div className="w-full bg-white p-5 rounded-xl border border-gray-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 mb-4 border-b border-gray-200">
        <div>
          <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <FontAwesomeIcon icon={faShieldHalved} className="text-blue-600 text-sm" />
            Đối Sánh Hiệu Năng Thực Nghiệm (Live Benchmark)
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">Dữ liệu đo đạc trực tiếp từ C++ Engine</p>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
          <FontAwesomeIcon icon={faBolt} className="text-xs" />
          <span>Tăng tốc ~{speedup}x</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Baseline Card */}
        <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-rose-700">Giải pháp Baseline</span>
            <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-white text-rose-700 border border-rose-200 font-medium">
              {baseline.complexity}
            </span>
          </div>
          <h4 className="text-sm font-medium text-gray-900 mb-3">{baselineName}</h4>
          <div className="space-y-1.5 text-xs text-gray-600">
            <div className="flex items-center justify-between">
              <span>Thời gian thực thi:</span>
              <span className="font-mono text-gray-900 font-semibold">{baseTime.toLocaleString()} ns</span>
            </div>
            <div className="flex items-center justify-between">
              <span>{stepLabel}:</span>
              <span className="font-mono text-rose-600 font-semibold">{baseSteps.toLocaleString()} bước</span>
            </div>
          </div>
        </div>

        {/* Optimized Card */}
        <div className="p-4 rounded-lg bg-blue-50/50 border border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-blue-800">Giải pháp Tối ưu (DSA)</span>
            <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-white text-emerald-700 border border-emerald-200 font-medium">
              {optimized.complexity}
            </span>
          </div>
          <h4 className="text-sm font-medium text-gray-900 mb-3">{optimizedName}</h4>
          <div className="space-y-1.5 text-xs text-gray-700">
            <div className="flex items-center justify-between">
              <span>Thời gian thực thi:</span>
              <span className="font-mono text-emerald-700 font-bold">{optTime.toLocaleString()} ns</span>
            </div>
            <div className="flex items-center justify-between">
              <span>{stepLabel}:</span>
              <span className="font-mono text-blue-700 font-bold">{optSteps.toLocaleString()} bước</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
