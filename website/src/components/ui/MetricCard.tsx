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
  variant = 'indigo',
  trend,
}: MetricCardProps) {
  const variantStyles = {
    indigo: {
      bg: 'from-indigo-900/30 to-indigo-800/10 border-indigo-500/20',
      iconBg: 'bg-indigo-500/20 text-indigo-400',
      text: 'text-indigo-400',
    },
    emerald: {
      bg: 'from-emerald-900/30 to-emerald-800/10 border-emerald-500/20',
      iconBg: 'bg-emerald-500/20 text-emerald-400',
      text: 'text-emerald-400',
    },
    cyan: {
      bg: 'from-cyan-900/30 to-cyan-800/10 border-cyan-500/20',
      iconBg: 'bg-cyan-500/20 text-cyan-400',
      text: 'text-cyan-400',
    },
    amber: {
      bg: 'from-amber-900/30 to-amber-800/10 border-amber-500/20',
      iconBg: 'bg-amber-500/20 text-amber-400',
      text: 'text-amber-400',
    },
    rose: {
      bg: 'from-rose-900/30 to-rose-800/10 border-rose-500/20',
      iconBg: 'bg-rose-500/20 text-rose-400',
      text: 'text-rose-400',
    },
  };

  const style = variantStyles[variant];

  return (
    <div className={`p-5 rounded-2xl bg-gradient-to-br ${style.bg} border backdrop-blur-xl shadow-lg transition-all hover:scale-[1.01]`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{title}</span>
        <div className={`w-9 h-9 rounded-xl ${style.iconBg} flex items-center justify-center`}>
          <FontAwesomeIcon icon={icon} className="text-sm" />
        </div>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl sm:text-3xl font-bold tracking-tight text-white">{value}</span>
        {unit && <span className="text-xs font-medium text-gray-400">{unit}</span>}
      </div>
      {(subtitle || trend) && (
        <div className="mt-2 flex items-center justify-between text-xs text-gray-400">
          {subtitle && <span>{subtitle}</span>}
          {trend && <span className={`font-semibold ${style.text}`}>{trend}</span>}
        </div>
      )}
    </div>
  );
}
