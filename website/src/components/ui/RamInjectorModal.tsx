'use client';

import React, { useEffect, useState } from 'react';
import { Modal, Input, Button, ConfigProvider, message } from 'antd';
import { ReloadOutlined, ThunderboltFilled, CloseOutlined } from '@ant-design/icons';
import type { RamSyncState } from '@/context/RamContext';
import { formatIntegerWithSpaces, parseGroupedInteger } from '@/utils/numberFormat';

interface RamInjectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentCount: number;
  onInject: (addedCount: number) => void;
  onReset: () => void;
  ramSyncState: RamSyncState;
  loadedCount: number;
}

export default function RamInjectorModal({
  isOpen,
  onClose,
  currentCount,
  onInject,
  onReset,
  ramSyncState,
  loadedCount,
}: RamInjectorModalProps) {
  const [messageApi, messageContextHolder] = message.useMessage();
  const [injectInput, setInjectInput] = useState<string>(formatIntegerWithSpaces(500000));
  const [isInjecting, setIsInjecting] = useState(false);
  const [pendingAction, setPendingAction] = useState<'inject' | 'reset' | null>(null);

  // Keep the modal open until C++ confirms that the requested dataset and all
  // indexes are ready. A failed warm-up leaves the modal open for retry.
  useEffect(() => {
    if (!pendingAction) return;
    if (ramSyncState === 'error') {
      setIsInjecting(false);
      setPendingAction(null);
      messageApi.error('Nạp dữ liệu C++ thất bại. Modal được giữ mở để bạn thử lại.');
      return;
    }
    if (ramSyncState === 'ready' && loadedCount === currentCount) {
      const completedAction = pendingAction;
      setIsInjecting(false);
      setPendingAction(null);
      messageApi.success(
        completedAction === 'reset'
          ? 'Đã đặt lại RAM và lập chỉ mục xong 500.000 sách.'
          : `Đã nạp và lập chỉ mục xong ${formatIntegerWithSpaces(currentCount)} sách trong C++ RAM.`
      );
      onClose();
    }
  }, [pendingAction, ramSyncState, loadedCount, currentCount, messageApi, onClose]);

  const handleInject = () => {
    const num = parseGroupedInteger(injectInput);
    if (!isNaN(num) && num > 0) {
      setIsInjecting(true);
      setPendingAction('inject');
      onInject(num);
    } else {
      messageApi.warning('Vui lòng nhập số lượng hợp lệ (> 0)');
    }
  };

  const handleResetClick = () => {
    setIsInjecting(true);
    setPendingAction('reset');
    onReset();
    setInjectInput(formatIntegerWithSpaces(500000));
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#2563eb',
          borderRadius: 12,
          fontFamily: 'inherit',
        },
      }}
    >
      {messageContextHolder}
      <Modal
        open={isOpen}
        onCancel={() => {
          if (!isInjecting) onClose();
        }}
        footer={null}
        centered
        width={480}
        closable={!isInjecting}
        maskClosable={!isInjecting}
        keyboard={!isInjecting}
        closeIcon={<CloseOutlined className="text-gray-400 hover:text-gray-700" />}
        styles={{
          body: {
            padding: '8px 0',
          },
        }}
        title={
          <div className="flex items-center gap-2.5 pb-2 border-b border-gray-100">
            <span className="text-lg">✨</span>
            <span className="text-sm sm:text-base font-bold text-gray-900">
              Nạp Thêm Dữ Liệu Vào RAM (In-Memory Bulk Injector)
            </span>
          </div>
        }
      >
        <div className="space-y-4 pt-3">
          {/* Current RAM Status Box */}
          <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-600">Đang có trong RAM:</span>
            <span className="text-sm font-bold font-mono text-blue-700">
              {formatIntegerWithSpaces(currentCount)} sách
            </span>
          </div>

          {isInjecting && (
            <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-800 font-semibold animate-pulse">
              C++ đang tạo dữ liệu thật và lập chỉ mục cho 5 module. Modal sẽ tự đóng khi RAM sẵn sàng.
            </div>
          )}

          {/* Inject Amount Input */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-800 block">
              Điền số lượng sách cần nạp thêm:
            </label>
            <Input
              size="large"
              value={injectInput}
              onChange={(e) => setInjectInput(formatIntegerWithSpaces(e.target.value))}
              onPressEnter={handleInject}
              inputMode="numeric"
              placeholder="500 000"
              className="font-mono font-bold text-sm rounded-xl"
            />
            {/* Quick Increment Preset Tags */}
            <div className="flex items-center gap-1.5 flex-wrap pt-1">
              {['100000', '200000', '500000', '1000000'].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setInjectInput(formatIntegerWithSpaces(preset))}
                  className="px-2.5 py-1 rounded-md border border-gray-200 bg-white hover:bg-blue-50 hover:border-blue-300 text-gray-600 hover:text-blue-700 text-[11px] font-mono font-semibold shadow-2xs cursor-pointer transition-colors"
                >
                  +{formatIntegerWithSpaces(preset)}
                </button>
              ))}
            </div>
          </div>

          {/* Ant Design Action Buttons Footer */}
          <div className="flex items-center gap-2.5 pt-3 border-t border-gray-100">
            <Button
              type="primary"
              size="large"
              icon={<ThunderboltFilled />}
              loading={isInjecting}
              disabled={isInjecting}
              onClick={handleInject}
              className="flex-1 font-bold text-xs h-10 rounded-xl bg-blue-600 hover:bg-blue-700 shadow-sm"
            >
              Nạp Thêm Vào RAM
            </Button>

            <Button
              size="large"
              icon={<ReloadOutlined />}
              onClick={handleResetClick}
              disabled={isInjecting}
              className="font-semibold text-xs h-10 rounded-xl text-gray-700 hover:text-gray-900 border-gray-300 shadow-2xs"
            >
              Reset
            </Button>
          </div>
        </div>
      </Modal>
    </ConfigProvider>
  );
}
