'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function RequirementBanner() {
  const pathname = usePathname();

  const requirements = [
    {
      href: '/mc1-hashtable',
      code: 'MC1 (Bắt buộc)',
      label: 'Tra cứu Mã Sách',
      dsa: 'Hash Table O(1)',
      color: 'text-blue-700 bg-blue-50 border-blue-200',
      dot: 'bg-blue-600',
    },
    {
      href: '/mc2-maxheap',
      code: 'MC2 (Bắt buộc)',
      label: 'Sách Mượn Nhiều Nhất',
      dsa: 'Heap O(1) Peek',
      color: 'text-amber-700 bg-amber-50 border-amber-200',
      dot: 'bg-amber-600',
    },
    {
      href: '/rq1-category',
      code: 'RQ1 (Tự chọn)',
      label: 'Lọc Theo Thể Loại',
      dsa: 'Category Index O(1+K)',
      color: 'text-purple-700 bg-purple-50 border-purple-200',
      dot: 'bg-purple-600',
    },
    {
      href: '/rq2-avltree',
      code: 'RQ2 (Tự chọn)',
      label: 'Lọc Phiếu Quá Hạn',
      dsa: 'AVL Tree O(log N + K)',
      color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
      dot: 'bg-emerald-600',
    },
    {
      href: '/rq3-invertedindex',
      code: 'RQ3 (Tự chọn)',
      label: 'Tìm Kiếm Tiêu Đề',
      dsa: 'Inverted Index O(1+K)',
      color: 'text-indigo-700 bg-indigo-50 border-indigo-200',
      dot: 'bg-indigo-600',
    },
  ];

  return (
    <div className="w-full bg-white border border-gray-200 rounded-xl p-3 mb-5">
      <div className="flex items-center gap-3 overflow-x-auto text-xs pb-1 sm:pb-0">
        <span className="font-bold text-gray-800 uppercase tracking-wider text-[11px] whitespace-nowrap pl-1">
          MÃ YÊU CẦU & TIÊU CHÍ:
        </span>

        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          {requirements.map((req) => {
            const isActive = pathname === req.href;
            return (
              <Link
                key={req.href}
                href={req.href}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-medium whitespace-nowrap transition-colors ${
                  isActive
                    ? `${req.color} font-bold ring-1 ring-blue-400`
                    : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${req.dot}`} />
                <span>{req.code}: {req.label}</span>
                <span className="font-mono opacity-80">[{req.dsa}]</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
