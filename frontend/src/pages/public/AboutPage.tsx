import React from 'react';
import { ShieldCheck, Award, Building2, BookOpen, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="text-center space-y-3">
        <span className="text-xs font-bold text-gov-saffron uppercase tracking-wider">
          OFFICIAL SCHEME INFORMATION
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gov-navy">
          About the PM Internship Scheme
        </h1>
        <p className="text-sm text-slate-600 max-w-2xl mx-auto">
          Empowering Indian youth with practical corporate exposure, real-world skills, and financial
          stipend across India's top 500 companies.
        </p>
      </div>

      {/* Overview Card */}
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Background & Vision</h2>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          The Prime Minister's Internship Scheme is a landmark national initiative championed by the
          Ministry of Corporate Affairs (MCA), Government of India. Designed to bridge the critical
          transition gap between academic education and industry readiness, the scheme provides 1.25
          crore youth with immersive 12-month internships in leading corporate enterprises and public sector
          undertakings (PSUs) over a five-year period.
        </p>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Through a state-of-the-art AI-Powered Recommendation Engine, candidates from diverse
          educational backgrounds (including engineering, commerce, science, humanities, and polytechnics)
          are transparently matched with optimal internship opportunities tailored to their degree, skill
          inventory, and geographic preferences.
        </p>
      </div>

      {/* Key Financial Support & Benefits */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-200 space-y-2">
          <div className="text-2xl font-black text-emerald-800">₹5,000 / month</div>
          <h3 className="font-bold text-sm text-emerald-900">Monthly Financial Stipend</h3>
          <p className="text-xs text-emerald-700 leading-relaxed">
            ₹4,500 disbursed directly by the Government of India via Direct Benefit Transfer (DBT) +
            ₹500 contributed by the partner corporate from CSR funds.
          </p>
        </div>

        <div className="bg-blue-50 p-6 rounded-2xl border border-blue-200 space-y-2">
          <div className="text-2xl font-black text-blue-800">₹6,000 One-Time</div>
          <h3 className="font-bold text-sm text-blue-900">Incidentals Grant</h3>
          <p className="text-xs text-blue-700 leading-relaxed">
            Provided by the Central Government upon joining to assist with initial relocation, travel,
            and preparation costs.
          </p>
        </div>

        <div className="bg-purple-50 p-6 rounded-2xl border border-purple-200 space-y-2">
          <div className="text-2xl font-black text-purple-800">12 Months</div>
          <h3 className="font-bold text-sm text-purple-900">Industry Experience</h3>
          <p className="text-xs text-purple-700 leading-relaxed">
            Hands-on mentorship, enterprise toolchains, live project contributions, and official
            completion certification by top 500 corporations.
          </p>
        </div>
      </div>

      {/* Eligibility Guidelines */}
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        <h2 className="text-xl font-bold text-slate-900">Candidate Eligibility Criteria</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            'Age between 21 and 24 years at the time of application submission.',
            'Indian nationality with valid identity verification (Aadhaar).',
            'Completed 10th, 12th, ITI, Diploma, Undergraduate degree (B.Tech, B.Sc, B.Com, BCA, etc.) or Post-graduate degree.',
            'Not currently engaged in full-time regular employment.',
            'Family annual income threshold as notified under MCA regulations.',
            'Passionate about building industry-relevant technical or managerial skills.',
          ].map((item, idx) => (
            <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <span className="text-xs text-slate-700 leading-relaxed">{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Call to action */}
      <div className="bg-slate-900 text-white p-8 rounded-2xl text-center space-y-4">
        <h3 className="text-xl font-bold">Ready to Start Your Career Journey?</h3>
        <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
          Create your student profile today, explore recommended opportunities, and apply directly to
          India's leading organizations.
        </p>
        <div className="pt-2">
          <Link
            to="/register"
            className="px-6 py-2.5 rounded-xl bg-gov-saffron hover:bg-gov-saffronLight text-white font-bold text-xs sm:text-sm inline-block shadow-md transition-all"
          >
            Register Free on Portal
          </Link>
        </div>
      </div>
    </div>
  );
};
