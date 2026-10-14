import React, { useState } from 'react';
import { Sparkles, Shield, Cpu, Sliders, CheckCircle2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const HowItWorksPage: React.FC = () => {
  // Interactive weight simulator state
  const [skillWeight, setSkillWeight] = useState(30);
  const [eduWeight, setEduWeight] = useState(20);
  const [domainWeight, setDomainWeight] = useState(15);
  const [locWeight, setLocWeight] = useState(10);
  const [expWeight, setExpWeight] = useState(10);
  const [goalWeight, setGoalWeight] = useState(10);
  const [prefWeight, setPrefWeight] = useState(5);

  // Sample student values
  const sampleSkillScore = 85;
  const sampleEduScore = 95;
  const sampleDomainScore = 100;
  const sampleLocScore = 100;
  const sampleExpScore = 75;
  const sampleGoalScore = 80;
  const samplePrefScore = 100;

  const totalWeight =
    skillWeight + eduWeight + domainWeight + locWeight + expWeight + goalWeight + prefWeight;

  const calculatedScore = Math.round(
    (sampleSkillScore * skillWeight +
      sampleEduScore * eduWeight +
      sampleDomainScore * domainWeight +
      sampleLocScore * locWeight +
      sampleExpScore * expWeight +
      sampleGoalScore * goalWeight +
      samplePrefScore * prefWeight) /
      totalWeight
  );

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="text-center space-y-3">
        <span className="text-xs font-bold text-gov-saffron uppercase tracking-wider">
          AI RECOMMENDATION ARCHITECTURE
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gov-navy">
          How Our Recommendation Engine Works
        </h1>
        <p className="text-sm text-slate-600 max-w-2xl mx-auto">
          A hybrid recommendation engine combining deterministic eligibility rules with multi-factor
          machine learning similarity scoring.
        </p>
      </div>

      {/* Two-Stage Architecture Diagram */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Stage 1: Deterministic Rules */}
        <div className="bg-white p-6 rounded-2xl border-2 border-gov-navy/20 shadow-sm space-y-4">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-gov-navy flex items-center justify-center font-bold text-sm">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">STAGE 1</span>
            <h3 className="text-lg font-bold text-slate-900 mt-0.5">
              Rule-Based Eligibility Engine
            </h3>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Before calculating compatibility, strict non-negotiable eligibility criteria are evaluated:
          </p>
          <ul className="space-y-2 text-xs text-slate-700">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Degree and Branch whitelist verification</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Minimum academic CGPA / percentage threshold</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Graduation year eligibility bracket</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Mandatory prerequisite skills verification</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Age bracket enforcement (21 to 24 years)</span>
            </li>
          </ul>
          <div className="pt-2 border-t border-slate-100 flex items-center gap-2 text-xs font-semibold text-slate-500">
            Outputs: <span className="text-emerald-700">"Eligible"</span> | <span className="text-rose-700">"Not Eligible"</span> | <span className="text-slate-700">"Unknown"</span>
          </div>
        </div>

        {/* Stage 2: AI/ML Scoring */}
        <div className="bg-white p-6 rounded-2xl border-2 border-gov-saffron/30 shadow-sm space-y-4">
          <div className="w-10 h-10 rounded-xl bg-orange-50 text-gov-saffron flex items-center justify-center font-bold text-sm">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">STAGE 2</span>
            <h3 className="text-lg font-bold text-slate-900 mt-0.5">
              Multi-Factor AI Scoring & Ranking
            </h3>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Eligible internships are ranked using a multi-attribute weighted scoring algorithm:
          </p>
          <ul className="space-y-2 text-xs text-slate-700">
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-gov-saffron"></span>
              <span><strong>30% Skill Match:</strong> Jaccard similarity & weighted required vs preferred skills</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-gov-saffron"></span>
              <span><strong>20% Education:</strong> Degree discipline, academic curriculum alignment & CGPA</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-gov-saffron"></span>
              <span><strong>15% Domain Interest:</strong> Candidate stated career preferences</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-gov-saffron"></span>
              <span><strong>10% Location:</strong> Preferred city, resident state, or remote preference</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-gov-saffron"></span>
              <span><strong>10% Project/Experience:</strong> TF-IDF & Cosine text similarity matching</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-gov-saffron"></span>
              <span><strong>10% Career Goals:</strong> Text semantic alignment with role objectives</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-gov-saffron"></span>
              <span><strong>5% Preference Match:</strong> Work mode (Remote/Onsite/Hybrid)</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Interactive Weight Simulator */}
      <div className="bg-slate-900 text-white p-8 rounded-3xl space-y-6 shadow-xl border border-slate-800">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <span className="text-xs font-bold text-gov-saffron uppercase tracking-wider flex items-center gap-1.5">
              <Sliders className="w-4 h-4" /> INTERACTIVE ALGORITHM SIMULATOR
            </span>
            <h3 className="text-xl font-bold mt-1">Test Weight Configurations Live</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Adjust weights below to see how candidate compatibility scores adapt in real-time.
            </p>
          </div>
          <div className="bg-slate-800/80 px-5 py-3 rounded-2xl border border-slate-700 text-center">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
              SIMULATED COMPATIBILITY
            </span>
            <div className="text-3xl font-extrabold text-amber-400 mt-0.5">{calculatedScore}%</div>
            <span className="text-[11px] text-emerald-400 font-medium">Eligible Match</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 pt-4 border-t border-slate-800 text-xs">
          <div>
            <div className="flex justify-between mb-1.5 font-medium">
              <span>Skill Match Weight:</span>
              <span className="text-amber-400 font-bold">{skillWeight}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="60"
              value={skillWeight}
              onChange={(e) => setSkillWeight(Number(e.target.value))}
              className="w-full accent-gov-saffron cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between mb-1.5 font-medium">
              <span>Education Weight:</span>
              <span className="text-amber-400 font-bold">{eduWeight}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              value={eduWeight}
              onChange={(e) => setEduWeight(Number(e.target.value))}
              className="w-full accent-gov-saffron cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between mb-1.5 font-medium">
              <span>Domain Interest Weight:</span>
              <span className="text-amber-400 font-bold">{domainWeight}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="40"
              value={domainWeight}
              onChange={(e) => setDomainWeight(Number(e.target.value))}
              className="w-full accent-gov-saffron cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between mb-1.5 font-medium">
              <span>Location Match Weight:</span>
              <span className="text-amber-400 font-bold">{locWeight}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="30"
              value={locWeight}
              onChange={(e) => setLocWeight(Number(e.target.value))}
              className="w-full accent-gov-saffron cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between mb-1.5 font-medium">
              <span>Experience & Projects:</span>
              <span className="text-amber-400 font-bold">{expWeight}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="30"
              value={expWeight}
              onChange={(e) => setExpWeight(Number(e.target.value))}
              className="w-full accent-gov-saffron cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between mb-1.5 font-medium">
              <span>Career Goal Weight:</span>
              <span className="text-amber-400 font-bold">{goalWeight}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="30"
              value={goalWeight}
              onChange={(e) => setGoalWeight(Number(e.target.value))}
              className="w-full accent-gov-saffron cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* AI Modes Comparison */}
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        <h2 className="text-xl font-bold text-slate-900">Dual Execution Modes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-600 leading-relaxed">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <h4 className="text-sm font-bold text-gov-navy">Mode 1: Deterministic Local ML (Default)</h4>
            <p>
              Operates 100% locally with zero external API dependencies. Employs tokenization, TF-IDF
              inverse document frequencies, and Cosine similarity metrics to score projects, descriptions,
              and skills deterministically and reproducibly.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-200 space-y-2">
            <h4 className="text-sm font-bold text-gov-saffron">Mode 2: Optional Generative AI (Gemini)</h4>
            <p>
              When a secure server API key is provided, Google Gemini 1.5 enriches recommendations by
              extracting deep semantic entity patterns from resumes and generating nuanced natural language
              rationales, seamlessly falling back to Mode 1 when offline.
            </p>
          </div>
        </div>
      </div>

      {/* Call to action */}
      <div className="text-center pt-4">
        <Link
          to="/internships"
          className="px-6 py-3 rounded-xl bg-gov-navy hover:bg-gov-navyLight text-white font-bold text-xs sm:text-sm inline-flex items-center gap-2 shadow-md transition-all"
        >
          <span>Explore Live Internships</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
