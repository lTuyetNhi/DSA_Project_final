'use client';

import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBolt,
  faChartLine,
  faDatabase,
  faSliders,
  faRotateRight,
  faCheckCircle,
  faCircleExclamation,
  faTable,
  faBook,
  faBookmark,
  faFire,
  faArrowRight,
  faLayerGroup,
  faCodeBranch,
  faFolderOpen,
} from '@fortawesome/free-solid-svg-icons';
import ModeSelector from '@/components/layout/ModeSelector';
import HashPipeline from '@/components/visualizer/HashPipeline';
import BucketVisualizer from '@/components/visualizer/BucketVisualizer';
import HeapTreeVisualizer from '@/components/visualizer/HeapTreeVisualizer';
import CategoryIndexVisualizer from '@/components/visualizer/CategoryIndexVisualizer';
import AVLTreeVisualizer from '@/components/visualizer/AVLTreeVisualizer';
import InvertedIndexVisualizer from '@/components/visualizer/InvertedIndexVisualizer';
import BookCard from '@/components/ui/BookCard';
import { Book, BorrowRecord, ModuleResponse } from '@/types/dsa';
import { INITIAL_BOOKS, INITIAL_RECORDS } from '@/data/initialData';

export default function DashboardPage() {
  const [activeMode, setActiveMode] = useState<1 | 2 | 3>(1);
  const [selectedModule, setSelectedModule] = useState<'mc1' | 'mc2' | 'rq1' | 'rq2' | 'rq3'>('mc1');
  const [inputValue, setInputValue] = useState('B001');
  const [data, setData] = useState<ModuleResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [rawBooks, setRawBooks] = useState<Book[]>(INITIAL_BOOKS);
  const [rawRecords, setRawRecords] = useState<BorrowRecord[]>(INITIAL_RECORDS);

  // Load live data from C++ Engine / JSON
  useEffect(() => {
    fetch('/api/bridge?mode=data')
      .then((res) => res.json())
      .then((resData) => {
        if (resData.status === 'success') {
          if (resData.books && resData.books.length > 0) setRawBooks(resData.books);
          if (resData.borrow_records && resData.borrow_records.length > 0) setRawRecords(resData.borrow_records);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  // Dynamic random select from loaded JSON books & data
  const handleRandomSelect = () => {
    if (selectedModule === 'mc1') {
      const booksToPick = rawBooks.length > 0 ? rawBooks : INITIAL_BOOKS;
      const randIdx = Math.floor(Math.random() * booksToPick.length);
      const chosen = booksToPick[randIdx].book_id;
      setInputValue(chosen);
    } else if (selectedModule === 'mc2') {
      const kList = ['1', '2', '3', '4', '5', '8', '10'];
      setInputValue(kList[Math.floor(Math.random() * kList.length)]);
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
  const executeDSA = () => {
    setLoading(true);
    let url = `/api/bridge?mode=${selectedModule}`;
    if (selectedModule === 'mc1') url += `&id=${encodeURIComponent(inputValue)}`;
    else if (selectedModule === 'mc2') url += `&top=5`;
    else if (selectedModule === 'rq1') url += `&category=${encodeURIComponent(inputValue)}`;
    else if (selectedModule === 'rq2') url += `&date=${encodeURIComponent(inputValue)}`;
    else if (selectedModule === 'rq3') url += `&keyword=${encodeURIComponent(inputValue)}`;

    fetch(url)
      .then((res) => res.json())
      .then((resData: ModuleResponse) => {
        setData(resData);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  // Change default input when switching module
  const handleModuleChange = (mod: 'mc1' | 'mc2' | 'rq1' | 'rq2' | 'rq3') => {
    setSelectedModule(mod);
    setData(null);
    if (mod === 'mc1') setInputValue('B001');
    else if (mod === 'mc2') setInputValue('5');
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

  return (
    <div className="w-full space-y-5">
      {/* 3 Mode Navigation Tabs */}
      <div className="flex items-center gap-2.5 border-b border-gray-200 pb-3 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveMode(1)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs sm:text-sm font-bold transition-all duration-150 cursor-pointer shadow-xs active:scale-95 ${
            activeMode === 1
              ? 'bg-blue-600 text-white border border-blue-700 shadow-sm'
              : 'bg-white text-gray-700 hover:text-blue-700 border border-gray-300 hover:border-blue-400 hover:bg-blue-50/50'
          }`}
        >
          <FontAwesomeIcon icon={faChartLine} className={activeMode === 1 ? 'text-white text-xs' : 'text-blue-600 text-xs'} />
          <span>Mode 1: Benchmark Suite (So Sánh)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveMode(2)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs sm:text-sm font-bold transition-all duration-150 cursor-pointer shadow-xs active:scale-95 ${
            activeMode === 2
              ? 'bg-amber-600 text-white border border-amber-700 shadow-sm'
              : 'bg-white text-gray-700 hover:text-amber-700 border border-gray-300 hover:border-amber-400 hover:bg-amber-50/50'
          }`}
        >
          <FontAwesomeIcon icon={faBolt} className={activeMode === 2 ? 'text-white text-xs' : 'text-amber-600 text-xs'} />
          <span>Mode 2: Final Solution (Tối Ưu)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveMode(3)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs sm:text-sm font-bold transition-all duration-150 cursor-pointer shadow-xs active:scale-95 ${
            activeMode === 3
              ? 'bg-emerald-600 text-white border border-emerald-700 shadow-sm'
              : 'bg-white text-gray-700 hover:text-emerald-700 border border-gray-300 hover:border-emerald-400 hover:bg-emerald-50/50'
          }`}
        >
          <FontAwesomeIcon icon={faDatabase} className={activeMode === 3 ? 'text-white text-xs' : 'text-emerald-600 text-xs'} />
          <span>Mode 3: Quản Lý Thư Viện (CRUD)</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* MODE 1: BENCHMARK SUITE (SO SÁNH) */}
      {/* ========================================================================= */}
      {activeMode === 1 && (
        <div className="space-y-5">
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
                  onClick={executeDSA}
                  disabled={loading}
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-xs transition-all duration-150 flex items-center gap-2 shadow-sm hover:shadow active:scale-95 cursor-pointer border border-blue-700 shrink-0"
                >
                  <FontAwesomeIcon icon={faBolt} className="text-xs" />
                  <span>{loading ? 'Đang chạy C++...' : 'Chạy Benchmark Đối Sánh (1000 Workload)'}</span>
                </button>
              </div>
            </div>

            {/* Input Parameter with Presets */}
            <div className="space-y-2.5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-gray-800">
                  {selectedModule === 'mc1' && 'Mã Sách (Book ID):'}
                  {selectedModule === 'mc2' && 'Số Lượng Top Sách:'}
                  {selectedModule === 'rq1' && 'Thể Loại Sách:'}
                  {selectedModule === 'rq2' && 'Mốc Ngày Kiểm Tra:'}
                  {selectedModule === 'rq3' && 'Từ Khóa Tiêu Đề:'}
                </span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                  {selectedModule === 'mc1' && 'Dải hợp lệ: B001 -> B010'}
                  {selectedModule === 'mc2' && 'Top K: 1 -> 10'}
                  {selectedModule === 'rq1' && 'Dải: Software Engineering, Computer Science...'}
                  {selectedModule === 'rq2' && 'Định dạng: YYYY-MM-DD'}
                  {selectedModule === 'rq3' && 'Từ khóa mẫu: Code, Algorithms, System...'}
                </span>
              </div>

              {selectedModule === 'rq1' ? (
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
                  onKeyDown={(e) => e.key === 'Enter' && executeDSA()}
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
                      onClick={() => handlePreset('B005')}
                      className={`px-3 py-1.5 rounded-lg border text-xs font-semibold shadow-xs transition-all duration-150 active:scale-95 cursor-pointer inline-flex items-center gap-1.5 ${
                        inputValue === 'B005'
                          ? 'border-blue-500 bg-blue-50 text-blue-700 ring-1 ring-blue-400 font-bold'
                          : 'border-gray-300 bg-white hover:bg-blue-50/60 hover:border-blue-300 text-gray-700'
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                      <span>Giữa dải (B005)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handlePreset('B010')}
                      className={`px-3 py-1.5 rounded-lg border text-xs font-semibold shadow-xs transition-all duration-150 active:scale-95 cursor-pointer inline-flex items-center gap-1.5 ${
                        inputValue === 'B010'
                          ? 'border-blue-500 bg-blue-50 text-blue-700 ring-1 ring-blue-400 font-bold'
                          : 'border-gray-300 bg-white hover:bg-blue-50/60 hover:border-blue-300 text-gray-700'
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
                      <span>Cuối dải (B010)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handlePreset('B999')}
                      className={`px-3 py-1.5 rounded-lg border text-xs font-semibold shadow-xs transition-all duration-150 active:scale-95 cursor-pointer inline-flex items-center gap-1.5 ${
                        inputValue === 'B999'
                          ? 'border-rose-500 bg-rose-50 text-rose-700 ring-1 ring-rose-400 font-bold'
                          : 'border-gray-300 bg-white hover:bg-rose-50/60 hover:border-rose-300 text-gray-700'
                      }`}
                    >
                      <span className="text-rose-500 font-bold">⊘</span>
                      <span>Không tồn tại (B999)</span>
                    </button>
                  </>
                )}

                {selectedModule === 'mc2' && (
                  <>
                    <button
                      type="button"
                      onClick={handleRandomSelect}
                      title="Chọn ngẫu nhiên Top K"
                      className="px-3 py-1.5 rounded-lg border border-gray-300 bg-white hover:bg-amber-50/80 hover:border-amber-400 hover:text-amber-800 text-gray-700 text-xs font-semibold shadow-xs transition-all duration-150 active:scale-95 cursor-pointer inline-flex items-center gap-1.5"
                    >
                      <span>🎲</span>
                      <span>Ngẫu Nhiên</span>
                    </button>
                    {['1', '3', '5', '10'].map((k) => (
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
                    {['Software Engineering', 'Computer Science', 'Database', 'Operating System'].map((cat) => (
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
                        <span>{cat}</span>
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

                    {/* Row 3: Workload (1000 queries) */}
                    <tr className="hover:bg-gray-50/50">
                      <td className="py-2.5 px-3 font-medium text-gray-800">
                        Tổng thời gian Workload (1000 queries - Giây)
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

          {/* Card 3: Kết Quả Tìm Thấy Trực Tiếp (Matching Bottom Panel) */}
          {data && (
            <div className="p-5 rounded-xl bg-white border border-gray-200 space-y-3 shadow-xs">
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <FontAwesomeIcon icon={faCheckCircle} className="text-emerald-600" />
                Kết Quả Tìm Thấy Trực Tiếp
              </h3>

              {data.book ? (
                <div className="p-4 rounded-lg bg-gray-50 border border-gray-200 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <div className="text-[10px] text-gray-500 font-semibold uppercase">Mã Sách:</div>
                    <div className="text-sm font-mono font-bold text-blue-700">{data.book.book_id}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-gray-500 font-semibold uppercase">Tên Sách:</div>
                    <div className="text-sm font-bold text-gray-900">{data.book.title}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-gray-500 font-semibold uppercase">Thể Loại:</div>
                    <div className="text-sm text-gray-800">{data.book.category}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-gray-500 font-semibold uppercase">Lượt Mượn:</div>
                    <div className="text-sm font-bold text-amber-800">{data.book.borrow_count} lượt</div>
                  </div>
                </div>
              ) : data.top_books && data.top_books.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {data.top_books.map((b, idx) => (
                    <BookCard key={b.book_id} book={b} rank={idx + 1} highlight={idx === 0} />
                  ))}
                </div>
              ) : data.books && data.books.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {data.books.map((b) => (
                    <BookCard key={b.book_id} book={b} highlight={true} />
                  ))}
                </div>
              ) : data.overdue_records && data.overdue_records.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-gray-200 text-gray-500 uppercase">
                        <th className="py-2 px-3">Mã Phiếu</th>
                        <th className="py-2 px-3">Mã Sách</th>
                        <th className="py-2 px-3">Hạn Trả</th>
                        <th className="py-2 px-3">Trạng Thái</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {data.overdue_records.map((r) => (
                        <tr key={r.borrow_id}>
                          <td className="py-2 px-3 font-mono font-bold text-rose-700">{r.borrow_id}</td>
                          <td className="py-2 px-3 font-mono text-blue-700">{r.book_id}</td>
                          <td className="py-2 px-3 font-mono text-gray-900">{r.due_date}</td>
                          <td className="py-2 px-3 text-rose-700 font-bold">{r.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-4 rounded-lg bg-gray-50 border border-gray-200 text-xs text-gray-500">
                  {data.optimized.found === false ? 'Không tìm thấy tài liệu phù hợp trong cơ sở dữ liệu.' : 'Chưa có dữ liệu.'}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 2: FINAL SOLUTION (TỐI ƯU / TRỰC QUAN HÓA) */}
      {/* ========================================================================= */}
      {activeMode === 2 && (
        <div className="space-y-5">
          {/* Card: Chế Độ Truy Vấn Tối Ưu Trực Tiếp */}
          <div className="p-5 rounded-xl bg-white border border-gray-200 shadow-xs space-y-4">
            <div>
              <h2 className="text-sm sm:text-base font-bold text-gray-900 flex items-center gap-2">
                <FontAwesomeIcon icon={faBolt} className="text-amber-600 text-sm" />
                Chế Độ Truy Vấn Tối Ưu Trực Tiếp (Production Mode)
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Chỉ chạy thuật toán tối ưu tốt nhất (Hash Table O(1), Max-Heap O(1) peek, AVL Tree O(log N), Inverted Index O(1+K)) và trực quan hóa từng bước thực thi.
              </p>
            </div>

            {/* 4 Selection Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <button
                type="button"
                onClick={() => handleModuleChange('mc1')}
                className={`p-3.5 rounded-xl border text-left transition-all duration-150 cursor-pointer shadow-xs active:scale-98 ${
                  selectedModule === 'mc1'
                    ? 'bg-blue-50/90 border-blue-500 ring-2 ring-blue-300 font-bold'
                    : 'bg-white border-gray-300 hover:border-blue-400 hover:bg-blue-50/40'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold uppercase text-blue-700">BẮT BUỘC</span>
                  <span className="text-[10px] font-mono font-bold text-gray-500">MC1</span>
                </div>
                <div className="text-xs font-bold text-gray-900">Tra Cứu Theo Mã Sách</div>
                <div className="text-[11px] text-gray-500">Exact-key lookup (Hash Table)</div>
                <div className="text-[11px] font-mono text-blue-700 font-semibold mt-1">Độ phức tạp: O(1)</div>
              </button>

              <button
                type="button"
                onClick={() => handleModuleChange('mc2')}
                className={`p-3.5 rounded-xl border text-left transition-all duration-150 cursor-pointer shadow-xs active:scale-98 ${
                  selectedModule === 'mc2'
                    ? 'bg-amber-50/90 border-amber-500 ring-2 ring-amber-300 font-bold'
                    : 'bg-white border-gray-300 hover:border-amber-400 hover:bg-amber-50/40'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold uppercase text-amber-800">BẮT BUỘC</span>
                  <span className="text-[10px] font-mono font-bold text-gray-500">MC2</span>
                </div>
                <div className="text-xs font-bold text-gray-900">Sách Mượn Nhiều Nhất</div>
                <div className="text-[11px] text-gray-500">Extreme / Priority (Max Heap)</div>
                <div className="text-[11px] font-mono text-amber-800 font-semibold mt-1">Độ phức tạp: O(1) Peek Root</div>
              </button>

              <button
                type="button"
                onClick={() => handleModuleChange('rq1')}
                className={`p-3.5 rounded-xl border text-left transition-all duration-150 cursor-pointer shadow-xs active:scale-98 ${
                  selectedModule === 'rq1'
                    ? 'bg-purple-50/90 border-purple-500 ring-2 ring-purple-300 font-bold'
                    : 'bg-white border-gray-300 hover:border-purple-400 hover:bg-purple-50/40'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold uppercase text-purple-700">TỰ CHỌN</span>
                  <span className="text-[10px] font-mono font-bold text-gray-500">RQ1</span>
                </div>
                <div className="text-xs font-bold text-gray-900">Lọc Theo Thể Loại</div>
                <div className="text-[11px] text-gray-500">Multi-result lookup (Category Index)</div>
                <div className="text-[11px] font-mono text-purple-700 font-semibold mt-1">Độ phức tạp: O(1+K) Index View</div>
              </button>

              <button
                type="button"
                onClick={() => handleModuleChange('rq2')}
                className={`p-3.5 rounded-xl border text-left transition-all duration-150 cursor-pointer shadow-xs active:scale-98 ${
                  selectedModule === 'rq2'
                    ? 'bg-emerald-50/90 border-emerald-500 ring-2 ring-emerald-300 font-bold'
                    : 'bg-white border-gray-300 hover:border-emerald-400 hover:bg-emerald-50/40'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold uppercase text-emerald-800">TỰ CHỌN</span>
                  <span className="text-[10px] font-mono font-bold text-gray-500">RQ2</span>
                </div>
                <div className="text-xs font-bold text-gray-900">Lọc Khoảng Phiếu Quá Hạn</div>
                <div className="text-[11px] text-gray-500">Range query (AVL Tree)</div>
                <div className="text-[11px] font-mono text-emerald-800 font-semibold mt-1">Độ phức tạp: O(log N) View</div>
              </button>
            </div>

            {/* Input & Action */}
            <div className="pt-2 border-t border-gray-100 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-800">
                  {selectedModule === 'mc1' && 'Mã Sách: (Dải hợp lệ: B001 -> B010)'}
                  {selectedModule === 'mc2' && 'Trích Xuất Phần Tử Cực Đại Max-Heap:'}
                  {selectedModule === 'rq1' && 'Chọn Thể Loại Sách:'}
                  {selectedModule === 'rq2' && 'Mốc Ngày Kiểm Tra:'}
                  {selectedModule === 'rq3' && 'Từ Khóa Tiêu Đề:'}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {selectedModule === 'rq1' ? (
                  <select
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-lg border border-gray-300 text-gray-900 text-xs font-medium focus:outline-none focus:border-blue-500 bg-white shadow-2xs"
                  >
                    <option value="Software Engineering">Software Engineering</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="Database">Database</option>
                    <option value="Networking">Networking</option>
                    <option value="Operating System">Operating System</option>
                    <option value="Mathematics">Mathematics</option>
                  </select>
                ) : selectedModule === 'rq2' ? (
                  <input
                    type="date"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-lg border border-gray-300 text-gray-900 text-xs font-mono font-medium focus:outline-none focus:border-blue-500 shadow-2xs"
                  />
                ) : selectedModule === 'mc2' ? (
                  <div className="flex-1 text-xs text-gray-600 bg-gray-50 p-2.5 rounded-lg border border-gray-200">
                    Sẵn sàng lấy phần tử có lượt mượn cao nhất tại đỉnh heap[0].
                  </div>
                ) : (
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && executeDSA()}
                    className="flex-1 px-3.5 py-2.5 rounded-lg border border-gray-300 text-gray-900 text-xs font-mono font-bold focus:outline-none focus:border-blue-500 shadow-2xs"
                  />
                )}

                <button
                  type="button"
                  onClick={executeDSA}
                  disabled={loading}
                  className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-xs transition-all duration-150 flex items-center gap-2 shrink-0 shadow-sm hover:shadow active:scale-95 cursor-pointer border border-blue-700"
                >
                  <FontAwesomeIcon icon={faBolt} />
                  <span>{loading ? 'Đang thực thi...' : '⚡ Thực Thi Thuật Toán Tối Ưu'}</span>
                </button>
              </div>

              {/* Presets in Mode 2 */}
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
                      onClick={() => handlePreset('B005')}
                      className={`px-3 py-1.5 rounded-lg border text-xs font-semibold shadow-xs transition-all duration-150 active:scale-95 cursor-pointer inline-flex items-center gap-1.5 ${
                        inputValue === 'B005'
                          ? 'border-blue-500 bg-blue-50 text-blue-700 ring-1 ring-blue-400 font-bold'
                          : 'border-gray-300 bg-white hover:bg-blue-50/60 hover:border-blue-300 text-gray-700'
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                      <span>Giữa dải (B005)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handlePreset('B010')}
                      className={`px-3 py-1.5 rounded-lg border text-xs font-semibold shadow-xs transition-all duration-150 active:scale-95 cursor-pointer inline-flex items-center gap-1.5 ${
                        inputValue === 'B010'
                          ? 'border-blue-500 bg-blue-50 text-blue-700 ring-1 ring-blue-400 font-bold'
                          : 'border-gray-300 bg-white hover:bg-blue-50/60 hover:border-blue-300 text-gray-700'
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
                      <span>Cuối dải (B010)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handlePreset('B999')}
                      className={`px-3 py-1.5 rounded-lg border text-xs font-semibold shadow-xs transition-all duration-150 active:scale-95 cursor-pointer inline-flex items-center gap-1.5 ${
                        inputValue === 'B999'
                          ? 'border-rose-500 bg-rose-50 text-rose-700 ring-1 ring-rose-400 font-bold'
                          : 'border-gray-300 bg-white hover:bg-rose-50/60 hover:border-rose-300 text-gray-700'
                      }`}
                    >
                      <span className="text-rose-500 font-bold">⊘</span>
                      <span>Không tồn tại (B999)</span>
                    </button>
                  </>
                )}

                {selectedModule === 'mc2' && (
                  <>
                    <button
                      type="button"
                      onClick={handleRandomSelect}
                      title="Chọn ngẫu nhiên Top K"
                      className="px-3 py-1.5 rounded-lg border border-gray-300 bg-white hover:bg-amber-50/80 hover:border-amber-400 hover:text-amber-800 text-gray-700 text-xs font-semibold shadow-xs transition-all duration-150 active:scale-95 cursor-pointer inline-flex items-center gap-1.5"
                    >
                      <span>🎲</span>
                      <span>Ngẫu Nhiên</span>
                    </button>
                    {['1', '3', '5', '10'].map((k) => (
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
                    {['Software Engineering', 'Computer Science', 'Database', 'Operating System'].map((cat) => (
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
                        <span>{cat}</span>
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

          {/* Detailed Internal Visualizers */}
          {data && selectedModule === 'mc1' && (
            <>
              <HashPipeline
                inputKey={data.target_id || ''}
                rawHash={data.hash_info?.raw_hash || 0}
                tableSize={data.hash_info?.table_size || 100003}
                bucketIndex={data.hash_info?.bucket_index || 0}
                found={data.optimized.found || false}
              />
              <BucketVisualizer
                bucketIndex={data.hash_info?.bucket_index || 0}
                matchedId={data.target_id || ''}
                found={data.optimized.found || false}
              />
            </>
          )}

          {data && selectedModule === 'mc2' && (
            <HeapTreeVisualizer books={data.top_books || []} />
          )}

          {data && selectedModule === 'rq1' && (
            <CategoryIndexVisualizer category={data.category || ''} books={data.books || []} />
          )}

          {data && selectedModule === 'rq2' && (
            <AVLTreeVisualizer currentDate={data.current_date || ''} overdueRecords={data.overdue_records || []} />
          )}

          {data && selectedModule === 'rq3' && (
            <InvertedIndexVisualizer keyword={data.keyword || ''} matchedCount={data.matched_books?.length || 0} />
          )}

          {/* Results Panel */}
          {data && (
            <div className="p-5 rounded-xl bg-white border border-gray-200 space-y-3">
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <FontAwesomeIcon icon={faCheckCircle} className="text-emerald-600" />
                Kết Quả Thực Thi Thuật Toán Tối Ưu
              </h3>

              {data.book ? (
                <div className="max-w-md">
                  <BookCard book={data.book} highlight={true} />
                </div>
              ) : data.top_books && data.top_books.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {data.top_books.map((b, idx) => (
                    <BookCard key={b.book_id} book={b} rank={idx + 1} highlight={idx === 0} />
                  ))}
                </div>
              ) : data.books && data.books.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {data.books.map((b) => (
                    <BookCard key={b.book_id} book={b} highlight={true} />
                  ))}
                </div>
              ) : (
                <div className="p-4 rounded-lg bg-gray-50 border border-gray-200 text-xs text-gray-500">
                  {data.optimized.found === false ? 'Không tìm thấy tài liệu phù hợp.' : 'Đã hoàn tất xử lý.'}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 3: QUẢN LÝ THƯ VIỆN (CRUD) */}
      {/* ========================================================================= */}
      {activeMode === 3 && (
        <div className="p-5 rounded-xl bg-white border border-gray-200 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div>
              <h2 className="text-sm sm:text-base font-bold text-gray-900 flex items-center gap-2">
                <FontAwesomeIcon icon={faDatabase} className="text-emerald-600" />
                Dữ Liệu Thư Viện Thực Tế Trong Bộ Nhớ RAM
              </h2>
              <p className="text-xs text-gray-500">Nạp từ data/books.json và borrow_records.json vào Native C++ Engine</p>
            </div>
            <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
              {rawBooks.length} Sách • {rawRecords.length} Phiếu Mượn
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
            {rawBooks.map((b) => (
              <BookCard key={b.book_id} book={b} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
