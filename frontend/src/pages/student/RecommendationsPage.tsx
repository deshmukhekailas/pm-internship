import React, { useState, useEffect } from 'react';
import api from '../../api/client';
import { InternshipCard } from '../../components/internships/InternshipCard';
import { CardSkeleton } from '../../components/common/LoadingSkeleton';
import { Sparkles, RotateCw, Filter, ShieldCheck, Star } from 'lucide-react';
import { Recommendation } from '../../types';

export const RecommendationsPage: React.FC = () => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [minScore, setMinScore] = useState<number | ''>('');
  const [domain, setDomain] = useState('ALL');
  const [isLoading, setIsLoading] = useState(true);
  const [isRecalculating, setIsRecalculating] = useState(false);

  useEffect(() => {
    fetchRecommendations();
  }, [minScore, domain]);

  const fetchRecommendations = async () => {
    setIsLoading(true);
    try {
      const query = new URLSearchParams();
      if (minScore) query.set('minScore', String(minScore));
      if (domain && domain !== 'ALL') query.set('domain', domain);

      const res = await api.get(`/recommendations?${query.toString()}`);
      setRecommendations(res.data.data || []);
    } catch (err) {
      console.error('Failed to load recommendations:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRecalculate = async () => {
    setIsRecalculating(true);
    try {
      const res = await api.post('/recommendations/generate');
      setRecommendations(res.data.data || []);
    } catch (err) {
      console.error('Failed to regenerate recommendations:', err);
    } finally {
      setIsRecalculating(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-xs font-bold text-gov-saffron uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> AI CAREER ADVISORY ENGINE
          </span>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">Recommended Internships</h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Personalized matches ranked by verified skills, degree branch, academic readiness, and location preferences.
          </p>
        </div>

        <button
          onClick={handleRecalculate}
          disabled={isRecalculating}
          className="px-4 py-2 bg-gov-navy hover:bg-gov-navyLight disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center gap-1.5 shrink-0"
        >
          <RotateCw className={`w-3.5 h-3.5 ${isRecalculating ? 'animate-spin' : ''}`} />
          <span>{isRecalculating ? 'Recalculating...' : 'Recalculate Matches'}</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-slate-600 font-semibold">
            <Filter className="w-3.5 h-3.5 text-gov-navy" />
            <span>Filter By:</span>
          </div>

          <select
            value={minScore}
            onChange={(e) => setMinScore(e.target.value ? Number(e.target.value) : '')}
            className="p-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-gov-navy/20 focus:border-gov-navy bg-white"
          >
            <option value="">All Compatibility Scores</option>
            <option value="85">High Match (≥ 85%)</option>
            <option value="70">Strong Match (≥ 70%)</option>
            <option value="50">Moderate Match (≥ 50%)</option>
          </select>

          <select
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            className="p-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-gov-navy/20 focus:border-gov-navy bg-white"
          >
            <option value="ALL">All Domains</option>
            <option value="Software">Software Development</option>
            <option value="Intelligence">Artificial Intelligence</option>
            <option value="Mechanical">Mechanical Engineering</option>
            <option value="Civil">Civil Infrastructure</option>
            <option value="Financial">Financial Services</option>
          </select>
        </div>

        <div className="text-slate-500 font-medium">
          Showing <strong>{recommendations.length}</strong> calculated recommendations
        </div>
      </div>

      {/* Recommendation Cards Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : recommendations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendations.map((rec) => (
            <InternshipCard
              key={rec.id}
              internship={{
                ...rec.internship,
                compatibilityScore: rec.compatibilityScore,
                eligibilityStatus: rec.eligibilityStatus,
                isSaved: rec.isSaved,
                hasApplied: rec.hasApplied,
                reasons: rec.reasons,
              }}
              onRefresh={fetchRecommendations}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-3">
          <Sparkles className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="font-bold text-slate-800 text-base">No recommendations matching criteria</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your score filter or domain. You can also recalculate matches or add more skills to your profile.
          </p>
        </div>
      )}
    </div>
  );
};
