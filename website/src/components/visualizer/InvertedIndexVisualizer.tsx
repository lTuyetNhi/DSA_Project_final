'use client';

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDiagramProject, faKey, faArrowRight, faFilter } from '@fortawesome/free-solid-svg-icons';

interface InvertedIndexVisualizerProps {
  keyword: string;
  matchedCount: number;
}

export default function InvertedIndexVisualizer({
  keyword,
  matchedCount,
}: InvertedIndexVisualizerProps) {
  return (
    <div className="p-5 rounded-xl bg-white border border-gray-200 space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-gray-100">
        <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
          <FontAwesomeIcon icon={faDiagramProject} className="text-indigo-600 text-xs" />
          Kiến Trúc Chỉ Mục Ngược (Inverted Index Search Pipeline)
        </h4>
        <span className="text-[11px] font-mono text-gray-500">
          Token &rarr; Hash Index &rarr; Posting List
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
        {/* Step 1: Tokenization */}
        <div className="p-3 rounded-lg bg-gray-50 border border-gray-200 space-y-1">
          <div className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">1. Phân Tách Từ Khóa</div>
          <div className="text-xs font-mono text-indigo-700 font-bold">"{keyword.toLowerCase()}"</div>
          <p className="text-[10px] text-gray-500">Tokenize & Chuẩn hóa lowercase</p>
        </div>

        {/* Step 2: Hash Lookup */}
        <div className="p-3 rounded-lg bg-gray-50 border border-gray-200 space-y-1">
          <div className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">2. Băm Từ Khóa</div>
          <div className="text-xs font-mono text-emerald-700 font-bold">DJB2("{keyword}") % Prime</div>
          <p className="text-[10px] text-gray-500">Tra cứu slot trong O(1)</p>
        </div>

        {/* Step 3: Posting List */}
        <div className="p-3 rounded-lg bg-indigo-50/70 border border-indigo-200 space-y-1">
          <div className="text-[10px] uppercase tracking-wider text-indigo-800 font-bold">3. Trích Xuất Posting List</div>
          <div className="text-xs font-mono text-indigo-900 font-bold">List&lt;BookID&gt;</div>
          <p className="text-[10px] text-indigo-700">Chỉ duyệt đúng candidate set</p>
        </div>

        {/* Step 4: Matched Results */}
        <div className="p-3 rounded-lg bg-emerald-50/70 border border-emerald-200 space-y-1">
          <div className="text-[10px] uppercase tracking-wider text-emerald-800 font-bold">4. Kết Quả Khớp</div>
          <div className="text-xs font-mono text-emerald-900 font-bold">Matched: {matchedCount} cuốn</div>
          <p className="text-[10px] text-emerald-700">Thời gian: O(1 + K)</p>
        </div>
      </div>
    </div>
  );
}
