'use client';

import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBolt,
  faSearch,
  faCalculator,
  faCheckCircle,
  faTimesCircle,
  faLayerGroup,
} from '@fortawesome/free-solid-svg-icons';
import ComparisonTable from '@/components/ui/ComparisonTable';
import BookCard from '@/components/ui/BookCard';
import MetricCard from '@/components/ui/MetricCard';
import { MC1Response } from '@/types/dsa';

export default function MC1Page() {
  const [targetId, setTargetId] = useState('B001');
  const [data, setData] = useState<MC1Response | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchMC1 = (idToSearch: string) => {
    setLoading(true);
    fetch(`/api/bridge?mode=mc1&id=${encodeURIComponent(idToSearch)}`)
      .then((res) => res.json())
      .then((resData: MC1Response) => {
        setData(resData);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchMC1(targetId);
  }, []);

  const sampleIds = ['B001', 'B002', 'B003', 'B007', 'B010', 'B999'];

  return (
    <div className="w-full space-y-6">
      {/* Module Header */}
      <div className="p-6 rounded-xl bg-white border border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-block px-2.5 py-0.5 rounded text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 mb-2">
              Module MC1 — Cấu trúc Bảng băm Xích rời
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              Tra Cứu Mã Sách Trong O(1)
            </h1>
            <p className="text-xs text-gray-600 mt-1 max-w-2xl">
              Hàm băm DJB2 phân tán đều kết hợp bảng băm kích thước số nguyên tố $100.003$ để hạn chế va chạm.
            </p>
          </div>

          {/* Search Box */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={targetId}
                onChange={(e) => setTargetId(e.target.value.toUpperCase())}
                onKeyDown={(e) => e.key === 'Enter' && fetchMC1(targetId)}
                placeholder="Mã sách (VD: B001)..."
                className="px-3 py-1.5 rounded-lg border border-gray-300 text-gray-900 text-xs focus:outline-none focus:border-blue-500 font-mono"
              />
              <button
                onClick={() => fetchMC1(targetId)}
                disabled={loading}
                className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs transition-colors flex items-center gap-1.5"
              >
                <FontAwesomeIcon icon={faSearch} />
                <span>{loading ? 'Đang băm...' : 'Tra cứu'}</span>
              </button>
            </div>

            {/* Quick Sample IDs */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] text-gray-500">Mã mẫu:</span>
              {sampleIds.map((id) => (
                <button
                  key={id}
                  onClick={() => {
                    setTargetId(id);
                    fetchMC1(id);
                  }}
                  className={`px-2 py-0.5 rounded text-xs font-mono transition-colors ${
                    targetId === id
                      ? 'bg-blue-600 text-white font-bold'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {id}
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
            title="Thời gian băm & tra cứu"
            value={data.optimized.execution_time_ns}
            unit="ns"
            subtitle="Đo trực tiếp từ C++ Engine"
            icon={faBolt}
          />
          <MetricCard
            title="Số phép so sánh (DSA)"
            value={data.optimized.comparisons ?? 0}
            unit="bước"
            subtitle="Định vị ngay ô Bucket"
            icon={faCalculator}
          />
          <MetricCard
            title="Số phép quét (Baseline)"
            value={data.baseline.comparisons ?? 0}
            unit="bước"
            subtitle={`Quét qua ${data.baseline.comparisons} phần tử`}
            icon={faLayerGroup}
          />
          <MetricCard
            title="Kết quả tìm kiếm"
            value={data.optimized.found ? 'Tìm thấy' : 'Không có'}
            subtitle={data.optimized.found ? `Khớp sách ${data.target_id}` : 'Mã không tồn tại'}
            icon={data.optimized.found ? faCheckCircle : faTimesCircle}
          />
        </div>
      )}

      {/* DJB2 Hash Calculator Visualizer */}
      {data && (
        <div className="p-5 rounded-xl bg-white border border-gray-200 space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-gray-200">
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <FontAwesomeIcon icon={faCalculator} className="text-blue-600" />
              Chi Tiết Hàm Băm DJB2
            </h3>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-gray-100 text-gray-700 border border-gray-200">
              hash = ((hash &lt;&lt; 5) + hash) + c
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-3 rounded-lg bg-gray-50 border border-gray-200">
              <div className="text-[11px] text-gray-500">Chuỗi khóa đầu vào</div>
              <div className="text-base font-mono font-bold text-blue-700">"{data.target_id}"</div>
            </div>

            <div className="p-3 rounded-lg bg-gray-50 border border-gray-200">
              <div className="text-[11px] text-gray-500">Giá trị băm nguyên thủy (Raw Hash)</div>
              <div className="text-base font-mono font-bold text-gray-900">{data.hash_info.raw_hash.toLocaleString()}</div>
            </div>

            <div className="p-3 rounded-lg bg-blue-50/60 border border-blue-200">
              <div className="text-[11px] text-blue-700 font-medium">Chỉ số Bucket đích (Slot)</div>
              <div className="text-base font-mono font-bold text-blue-800">
                Bucket #{data.hash_info.bucket_index.toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Comparison Table */}
      {data && (
        <ComparisonTable
          baselineName="Tìm kiếm Tuyến tính (Linear Search)"
          optimizedName="Bảng băm Xích rời (Separate Chaining Hash Table)"
          baseline={data.baseline}
          optimized={data.optimized}
          stepLabel="Số phép so sánh mã sách"
        />
      )}

      {/* Found Book Card */}
      {data && data.book && (
        <div className="p-5 rounded-xl bg-white border border-gray-200 space-y-3">
          <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
            <FontAwesomeIcon icon={faCheckCircle} className="text-emerald-600" />
            Sách Tìm Thấy Trong Bộ Nhớ
          </h3>
          <div className="max-w-md">
            <BookCard book={data.book} highlight={true} />
          </div>
        </div>
      )}
    </div>
  );
}
