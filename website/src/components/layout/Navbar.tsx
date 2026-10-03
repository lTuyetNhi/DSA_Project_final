'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBookOpen,
  faBolt,
  faChartLine,
  faLayerGroup,
  faCodeBranch,
  faFolderOpen,
} from '@fortawesome/free-solid-svg-icons';

export default function Navbar() {
  const pathname = usePathname();
  const [bridgeStatus, setBridgeStatus] = useState<'checking' | 'connected' | 'error'>('checking');

  useEffect(() => {
    fetch('/api/bridge?mode=data')
      .then((res) => {
        if (res.ok) setBridgeStatus('connected');
        else setBridgeStatus('error');
      })
      .catch(() => setBridgeStatus('error'));
  }, []);

  const navLinks = [
    { href: '/', label: 'Tổng quan', icon: faBookOpen },
    { href: '/mc1-hashtable', label: 'MC1: Bảng băm', icon: faBolt },
    { href: '/mc2-maxheap', label: 'MC2: Max-Heap', icon: faLayerGroup },
    { href: '/rq1-category', label: 'RQ1: Thể loại', icon: faFolderOpen },
    { href: '/rq2-avltree', label: 'RQ2: Cây AVL', icon: faCodeBranch },
    { href: '/rq3-invertedindex', label: 'RQ3: Chỉ mục ngược', icon: faBookOpen },
    { href: '/benchmark', label: 'Đo kiểm hiệu năng', icon: faChartLine },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white">
      <div className="w-full px-6 py-3 flex items-center justify-between">
        {/* Logo & Brand */}
        <Link href="/" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
            DSA
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base text-gray-900">
                DSA Library Engine
              </span>
              <span className="px-2 py-0.5 text-[11px] font-medium rounded bg-blue-50 text-blue-700 border border-blue-200">
                C++ Native
              </span>
            </div>
            <p className="text-[11px] text-gray-500">Mô hình hóa cấu trúc dữ liệu & Thuật toán</p>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <FontAwesomeIcon icon={link.icon} className="text-xs text-gray-500" />
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* C++ Status Indicator */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-md bg-gray-50 border border-gray-200 text-xs">
            <span
              className={`w-2 h-2 rounded-full ${
                bridgeStatus === 'connected'
                  ? 'bg-emerald-500'
                  : bridgeStatus === 'checking'
                  ? 'bg-amber-500'
                  : 'bg-rose-500'
              }`}
            />
            <span className="text-gray-600 font-medium text-[11px]">
              {bridgeStatus === 'connected'
                ? 'C++ Engine: Sẵn sàng'
                : bridgeStatus === 'checking'
                ? 'Đang kết nối C++...'
                : 'C++ Offline'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
