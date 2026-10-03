'use client';

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookmark, faFire } from '@fortawesome/free-solid-svg-icons';
import { Book } from '@/types/dsa';

interface BookCardProps {
  book: Book;
  rank?: number;
  highlight?: boolean;
}

export default function BookCard({ book, rank, highlight = false }: BookCardProps) {
  return (
    <div
      className={`p-4 rounded-xl border ${
        highlight
          ? 'bg-blue-50/40 border-blue-300'
          : 'bg-white border-gray-200'
      }`}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          {rank !== undefined && (
            <span className="w-5 h-5 rounded bg-amber-100 text-amber-800 font-bold text-[11px] flex items-center justify-center">
              #{rank}
            </span>
          )}
          <span className="px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-gray-100 text-gray-800 border border-gray-200">
            {book.book_id}
          </span>
        </div>
        <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-gray-100 text-gray-600">
          {book.category}
        </span>
      </div>

      <h4 className="font-bold text-sm text-gray-900 line-clamp-1 mb-1">
        {book.title}
      </h4>
      <p className="text-xs text-gray-500 mb-3 flex items-center gap-1.5">
        <FontAwesomeIcon icon={faBookmark} className="text-gray-400 text-[10px]" />
        {book.author} ({book.published_year})
      </p>

      <div className="grid grid-cols-3 gap-2 pt-2.5 border-t border-gray-100 text-center">
        <div className="p-1 rounded bg-gray-50">
          <div className="text-[10px] text-gray-500">Tổng</div>
          <div className="text-xs font-bold text-gray-800">{book.total_quantity}</div>
        </div>
        <div className="p-1 rounded bg-gray-50">
          <div className="text-[10px] text-gray-500">Còn lại</div>
          <div className={`text-xs font-bold ${book.available_quantity > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
            {book.available_quantity}
          </div>
        </div>
        <div className="p-1 rounded bg-amber-50 border border-amber-100">
          <div className="text-[10px] text-amber-700 flex items-center justify-center gap-0.5">
            <FontAwesomeIcon icon={faFire} className="text-amber-500 text-[9px]" />
            Mượn
          </div>
          <div className="text-xs font-bold text-amber-800">{book.borrow_count}</div>
        </div>
      </div>
    </div>
  );
}
