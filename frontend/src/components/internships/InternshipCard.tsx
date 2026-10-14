import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CompatibilityScoreBadge } from './CompatibilityScoreBadge';
import { EligibilityBadge } from './EligibilityBadge';
import { Badge } from '../common/Badge';
import { ApplyModal } from './ApplyModal';
import { RecommendationExplanationModal } from './RecommendationExplanationModal';
import {
  Building2,
  MapPin,
  Calendar,
  Clock,
  Bookmark,
  BookmarkCheck,
  Send,
  Sparkles,
  Info,
  CheckCircle2,
} from 'lucide-react';
import { Internship } from '../../types';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/client';

interface InternshipCardProps {
  internship: Internship;
  onRefresh?: () => void;
}

export const InternshipCard: React.FC<InternshipCardProps> = ({ internship, onRefresh }) => {
  const { isAuthenticated, user } = useAuth();
  const [isSaved, setIsSaved] = useState(internship.isSaved || false);
  const [hasApplied, setHasApplied] = useState(internship.hasApplied || false);
  const [isApplying, setIsApplying] = useState(false);
  const [isExplanationOpen, setIsExplanationOpen] = useState(false);
  const [applyModalOpen, setApplyModalOpen] = useState(false);

  const handleToggleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuthenticated || user?.role !== 'STUDENT') {
      window.location.href = '/login';
      return;
    }
    try {
      const res = await api.post(`/internships/${internship.id}/save`);
      setIsSaved(res.data.data.saved);
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error('Failed to toggle save:', err);
    }
  };

  const handleApplyClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuthenticated || user?.role !== 'STUDENT') {
      window.location.href = '/login';
      return;
    }
    setApplyModalOpen(true);
  };

  const formattedDeadline = new Date(internship.deadline).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <>
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between p-5 relative group">
        <div>
          {/* Top Organization & Action Row */}
          <div className="flex justify-between items-start gap-3 mb-2.5">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-gov-navy shrink-0 font-bold text-xs">
                <Building2 className="w-4 h-4 text-gov-navy" />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-semibold text-slate-700 truncate">
                  {internship.organization?.name || 'Partner Organization'}
                </h4>
                <p className="text-[11px] text-slate-500 capitalize">{internship.domain}</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={handleToggleSave}
                className={`p-1.5 rounded-lg border transition-colors ${
                  isSaved
                    ? 'bg-amber-50 text-amber-600 border-amber-200'
                    : 'text-slate-400 hover:text-slate-700 border-transparent hover:border-slate-200 hover:bg-slate-50'
                }`}
                title={isSaved ? 'Saved in Bookmarks' : 'Save Internship'}
              >
                {isSaved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Title */}
          <Link
            to={`/internships/${internship.id}`}
            className="block text-base font-bold text-slate-900 group-hover:text-gov-navy transition-colors line-clamp-1 mb-2"
          >
            {internship.title}
          </Link>

          {/* Badges: Eligibility and AI Compatibility */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <EligibilityBadge status={internship.eligibilityStatus || 'ELIGIBLE'} size="sm" />
            {internship.compatibilityScore !== undefined && internship.compatibilityScore !== null && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  setIsExplanationOpen(true);
                }}
                className="hover:opacity-90 transition-opacity"
              >
                <CompatibilityScoreBadge score={internship.compatibilityScore} size="sm" />
              </button>
            )}
          </div>

          {/* Location & Duration & Stipend Pills */}
          <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 mb-3.5 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
            <div className="flex items-center gap-1.5 truncate">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">
                {internship.location} ({internship.workMode.toLowerCase()})
              </span>
            </div>
            <div className="flex items-center gap-1.5 truncate">
              <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>{internship.durationMonths} Months</span>
            </div>
            <div className="flex items-center gap-1.5 truncate">
              <span className="font-semibold text-emerald-700">₹{internship.stipendAmount.toLocaleString()}</span>
              <span className="text-[10px] text-slate-400">/mo</span>
            </div>
            <div className="flex items-center gap-1.5 truncate">
              <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="text-[11px] text-slate-500">Apply by {formattedDeadline}</span>
            </div>
          </div>

          {/* Required Skills list */}
          <div className="mb-4">
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
              Required Skills
            </p>
            <div className="flex flex-wrap gap-1.5">
              {internship.skills && internship.skills.length > 0 ? (
                internship.skills.slice(0, 4).map((is) => (
                  <Badge
                    key={is.id || is.skillId}
                    variant={is.isRequired ? 'primary' : 'neutral'}
                    size="sm"
                  >
                    {is.skill?.name || 'Skill'}
                  </Badge>
                ))
              ) : (
                <span className="text-xs text-slate-400">Standard general skills</span>
              )}
              {internship.skills && internship.skills.length > 4 && (
                <span className="text-[11px] text-slate-400 px-1 py-0.5">
                  +{internship.skills.length - 4} more
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons Row */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          {internship.reasons && internship.reasons.length > 0 ? (
            <button
              onClick={() => setIsExplanationOpen(true)}
              className="text-xs font-semibold text-gov-navy hover:text-gov-navyLight flex items-center gap-1 py-1"
            >
              <Info className="w-3.5 h-3.5" />
              Why Matched
            </button>
          ) : (
            <Link
              to={`/internships/${internship.id}`}
              className="text-xs font-semibold text-slate-600 hover:text-gov-navy py-1"
            >
              View Details
            </Link>
          )}

          <div className="flex items-center gap-2">
            <Link
              to={`/internships/${internship.id}`}
              className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              Details
            </Link>

            {hasApplied ? (
              <span className="px-3.5 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-100 rounded-lg flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Applied
              </span>
            ) : (
              <button
                onClick={handleApplyClick}
                className="px-3.5 py-1.5 text-xs font-semibold text-white bg-gov-navy hover:bg-gov-navyLight rounded-lg transition-colors flex items-center gap-1 shadow-sm"
              >
                <Send className="w-3 h-3" /> Apply
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Explanation Modal */}
      <RecommendationExplanationModal
        isOpen={isExplanationOpen}
        onClose={() => setIsExplanationOpen(false)}
        internship={internship}
      />

      {/* Apply Modal */}
      <ApplyModal
        isOpen={applyModalOpen}
        onClose={() => setApplyModalOpen(false)}
        internship={internship}
        onSuccess={() => {
          setHasApplied(true);
          if (onRefresh) onRefresh();
        }}
      />
    </>
  );
};
