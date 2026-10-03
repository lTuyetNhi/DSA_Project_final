'use client';

import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCodeBranch,
  faCalendarAlt,
  faBolt,
  faTriangleExclamation,
  faCheckCircle,
  faClock,
  faListCheck,
} from '@fortawesome/free-solid-svg-icons';
import RequirementBanner from '@/components/layout/RequirementBanner';
import ModeSelector from '@/components/layout/ModeSelector';
import ModuleHeader from '@/components/ui/ModuleHeader';
import MetricCard from '@/components/ui/MetricCard';
import ComparisonTable from '@/components/ui/ComparisonTable';
import ComplexityCard from '@/components/ui/ComplexityCard';
import AVLTreeVisualizer from '@/components/visualizer/AVLTreeVisualizer';
import { RQ2Response } from '@/types/dsa';

export default function RQ2Page() {
  const [currentDate, setCurrentDate] = useState('2026-10-02');
  const [data, setData] = useState<RQ2Response | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchRQ2 = (d: string) => {
    setLoading(true);
    fetch(`/api/bridge?mode=rq2&date=${encodeURIComponent(d)}`)
      .then((res) => res.json())
      .then((resData: RQ2Response) => {
        setData(resData);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchRQ2(currentDate);
  }, []);

  const sampleDates = [
    { label: 'Hôm nay (2026-10-02)', date: '2026-10-02' },
    { label: '2026-09-27', date: '2026-09-27' },
    { label: '2026-09-20', date: '2026-09-20' },
  ];

  return (
    <div className="w-full space-y-5">
      {/* Top Criteria & Mode Selector */}
      <RequirementBanner />
      <ModeSelector />

      {/* Module Header */}
      <ModuleHeader
        moduleCode="RQ2"
        dsaName="AVL TREE"
        title="Theo dõi tài liệu quá hạn"
        description="Truy vấn khoảng (Range Query) các phiếu mượn có hạn trả trước mốc thời gian chỉ định thông qua cơ chế tỉa nhánh cây tự cân bằng."
        complexityLabel="Range Query"
        complexityValue="O(log n + k)"
        childrenRight={
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={currentDate}
                onChange={(e) => {
                  setCurrentDate(e.target.value);
                  fetchRQ2(e.target.value);
                }}
                className="px-3 py-1.5 rounded-lg border border-gray-300 text-gray-900 text-xs focus:outline-none focus:border-emerald-500 font-mono font-medium"
              />
              <button
                onClick={() => fetchRQ2(currentDate)}
                disabled={loading}
                className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs transition-colors flex items-center gap-1.5"
              >
                <FontAwesomeIcon icon={faCalendarAlt} />
                <span>{loading ? 'Đang kiểm...' : 'Kiểm tra'}</span>
              </button>
            </div>

            {/* Quick Sample Dates */}
            <div className="flex items-center gap-1 flex-wrap">
              <span className="text-[11px] text-gray-500 font-medium">Mốc ngày:</span>
              {sampleDates.map((d) => (
                <button
                  key={d.date}
                  onClick={() => {
                    setCurrentDate(d.date);
                    fetchRQ2(d.date);
                  }}
                  className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors ${
                    currentDate === d.date
                      ? 'bg-emerald-600 text-white font-bold'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {d.label}
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
            title="TRAVERSAL TIME"
            value={`${data.optimized.execution_time_ns} ns`}
            subtitle="Native C++ Engine"
            icon={faBolt}
          />
          <MetricCard
            title="VISITED NODES"
            value={`${data.optimized.checks ?? 0} nút`}
            subtitle="Tỉa nhánh cây AVL O(log n)"
            icon={faCodeBranch}
          />
          <MetricCard
            title="BASELINE SCANS"
            value={`${data.baseline.checks ?? 10} phiếu`}
            subtitle="Linear Overdue Scan O(n)"
            icon={faClock}
          />
          <MetricCard
            title="MATCHED OVERDUE (K)"
            value={`${data.overdue_records.length} phiếu`}
            subtitle={`Hạn trước ${data.current_date}`}
            icon={faTriangleExclamation}
          />
        </div>
      )}

      {/* AVL Tree Visualizer */}
      {data && (
        <AVLTreeVisualizer
          currentDate={data.current_date}
          overdueRecords={data.overdue_records}
        />
      )}

      {/* Overdue Records Result Table */}
      {data && (
        <div className="p-5 rounded-xl bg-white border border-gray-200 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-gray-100">
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <FontAwesomeIcon icon={faTriangleExclamation} className="text-rose-600" />
              Danh Sách Phiếu Mượn Quá Hạn ({data.overdue_records.length} phiếu)
            </h3>
            <span className="text-xs font-mono text-gray-500">
              Query: dueDate &lt; {data.current_date}
            </span>
          </div>

          {data.overdue_records.length === 0 ? (
            <div className="p-6 text-center text-gray-500 bg-gray-50 rounded-lg">
              <FontAwesomeIcon icon={faCheckCircle} className="text-emerald-500 text-2xl mb-1" />
              <div className="text-xs font-semibold text-gray-800">Không có phiếu quá hạn</div>
              <div className="text-[11px] text-gray-500">Toàn bộ độc giả đã trả sách hoặc chưa đến hạn trả tính đến ngày {data.current_date}.</div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-gray-200 text-gray-500 uppercase">
                    <th className="py-2.5 px-3">Mã Phiếu</th>
                    <th className="py-2.5 px-3">Mã Độc Giả</th>
                    <th className="py-2.5 px-3">Mã Sách</th>
                    <th className="py-2.5 px-3">Ngày Mượn</th>
                    <th className="py-2.5 px-3">Hạn Trả</th>
                    <th className="py-2.5 px-3 text-center">Trạng Thái</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {data.overdue_records.map((r) => (
                    <tr key={r.borrow_id} className="hover:bg-gray-50">
                      <td className="py-2.5 px-3 font-mono font-bold text-rose-700">{r.borrow_id}</td>
                      <td className="py-2.5 px-3 font-mono text-gray-700">{r.reader_id}</td>
                      <td className="py-2.5 px-3 font-mono text-blue-700">{r.book_id}</td>
                      <td className="py-2.5 px-3 text-gray-600">{r.borrow_date}</td>
                      <td className="py-2.5 px-3 font-mono font-bold text-gray-900">{r.due_date}</td>
                      <td className="py-2.5 px-3 text-center">
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                          {r.status} (QUÁ HẠN)
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Benchmark & Complexity */}
      {data && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <ComparisonTable
              baselineName="Linear Overdue Scan (Quét tuyến tính toàn bộ phiếu)"
              optimizedName="AVL Tree Range Query (Cây tự cân bằng tỉa nhánh)"
              baseline={data.baseline}
              optimized={data.optimized}
              stepLabel="Số lượt kiểm tra phiếu / nút cây"
            />
          </div>
          <div className="lg:col-span-1">
            <ComplexityCard
              averageTime="Search Boundary: O(log n)"
              worstTime="Output: O(k)"
              spaceComplexity="O(n) AVL Nodes"
              notes="Định vị biên ngày quá hạn trong O(log n), sau đó duyệt cây In-Order lấy K phiếu quá hạn trong O(k). Tổng chi phí O(log n + k)."
            />
          </div>
        </div>
      )}
    </div>
  );
}
