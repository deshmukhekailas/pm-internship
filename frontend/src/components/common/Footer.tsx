import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Phone, Mail, ExternalLink, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-8 border-t-4 border-gov-saffron">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Col 1: Portal Overview */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-gov-saffron"></span>
              <h3 className="text-white font-bold text-sm tracking-wide">PM INTERNSHIP SCHEME</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              An initiative of the Ministry of Corporate Affairs, Government of India, delivering
              transformative 12-month internship opportunities in top 500 partner companies for Indian youth.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>100% Verified Public & Private Sector Roles</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase mb-4">
              Quick Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/internships" className="hover:text-white transition-colors">
                  Explore Opportunities
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="hover:text-white transition-colors">
                  Recommendation Algorithm
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  Scheme Guidelines & Stipend
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-white transition-colors">
                  Candidate Login Portal
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-white transition-colors">
                  New Candidate Registration
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Guidelines & Legal */}
          <div>
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase mb-4">
              Transparency & Policies
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/privacy" className="hover:text-white transition-colors">
                  Fairness & Responsible AI Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-white transition-colors">
                  Terms of Service & Code of Conduct
                </Link>
              </li>
              <li>
                <a
                  href="https://pminternship.mca.gov.in"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition-colors flex items-center gap-1"
                >
                  Official MCA Portal <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
              </li>
              <li>
                <a
                  href="http://localhost:5000/api/docs"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition-colors flex items-center gap-1"
                >
                  OpenAPI / Swagger Docs <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Grievance & Helpdesk */}
          <div>
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase mb-4">
              Candidate Helpdesk
            </h4>
            <div className="space-y-3 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gov-saffron shrink-0" />
                <span>Toll Free: 1800-11-6000 / 1800-11-2000</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gov-saffron shrink-0" />
                <span>pminternship-support@mca.gov.in</span>
              </div>
              <p className="text-[11px] text-slate-500 pt-1">
                Helpdesk hours: Monday - Saturday (9:00 AM - 6:00 PM IST)
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Disclaimer */}
        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 gap-4">
          <p>© 2026 PM Internship Scheme Recommendation Engine. Ministry of Corporate Affairs, New Delhi.</p>
          <p className="flex items-center gap-1">
            Empowering Youth Employment & Technical Skills
          </p>
        </div>
      </div>
    </footer>
  );
};
