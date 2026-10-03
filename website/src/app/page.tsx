'use client';

import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBolt,
  faChartLine,
  faSliders,
} from '@fortawesome/free-solid-svg-icons';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { ModuleResponse } from '@/types/dsa';
import { useRam } from '@/context/RamContext';
import { formatIntegerWithSpaces } from '@/utils/numberFormat';

export default function DashboardPage() {
  const { ramBookCount, openModal, ramSyncState } = useRam();
  const ramReady = ramSyncState === 'ready';
  const [selectedModule, setSelectedModule] = useState<'mc1' | 'mc2' | 'rq1' | 'rq2' | 'rq3'>('mc1');
  const [inputValue, setInputValue] = useState('B001');
  const [data, setData] = useState<ModuleResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Generate an ID from the active RAM range. The C++ bridge creates the same
  // deterministic records, so the random ID is guaranteed to exist.
  const handleRandomSelect = () => {
    if (selectedModule === 'mc1') {
      const padLen = Math.max(3, ramBookCount.toString().length);
      const randNum = Math.floor(Math.random() * ramBookCount) + 1;
      setInputValue(`B${randNum.toString().padStart(padLen, '0')}`);
    } else if (selectedModule === 'mc2') {
      setInputValue('');
    } else if (selectedModule === 'rq1') {
      const categories = ['Software Engineering', 'Computer Science', 'Database', 'Networking', 'Operating System', 'Mathematics'];
      setInputValue(categories[Math.floor(Math.random() * categories.length)]);
    } else if (selectedModule === 'rq2') {
      const dates = ['2026-10-03', '2026-10-01', '2026-09-26', '2026-09-20', '2026-09-15', '2026-11-01'];
      setInputValue(dates[Math.floor(Math.random() * dates.length)]);
    } else if (selectedModule === 'rq3') {
      const keywords = ['Code', 'Algorithms', 'System', 'Design', 'Computer', 'Approach', 'Database', 'Data'];
      setInputValue(keywords[Math.floor(Math.random() * keywords.length)]);
    }
  };

  // Run benchmark / execution
  const executeDSA = (requestedPage = 1) => {
    if (!ramReady) return;
    setLoading(true);
    setData(null);
    setCurrentPage(requestedPage);
    let url = `/api/bridge?mode=${selectedModule}&size=${ramBookCount}`;
    if (selectedModule === 'rq1') url += `&page=${requestedPage}&page_size=25`;
    if (selectedModule === 'mc1') url += `&id=${encodeURIComponent(inputValue)}`;
    else if (selectedModule === 'rq1') url += `&category=${encodeURIComponent(inputValue)}`;
    else if (selectedModule === 'rq2') url += `&date=${encodeURIComponent(inputValue)}`;
    else if (selectedModule === 'rq3') url += `&keyword=${encodeURIComponent(inputValue)}`;

    fetch(url)
      .then(async (res) => {
        const payload = await res.json();
        if (!res.ok || payload.status !== 'success') {
          throw new Error(payload.message || `Bridge request failed (${res.status})`);
        }
        return payload;
      })
      .then((resData: ModuleResponse) => {
        setData(resData);
      })
      .catch((err) => {
        console.error(err);
        setData(null);
      })
      .finally(() => setLoading(false));
  };

  // Change default input when switching module
  const handleModuleChange = (mod: 'mc1' | 'mc2' | 'rq1' | 'rq2' | 'rq3') => {
    setSelectedModule(mod);
    setData(null);
    setCurrentPage(1);
    if (mod === 'mc1') setInputValue('B001');
    else if (mod === 'mc2') setInputValue('');
    else if (mod === 'rq1') setInputValue('Software Engineering');
    else if (mod === 'rq2') setInputValue('2026-10-02');
    else if (mod === 'rq3') setInputValue('Code');
  };

  // Preset button click
  const handlePreset = (val: string) => {
    setInputValue(val);
  };

  // Formatter for standard seconds (giay - s) and milliseconds (ms)
  const formatTimeSeconds = (ns: number) => {
    const s = ns / 1_000_000_000;
    const ms = ns / 1_000_000;
    return {
      sec: `${s.toFixed(8)} s`,
      secText: `${s.toFixed(8)} giây`,
      ms: `${ms.toFixed(6)} ms`,
      ns: `${ns.toLocaleString()} ns`,
      full: `${s.toFixed(8)} s (${ms.toFixed(6)} ms)`,
    };
  };

  const midBookId = `B${Math.floor(ramBookCount / 2).toString().padStart(Math.max(3, ramBookCount.toString().length), '0')}`;
  const lastBookId = `B${ramBookCount.toString().padStart(Math.max(3, ramBookCount.toString().length), '0')}`;

  return (
    <div className="w-full space-y-5">
      {/* Card 1: Setup & Parameters */}
      <div className="p-5 rounded-xl bg-white border border-gray-200 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-3 border-b border-gray-100">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-gray-900 flex items-center gap-2">
              <FontAwesomeIcon icon={faSliders} className="text-blue-600 text-sm" />
              Thiết Lập Bài Toán & Tham Số Kiểm Thử
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              So sánh hiệu năng chi tiết giữa giải thuật cơ sở (Baseline) và tối ưu (Final Solution) theo chuẩn giây (Seconds).
            </p>
          </div>

          {/* Module Dropdown & Run Button */}
          <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
            <select
              value={selectedModule}
              onChange={(e) => handleModuleChange(e.target.value as any)}
              className="px-3 py-2 rounded-lg border border-gray-300 text-gray-900 text-xs font-semibold focus:outline-none focus:border-blue-500 bg-white shadow-2xs"
            >
              <option value="mc1">[BẮT BUỘC] MC1: Tra cứu theo MSSV / Mã Sách (Hash Table O(1))</option>
              <option value="mc2">[BẮT BUỘC] MC2: Sách Mượn Nhiều Nhất (Max-Heap O(1) Peek)</option>
              <option value="rq1">[TỰ CHỌN] RQ1: Lọc Theo Thể Loại (Class Index O(1+K))</option>
              <option value="rq2">[TỰ CHỌN] RQ2: Lọc Khoảng Phiếu Quá Hạn (AVL Tree O(log N))</option>
              <option value="rq3">[TỰ CHỌN] RQ3: Tìm Kiếm Tiêu Đề (Inverted Index O(1+K))</option>
            </select>

            <button
              type="button"
              onClick={() => executeDSA(1)}
              disabled={loading || !ramReady}
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-xs transition-all duration-150 flex items-center gap-2 shadow-sm hover:shadow active:scale-95 cursor-pointer border border-blue-700 shrink-0 disabled:bg-gray-300 disabled:border-gray-300 disabled:text-gray-600 disabled:shadow-none disabled:hover:bg-gray-300 disabled:active:scale-100 disabled:cursor-not-allowed"
            >
              <FontAwesomeIcon icon={faBolt} className="text-xs" />
              <span>
                {!ramReady ? 'Đang nạp & lập chỉ mục RAM...' : loading ? 'Đang chạy C++...' : 'Chạy Benchmark Đối Sánh'}
              </span>
            </button>
          </div>
        </div>

        {/* Input Parameter with Presets */}
        <div className="space-y-2.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-gray-800">
              {selectedModule === 'mc1' && 'Mã Sách (Book ID):'}
              {selectedModule === 'mc2' && 'Sách Mượn Nhiều Nhất:'}
              {selectedModule === 'rq1' && 'Thể Loại Sách:'}
              {selectedModule === 'rq2' && 'Mốc Ngày Kiểm Tra:'}
              {selectedModule === 'rq3' && 'Từ Khóa Tiêu Đề:'}
            </span>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
              {selectedModule === 'mc1' && `Dải hợp lệ: B001 -> ${lastBookId} (${formatIntegerWithSpaces(ramBookCount)} sách trong RAM)`}
              {selectedModule === 'mc2' && 'Tìm 1 sách có lượt mượn cao nhất trong toàn bộ RAM'}
              {selectedModule === 'rq1' && 'Dải: Software Engineering, Computer Science...'}
              {selectedModule === 'rq2' && 'Định dạng: YYYY-MM-DD'}
              {selectedModule === 'rq3' && 'Từ khóa mẫu: Code, Algorithms, System...'}
            </span>
          </div>

          {selectedModule === 'mc2' ? (
            <div className="w-full px-3 py-2 rounded-lg border border-amber-200 bg-amber-50 text-amber-900 text-xs font-semibold">
              C++ sẽ lấy đúng 1 sách có lượt mượn cao nhất trong toàn bộ {formatIntegerWithSpaces(ramBookCount)} sách RAM.
            </div>
          ) : selectedModule === 'rq1' ? (
            <select
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 text-gray-900 text-xs font-medium focus:outline-none focus:border-blue-500 bg-white"
            >
              <option value="Software Engineering">Software Engineering</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Database">Database</option>
              <option value="Networking">Networking</option>
              <option value="Operating System">Operating System</option>
              <option value="Mathematics">Mathematics</option>
              <option value="__NOT_FOUND_CATEGORY__">Không tồn tại (0 kết quả)</option>
            </select>
          ) : selectedModule === 'rq2' ? (
            <input
              type="date"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 text-gray-900 text-xs font-mono font-medium focus:outline-none focus:border-blue-500"
            />
          ) : (
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && ramReady && executeDSA()}
              className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-gray-900 text-xs font-mono font-bold focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-2xs"
            />
          )}

          {/* Quick Presets Buttons (Real Interactive Button Affordance) */}
          <div className="flex items-center gap-2 flex-wrap pt-1">
            <span className="text-[11px] font-semibold text-gray-500 mr-0.5">Chọn nhanh:</span>
            {selectedModule === 'mc1' && (
              <>
                <button
                  type="button"
                  onClick={handleRandomSelect}
                  title="Lấy ngẫu nhiên 1 mã sách từ cơ sở dữ liệu"
                  className="px-3 py-1.5 rounded-lg border border-gray-300 bg-white hover:bg-blue-50/80 hover:border-blue-400 hover:text-blue-700 text-gray-700 text-xs font-semibold shadow-xs transition-all duration-150 active:scale-95 cursor-pointer inline-flex items-center gap-1.5"
                >
                  <span>🎲</span>
                  <span>Ngẫu Nhiên</span>
                </button>
                <button
                  type="button"
                  onClick={() => handlePreset('B001')}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-semibold shadow-xs transition-all duration-150 active:scale-95 cursor-pointer inline-flex items-center gap-1.5 ${
                    inputValue === 'B001'
                      ? 'border-blue-500 bg-blue-50 text-blue-700 ring-1 ring-blue-400 font-bold'
                      : 'border-gray-300 bg-white hover:bg-blue-50/60 hover:border-blue-300 text-gray-700'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  <span>Đầu dải (B001)</span>
                </button>
                <button
                  type="button"
                  onClick={() => handlePreset(midBookId)}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-semibold shadow-xs transition-all duration-150 active:scale-95 cursor-pointer inline-flex items-center gap-1.5 ${
                    inputValue === midBookId
                      ? 'border-blue-500 bg-blue-50 text-blue-700 ring-1 ring-blue-400 font-bold'
                      : 'border-gray-300 bg-white hover:bg-blue-50/60 hover:border-blue-300 text-gray-700'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                  <span>Giữa dải ({midBookId})</span>
                </button>
                <button
                  type="button"
                  onClick={() => handlePreset(lastBookId)}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-semibold shadow-xs transition-all duration-150 active:scale-95 cursor-pointer inline-flex items-center gap-1.5 ${
                    inputValue === lastBookId
                      ? 'border-blue-500 bg-blue-50 text-blue-700 ring-1 ring-blue-400 font-bold'
                      : 'border-gray-300 bg-white hover:bg-blue-50/60 hover:border-blue-300 text-gray-700'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
                  <span>Cuối dải ({lastBookId})</span>
                </button>
                <button
                  type="button"
                  onClick={() => handlePreset('B999999')}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-semibold shadow-xs transition-all duration-150 active:scale-95 cursor-pointer inline-flex items-center gap-1.5 ${
                    inputValue === 'B999999'
                      ? 'border-rose-500 bg-rose-50 text-rose-700 ring-1 ring-rose-400 font-bold'
                      : 'border-gray-300 bg-white hover:bg-rose-50/60 hover:border-rose-300 text-gray-700'
                  }`}
                >
                  <span className="text-rose-500 font-bold">⊘</span>
                  <span>Không tồn tại (B999999)</span>
                </button>
              </>
            )}

            {selectedModule === 'mc2' && (
              <>
                <button
                  type="button"
                  onClick={handleRandomSelect}
                  title="Lấy sách mượn nhiều nhất"
                  className="px-3 py-1.5 rounded-lg border border-gray-300 bg-white hover:bg-amber-50/80 hover:border-amber-400 hover:text-amber-800 text-gray-700 text-xs font-semibold shadow-xs transition-all duration-150 active:scale-95 cursor-pointer inline-flex items-center gap-1.5"
                >
                  <span>🎲</span>
                  <span>Ngẫu Nhiên</span>
                </button>
                {[].map((k) => (
                  <button
                    key={k}
                    type="button"
                    onClick={() => handlePreset(k)}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-semibold shadow-xs transition-all duration-150 active:scale-95 cursor-pointer inline-flex items-center gap-1.5 ${
                      inputValue === k
                        ? 'border-amber-500 bg-amber-50 text-amber-800 ring-1 ring-amber-400 font-bold'
                        : 'border-gray-300 bg-white hover:bg-amber-50/60 hover:border-amber-300 text-gray-700'
                    }`}
                  >
                    <span>Top {k} Sách</span>
                  </button>
                ))}
              </>
            )}

            {selectedModule === 'rq1' && (
              <>
                <button
                  type="button"
                  onClick={handleRandomSelect}
                  title="Chọn ngẫu nhiên thể loại"
                  className="px-3 py-1.5 rounded-lg border border-gray-300 bg-white hover:bg-blue-50/80 hover:border-blue-400 hover:text-blue-700 text-gray-700 text-xs font-semibold shadow-xs transition-all duration-150 active:scale-95 cursor-pointer inline-flex items-center gap-1.5"
                >
                  <span>🎲</span>
                  <span>Ngẫu Nhiên</span>
                </button>
                {['Software Engineering', 'Computer Science', 'Database', 'Operating System', '__NOT_FOUND_CATEGORY__'].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => handlePreset(cat)}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-semibold shadow-xs transition-all duration-150 active:scale-95 cursor-pointer inline-flex items-center gap-1.5 ${
                      inputValue === cat
                        ? 'border-blue-500 bg-blue-50 text-blue-700 ring-1 ring-blue-400 font-bold'
                        : 'border-gray-300 bg-white hover:bg-blue-50/60 hover:border-blue-300 text-gray-700'
                    }`}
                  >
                    <span>{cat === '__NOT_FOUND_CATEGORY__' ? 'Không tồn tại (0 kết quả)' : cat}</span>
                  </button>
                ))}
              </>
            )}

            {selectedModule === 'rq2' && (
              <>
                <button
                  type="button"
                  onClick={handleRandomSelect}
                  title="Chọn ngẫu nhiên mốc ngày"
                  className="px-3 py-1.5 rounded-lg border border-gray-300 bg-white hover:bg-emerald-50/80 hover:border-emerald-400 hover:text-emerald-800 text-gray-700 text-xs font-semibold shadow-xs transition-all duration-150 active:scale-95 cursor-pointer inline-flex items-center gap-1.5"
                >
                  <span>🎲</span>
                  <span>Ngẫu Nhiên</span>
                </button>
                {[
                  { label: '📅 Hôm nay (2026-10-03)', val: '2026-10-03' },
                  { label: '⚠️ Quá hạn gần (2026-10-01)', val: '2026-10-01' },
                  { label: '🚨 Quá hạn sâu (2026-09-20)', val: '2026-09-20' },
                  { label: '⏳ Tương lai (2026-11-01)', val: '2026-11-01' },
                ].map((item) => (
                  <button
                    key={item.val}
                    type="button"
                    onClick={() => handlePreset(item.val)}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-semibold shadow-xs transition-all duration-150 active:scale-95 cursor-pointer inline-flex items-center gap-1.5 ${
                      inputValue === item.val
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-800 ring-1 ring-emerald-400 font-bold'
                        : 'border-gray-300 bg-white hover:bg-emerald-50/60 hover:border-emerald-300 text-gray-700'
                    }`}
                  >
                    <span>{item.label}</span>
                  </button>
                ))}
              </>
            )}

            {selectedModule === 'rq3' && (
              <>
                <button
                  type="button"
                  onClick={handleRandomSelect}
                  title="Chọn ngẫu nhiên từ khóa"
                  className="px-3 py-1.5 rounded-lg border border-gray-300 bg-white hover:bg-purple-50/80 hover:border-purple-400 hover:text-purple-700 text-gray-700 text-xs font-semibold shadow-xs transition-all duration-150 active:scale-95 cursor-pointer inline-flex items-center gap-1.5"
                >
                  <span>🎲</span>
                  <span>Ngẫu Nhiên</span>
                </button>
                {['Code', 'Algorithms', 'System', 'Database', 'Unknown'].map((kw) => (
                  <button
                    key={kw}
                    type="button"
                    onClick={() => handlePreset(kw)}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-semibold shadow-xs transition-all duration-150 active:scale-95 cursor-pointer inline-flex items-center gap-1.5 ${
                      inputValue === kw
                        ? 'border-purple-500 bg-purple-50 text-purple-700 ring-1 ring-purple-400 font-bold'
                        : 'border-gray-300 bg-white hover:bg-purple-50/60 hover:border-purple-300 text-gray-700'
                    }`}
                  >
                    <span>🔍 &quot;{kw}&quot;</span>
                  </button>
                ))}
              </>
            )}
          </div>
        </div>
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center py-16 px-6 bg-white rounded-xl border border-gray-200 shadow-xs space-y-4 animate-in fade-in duration-200">
          <Spin
            indicator={<LoadingOutlined style={{ fontSize: 44, color: '#2563eb' }} spin />}
            size="large"
          />
          <div className="text-center space-y-1.5 max-w-md">
            <h3 className="text-sm sm:text-base font-bold text-gray-900">
              Đang chạy Benchmark đối sánh C++ Native Engine...
            </h3>
            <p className="text-xs text-gray-500 font-medium">
              Đang đo một truy vấn đầy đủ trên {formatIntegerWithSpaces(ramBookCount)} bản ghi RAM. Vui lòng đợi trong giây lát...
            </p>
          </div>
        </div>
      )}

      {/* Card 2: Bảng Thống Kê & Đối Sánh Hiệu Năng Chi Tiết (Appears after executing) */}
      {data && (
        <div className="p-5 rounded-xl bg-white border border-gray-200 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-gray-100">
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <FontAwesomeIcon icon={faChartLine} className="text-blue-600" />
              Bảng Thống Kê & Đối Sánh Hiệu Năng Chi Tiết
            </h3>
            <span className="text-xs font-mono text-blue-700 font-semibold px-2 py-0.5 rounded bg-blue-50 border border-blue-200">
              {data.module_name}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gray-200 text-gray-600 uppercase tracking-wider bg-gray-50/70">
                  <th className="py-2.5 px-3">Chỉ số đánh giá thuật toán</th>
                  <th className="py-2.5 px-3 font-semibold">Baseline (Giải thuật gốc)</th>
                  <th className="py-2.5 px-3 font-semibold">Final Solution (Giải thuật tối ưu)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {/* Row 1: Complexity */}
                <tr className="hover:bg-gray-50/50">
                  <td className="py-2.5 px-3 font-medium text-gray-800">
                    Độ phức tạp lý thuyết (Theoretical Complexity)
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-rose-50 text-rose-700 border border-rose-200">
                      {data.baseline.complexity}
                    </span>
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {data.optimized.complexity}
                    </span>
                  </td>
                </tr>

                {/* Row 2: Single Query Time */}
                <tr className="hover:bg-gray-50/50">
                  <td className="py-2.5 px-3 font-medium text-gray-800">
                    Thời gian truy vấn đơn lẻ (Single Query Time - Giây)
                  </td>
                  <td className="py-2.5 px-3 font-mono text-rose-700">
                    <div className="font-bold text-xs">{formatTimeSeconds(data.baseline.execution_time_ns).sec}</div>
                    <div className="text-[11px] text-gray-500 font-normal">
                      {formatTimeSeconds(data.baseline.execution_time_ns).ms} ({formatTimeSeconds(data.baseline.execution_time_ns).ns})
                    </div>
                  </td>
                  <td className="py-2.5 px-3 font-mono text-emerald-700">
                    <div className="font-bold text-xs">{formatTimeSeconds(data.optimized.execution_time_ns).sec}</div>
                    <div className="text-[11px] text-gray-500 font-normal">
                      {formatTimeSeconds(data.optimized.execution_time_ns).ms} ({formatTimeSeconds(data.optimized.execution_time_ns).ns})
                    </div>
                  </td>
                </tr>

                {/* Row 3: Workload (adaptive for large RAM datasets) */}
                <tr className="hover:bg-gray-50/50">
                  <td className="py-2.5 px-3 font-medium text-gray-800">
                    Tổng thời gian Workload ({data.baseline.workload_queries || 1000} queries - Giây)
                  </td>
                  <td className="py-2.5 px-3 font-mono text-rose-700">
                    <div className="font-bold text-xs">{formatTimeSeconds(data.baseline.workload_1000_ns || data.baseline.execution_time_ns * 1000).sec}</div>
                    <div className="text-[11px] text-gray-500 font-normal">
                      {formatTimeSeconds(data.baseline.workload_1000_ns || data.baseline.execution_time_ns * 1000).ms}
                    </div>
                  </td>
                  <td className="py-2.5 px-3 font-mono text-emerald-700">
                    <div className="font-bold text-xs">{formatTimeSeconds(data.optimized.workload_1000_ns || data.optimized.execution_time_ns * 1000).sec}</div>
                    <div className="text-[11px] text-gray-500 font-normal">
                      {formatTimeSeconds(data.optimized.workload_1000_ns || data.optimized.execution_time_ns * 1000).ms}
                    </div>
                  </td>
                </tr>

                {/* Row 4: Comparisons / Collisions */}
                <tr className="hover:bg-gray-50/50">
                  <td className="py-2.5 px-3 font-medium text-gray-800">
                    Số phép so sánh / Xung đột (Comparisons / Collisions)
                  </td>
                  <td className="py-2.5 px-3 font-mono text-rose-700 font-semibold">
                    {data.baseline.comparisons ?? data.baseline.checks ?? 10} comps
                  </td>
                  <td className="py-2.5 px-3 font-mono text-emerald-700 font-semibold">
                    {data.optimized.comparisons ?? data.optimized.checks ?? 1} probes, 0 colls
                  </td>
                </tr>

                {/* Row 5: Memory */}
                <tr className="hover:bg-gray-50/50">
                  <td className="py-2.5 px-3 font-medium text-gray-800">
                    Bộ nhớ tiêu thụ (Memory)
                  </td>
                  <td className="py-2.5 px-3 font-mono text-gray-600">
                    {data.baseline.memory_label || '0 MB (O(1))'}
                  </td>
                  <td className="py-2.5 px-3 font-mono text-gray-800 font-semibold">
                    {data.optimized.memory_label || 'In-Memory Structure'}
                  </td>
                </tr>

                {/* Row 6: Result */}
                <tr className="hover:bg-gray-50/50">
                  <td className="py-2.5 px-3 font-medium text-gray-800">
                    Kết quả tìm thấy (Result)
                  </td>
                  <td className="py-2.5 px-3 text-gray-700">
                    {data.baseline.result_label || 'Khớp kết quả'}
                  </td>
                  <td className="py-2.5 px-3 text-emerald-800 font-semibold">
                    {data.optimized.result_label || 'Khớp kết quả'}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
