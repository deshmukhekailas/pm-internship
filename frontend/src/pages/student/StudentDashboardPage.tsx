import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { StatCard } from '../../components/common/StatCard';
import { ProgressBar } from '../../components/common/ProgressBar';
import { CompatibilityScoreBadge } from '../../components/internships/CompatibilityScoreBadge';
import { EligibilityBadge } from '../../components/internships/EligibilityBadge';
import { CardSkeleton } from '../../components/common/LoadingSkeleton';
import api from '../../api/client';
import {
  Sparkles,
  CheckCircle2,
  Bookmark,
  Send,
  Building2,
  MapPin,
  Clock,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  BookOpen,
  ChevronRight,
  FileCheck,
} from 'lucide-react';
import { Recommendation, Application, StudentProfile } from '../../types';

export const StudentDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [skillGapSummary, setSkillGapSummary] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const [profileRes, recsRes, appsRes, skillRes] = await Promise.all([
        api.get('/student/profile'),
        api.get('/recommendations?limit=6'),
        api.get('/applications'),
        api.get('/recommendations/skill-gap'),
      ]);

      setProfile(profileRes.data.data);
      setRecommendations(recsRes.data.data || []);
      setApplications(appsRes.data.data || []);
      setSkillGapSummary(skillRes.data.data);
    } catch (err) {
      console.error('Failed to load student dashboard:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const topRec = recommendations[0];
  const eligibleCount = recommendations.filter((r) => r.eligibilityStatus === 'ELIGIBLE').length;
  const completion = profile?.profileCompletionPercentage || 40;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="h-28 bg-white rounded-xl animate-pulse"></div>
          <div className="h-28 bg-white rounded-xl animate-pulse"></div>
          <div className="h-28 bg-white rounded-xl animate-pulse"></div>
          <div className="h-28 bg-white rounded-xl animate-pulse"></div>
        </div>
        <CardSkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-gov-navy to-slate-900 text-white p-6 sm:p-8 rounded-2xl shadow-md border border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-amber-300">
            <Sparkles className="w-3.5 h-3.5 text-gov-saffron" />
            <span>PM Internship Scheme • Candidate Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold">
            Welcome back, {user?.firstName}!
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            We've analyzed your education, skills, and preferences. You currently have{' '}
            <strong className="text-amber-400 font-bold">{eligibleCount} eligible internships</strong>{' '}
            ready for review.
          </p>
        </div>

        {/* Profile Completion Widget */}
        <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20 w-full md:w-72 shrink-0 space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-slate-200">Profile Completion</span>
            <span className="font-bold text-amber-400">{completion}%</span>
          </div>
          <ProgressBar value={completion} color="saffron" size="sm" showPercent={false} />
          {completion < 100 ? (
            <Link
              to="/student/profile"
              className="text-[11px] text-amber-300 hover:text-white flex items-center gap-1 font-medium transition-colors"
            >
              <span>Complete profile to boost match precision</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          ) : (
            <p className="text-[11px] text-emerald-300 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> All sections fully verified
            </p>
          )}
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="Eligible Roles"
          value={eligibleCount}
          subtitle="Matching all rules"
          icon={CheckCircle2}
          color="green"
        />
        <StatCard
          title="AI Recommendations"
          value={recommendations.length}
          subtitle="Ranked by suitability"
          icon={Sparkles}
          color="saffron"
        />
        <StatCard
          title="Applications"
          value={applications.length}
          subtitle="Active submissions"
          icon={Send}
          color="navy"
        />
        <StatCard
          title="Bookmarked"
          value={profile?.resumes?.length ? 1 : 0}
          subtitle="Saved for later"
          icon={Bookmark}
          color="blue"
        />
      </div>

      {/* Top Recommendation Spotlight Card */}
      {topRec && (
        <div className="bg-white rounded-2xl border-2 border-gov-saffron/40 shadow-md p-6 relative overflow-hidden space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-md bg-amber-100 text-amber-900 font-bold text-xs flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-gov-saffron" />
                TOP AI RECOMMENDATION
              </span>
              <EligibilityBadge status={topRec.eligibilityStatus} size="sm" />
            </div>
            <CompatibilityScoreBadge score={topRec.compatibilityScore} size="lg" />
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pt-2">
            <div>
              <h2 className="text-xl font-bold text-slate-900 hover:text-gov-navy transition-colors">
                <Link to={`/internships/${topRec.internshipId}`}>{topRec.internship.title}</Link>
              </h2>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 mt-1">
                <span className="font-semibold text-slate-800 flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5 text-gov-navy" />
                  {topRec.internship.organization.name}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {topRec.internship.location} ({topRec.internship.workMode})
                </span>
                <span>•</span>
                <span className="font-bold text-emerald-700">
                  ₹{topRec.internship.stipendAmount.toLocaleString()}/month
                </span>
              </div>
            </div>

            <Link
              to={`/internships/${topRec.internshipId}`}
              className="px-5 py-2.5 bg-gov-navy hover:bg-gov-navyLight text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center gap-1.5 shrink-0"
            >
              <span>View Full Match Breakdown</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Explainability Bullets on Card */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
            <h4 className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">
              Why this is recommended for you:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {topRec.reasons.map((r, i) => (
                <div
                  key={i}
                  className={`flex items-start gap-2 ${
                    r.startsWith('✓')
                      ? 'text-emerald-800 font-medium'
                      : r.startsWith('△')
                      ? 'text-amber-800'
                      : 'text-slate-700'
                  }`}
                >
                  <span>{r}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Two Column Layout: Recommended Feed & Skill Gap Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left: Recommended Feed */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-gov-saffron" />
                Personalized Recommendations
              </h3>
              <p className="text-xs text-slate-500">Ranked by multi-factor suitability algorithm</p>
            </div>
            <Link
              to="/student/recommendations"
              className="text-xs font-semibold text-gov-navy hover:underline flex items-center gap-1"
            >
              <span>View All ({recommendations.length})</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="space-y-3">
            {recommendations.slice(1, 4).map((rec) => (
              <div
                key={rec.id}
                className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-500">
                      {rec.internship.organization.name}
                    </span>
                    <EligibilityBadge status={rec.eligibilityStatus} size="sm" />
                  </div>
                  <Link
                    to={`/internships/${rec.internshipId}`}
                    className="font-bold text-sm text-slate-900 hover:text-gov-navy transition-colors block"
                  >
                    {rec.internship.title}
                  </Link>
                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span>{rec.internship.location}</span>
                    <span>•</span>
                    <span className="text-emerald-700 font-semibold">
                      ₹{rec.internship.stipendAmount.toLocaleString()}/mo
                    </span>
                    <span>•</span>
                    <span>{rec.internship.durationMonths} Mos</span>
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2">
                  <CompatibilityScoreBadge score={rec.compatibilityScore} size="sm" />
                  <Link
                    to={`/internships/${rec.internshipId}`}
                    className="text-xs font-semibold text-gov-navy hover:text-gov-navyLight"
                  >
                    Details & Apply →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Skill Gap & Learning Pathways Widget */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <BookOpen className="w-4 h-4 text-gov-navy" />
            <div>
              <h3 className="font-bold text-sm text-slate-900">AI Skill Gap Analysis</h3>
              <p className="text-[11px] text-slate-500">Skills to boost your match scores</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs">
              <span className="text-slate-500">Your verified skills:</span>
              <div className="flex flex-wrap gap-1 mt-1.5">
                {skillGapSummary?.currentSkills?.slice(0, 5).map((sk: string, i: number) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded bg-white border border-slate-200 text-[11px] text-slate-700 font-medium"
                  >
                    {sk}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-slate-700">Recommended Skills to Add:</h4>
              {skillGapSummary?.highImpactMissingSkills?.map((item: any, idx: number) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-lg border border-amber-200 bg-amber-50/60 text-xs flex justify-between items-center"
                >
                  <div>
                    <span className="font-bold text-slate-800">{item.skill}</span>
                    <p className="text-[10px] text-slate-500">
                      Found in {item.frequencyInTopMatches} of your top matches
                    </p>
                  </div>
                  <Link
                    to="/student/profile"
                    className="text-[11px] font-bold text-gov-navy hover:underline"
                  >
                    + Add Skill
                  </Link>
                </div>
              ))}
            </div>

            <p className="text-[11px] text-slate-400 italic pt-1">
              Adding missing skills that you possess directly increases your compatibility ranking in
              future calculations.
            </p>
          </div>
        </div>
      </div>

      {/* Recent Applications Tracking */}
      {applications.length > 0 && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-1.5">
                <FileCheck className="w-4 h-4 text-gov-navy" />
                Recent Applications
              </h3>
              <p className="text-xs text-slate-500">Live review status from partner organizations</p>
            </div>
            <Link
              to="/student/applications"
              className="text-xs font-semibold text-gov-navy hover:underline"
            >
              View All Applications →
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {applications.slice(0, 3).map((app) => (
              <div key={app.id} className="py-3 flex justify-between items-center text-xs">
                <div>
                  <h4 className="font-semibold text-slate-800">{app.internship.title}</h4>
                  <p className="text-slate-500 text-[11px]">{app.internship.organization.name}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`px-2.5 py-1 rounded-md font-bold text-[11px] ${
                      app.status === 'ACCEPTED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : app.status === 'SHORTLISTED'
                        ? 'bg-blue-100 text-blue-800'
                        : app.status === 'UNDER_REVIEW'
                        ? 'bg-amber-100 text-amber-800'
                        : app.status === 'REJECTED'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {app.status.replace('_', ' ')}
                  </span>
                  <Link
                    to={`/student/applications/${app.id}`}
                    className="text-gov-navy font-semibold hover:underline"
                  >
                    Track
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
