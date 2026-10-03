'use client';

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/free-solid-svg-icons';

interface MetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  subtitle?: string;
  icon: IconDefinition;
  variant?: 'indigo' | 'emerald' | 'cyan' | 'amber' | 'rose';
  trend?: string;
}

export default function MetricCard({
  title,
  value,
  unit,
  subtitle,
  icon,
}: MetricCardProps) {
  return (
    <div className="p-4 rounded-xl bg-white border border-gray-200">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-gray-500">{title}</span>
        <div className="w-7 h-7 rounded-md bg-gray-100 text-gray-600 flex items-center justify-center">
          <FontAwesomeIcon icon={icon} className="text-xs" />
        </div>
      </div>
      <div className="flex items-baseline gap-1.5">
        <span className="text-2xl font-bold text-gray-900">{value}</span>
        {unit && <span className="text-xs font-normal text-gray-500">{unit}</span>}
      </div>
      {subtitle && (
        <div className="mt-1 text-[11px] text-gray-500">
          {subtitle}
        </div>
      )}
    </div>
  );
}
