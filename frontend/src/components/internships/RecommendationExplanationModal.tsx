import React from 'react';
import { Modal } from '../common/Modal';
import { CompatibilityScoreBadge } from './CompatibilityScoreBadge';
import { EligibilityBadge } from './EligibilityBadge';
import { ProgressBar } from '../common/ProgressBar';
import { Sparkles, Check, AlertCircle, BookOpen, Building2, MapPin } from 'lucide-react';
import { Internship } from '../../types';

interface RecommendationExplanationModalProps {
  isOpen: boolean;
  onClose: () => void;
  internship: Internship | null;
}

export const RecommendationExplanationModal: React.FC<RecommendationExplanationModalProps> = ({
  isOpen,
  onClose,
  internship,
}) => {
  if (!internship) return null;

  const analysis = internship.candidateAnalysis;
  const factors = analysis?.factors;
  const skillGap = analysis?.skillGap;
  const reasons = analysis?.reasons || internship.reasons || [];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Why This Internship Was Recommended"
      subtitle={`${internship.title} • ${internship.organization.name}`}
      maxWidth="2xl"
    >
      <div className="space-y-6">
        {/* Top Header Card */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50/50 p-4 rounded-xl border border-blue-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Building2 className="w-4 h-4 text-gov-navy" />
              <span className="font-semibold text-slate-900 text-sm">{internship.organization.name}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>
                {internship.location}, {internship.state} ({internship.workMode})
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <EligibilityBadge status={internship.eligibilityStatus || 'ELIGIBLE'} />
            {internship.compatibilityScore && (
              <CompatibilityScoreBadge score={internship.compatibilityScore} size="lg" />
            )}
          </div>
        </div>

        {/* Multi-Factor Score Breakdown */}
        {factors && (
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-gov-saffron" />
              Compatibility Factor Breakdown
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div>
                <ProgressBar
                  value={factors.skillMatch.score}
                  label={`Skill Alignment (${factors.skillMatch.weight}%)`}
                  color="saffron"
                />
                <p className="text-[11px] text-slate-500 mt-1">{factors.skillMatch.explanation}</p>
              </div>
              <div>
                <ProgressBar
                  value={factors.educationMatch.score}
                  label={`Education Readiness (${factors.educationMatch.weight}%)`}
                  color="primary"
                />
                <p className="text-[11px] text-slate-500 mt-1">{factors.educationMatch.explanation}</p>
              </div>
              <div>
                <ProgressBar
                  value={factors.domainMatch.score}
                  label={`Domain Interest (${factors.domainMatch.weight}%)`}
                  color="primary"
                />
                <p className="text-[11px] text-slate-500 mt-1">{factors.domainMatch.explanation}</p>
              </div>
              <div>
                <ProgressBar
                  value={factors.locationMatch.score}
                  label={`Location Compatibility (${factors.locationMatch.weight}%)`}
                  color="success"
                />
                <p className="text-[11px] text-slate-500 mt-1">{factors.locationMatch.explanation}</p>
              </div>
              <div>
                <ProgressBar
                  value={factors.experienceMatch.score}
                  label={`Projects & Exposure (${factors.experienceMatch.weight}%)`}
                  color="primary"
                />
                <p className="text-[11px] text-slate-500 mt-1">{factors.experienceMatch.explanation}</p>
              </div>
              <div>
                <ProgressBar
                  value={factors.careerGoalMatch.score}
                  label={`Career Goals Alignment (${factors.careerGoalMatch.weight}%)`}
                  color="primary"
                />
                <p className="text-[11px] text-slate-500 mt-1">{factors.careerGoalMatch.explanation}</p>
              </div>
            </div>
          </div>
        )}

        {/* Explainability Key Reasons */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Matching Rationale
          </h4>
          <div className="space-y-2">
            {reasons.map((reason, index) => {
              const isPositive = reason.startsWith('✓');
              const isWarning = reason.startsWith('△');
              return (
                <div
                  key={index}
                  className={`p-3 rounded-lg border text-xs leading-relaxed flex items-start gap-2.5 ${
                    isPositive
                      ? 'bg-emerald-50/60 border-emerald-200 text-emerald-900'
                      : isWarning
                      ? 'bg-amber-50/60 border-amber-200 text-amber-900'
                      : 'bg-slate-50 border-slate-200 text-slate-800'
                  }`}
                >
                  {isPositive ? (
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  ) : isWarning ? (
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  ) : null}
                  <span>{reason}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Skill Gap & Learning Suggestions */}
        {skillGap && (skillGap.missingRequiredSkills.length > 0 || skillGap.missingPreferredSkills.length > 0) && (
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-blue-600" />
              Skill Gap & Free Learning Pathway
            </h4>
            <div className="space-y-2">
              {skillGap.learningSuggestions.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs"
                >
                  <div>
                    <span className="font-semibold text-slate-800">{item.skill}</span>
                    <span
                      className={`ml-2 px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        item.importance === 'REQUIRED'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {item.importance}
                    </span>
                    <p className="text-slate-600 mt-1">{item.suggestion}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Responsible AI Disclaimer */}
        <p className="text-[11px] text-slate-400 border-t border-slate-100 pt-3 italic">
          Note: Recommendations are generated based on your profile inputs and available scheme requirements.
          Scores represent compatibility for preparation purposes and do not guarantee final selection.
        </p>

        {/* Modal Actions */}
        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            Close Explanation
          </button>
        </div>
      </div>
    </Modal>
  );
};
