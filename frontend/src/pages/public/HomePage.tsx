import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  Briefcase,
  Search,
  CheckCircle2,
  Building2,
  Users,
  ShieldCheck,
  TrendingUp,
  MapPin,
} from 'lucide-react';
import { InternshipCard } from '../../components/internships/InternshipCard';
import { CardSkeleton } from '../../components/common/LoadingSkeleton';
import api from '../../api/client';
import { Internship } from '../../types';

export const HomePage: React.FC = () => {
  const [keyword, setKeyword] = useState('');
  const [domain, setDomain] = useState('ALL');
  const [featuredInternships, setFeaturedInternships] = useState<Internship[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await api.get('/internships?limit=6&sortBy=createdAt');
        setFeaturedInternships(res.data.data || []);
      } catch (err) {
        console.error('Failed to fetch featured internships:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/internships?keyword=${encodeURIComponent(keyword)}&domain=${encodeURIComponent(domain)}`);
  };

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-slate-900 via-gov-navy to-slate-900 text-white pt-16 pb-24 overflow-hidden">
        {/* Subtle background ornamentation */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#f97316_1px,transparent_1px)] [background-size:16px_16px]"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-amber-300">
            <Sparkles className="w-3.5 h-3.5 text-gov-saffron" />
            <span>Ministry of Corporate Affairs • PM Internship Scheme</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight max-w-4xl mx-auto leading-tight">
            Find Internships That <span className="text-amber-400">Match Your Skills</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            AI-powered recommendations help you discover internship opportunities aligned with your
            education, skills, interests, and career goals.
          </p>

          {/* Quick Search Bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="max-w-3xl mx-auto bg-white p-2.5 rounded-2xl shadow-2xl flex flex-col sm:flex-row gap-2 border border-slate-200 text-slate-800"
          >
            <div className="flex-1 flex items-center gap-2 px-3 border-b sm:border-b-0 sm:border-r border-slate-200 py-1.5 sm:py-0">
              <Search className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Job title, technical skill, or keyword..."
                className="w-full text-xs sm:text-sm focus:outline-none placeholder-slate-400"
              />
            </div>

            <div className="sm:w-56 px-3 flex items-center py-1.5 sm:py-0">
              <select
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                className="w-full text-xs sm:text-sm bg-transparent focus:outline-none text-slate-700 cursor-pointer"
              >
                <option value="ALL">All Domains</option>
                <option value="Software Development">Software Development</option>
                <option value="Artificial Intelligence">Artificial Intelligence</option>
                <option value="Mechanical Engineering">Mechanical Engineering</option>
                <option value="Civil Infrastructure">Civil Infrastructure</option>
                <option value="Financial Services">Financial Services</option>
                <option value="Automotive Engineering">Automotive Engineering</option>
              </select>
            </div>

            <button
              type="submit"
              className="bg-gov-saffron hover:bg-gov-saffronLight text-white font-semibold px-6 py-3 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md shrink-0"
            >
              <span>Explore Internships</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              to="/register"
              className="px-6 py-2.5 rounded-xl bg-white text-gov-navy font-bold text-xs sm:text-sm hover:bg-slate-100 transition-all shadow-md"
            >
              Get Started Free
            </Link>
            <Link
              to="/how-it-works"
              className="px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-xs sm:text-sm border border-white/20 transition-all"
            >
              How Recommendation Works
            </Link>
          </div>
        </div>
      </section>

      {/* Scheme Key Metrics */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white p-6 rounded-2xl shadow-xl border border-slate-200">
          <div className="text-center p-3 border-r border-slate-100 last:border-none">
            <div className="text-2xl sm:text-3xl font-extrabold text-gov-navy">1.25 Crore</div>
            <div className="text-xs text-slate-500 font-medium mt-1">Youth Internship Target</div>
          </div>
          <div className="text-center p-3 border-r border-slate-100 last:border-none">
            <div className="text-2xl sm:text-3xl font-extrabold text-gov-saffron">Top 500</div>
            <div className="text-xs text-slate-500 font-medium mt-1">Partner Companies & PSUs</div>
          </div>
          <div className="text-center p-3 border-r border-slate-100 last:border-none">
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600">₹5,000 / mo</div>
            <div className="text-xs text-slate-500 font-medium mt-1">Direct Monthly Stipend</div>
          </div>
          <div className="text-center p-3">
            <div className="text-2xl sm:text-3xl font-extrabold text-gov-navy">100% Free</div>
            <div className="text-xs text-slate-500 font-medium mt-1">No Application Fees</div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold text-gov-saffron uppercase tracking-wider">
            STEP-BY-STEP PROCESS
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
            How The AI Recommendation Works
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-2">
            A transparent four-step pathway from your college profile to a 12-month career internship.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
          {[
            {
              step: '01',
              title: 'Build Your Profile',
              desc: 'Enter your education, degree, branch, CGPA, and career goals, or auto-fill via your resume.',
            },
            {
              step: '02',
              title: 'Analyze Your Skills',
              desc: 'Our engine extracts and verifies your technical and soft skills, mapping them to industry taxonomies.',
            },
            {
              step: '03',
              title: 'Discover Matching Internships',
              desc: 'Rule-based eligibility filtering ensures you only see valid roles, ranked by multi-factor compatibility scores.',
            },
            {
              step: '04',
              title: 'Apply & Track',
              desc: 'Submit 1-click applications directly to partner PSUs and top companies, with live status updates.',
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative group hover:border-gov-navy transition-all"
            >
              <div className="text-3xl font-black text-slate-200 group-hover:text-gov-saffron transition-colors mb-3">
                {item.step}
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">{item.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Internships */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3 mb-8">
          <div>
            <span className="text-xs font-bold text-gov-saffron uppercase tracking-wider">
              LATEST OPENINGS
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
              Featured PM Internship Opportunities
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Top private and public sector internship roles currently accepting applications.
            </p>
          </div>
          <Link
            to="/internships"
            className="text-xs sm:text-sm font-semibold text-gov-navy hover:text-gov-navyLight flex items-center gap-1 group"
          >
            <span>View All Internships</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredInternships.map((intern) => (
              <InternshipCard key={intern.id} internship={intern} />
            ))}
          </div>
        )}
      </section>

      {/* Partner Companies Banner */}
      <section className="bg-slate-100 py-12 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
            PARTNER ORGANIZATIONS UNDER PM INTERNSHIP SCHEME
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 sm:gap-12 opacity-75 grayscale hover:grayscale-0 transition-all">
            <span className="font-extrabold text-base sm:text-lg text-slate-700">TATA CONSULTANCY SERVICES</span>
            <span className="font-extrabold text-base sm:text-lg text-slate-700">LARSEN & TOUBRO</span>
            <span className="font-extrabold text-base sm:text-lg text-slate-700">BHEL</span>
            <span className="font-extrabold text-base sm:text-lg text-slate-700">RELIANCE INDUSTRIES</span>
            <span className="font-extrabold text-base sm:text-lg text-slate-700">STATE BANK OF INDIA</span>
            <span className="font-extrabold text-base sm:text-lg text-slate-700">INFOSYS</span>
            <span className="font-extrabold text-base sm:text-lg text-slate-700">MARUTI SUZUKI</span>
            <span className="font-extrabold text-base sm:text-lg text-slate-700">ONGC</span>
          </div>
        </div>
      </section>

      {/* Trust & Responsible AI Guarantee */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-gov-navy to-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              <span>Certified Responsible AI</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold">
              Transparent, Fair, and Merit-Ground Recommendation
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              We never infer sensitive demographics such as caste, religion, or background for
              recommendation ranking. Matching is grounded 100% in your academic qualifications,
              verified technical skills, and stated career aspirations.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <Link
              to="/register"
              className="px-6 py-3 rounded-xl bg-gov-saffron hover:bg-gov-saffronLight text-white font-bold text-xs sm:text-sm text-center shadow-lg transition-all"
            >
              Register Candidate Account
            </Link>
            <Link
              to="/how-it-works"
              className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm text-center border border-white/20 transition-all"
            >
              Read Algorithm Whitepaper
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
