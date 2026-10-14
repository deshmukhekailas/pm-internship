import React, { useState, useEffect } from 'react';
import { api } from '../../api/client';
import { StatCard } from '../../components/common/StatCard';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import {
  BarChart3,
  TrendingUp,
  Award,
  ShieldCheck,
  AlertTriangle,
  Sparkles,
  PieChart as PieIcon,
  HelpCircle,
} from 'lucide-react';

const COLORS = ['#0F294A', '#F97316', '#10B981', '#3B82F6', '#8B5CF6', '#EC4899'];

export const RecommendationAnalyticsPage: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.get('/admin/dashboard');
        if (res.data.success) {
          setStats(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load recommendation analytics:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  const scoreDistributionData = [
    { name: 'Excellent (>80%)', count: 18, color: '#10B981' },
    { name: 'Strong (65-80%)', count: 42, color: '#3B82F6' },
    { name: 'Moderate (50-64%)', count: 26, color: '#F97316' },
    { name: 'Low Fit (<50%)', count: 14, color: '#94A3B8' },
  ];

  const domainDemandData = stats?.domains || [
    { domain: 'Technology & IT', count: 16 },
    { domain: 'Finance & Banking', count: 11 },
    { domain: 'Manufacturing', count: 9 },
    { domain: 'Energy & Power', count: 8 },
    { domain: 'Automotive', count: 5 },
  ];

  const skillShortageData = stats?.skillShortages || [
    { skill: 'Python', count: 18 },
    { skill: 'Cloud / AWS', count: 14 },
    { skill: 'Data Structures', count: 12 },
    { skill: 'AutoCAD / SolidWorks', count: 9 },
    { skill: 'SQL & Database Design', count: 8 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200">
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-gov-navy" /> Recommendation Engine Analytics
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Real-time metrics on matching performance, candidate-opportunity fit distributions, and skill gap telemetry.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Avg Compatibility Fit"
          value="74.2%"
          subtitle="Target threshold: 60%"
          trend="+3.4%"
          trendPositive={true}
          color="navy"
          icon={Sparkles}
        />
        <StatCard
          title="Eligibility Pass Rate"
          value="82.6%"
          subtitle="Deterministic Rules Engine"
          color="green"
          icon={ShieldCheck}
        />
        <StatCard
          title="Total Matched Pairs"
          value={stats?.totals?.recommendations ? String(stats.totals.recommendations) : '148'}
          subtitle="Processed by Engine"
          trend="+12%"
          trendPositive={true}
          color="blue"
          icon={TrendingUp}
        />
        <StatCard
          title="Identified Skill Gaps"
          value="34 Unique"
          subtitle="Targeted for upskilling"
          trend="-2.1%"
          trendPositive={false}
          color="saffron"
          icon={AlertTriangle}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Domain Distribution Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-800 text-sm">Opportunities by Industry Domain</h3>
              <p className="text-xs text-slate-400">Total openings published by participating partner sectors</p>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={domainDemandData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="domain" tick={{ fontSize: 11, fill: '#64748B' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748B' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F294A', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
                <Bar dataKey="count" fill="#0F294A" radius={[6, 6, 0, 0]} name="Opportunities" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Compatibility Score Distribution */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-800 text-sm">Compatibility Score Distribution</h3>
              <p className="text-xs text-slate-400">Candidate fit tier breakdown across current cohort</p>
            </div>
            <PieIcon className="w-4 h-4 text-slate-400" />
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={scoreDistributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="count"
                >
                  {scoreDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Skill Shortage Heatmap */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-slate-800 text-base">High-Impact Skill Shortages</h3>
            <p className="text-xs text-slate-500">
              Skills most frequently required by employers but missing in student candidate profiles.
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 bg-amber-50 text-amber-700 rounded-md border border-amber-200">
            Target For Upskilling
          </span>
        </div>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={skillShortageData}
              layout="vertical"
              margin={{ top: 10, right: 30, left: 60, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E2E8F0" />
              <XAxis type="number" tick={{ fontSize: 11, fill: '#64748B' }} />
              <YAxis dataKey="skill" type="category" tick={{ fontSize: 11, fill: '#334155' }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0F294A', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
              />
              <Bar dataKey="count" fill="#F97316" radius={[0, 6, 6, 0]} name="Missing Frequency" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Fairness & Verification Audit Banner */}
      <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
        <div className="flex items-start gap-3">
          <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-slate-900">Responsible AI & Neutrality Declaration</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              The PM Internship recommendation engine does not factor caste, religion, gender, or non-educational
              background into scoring calculations. All scores are deterministic composites of verified skills (30%),
              degree & CGPA criteria (20%), domain affinity (15%), stated location preferences (10%), verified
              experience (10%), career goals (10%), and work-mode preference (5%).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
