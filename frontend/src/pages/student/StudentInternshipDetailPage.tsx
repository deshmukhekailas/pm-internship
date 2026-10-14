import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api/client';
import { CompatibilityScoreBadge } from '../../components/internships/CompatibilityScoreBadge';
import { EligibilityBadge } from '../../components/internships/EligibilityBadge';
import { Badge } from '../../components/common/Badge';
import { ProgressBar } from '../../components/common/ProgressBar';
import { ApplyModal } from '../../components/internships/ApplyModal';
import { RecommendationExplanationModal } from '../../components/internships/RecommendationExplanationModal';
import {
  Building2,
  MapPin,
  Calendar,
  Clock,
  Bookmark,
  BookmarkCheck,
  Send,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Users,
  ShieldCheck,
  BookOpen,
} from 'lucide-react';
import { Internship } from '../../types';
import { useAuth } from '../../context/AuthContext';

export const StudentInternshipDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated, user } = useAuth();
  const [internship, setInternship] = useState<Internship | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [explanationModalOpen, setExplanationModalOpen] = useState(false);

  useEffect(() => {
    fetchInternship();
  }, [id]);

  const fetchInternship = async () => {
    setIsLoading(true);
    try {
      const res = await api.get(`/internships/${id}`);
      const data = res.data.data;
      setInternship(data);
      setIsSaved(data.isSaved || false);
    } catch (err) {
      console.error('Failed to load internship:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleSave = async () => {
    if (!isAuthenticated) {
      window.location.href = '/login';
      return;
    }
    try {
      const res = await api.post(`/internships/${id}/save`);
      setIsSaved(res.data.data.saved);
    } catch (err) {
      console.error(err);
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center text-xs text-slate-500">Loading internship details...</div>;
  }

  if (!internship) {
    return (
      <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-3">
        <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
        <h3 className="text-base font-bold text-slate-800">Internship not found</h3>
        <Link to="/internships" className="text-xs text-gov-navy font-bold hover:underline">
          ← Back to all internships
        </Link>
      </div>
    );
  }

  const analysis = internship.candidateAnalysis;
  const factors = analysis?.factors;
  const skillGap = analysis?.skillGap;

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      <Link
        to="/internships"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-gov-navy"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back to internships list
      </Link>

      {/* Main Header Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                {internship.domain}
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-xs font-semibold text-slate-600">{internship.department}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
              {internship.title}
            </h1>
            <div className="flex items-center gap-3 text-sm text-slate-700">
              <span className="font-bold flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-gov-navy" />
                {internship.organization.name}
              </span>
              {internship.organization.isGovernmentPartner && (
                <span className="bg-emerald-50 text-emerald-800 border border-emerald-300 text-[10px] font-semibold px-2 py-0.5 rounded">
                  Top 500 Scheme Partner
                </span>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
            <button
              onClick={handleToggleSave}
              className={`p-2.5 rounded-xl border transition-colors flex items-center gap-1 text-xs font-semibold ${
                isSaved
                  ? 'bg-amber-50 text-amber-700 border-amber-300'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
              }`}
            >
              {isSaved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
              <span>{isSaved ? 'Saved' : 'Save'}</span>
            </button>

            {internship.hasApplied ? (
              <span className="px-5 py-2.5 bg-emerald-100 text-emerald-800 font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-sm">
                <CheckCircle2 className="w-4 h-4" /> Application Submitted
              </span>
            ) : (
              <button
                onClick={() => setApplyModalOpen(true)}
                className="flex-1 sm:flex-initial px-6 py-2.5 bg-gov-navy hover:bg-gov-navyLight text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Apply for Internship</span>
              </button>
            )}
          </div>
        </div>

        {/* Highlight Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
          <div>
            <span className="text-slate-400">Monthly Stipend:</span>
            <p className="font-extrabold text-emerald-700 text-base mt-0.5">
              ₹{internship.stipendAmount.toLocaleString()}/month
            </p>
          </div>
          <div>
            <span className="text-slate-400">Duration:</span>
            <p className="font-bold text-slate-800 text-base mt-0.5">{internship.durationMonths} Months</p>
          </div>
          <div>
            <span className="text-slate-400">Location & Work Mode:</span>
            <p className="font-bold text-slate-800 text-sm mt-0.5 truncate">
              {internship.location} ({internship.workMode})
            </p>
          </div>
          <div>
            <span className="text-slate-400">Openings Available:</span>
            <p className="font-bold text-slate-800 text-base mt-0.5">{internship.openings} Positions</p>
          </div>
        </div>
      </div>

      {/* Candidate Compatibility Card */}
      {analysis && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50/40 p-6 rounded-2xl border border-blue-200 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div className="space-y-1">
              <span className="text-xs font-bold text-gov-navy uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-gov-saffron" />
                YOUR PERSONALIZED MATCH ANALYSIS
              </span>
              <h3 className="text-lg font-bold text-slate-900">
                Compatibility Breakdown & AI Assessment
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <EligibilityBadge status={analysis.eligibility.status} />
              <CompatibilityScoreBadge score={analysis.compatibilityScore} size="lg" />
            </div>
          </div>

          {/* Rationale bullet points */}
          <div className="space-y-2 pt-2">
            {analysis.reasons.map((r, i) => (
              <div
                key={i}
                className={`p-3 rounded-lg border text-xs leading-relaxed flex items-start gap-2.5 ${
                  r.startsWith('✓')
                    ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900 font-medium'
                    : r.startsWith('△')
                    ? 'bg-amber-50/80 border-amber-200 text-amber-900'
                    : 'bg-white border-slate-200 text-slate-700'
                }`}
              >
                <span>{r}</span>
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={() => setExplanationModalOpen(true)}
              className="text-xs font-bold text-gov-navy hover:underline flex items-center gap-1"
            >
              View detailed factor percentages & learning pathways →
            </button>
          </div>
        </div>
      )}

      {/* Job Description & Responsibilities */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <h3 className="text-base font-bold text-slate-900">Internship Description</h3>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
              {internship.description}
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <h3 className="text-base font-bold text-slate-900">Key Responsibilities & Project Tasks</h3>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
              {internship.responsibilities}
            </p>
          </div>

          {/* Skills Requirements Section */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900">Skills Requirements</h3>
            <div className="space-y-3">
              <div>
                <span className="text-xs font-semibold text-slate-600 block mb-2">
                  Mandatory Required Skills:
                </span>
                <div className="flex flex-wrap gap-2">
                  {internship.skills
                    ?.filter((s) => s.isRequired)
                    .map((is) => (
                      <Badge key={is.id} variant="primary" size="md">
                        {is.skill.name}
                      </Badge>
                    ))}
                </div>
              </div>

              <div>
                <span className="text-xs font-semibold text-slate-600 block mb-2">
                  Preferred / Advantageous Skills:
                </span>
                <div className="flex flex-wrap gap-2">
                  {internship.skills
                    ?.filter((s) => !s.isRequired)
                    .map((is) => (
                      <Badge key={is.id} variant="neutral" size="md">
                        {is.skill.name}
                      </Badge>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar: Eligibility Summary */}
        <div className="col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 text-xs">
            <h3 className="font-bold text-sm text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-gov-navy" />
              Eligibility Criteria
            </h3>

            <div className="space-y-3">
              <div>
                <span className="text-slate-400">Education Level:</span>
                <p className="font-semibold text-slate-800 capitalize">
                  {internship.eligibilityRule?.minEducationLevel.toLowerCase() || 'Undergraduate'}
                </p>
              </div>

              {internship.eligibilityRule?.allowedDegrees && (
                <div>
                  <span className="text-slate-400">Allowed Degrees:</span>
                  <p className="font-semibold text-slate-800">
                    {Array.isArray(internship.eligibilityRule.allowedDegrees)
                      ? internship.eligibilityRule.allowedDegrees.join(', ')
                      : internship.eligibilityRule.allowedDegrees}
                  </p>
                </div>
              )}

              {internship.eligibilityRule?.minCgpa && (
                <div>
                  <span className="text-slate-400">Minimum CGPA Cutoff:</span>
                  <p className="font-bold text-emerald-700">
                    {internship.eligibilityRule.minCgpa} / 10.0
                  </p>
                </div>
              )}

              <div>
                <span className="text-slate-400">Age Bracket:</span>
                <p className="font-semibold text-slate-800">
                  {internship.eligibilityRule?.minAge || 21} to {internship.eligibilityRule?.maxAge || 24} Years
                </p>
              </div>

              <div>
                <span className="text-slate-400">Application Deadline:</span>
                <p className="font-bold text-rose-600">
                  {new Date(internship.deadline).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100">
              <button
                onClick={() => setApplyModalOpen(true)}
                disabled={internship.hasApplied}
                className="w-full py-2.5 bg-gov-navy hover:bg-gov-navyLight disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{internship.hasApplied ? 'Already Applied' : 'Apply Now'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Explanation Modal */}
      <RecommendationExplanationModal
        isOpen={explanationModalOpen}
        onClose={() => setExplanationModalOpen(false)}
        internship={internship}
      />

      {/* Apply Modal */}
      <ApplyModal
        isOpen={applyModalOpen}
        onClose={() => setApplyModalOpen(false)}
        internship={internship}
        onSuccess={() => {
          setInternship({ ...internship, hasApplied: true });
        }}
      />
    </div>
  );
};
