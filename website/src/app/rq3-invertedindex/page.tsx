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
} from '@fortawesome/free-solid-svg-icons';
import RequirementBanner from '@/components/layout/RequirementBanner';
import ModeSelector from '@/components/layout/ModeSelector';
import ModuleHeader from '@/components/ui/ModuleHeader';
import MetricCard from '@/components/ui/MetricCard';
import ComparisonTable from '@/components/ui/ComparisonTable';
import ComplexityCard from '@/components/ui/ComplexityCard';
import InvertedIndexVisualizer from '@/components/visualizer/InvertedIndexVisualizer';
import BookCard from '@/components/ui/BookCard';
import { RQ3Response } from '@/types/dsa';
import { useRam } from '@/context/RamContext';

export default function RQ3Page() {
  const { ramBookCount, ramSyncState } = useRam();
  const ramReady = ramSyncState === 'ready';
  const [keyword, setKeyword] = useState('Code');
  const [data, setData] = useState<RQ3Response | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchRQ3 = (kw: string) => {
    if (!ramReady) return;
    setLoading(true);
    fetch(`/api/bridge?mode=rq3&keyword=${encodeURIComponent(kw)}&size=${ramBookCount}`)
      .then((res) => res.json())
      .then((resData: RQ3Response) => {
        setData(resData);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (ramReady) fetchRQ3(keyword);
  }, [ramReady, ramBookCount]);

  const sampleKeywords = ['Code', 'Algorithms', 'System', 'Approach', 'Mathematics', 'Python'];

  return (
    <div className="w-full space-y-5">
      {/* Top Criteria & Mode Selector */}
      <RequirementBanner />
      <ModeSelector />

      {/* Module Header */}
      <ModuleHeader
        moduleCode="RQ3"
        dsaName="INVERTED INDEX"
        title="Tìm kiếm sách theo từ khóa"
        description="Phân tích tiêu đề thành các token và tra cứu Posting List trong bảng băm chỉ mục ngược, loại bỏ phép so khớp xâu tuyến tính đắt đỏ O(N × M)."
        complexityLabel="Search Pipeline"
        complexityValue="O(1 + K)"
        childrenRight={
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && fetchRQ3(keyword)}
                placeholder="Nhập từ khóa (VD: Code)..."
                className="w-full sm:w-48 px-3 py-1.5 rounded-lg border border-gray-300 text-gray-900 text-xs focus:outline-none focus:border-indigo-500 font-mono font-bold"
              />
              <button
                onClick={() => fetchRQ3(keyword)}
                disabled={loading || !ramReady}
                className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs transition-colors flex items-center gap-1.5 shrink-0"
              >
                <FontAwesomeIcon icon={faSearch} />
                <span>{loading ? 'Đang tìm...' : 'Tìm kiếm'}</span>
              </button>
            </div>

            {/* Quick Keywords */}
            <div className="flex items-center gap-1 flex-wrap">
              <span className="text-[11px] text-gray-500 font-medium">Từ khóa:</span>
              {sampleKeywords.map((kw) => (
                <button
                  key={kw}
                  onClick={() => {
                    setKeyword(kw);
                    fetchRQ3(kw);
                  }}
                  className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors ${
                    keyword === kw
                      ? 'bg-indigo-600 text-white font-bold'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {kw}
                </button>
              ))}
            </div>
          </div>
        }
      />

      {/* Metrics */}
      {data && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          <MetricCard
            title="SEARCH TIME"
            value={`${data.optimized.execution_time_ns} ns`}
            subtitle="Native C++ Engine"
            icon={faBolt}
          />
          <MetricCard
            title="MATCHED BOOKS (K)"
            value={`${data.matched_books.length} cuốn`}
            subtitle={`Khớp từ khóa "${data.keyword}"`}
            icon={faBookOpen}
          />
          <MetricCard
            title="POSTING LIST LOOKUPS"
            value="1"
            subtitle="Băm từ khóa O(1)"
            icon={faKey}
          />
          <MetricCard
            title="BASELINE STRING SCANS"
            value={`${data.baseline.checks ?? 10} cuốn`}
            subtitle="Linear Substring Scan O(N×M)"
            icon={faLayerGroup}
          />
        </div>
      )}

      {/* Inverted Index Pipeline Visualizer */}
      {data && (
        <InvertedIndexVisualizer
          keyword={data.keyword}
          matchedCount={data.matched_books.length}
        />
      )}

      {/* Result Panel: Matched Books List */}
      {data && (
        <div className="p-5 rounded-xl bg-white border border-gray-200 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-gray-100">
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <FontAwesomeIcon icon={faCheckCircle} className="text-emerald-600" />
              Kết Quả Khớp Từ Khóa "{data.keyword}" ({data.matched_books.length} cuốn)
            </h3>
            <span className="text-xs font-mono text-indigo-700 font-semibold">
              K = {data.matched_books.length} phần tử
            </span>
          </div>

          {data.matched_books.length === 0 ? (
            <div className="p-6 text-center text-gray-500 bg-gray-50 rounded-lg">
              <div className="text-xs font-semibold text-gray-800">Không tìm thấy tài liệu phù hợp</div>
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

      {/* Benchmark & Complexity */}
      {data && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <ComparisonTable
              baselineName="Linear Substring Scan (So khớp chuỗi con O(N×M))"
              optimizedName="Inverted Index Hash Table (Bảng băm chỉ mục ngược O(1+K))"
              baseline={data.baseline}
              optimized={data.optimized}
              stepLabel="Số sách đã kiểm tra"
            />
          </div>
          <div className="lg:col-span-1">
            <ComplexityCard
              averageTime="Token Hash: O(1)"
              worstTime="Extract Posting: O(k)"
              spaceComplexity="O(Total Tokens)"
              notes="Băm từ khóa tìm Posting List trong O(1). Sau đó trích xuất K tài liệu khớp trong O(K). Loại bỏ chi phí quét so khớp chuỗi O(N × M)."
            />
          </div>
        </div>
      )}
    </div>
  );
}
