import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Briefcase,
  Lock,
  Mail,
  AlertCircle,
  ArrowRight,
  KeyRound,
  RefreshCw,
  CheckCircle2,
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [roleTab, setRoleTab] = useState<'STUDENT' | 'ADMIN'>('STUDENT');
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Candidate / Student state (completely isolated)
  const [candidateAuthMethod, setCandidateAuthMethod] = useState<'OTP' | 'PASSWORD'>('OTP');
  const [candidateEmail, setCandidateEmail] = useState('');
  const [candidatePassword, setCandidatePassword] = useState('');
  const [candidateOtp, setCandidateOtp] = useState('');
  const [candidateOtpSent, setCandidateOtpSent] = useState(false);
  const [candidateDevOtp, setCandidateDevOtp] = useState<string | null>(null);
  const [candidateCooldown, setCandidateCooldown] = useState(0);

  // Scheme Administrator state (completely isolated)
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');

  const { user, isAuthenticated, isLoading, login, sendOtp, loginWithOtp } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      if (user.role === 'ADMIN') {
        navigate('/admin/dashboard', { replace: true });
      } else {
        navigate('/student/dashboard', { replace: true });
      }
    }
  }, [isLoading, isAuthenticated, user, navigate]);

  // Cooldown timer effect for Candidate OTP
  useEffect(() => {
    if (candidateCooldown <= 0) return;
    const timer = setInterval(() => {
      setCandidateCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [candidateCooldown]);

  if (isLoading || (isAuthenticated && user)) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-gov-navy border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // Admin Handlers (Only operates on Admin state)
  // -------------------------------------------------------------
  const handleAdminPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const user = await login(adminEmail, adminPassword);
      if (user.role === 'ADMIN') {
        navigate('/admin/dashboard');
      } else {
        navigate('/student/dashboard');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Invalid administrator email or password.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // -------------------------------------------------------------
  // Candidate Handlers (Only operates on Candidate state)
  // -------------------------------------------------------------
  const handleCandidateSendOtp = async () => {
    if (!candidateEmail) {
      setError('Please enter your registered candidate email address.');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const res = await sendOtp(candidateEmail, 'LOGIN');
      setCandidateOtpSent(true);
      setCandidateCooldown(60);
      setSuccessMsg(`Verification code sent to ${candidateEmail}`);
      if (res.devOtp) {
        setCandidateDevOtp(res.devOtp);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Failed to send verification code.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCandidateOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (candidateOtp.length !== 6) {
      setError('Please enter the full 6-digit verification code.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const user = await loginWithOtp(candidateEmail, candidateOtp);
      if (user.role === 'ADMIN') {
        navigate('/admin/dashboard');
      } else {
        navigate('/student/dashboard');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Invalid or expired verification code.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCandidatePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const user = await login(candidateEmail, candidatePassword);
      if (user.role === 'ADMIN') {
        navigate('/admin/dashboard');
      } else {
        navigate('/student/dashboard');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Invalid email or password. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-6">
        {/* Brand header */}
        <div className="text-center space-y-2">
          <img
            src="https://pminternship.mca.gov.in/assets/images/img/pm_internship_logo_eng.svg"
            alt="PM Internship Scheme Logo"
            className="h-16 w-auto mx-auto object-contain select-none"
            onError={(e) => {
              e.currentTarget.src = '/pm_internship_logo_eng.svg';
            }}
          />
          <h2 className="text-2xl font-extrabold text-gov-navy">Sign In with Email</h2>
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
              setSuccessMsg(null);
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
              setSuccessMsg(null);
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

        {/* Main Card */}
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-5">
          {error && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* ======================================================== */}
          {/* SCHEME ADMINISTRATOR VIEW                                 */}
          {/* ======================================================== */}
          {roleTab === 'ADMIN' && (
            <div className="space-y-4">
              {/* Admin Login Form */}
              <form onSubmit={handleAdminPasswordSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Administrator Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="email"
                      required
                      value={adminEmail}
                      onChange={(e) => setAdminEmail(e.target.value)}
                      placeholder="admin@pminternship.gov.in"
                      className="w-full text-xs pl-9 pr-3 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-gov-navy/20 focus:border-gov-navy"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Administrator Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="password"
                      required
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full text-xs pl-9 pr-3 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-gov-navy/20 focus:border-gov-navy"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || !adminEmail || !adminPassword}
                  className="w-full py-2.5 px-4 bg-gov-navy hover:bg-gov-navyLight disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5"
                >
                  {isSubmitting ? (
                    <span>Authenticating...</span>
                  ) : (
                    <>
                      <span>Sign In as Administrator</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* ======================================================== */}
          {/* CANDIDATE / STUDENT VIEW                                  */}
          {/* ======================================================== */}
          {roleTab === 'STUDENT' && (
            <div className="space-y-5">
              {/* Candidate Auth Method Toggle (OTP vs Password) */}
              <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => {
                    setCandidateAuthMethod('OTP');
                    setError(null);
                  }}
                  className={`flex-1 py-2 rounded-lg transition flex items-center justify-center gap-1.5 ${
                    candidateAuthMethod === 'OTP'
                      ? 'bg-white text-gov-navy shadow-xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>Email OTP (Passwordless)</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCandidateAuthMethod('PASSWORD');
                    setError(null);
                  }}
                  className={`flex-1 py-2 rounded-lg transition flex items-center justify-center gap-1.5 ${
                    candidateAuthMethod === 'PASSWORD'
                      ? 'bg-white text-gov-navy shadow-xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Password</span>
                </button>
              </div>

              {/* Candidate Password Sign In */}
              {candidateAuthMethod === 'PASSWORD' && (
                <form onSubmit={handleCandidatePasswordSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Registered Candidate Email
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="email"
                        required
                        value={candidateEmail}
                        onChange={(e) => setCandidateEmail(e.target.value)}
                        placeholder="candidate@example.com"
                        className="w-full text-xs pl-9 pr-3 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-gov-navy/20 focus:border-gov-navy"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-xs font-semibold text-slate-700">Password</label>
                      <button
                        type="button"
                        onClick={() => setCandidateAuthMethod('OTP')}
                        className="text-[11px] text-gov-navy hover:underline"
                      >
                        Use Email OTP instead
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="password"
                        required
                        value={candidatePassword}
                        onChange={(e) => setCandidatePassword(e.target.value)}
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
                        <span>Sign In as Candidate</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* Candidate Email OTP Sign In */}
              {candidateAuthMethod === 'OTP' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Registered Candidate Email
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="email"
                        required
                        disabled={candidateOtpSent}
                        value={candidateEmail}
                        onChange={(e) => setCandidateEmail(e.target.value)}
                        placeholder="candidate@example.com"
                        className="w-full text-xs pl-9 pr-3 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-gov-navy/20 focus:border-gov-navy disabled:bg-slate-50 disabled:text-slate-500"
                      />
                    </div>
                  </div>

                  {!candidateOtpSent ? (
                    <button
                      type="button"
                      onClick={handleCandidateSendOtp}
                      disabled={isSubmitting || !candidateEmail}
                      className="w-full py-2.5 px-4 bg-gov-navy hover:bg-gov-navyLight disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5"
                    >
                      {isSubmitting ? (
                        <span>Sending Code...</span>
                      ) : (
                        <>
                          <KeyRound className="w-4 h-4" />
                          <span>Send 6-Digit Verification Code</span>
                        </>
                      )}
                    </button>
                  ) : (
                    <form onSubmit={handleCandidateOtpSubmit} className="space-y-4">
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <label className="text-xs font-semibold text-slate-700">
                            Enter 6-Digit Code
                          </label>
                          <button
                            type="button"
                            onClick={() => {
                              setCandidateOtpSent(false);
                              setCandidateOtp('');
                              setCandidateDevOtp(null);
                            }}
                            className="text-[11px] text-gov-navy hover:underline"
                          >
                            Change Email
                          </button>
                        </div>
                        <input
                          type="text"
                          maxLength={6}
                          required
                          autoFocus
                          value={candidateOtp}
                          onChange={(e) => setCandidateOtp(e.target.value.replace(/[^0-9]/g, ''))}
                          placeholder="000000"
                          className="w-full text-center text-lg font-mono tracking-[0.5em] py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-gov-navy/20 focus:border-gov-navy font-bold"
                        />
                      </div>

                      {/* Dev Mode One-Click Auto Fill */}
                      {candidateDevOtp && (
                        <div className="bg-amber-50 border border-amber-300 rounded-xl p-3 text-xs text-amber-900 space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold flex items-center gap-1.5">
                              <span>🔑 Verification Code:</span>
                              <span className="font-mono text-sm bg-white px-2 py-0.5 rounded border border-amber-300 text-gov-navy font-black tracking-widest">{candidateDevOtp}</span>
                            </span>
                            <button
                              type="button"
                              onClick={() => setCandidateOtp(candidateDevOtp)}
                              className="px-2.5 py-1 bg-gov-navy text-white text-[11px] font-bold rounded-lg hover:bg-gov-navyLight transition shadow-xs"
                            >
                              Auto-fill Code
                            </button>
                          </div>
                          <p className="text-[11px] text-amber-700 leading-normal">
                            <strong>Notice:</strong> Real email delivery requires SMTP credentials in <code className="bg-amber-100 px-1 py-0.5 rounded font-mono">backend/.env</code>. Until configured, verification codes are generated locally and logged to the backend console.
                          </p>
                        </div>
                      )}

                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span>Didn't receive code?</span>
                        <button
                          type="button"
                          disabled={candidateCooldown > 0 || isSubmitting}
                          onClick={handleCandidateSendOtp}
                          className="font-semibold text-gov-navy hover:underline disabled:opacity-50 flex items-center gap-1"
                        >
                          <RefreshCw className={`w-3 h-3 ${isSubmitting ? 'animate-spin' : ''}`} />
                          {candidateCooldown > 0 ? `Resend in ${candidateCooldown}s` : 'Resend Code'}
                        </button>
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting || candidateOtp.length !== 6}
                        className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5"
                      >
                        {isSubmitting ? (
                          <span>Verifying...</span>
                        ) : (
                          <>
                            <span>Verify & Sign In</span>
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </form>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Card Footer */}
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
