import React from 'react';
import { ShieldCheck, Lock, EyeOff, FileText } from 'lucide-react';

export const PrivacyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 text-slate-700">
      <div className="space-y-2 text-center">
        <span className="text-xs font-bold text-gov-saffron uppercase tracking-wider">
          RESPONSIBLE AI & DATA PROTECTION
        </span>
        <h1 className="text-3xl font-extrabold text-gov-navy">
          Privacy Policy & Ethical AI Principles
        </h1>
        <p className="text-xs text-slate-500">
          Last updated: September 2026 • Ministry of Corporate Affairs, Government of India
        </p>
      </div>

      <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-2xl space-y-2">
        <div className="flex items-center gap-2 font-bold text-emerald-900 text-sm">
          <ShieldCheck className="w-5 h-5 text-emerald-600" />
          <span>Our Responsible AI & Non-Discrimination Charter</span>
        </div>
        <p className="text-xs text-emerald-800 leading-relaxed">
          The AI-Based Internship Recommendation Engine operates under strict ethical guidelines.
          Recommendations are determined solely on verified skills, degree curricula, academic readiness,
          and stated professional interests. We strictly prohibit inferring or scoring candidates on
          sensitive personal attributes including religion, caste, political beliefs, health status, or
          sexual orientation.
        </p>
      </div>

      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6 text-xs sm:text-sm leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">1. Information Collected</h2>
          <p>
            When registering and maintaining your profile under the PM Internship Scheme, we collect
            candidate name, contact information (email, phone), verified date of birth (for age
            eligibility verification under scheme guidelines), educational qualifications (institutes,
            degrees, branches, CGPA), skills inventory, projects, and optional resumes.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">2. Purpose of Processing & AI Matching</h2>
          <p>
            Your information is processed to match you against verified internship opportunities in top 500
            participating companies, verify statutory eligibility prerequisites, calculate compatibility
            scores, and enable direct application tracking.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">3. Data Security & Storage</h2>
          <p>
            All candidate profiles, uploaded resumes, and application records are encrypted in transit
            using TLS 1.3 and stored in secure database environments adhering to Government of India data
            localization and information security mandates. Passwords are salted and hashed using
            industry-standard cryptographic algorithms.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">4. Sharing with Partner Organizations</h2>
          <p>
            When you explicitly submit an application for an internship, your profile snapshot, contact
            details, and resume are transmitted to the verified hiring coordinators of the respective
            partner company. Your information is never sold to third-party commercial marketing entities.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">5. Candidate Rights & Control</h2>
          <p>
            Candidates retain full control over their profile data, including the right to review extracted
            resume data before saving, update preferences, delete skills, and withdraw submitted
            applications at any time prior to final offer acceptance.
          </p>
        </section>
      </div>
    </div>
  );
};
