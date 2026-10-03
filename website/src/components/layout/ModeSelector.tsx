'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartLine, faBolt, faDatabase } from '@fortawesome/free-solid-svg-icons';

export default function ModeSelector() {
  const pathname = usePathname();

  const isMode1 = pathname === '/benchmark';
  const isMode2 = ['/mc1-hashtable', '/mc2-maxheap', '/rq1-category', '/rq2-avltree', '/rq3-invertedindex'].includes(pathname);
  const isMode3 = pathname === '/';

  return (
    <div className="flex items-center gap-2 border-b border-gray-200 pb-3 mb-5 overflow-x-auto">
      <Link
        href="/benchmark"
        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors ${
          isMode1
            ? 'bg-blue-50 text-blue-700 border border-blue-300 font-bold'
            : 'bg-white text-gray-600 hover:text-gray-900 border border-gray-200 hover:bg-gray-50'
        }`}
      >
        <FontAwesomeIcon icon={faChartLine} className="text-blue-600 text-xs" />
        <span>Mode 1: Benchmark Suite (So Sánh)</span>
      </Link>

      <Link
        href="/mc1-hashtable"
        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors ${
          isMode2
            ? 'bg-amber-50 text-amber-800 border border-amber-300 font-bold'
            : 'bg-white text-gray-600 hover:text-gray-900 border border-gray-200 hover:bg-gray-50'
        }`}
      >
        <FontAwesomeIcon icon={faBolt} className="text-amber-600 text-xs" />
        <span>Mode 2: Final Solution (Tối Ưu / Trực Quan Hóa DSA)</span>
      </Link>

      <Link
        href="/"
        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors ${
          isMode3
            ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 font-bold'
            : 'bg-white text-gray-600 hover:text-gray-900 border border-gray-200 hover:bg-gray-50'
        }`}
      >
        <FontAwesomeIcon icon={faDatabase} className="text-emerald-600 text-xs" />
        <span>Mode 3: Quản Lý Thư Viện (Data & Records View)</span>
      </Link>
    </div>
  );
}
