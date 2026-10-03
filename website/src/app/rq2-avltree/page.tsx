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
  faShieldHalved,
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
    { code: 'LL', name: 'Quay Đơn Phải (Right Rotation)', desc: 'Khi nút mất cân bằng lệch Trái-Trái (BF = +2, con trái BF = +1).' },
    { code: 'RR', name: 'Quay Đơn Trái (Left Rotation)', desc: 'Khi nút mất cân bằng lệch Phải-Phải (BF = -2, con phải BF = -1).' },
    { code: 'LR', name: 'Quay Kép Trái-Phải (Left-Right Rotation)', desc: 'Quay Trái tại con trái rồi Quay Phải tại nút gốc mất cân bằng.' },
    { code: 'RL', name: 'Quay Kép Phải-Trái (Right-Left Rotation)', desc: 'Quay Phải tại con phải rồi Quay Trái tại nút gốc mất cân bằng.' },
  ];

  return (
    <div className="w-full space-y-8">
      {/* Module Header */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-white/10 bg-gradient-to-br from-rose-950/40 via-gray-900/90 to-gray-950">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-semibold uppercase tracking-wider mb-3">
              <FontAwesomeIcon icon={faCodeBranch} />
              <span>Module RQ2 — Cây Tự Cân Bằng AVL (Adelson-Velsky & Landis)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Truy Vết Phiếu Quá Hạn & Tỉa Nhánh Cây Trong O(log N + K)
            </h1>
            <p className="text-sm text-gray-300 mt-1 max-w-2xl">
              Tổ chức phiếu mượn theo thứ tự ngày hết hạn (`due_date`). Chiều cao cây luôn đảm bảo $h \le 1.44 \log_2 N$ nhờ 4 phép quay cân bằng, triệt tiêu hoàn toàn nguy cơ suy thoái thành danh sách liên kết.
            </p>
          </div>

          {/* Date Picker Controls */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={currentDate}
                onChange={(e) => {
                  setCurrentDate(e.target.value);
                  fetchRQ2(e.target.value);
                }}
                className="px-4 py-2.5 rounded-xl bg-gray-900 border border-white/15 text-white text-sm focus:outline-none focus:border-rose-500 font-mono"
              />
              <button
                onClick={() => fetchRQ2(currentDate)}
                disabled={loading}
                className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-sm shadow-md shadow-rose-600/30 transition-all flex items-center gap-2"
              >
                <FontAwesomeIcon icon={faCalendarAlt} />
                <span>Kiểm tra</span>
              </button>
            </div>

            {/* Quick Sample Dates */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] text-gray-400">Ngày mẫu:</span>
              {sampleDates.map((d) => (
                <button
                  key={d}
                  onClick={() => {
                    setCurrentDate(d);
                    fetchRQ2(d);
                  }}
                  className={`px-2 py-0.5 rounded text-xs font-mono transition-all ${
                    currentDate === d
                      ? 'bg-rose-500 text-white font-bold'
                      : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {d}
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
            title="Thời Gian Duyệt Cây AVL"
            value={data.optimized.execution_time_ns}
            unit="nanoseconds"
            subtitle="Đo trực tiếp từ Native C++ Engine"
            icon={faBolt}
            variant="emerald"
          />
          <MetricCard
            title="Số Nút Cây Đã Duyệt (DSA)"
            value={data.optimized.checks ?? 0}
            unit="nút"
            subtitle="Cơ chế tỉa nhánh đã bỏ qua toàn bộ nút không quá hạn"
            icon={faCodeBranch}
            variant="indigo"
          />
          <MetricCard
            title="Số Phiếu Quét Tuyến Tính (Baseline)"
            value={data.baseline.checks ?? 10}
            unit="lần quét"
            subtitle="Phải duyệt qua toàn bộ N phiếu mượn"
            icon={faClock}
            variant="rose"
          />
          <MetricCard
            title="Số Phiếu Quá Hạn Lọc Được"
            value={data.overdue_records.length}
            unit="phiếu"
            subtitle={`Hạn trả trước ngày ${data.current_date}`}
            icon={faTriangleExclamation}
            variant={data.overdue_records.length > 0 ? 'rose' : 'emerald'}
          />
        </div>
      )}

      {/* 4 AVL Rotations Knowledge Visualizer */}
      <div className="glass-card p-6 rounded-2xl border border-white/10 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <FontAwesomeIcon icon={faRotateRight} className="text-rose-400" />
            Cơ Chế Tự Cân Bằng Với 4 Phép Quay Cây Chuẩn Hóa
          </h3>
          <span className="text-xs font-mono px-3 py-1 rounded-full bg-rose-500/10 text-rose-300 border border-rose-500/30">
            Hệ số cân bằng BF = Height(Left) - Height(Right) ∈ &#123;-1, 0, 1&#125;
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {rotations.map((r) => (
            <div key={r.code} className="p-4 rounded-xl bg-gray-900/80 border border-white/5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  {r.code}
                </span>
                <span className="text-[10px] text-gray-500 uppercase">Phép quay O(1)</span>
              </div>
              <h4 className="text-xs font-bold text-white">{r.name}</h4>
              <p className="text-[11px] text-gray-400 leading-relaxed">{r.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Live Benchmark Comparison Table */}
      {data && (
        <ComparisonTable
          baselineName="Quét Tuyến Tính Toàn Bộ Phiếu (Linear Overdue Scan)"
          optimizedName="Cây Tự Cân Bằng AVL (AVL Tree Range Query)"
          baseline={data.baseline}
          optimized={data.optimized}
          stepLabel="Số lượt kiểm tra phiếu / nút cây"
        />
      )}

      {/* Overdue Borrow Records Table */}
      {data && (
        <div className="glass-card p-6 rounded-2xl border border-white/10 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <FontAwesomeIcon icon={faTriangleExclamation} className="text-rose-400" />
              Danh Sách Phiếu Mượn Quá Hạn Tính Đến Ngày {data.current_date} ({data.overdue_records.length} phiếu)
            </h3>
            <span className="text-xs font-mono text-gray-400">
              Độ phức tạp truy vấn khoảng: O(log N + K)
            </span>
          </div>

          {data.overdue_records.length === 0 ? (
            <div className="p-8 text-center text-gray-400 bg-gray-900/40 rounded-xl border border-white/5">
              <FontAwesomeIcon icon={faCheckCircle} className="text-emerald-400 text-3xl mb-2" />
              <div className="text-sm font-semibold text-white">Không Có Phiếu Quá Hạn</div>
              <div className="text-xs text-gray-500 mt-1">Toàn bộ độc giả đều đã trả sách hoặc chưa đến hạn trả tính tới ngày {data.current_date}.</div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/10 text-gray-400 uppercase tracking-wider">
                    <th className="py-3 px-4">Mã Phiếu</th>
                    <th className="py-3 px-4">Mã Độc Giả</th>
                    <th className="py-3 px-4">Mã Sách</th>
                    <th className="py-3 px-4">Ngày Mượn</th>
                    <th className="py-3 px-4">Hạn Trả (Due Date)</th>
                    <th className="py-3 px-4 text-center">Trạng Thái</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {data.overdue_records.map((r) => (
                    <tr key={r.borrow_id} className="hover:bg-white/5 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-rose-400">{r.borrow_id}</td>
                      <td className="py-3 px-4 font-mono text-gray-300">{r.reader_id}</td>
                      <td className="py-3 px-4 font-mono text-indigo-300">{r.book_id}</td>
                      <td className="py-3 px-4 text-gray-400">{r.borrow_date}</td>
                      <td className="py-3 px-4 font-mono font-bold text-amber-300">{r.due_date}</td>
                      <td className="py-3 px-4 text-center">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
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
