import React, { useState } from 'react';
import { Badge } from '../../components/common/Badge';
import {
  Shield,
  CheckCircle,
  XCircle,
  HelpCircle,
  Sliders,
  Play,
  RotateCcw,
  BookOpen,
  Info,
} from 'lucide-react';

export const EligibilityRulesPage: React.FC = () => {
  // Simulator State
  const [testAge, setTestAge] = useState<number>(22);
  const [testDegree, setTestDegree] = useState<string>('B.Tech');
  const [testBranch, setTestBranch] = useState<string>('Computer Science');
  const [testCgpa, setTestCgpa] = useState<number>(7.5);
  const [testState, setTestState] = useState<string>('Karnataka');
  const [testSkills, setTestSkills] = useState<string>('Python, SQL, Problem Solving');
  const [simulationResult, setSimulationResult] = useState<any | null>(null);

  const runSimulation = () => {
    // Deterministic Rule evaluation matching eligibilityEngine.ts
    const checks = [
      {
        rule: 'Age Bracket (21 - 24 Years)',
        passed: testAge >= 21 && testAge <= 24,
        details:
          testAge >= 21 && testAge <= 24
            ? `Age ${testAge} is within the mandatory 21-24 bracket.`
            : `Age ${testAge} violates Scheme age limit (21 to 24 years).`,
      },
      {
        rule: 'Eligible Educational Degree',
        passed: !['M.Tech', 'MBA', 'PhD', 'Master of Science'].includes(testDegree),
        details: !['M.Tech', 'MBA', 'PhD', 'Master of Science'].includes(testDegree)
          ? `${testDegree} is an eligible undergraduate / diploma degree.`
          : `Postgraduates (${testDegree}) are ineligible under current Scheme rules.`,
      },
      {
        rule: 'Minimum CGPA Criterion (Min 6.0)',
        passed: testCgpa >= 6.0,
        details:
          testCgpa >= 6.0
            ? `CGPA of ${testCgpa} satisfies the 6.0 baseline.`
            : `CGPA of ${testCgpa} is below the 6.0 threshold.`,
      },
      {
        rule: 'Mandatory Technical Skills',
        passed: testSkills.toLowerCase().includes('python') || testSkills.toLowerCase().includes('sql'),
        details:
          testSkills.toLowerCase().includes('python') || testSkills.toLowerCase().includes('sql')
            ? 'Candidate possesses core technical competency requirements.'
            : 'Candidate lacks foundational mandatory domain skills.',
      },
      {
        rule: 'Geographic Allocation & Alignment',
        passed: true,
        details: `Domicile in ${testState} mapped to regional and pan-India training quotas.`,
      },
    ];

    const overallEligible = checks.every((c) => c.passed);
    setSimulationResult({ overallEligible, checks });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200">
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Shield className="w-6 h-6 text-gov-navy" /> Eligibility Engine & Scheme Rules
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Government statutory eligibility gates enforced prior to AI recommendation scoring.
        </p>
      </div>

      {/* Statutory Guidelines Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-2">
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-xs">
            01
          </div>
          <h3 className="font-bold text-slate-900 text-sm">Age Thresholds</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Must be aged between <strong>21 and 24 years</strong> (inclusive) at the time of application submission.
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xs">
            02
          </div>
          <h3 className="font-bold text-slate-900 text-sm">Educational Qualifications</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Candidates holding High School, ITI, Polytechnic Diploma, or Graduation degrees (B.Tech, BA, B.Sc, B.Com,
            BBA, BCA).
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-2">
          <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center font-bold text-xs">
            03
          </div>
          <h3 className="font-bold text-slate-900 text-sm">Exclusionary Criteria</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Candidates currently engaged in full-time employment or holding post-graduate degrees (IIT, IIM, IISER, NLU
            graduates) are restricted.
          </p>
        </div>
      </div>

      {/* Interactive Eligibility Tester */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-5">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Sliders className="w-5 h-5 text-gov-navy" /> Interactive Eligibility Rule Simulator
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Test candidate parameter combinations against the deterministic rules engine before batch processing.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Candidate Age</label>
            <input
              type="number"
              value={testAge}
              onChange={(e) => setTestAge(Number(e.target.value))}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gov-navy"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Degree Program</label>
            <select
              value={testDegree}
              onChange={(e) => setTestDegree(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-gov-navy"
            >
              <option value="B.Tech">B.Tech / B.E.</option>
              <option value="BCA">BCA</option>
              <option value="B.Sc">B.Sc (Computer Science / IT)</option>
              <option value="B.Com">B.Com</option>
              <option value="BBA">BBA</option>
              <option value="Diploma">Polytechnic Diploma</option>
              <option value="M.Tech">M.Tech (Postgraduate - Excluded)</option>
              <option value="MBA">MBA (Postgraduate - Excluded)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">CGPA / Grade</label>
            <input
              type="number"
              step="0.1"
              value={testCgpa}
              onChange={(e) => setTestCgpa(Number(e.target.value))}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gov-navy"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Branch / Specialization</label>
            <input
              type="text"
              value={testBranch}
              onChange={(e) => setTestBranch(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gov-navy"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Domicile State</label>
            <input
              type="text"
              value={testState}
              onChange={(e) => setTestState(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gov-navy"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Verified Skills</label>
            <input
              type="text"
              value={testSkills}
              onChange={(e) => setTestSkills(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gov-navy"
            />
          </div>
        </div>

        <div className="flex gap-3 pt-3">
          <button
            onClick={runSimulation}
            className="flex items-center gap-2 px-5 py-2.5 bg-gov-navy text-white text-sm font-semibold rounded-xl hover:bg-slate-800 transition"
          >
            <Play className="w-4 h-4 fill-white" /> Run Eligibility Simulation
          </button>
          <button
            onClick={() => {
              setTestAge(22);
              setTestDegree('B.Tech');
              setTestBranch('Computer Science');
              setTestCgpa(7.5);
              setTestState('Karnataka');
              setTestSkills('Python, SQL, Problem Solving');
              setSimulationResult(null);
            }}
            className="flex items-center gap-1.5 px-4 py-2.5 border border-slate-200 text-slate-600 text-sm font-semibold rounded-xl hover:bg-slate-50 transition"
          >
            <RotateCcw className="w-4 h-4" /> Reset
          </button>
        </div>

        {/* Simulation Output */}
        {simulationResult && (
          <div className="mt-4 p-5 rounded-xl border border-slate-200 bg-slate-50 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Simulation Verdict</span>
              <Badge variant={simulationResult.overallEligible ? 'green' : 'red'}>
                {simulationResult.overallEligible ? 'STATUS: ELIGIBLE' : 'STATUS: NOT ELIGIBLE'}
              </Badge>
            </div>

            <div className="space-y-2">
              {simulationResult.checks.map((check: any, idx: number) => (
                <div
                  key={idx}
                  className="p-3 bg-white border border-slate-200 rounded-lg flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    {check.passed ? (
                      <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-600 shrink-0" />
                    )}
                    <div>
                      <span className="font-semibold text-slate-800">{check.rule}</span>
                      <p className="text-slate-500 text-[11px] mt-0.5">{check.details}</p>
                    </div>
                  </div>
                  <Badge variant={check.passed ? 'green' : 'red'}>{check.passed ? 'Passed' : 'Failed'}</Badge>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
