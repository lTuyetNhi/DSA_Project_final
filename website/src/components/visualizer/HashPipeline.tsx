'use client';

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faCalculator, faDatabase, faCheck, faLayerGroup } from '@fortawesome/free-solid-svg-icons';

interface HashPipelineProps {
  inputKey: string;
  rawHash: number;
  tableSize: number;
  bucketIndex: number;
  found: boolean;
}

export default function HashPipeline({
  inputKey,
  rawHash,
  tableSize,
  bucketIndex,
  found,
}: HashPipelineProps) {
  return (
    <div className="p-5 rounded-xl bg-white border border-gray-200 space-y-3">
      <div className="flex items-center justify-between pb-2 border-b border-gray-100">
        <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
          <FontAwesomeIcon icon={faCalculator} className="text-blue-600 text-xs" />
          Quy Trình Tính Băm & Định Vị Ô Nhớ (Hash Pipeline)
        </h4>
        <span className="text-[11px] font-mono text-gray-500">DJB2 Algorithm</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5 items-center">
        {/* Step 1: Input Key */}
        <div className="p-3 rounded-lg bg-gray-50 border border-gray-200 text-center">
          <div className="text-[10px] uppercase tracking-wider text-gray-500">1. Input Key</div>
          <div className="text-sm font-mono font-bold text-blue-700 mt-0.5">"{inputKey}"</div>
          <div className="text-[10px] text-gray-400 mt-1">Duyệt từng ký tự</div>
        </div>

        {/* Step 2: DJB2 Hash */}
        <div className="p-3 rounded-lg bg-gray-50 border border-gray-200 text-center">
          <div className="text-[10px] uppercase tracking-wider text-gray-500">2. DJB2 Hash Value</div>
          <div className="text-sm font-mono font-bold text-gray-900 mt-0.5">{rawHash.toLocaleString()}</div>
          <div className="text-[10px] text-gray-400 mt-1">(hash &lt;&lt; 5) + hash + c</div>
        </div>

        {/* Step 3: Modulo Prime */}
        <div className="p-3 rounded-lg bg-gray-50 border border-gray-200 text-center">
          <div className="text-[10px] uppercase tracking-wider text-gray-500">3. Phép Chia Dư Modulo</div>
          <div className="text-xs font-mono font-semibold text-gray-800 mt-1">hash % {tableSize.toLocaleString()}</div>
          <div className="text-[10px] text-gray-400 mt-0.5">Số nguyên tố 100.003</div>
        </div>

        {/* Step 4: Bucket Index */}
        <div className="p-3 rounded-lg bg-blue-50/70 border border-blue-200 text-center">
          <div className="text-[10px] uppercase tracking-wider text-blue-700 font-bold">4. Bucket Target</div>
          <div className="text-sm font-mono font-black text-blue-800 mt-0.5">#{bucketIndex.toLocaleString()}</div>
          <div className="text-[10px] text-blue-600 mt-1">Vị trí ô nhớ O(1)</div>
        </div>

        {/* Step 5: Search Result */}
        <div className={`p-3 rounded-lg border text-center ${found ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900' : 'bg-rose-50/70 border-rose-200 text-rose-900'}`}>
          <div className="text-[10px] uppercase tracking-wider font-semibold">{found ? '5. Kết Quả' : '5. Trạng Thái'}</div>
          <div className="text-sm font-mono font-bold mt-0.5">{found ? `Khớp [${inputKey}]` : 'Không tồn tại'}</div>
          <div className="text-[10px] mt-1">{found ? 'Duyệt xích rời' : 'Slot trống / NULL'}</div>
        </div>
      </div>
    </div>
  );
}
