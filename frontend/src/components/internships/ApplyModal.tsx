import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Internship } from '../../types';
import api from '../../api/client';
import { Building2, Send, CheckCircle2, AlertCircle } from 'lucide-react';

interface ApplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  internship: Internship | null;
  onSuccess: () => void;
}

export const ApplyModal: React.FC<ApplyModalProps> = ({
  isOpen,
  onClose,
  internship,
  onSuccess,
}) => {
  const [coverLetter, setCoverLetter] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!internship) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await api.post(`/applications/apply/${internship.id}`, {
        coverLetter,
      });
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to submit application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Apply for PM Internship"
      subtitle={`${internship.title} • ${internship.organization.name}`}
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs space-y-1.5">
          <div className="flex justify-between text-slate-700">
            <span className="font-medium">Organization:</span>
            <span className="font-semibold text-slate-900">{internship.organization.name}</span>
          </div>
          <div className="flex justify-between text-slate-700">
            <span className="font-medium">Location & Mode:</span>
            <span>
              {internship.location} ({internship.workMode})
            </span>
          </div>
          <div className="flex justify-between text-slate-700">
            <span className="font-medium">Monthly Stipend:</span>
            <span className="text-emerald-700 font-bold">₹{internship.stipendAmount.toLocaleString()}/month</span>
          </div>
          <div className="flex justify-between text-slate-700">
            <span className="font-medium">Duration:</span>
            <span>{internship.durationMonths} Months</span>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Statement of Purpose / Cover Letter (Optional)
          </label>
          <textarea
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
            rows={4}
            placeholder="Share why you are interested in this opportunity and how your coursework or projects align with the role..."
            className="w-full text-xs p-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-gov-navy/20 focus:border-gov-navy"
          />
          <p className="text-[11px] text-slate-400 mt-1">
            Your saved profile information, education, verified skills, and latest resume will be automatically included in your application.
          </p>
        </div>

        <div className="bg-amber-50 p-3 rounded-lg border border-amber-200 text-[11px] text-amber-900 leading-relaxed">
          <span className="font-bold">Applicant Declaration:</span> By submitting this application under the PM Internship Scheme, I confirm that the academic details and credentials entered in my profile are true and complete.
        </div>

        <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-5 py-2 text-xs font-semibold text-white bg-gov-navy hover:bg-gov-navyLight disabled:opacity-50 rounded-lg flex items-center gap-1.5 shadow-sm transition-all"
          >
            {isSubmitting ? (
              <span>Submitting...</span>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                <span>Submit Application</span>
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};
