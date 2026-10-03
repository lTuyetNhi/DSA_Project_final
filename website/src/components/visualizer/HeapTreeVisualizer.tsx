'use client';

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSitemap, faTable, faFire } from '@fortawesome/free-solid-svg-icons';
import { Book } from '@/types/dsa';

interface HeapTreeVisualizerProps {
  books: Book[];
}

export default function HeapTreeVisualizer({ books }: HeapTreeVisualizerProps) {
  const root = books[0];

  return (
    <div className="p-5 rounded-xl bg-white border border-gray-200 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-gray-100">
        <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
          <FontAwesomeIcon icon={faSitemap} className="text-amber-600 text-xs" />
          Mô Hình Hóa Cấu Trúc Cây Đống Max-Heap (Heap Tree ↔ Array Mapping)
        </h4>
        <span className="text-[11px] font-mono text-gray-500">
          Node $i$: Con trái = $2i+1$, Con phải = $2i+2$, Cha = $\lfloor(i-1)/2\rfloor$
        </span>
      </div>

      {/* Binary Tree Visual Diagram */}
      <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
        <div className="text-[11px] font-semibold text-gray-600 uppercase tracking-wider mb-3 text-center">
          Cây Nhị Phân Hoàn Chỉnh (Binary Heap Tree)
        </div>

        {/* Level 0: Root */}
        {root && (
          <div className="flex flex-col items-center">
            <div className="p-2.5 rounded-lg bg-amber-100 border border-amber-300 text-center w-40">
              <div className="text-[10px] font-bold text-amber-800 uppercase font-mono">👑 ROOT (heap[0])</div>
              <div className="text-xs font-bold text-gray-900 truncate">{root.book_id}: {root.title}</div>
              <div className="text-xs font-black text-amber-900 flex items-center justify-center gap-1 mt-0.5">
                <FontAwesomeIcon icon={faFire} className="text-amber-600 text-[10px]" />
                {root.borrow_count} lượt mượn
              </div>
            </div>

            {/* Tree Branch Connectors */}
            <div className="w-48 h-4 border-b-2 border-l-2 border-r-2 border-gray-300 mt-1" />

            {/* Level 1: Left & Right Children */}
            <div className="flex items-center justify-between w-64 mt-1">
              {/* Left Child (heap[1]) */}
              <div className="p-2 rounded-lg bg-white border border-gray-200 text-center w-28">
                <div className="text-[9px] text-gray-500 font-mono">heap[1] (Con trái)</div>
                <div className="text-[11px] font-bold text-gray-800 truncate">{books[1]?.book_id || 'N/A'}</div>
                <div className="text-[11px] font-semibold text-amber-800">{books[1]?.borrow_count || 0} lượt</div>
              </div>

              {/* Right Child (heap[2]) */}
              <div className="p-2 rounded-lg bg-white border border-gray-200 text-center w-28">
                <div className="text-[9px] text-gray-500 font-mono">heap[2] (Con phải)</div>
                <div className="text-[11px] font-bold text-gray-800 truncate">{books[2]?.book_id || 'N/A'}</div>
                <div className="text-[11px] font-semibold text-amber-800">{books[2]?.borrow_count || 0} lượt</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Array Representation */}
      <div className="space-y-2">
        <div className="text-[11px] font-semibold text-gray-600 uppercase tracking-wider flex items-center gap-1.5">
          <FontAwesomeIcon icon={faTable} className="text-gray-400" />
          Biểu Diễn Trên Mảng 1 Chiều Trong RAM (Sequential Memory Block)
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 font-mono">
          {books.slice(0, 5).map((b, idx) => (
            <div
              key={b.book_id}
              className={`p-2 rounded-lg border text-center ${
                idx === 0
                  ? 'bg-amber-50 border-amber-300 text-amber-950 font-bold'
                  : 'bg-gray-50 border-gray-200 text-gray-800'
              }`}
            >
              <div className="text-[10px] text-gray-500">Index [{idx}] {idx === 0 && '👑 GỐC'}</div>
              <div className="text-xs font-bold mt-0.5 truncate">{b.book_id}</div>
              <div className="text-xs text-amber-800 font-semibold">{b.borrow_count} lượt</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
