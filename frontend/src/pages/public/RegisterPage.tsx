import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Briefcase,
  User,
  Mail,
  Lock,
  Phone,
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  KeyRound,
  RefreshCw,
  Eye,
  EyeOff,
  ShieldCheck,
} from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [devOtp, setDevOtp] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { user, isAuthenticated, isLoading, registerWithOtp, sendOtp } = useAuth();
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

  // Countdown timer for resending OTP
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  if (isLoading || (isAuthenticated && user)) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-gov-navy border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Validate compulsory password
  const validatePassword = (pwd: string): string | null => {
    if (!pwd || pwd.length < 8) {
      return 'Password is compulsory and must be at least 8 characters long.';
    }
    if (!/[A-Z]/.test(pwd)) {
      return 'Password must contain at least one uppercase letter (A-Z).';
    }
    if (!/[0-9]/.test(pwd)) {
      return 'Password must contain at least one number (0-9).';
    }
    return null;
  };

  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!firstName.trim() || !lastName.trim()) {
      setError('Please provide your first and last name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    // Validate mandatory password
    const pwdError = validatePassword(password);
    if (pwdError) {
      setError(pwdError);
      return;
    }

    if (password !== confirmPassword) {
      setError('Password and Confirm Password do not match.');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const res = await sendOtp(email.trim(), 'SIGNUP');
      setOtpSent(true);
      setResendCooldown(60);
      setSuccessMsg(`Verification code sent to ${email.trim()}`);
      if (res.devOtp) {
        setDevOtp(res.devOtp);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Failed to send verification code.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!agreeTerms) {
      setError('Please agree to the PM Internship Scheme Terms & Conditions.');
      return;
    }
    if (otp.trim().length !== 6) {
      setError('Please enter the full 6-digit verification code.');
      return;
    }

    // Re-verify password
    const pwdError = validatePassword(password);
    if (pwdError) {
      setError(pwdError);
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await registerWithOtp({
        email: email.trim(),
        otp: otp.trim(),
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phone: phone.trim() || undefined,
        password: password, // Compulsory password
      });
      navigate('/student/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed. Please check your verification code.');
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
          <h2 className="text-2xl font-extrabold text-gov-navy">Register with Email OTP</h2>
          <p className="text-xs text-slate-500">
            Verify your email with a 6-digit OTP and set your account password.
          </p>
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

          {/* Registration Form (OTP Based + Compulsory Password) */}
          <div className="space-y-4">
            {/* Step 1: Candidate Details & Mandatory Password */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  First Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    disabled={otpSent}
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Aarav"
                    className="w-full text-xs pl-9 pr-3 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-gov-navy/20 focus:border-gov-navy disabled:bg-slate-50 disabled:text-slate-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Last Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  disabled={otpSent}
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Sharma"
                  className="w-full text-xs px-3 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-gov-navy/20 focus:border-gov-navy disabled:bg-slate-50 disabled:text-slate-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email Address <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  disabled={otpSent}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="aarav.sharma@example.com"
                  className="w-full text-xs pl-9 pr-3 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-gov-navy/20 focus:border-gov-navy disabled:bg-slate-50 disabled:text-slate-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Mobile Number (Optional)
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="tel"
                  disabled={otpSent}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full text-xs pl-9 pr-3 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-gov-navy/20 focus:border-gov-navy disabled:bg-slate-50 disabled:text-slate-500"
                />
              </div>
            </div>

            {/* Compulsory Password Fields */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-semibold text-slate-700">
                  Set Password <span className="text-rose-500">* (Compulsory)</span>
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[11px] text-slate-500 hover:text-slate-800 flex items-center gap-1"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  <span>{showPassword ? 'Hide' : 'Show'}</span>
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  disabled={otpSent}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 8 chars with 1 uppercase & 1 number"
                  className="w-full text-xs pl-9 pr-3 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-gov-navy/20 focus:border-gov-navy disabled:bg-slate-50 disabled:text-slate-500"
                />
              </div>
              <p className="text-[10px] text-slate-400 mt-1">
                Must contain at least 8 characters, 1 uppercase letter, and 1 number.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Confirm Password <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <ShieldCheck className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  disabled={otpSent}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter your password"
                  className="w-full text-xs pl-9 pr-3 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-gov-navy/20 focus:border-gov-navy disabled:bg-slate-50 disabled:text-slate-500"
                />
              </div>
              {confirmPassword && password !== confirmPassword && (
                <p className="text-[10px] text-rose-500 mt-1">Passwords do not match.</p>
              )}
            </div>

            {/* Action before OTP sent */}
            {!otpSent ? (
              <button
                type="button"
                onClick={handleSendOtp}
                disabled={isSubmitting || !email || !firstName || !lastName || !password || !confirmPassword}
                className="w-full py-2.5 px-4 bg-gov-navy hover:bg-gov-navyLight disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5"
              >
                {isSubmitting ? (
                  <span>Sending Verification Code...</span>
                ) : (
                  <>
                    <KeyRound className="w-4 h-4" />
                    <span>Send 6-Digit Email Code</span>
                  </>
                )}
              </button>
            ) : (
              /* Step 2: OTP Verification & Final Submission */
              <form onSubmit={handleRegisterSubmit} className="space-y-4 pt-2 border-t border-slate-200">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-semibold text-slate-700">
                      Enter 6-Digit Verification Code <span className="text-rose-500">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setOtpSent(false);
                        setOtp('');
                        setDevOtp(null);
                        setError(null);
                      }}
                      className="text-[11px] text-gov-navy hover:underline font-semibold"
                    >
                      Edit Details
                    </button>
                  </div>
                  <input
                    type="text"
                    maxLength={6}
                    required
                    autoFocus
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                    placeholder="000000"
                    className="w-full text-center text-lg font-mono tracking-[0.5em] py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-gov-navy/20 focus:border-gov-navy font-bold"
                  />
                </div>

                {/* Dev Mode Notification & 1-Click Auto Fill */}
                {devOtp && (
                  <div className="bg-amber-50 border border-amber-300 rounded-xl p-3 text-xs text-amber-900 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold flex items-center gap-1.5">
                        <span>🔑 Verification Code:</span>
                        <span className="font-mono text-sm bg-white px-2 py-0.5 rounded border border-amber-300 text-gov-navy font-black tracking-widest">{devOtp}</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => setOtp(devOtp)}
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
                  <span>Didn't get code?</span>
                  <button
                    type="button"
                    disabled={resendCooldown > 0 || isSubmitting}
                    onClick={handleSendOtp}
                    className="font-semibold text-gov-navy hover:underline disabled:opacity-50 flex items-center gap-1"
                  >
                    <RefreshCw className={`w-3 h-3 ${isSubmitting ? 'animate-spin' : ''}`} />
                    {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend Code'}
                  </button>
                </div>

                <div className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    id="agreeTermsRegister"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="mt-0.5 rounded text-gov-navy focus:ring-gov-navy"
                  />
                  <label htmlFor="agreeTermsRegister" className="text-[11px] text-slate-600 leading-relaxed">
                    I agree to the{' '}
                    <Link to="/terms" className="text-gov-navy font-semibold hover:underline">
                      PM Internship Scheme Terms
                    </Link>{' '}
                    and confirm my registration details.
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || otp.length !== 6 || !agreeTerms}
                  className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5"
                >
                  {isSubmitting ? (
                    <span>Verifying OTP & Creating Account...</span>
                  ) : (
                    <>
                      <span>Verify OTP & Complete Registration</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          <div className="pt-3 border-t border-slate-100 text-center text-xs text-slate-500">
            Already registered?{' '}
            <Link to="/login" className="text-gov-navy font-bold hover:underline">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
