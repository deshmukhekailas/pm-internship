import React from 'react';
import { Filter, RotateCcw } from 'lucide-react';

interface FilterPanelProps {
  filters: {
    keyword: string;
    domain: string;
    workMode: string;
    location: string;
    state: string;
    minStipend: number | '';
    durationMonths: number | '';
    onlyEligible: boolean;
    sortBy: string;
  };
  onFilterChange: (newFilters: any) => void;
  onReset: () => void;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  onFilterChange,
  onReset,
}) => {
  const domains = [
    'ALL',
    'Software Development',
    'Artificial Intelligence',
    'Mechanical Engineering',
    'Civil Infrastructure',
    'Financial Services',
    'Automotive Engineering',
    'Renewable Energy',
    'Supply Chain & Logistics',
    'Cyber Security',
    'Embedded Systems',
    'Design & Human-Computer Interaction',
  ];

  const states = [
    'ALL',
    'Maharashtra',
    'Karnataka',
    'Delhi',
    'Gujarat',
    'Tamil Nadu',
    'Telangana',
    'Haryana',
    'Uttar Pradesh',
    'West Bengal',
  ];

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-5">
      <div className="flex justify-between items-center pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gov-navy" />
          <h3 className="font-bold text-sm text-slate-800">Filter Internships</h3>
        </div>
        <button
          onClick={onReset}
          className="text-xs text-slate-500 hover:text-gov-navy flex items-center gap-1 transition-colors"
        >
          <RotateCcw className="w-3 h-3" /> Reset
        </button>
      </div>

      {/* Domain */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
          Functional Domain
        </label>
        <select
          value={filters.domain}
          onChange={(e) => onFilterChange({ ...filters, domain: e.target.value })}
          className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-gov-navy/20 focus:border-gov-navy bg-white"
        >
          {domains.map((d) => (
            <option key={d} value={d}>
              {d === 'ALL' ? 'All Domains' : d}
            </option>
          ))}
        </select>
      </div>

      {/* Work Mode */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
          Work Mode
        </label>
        <div className="grid grid-cols-2 gap-2 text-xs">
          {['ALL', 'REMOTE', 'ONSITE', 'HYBRID'].map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => onFilterChange({ ...filters, workMode: mode })}
              className={`p-2 rounded-lg border text-center transition-all ${
                filters.workMode === mode
                  ? 'bg-gov-navy text-white font-semibold border-gov-navy shadow-sm'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {mode === 'ALL' ? 'Any Mode' : mode}
            </button>
          ))}
        </div>
      </div>

      {/* State / Region */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
          State / Location
        </label>
        <select
          value={filters.state}
          onChange={(e) => onFilterChange({ ...filters, state: e.target.value })}
          className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-gov-navy/20 focus:border-gov-navy bg-white"
        >
          {states.map((s) => (
            <option key={s} value={s}>
              {s === 'ALL' ? 'Pan-India (All States)' : s}
            </option>
          ))}
        </select>
      </div>

      {/* Only Eligible Checkbox */}
      <div className="pt-2 border-t border-slate-100">
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={filters.onlyEligible}
            onChange={(e) => onFilterChange({ ...filters, onlyEligible: e.target.checked })}
            className="w-4 h-4 rounded text-gov-navy focus:ring-gov-navy border-slate-300"
          />
          <span className="text-xs font-semibold text-slate-800">
            Show only eligible roles for my profile
          </span>
        </label>
      </div>

      {/* Sort By */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
          Sort Results By
        </label>
        <select
          value={filters.sortBy}
          onChange={(e) => onFilterChange({ ...filters, sortBy: e.target.value })}
          className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-gov-navy/20 focus:border-gov-navy bg-white"
        >
          <option value="compatibility">Compatibility Score (AI Ranked)</option>
          <option value="deadline">Application Deadline (Urgent first)</option>
          <option value="createdAt">Date Posted (Newest)</option>
          <option value="stipend">Stipend Amount</option>
        </select>
      </div>
    </div>
  );
};
