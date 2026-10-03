'use client';

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolderOpen, faArrowRight, faBook } from '@fortawesome/free-solid-svg-icons';
import { Book } from '@/types/dsa';

interface CategoryIndexVisualizerProps {
  category: string;
  books: Book[];
}

export default function CategoryIndexVisualizer({
  category,
  books,
}: CategoryIndexVisualizerProps) {
  return (
    <div className="p-5 rounded-xl bg-white border border-gray-200 space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-gray-100">
        <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
          <FontAwesomeIcon icon={faFolderOpen} className="text-purple-600 text-xs" />
          Mô Hình Hóa Bảng Băm Gom Cụm Thể Loại (Category Hash Index)
        </h4>
        <span className="text-[11px] font-mono text-gray-500">
          Category &rarr; Hash Bucket &rarr; List&lt;Book Reference&gt;
        </span>
      </div>

      <div className="p-4 rounded-lg bg-gray-50 border border-gray-200 font-mono text-xs">
        <div className="flex items-start gap-4 flex-col sm:flex-row">
          {/* Category Node */}
          <div className="p-3 rounded-lg bg-purple-50 border border-purple-200 text-purple-900 w-full sm:w-48 text-center shrink-0">
            <div className="text-[10px] text-purple-700 font-bold uppercase">Thể Loại Đầu Vào</div>
            <div className="text-xs font-bold mt-0.5 font-mono truncate">"{category}"</div>
            <div className="text-[10px] text-gray-500 mt-1">Hash(cat) % Size &rarr; Bucket</div>
          </div>

          {/* Arrow */}
          <div className="hidden sm:flex items-center justify-center pt-5 text-purple-500">
            <FontAwesomeIcon icon={faArrowRight} />
          </div>

          {/* Bucket Reference List */}
          <div className="flex-1 bg-white p-3 rounded-lg border border-gray-200 w-full space-y-2">
            <div className="text-[11px] font-semibold text-gray-700 flex items-center justify-between">
              <span>Danh Sách Tham Chiếu (List of Book References)</span>
              <span className="text-purple-700 font-bold font-mono">K = {books.length} cuốn</span>
            </div>

            <div className="space-y-1.5">
              {books.map((b) => (
                <div key={b.book_id} className="flex items-center gap-2 p-1.5 rounded bg-gray-50 border border-gray-100 text-xs">
                  <span className="text-purple-600 font-bold">├──→</span>
                  <span className="font-bold text-blue-700 font-mono">{b.book_id}</span>
                  <span className="text-gray-800 font-sans truncate">{b.title}</span>
                  <span className="text-gray-400 text-[10px] ml-auto">({b.author})</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
