import { useEffect, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import api from '../../services/axios';
import PageLayout from '../../components/layout/PageLayout';
import { useToast } from '../../components/ui/Toast';
import type { RootState } from '../../store';

const SettingsPage = () => {
  const { showToast } = useToast();
  const userEmail = useSelector((state: RootState) => state.auth.user?.email || '');

  const [step, setStep] = useState<'email' | 'otp' | 'password'>('email');
  const [email, setEmail] = useState(userEmail);
  const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
  const [timeLeft, setTimeLeft] = useState(0);
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>(Array(6).fill(null));

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const constraints = [
    { label: 'Minimum 8 characters', met: newPassword.length >= 8 },
    { label: 'One uppercase letter', met: /[A-Z]/.test(newPassword) },
    { label: 'One lowercase letter', met: /[a-z]/.test(newPassword) },
    { label: 'One number', met: /\d/.test(newPassword) },
    { label: 'One special character', met: /[^A-Za-z0-9]/.test(newPassword) },
  ];
  const allConstraintsMet = constraints.every((rule) => rule.met);
  const otpCode = otp.join('');
  const isOtpComplete = otp.every((digit) => digit !== '');

  const sendOtpMutation = useMutation({
    mutationFn: async () => {
      const response = await api.post('/api/auth/forgot-password', { email }, { _skipErrorRedirect: true } as any);
      return response.data;
    },
    onSuccess: () => {
      showToast({ message: 'Password reset OTP sent to your email.', type: 'success' });
      setStep('otp');
      setOtp(Array(6).fill(''));
      setTimeLeft(300);
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Failed to send OTP';
      showToast({ message, type: 'error' });
    },
  });

  const verifyOtpMutation = useMutation({
    mutationFn: async () => {
      const response = await api.post(
        '/api/auth/verify-password-reset-otp',
        { email, otp: otpCode },
        { _skipErrorRedirect: true } as any,
      );
      return response.data;
    },
    onSuccess: () => {
      showToast({ message: 'OTP verified. Set your new password.', type: 'success' });
      setStep('password');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Invalid OTP';
      showToast({ message, type: 'error' });
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: async () => {
      const response = await api.post(
        '/api/auth/reset-password',
        {
          email,
          otp: otpCode,
          newPassword,
        },
        { _skipErrorRedirect: true } as any,
      );
      return response.data;
    },
    onSuccess: (data: any) => {
      showToast({ message: data?.message || 'Password updated successfully', type: 'success' });
      setStep('email');
      setOtp(Array(6).fill(''));
      setTimeLeft(0);
      setNewPassword('');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Failed to change password';
      showToast({ message, type: 'error' });
    },
  });

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      showToast({ message: 'Email is required', type: 'error' });
      return;
    }
    sendOtpMutation.mutate();
  };

  const handleOtpChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return;
    const next = [...otp];
    next[index] = value.slice(-1);
    setOtp(next);
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Backspace') {
      if (otp[index] === '' && index > 0) {
        inputRefs.current[index - 1]?.focus();
      } else {
        const next = [...otp];
        next[index] = '';
        setOtp(next);
      }
    }
    if (event.key === 'Enter') {
      handleVerifyOtp();
    }
  };

  const handleVerifyOtp = () => {
    if (!isOtpComplete) {
      showToast({ message: 'Please enter all 6 OTP digits', type: 'error' });
      return;
    }
    verifyOtpMutation.mutate();
  };

  const handleResendOtp = () => {
    if (timeLeft > 0 || sendOtpMutation.isPending) return;
    sendOtpMutation.mutate();
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isOtpComplete) {
      showToast({ message: 'OTP is required', type: 'error' });
      return;
    }
    if (!allConstraintsMet) {
      showToast({ message: 'Please satisfy all password constraints', type: 'error' });
      return;
    }
    changePasswordMutation.mutate();
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remaining = seconds % 60;
    return `${minutes}:${remaining < 10 ? '0' : ''}${remaining}`;
  };

  const getStepStatus = (stepName: 'email' | 'otp' | 'password') => {
    const order = ['email', 'otp', 'password'];
    const currentIndex = order.indexOf(step);
    const stepIndex = order.indexOf(stepName);
    
    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'active';
    return 'upcoming';
  };

  return (
    <PageLayout>
      <div className="w-full max-w-3xl mx-auto space-y-6">
        
        {/* Banner */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 p-8 md:p-10 shadow-lg">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full translate-y-1/3 -translate-x-1/3" />
          </div>
          <div className="relative z-10 flex items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white shrink-0 border-2 border-white/30 hidden md:flex">
              <span className="material-symbols-outlined text-[32px]">lock_reset</span>
            </div>
            <div>
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-sm text-white/90 text-xs font-bold tracking-wide uppercase mb-3">
                Security Settings
              </span>
              <h1 className="text-3xl font-black text-white tracking-tight">Change Password</h1>
              <p className="text-indigo-100 mt-2 text-sm leading-relaxed max-w-lg">
                Secure your account with OTP verification. Only users with valid email addresses can reset their passwords.
              </p>
            </div>
          </div>
        </div>

        {/* Action Card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8">
          
          {/* Stepper */}
          <div className="flex items-center justify-between mb-10 relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-100 -z-10 rounded-full"></div>
            
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shadow-sm transition-colors ${getStepStatus('email') === 'completed' ? 'bg-emerald-500 text-white' : getStepStatus('email') === 'active' ? 'bg-indigo-600 text-white ring-4 ring-indigo-50' : 'bg-white text-gray-400 border border-gray-200'}`}>
                {getStepStatus('email') === 'completed' ? <span className="material-symbols-outlined text-[16px]">check</span> : '1'}
              </div>
              <span className={`text-[11px] font-bold uppercase tracking-wider mt-2 ${getStepStatus('email') === 'active' ? 'text-indigo-600' : getStepStatus('email') === 'completed' ? 'text-emerald-500' : 'text-gray-400'}`}>Email</span>
            </div>
            
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shadow-sm transition-colors ${getStepStatus('otp') === 'completed' ? 'bg-emerald-500 text-white' : getStepStatus('otp') === 'active' ? 'bg-indigo-600 text-white ring-4 ring-indigo-50' : 'bg-white text-gray-400 border border-gray-200'}`}>
                {getStepStatus('otp') === 'completed' ? <span className="material-symbols-outlined text-[16px]">check</span> : '2'}
              </div>
              <span className={`text-[11px] font-bold uppercase tracking-wider mt-2 ${getStepStatus('otp') === 'active' ? 'text-indigo-600' : getStepStatus('otp') === 'completed' ? 'text-emerald-500' : 'text-gray-400'}`}>Verify OTP</span>
            </div>
            
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shadow-sm transition-colors ${getStepStatus('password') === 'completed' ? 'bg-emerald-500 text-white' : getStepStatus('password') === 'active' ? 'bg-indigo-600 text-white ring-4 ring-indigo-50' : 'bg-white text-gray-400 border border-gray-200'}`}>
                3
              </div>
              <span className={`text-[11px] font-bold uppercase tracking-wider mt-2 ${getStepStatus('password') === 'active' ? 'text-indigo-600' : 'text-gray-400'}`}>New Password</span>
            </div>
          </div>

          <div className="max-w-md mx-auto">
            {step === 'email' && (
              <form onSubmit={handleSendOtp} className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Registered Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition-all"
                    placeholder="Enter your registered email"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={sendOtpMutation.isPending}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md disabled:opacity-50 transition-all active:scale-95"
                >
                  {sendOtpMutation.isPending ? 'Sending...' : 'Send OTP verification'}
                  {!sendOtpMutation.isPending && <span className="material-symbols-outlined text-[18px]">arrow_forward</span>}
                </button>
              </form>
            )}

            {step === 'otp' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-center text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Enter 6-digit Code</label>
                  <div className="flex justify-center gap-2 md:gap-3">
                    {otp.map((digit, idx) => (
                      <input
                        key={idx}
                        ref={(el) => {
                          inputRefs.current[idx] = el;
                        }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(idx, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                        className="w-12 h-14 md:w-14 md:h-16 text-center text-2xl font-black border border-gray-300 rounded-xl bg-white text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                      />
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleVerifyOtp}
                  disabled={!isOtpComplete || verifyOtpMutation.isPending}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md disabled:opacity-50 transition-all active:scale-95"
                >
                  {verifyOtpMutation.isPending ? 'Verifying...' : 'Verify Email Code'}
                </button>

                <div className="text-center bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                    {timeLeft > 0 ? 'Time remaining' : 'OTP expired'}
                  </p>
                  <p className={`text-xl font-black mb-3 ${timeLeft > 0 ? 'text-gray-900' : 'text-red-500'}`}>
                    {timeLeft > 0 ? formatTime(timeLeft) : '0:00'}
                  </p>
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={timeLeft > 0 || sendOtpMutation.isPending}
                    className={`inline-flex items-center gap-1.5 px-4 py-2 ${timeLeft > 0 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'} rounded-lg text-xs font-bold uppercase transition-colors`}
                  >
                    <span className="material-symbols-outlined text-[16px]">refresh</span>
                    {sendOtpMutation.isPending ? 'Sending...' : 'Resend Code'}
                  </button>
                </div>
              </div>
            )}

            {step === 'password' && (
              <form onSubmit={handleChangePassword} className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">New Password Requirements</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-300 text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition-all"
                      placeholder="Enter new password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 h-8 w-8 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 flex items-center justify-center transition-colors"
                    >
                      <span className="material-symbols-outlined text-[20px]">{showPassword ? 'visibility_off' : 'visibility'}</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-2.5 p-5 bg-gray-50 rounded-xl border border-gray-200">
                  {constraints.map((constraint) => (
                    <div
                      key={constraint.label}
                      className={`flex items-center text-xs font-bold tracking-wide transition-colors duration-300 ${constraint.met ? 'text-emerald-500' : 'text-gray-400'}`}
                    >
                      <span className="material-symbols-outlined text-[16px] mr-2">
                        {constraint.met ? 'check_circle' : 'circle'}
                      </span>
                      {constraint.label}
                    </div>
                  ))}
                </div>

                <button
                  type="submit"
                  disabled={changePasswordMutation.isPending || !allConstraintsMet}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl shadow-md disabled:opacity-50 transition-all active:scale-95"
                >
                  {changePasswordMutation.isPending ? 'Updating...' : 'Save New Password'}
                  {!changePasswordMutation.isPending && <span className="material-symbols-outlined text-[18px]">lock_reset</span>}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default SettingsPage;
