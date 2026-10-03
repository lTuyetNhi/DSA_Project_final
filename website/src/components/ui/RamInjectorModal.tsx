'use client';

import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBolt, faXmark, faRotateRight, faServer } from '@fortawesome/free-solid-svg-icons';

interface RamInjectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentCount: number;
  onInject: (addedCount: number) => void;
  onReset: () => void;
}

export default function RamInjectorModal({
  isOpen,
  onClose,
  currentCount,
  onInject,
  onReset,
}: RamInjectorModalProps) {
  const [injectInput, setInjectInput] = useState<string>('500000');
  const [isInjecting, setIsInjecting] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);

  if (!isOpen) return null;

  const handleInject = () => {
    const num = parseInt(injectInput.replace(/,/g, '').replace(/\./g, ''), 10);
    if (!isNaN(num) && num > 0) {
      setIsInjecting(true);
      setTimeout(() => {
        onInject(num);
        setIsInjecting(false);
        setSuccessMsg(true);
        setTimeout(() => {
          setSuccessMsg(false);
          onClose();
        }, 800);
      }, 300);
    }
  };

  const handleResetClick = () => {
    onReset();
    setInjectInput('500000');
    setSuccessMsg(true);
    setTimeout(() => {
      setSuccessMsg(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden p-6 space-y-5 animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-base">
              ✨
            </div>
            <h3 className="text-sm sm:text-base font-bold text-gray-900">
              Nạp Thêm Dữ Liệu Vào RAM (In-Memory Bulk Injector)
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 flex items-center justify-center transition-colors cursor-pointer"
          >
            <FontAwesomeIcon icon={faXmark} className="text-sm" />
          </button>
        </div>

        {/* Current RAM Status Box */}
        <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-between">
          <span className="text-xs font-semibold text-gray-700">Đang có trong RAM:</span>
          <span className="text-sm font-bold font-mono text-blue-700">
            {currentCount.toLocaleString('vi-VN')} sách
          </span>
        </div>

        {/* Inject Amount Input */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-800">
            Điền số lượng sách cần nạp thêm:
          </label>
          <input
            type="text"
            value={injectInput}
            onChange={(e) => setInjectInput(e.target.value)}
            placeholder="500000"
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-gray-900 text-sm font-mono font-bold focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 shadow-2xs"
          />
          <div className="flex items-center gap-1.5 flex-wrap pt-1">
            {['100000', '200000', '500000', '1000000'].map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setInjectInput(preset)}
                className="px-2.5 py-1 rounded-md border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 hover:text-blue-700 text-[11px] font-mono font-semibold shadow-2xs cursor-pointer transition-colors"
              >
                +{parseInt(preset).toLocaleString('vi-VN')}
              </button>
            ))}
          </div>
        </div>

        {/* Success Alert */}
        {successMsg && (
          <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold text-center animate-in fade-in">
            ✓ Đã nạp thành công dữ liệu vào cấu trúc C++ In-Memory RAM!
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="button"
            onClick={handleInject}
            disabled={isInjecting}
            className="flex-1 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm hover:shadow transition-all active:scale-98 cursor-pointer border border-blue-700"
          >
            <span>✨</span>
            <span>{isInjecting ? 'Đang cấp phát RAM...' : 'Nạp Thêm Vào RAM'}</span>
          </button>

          <button
            type="button"
            onClick={handleResetClick}
            className="py-2.5 px-4 rounded-xl bg-white hover:bg-gray-50 active:bg-gray-100 text-gray-700 font-bold text-xs flex items-center justify-center gap-1.5 border border-gray-300 shadow-2xs transition-all active:scale-98 cursor-pointer"
          >
            <FontAwesomeIcon icon={faRotateRight} className="text-xs text-gray-500" />
            <span>Reset</span>
          </button>
        </div>
      </div>
    </div>
  );
}
