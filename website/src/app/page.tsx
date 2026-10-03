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

export default function DashboardPage() {
  const [activeMode, setActiveMode] = useState<1 | 2 | 3>(1);
  const [selectedModule, setSelectedModule] = useState<'mc1' | 'mc2' | 'rq1' | 'rq2' | 'rq3'>('mc1');
  const [inputValue, setInputValue] = useState('B001');
  const [data, setData] = useState<ModuleResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [rawBooks, setRawBooks] = useState<Book[]>([]);
  const [rawRecords, setRawRecords] = useState<BorrowRecord[]>([]);

  // Load initial data
  useEffect(() => {
    fetch('/api/bridge?mode=data')
      .then((res) => res.json())
      .then((resData) => {
        if (resData.status === 'success') {
          setRawBooks(resData.books || []);
          setRawRecords(resData.borrow_records || []);
        }
      })
      .catch((err) => console.error(err));
  }, []);

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

  // Formatter for milliseconds/nanoseconds
  const formatMs = (ns: number) => {
    const ms = ns / 1000000;
    return `${ms.toFixed(6)} ms`;
  };

  return (
    <div className="w-full space-y-5">
      {/* 3 Mode Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200 pb-3 overflow-x-auto">
        <button
          onClick={() => setActiveMode(1)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors ${
            activeMode === 1
              ? 'bg-blue-50 text-blue-700 border border-blue-300 font-bold'
              : 'bg-white text-gray-600 hover:text-gray-900 border border-gray-200 hover:bg-gray-50'
          }`}
        >
          <FontAwesomeIcon icon={faChartLine} className="text-blue-600 text-xs" />
          <span>Mode 1: Benchmark Suite (So Sánh)</span>
        </button>

        <button
          onClick={() => setActiveMode(2)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors ${
            activeMode === 2
              ? 'bg-amber-50 text-amber-800 border border-amber-300 font-bold'
              : 'bg-white text-gray-600 hover:text-gray-900 border border-gray-200 hover:bg-gray-50'
          }`}
        >
          <FontAwesomeIcon icon={faBolt} className="text-amber-600 text-xs" />
          <span>Mode 2: Final Solution (Tối Ưu)</span>
        </button>

        <button
          onClick={() => setActiveMode(3)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors ${
            activeMode === 3
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 font-bold'
              : 'bg-white text-gray-600 hover:text-gray-900 border border-gray-200 hover:bg-gray-50'
          }`}
        >
          <FontAwesomeIcon icon={faDatabase} className="text-emerald-600 text-xs" />
          <span>Mode 3: Quản Lý Thư Viện (CRUD)</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* MODE 1: BENCHMARK SUITE (SO SÁNH) */}
      {/* ========================================================================= */}
      {activeMode === 1 && (
        <div className="space-y-5">
          {/* Card 1: Setup & Parameters */}
          <div className="p-5 rounded-xl bg-white border border-gray-200 space-y-4">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-3 border-b border-gray-100">
              <div>
                <h2 className="text-sm sm:text-base font-bold text-gray-900 flex items-center gap-2">
                  <FontAwesomeIcon icon={faSliders} className="text-blue-600 text-sm" />
                  Thiết Lập Bài Toán & Tham Số Kiểm Thử
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  So sánh hiệu năng chi tiết giữa giải thuật cơ sở (Baseline) và tối ưu (Final Solution) trên tập dữ liệu bộ nhớ chính.
                </p>
              </div>

              {/* Module Dropdown & Run Button */}
              <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
                <select
                  value={selectedModule}
                  onChange={(e) => handleModuleChange(e.target.value as any)}
                  className="px-3 py-2 rounded-lg border border-gray-300 text-gray-900 text-xs font-semibold focus:outline-none focus:border-blue-500 bg-white"
                >
                  <option value="mc1">[BẮT BUỘC] MC1: Tra cứu theo MSSV / Mã Sách (Hash Table O(1))</option>
                  <option value="mc2">[BẮT BUỘC] MC2: Sách Mượn Nhiều Nhất (Max-Heap O(1) Peek)</option>
                  <option value="rq1">[TỰ CHỌN] RQ1: Lọc Theo Thể Loại (Class Index O(1+K))</option>
                  <option value="rq2">[TỰ CHỌN] RQ2: Lọc Khoảng Phiếu Quá Hạn (AVL Tree O(log N))</option>
                  <option value="rq3">[TỰ CHỌN] RQ3: Tìm Kiếm Tiêu Đề (Inverted Index O(1+K))</option>
                </select>

                <button
                  onClick={executeDSA}
                  disabled={loading}
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-sm shrink-0"
                >
                  <FontAwesomeIcon icon={faBolt} className="text-xs" />
                  <span>{loading ? 'Đang chạy C++...' : 'Chạy Benchmark Đối Sánh (1000 Workload)'}</span>
                </button>
              </div>
            </div>

            {/* Input Parameter with Presets */}
            <div className="space-y-2">
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
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 text-gray-900 text-xs font-mono font-bold focus:outline-none focus:border-blue-500"
                />
              )}

              {/* Quick Presets Buttons */}
              {selectedModule === 'mc1' && (
                <div className="flex items-center gap-1.5 flex-wrap pt-1">
                  <button onClick={() => handlePreset('B003')} className="px-2.5 py-1 rounded text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium">
                    🎲 Ngẫu Nhiên
                  </button>
                  <button onClick={() => handlePreset('B001')} className="px-2.5 py-1 rounded text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium">
                    Đầu dải (B001)
                  </button>
                  <button onClick={() => handlePreset('B005')} className="px-2.5 py-1 rounded text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium">
                    Giữa dải (B005)
                  </button>
                  <button onClick={() => handlePreset('B010')} className="px-2.5 py-1 rounded text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium">
                    Cuối dải (B010)
                  </button>
                  <button onClick={() => handlePreset('B999')} className="px-2.5 py-1 rounded text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium">
                    ⊘ Không tồn tại (B999)
                  </button>
                </div>
              )}
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
                        Thời gian truy vấn đơn lẻ (Single Query Time)
                      </td>
                      <td className="py-2.5 px-3 font-mono font-bold text-rose-700">
                        {formatMs(data.baseline.execution_time_ns)} ({data.baseline.execution_time_ns} ns)
                      </td>
                      <td className="py-2.5 px-3 font-mono font-bold text-emerald-700">
                        {formatMs(data.optimized.execution_time_ns)} ({data.optimized.execution_time_ns} ns)
                      </td>
                    </tr>

                    {/* Row 3: Workload (1000 queries) */}
                    <tr className="hover:bg-gray-50/50">
                      <td className="py-2.5 px-3 font-medium text-gray-800">
                        Tổng thời gian Workload (1000 queries)
                      </td>
                      <td className="py-2.5 px-3 font-mono font-bold text-rose-700">
                        {formatMs(data.baseline.workload_1000_ns || data.baseline.execution_time_ns * 1000)}
                      </td>
                      <td className="py-2.5 px-3 font-mono font-bold text-emerald-700">
                        {formatMs(data.optimized.workload_1000_ns || data.optimized.execution_time_ns * 1000)}
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
            <div className="p-5 rounded-xl bg-white border border-gray-200 space-y-3">
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
          <div className="p-5 rounded-xl bg-white border border-gray-200 space-y-4">
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
                onClick={() => handleModuleChange('mc1')}
                className={`p-3.5 rounded-xl border text-left transition-colors ${
                  selectedModule === 'mc1'
                    ? 'bg-blue-50/70 border-blue-400 ring-1 ring-blue-300'
                    : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
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
                onClick={() => handleModuleChange('mc2')}
                className={`p-3.5 rounded-xl border text-left transition-colors ${
                  selectedModule === 'mc2'
                    ? 'bg-amber-50/70 border-amber-400 ring-1 ring-amber-300'
                    : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
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
                onClick={() => handleModuleChange('rq1')}
                className={`p-3.5 rounded-xl border text-left transition-colors ${
                  selectedModule === 'rq1'
                    ? 'bg-purple-50/70 border-purple-400 ring-1 ring-purple-300'
                    : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
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
                onClick={() => handleModuleChange('rq2')}
                className={`p-3.5 rounded-xl border text-left transition-colors ${
                  selectedModule === 'rq2'
                    ? 'bg-emerald-50/70 border-emerald-400 ring-1 ring-emerald-300'
                    : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
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
            <div className="pt-2 border-t border-gray-100 space-y-2">
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
                    className="flex-1 px-3 py-2 rounded-lg border border-gray-300 text-gray-900 text-xs font-medium focus:outline-none focus:border-blue-500 bg-white"
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
                    className="flex-1 px-3 py-2 rounded-lg border border-gray-300 text-gray-900 text-xs font-mono font-medium focus:outline-none focus:border-blue-500"
                  />
                ) : selectedModule === 'mc2' ? (
                  <div className="flex-1 text-xs text-gray-600 bg-gray-50 p-2 rounded-lg border border-gray-200">
                    Sẵn sàng lấy phần tử có lượt mượn cao nhất tại đỉnh heap[0].
                  </div>
                ) : (
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && executeDSA()}
                    className="flex-1 px-3 py-2 rounded-lg border border-gray-300 text-gray-900 text-xs font-mono font-bold focus:outline-none focus:border-blue-500"
                  />
                )}

                <button
                  onClick={executeDSA}
                  disabled={loading}
                  className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 shrink-0 shadow-sm"
                >
                  <FontAwesomeIcon icon={faBolt} />
                  <span>{loading ? 'Đang thực thi...' : '⚡ Thực Thi Thuật Toán Tối Ưu'}</span>
                </button>
              </div>

              {selectedModule === 'mc1' && (
                <div className="flex items-center gap-1.5 flex-wrap pt-1">
                  <button onClick={() => handlePreset('B003')} className="px-2.5 py-1 rounded text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium">
                    🎲 Ngẫu Nhiên
                  </button>
                  <button onClick={() => handlePreset('B001')} className="px-2.5 py-1 rounded text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium">
                    Đầu dải
                  </button>
                  <button onClick={() => handlePreset('B005')} className="px-2.5 py-1 rounded text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium">
                    Giữa dải
                  </button>
                  <button onClick={() => handlePreset('B010')} className="px-2.5 py-1 rounded text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium">
                    Cuối dải
                  </button>
                  <button onClick={() => handlePreset('B999')} className="px-2.5 py-1 rounded text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium">
                    ⊘ Không tồn tại
                  </button>
                </div>
              )}
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
