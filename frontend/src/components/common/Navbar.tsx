import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Briefcase,
  User as UserIcon,
  LogOut,
  Bell,
  Menu,
  X,
  Sparkles,
  ShieldCheck,
  ChevronDown,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      {/* Top Government Scheme Ribbon */}
      <div className="bg-gov-navy text-white text-xs px-4 py-1.5 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-gov-saffron"></span>
          <span className="font-medium tracking-wide">
            MINISTRY OF CORPORATE AFFAIRS • GOVERNMENT OF INDIA
          </span>
        </div>
        <div className="hidden sm:flex items-center gap-4 text-slate-300">
          <span>PM Internship Scheme 2026</span>
          <span className="text-slate-400">|</span>
          <span className="hover:text-white cursor-pointer">Toll-free: 1800-11-6000</span>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo & Portal Title */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gov-navy to-gov-navyLight flex items-center justify-center text-white shadow-md shadow-gov-navy/20">
              <Briefcase className="w-5 h-5 text-gov-saffron" />
            </div>
            <div>
              <div className="text-base font-bold text-gov-navy leading-tight tracking-tight flex items-center gap-1.5">
                <span>PM INTERNSHIP SCHEME</span>
                <span className="bg-amber-100 text-amber-800 text-[10px] font-semibold px-1.5 py-0.5 rounded border border-amber-300">
                  AI RECOMMENDATION
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">National Youth Career Matching Portal</p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              to="/internships"
              className="text-sm font-medium text-slate-700 hover:text-gov-navy transition-colors"
            >
              Explore Internships
            </Link>
            <Link
              to="/how-it-works"
              className="text-sm font-medium text-slate-700 hover:text-gov-navy transition-colors flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5 text-gov-saffron" />
              How AI Works
            </Link>
            <Link
              to="/about"
              className="text-sm font-medium text-slate-700 hover:text-gov-navy transition-colors"
            >
              About Scheme
            </Link>
            <Link
              to="/contact"
              className="text-sm font-medium text-slate-700 hover:text-gov-navy transition-colors"
            >
              Help & FAQ
            </Link>
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated && user ? (
              <div className="flex items-center gap-3">
                {user.role === 'STUDENT' && (
                  <Link
                    to="/student/notifications"
                    className="p-2 text-slate-600 hover:text-gov-navy rounded-full hover:bg-slate-100 transition-colors relative"
                    title="Notifications"
                  >
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-gov-saffron"></span>
                  </Link>
                )}

                {/* Profile menu dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-100 transition-colors border border-slate-200"
                  >
                    <div className="w-8 h-8 rounded-full bg-gov-navy text-white text-xs font-bold flex items-center justify-center">
                      {user.firstName[0]}
                      {user.lastName[0]}
                    </div>
                    <div className="text-left text-xs hidden lg:block">
                      <div className="font-semibold text-slate-800">
                        {user.firstName} {user.lastName}
                      </div>
                      <div className="text-slate-500 capitalize">{user.role.toLowerCase()}</div>
                    </div>
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  </button>

                  {profileDropdownOpen && (
                    <div
                      className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in slide-in-from-top-2"
                      onMouseLeave={() => setProfileDropdownOpen(false)}
                    >
                      <div className="px-4 py-2 border-b border-slate-100">
                        <p className="text-xs font-semibold text-slate-800">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-xs text-slate-500 truncate">{user.email}</p>
                      </div>

                      {user.role === 'STUDENT' ? (
                        <>
                          <Link
                            to="/student/dashboard"
                            onClick={() => setProfileDropdownOpen(false)}
                            className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-gov-navy"
                          >
                            <Briefcase className="w-4 h-4" /> Dashboard
                          </Link>
                          <Link
                            to="/student/recommendations"
                            onClick={() => setProfileDropdownOpen(false)}
                            className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-gov-navy"
                          >
                            <Sparkles className="w-4 h-4 text-gov-saffron" /> AI Recommendations
                          </Link>
                          <Link
                            to="/student/profile"
                            onClick={() => setProfileDropdownOpen(false)}
                            className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-gov-navy"
                          >
                            <UserIcon className="w-4 h-4" /> My Profile
                          </Link>
                        </>
                      ) : (
                        <>
                          <Link
                            to="/admin/dashboard"
                            onClick={() => setProfileDropdownOpen(false)}
                            className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-gov-navy"
                          >
                            <ShieldCheck className="w-4 h-4 text-gov-navy" /> Admin Portal
                          </Link>
                          <Link
                            to="/admin/internships"
                            onClick={() => setProfileDropdownOpen(false)}
                            className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-gov-navy"
                          >
                            <Briefcase className="w-4 h-4" /> Manage Internships
                          </Link>
                        </>
                      )}

                      <div className="border-t border-slate-100 my-1"></div>
                      <button
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          logout();
                        }}
                        className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50"
                      >
                        <LogOut className="w-4 h-4" /> Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-gov-navy hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Candidate Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-semibold text-white bg-gov-navy hover:bg-gov-navyLight rounded-lg shadow-sm transition-all"
                >
                  Register Free
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-gov-navy rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-3">
          <Link
            to="/internships"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-slate-700 hover:text-gov-navy"
          >
            Explore Internships
          </Link>
          <Link
            to="/how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-slate-700 hover:text-gov-navy"
          >
            How AI Recommendation Works
          </Link>
          <Link
            to="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-slate-700 hover:text-gov-navy"
          >
            About PM Internship Scheme
          </Link>
          <Link
            to="/contact"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-slate-700 hover:text-gov-navy"
          >
            Contact & Grievances
          </Link>

          <div className="border-t border-slate-100 pt-4">
            {isAuthenticated && user ? (
              <div className="space-y-2">
                <Link
                  to={user.role === 'STUDENT' ? '/student/dashboard' : '/admin/dashboard'}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full py-2.5 text-center text-sm font-semibold text-white bg-gov-navy rounded-lg"
                >
                  Go to {user.role === 'STUDENT' ? 'Student Dashboard' : 'Admin Portal'}
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                  }}
                  className="block w-full py-2.5 text-center text-sm font-semibold text-rose-600 bg-rose-50 rounded-lg"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2.5 text-center text-sm font-semibold text-gov-navy border border-gov-navy rounded-lg"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2.5 text-center text-sm font-semibold text-white bg-gov-navy rounded-lg"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
