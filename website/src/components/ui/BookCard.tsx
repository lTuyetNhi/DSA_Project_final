'use client';

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook, faBookmark, faLayerGroup, faCalendar, faFire } from '@fortawesome/free-solid-svg-icons';
import { Book } from '@/types/dsa';

interface BookCardProps {
  book: Book;
  rank?: number;
  highlight?: boolean;
}

export default function BookCard({ book, rank, highlight = false }: BookCardProps) {
  return (
    <div
      className={`relative p-5 rounded-2xl border transition-all duration-200 ${
        highlight
          ? 'bg-gradient-to-br from-indigo-950/80 via-gray-900/90 to-indigo-900/40 border-indigo-500/50 shadow-lg shadow-indigo-500/15 ring-1 ring-indigo-400/30'
          : 'bg-gray-900/60 hover:bg-gray-850 border-white/10 hover:border-white/20'
      }`}
    >
      {/* Rank Badge for MC2 */}
      {rank !== undefined && (
        <div className="absolute -top-2.5 -left-2.5 w-7 h-7 rounded-full bg-gradient-to-tr from-amber-500 to-amber-300 text-gray-950 font-black text-xs flex items-center justify-center shadow-md">
          #{rank}
        </div>
      )}

      <div className="flex items-start justify-between gap-3 mb-2">
        <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
          {book.book_id}
        </span>
        <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/5 text-gray-400 border border-white/10">
          {book.category}
        </span>
      </div>

      <h4 className="font-bold text-base text-white line-clamp-1 mb-1 group-hover:text-indigo-300">
        {book.title}
      </h4>
      <p className="text-xs text-gray-400 mb-4 flex items-center gap-1.5">
        <FontAwesomeIcon icon={faBookmark} className="text-gray-500 text-[10px]" />
        {book.author} ({book.published_year})
      </p>

      <div className="grid grid-cols-3 gap-2 pt-3 border-t border-white/5 text-center">
        <div className="p-1.5 rounded-lg bg-white/5">
          <div className="text-[10px] uppercase tracking-wider text-gray-400">Tổng</div>
          <div className="text-xs font-bold text-white">{book.total_quantity}</div>
        </div>
        <div className="p-1.5 rounded-lg bg-white/5">
          <div className="text-[10px] uppercase tracking-wider text-gray-400">Còn lại</div>
          <div className={`text-xs font-bold ${book.available_quantity > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {book.available_quantity}
          </div>
        </div>
        <div className="p-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
          <div className="text-[10px] uppercase tracking-wider text-indigo-300 flex items-center justify-center gap-1">
            <FontAwesomeIcon icon={faFire} className="text-amber-400 text-[9px]" />
            Mượn
          </div>
          <div className="text-xs font-bold text-amber-300">{book.borrow_count}</div>
        </div>
      </div>
    </div>
  );
}
