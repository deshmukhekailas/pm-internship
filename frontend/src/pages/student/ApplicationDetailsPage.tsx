import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api/client';
import {
  FileCheck,
  Building2,
  MapPin,
  Calendar,
  Clock,
  ArrowLeft,
  CheckCircle2,
  Circle,
  AlertCircle,
  Briefcase,
} from 'lucide-react';
import { Application } from '../../types';

export const ApplicationDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [application, setApplication] = useState<Application | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchApplication();
  }, [id]);

  const fetchApplication = async () => {
    setIsLoading(true);
    try {
      const res = await api.get(`/applications/${id}`);
      setApplication(res.data.data);
    } catch (err) {
      console.error('Failed to load application:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center text-xs text-slate-500">Loading application details...</div>;
  }

  if (!application) {
    return (
      <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-3">
        <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
        <h3 className="text-base font-bold text-slate-800">Application not found</h3>
        <Link to="/student/applications" className="text-xs text-gov-navy font-bold hover:underline">
          ← Back to applications
        </Link>
      </div>
    );
  }

  const steps = [
    { title: 'Application Submitted', date: application.appliedAt, completed: true },
    {
      title: 'Profile Under Review',
      date: application.status !== 'APPLIED' ? 'Reviewed' : 'Pending Review',
      completed: application.status !== 'APPLIED',
      current: application.status === 'UNDER_REVIEW',
    },
    {
      title: 'Interview / Shortlist',
      date: application.status === 'SHORTLISTED' || application.status === 'ACCEPTED' ? 'Shortlisted' : 'Awaiting',
      completed: application.status === 'SHORTLISTED' || application.status === 'ACCEPTED',
      current: application.status === 'SHORTLISTED',
    },
    {
      title: 'Selection Decision',
      date: application.status === 'ACCEPTED' ? 'Selected' : application.status === 'REJECTED' ? 'Not Selected' : 'Decision Pending',
      completed: application.status === 'ACCEPTED' || application.status === 'REJECTED',
      current: application.status === 'ACCEPTED' || application.status === 'REJECTED',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <Link
        to="/student/applications"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-gov-navy"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back to My Applications
      </Link>

      {/* Main Status Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <span className="text-xs font-bold text-gov-saffron uppercase tracking-wider">
              APPLICATION FILE #{application.id.slice(0, 8)}
            </span>
            <h1 className="text-2xl font-bold text-slate-900 mt-0.5">
              {application.internship.title}
            </h1>
            <p className="text-xs text-slate-600 mt-1 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-gov-navy" />
              <strong>{application.internship.organization.name}</strong> • {application.internship.location}
            </p>
          </div>

          <div className="px-3.5 py-1.5 rounded-lg bg-blue-50 border border-blue-200 text-gov-navy font-bold text-xs uppercase tracking-wide">
            {application.status.replace('_', ' ')}
          </div>
        </div>

        {/* Progress Stepper */}
        <div className="pt-6 border-t border-slate-100">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-6">
            Evaluation Progress Timeline
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 relative">
            {steps.map((st, i) => (
              <div key={i} className="flex flex-col items-start space-y-2 relative">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                      st.completed
                        ? 'bg-emerald-600 text-white'
                        : st.current
                        ? 'bg-gov-navy text-white ring-4 ring-gov-navy/20'
                        : 'bg-slate-100 text-slate-400 border border-slate-300'
                    }`}
                  >
                    {st.completed ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
                  </div>
                  <span
                    className={`text-xs font-semibold ${
                      st.completed || st.current ? 'text-slate-900' : 'text-slate-400'
                    }`}
                  >
                    {st.title}
                  </span>
                </div>
                <span className="text-[11px] text-slate-500 pl-9 sm:pl-0">{st.date}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Application Snapshot & Cover Letter */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-slate-800 pb-2 border-b border-slate-100">
            Statement of Purpose / Cover Note
          </h3>
          <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">
            {application.coverLetter || 'No custom statement of purpose provided with this application.'}
          </p>

          {application.notes && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs space-y-1">
              <span className="font-bold text-gov-navy">Notes from Organization Reviewer:</span>
              <p className="text-slate-700">{application.notes}</p>
            </div>
          )}
        </div>

        {/* Opportunity Summary Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 text-xs">
          <h3 className="font-bold text-sm text-slate-800 pb-2 border-b border-slate-100">
            Role Summary
          </h3>
          <div className="space-y-2.5">
            <div>
              <span className="text-slate-400">Monthly Stipend:</span>
              <p className="font-bold text-emerald-700 text-sm">
                ₹{application.internship.stipendAmount.toLocaleString()}/month
              </p>
            </div>
            <div>
              <span className="text-slate-400">Duration:</span>
              <p className="font-semibold text-slate-800">{application.internship.durationMonths} Months</p>
            </div>
            <div>
              <span className="text-slate-400">Work Mode:</span>
              <p className="font-semibold text-slate-800">{application.internship.workMode}</p>
            </div>
            {application.matchScoreAtApplication && (
              <div>
                <span className="text-slate-400">Score at Application:</span>
                <p className="font-bold text-gov-navy text-sm">{application.matchScoreAtApplication}% Compatibility</p>
              </div>
            )}
          </div>
          <div className="pt-2 border-t border-slate-100">
            <Link
              to={`/internships/${application.internshipId}`}
              className="text-xs font-semibold text-gov-navy hover:underline"
            >
              View Full Internship Description →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
