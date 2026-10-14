import React from 'react';

export const CardSkeleton: React.FC = () => {
  return (
    <div className="bg-white p-5 rounded-xl border border-slate-200 animate-pulse space-y-4">
      <div className="flex justify-between items-start">
        <div className="space-y-2 w-3/4">
          <div className="h-4 bg-slate-200 rounded w-1/3"></div>
          <div className="h-5 bg-slate-200 rounded w-4/5"></div>
        </div>
        <div className="h-8 w-16 bg-slate-200 rounded-lg"></div>
      </div>
      <div className="space-y-2">
        <div className="h-3 bg-slate-200 rounded w-full"></div>
        <div className="h-3 bg-slate-200 rounded w-5/6"></div>
      </div>
      <div className="flex gap-2">
        <div className="h-6 w-16 bg-slate-200 rounded"></div>
        <div className="h-6 w-20 bg-slate-200 rounded"></div>
        <div className="h-6 w-14 bg-slate-200 rounded"></div>
      </div>
      <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
        <div className="h-4 w-24 bg-slate-200 rounded"></div>
        <div className="h-9 w-24 bg-slate-200 rounded-lg"></div>
      </div>
    </div>
  );
};

export const TableSkeleton: React.FC<{ rows?: number }> = ({ rows = 5 }) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 animate-pulse space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-10 bg-slate-100 rounded-lg w-full"></div>
      ))}
    </div>
  );
};
