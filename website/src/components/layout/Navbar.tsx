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
  faServer,
  faCircleCheck,
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
    { href: '/mc1-hashtable', label: 'MC1: Bảng Băm', icon: faBolt },
    { href: '/mc2-maxheap', label: 'MC2: Max-Heap', icon: faLayerGroup },
    { href: '/rq1-category', label: 'RQ1: Thể Loại', icon: faLayerGroup },
    { href: '/rq2-avltree', label: 'RQ2: Cây AVL', icon: faCodeBranch },
    { href: '/rq3-invertedindex', label: 'RQ3: Chỉ Mục Ngược', icon: faBookOpen },
    { href: '/benchmark', label: 'Đo Kiểm Hiệu Năng', icon: faChartLine },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-gray-950/80 backdrop-blur-xl">
      <div className="w-full px-6 py-3 flex items-center justify-between">
        {/* Logo & Brand */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform">
            <FontAwesomeIcon icon={faServer} className="text-lg" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg bg-gradient-to-r from-white via-gray-100 to-indigo-300 bg-clip-text text-transparent">
                DSA Visualizer & Bridge
              </span>
              <span className="px-2 py-0.5 text-xs font-semibold uppercase tracking-wider rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                C++ Native
              </span>
            </div>
            <p className="text-xs text-gray-400">Hệ thống Đối sánh & Mô hình hóa Thuật toán Bộ nhớ Chính</p>
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
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 shadow-sm'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <FontAwesomeIcon icon={link.icon} className="text-xs opacity-80" />
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* C++ Bridge Connection Indicator */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-900/90 border border-white/10 text-xs">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                bridgeStatus === 'connected'
                  ? 'bg-emerald-400 animate-pulse shadow-sm shadow-emerald-400/50'
                  : bridgeStatus === 'checking'
                  ? 'bg-amber-400 animate-pulse'
                  : 'bg-rose-400'
              }`}
            />
            <span className="text-gray-300 font-medium">
              {bridgeStatus === 'connected'
                ? 'C++ Engine: Sẵn sàng'
                : bridgeStatus === 'checking'
                ? 'Đang kết nối C++...'
                : 'C++ Bridge Offline'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
