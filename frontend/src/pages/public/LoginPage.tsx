import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Briefcase, Lock, Mail, AlertCircle, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [roleTab, setRoleTab] = useState<'STUDENT' | 'ADMIN'>('STUDENT');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleDemoStudent = () => {
    setRoleTab('STUDENT');
    setEmail('student@pminternship.gov.in');
    setPassword('Student@12345');
    setError(null);
  };

  const handleDemoAdmin = () => {
    setRoleTab('ADMIN');
    setEmail('admin@pminternship.gov.in');
    setPassword('Admin@12345');
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const user = await login(email, password);
      if (user.role === 'ADMIN') {
        navigate('/admin/dashboard');
      } else {
        navigate('/student/dashboard');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Invalid email or password. Please verify your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-6">
        {/* Brand header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gov-navy text-white flex items-center justify-center mx-auto shadow-lg shadow-gov-navy/20">
            <Briefcase className="w-6 h-6 text-gov-saffron" />
          </div>
          <h2 className="text-2xl font-extrabold text-gov-navy">Sign In to Your Account</h2>
          <p className="text-xs text-slate-500">
            Access your PM Internship Scheme profile, recommendations, and applications.
          </p>
        </div>

        {/* Role Tab Selector */}
        <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs font-semibold">
          <button
            type="button"
            onClick={() => {
              setRoleTab('STUDENT');
              setError(null);
            }}
            className={`py-2 rounded-lg transition-all ${
              roleTab === 'STUDENT'
                ? 'bg-white text-gov-navy shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Candidate / Student
          </button>
          <button
            type="button"
            onClick={() => {
              setRoleTab('ADMIN');
              setError(null);
            }}
            className={`py-2 rounded-lg transition-all ${
              roleTab === 'ADMIN'
                ? 'bg-white text-gov-navy shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Scheme Administrator
          </button>
        </div>

        {/* Quick Demo Credentials Bar */}
        <div className="bg-amber-50/80 p-3 rounded-xl border border-amber-200 text-xs space-y-2">
          <div className="flex items-center gap-1.5 font-bold text-amber-900">
            <Sparkles className="w-3.5 h-3.5 text-gov-saffron" />
            <span>Instant Demo Access (Zero Friction)</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleDemoStudent}
              className="px-2.5 py-1.5 bg-white text-slate-800 border border-amber-300 hover:bg-amber-100/50 rounded-lg text-left text-[11px] font-semibold transition-colors"
            >
              ⚡ Fill Demo Student
            </button>
            <button
              type="button"
              onClick={handleDemoAdmin}
              className="px-2.5 py-1.5 bg-white text-slate-800 border border-amber-300 hover:bg-amber-100/50 rounded-lg text-left text-[11px] font-semibold transition-colors"
            >
              ⚡ Fill Demo Admin
            </button>
          </div>
        </div>

        {/* Login Card */}
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-5">
          {error && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Registered Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full text-xs pl-9 pr-3 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-gov-navy/20 focus:border-gov-navy"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-semibold text-slate-700">Password</label>
                <a href="#forgot" className="text-[11px] text-gov-navy hover:underline">
                  Forgot Password?
                </a>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full text-xs pl-9 pr-3 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-gov-navy/20 focus:border-gov-navy"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 bg-gov-navy hover:bg-gov-navyLight disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5"
            >
              {isSubmitting ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>Sign In as {roleTab === 'STUDENT' ? 'Student' : 'Admin'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="pt-3 border-t border-slate-100 text-center text-xs text-slate-500">
            Don't have an account yet?{' '}
            <Link to="/register" className="text-gov-navy font-bold hover:underline">
              Register Free
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
