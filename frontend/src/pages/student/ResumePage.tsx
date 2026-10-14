import React, { useState } from 'react';
import api from '../../api/client';
import {
  FileText,
  Upload,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  User,
  GraduationCap,
  Code,
  FolderGit2,
  Trash2,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ResumePage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resumeId, setResumeId] = useState<string | null>(null);
  const [parsedData, setParsedData] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
    }
  };

  const handleUploadAndParse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a PDF, DOCX, or TXT resume file to upload.');
      return;
    }

    setIsUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append('resume', file);

    try {
      const res = await api.post('/student/resume', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setResumeId(res.data.data.resumeId);
      setParsedData(res.data.data.parsedData);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to parse resume. You can enter details manually.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleConfirmAndSync = async () => {
    if (!resumeId || !parsedData) return;
    setIsSaving(true);
    setError(null);

    try {
      await api.post('/student/resume/confirm', {
        resumeId,
        confirmedData: parsedData,
      });
      setSuccess(true);
      setTimeout(() => {
        navigate('/student/profile');
      }, 1500);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to sync resume data to profile.');
      setIsSaving(false);
    }
  };

  const handleRemoveSkill = (index: number) => {
    setParsedData({
      ...parsedData,
      skills: parsedData.skills.filter((_: any, i: number) => i !== index),
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-1">
        <span className="text-xs font-bold text-gov-saffron uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" /> AI RESUME PARSING PIPELINE
        </span>
        <h1 className="text-2xl font-bold text-slate-900">Upload & Parse Resume</h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Upload your resume in PDF, DOCX, or TXT format. Our NLP engine will extract your degrees,
          technical skills, and projects for your review before updating your profile.
        </p>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Resume data confirmed and synced to your profile! Redirecting...</span>
        </div>
      )}

      {/* Step 1: Upload Box */}
      {!parsedData && (
        <form onSubmit={handleUploadAndParse} className="bg-white p-8 rounded-2xl border-2 border-dashed border-slate-300 text-center space-y-4 hover:border-gov-navy transition-colors">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-gov-navy flex items-center justify-center mx-auto shadow-sm">
            <Upload className="w-7 h-7" />
          </div>

          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-800">
              Drag & Drop your resume here, or browse
            </h3>
            <p className="text-xs text-slate-400">Supported formats: PDF, DOCX, DOC, TXT (Max 5MB)</p>
          </div>

          <div className="pt-2">
            <input
              type="file"
              id="resume-upload"
              accept=".pdf,.docx,.doc,.txt"
              onChange={handleFileChange}
              className="hidden"
            />
            <label
              htmlFor="resume-upload"
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer inline-block transition-colors"
            >
              {file ? file.name : 'Select File from Computer'}
            </label>
          </div>

          {file && (
            <div className="text-xs text-emerald-700 font-semibold flex items-center justify-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> Selected: {file.name} ({(file.size / 1024).toFixed(1)} KB)
            </div>
          )}

          <div className="pt-4 border-t border-slate-100">
            <button
              type="submit"
              disabled={!file || isUploading}
              className="px-6 py-2.5 bg-gov-navy hover:bg-gov-navyLight disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md transition-all inline-flex items-center gap-2"
            >
              {isUploading ? (
                <span>Analyzing & Extracting Entities...</span>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-gov-saffron" />
                  <span>Parse Resume with AI</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* Step 2: Extracted Information Confirmation & Edit Screen */}
      {parsedData && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex justify-between items-center pb-3 border-b border-slate-100">
            <div>
              <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Extraction Completed
              </span>
              <h2 className="text-lg font-bold text-slate-900 mt-0.5">
                Review & Confirm Extracted Details
              </h2>
              <p className="text-xs text-slate-500">
                You can review, modify, or remove any extracted details before applying them to your profile.
              </p>
            </div>
            <button
              onClick={() => {
                setParsedData(null);
                setFile(null);
              }}
              className="text-xs text-slate-500 hover:text-slate-800 underline"
            >
              Upload Different File
            </button>
          </div>

          {/* Extracted Personal Info */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
            <h4 className="font-bold text-slate-700 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-gov-navy" /> Candidate Identification
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <span className="text-slate-400">Detected Name:</span>
                <p className="font-semibold text-slate-800">{parsedData.name || 'Not specified'}</p>
              </div>
              <div>
                <span className="text-slate-400">Email:</span>
                <p className="font-semibold text-slate-800">{parsedData.email || 'Not specified'}</p>
              </div>
              <div>
                <span className="text-slate-400">Phone:</span>
                <p className="font-semibold text-slate-800">{parsedData.phone || 'Not specified'}</p>
              </div>
            </div>
          </div>

          {/* Extracted Skills */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Code className="w-3.5 h-3.5 text-gov-saffron" /> Extracted Skills ({parsedData.skills?.length || 0})
            </h4>
            <div className="flex flex-wrap gap-2">
              {parsedData.skills?.map((sk: string, idx: number) => (
                <div
                  key={idx}
                  className="px-2.5 py-1 rounded-lg border border-slate-200 bg-slate-50 text-xs font-semibold flex items-center gap-1.5"
                >
                  <span>{sk}</span>
                  <button
                    onClick={() => handleRemoveSkill(idx)}
                    className="text-slate-400 hover:text-rose-600"
                    title="Remove"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Extracted Education */}
          {parsedData.education && parsedData.education.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-gov-navy" /> Detected Academic Qualifications
              </h4>
              <div className="space-y-2">
                {parsedData.education.map((edu: any, i: number) => (
                  <div key={i} className="p-3 rounded-lg border border-slate-200 bg-slate-50 text-xs">
                    <span className="font-bold text-slate-800">
                      {edu.degree} in {edu.branch}
                    </span>
                    <p className="text-slate-500">Graduation Year: {edu.graduationYear || '2026'}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Extracted Projects */}
          {parsedData.projects && parsedData.projects.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <FolderGit2 className="w-3.5 h-3.5 text-gov-navy" /> Extracted Projects
              </h4>
              <div className="space-y-2">
                {parsedData.projects.map((p: any, i: number) => (
                  <div key={i} className="p-3 rounded-lg border border-slate-200 bg-slate-50 text-xs space-y-1">
                    <span className="font-bold text-slate-800">{p.title}</span>
                    <p className="text-slate-600">{p.description}</p>
                    <p className="text-[11px] text-slate-500">Technologies: {p.technologies}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Confirmation Action */}
          <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
            <button
              onClick={() => {
                setParsedData(null);
                setFile(null);
              }}
              className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmAndSync}
              disabled={isSaving}
              className="px-6 py-2.5 bg-gov-navy hover:bg-gov-navyLight disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
            >
              {isSaving ? (
                <span>Syncing to Profile...</span>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirm & Sync to Profile</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
