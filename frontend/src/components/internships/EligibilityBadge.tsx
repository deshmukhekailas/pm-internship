import React from 'react';
import { CheckCircle2, XCircle, HelpCircle } from 'lucide-react';

interface EligibilityBadgeProps {
  status?: 'ELIGIBLE' | 'NOT_ELIGIBLE' | 'UNKNOWN';
  size?: 'sm' | 'md';
}

export const EligibilityBadge: React.FC<EligibilityBadgeProps> = ({
  status = 'UNKNOWN',
  size = 'md',
}) => {
  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-0.5',
  };

  if (status === 'ELIGIBLE') {
    return (
      <span
        className={`inline-flex items-center gap-1 font-semibold text-emerald-800 bg-emerald-50 border border-emerald-300 rounded-md ${sizeClasses[size]}`}
      >
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
        Eligible
      </span>
    );
  }

  if (status === 'NOT_ELIGIBLE') {
    return (
      <span
        className={`inline-flex items-center gap-1 font-semibold text-rose-800 bg-rose-50 border border-rose-300 rounded-md ${sizeClasses[size]}`}
      >
        <XCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
        Not Eligible
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1 font-medium text-slate-600 bg-slate-100 border border-slate-200 rounded-md ${sizeClasses[size]}`}
    >
      <HelpCircle className="w-3.5 h-3.5 text-slate-400 shrink-0" />
      Eligibility Unknown
    </span>
  );
};
