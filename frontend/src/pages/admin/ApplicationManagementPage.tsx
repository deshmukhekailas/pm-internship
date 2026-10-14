import React, { useState, useEffect } from 'react';
import { api } from '../../api/client';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import {
  FileCheck,
  Search,
  Filter,
  CheckCircle,
  Clock,
  UserCheck,
  XCircle,
  Building2,
  Calendar,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
} from 'lucide-react';

export const ApplicationManagementPage: React.FC = () => {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [page, setPage] = useState<number>(1);
  const [meta, setMeta] = useState<{ total: number; totalPages: number }>({ total: 0, totalPages: 1 });

  // Modal states
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [selectedApp, setSelectedApp] = useState<any | null>(null);
  const [newStatus, setNewStatus] = useState<string>('SHORTLISTED');
  const [adminNotes, setAdminNotes] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/applications', {
        params: {
          status: statusFilter === 'ALL' ? undefined : statusFilter,
          page,
          limit: 10,
        },
      });
      if (res.data.success) {
        setApplications(res.data.data);
        if (res.data.meta) {
          setMeta(res.data.meta);
        }
      }
    } catch (err) {
      console.error('Failed to load applications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [page, statusFilter]);

  const handleOpenStatusModal = (app: any) => {
    setSelectedApp(app);
    setNewStatus(app.status);
    setAdminNotes(app.notes || '');
    setErrorMsg('');
    setModalOpen(true);
  };

  const handleStatusSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedApp) return;

    setSubmitting(true);
    setErrorMsg('');
    try {
      await api.put(`/admin/applications/${selectedApp.id}/status`, {
        status: newStatus,
        notes: adminNotes,
      });
      setModalOpen(false);
      fetchApplications();
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Failed to update application status.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <FileCheck className="w-6 h-6 text-gov-navy" /> Application Evaluation
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Review student candidacies, update hiring milestones, and deliver verified status notes.
          </p>
        </div>
        <div className="text-right">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Processed Records</span>
          <p className="text-2xl font-extrabold text-gov-navy">{meta.total} Applications</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-wrap gap-2 items-center justify-between">
        <div className="flex flex-wrap gap-2">
          {['ALL', 'APPLIED', 'UNDER_REVIEW', 'SHORTLISTED', 'ACCEPTED', 'REJECTED'].map((st) => (
            <button
              key={st}
              onClick={() => {
                setStatusFilter(st);
                setPage(1);
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                statusFilter === st
                  ? 'bg-gov-navy text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st === 'ALL' ? 'All Applications' : st.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-xs font-semibold text-slate-500 uppercase border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Applicant</th>
                <th className="px-6 py-4">Position & Organization</th>
                <th className="px-6 py-4">Applied Date</th>
                <th className="px-6 py-4">Current Status</th>
                <th className="px-6 py-4">Official Notes</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                    <div className="w-8 h-8 border-4 border-gov-navy border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                    Loading application pool...
                  </td>
                </tr>
              ) : applications.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    No applications found for this selection.
                  </td>
                </tr>
              ) : (
                applications.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50/60 transition">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-900">
                        {app.student?.user?.firstName} {app.student?.user?.lastName}
                      </div>
                      <div className="text-xs text-slate-400">{app.student?.user?.email}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        {app.student?.degree} ({app.student?.cgpa ? `${app.student.cgpa.toFixed(1)} CGPA` : 'N/A'})
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-800">{app.internship?.title}</div>
                      <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                        <Building2 className="w-3 h-3 text-slate-400" />
                        {app.internship?.organization?.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {new Date(app.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Badge
                        variant={
                          app.status === 'ACCEPTED'
                            ? 'green'
                            : app.status === 'REJECTED'
                            ? 'red'
                            : app.status === 'SHORTLISTED'
                            ? 'purple'
                            : app.status === 'UNDER_REVIEW'
                            ? 'amber'
                            : 'blue'
                        }
                      >
                        {app.status.replace('_', ' ')}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500 max-w-xs truncate">
                      {app.notes || <span className="text-slate-300 italic">No notes recorded</span>}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleOpenStatusModal(app)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-gov-navy hover:text-white text-slate-700 text-xs font-semibold rounded-lg transition"
                      >
                        Update Status
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Showing Page <span className="font-semibold">{page}</span> of{' '}
            <span className="font-semibold">{meta.totalPages || 1}</span>
          </span>
          <div className="flex items-center gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 disabled:opacity-40 hover:bg-slate-50"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              disabled={page >= meta.totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 disabled:opacity-40 hover:bg-slate-50"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Review Modal */}
      {selectedApp && (
        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title="Review & Update Application Status"
          maxWidth="lg"
        >
          <form onSubmit={handleStatusSubmit} className="space-y-4">
            {errorMsg && (
              <div className="p-3 bg-red-50 text-red-700 text-xs rounded-lg flex items-center gap-2 border border-red-200">
                <AlertCircle className="w-4 h-4 shrink-0" /> {errorMsg}
              </div>
            )}

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <div className="text-xs text-slate-500">Candidate</div>
              <div className="text-sm font-bold text-slate-800">
                {selectedApp.student?.user?.firstName} {selectedApp.student?.user?.lastName}
              </div>
              <div className="text-xs text-slate-600 mt-2">Internship Opportunity</div>
              <div className="text-sm font-semibold text-gov-navy">
                {selectedApp.internship?.title} ({selectedApp.internship?.organization?.name})
              </div>
            </div>

            {selectedApp.coverLetter && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Candidate's Statement of Purpose
                </label>
                <div className="p-3 bg-white border border-slate-200 rounded-lg text-xs text-slate-600 max-h-32 overflow-y-auto">
                  {selectedApp.coverLetter}
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">New Review Status *</label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-gov-navy"
              >
                <option value="APPLIED">APPLIED (Initial Submission)</option>
                <option value="UNDER_REVIEW">UNDER REVIEW (Dossier Inspection)</option>
                <option value="SHORTLISTED">SHORTLISTED (Selected for Interview/Screening)</option>
                <option value="ACCEPTED">ACCEPTED (Internship Offer Issued)</option>
                <option value="REJECTED">REJECTED (Candidate Not Selected)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Official Review Notes & Feedback (Candidate Visible)
              </label>
              <textarea
                rows={3}
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="e.g. Profile shortlisted for technical panel round on 15th October."
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gov-navy"
              />
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 border border-slate-200 text-slate-600 text-sm font-semibold rounded-lg hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2 bg-gov-navy text-white text-sm font-semibold rounded-lg hover:bg-slate-800 disabled:opacity-50 transition"
              >
                {submitting ? 'Updating...' : 'Save Decision'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
