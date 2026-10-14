import React, { useState } from 'react';
import { api } from '../../api/client';
import {
  Database,
  Download,
  Upload,
  FileText,
  FileCheck,
  CheckCircle,
  AlertCircle,
  Table,
  Code,
} from 'lucide-react';

export const DataImportExportPage: React.FC = () => {
  const [exporting, setExporting] = useState<string | null>(null);
  const [importJson, setImportJson] = useState<string>('');
  const [importStatus, setImportStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleExport = async (entity: string) => {
    setExporting(entity);
    try {
      const res = await api.get(`/admin/export/${entity}`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${entity}-export-${new Date().toISOString().split('T')[0]}.json`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('Failed to export:', err);
      alert('Export failed. Please check network connection.');
    } finally {
      setExporting(null);
    }
  };

  const handleLoadSample = () => {
    const sample = [
      {
        title: 'Junior Cloud Operations Trainee',
        organizationName: 'Tata Consultancy Services',
        domain: 'Technology & IT',
        location: 'Pune',
        state: 'Maharashtra',
        mode: 'ON_SITE',
        durationMonths: 12,
        stipendAmount: 5000,
        openings: 8,
        description: 'Manage cloud telemetry, Linux environments, and automation scripts.',
        requiredSkills: ['Linux', 'Cloud Computing', 'Python', 'Networking'],
        minCgpa: 6.5,
        minAge: 21,
        maxAge: 24,
      },
      {
        title: 'Power Systems Trainee Engineer',
        organizationName: 'Bharat Heavy Electricals Limited',
        domain: 'Energy, Oil & Power',
        location: 'Bhopal',
        state: 'Madhya Pradesh',
        mode: 'ON_SITE',
        durationMonths: 12,
        stipendAmount: 5000,
        openings: 10,
        description: 'Supervise turbine testing and electrical grid telemetry.',
        requiredSkills: ['Electrical Engineering', 'AutoCAD', 'PLC', 'Industrial Safety'],
        minCgpa: 6.0,
        minAge: 21,
        maxAge: 24,
      },
    ];
    setImportJson(JSON.stringify(sample, null, 2));
    setImportStatus(null);
  };

  const handleValidateAndImport = () => {
    if (!importJson.trim()) {
      setImportStatus({ type: 'error', message: 'Please paste or load JSON data before importing.' });
      return;
    }

    try {
      const parsed = JSON.parse(importJson);
      if (!Array.isArray(parsed)) {
        setImportStatus({ type: 'error', message: 'Top-level JSON payload must be an array of records.' });
        return;
      }
      setImportStatus({
        type: 'success',
        message: `Validated syntax successfully! ${parsed.length} records ready for batch ingestion.`,
      });
    } catch (err: any) {
      setImportStatus({ type: 'error', message: `Invalid JSON syntax: ${err.message}` });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200">
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Database className="w-6 h-6 text-gov-navy" /> Data Migration & Governance
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Export verified scheme datasets, backup candidate pools, and bulk import partner opportunities.
        </p>
      </div>

      {/* Export Section */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Download className="w-5 h-5 text-gov-navy" /> Export Official Datasets
        </h2>
        <p className="text-xs text-slate-500">
          Download structured JSON datasets for regulatory audits, institutional reporting, and offsite backups.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {/* Export Internships */}
          <div className="p-5 border border-slate-200 rounded-xl bg-slate-50 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center gap-2 text-gov-navy font-bold text-sm">
                <Table className="w-4 h-4" /> Active Internship Catalogue
              </div>
              <p className="text-xs text-slate-600 mt-1">
                Complete catalog of published positions, partner affiliations, stipend amounts, and eligibility
                thresholds.
              </p>
            </div>
            <button
              onClick={() => handleExport('internships')}
              disabled={exporting === 'internships'}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-gov-navy text-white text-xs font-semibold rounded-lg hover:bg-slate-800 disabled:opacity-50 transition"
            >
              <Download className="w-3.5 h-3.5" />
              {exporting === 'internships' ? 'Exporting...' : 'Download JSON Catalog'}
            </button>
          </div>

          {/* Export Applications */}
          <div className="p-5 border border-slate-200 rounded-xl bg-slate-50 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center gap-2 text-gov-navy font-bold text-sm">
                <FileCheck className="w-4 h-4" /> Application Decisions & Telemetry
              </div>
              <p className="text-xs text-slate-600 mt-1">
                Full student application log including timestamps, status lifecycle, cover letters, and review remarks.
              </p>
            </div>
            <button
              onClick={() => handleExport('applications')}
              disabled={exporting === 'applications'}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-gov-navy text-white text-xs font-semibold rounded-lg hover:bg-slate-800 disabled:opacity-50 transition"
            >
              <Download className="w-3.5 h-3.5" />
              {exporting === 'applications' ? 'Exporting...' : 'Download JSON Applications'}
            </button>
          </div>
        </div>
      </div>

      {/* Batch Ingestion Section */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Upload className="w-5 h-5 text-gov-navy" /> Batch Opportunity Ingestion
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Bulk upload multiple internship positions using validated JSON arrays.
            </p>
          </div>
          <button
            onClick={handleLoadSample}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition"
          >
            <Code className="w-3.5 h-3.5" /> Load Sample Schema
          </button>
        </div>

        {importStatus && (
          <div
            className={`p-3.5 rounded-xl border flex items-center gap-2.5 text-xs ${
              importStatus.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-red-50 text-red-800 border-red-200'
            }`}
          >
            {importStatus.type === 'success' ? (
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            )}
            <span>{importStatus.message}</span>
          </div>
        )}

        <div>
          <textarea
            rows={10}
            value={importJson}
            onChange={(e) => setImportJson(e.target.value)}
            placeholder="Paste JSON array here or click 'Load Sample Schema'..."
            className="w-full p-3 font-mono text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gov-navy bg-slate-50"
          />
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={() => setImportJson('')}
            className="px-4 py-2 border border-slate-200 text-slate-600 text-xs font-semibold rounded-lg hover:bg-slate-50 transition"
          >
            Clear Editor
          </button>
          <button
            onClick={handleValidateAndImport}
            className="px-5 py-2 bg-gov-navy text-white text-xs font-semibold rounded-lg hover:bg-slate-800 transition shadow-sm"
          >
            Validate & Ingest Batch
          </button>
        </div>
      </div>
    </div>
  );
};
