import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/client';
import { FileCheck, Building2, MapPin, Calendar, Clock, ChevronRight, XCircle } from 'lucide-react';
import { Application } from '../../types';

export const ApplicationsPage: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/applications');
      setApplications(res.data.data || []);
    } catch (err) {
      console.error('Failed to load applications:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleWithdraw = async (appId: string) => {
    if (!confirm('Are you sure you want to withdraw this application? This cannot be undone.')) return;
    try {
      await api.post(`/applications/${appId}/withdraw`);
      fetchApplications();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to withdraw application.');
    }
  };

  const getStatusBadge = (status: string) => {
    const config: Record<string, { bg: string; text: string }> = {
      APPLIED: { bg: 'bg-blue-100 text-blue-800 border-blue-200', text: 'Submitted / Applied' },
      UNDER_REVIEW: { bg: 'bg-amber-100 text-amber-800 border-amber-200', text: 'Under Review' },
      SHORTLISTED: { bg: 'bg-purple-100 text-purple-800 border-purple-200', text: 'Shortlisted for Interview' },
      ACCEPTED: { bg: 'bg-emerald-100 text-emerald-800 border-emerald-200', text: 'Offer Extended / Selected' },
      REJECTED: { bg: 'bg-rose-100 text-rose-800 border-rose-200', text: 'Not Shortlisted' },
      WITHDRAWN: { bg: 'bg-slate-100 text-slate-600 border-slate-200', text: 'Application Withdrawn' },
    };

    const c = config[status] || { bg: 'bg-slate-100 text-slate-700', text: status };
    return (
      <span className={`px-2.5 py-1 rounded-md text-xs font-bold border ${c.bg}`}>
        {c.text}
      </span>
    );
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <span className="text-xs font-bold text-gov-saffron uppercase tracking-wider flex items-center gap-1.5">
          <FileCheck className="w-3.5 h-3.5" /> APPLICATION STATUS TRACKER
        </span>
        <h1 className="text-2xl font-bold text-slate-900 mt-1">My Submitted Applications</h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Track the live evaluation progress and status updates for all your internship submissions.
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          <div className="h-20 bg-white rounded-xl animate-pulse"></div>
          <div className="h-20 bg-white rounded-xl animate-pulse"></div>
        </div>
      ) : applications.length > 0 ? (
        <div className="space-y-3">
          {applications.map((app) => (
            <div
              key={app.id}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
            >
              <div className="space-y-1.5 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-600 flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-gov-navy" />
                    {app.internship.organization.name}
                  </span>
                  <span>•</span>
                  <span className="text-xs text-slate-500">{app.internship.domain}</span>
                </div>

                <Link
                  to={`/student/applications/${app.id}`}
                  className="text-base font-bold text-slate-900 hover:text-gov-navy transition-colors block"
                >
                  {app.internship.title}
                </Link>

                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {app.internship.location} ({app.internship.workMode})
                  </span>
                  <span>•</span>
                  <span>
                    Applied on: <strong>{new Date(app.appliedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</strong>
                  </span>
                  {app.matchScoreAtApplication && (
                    <>
                      <span>•</span>
                      <span className="text-gov-navy font-semibold">
                        Match Score at Submission: {app.matchScoreAtApplication}%
                      </span>
                    </>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-between md:justify-end pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                {getStatusBadge(app.status)}

                <div className="flex items-center gap-2">
                  <Link
                    to={`/student/applications/${app.id}`}
                    className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1"
                  >
                    <span>View Timeline</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>

                  {(app.status === 'APPLIED' || app.status === 'UNDER_REVIEW') && (
                    <button
                      onClick={() => handleWithdraw(app.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                      title="Withdraw Application"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-3">
          <FileCheck className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="font-bold text-slate-800 text-base">No applications submitted yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Discover matching internships and submit your application to top Indian enterprises.
          </p>
          <Link
            to="/internships"
            className="px-4 py-2 text-xs font-bold text-white bg-gov-navy hover:bg-gov-navyLight rounded-lg transition-colors inline-block"
          >
            Explore Opportunities
          </Link>
        </div>
      )}
    </div>
  );
};
