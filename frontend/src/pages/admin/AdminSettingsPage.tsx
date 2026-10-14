import React, { useState, useEffect } from 'react';
import { api } from '../../api/client';
import {
  Sliders,
  Sparkles,
  Cpu,
  Brain,
  CheckCircle,
  AlertCircle,
  Save,
  RotateCcw,
  ShieldAlert,
} from 'lucide-react';

export const AdminSettingsPage: React.FC = () => {
  const [config, setConfig] = useState({
    activeStrategy: 'HYBRID_LLM',
    minScoreThreshold: 40,
    skillWeight: 30,
    educationWeight: 20,
    domainWeight: 15,
    locationWeight: 10,
    experienceWeight: 10,
    careerGoalWeight: 10,
    preferenceWeight: 5,
  });

  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await api.get('/admin/config');
        if (res.data.success && res.data.data) {
          const c = res.data.data;
          setConfig({
            activeStrategy: c.activeStrategy || 'HYBRID_LLM',
            minScoreThreshold: c.minScoreThreshold || 40,
            skillWeight: Math.round(c.skillWeight * 100),
            educationWeight: Math.round(c.educationWeight * 100),
            domainWeight: Math.round(c.domainWeight * 100),
            locationWeight: Math.round(c.locationWeight * 100),
            experienceWeight: Math.round(c.experienceWeight * 100),
            careerGoalWeight: Math.round(c.careerGoalWeight * 100),
            preferenceWeight: Math.round(c.preferenceWeight * 100),
          });
        }
      } catch (err) {
        console.error('Failed to load recommendation config:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchConfig();
  }, []);

  const totalWeight =
    config.skillWeight +
    config.educationWeight +
    config.domainWeight +
    config.locationWeight +
    config.experienceWeight +
    config.careerGoalWeight +
    config.preferenceWeight;

  const handleNormalize = () => {
    if (totalWeight === 0) return;
    const factor = 100 / totalWeight;
    setConfig((prev) => ({
      ...prev,
      skillWeight: Math.round(prev.skillWeight * factor),
      educationWeight: Math.round(prev.educationWeight * factor),
      domainWeight: Math.round(prev.domainWeight * factor),
      locationWeight: Math.round(prev.locationWeight * factor),
      experienceWeight: Math.round(prev.experienceWeight * factor),
      careerGoalWeight: Math.round(prev.careerGoalWeight * factor),
      preferenceWeight: Math.round(prev.preferenceWeight * factor),
    }));
  };

  const handleResetDefaults = () => {
    setConfig({
      activeStrategy: 'HYBRID_LLM',
      minScoreThreshold: 40,
      skillWeight: 30,
      educationWeight: 20,
      domainWeight: 15,
      locationWeight: 10,
      experienceWeight: 10,
      careerGoalWeight: 10,
      preferenceWeight: 5,
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (totalWeight !== 100) {
      setMessage({
        type: 'error',
        text: `Total weights must sum to exactly 100%. Currently: ${totalWeight}%. Click "Normalize to 100%" or adjust sliders.`,
      });
      return;
    }

    setSaving(true);
    setMessage(null);

    try {
      const payload = {
        activeStrategy: config.activeStrategy,
        minScoreThreshold: Number(config.minScoreThreshold),
        skillWeight: Number((config.skillWeight / 100).toFixed(2)),
        educationWeight: Number((config.educationWeight / 100).toFixed(2)),
        domainWeight: Number((config.domainWeight / 100).toFixed(2)),
        locationWeight: Number((config.locationWeight / 100).toFixed(2)),
        experienceWeight: Number((config.experienceWeight / 100).toFixed(2)),
        careerGoalWeight: Number((config.careerGoalWeight / 100).toFixed(2)),
        preferenceWeight: Number((config.preferenceWeight / 100).toFixed(2)),
      };

      await api.put('/admin/config', payload);
      setMessage({ type: 'success', text: 'Recommendation configuration updated and applied to the engine!' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to save configuration.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200">
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Sliders className="w-6 h-6 text-gov-navy" /> Engine Weights & AI Architecture
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Tune recommendation algorithm weights, configure fallback tiers, and define minimum compatibility thresholds.
        </p>
      </div>

      {message && (
        <div
          className={`p-4 rounded-xl border flex items-center gap-3 text-sm ${
            message.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-red-50 text-red-800 border-red-200'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Model Architecture Selection */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Brain className="w-5 h-5 text-gov-navy" /> Active Recommendation Strategy
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Rule Based */}
            <label
              className={`p-4 rounded-xl border-2 cursor-pointer transition flex flex-col justify-between ${
                config.activeStrategy === 'RULE_BASED'
                  ? 'border-gov-navy bg-slate-50'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div>
                <input
                  type="radio"
                  name="activeStrategy"
                  value="RULE_BASED"
                  checked={config.activeStrategy === 'RULE_BASED'}
                  onChange={(e) => setConfig({ ...config, activeStrategy: e.target.value })}
                  className="sr-only"
                />
                <div className="flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-slate-700" />
                  <span className="font-bold text-slate-900 text-sm">Deterministic Rules</span>
                </div>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  Strict deterministic filters based on exact skill tags, explicit degree matches, and location
                  coordinates.
                </p>
              </div>
              <span className="text-[11px] font-semibold text-slate-400 mt-4">Zero AI Latency</span>
            </label>

            {/* ML TF-IDF */}
            <label
              className={`p-4 rounded-xl border-2 cursor-pointer transition flex flex-col justify-between ${
                config.activeStrategy === 'ML_TFIDF'
                  ? 'border-gov-navy bg-slate-50'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div>
                <input
                  type="radio"
                  name="activeStrategy"
                  value="ML_TFIDF"
                  checked={config.activeStrategy === 'ML_TFIDF'}
                  onChange={(e) => setConfig({ ...config, activeStrategy: e.target.value })}
                  className="sr-only"
                />
                <div className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-blue-600" />
                  <span className="font-bold text-slate-900 text-sm">ML TF-IDF & Cosine</span>
                </div>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  Multi-vector mathematical representation of student experience, skills, and internship requirements.
                </p>
              </div>
              <span className="text-[11px] font-semibold text-blue-600 mt-4">Local Fast Inference</span>
            </label>

            {/* Hybrid LLM */}
            <label
              className={`p-4 rounded-xl border-2 cursor-pointer transition flex flex-col justify-between ${
                config.activeStrategy === 'HYBRID_LLM'
                  ? 'border-gov-navy bg-slate-50'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div>
                <input
                  type="radio"
                  name="activeStrategy"
                  value="HYBRID_LLM"
                  checked={config.activeStrategy === 'HYBRID_LLM'}
                  onChange={(e) => setConfig({ ...config, activeStrategy: e.target.value })}
                  className="sr-only"
                />
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-gov-saffron" />
                  <span className="font-bold text-slate-900 text-sm">Hybrid LLM (Gemini)</span>
                </div>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  Deep semantic understanding and tailored learning paths with automatic fallback to ML vectors if
                  unreachable.
                </p>
              </div>
              <span className="text-[11px] font-semibold text-gov-saffron mt-4">Recommended (Production)</span>
            </label>
          </div>
        </div>

        {/* Multi-Factor Weight Allocation */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">Multi-Factor Scoring Weights</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Relative influence of each profile dimension in the compatibility formula.
              </p>
            </div>

            {/* Total Meter */}
            <div className="flex items-center gap-3">
              <div
                className={`px-4 py-2 rounded-xl text-xs font-bold border ${
                  totalWeight === 100
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    : 'bg-red-50 text-red-800 border-red-200'
                }`}
              >
                Sum: {totalWeight}% / 100%
              </div>
              {totalWeight !== 100 && (
                <button
                  type="button"
                  onClick={handleNormalize}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition"
                >
                  Normalize to 100%
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Skill Weight */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold text-slate-700">
                <span>Verified Skills Match</span>
                <span className="text-gov-navy font-bold">{config.skillWeight}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={config.skillWeight}
                onChange={(e) => setConfig({ ...config, skillWeight: Number(e.target.value) })}
                className="w-full accent-gov-navy cursor-pointer"
              />
            </div>

            {/* Education Weight */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold text-slate-700">
                <span>Degree & Academic Fit</span>
                <span className="text-gov-navy font-bold">{config.educationWeight}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={config.educationWeight}
                onChange={(e) => setConfig({ ...config, educationWeight: Number(e.target.value) })}
                className="w-full accent-gov-navy cursor-pointer"
              />
            </div>

            {/* Domain Weight */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold text-slate-700">
                <span>Domain & Industry Alignment</span>
                <span className="text-gov-navy font-bold">{config.domainWeight}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={config.domainWeight}
                onChange={(e) => setConfig({ ...config, domainWeight: Number(e.target.value) })}
                className="w-full accent-gov-navy cursor-pointer"
              />
            </div>

            {/* Location Weight */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold text-slate-700">
                <span>Geographic Proximity & State</span>
                <span className="text-gov-navy font-bold">{config.locationWeight}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={config.locationWeight}
                onChange={(e) => setConfig({ ...config, locationWeight: Number(e.target.value) })}
                className="w-full accent-gov-navy cursor-pointer"
              />
            </div>

            {/* Experience Weight */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold text-slate-700">
                <span>Prior Projects & Experience</span>
                <span className="text-gov-navy font-bold">{config.experienceWeight}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={config.experienceWeight}
                onChange={(e) => setConfig({ ...config, experienceWeight: Number(e.target.value) })}
                className="w-full accent-gov-navy cursor-pointer"
              />
            </div>

            {/* Career Goal Weight */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold text-slate-700">
                <span>Aspirations & Career Goals</span>
                <span className="text-gov-navy font-bold">{config.careerGoalWeight}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={config.careerGoalWeight}
                onChange={(e) => setConfig({ ...config, careerGoalWeight: Number(e.target.value) })}
                className="w-full accent-gov-navy cursor-pointer"
              />
            </div>

            {/* Preference Weight */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold text-slate-700">
                <span>Work Mode Preference (Remote / On-site)</span>
                <span className="text-gov-navy font-bold">{config.preferenceWeight}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={config.preferenceWeight}
                onChange={(e) => setConfig({ ...config, preferenceWeight: Number(e.target.value) })}
                className="w-full accent-gov-navy cursor-pointer"
              />
            </div>

            {/* Min Score Threshold */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold text-slate-700">
                <span>Minimum Compatibility Threshold</span>
                <span className="text-gov-navy font-bold">{config.minScoreThreshold}%</span>
              </div>
              <input
                type="range"
                min="20"
                max="80"
                value={config.minScoreThreshold}
                onChange={(e) => setConfig({ ...config, minScoreThreshold: Number(e.target.value) })}
                className="w-full accent-gov-navy cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-end gap-3">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="flex items-center justify-center gap-1.5 px-5 py-2.5 border border-slate-200 text-slate-600 text-sm font-semibold rounded-xl hover:bg-slate-50 transition"
          >
            <RotateCcw className="w-4 h-4" /> Reset to Recommended Defaults
          </button>
          <button
            type="submit"
            disabled={saving || totalWeight !== 100}
            className="flex items-center justify-center gap-2 px-6 py-2.5 bg-gov-navy text-white text-sm font-semibold rounded-xl hover:bg-slate-800 disabled:opacity-50 transition shadow-sm"
          >
            <Save className="w-4 h-4" /> {saving ? 'Applying Changes...' : 'Save Configuration'}
          </button>
        </div>
      </form>
    </div>
  );
};
