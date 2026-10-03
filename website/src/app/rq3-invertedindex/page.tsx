'use client';

import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBookOpen,
  faSearch,
  faBolt,
  faLayerGroup,
  faCheckCircle,
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
    <div className="w-full space-y-6">
      {/* Module Header */}
      <div className="p-6 rounded-xl bg-white border border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-block px-2.5 py-0.5 rounded text-xs font-semibold bg-purple-50 text-purple-800 border border-purple-200 mb-2">
              Module RQ3 — Bảng băm Chỉ mục ngược (Inverted Index)
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              Tìm Kiếm Sách Theo Từ Khóa Trong O(1+K)
            </h1>
            <p className="text-xs text-gray-600 mt-1 max-w-2xl">
              Tách nhỏ tiêu đề thành các từ khóa chuẩn hóa. Tra cứu Posting List trực tiếp trong $O(1+K)$, loại bỏ so khớp xâu $O(N \times M)$.
            </p>
          </div>

          {/* Search Box */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && fetchRQ3(keyword)}
                placeholder="Từ khóa (VD: Code)..."
                className="px-3 py-1.5 rounded-lg border border-gray-300 text-gray-900 text-xs focus:outline-none focus:border-purple-500 font-mono"
              />
              <button
                onClick={() => fetchRQ3(keyword)}
                disabled={loading}
                className="px-4 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-medium text-xs transition-colors flex items-center gap-1.5"
              >
                <FontAwesomeIcon icon={faSearch} />
                <span>Tìm kiếm</span>
              </button>
            </div>

            {/* Quick Keywords */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] text-gray-500">Từ khóa mẫu:</span>
              {sampleKeywords.map((kw) => (
                <button
                  key={kw}
                  onClick={() => {
                    setKeyword(kw);
                    fetchRQ3(kw);
                  }}
                  className={`px-2 py-0.5 rounded text-xs font-mono transition-colors ${
                    keyword === kw
                      ? 'bg-purple-600 text-white font-bold'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {kw}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Metrics */}
      {data && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Thời gian tra chỉ mục"
            value={data.optimized.execution_time_ns}
            unit="ns"
            subtitle="Đo trực tiếp từ C++ Engine"
            icon={faBolt}
          />
          <MetricCard
            title="Số sách khớp từ khóa"
            value={data.matched_books.length}
            unit="cuốn"
            subtitle={`Từ khóa "${data.keyword}"`}
            icon={faBookOpen}
          />
          <MetricCard
            title="Thao tác lấy Posting List"
            value={data.optimized.checks ?? 0}
            unit="thao tác"
            subtitle="Chỉ 1 lần băm từ khóa"
            icon={faKey}
          />
          <MetricCard
            title="Số sách quét so khớp xâu"
            value={data.baseline.checks ?? 10}
            unit="cuốn"
            subtitle="So khớp xâu tuần tự O(N * M)"
            icon={faLayerGroup}
          />
        </div>
      )}

      {/* Inverted Index Architecture Visualizer */}
      <div className="p-5 rounded-xl bg-white border border-gray-200 space-y-3">
        <div className="flex items-center justify-between pb-3 border-b border-gray-200">
          <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
            <FontAwesomeIcon icon={faDiagramProject} className="text-purple-600" />
            Kiến Trúc Chỉ Mục Ngược (Inverted Index)
          </h3>
          <span className="text-xs font-mono px-2 py-0.5 rounded bg-gray-100 text-gray-700 border border-gray-200">
            Token &rarr; Hash Table &rarr; Posting List [Book IDs]
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="p-3 rounded-lg bg-gray-50 border border-gray-200 space-y-1">
            <div className="text-[11px] text-gray-500 font-semibold">1. Phân tách từ khóa (Tokenization)</div>
            <div className="text-xs font-mono text-purple-700">"Clean Code" &rarr; ['clean', 'code']</div>
          </div>

          <div className="p-3 rounded-lg bg-gray-50 border border-gray-200 space-y-1">
            <div className="text-[11px] text-gray-500 font-semibold">2. Băm vào bảng chỉ mục</div>
            <div className="text-xs font-mono text-emerald-700">DJB2('code') % Prime &rarr; Slot</div>
          </div>

          <div className="p-3 rounded-lg bg-purple-50/60 border border-purple-200 space-y-1">
            <div className="text-[11px] text-purple-800 font-semibold">3. Lấy Posting List trong O(1)</div>
            <div className="text-xs font-mono text-purple-900 font-bold">['B002', 'B007', ...]</div>
          </div>
        </div>
      </div>

      {/* Comparison Table */}
      {data && (
        <ComparisonTable
          baselineName="So Khớp Xâu Tuyến Tính (Linear Substring Scan O(N×M))"
          optimizedName="Chỉ Mục Ngược (Inverted Index Hash Table O(1+K))"
          baseline={data.baseline}
          optimized={data.optimized}
          stepLabel="Số sách đã kiểm tra"
        />
      )}

      {/* Matched Books List */}
      {data && (
        <div className="p-5 rounded-xl bg-white border border-gray-200 space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-gray-200">
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <FontAwesomeIcon icon={faCheckCircle} className="text-emerald-600" />
              Danh Sách Sách Khớp Từ Khóa "{data.keyword}" ({data.matched_books.length} cuốn)
            </h3>
            <span className="text-xs font-mono text-gray-500">
              Độ phức tạp: O(1 + K)
            </span>
          </div>

          {data.matched_books.length === 0 ? (
            <div className="p-6 text-center text-gray-500 bg-gray-50 rounded-lg">
              <div className="text-xs font-semibold text-gray-800">Không tìm thấy sách phù hợp</div>
              <div className="text-[11px] text-gray-500 mt-0.5">Không có cuốn sách nào trong thư viện chứa từ khóa "{data.keyword}".</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
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
