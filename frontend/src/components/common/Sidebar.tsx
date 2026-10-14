import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Sparkles,
  Search,
  Bookmark,
  FileCheck,
  FileText,
  User,
  Settings,
  Bell,
  Users,
  Briefcase,
  Building2,
  BarChart3,
  Sliders,
  Database,
  Shield,
  HelpCircle,
} from 'lucide-react';

interface NavItem {
  to: string;
  label: string;
  icon: any;
  highlight?: boolean;
}

interface SidebarProps {
  role: 'STUDENT' | 'ADMIN';
}

export const Sidebar: React.FC<SidebarProps> = ({ role }) => {
  const { user } = useAuth();

  const studentLinks: NavItem[] = [
    { to: '/student/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/student/recommendations', label: 'AI Recommendations', icon: Sparkles, highlight: true },
    { to: '/internships', label: 'Explore Internships', icon: Search },
    { to: '/student/saved', label: 'Saved Internships', icon: Bookmark },
    { to: '/student/applications', label: 'My Applications', icon: FileCheck },
    { to: '/student/profile', label: 'Profile & Skills', icon: User },
    { to: '/student/resume', label: 'Resume Analyzer', icon: FileText },
    { to: '/student/notifications', label: 'Notifications', icon: Bell },
    { to: '/student/settings', label: 'Settings', icon: Settings },
  ];

  const adminLinks: NavItem[] = [
    { to: '/admin/dashboard', label: 'Dashboard Overview', icon: LayoutDashboard },
    { to: '/admin/internships', label: 'Internships Management', icon: Briefcase },
    { to: '/admin/students', label: 'Candidate Profiles', icon: Users },
    { to: '/admin/applications', label: 'Application Review', icon: FileCheck },
    { to: '/admin/organizations', label: 'Partner Companies', icon: Building2 },
    { to: '/admin/analytics', label: 'Recommendation Analytics', icon: BarChart3 },
    { to: '/admin/eligibility-rules', label: 'Eligibility Engine Rules', icon: Shield },
    { to: '/admin/settings', label: 'Scoring Weights & AI', icon: Sliders },
    { to: '/admin/import-export', label: 'Data Import / Export', icon: Database },
  ];

  const links: NavItem[] = role === 'STUDENT' ? studentLinks : adminLinks;

  return (
    <aside className="w-64 bg-white border-r border-slate-200 shrink-0 hidden md:block min-h-[calc(100vh-6rem)]">
      <div className="p-4 space-y-6">
        {/* User Card */}
        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gov-navy text-white text-xs font-bold flex items-center justify-center">
              {user?.firstName?.[0] || 'U'}
              {user?.lastName?.[0] || 'S'}
            </div>
            <div className="min-w-0">
              <h4 className="text-sm font-semibold text-slate-800 truncate">
                {user?.firstName} {user?.lastName}
              </h4>
              <p className="text-xs text-slate-500 capitalize">{user?.role?.toLowerCase()} Portal</p>
            </div>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="space-y-1">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/student/dashboard' || link.to === '/admin/dashboard'}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-gov-navy text-white shadow-sm shadow-gov-navy/20'
                      : link.highlight
                      ? 'text-gov-navy hover:bg-amber-50 font-semibold'
                      : 'text-slate-600 hover:text-gov-navy hover:bg-slate-50'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      className={`w-4 h-4 ${
                        isActive
                          ? 'text-white'
                          : link.highlight
                          ? 'text-gov-saffron'
                          : 'text-slate-400 group-hover:text-gov-navy'
                      }`}
                    />
                    <span className="flex-1">{link.label}</span>
                    {link.highlight && !isActive && (
                      <span className="w-2 h-2 rounded-full bg-gov-saffron"></span>
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Responsible AI Transparency Box */}
        <div className="bg-blue-50/70 p-3 rounded-lg border border-blue-100 text-[11px] text-blue-900 leading-relaxed">
          <div className="font-semibold flex items-center gap-1 mb-1">
            <HelpCircle className="w-3 h-3 text-blue-600" /> Explainable AI
          </div>
          Recommendations are calculated transparently based on your verified skills, education, and stated preferences.
        </div>
      </div>
    </aside>
  );
};
