'use client';

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/free-solid-svg-icons';

interface ModuleHeaderProps {
  moduleCode: string;
  dsaName: string;
  title: string;
  description: string;
  complexityLabel: string;
  complexityValue: string;
  childrenRight: React.ReactNode;
}

export default function ModuleHeader({
  moduleCode,
  dsaName,
  title,
  description,
  complexityLabel,
  complexityValue,
  childrenRight,
}: ModuleHeaderProps) {
  return (
    <div className="p-5 rounded-xl bg-white border border-gray-200">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        {/* Left Column: Academic info */}
        <div className="space-y-1.5 max-w-xl">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200 font-mono">
              {moduleCode} · {dsaName}
            </span>
            <div className="flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-gray-100 text-gray-800 border border-gray-200">
              <span className="text-gray-500">{complexityLabel}:</span>
              <span className="text-blue-700">{complexityValue}</span>
            </div>
          </div>

          <h1 className="text-xl font-bold text-gray-900 tracking-tight">
            {title}
          </h1>

          <p className="text-xs text-gray-600 leading-relaxed">
            {description}
          </p>
        </div>

        {/* Right Column: Interactive inputs & action buttons */}
        <div className="w-full lg:w-auto">
          {childrenRight}
        </div>
      </div>
    </div>
  );
}
