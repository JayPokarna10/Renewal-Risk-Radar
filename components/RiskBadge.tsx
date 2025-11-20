import React from 'react';
import { RiskLevel } from '../types';

interface RiskBadgeProps {
  level: RiskLevel;
  type?: 'commercial' | 'compliance';
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({ level, type }) => {
  const getColors = () => {
    switch (level) {
      case RiskLevel.High:
        return 'bg-red-100 text-red-700 border-red-200';
      case RiskLevel.Medium:
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case RiskLevel.Low:
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getColors()} inline-flex items-center gap-1`}>
      <span className={`w-1.5 h-1.5 rounded-full ${level === RiskLevel.High ? 'bg-red-500' : level === RiskLevel.Medium ? 'bg-amber-500' : 'bg-emerald-500'}`}></span>
      {level}
    </span>
  );
};