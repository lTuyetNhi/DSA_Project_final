'use client';

import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBolt,
  faSearch,
  faCheckCircle,
  faTimesCircle,
  faLayerGroup,
  faCalculator,
  faCircleExclamation,
} from '@fortawesome/free-solid-svg-icons';
import RequirementBanner from '@/components/layout/RequirementBanner';
import ModeSelector from '@/components/layout/ModeSelector';
import ModuleHeader from '@/components/ui/ModuleHeader';
import MetricCard from '@/components/ui/MetricCard';
import ComparisonTable from '@/components/ui/ComparisonTable';
import ComplexityCard from '@/components/ui/ComplexityCard';
import HashPipeline from '@/components/visualizer/HashPipeline';
import BucketVisualizer from '@/components/visualizer/BucketVisualizer';
import BookCard from '@/components/ui/BookCard';
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

  const samplePresets = [
    { label: '🎲 Ngẫu nhiên', id: 'B003' },
    { label: 'Đầu dải', id: 'B001' },
    { label: 'Giữa dải', id: 'B005' },
    { label: 'Cuối dải', id: 'B010' },
    { label: 'Không tồn tại', id: 'B999' },
  ];

  return (
    <div className="w-full space-y-5">
      {/* Top Criteria & Mode Selector */}
      <RequirementBanner />
      <ModeSelector />

      {/* SECTION A – Operation & Header */}
      <ModuleHeader
        moduleCode="MC1"
        dsaName="HASH TABLE"
        title="Tra cứu sách theo mã"
        description="Tìm chính xác một tài liệu trong bảng băm xích rời bằng giải thuật băm DJB2 và định vị ô nhớ tức thời."
        complexityLabel="Average lookup"
        complexityValue="O(1)"
        childrenRight={
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={targetId}
                onChange={(e) => setTargetId(e.target.value.toUpperCase())}
                onKeyDown={(e) => e.key === 'Enter' && fetchMC1(targetId)}
                placeholder="Nhập mã sách..."
                className="w-full sm:w-48 px-3 py-1.5 rounded-lg border border-gray-300 text-gray-900 text-xs focus:outline-none focus:border-blue-500 font-mono font-bold"
              />
              <button
                onClick={() => fetchMC1(targetId)}
                disabled={loading}
                className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs transition-colors flex items-center gap-1.5 shrink-0"
              >
                <FontAwesomeIcon icon={faSearch} />
                <span>{loading ? 'Đang tra...' : 'Tra cứu'}</span>
              </button>
            </div>

            {/* Quick Sample Presets */}
            <div className="flex items-center gap-1 flex-wrap">
              <span className="text-[11px] text-gray-500 font-medium">Mã mẫu:</span>
              {samplePresets.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => {
                    setTargetId(preset.id);
                    fetchMC1(preset.id);
                  }}
                  className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors ${
                    targetId === preset.id
                      ? 'bg-blue-600 text-white font-bold'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {preset.label} ({preset.id})
                </button>
              ))}
            </div>
          </div>
        }
      />

      {/* SECTION B – Metrics */}
      {data && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          <MetricCard
            title="LOOKUP TIME"
            value={`${data.optimized.execution_time_ns} ns`}
            subtitle="Native C++ Engine"
            icon={faBolt}
          />
          <MetricCard
            title="HASH OPERATIONS"
            value="1"
            subtitle="Average O(1) Bucket Map"
            icon={faCalculator}
          />
          <MetricCard
            title="BASELINE COMPARISONS"
            value={`${data.baseline.comparisons} lần`}
            subtitle="Linear Search O(n)"
            icon={faLayerGroup}
          />
          <MetricCard
            title="STATUS"
            value={data.optimized.found ? 'Found' : 'Not Found'}
            subtitle={data.optimized.found ? `Khớp [${data.target_id}]` : `Không tồn tại ${data.target_id}`}
            icon={data.optimized.found ? faCheckCircle : faTimesCircle}
          />
        </div>
      )}

      {/* SECTION C – Hash Pipeline */}
      {data && (
        <HashPipeline
          inputKey={data.target_id}
          rawHash={data.hash_info.raw_hash}
          tableSize={data.hash_info.table_size}
          bucketIndex={data.hash_info.bucket_index}
          found={data.optimized.found || false}
        />
      )}

      {/* SECTION D – Bucket Visualizer */}
      {data && (
        <BucketVisualizer
          bucketIndex={data.hash_info.bucket_index}
          matchedId={data.target_id}
          found={data.optimized.found || false}
        />
      )}

      {/* Result Panel */}
      {data && (
        <div className="p-5 rounded-xl bg-white border border-gray-200 space-y-3">
          <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
            <FontAwesomeIcon icon={faCheckCircle} className={data.optimized.found ? 'text-emerald-600' : 'text-amber-600'} />
            Thông Tin Tài Liệu Trả Về (Result Panel)
          </h3>

          {data.book ? (
            <div className="max-w-md">
              <BookCard book={data.book} highlight={true} />
            </div>
          ) : (
            <div className="p-4 rounded-lg bg-gray-50 border border-gray-200 text-xs text-gray-600 flex items-center gap-2">
              <FontAwesomeIcon icon={faCircleExclamation} className="text-amber-500" />
              <span>Không tìm thấy sách mang mã <strong>{data.target_id}</strong> trong hệ thống.</span>
            </div>
          )}
        </div>
      )}

      {/* Benchmark Comparison & SECTION E – Complexity */}
      {data && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <ComparisonTable
              baselineName="Linear Search (Quét tuần tự mảng)"
              optimizedName="Hash Table (Bảng băm xích rời Separate Chaining)"
              baseline={data.baseline}
              optimized={data.optimized}
              stepLabel="Số phép so sánh mã sách"
            />
          </div>
          <div className="lg:col-span-1">
            <ComplexityCard
              averageTime="Search: O(1)"
              worstTime="Search: O(n)"
              spaceComplexity="O(n)"
              notes="Số nguyên tố 100.003 giảm thiểu xung đột. Khi va chạm, độ phức tạp là chiều dài xích liên kết O(L)."
            />
          </div>
        </div>
      )}
    </div>
  );
}
