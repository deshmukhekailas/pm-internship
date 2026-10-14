import React, { useState, useEffect } from 'react';
import { api } from '../../api/client';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import {
  Briefcase,
  Search,
  Plus,
  Edit,
  Trash2,
  Building2,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Filter,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';

export const InternshipManagementPage: React.FC = () => {
  const [internships, setInternships] = useState<any[]>([]);
  const [organizations, setOrganizations] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');
  const [domainFilter, setDomainFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [page, setPage] = useState<number>(1);
  const [meta, setMeta] = useState<{ total: number; totalPages: number }>({ total: 0, totalPages: 1 });

  // Modal states
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const [selectedInternship, setSelectedInternship] = useState<any | null>(null);
  const [formSubmitting, setFormSubmitting] = useState<boolean>(false);
  const [formError, setFormError] = useState<string>('');

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    organizationId: '',
    domain: 'Technology & IT',
    location: '',
    state: 'Delhi',
    mode: 'ON_SITE',
    durationMonths: 12,
    stipendAmount: 5000,
    openings: 5,
    description: '',
    responsibilities: '',
    perks: 'Government Certificate, Mentorship, Travel Allowance',
    status: 'OPEN',
    minCgpa: 6.0,
    minAge: 21,
    maxAge: 24,
    requiredSkills: '',
  });

  const fetchInternships = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/internships', {
        params: {
          search,
          domain: domainFilter,
          status: statusFilter,
          page,
          limit: 10,
        },
      });
      if (res.data.success) {
        setInternships(res.data.data);
        if (res.data.meta) {
          setMeta(res.data.meta);
        }
      }
    } catch (err) {
      console.error('Failed to load internships:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrganizations = async () => {
    try {
      const res = await api.get('/admin/organizations');
      if (res.data.success) {
        setOrganizations(res.data.data);
        if (res.data.data.length > 0 && !formData.organizationId) {
          setFormData((prev) => ({ ...prev, organizationId: res.data.data[0].id }));
        }
      }
    } catch (err) {
      console.error('Failed to load organizations:', err);
    }
  };

  useEffect(() => {
    fetchInternships();
  }, [page, domainFilter, statusFilter]);

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const handleOpenCreateModal = () => {
    setSelectedInternship(null);
    setFormData({
      title: '',
      organizationId: organizations[0]?.id || '',
      domain: 'Technology & IT',
      location: 'New Delhi',
      state: 'Delhi',
      mode: 'ON_SITE',
      durationMonths: 12,
      stipendAmount: 5000,
      openings: 5,
      description: 'Hands-on practical training in technical and administrative workflows.',
      responsibilities: 'Assist senior teams in project execution, reporting, and operational delivery.',
      perks: 'Government Certificate, Mentorship, Monthly Direct Stored Allowance',
      status: 'OPEN',
      minCgpa: 6.0,
      minAge: 21,
      maxAge: 24,
      requiredSkills: 'Python, SQL, Problem Solving',
    });
    setFormError('');
    setModalOpen(true);
  };

  const handleOpenEditModal = (item: any) => {
    setSelectedInternship(item);
    setFormData({
      title: item.title,
      organizationId: item.organizationId,
      domain: item.domain,
      location: item.location,
      state: item.state,
      mode: item.workMode || item.mode || 'ONSITE',
      durationMonths: item.durationMonths,
      stipendAmount: item.stipendAmount,
      openings: item.openings,
      description: item.description,
      responsibilities: item.responsibilities,
      perks: item.perks || '',
      status: item.status || 'PUBLISHED',
      minCgpa: item.eligibilityRule?.minCgpa || 6.0,
      minAge: item.eligibilityRule?.minAge || 21,
      maxAge: item.eligibilityRule?.maxAge || 24,
      requiredSkills: item.skills?.map((s: any) => s.skill?.name || s.name).filter(Boolean).join(', ') || '',
    });
    setFormError('');
    setModalOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitting(true);
    setFormError('');

    try {
      const skillsArray = formData.requiredSkills
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      const payload = {
        title: formData.title,
        organizationId: formData.organizationId,
        department: formData.domain || 'Engineering',
        domain: formData.domain,
        location: formData.location,
        state: formData.state,
        workMode: formData.mode || 'ONSITE',
        durationMonths: Number(formData.durationMonths),
        stipendAmount: Number(formData.stipendAmount),
        openings: Number(formData.openings),
        description: formData.description,
        responsibilities: formData.responsibilities,
        perks: formData.perks,
        deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
        status: formData.status === 'OPEN' ? 'PUBLISHED' : formData.status || 'PUBLISHED',
        skills: skillsArray.map((s) => ({ skillName: s, isRequired: true })),
        eligibility: {
          minCgpa: Number(formData.minCgpa),
          minAge: Number(formData.minAge),
          maxAge: Number(formData.maxAge),
        },
      };

      if (selectedInternship) {
        await api.put(`/admin/internships/${selectedInternship.id}`, payload);
      } else {
        await api.post('/admin/internships', payload);
      }

      setModalOpen(false);
      fetchInternships();
    } catch (err: any) {
      setFormError(err.response?.data?.message || 'Failed to save internship.');
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleDeleteInternship = async () => {
    if (!selectedInternship) return;
    try {
      await api.delete(`/admin/internships/${selectedInternship.id}`);
      setDeleteModalOpen(false);
      fetchInternships();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete internship.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-gov-navy" /> Internship Management
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Publish, modify, or archive internship opportunities under partner organizations.
          </p>
        </div>
        <button
          onClick={handleOpenCreateModal}
          className="flex items-center gap-2 px-4 py-2.5 bg-gov-navy text-white text-sm font-semibold rounded-xl hover:bg-slate-800 transition shadow-sm"
        >
          <Plus className="w-4 h-4" /> Add Opportunity
        </button>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-4 gap-3 items-center">
        <div className="relative sm:col-span-2">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search by title, role or company..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchInternships()}
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gov-navy"
          />
        </div>

        <div>
          <select
            value={domainFilter}
            onChange={(e) => {
              setDomainFilter(e.target.value);
              setPage(1);
            }}
            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-gov-navy"
          >
            <option value="ALL">All Domains</option>
            <option value="Technology & IT">Technology & IT</option>
            <option value="Finance & Banking">Finance & Banking</option>
            <option value="Manufacturing & Heavy Industry">Manufacturing</option>
            <option value="Energy, Oil & Power">Energy & Power</option>
            <option value="Automotive & Mobility">Automotive</option>
          </select>
        </div>

        <div>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-gov-navy"
          >
            <option value="ALL">All Statuses</option>
            <option value="PUBLISHED">Published / Active</option>
            <option value="OPEN">Open</option>
            <option value="CLOSED">Closed</option>
            <option value="DRAFT">Draft</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-xs font-semibold text-slate-500 uppercase border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Title & Organization</th>
                <th className="px-6 py-4">Domain</th>
                <th className="px-6 py-4">Location & Mode</th>
                <th className="px-6 py-4">Stipend</th>
                <th className="px-6 py-4">Openings</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                    <div className="w-8 h-8 border-4 border-gov-navy border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                    Loading internships...
                  </td>
                </tr>
              ) : internships.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                    No internships found.
                  </td>
                </tr>
              ) : (
                internships.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/60 transition">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-900">{item.title}</div>
                      <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                        <Building2 className="w-3 h-3 text-slate-400" />
                        {item.organization?.name}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-medium text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md">
                        {item.domain}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-xs text-slate-800 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {item.location}, {item.state}
                      </div>
                      <span className="text-[11px] text-slate-400 capitalize">
                        {(item.workMode || item.mode || 'ONSITE').toLowerCase().replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-800">
                      ₹{(item.stipendAmount ?? 5000).toLocaleString('en-IN')}/mo
                    </td>
                    <td className="px-6 py-4 text-xs">
                      <span className="font-bold text-slate-800">{item.openings || 1}</span> positions
                    </td>
                    <td className="px-6 py-4">
                      <Badge
                        variant={
                          item.status === 'OPEN' || item.status === 'PUBLISHED'
                            ? 'green'
                            : item.status === 'CLOSED'
                            ? 'red'
                            : 'amber'
                        }
                      >
                        {item.status || 'PUBLISHED'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEditModal(item)}
                          className="p-1.5 text-slate-500 hover:text-gov-navy hover:bg-slate-100 rounded-md transition"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedInternship(item);
                            setDeleteModalOpen(true);
                          }}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
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

      {/* Create / Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={selectedInternship ? 'Edit Internship Position' : 'Create New Internship Opportunity'}
        maxWidth="3xl"
      >
        <form onSubmit={handleFormSubmit} className="space-y-4">
          {formError && (
            <div className="p-3 bg-red-50 text-red-700 text-xs rounded-lg flex items-center gap-2 border border-red-200">
              <AlertCircle className="w-4 h-4 shrink-0" /> {formError}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Opportunity Title *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Data Analytics Intern"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gov-navy"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Partner Organization *</label>
              <select
                required
                value={formData.organizationId}
                onChange={(e) => setFormData({ ...formData, organizationId: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-gov-navy"
              >
                {organizations.map((org) => (
                  <option key={org.id} value={org.id}>
                    {org.name} ({org.sector})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Domain Sector *</label>
              <select
                value={formData.domain}
                onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-gov-navy"
              >
                <option value="Technology & IT">Technology & IT</option>
                <option value="Finance & Banking">Finance & Banking</option>
                <option value="Manufacturing & Heavy Industry">Manufacturing</option>
                <option value="Energy, Oil & Power">Energy, Oil & Power</option>
                <option value="Automotive & Mobility">Automotive & Mobility</option>
                <option value="Consumer Goods & FMCG">Consumer Goods</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">City / Location *</label>
              <input
                type="text"
                required
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g. Bengaluru, Mumbai"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gov-navy"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">State *</label>
              <input
                type="text"
                required
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                placeholder="e.g. Karnataka, Maharashtra"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gov-navy"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Work Mode</label>
              <select
                value={formData.mode}
                onChange={(e) => setFormData({ ...formData, mode: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-gov-navy"
              >
                <option value="ON_SITE">On-Site</option>
                <option value="HYBRID">Hybrid</option>
                <option value="REMOTE">Remote</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Stipend (₹/month)</label>
              <input
                type="number"
                value={formData.stipendAmount}
                onChange={(e) => setFormData({ ...formData, stipendAmount: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gov-navy"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Open Positions</label>
              <input
                type="number"
                value={formData.openings}
                onChange={(e) => setFormData({ ...formData, openings: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gov-navy"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-gov-navy"
              >
                <option value="OPEN">Open</option>
                <option value="CLOSED">Closed</option>
                <option value="DRAFT">Draft</option>
              </select>
            </div>
          </div>

          {/* Eligibility Requirements */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide">
              Deterministic Scheme Eligibility Parameters
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs text-slate-600 mb-1">Min CGPA Required</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.minCgpa}
                  onChange={(e) => setFormData({ ...formData, minCgpa: Number(e.target.value) })}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-600 mb-1">Min Age (Years)</label>
                <input
                  type="number"
                  value={formData.minAge}
                  onChange={(e) => setFormData({ ...formData, minAge: Number(e.target.value) })}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-600 mb-1">Max Age (Years)</label>
                <input
                  type="number"
                  value={formData.maxAge}
                  onChange={(e) => setFormData({ ...formData, maxAge: Number(e.target.value) })}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Required Skills (comma separated)
            </label>
            <input
              type="text"
              value={formData.requiredSkills}
              onChange={(e) => setFormData({ ...formData, requiredSkills: e.target.value })}
              placeholder="e.g. Python, SQL, Machine Learning"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gov-navy"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
              disabled={formSubmitting}
              className="px-6 py-2 bg-gov-navy text-white text-sm font-semibold rounded-lg hover:bg-slate-800 disabled:opacity-50 transition"
            >
              {formSubmitting ? 'Saving...' : selectedInternship ? 'Update Internship' : 'Create Internship'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Confirm Deletion"
        maxWidth="md"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600">
            Are you sure you want to permanently delete the internship posting{' '}
            <strong className="text-slate-900">{selectedInternship?.title}</strong> at{' '}
            <strong>{selectedInternship?.organization?.name}</strong>?
          </p>
          <div className="flex justify-end gap-3 pt-3 border-t border-slate-200">
            <button
              onClick={() => setDeleteModalOpen(false)}
              className="px-4 py-2 border border-slate-200 text-slate-600 text-sm font-semibold rounded-lg hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteInternship}
              className="px-5 py-2 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 transition"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
