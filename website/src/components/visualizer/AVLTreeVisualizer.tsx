'use client';

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCodeBranch, faCircleExclamation, faCheckCircle, faFilter } from '@fortawesome/free-solid-svg-icons';
import { BorrowRecord } from '@/types/dsa';

interface AVLTreeVisualizerProps {
  currentDate: string;
  overdueRecords: BorrowRecord[];
}

export default function AVLTreeVisualizer({
  currentDate,
  overdueRecords,
}: AVLTreeVisualizerProps) {
  return (
    <div className="p-5 rounded-xl bg-white border border-gray-200 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-gray-100">
        <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
          <FontAwesomeIcon icon={faCodeBranch} className="text-emerald-600 text-xs" />
          Mô Hình Hóa Cây Tự Cân Bằng AVL & Truy Vấn Khoảng (Range Query)
        </h4>
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            <span className="text-gray-600 font-medium">Quá hạn (Overdue)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-gray-600 font-medium">Bình thường (Normal)</span>
          </div>
        </div>
      </div>

      {/* Query Explanation Banner */}
      <div className="p-3 rounded-lg bg-emerald-50/70 border border-emerald-200 text-xs flex items-center justify-between font-mono">
        <div className="flex items-center gap-2 text-emerald-900">
          <FontAwesomeIcon icon={faFilter} className="text-emerald-700" />
          <span>Truy vấn: dueDate &lt; "{currentDate}"</span>
        </div>
        <div className="text-emerald-800 font-bold">
          Độ phức tạp: O(log N + K) — Tỉa nhánh cây
        </div>
      </div>

      {/* AVL Binary Tree Diagram */}
      <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
        <div className="text-[11px] font-semibold text-gray-600 uppercase tracking-wider mb-3 text-center">
          Cấu Trúc Cây AVL (Sắp Xếp Theo Hạn Trả)
        </div>

        <div className="flex flex-col items-center">
          {/* Root Node */}
          <div className="p-2.5 rounded-lg bg-white border border-gray-300 text-center w-36 shadow-sm">
            <div className="text-[10px] text-gray-500 font-mono">2026-09-24 (BR003)</div>
            <div className="text-xs font-bold text-gray-900 mt-0.5">BF: 0 | H: 3</div>
            <div className="text-[10px] text-emerald-700 font-semibold mt-0.5">Đã trả sách</div>
          </div>

          {/* Tree Branches */}
          <div className="w-48 h-4 border-b-2 border-l-2 border-r-2 border-gray-300 mt-1" />

          {/* Level 1 Children */}
          <div className="flex items-center justify-between w-64 mt-1">
            {/* Left Node (Overdue branch) */}
            <div className="p-2 rounded-lg bg-rose-50 border border-rose-300 text-center w-28">
              <div className="text-[9px] text-rose-800 font-mono font-bold">2026-09-15</div>
              <div className="text-[10px] font-mono text-gray-700">BR001 | BF: -1</div>
              <div className="text-[9px] text-rose-700 font-bold mt-0.5">QUÁ HẠN</div>
            </div>

            {/* Right Node */}
            <div className="p-2 rounded-lg bg-white border border-gray-200 text-center w-28">
              <div className="text-[9px] text-gray-600 font-mono font-bold">2026-10-06</div>
              <div className="text-[10px] font-mono text-gray-700">BR006 | BF: 0</div>
              <div className="text-[9px] text-gray-500 mt-0.5">Chưa quá hạn</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
