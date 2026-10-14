import React, { useState, useEffect } from 'react';
import { api } from '../../api/client';
import { Modal } from '../../components/common/Modal';
import {
  Building2,
  Plus,
  Search,
  Globe,
  MapPin,
  Briefcase,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';

export const CompanyManagementPage: React.FC = () => {
  const [organizations, setOrganizations] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');
  const [sectorFilter, setSectorFilter] = useState<string>('ALL');

  // Modal states
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [formSubmitting, setFormSubmitting] = useState<boolean>(false);
  const [formError, setFormError] = useState<string>('');
  const [formData, setFormData] = useState({
    name: '',
    sector: 'Technology & IT',
    website: '',
    description: '',
    location: '',
  });

  const fetchOrganizations = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/organizations');
      if (res.data.success) {
        setOrganizations(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load organizations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const handleOpenModal = () => {
    setFormData({
      name: '',
      sector: 'Technology & IT',
      website: '',
      description: 'Participating corporate enterprise offering certified internships under the PM Scheme.',
      location: 'New Delhi, India',
    });
    setFormError('');
    setModalOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitting(true);
    setFormError('');

    try {
      await api.post('/admin/organizations', formData);
      setModalOpen(false);
      fetchOrganizations();
    } catch (err: any) {
      setFormError(err.response?.data?.message || 'Failed to register organization.');
    } finally {
      setFormSubmitting(false);
    }
  };

  const filteredOrgs = organizations.filter((org) => {
    const matchesSearch =
      org.name.toLowerCase().includes(search.toLowerCase()) ||
      org.sector.toLowerCase().includes(search.toLowerCase()) ||
      (org.location && org.location.toLowerCase().includes(search.toLowerCase()));
    const matchesSector = sectorFilter === 'ALL' || org.sector === sectorFilter;
    return matchesSearch && matchesSector;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Building2 className="w-6 h-6 text-gov-navy" /> Partner Organizations
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Top 500 corporate partners and central public sector undertakings (CPSUs) offering internships.
          </p>
        </div>
        <button
          onClick={handleOpenModal}
          className="flex items-center gap-2 px-4 py-2.5 bg-gov-navy text-white text-sm font-semibold rounded-xl hover:bg-slate-800 transition shadow-sm"
        >
          <Plus className="w-4 h-4" /> Register Partner Company
        </button>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search organizations by name, sector, or headquarters..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gov-navy"
          />
        </div>
        <select
          value={sectorFilter}
          onChange={(e) => setSectorFilter(e.target.value)}
          className="w-full sm:w-60 px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-gov-navy"
        >
          <option value="ALL">All Sectors</option>
          <option value="Technology & IT">Technology & IT</option>
          <option value="Finance & Banking">Banking & Finance</option>
          <option value="Manufacturing & Heavy Industry">Manufacturing & Industry</option>
          <option value="Energy, Oil & Power">Energy & Petroleum</option>
          <option value="Automotive & Mobility">Automotive</option>
          <option value="Consumer Goods & FMCG">Consumer Goods</option>
        </select>
      </div>

      {/* Grid of Partner Companies */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 bg-white rounded-xl border border-slate-200">
          <div className="w-8 h-8 border-4 border-gov-navy border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          Loading partner organizations...
        </div>
      ) : filteredOrgs.length === 0 ? (
        <div className="p-12 text-center text-slate-500 bg-white rounded-xl border border-slate-200">
          No partner organizations found.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredOrgs.map((org) => (
            <div
              key={org.id}
              className="bg-white p-5 rounded-xl border border-slate-200 hover:shadow-md transition space-y-4 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 text-gov-navy flex items-center justify-center font-bold text-lg">
                    {org.name.slice(0, 2).toUpperCase()}
                  </div>
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                    <ShieldCheck className="w-3 h-3" /> Scheme Partner
                  </span>
                </div>

                <div className="mt-3">
                  <h3 className="font-bold text-slate-900 text-base">{org.name}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">{org.sector}</p>
                </div>

                <p className="text-xs text-slate-600 line-clamp-3 mt-3 leading-relaxed">
                  {org.description || 'Corporate partner under the PM Internship Scheme.'}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-500">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-slate-600">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {org.location || 'Pan-India'}
                  </span>
                  <span className="flex items-center gap-1 font-semibold text-gov-navy bg-slate-50 px-2 py-0.5 rounded">
                    <Briefcase className="w-3.5 h-3.5" /> {org._count?.internships || 0} Openings
                  </span>
                </div>

                {org.website && (
                  <a
                    href={org.website.startsWith('http') ? org.website : `https://${org.website}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-blue-600 hover:underline pt-1 text-[11px]"
                  >
                    <Globe className="w-3 h-3" /> {org.website} <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Partner Organization Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Register Partner Enterprise"
        maxWidth="lg"
      >
        <form onSubmit={handleFormSubmit} className="space-y-4">
          {formError && (
            <div className="p-3 bg-red-50 text-red-700 text-xs rounded-lg flex items-center gap-2 border border-red-200">
              <AlertCircle className="w-4 h-4 shrink-0" /> {formError}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Company / PSU Name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Bharat Heavy Electricals Limited"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gov-navy"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Sector *</label>
              <select
                value={formData.sector}
                onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
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
              <label className="block text-xs font-semibold text-slate-700 mb-1">Headquarters / City</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g. New Delhi, Mumbai"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gov-navy"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Official Website</label>
            <input
              type="text"
              value={formData.website}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              placeholder="e.g. https://www.bhel.com"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gov-navy"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Organization Overview</label>
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
              {formSubmitting ? 'Registering...' : 'Register Organization'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
