'use client';

import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBookOpen,
  faSearch,
  faBolt,
  faLayerGroup,
  faCheckCircle,
  faListOl,
  faKey,
  faDiagramProject,
} from '@fortawesome/free-solid-svg-icons';
import ComparisonTable from '@/components/ui/ComparisonTable';
import BookCard from '@/components/ui/BookCard';
import MetricCard from '@/components/ui/MetricCard';
import { RQ3Response } from '@/types/dsa';

export default function RQ3Page() {
  const [keyword, setKeyword] = useState('Code');
  const [data, setData] = useState<RQ3Response | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchRQ3 = (kw: string) => {
    setLoading(true);
    fetch(`/api/bridge?mode=rq3&keyword=${encodeURIComponent(kw)}`)
      .then((res) => res.json())
      .then((resData: RQ3Response) => {
        setData(resData);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchRQ3(keyword);
  }, []);

  const sampleKeywords = ['Code', 'Algorithms', 'System', 'Approach', 'Mathematics', 'Python'];

  return (
    <div className="w-full space-y-8">
      {/* Module Header */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-white/10 bg-gradient-to-br from-purple-950/40 via-gray-900/90 to-gray-950">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-semibold uppercase tracking-wider mb-3">
              <FontAwesomeIcon icon={faBookOpen} />
              <span>Module RQ3 — Bảng Băm Chỉ Mục Ngược (Inverted Index)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Tìm Kiếm Sách Theo Từ Khóa Trong O(1+K)
            </h1>
            <p className="text-sm text-gray-300 mt-1 max-w-2xl">
              Tách nhỏ tiêu đề sách thành các từ khóa chuẩn hóa (Tokenization). Khi tìm kiếm, hệ thống băm từ khóa và lấy trực tiếp danh sách chỉ mục (Posting List) trong $O(1+K)$, loại bỏ phép so khớp xâu đắt đỏ $O(N \times M)$.
            </p>
          </div>

          {/* Keyword Search Controls */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && fetchRQ3(keyword)}
                placeholder="Nhập từ khóa (VD: Code)..."
                className="w-full sm:w-64 px-4 py-2.5 rounded-xl bg-gray-900 border border-white/15 text-white text-sm focus:outline-none focus:border-purple-500 font-mono"
              />
              <button
                onClick={() => fetchRQ3(keyword)}
                disabled={loading}
                className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-sm shadow-md shadow-purple-600/30 transition-all flex items-center gap-2"
              >
                <FontAwesomeIcon icon={faSearch} />
                <span>Tìm kiếm</span>
              </button>
            </div>

            {/* Quick Sample Keywords */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] text-gray-400">Từ khóa mẫu:</span>
              {sampleKeywords.map((kw) => (
                <button
                  key={kw}
                  onClick={() => {
                    setKeyword(kw);
                    fetchRQ3(kw);
                  }}
                  className={`px-2 py-0.5 rounded text-xs font-mono transition-all ${
                    keyword === kw
                      ? 'bg-purple-500 text-white font-bold'
                      : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {kw}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Real-time C++ Metrics */}
      {data && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Thời Gian Tra Chỉ Mục Ngược"
            value={data.optimized.execution_time_ns}
            unit="nanoseconds"
            subtitle="Đo trực tiếp từ Native C++ Engine"
            icon={faBolt}
            variant="emerald"
          />
          <MetricCard
            title="Số Sách Khớp Từ Khóa (K)"
            value={data.matched_books.length}
            unit="cuốn"
            subtitle={`Tìm thấy các sách có tiêu đề chứa "${data.keyword}"`}
            icon={faBookOpen}
            variant="indigo"
          />
          <MetricCard
            title="Số Lần Tra Posting List (DSA)"
            value={data.optimized.checks ?? 0}
            unit="thao tác"
            subtitle="Chỉ 1 lần băm từ khóa để lấy Posting List"
            icon={faKey}
            variant="cyan"
          />
          <MetricCard
            title="Số Sách Phải Quét So Khớp Xâu"
            value={data.baseline.checks ?? 10}
            unit="cuốn sách"
            subtitle="Phải so khớp xâu con trên từng cuốn O(N * M)"
            icon={faLayerGroup}
            variant="rose"
          />
        </div>
      )}

      {/* Inverted Index Architecture Visualizer */}
      <div className="glass-card p-6 rounded-2xl border border-white/10 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <FontAwesomeIcon icon={faDiagramProject} className="text-purple-400" />
            Kiến Trúc Chỉ Mục Ngược (Inverted Index Architecture)
          </h3>
          <span className="text-xs font-mono px-3 py-1 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/30">
            Token &rarr; Hash Table &rarr; Posting List [Book IDs]
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-gray-900/80 border border-white/5 space-y-1">
            <div className="text-xs text-gray-400 uppercase tracking-wider">1. Phân Tách Từ Khóa (Tokenization)</div>
            <div className="text-sm font-mono text-purple-300">"Clean Code" &rarr; ['clean', 'code']</div>
            <p className="text-[11px] text-gray-500">Chuẩn hóa chữ thường và loại bỏ ký tự đặc biệt</p>
          </div>

          <div className="p-4 rounded-xl bg-gray-900/80 border border-white/5 space-y-1">
            <div className="text-xs text-gray-400 uppercase tracking-wider">2. Băm Từ Khóa Vào Bảng Chỉ Mục</div>
            <div className="text-sm font-mono text-emerald-400">DJB2('code') % Prime &rarr; Slot</div>
            <p className="text-[11px] text-gray-500">Tra cứu tức thì trong O(1) không cần duyệt mảng</p>
          </div>

          <div className="p-4 rounded-xl bg-purple-950/60 border border-purple-500/30 space-y-1">
            <div className="text-xs text-purple-300 uppercase tracking-wider font-semibold">3. Trích Xuất Posting List</div>
            <div className="text-sm font-mono text-cyan-300">['B002', 'B007', ...]</div>
            <p className="text-[11px] text-purple-400">Chỉ duyệt đúng K cuốn sách liên quan</p>
          </div>
        </div>
      </div>

      {/* Live Benchmark Comparison Table */}
      {data && (
        <ComparisonTable
          baselineName="So Khớp Xâu Tuyến Tính (Linear Substring Scan O(N×M))"
          optimizedName="Chỉ Mục Ngược (Inverted Index Hash Table O(1+K))"
          baseline={data.baseline}
          optimized={data.optimized}
          stepLabel="Số sách / nút đã kiểm tra"
        />
      )}

      {/* Matched Books Result List */}
      {data && (
        <div className="glass-card p-6 rounded-2xl border border-white/10 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <FontAwesomeIcon icon={faCheckCircle} className="text-emerald-400" />
              Danh Sách Sách Khớp Từ Khóa "{data.keyword}" ({data.matched_books.length} cuốn)
            </h3>
            <span className="text-xs font-mono px-3 py-1 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/30">
              Độ phức tạp: O(1 + K)
            </span>
          </div>

          {data.matched_books.length === 0 ? (
            <div className="p-8 text-center text-gray-400 bg-gray-900/40 rounded-xl border border-white/5">
              <div className="text-sm font-semibold text-white">Không tìm thấy sách phù hợp</div>
              <div className="text-xs text-gray-500 mt-1">Không có cuốn sách nào trong thư viện chứa từ khóa "{data.keyword}".</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.matched_books.map((b) => (
                <BookCard key={b.book_id} book={b} highlight={true} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
