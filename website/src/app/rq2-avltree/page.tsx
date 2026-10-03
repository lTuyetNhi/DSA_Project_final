'use client';

import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCodeBranch,
  faCalendarAlt,
  faTriangleExclamation,
  faRotateRight,
  faBolt,
  faCheckCircle,
  faClock,
} from '@fortawesome/free-solid-svg-icons';
import ComparisonTable from '@/components/ui/ComparisonTable';
import MetricCard from '@/components/ui/MetricCard';
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

  const sampleDates = ['2026-10-02', '2026-09-27', '2026-09-20', '2026-08-01'];

  const rotations = [
    { code: 'LL', name: 'Quay Đơn Phải (Right Rotation)', desc: 'Nút mất cân bằng lệch Trái-Trái (BF = +2, con trái BF = +1).' },
    { code: 'RR', name: 'Quay Đơn Trái (Left Rotation)', desc: 'Nút mất cân bằng lệch Phải-Phải (BF = -2, con phải BF = -1).' },
    { code: 'LR', name: 'Quay Kép Trái-Phải (Left-Right Rotation)', desc: 'Quay Trái tại con trái rồi Quay Phải tại nút gốc mất cân bằng.' },
    { code: 'RL', name: 'Quay Kép Phải-Trái (Right-Left Rotation)', desc: 'Quay Phải tại con phải rồi Quay Trái tại nút gốc mất cân bằng.' },
  ];

  return (
    <div className="w-full space-y-6">
      {/* Module Header */}
      <div className="p-6 rounded-xl bg-white border border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-block px-2.5 py-0.5 rounded text-xs font-semibold bg-rose-50 text-rose-800 border border-rose-200 mb-2">
              Module RQ2 — Cây tự cân bằng AVL (Adelson-Velsky & Landis)
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              Truy Vết Phiếu Quá Hạn Trong O(log N + K)
            </h1>
            <p className="text-xs text-gray-600 mt-1 max-w-2xl">
              Tổ chức phiếu mượn theo ngày hẹn trả (`due_date`). Chiều cao cây luôn đảm bảo $h \le 1.44 \log_2 N$ nhờ 4 phép quay cân bằng.
            </p>
          </div>

          {/* Date Picker */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={currentDate}
                onChange={(e) => {
                  setCurrentDate(e.target.value);
                  fetchRQ2(e.target.value);
                }}
                className="px-3 py-1.5 rounded-lg border border-gray-300 text-gray-900 text-xs focus:outline-none focus:border-rose-500 font-mono"
              />
              <button
                onClick={() => fetchRQ2(currentDate)}
                disabled={loading}
                className="px-4 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-medium text-xs transition-colors flex items-center gap-1.5"
              >
                <FontAwesomeIcon icon={faCalendarAlt} />
                <span>Kiểm tra</span>
              </button>
            </div>

            {/* Quick Dates */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] text-gray-500">Ngày mẫu:</span>
              {sampleDates.map((d) => (
                <button
                  key={d}
                  onClick={() => {
                    setCurrentDate(d);
                    fetchRQ2(d);
                  }}
                  className={`px-2 py-0.5 rounded text-xs font-mono transition-colors ${
                    currentDate === d
                      ? 'bg-rose-600 text-white font-bold'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {d}
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
            title="Thời gian duyệt Cây AVL"
            value={data.optimized.execution_time_ns}
            unit="ns"
            subtitle="Đo trực tiếp từ C++ Engine"
            icon={faBolt}
          />
          <MetricCard
            title="Số nút cây duyệt (DSA)"
            value={data.optimized.checks ?? 0}
            unit="nút"
            subtitle="Tỉa nhánh bỏ qua các nút không quá hạn"
            icon={faCodeBranch}
          />
          <MetricCard
            title="Số phiếu quét (Baseline)"
            value={data.baseline.checks ?? 10}
            unit="phiếu"
            subtitle="Duyệt qua toàn bộ N phiếu mượn"
            icon={faClock}
          />
          <MetricCard
            title="Số phiếu quá hạn"
            value={data.overdue_records.length}
            unit="phiếu"
            subtitle={`Hạn trước ${data.current_date}`}
            icon={faTriangleExclamation}
          />
        </div>
      )}

      {/* 4 Rotations Box */}
      <div className="p-5 rounded-xl bg-white border border-gray-200 space-y-3">
        <div className="flex items-center justify-between pb-3 border-b border-gray-200">
          <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
            <FontAwesomeIcon icon={faRotateRight} className="text-rose-600" />
            4 Phép Quay Cân Bằng Cây AVL Chuẩn Hóa
          </h3>
          <span className="text-xs font-mono px-2 py-0.5 rounded bg-gray-100 text-gray-700 border border-gray-200">
            BF = Height(L) - Height(R) ∈ &#123;-1, 0, 1&#125;
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {rotations.map((r) => (
            <div key={r.code} className="p-3 rounded-lg bg-gray-50 border border-gray-200 space-y-1">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-white text-rose-700 border border-rose-200">
                  {r.code}
                </span>
                <span className="text-[10px] text-gray-500">O(1)</span>
              </div>
              <h4 className="text-xs font-bold text-gray-900">{r.name}</h4>
              <p className="text-[11px] text-gray-500 leading-relaxed">{r.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Comparison Table */}
      {data && (
        <ComparisonTable
          baselineName="Quét Tuyến Tính Toàn Bộ Phiếu (Linear Overdue Scan)"
          optimizedName="Cây Tự Cân Bằng AVL (AVL Tree Range Query)"
          baseline={data.baseline}
          optimized={data.optimized}
          stepLabel="Số lượt kiểm tra phiếu / nút cây"
        />
      )}

      {/* Overdue Records Table */}
      {data && (
        <div className="p-5 rounded-xl bg-white border border-gray-200 space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-gray-200">
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <FontAwesomeIcon icon={faTriangleExclamation} className="text-rose-600" />
              Danh Sách Phiếu Mượn Quá Hạn ({data.overdue_records.length} phiếu)
            </h3>
            <span className="text-xs font-mono text-gray-500">
              Độ phức tạp: O(log N + K)
            </span>
          </div>

          {data.overdue_records.length === 0 ? (
            <div className="p-6 text-center text-gray-500 bg-gray-50 rounded-lg">
              <FontAwesomeIcon icon={faCheckCircle} className="text-emerald-500 text-2xl mb-1" />
              <div className="text-xs font-semibold text-gray-800">Không có phiếu quá hạn</div>
              <div className="text-[11px] text-gray-500">Tất cả độc giả đã trả sách hoặc chưa đến hạn trả tính đến ngày {data.current_date}.</div>
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
    </div>
  );
}
