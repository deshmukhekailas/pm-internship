import React from 'react';
import { ShieldCheck, Phone, Mail } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-8 border-t-4 border-gov-saffron">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
          {/* Col 1: Portal Overview */}
          <div className="space-y-4 max-w-lg">
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

          {/* Col 2: Grievance & Helpdesk */}
          <div className="space-y-4">
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase mb-2">
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
