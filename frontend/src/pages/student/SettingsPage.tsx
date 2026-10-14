import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Settings, Shield, Bell, CheckCircle2, Lock } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { user } = useAuth();
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-12">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <span className="text-xs font-bold text-gov-saffron uppercase tracking-wider flex items-center gap-1.5">
          <Settings className="w-3.5 h-3.5" /> ACCOUNT PREFERENCES
        </span>
        <h1 className="text-2xl font-bold text-slate-900 mt-1">Candidate Settings</h1>
        <p className="text-xs text-slate-500">Manage communication alerts and security settings.</p>
      </div>

      {saved && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Settings saved successfully.</span>
        </div>
      )}

      {/* Notification Preferences */}
      <form onSubmit={handleSave} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 text-xs">
        <h3 className="font-bold text-sm text-slate-800 pb-2 border-b border-slate-100 flex items-center gap-2">
          <Bell className="w-4 h-4 text-gov-navy" /> Notification Alerts
        </h3>

        <div className="space-y-3">
          <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
            <div>
              <p className="font-bold text-slate-800">New High-Compatibility Matches</p>
              <p className="text-slate-500 text-[11px]">
                Notify me when a new internship with ≥ 85% compatibility score is posted.
              </p>
            </div>
            <input
              type="checkbox"
              checked={emailAlerts}
              onChange={(e) => setEmailAlerts(e.target.checked)}
              className="w-4 h-4 text-gov-navy rounded"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
            <div>
              <p className="font-bold text-slate-800">Application Status Notifications</p>
              <p className="text-slate-500 text-[11px]">
                Receive instant alerts whenever a company shortlists or extends an offer.
              </p>
            </div>
            <input
              type="checkbox"
              checked={weeklyDigest}
              onChange={(e) => setWeeklyDigest(e.target.checked)}
              className="w-4 h-4 text-gov-navy rounded"
            />
          </label>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-5 py-2 bg-gov-navy hover:bg-gov-navyLight text-white font-bold text-xs rounded-xl shadow-sm"
          >
            Save Preferences
          </button>
        </div>
      </form>

      {/* Security Info */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3 text-xs">
        <h3 className="font-bold text-sm text-slate-800 pb-2 border-b border-slate-100 flex items-center gap-2">
          <Shield className="w-4 h-4 text-emerald-600" /> Account Security & Session
        </h3>
        <p className="text-slate-600">
          Logged in as <strong>{user?.email}</strong>. Candidate ID: {user?.id.slice(0, 12)}...
        </p>
        <p className="text-slate-400 text-[11px]">
          All credentials are encrypted and authenticated via secure JWT sessions.
        </p>
      </div>
    </div>
  );
};
