'use client';

import React, { useState } from 'react';
import { Modal, Input, Button, ConfigProvider, message } from 'antd';
import { ReloadOutlined, ThunderboltFilled, CloseOutlined } from '@ant-design/icons';

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

  const handleInject = () => {
    const num = parseInt(injectInput.replace(/,/g, '').replace(/\./g, ''), 10);
    if (!isNaN(num) && num > 0) {
      setIsInjecting(true);
      setTimeout(() => {
        onInject(num);
        setIsInjecting(false);
        message.success(`Đã nạp thêm ${num.toLocaleString('vi-VN')} sách vào C++ In-Memory RAM thành công!`);
        onClose();
      }, 300);
    } else {
      message.warning('Vui lòng nhập số lượng hợp lệ (> 0)');
    }
  };

  const handleResetClick = () => {
    onReset();
    setInjectInput('500000');
    message.info('Đã đặt lại bộ nhớ RAM về mặc định (500.000 sách)!');
    onClose();
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
      <Modal
        open={isOpen}
        onCancel={onClose}
        footer={null}
        centered
        width={480}
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
              {currentCount.toLocaleString('vi-VN')} sách
            </span>
          </div>

          {/* Inject Amount Input */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-800 block">
              Điền số lượng sách cần nạp thêm:
            </label>
            <Input
              size="large"
              value={injectInput}
              onChange={(e) => setInjectInput(e.target.value)}
              onPressEnter={handleInject}
              placeholder="500000"
              className="font-mono font-bold text-sm rounded-xl"
            />
            {/* Quick Increment Preset Tags */}
            <div className="flex items-center gap-1.5 flex-wrap pt-1">
              {['100000', '200000', '500000', '1000000'].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setInjectInput(preset)}
                  className="px-2.5 py-1 rounded-md border border-gray-200 bg-white hover:bg-blue-50 hover:border-blue-300 text-gray-600 hover:text-blue-700 text-[11px] font-mono font-semibold shadow-2xs cursor-pointer transition-colors"
                >
                  +{parseInt(preset).toLocaleString('vi-VN')}
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
              onClick={handleInject}
              className="flex-1 font-bold text-xs h-10 rounded-xl bg-blue-600 hover:bg-blue-700 shadow-sm"
            >
              Nạp Thêm Vào RAM
            </Button>

            <Button
              size="large"
              icon={<ReloadOutlined />}
              onClick={handleResetClick}
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
