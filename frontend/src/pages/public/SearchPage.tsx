import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { InternshipCard } from '../../components/internships/InternshipCard';
import { FilterPanel } from '../../components/internships/FilterPanel';
import { CardSkeleton } from '../../components/common/LoadingSkeleton';
import api from '../../api/client';
import { Internship } from '../../types';

export const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [filters, setFilters] = useState({
    keyword: searchParams.get('keyword') || '',
    domain: searchParams.get('domain') || 'ALL',
    workMode: searchParams.get('workMode') || 'ALL',
    location: searchParams.get('location') || 'ALL',
    state: searchParams.get('state') || 'ALL',
    minStipend: searchParams.get('minStipend') ? Number(searchParams.get('minStipend')) : ('' as any),
    durationMonths: searchParams.get('durationMonths') ? Number(searchParams.get('durationMonths')) : ('' as any),
    onlyEligible: searchParams.get('onlyEligible') === 'true',
    sortBy: searchParams.get('sortBy') || 'compatibility',
  });

  const [page, setPage] = useState(1);
  const [internships, setInternships] = useState<Internship[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  useEffect(() => {
    fetchInternships();
  }, [filters, page]);

  const fetchInternships = async () => {
    setIsLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (filters.keyword) queryParams.set('keyword', filters.keyword);
      if (filters.domain && filters.domain !== 'ALL') queryParams.set('domain', filters.domain);
      if (filters.workMode && filters.workMode !== 'ALL') queryParams.set('workMode', filters.workMode);
      if (filters.state && filters.state !== 'ALL') queryParams.set('state', filters.state);
      if (filters.location && filters.location !== 'ALL') queryParams.set('location', filters.location);
      if (filters.minStipend) queryParams.set('minStipend', String(filters.minStipend));
      if (filters.onlyEligible) queryParams.set('onlyEligible', 'true');
      if (filters.sortBy) queryParams.set('sortBy', filters.sortBy);
      queryParams.set('page', String(page));
      queryParams.set('limit', '12');

      const res = await api.get(`/internships?${queryParams.toString()}`);
      setInternships(res.data.data || []);
      setTotalCount(res.data.meta?.total || 0);
      setTotalPages(res.data.meta?.totalPages || 1);
    } catch (err) {
      console.error('Failed to load internships:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setFilters({
      keyword: '',
      domain: 'ALL',
      workMode: 'ALL',
      location: 'ALL',
      state: 'ALL',
      minStipend: '',
      durationMonths: '',
      onlyEligible: false,
      sortBy: 'compatibility',
    });
    setPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Banner & Search Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div>
          <span className="text-xs font-bold text-gov-saffron uppercase tracking-wider">
            PM INTERNSHIP SCHEME PORTAL
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gov-navy mt-1">
            Explore Internship Opportunities
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Browse verified openings in top companies. Filter by domain, eligibility, or stipend.
          </p>
        </div>

        {/* Search input bar */}
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={filters.keyword}
              onChange={(e) => {
                setFilters({ ...filters, keyword: e.target.value });
                setPage(1);
              }}
              placeholder="Search by role title, technical skill (Python, React, AutoCAD), or organization..."
              className="w-full text-xs sm:text-sm pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-gov-navy/20 focus:border-gov-navy"
            />
          </div>
          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="md:hidden p-2.5 bg-slate-100 text-slate-700 rounded-xl border border-slate-200 hover:bg-slate-200 flex items-center gap-1.5 text-xs font-semibold"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filters</span>
          </button>
        </div>
      </div>

      {/* Main Grid Layout: Left Filters, Right Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
        {/* Desktop Filter Panel */}
        <div className="hidden md:block col-span-1 sticky top-24">
          <FilterPanel
            filters={filters}
            onFilterChange={(newF) => {
              setFilters(newF);
              setPage(1);
            }}
            onReset={handleReset}
          />
        </div>

        {/* Mobile Filter Drawer */}
        {mobileFilterOpen && (
          <div className="md:hidden col-span-1">
            <FilterPanel
              filters={filters}
              onFilterChange={(newF) => {
                setFilters(newF);
                setPage(1);
              }}
              onReset={handleReset}
            />
          </div>
        )}

        {/* Results Area */}
        <div className="col-span-1 md:col-span-3 space-y-4">
          {/* Result Count and Sort Indicator */}
          <div className="flex justify-between items-center text-xs text-slate-600 bg-white px-4 py-2.5 rounded-xl border border-slate-200">
            <span>
              Showing <strong>{internships.length}</strong> of <strong>{totalCount}</strong> opportunities
            </span>
            <span className="text-slate-400">Page {page} of {totalPages}</span>
          </div>

          {/* Internship Cards */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
            </div>
          ) : internships.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {internships.map((internship) => (
                <InternshipCard
                  key={internship.id}
                  internship={internship}
                  onRefresh={fetchInternships}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-800">No matching internships found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try adjusting your search keywords, broadening your domain filter, or unchecking the "Only Eligible" filter.
              </p>
              <button
                onClick={handleReset}
                className="px-4 py-2 text-xs font-semibold text-white bg-gov-navy hover:bg-gov-navyLight rounded-lg transition-colors inline-block"
              >
                Reset All Filters
              </button>
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 pt-6">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`w-8 h-8 text-xs font-semibold rounded-lg transition-colors ${
                    page === i + 1
                      ? 'bg-gov-navy text-white'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
