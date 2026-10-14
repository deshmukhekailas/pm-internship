import React from 'react';
import { Sparkles } from 'lucide-react';

interface CompatibilityScoreBadgeProps {
  score: number; // 0 to 100
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export const CompatibilityScoreBadge: React.FC<CompatibilityScoreBadgeProps> = ({
  score,
  size = 'md',
  showLabel = true,
}) => {
  const getScoreTheme = (val: number) => {
    if (val >= 85) {
      return {
        bg: 'bg-emerald-50 text-emerald-800 border-emerald-300',
        ring: 'ring-emerald-500/20',
        dot: 'bg-emerald-500',
        label: 'High Match',
      };
    } else if (val >= 70) {
      return {
        bg: 'bg-blue-50 text-blue-800 border-blue-300',
        ring: 'ring-blue-500/20',
        dot: 'bg-blue-500',
        label: 'Strong Match',
      };
    } else if (val >= 50) {
      return {
        bg: 'bg-amber-50 text-amber-800 border-amber-300',
        ring: 'ring-amber-500/20',
        dot: 'bg-amber-500',
        label: 'Moderate Match',
      };
    } else {
      return {
        bg: 'bg-slate-100 text-slate-700 border-slate-300',
        ring: 'ring-slate-400/20',
        dot: 'bg-slate-400',
        label: 'Basic Match',
      };
    }
  };

  const theme = getScoreTheme(score);

  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
    lg: 'text-sm px-3.5 py-1.5 font-bold',
  };

  return (
    <div
      className={`inline-flex items-center gap-1.5 rounded-lg border font-semibold shadow-sm ${theme.bg} ${theme.ring} ${sizeClasses[size]}`}
      title="Compatibility Score is calculated based on skill similarity, education readiness, domain interest, and candidate preferences. Not a guarantee of selection."
    >
      <Sparkles className="w-3.5 h-3.5 text-gov-saffron shrink-0" />
      <span>{showLabel ? `Compatibility: ${score}%` : `${score}%`}</span>
    </div>
  );
};
