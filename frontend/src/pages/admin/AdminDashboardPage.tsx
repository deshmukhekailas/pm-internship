import React, { useState, useEffect } from 'react';
import api from '../../api/client';
import { StatCard } from '../../components/common/StatCard';
import {
  Users,
  Briefcase,
  FileCheck,
  Building2,
  Sparkles,
  TrendingUp,
  Award,
  CheckCircle2,
  Layers,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

export const AdminDashboardPage: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/admin/dashboard');
      setStats(res.data.data);
    } catch (err) {
      console.error('Failed to load admin stats:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading || !stats) {
    return <div className="p-8 text-center text-xs text-slate-500">Loading admin analytics...</div>;
  }

  const COLORS = ['#0f2b5c', '#f97316', '#10b981', '#6366f1', '#eab308', '#ec4899'];

  const statusPieData = stats.applicationsByStatus?.map((a: any) => ({
    name: a.status.replace('_', ' '),
    value: a.count,
  })) || [];

  return (
    <div className="space-y-6 pb-12">
      {/* Directorate Header */}
      <div className="bg-gov-navy text-white p-6 sm:p-8 rounded-2xl shadow-md border border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-xs font-bold text-gov-saffron uppercase tracking-wider">
            MINISTRY OF CORPORATE AFFAIRS • PM INTERNSHIP SCHEME
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold mt-1">National Program Directorate</h1>
          <p className="text-xs text-slate-300 mt-1">
            Real-time monitoring of registrations, partner opportunities, and AI matching performance.
          </p>
        </div>

        <div className="bg-white/10 px-4 py-2 rounded-xl border border-white/20 text-xs text-center shrink-0">
          <span className="text-slate-400 block text-[10px] uppercase">Recommendation Accuracy</span>
          <strong className="text-emerald-400 text-lg">{stats.relevanceRate}% Relevant</strong>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="Registered Students"
          value={stats.totalStudents}
          subtitle="Across Indian universities"
          icon={Users}
          color="navy"
          trend="+18%"
        />
        <StatCard
          title="Active Internships"
          value={stats.activeInternships}
          subtitle={`Total: ${stats.totalInternships}`}
          icon={Briefcase}
          color="saffron"
        />
        <StatCard
          title="Total Applications"
          value={stats.totalApplications}
          subtitle={`This Month: ${stats.applicationsThisMonth}`}
          icon={FileCheck}
          color="green"
          trend="+24%"
        />
        <StatCard
          title="Avg Feedback Rating"
          value={`${stats.avgFeedbackRating} / 5.0`}
          subtitle="Candidate satisfaction"
          icon={Award}
          color="purple"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Domain Distribution Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-slate-800 flex items-center gap-2">
            <Layers className="w-4 h-4 text-gov-navy" />
            Internship Opportunities by Domain
          </h3>
          <div className="h-64 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.internshipsByDomain}>
                <XAxis dataKey="domain" tick={{ fontSize: 10 }} interval={0} angle={-15} textAnchor="end" height={40} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#0f2b5c" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Applications by Status Pie */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-slate-800 flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-gov-saffron" />
            Application Funnel & Status Breakdown
          </h3>
          <div className="h-64 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                  label
                >
                  {statusPieData.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Top Skills in Demand & System Health */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* In-Demand Skills Table */}
        <div className="md:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-slate-800 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-gov-saffron" />
            Most In-Demand Skills across Top 500 Companies
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            {stats.topSkills?.map((s: any, idx: number) => (
              <div
                key={idx}
                className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1"
              >
                <span className="font-bold text-slate-800 block truncate">{s.skill}</span>
                <span className="text-[11px] text-slate-500">
                  Required in <strong>{s.count}</strong> roles
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Operational Health */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3 text-xs">
          <h3 className="font-bold text-sm text-slate-800 flex items-center gap-2 pb-2 border-b border-slate-100">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" /> System Metrics
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-500">Recommendation Engine:</span>
              <span className="text-emerald-700 font-bold">Operational (Local ML)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Application Conversion:</span>
              <span className="font-bold text-slate-800">{stats.conversionRate}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Partner Corporations:</span>
              <span className="font-bold text-slate-800">{stats.totalOrganizations} verified</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Generated Recommendations:</span>
              <span className="font-bold text-slate-800">{stats.totalRecommendations}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
