'use client';

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalculator, faCircleInfo } from '@fortawesome/free-solid-svg-icons';

interface ComplexityCardProps {
  averageTime: string;
  worstTime: string;
  spaceComplexity: string;
  notes: string;
}

export default function ComplexityCard({
  averageTime,
  worstTime,
  spaceComplexity,
  notes,
}: ComplexityCardProps) {
  return (
    <div className="p-4 rounded-xl bg-white border border-gray-200 space-y-3">
      <div className="flex items-center justify-between pb-2 border-b border-gray-100">
        <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
          <FontAwesomeIcon icon={faCalculator} className="text-blue-600 text-xs" />
          Độ Phức Tạp Thuật Toán (Time & Space Complexity)
        </h4>
        <span className="text-[11px] text-gray-500 font-mono">Lý thuyết</span>
      </div>

      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="p-2 rounded bg-gray-50 border border-gray-100">
          <div className="text-[10px] text-gray-500 uppercase">Trung bình (Average)</div>
          <div className="text-sm font-bold text-emerald-700 font-mono mt-0.5">{averageTime}</div>
        </div>
        <div className="p-2 rounded bg-gray-50 border border-gray-100">
          <div className="text-[10px] text-gray-500 uppercase">Tệ nhất (Worst Case)</div>
          <div className="text-sm font-bold text-amber-700 font-mono mt-0.5">{worstTime}</div>
        </div>
        <div className="p-2 rounded bg-gray-50 border border-gray-100">
          <div className="text-[10px] text-gray-500 uppercase">Bộ nhớ (Space)</div>
          <div className="text-sm font-bold text-blue-700 font-mono mt-0.5">{spaceComplexity}</div>
        </div>
      </div>

      <div className="flex items-start gap-1.5 text-[11px] text-gray-500 bg-gray-50 p-2 rounded border border-gray-100">
        <FontAwesomeIcon icon={faCircleInfo} className="text-gray-400 mt-0.5" />
        <span>{notes}</span>
      </div>
    </div>
  );
}
