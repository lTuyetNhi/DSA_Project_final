'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMicrochip,
  faRotateRight,
  faDownload,
  faServer,
} from '@fortawesome/free-solid-svg-icons';

export default function Navbar() {
  const pathname = usePathname();
  const [bridgeStatus, setBridgeStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  const [bookCount, setBookCount] = useState(10);
  const [maxBorrow, setMaxBorrow] = useState(70);

  useEffect(() => {
    fetch('/api/bridge?mode=data')
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 'success') {
          setBridgeStatus('connected');
          setBookCount(data.books?.length || 10);
          const maxB = data.books?.reduce((max: number, b: any) => Math.max(max, b.borrow_count || 0), 0);
          if (maxB) setMaxBorrow(maxB);
        } else {
          setBridgeStatus('error');
        }
      })
      .catch(() => setBridgeStatus('error'));
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white">
      <div className="w-full px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4">
        {/* Logo & Header Title */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white text-sm">
              <FontAwesomeIcon icon={faMicrochip} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm sm:text-base text-gray-900 tracking-tight">
                  DSA Performance Dashboard
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-gray-500">
                <span>C++ High Performance Engine</span>
                <span>•</span>
                <span className="text-emerald-700 font-medium">In-Memory Active</span>
              </div>
            </div>
          </Link>
        </div>

        {/* Right Action Buttons & Real-time Stats */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Actions */}
          <button
            onClick={() => window.location.reload()}
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors"
          >
            <FontAwesomeIcon icon={faDownload} className="text-[10px]" />
            <span>Nạp RAM</span>
          </button>

          <button
            onClick={() => window.location.reload()}
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium border border-gray-200 transition-colors"
          >
            <FontAwesomeIcon icon={faRotateRight} className="text-[10px]" />
            <span>Reset</span>
          </button>

          {/* Quick Stats Badges */}
          <div className="flex items-center gap-2 border-l border-gray-200 pl-3">
            <div className="px-2.5 py-1 rounded-lg bg-blue-50 border border-blue-200 text-center">
              <div className="text-[9px] uppercase tracking-wider text-blue-700 font-bold">Tổng Sách</div>
              <div className="text-xs font-black text-blue-900 font-mono">{bookCount} Cuốn</div>
            </div>

            <div className="px-2.5 py-1 rounded-lg bg-gray-50 border border-gray-200 text-center">
              <div className="text-[9px] uppercase tracking-wider text-gray-500 font-bold">Phổ Mượn</div>
              <div className="text-xs font-bold text-gray-800 font-mono">0 - {maxBorrow}</div>
            </div>

            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-gray-50 border border-gray-200">
              <span
                className={`w-2 h-2 rounded-full ${
                  bridgeStatus === 'connected'
                    ? 'bg-emerald-500'
                    : bridgeStatus === 'checking'
                    ? 'bg-amber-500'
                    : 'bg-rose-500'
                }`}
              />
              <span className="text-[11px] font-medium text-gray-700 hidden lg:inline">
                {bridgeStatus === 'connected' ? 'C++ Ready' : 'C++ Offline'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
