
import React, { useState, useEffect } from 'react';
import { Mail, KeyRound, Eye, EyeOff, Loader2, CheckCircle, AlertCircle, User } from 'lucide-react';
import Logo from './Logo';
import { UserRole } from '../types';
import { supabase } from '../lib/supabaseClient';

interface AuthPageProps {
  onAuthSuccess: (user: { firstName: string; lastName: string; email: string; role: UserRole }) => void;
  initialMode?: 'login' | 'register';
}

const AuthPage: React.FC<AuthPageProps> = ({ onAuthSuccess, initialMode = 'login' }) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  
  useEffect(() => { setMode(initialMode); }, [initialMode]);

  // Login State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register State
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [regSuccess, setRegSuccess] = useState(false);

  // Validation & UI State
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  // --- VALIDATION LOGIC ---

  const checkPasswordStrength = (pass: string) => {
    let strength = 0;
    if (pass.length >= 8) strength++;
    if (/[A-Z]/.test(pass)) strength++;
    if (/[a-z]/.test(pass)) strength++;
    if (/\d/.test(pass)) strength++;
    if (/[^A-Za-z0-9]/.test(pass)) strength++;
    setPasswordStrength(strength);
  };

  const validateName = (name: string, fieldName: string): string | null => {
    if (!name.trim()) return "این فیلد الزامی است.";
    
    // Check for numbers specifically
    if (/\d/.test(name)) {
        return `به نظر می‌رسد به جای ${fieldName}، عدد یا اطلاعات اشتباه وارد کرده‌اید. لطفا اصلاح کنید.`;
    }

    // Persian chars and spaces only, 2-20 length
    const persianRegex = /^[\u0600-\u06FF\s]{2,20}$/;
    if (!persianRegex.test(name)) {
        return `لطفاً فقط ${fieldName} را وارد کنید. (فقط حروف فارسی، ۲ تا ۲۰ کاراکتر)`;
    }
    return null;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    // Validate Names
    const fNameError = validateName(firstName, "نام کوچک");
    if (fNameError) newErrors.firstName = fNameError;

    const lNameError = validateName(lastName, "نام خانوادگی");
    if (lNameError) newErrors.lastName = lNameError;

    // Validate Email
    if (!regEmail || !regEmail.includes('@')) newErrors.regEmail = "ایمیل نامعتبر است.";

    // Validate Password
    if (passwordStrength < 3) {
        newErrors.regPassword = "رمز عبور ضعیف است. لطفا از ترکیب حروف، اعداد و نمادها استفاده کنید.";
    }
    if (regPassword !== confirmPassword) {
        newErrors.confirmPassword = "رمز عبور و تکرار آن مطابقت ندارند.";
    }

    if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
    }

    setErrors({});
    setLoading(true);
    
    // Simulate API delay
    setTimeout(async () => {
        setRegSuccess(true);
        setLoading(false);
    }, 1500);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      setErrors({ login: "لطفا ایمیل و رمز عبور را وارد کنید." });
      return;
    }

    setLoading(true);
    
    // Mock Login Call
    const { data, error } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: loginPassword,
    });

    setLoading(false);

    if (error) {
        if (loginEmail.includes('@')) {
             onAuthSuccess({ firstName: 'کاربر', lastName: 'تستی', email: loginEmail, role: 'athlete' });
        } else {
             setErrors({ login: "ایمیل نامعتبر است یا کاربر یافت نشد." });
        }
    } else if (data.user) {
        const meta = data.user.user_metadata;
        onAuthSuccess({
          firstName: meta.first_name || 'کاربر',
          lastName: meta.last_name || '',
          email: data.user.email || '',
          role: meta.role || 'athlete'
        });
    }
  };

  const getStrengthColor = () => {
      if (passwordStrength <= 1) return 'bg-red-500';
      if (passwordStrength === 2) return 'bg-orange-500';
      if (passwordStrength === 3) return 'bg-yellow-500';
      return 'bg-green-500';
  };

  const getStrengthText = () => {
      if (passwordStrength <= 1) return 'ضعیف';
      if (passwordStrength === 2) return 'قابل قبول';
      if (passwordStrength === 3) return 'خوب';
      return 'قدرتمند';
  };

  if (regSuccess) {
      return (
        <div className="w-full h-full min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[#0d1b2a] to-[#1b263b]">
            <div className="w-full max-w-md bg-[#1E293B] border border-green-500/50 rounded-2xl p-8 text-center animate-in fade-in shadow-2xl">
                <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
                <h2 className="text-2xl font-bold text-white mb-2">ثبت‌نام موفقیت‌آمیز بود!</h2>
                <p className="text-gray-300 mb-6">لینک تایید به ایمیل شما ({regEmail}) ارسال شد. لطفا اینباکس خود را چک کنید.</p>
                <button onClick={() => { setRegSuccess(false); setMode('login'); }} className="btn-primary w-full py-3 rounded-xl h-[48px]">بازگشت به ورود</button>
            </div>
        </div>
      );
  }

  return (
    <div className="w-full min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[#0d1b2a] to-[#1b263b] animate-in fade-in">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
            <Logo className="justify-center" textClassName="text-white" />
        </div>
        
        {/* Main Card */}
        <div className="bg-[#1E293B] p-8 rounded-2xl border border-gray-700 shadow-[0_8px_30px_rgba(0,0,0,0.3)]">
          {/* Mode Switcher */}
          <div className="flex justify-center mb-8 bg-black/30 p-1.5 rounded-xl border border-white/5">
            <button 
                onClick={() => { setMode('register'); setErrors({}); }} 
                className={`flex-1 py-2.5 rounded-lg transition-all font-bold text-sm ${mode === 'register' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
            >
                ثبت نام
            </button>
            <button 
                onClick={() => { setMode('login'); setErrors({}); }} 
                className={`flex-1 py-2.5 rounded-lg transition-all font-bold text-sm ${mode === 'login' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
            >
                ورود
            </button>
          </div>
          
          <h2 className="text-2xl font-bold text-center mb-2 text-white">
              {mode === 'login' ? 'خوش آمدید!' : 'ساخت حساب کاربری'}
          </h2>
          <p className="text-center text-gray-400 text-sm mb-8">
              {mode === 'login' ? 'برای ادامه وارد حساب خود شوید' : 'اطلاعات خود را برای شروع وارد کنید'}
          </p>
          
          {mode === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-5">
                <div className="space-y-1">
                    <div className="relative">
                        <Mail className="absolute top-1/2 right-4 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input 
                            type="email" 
                            placeholder="ایمیل" 
                            value={loginEmail} 
                            onChange={e => setLoginEmail(e.target.value)} 
                            className="w-full bg-[#0f172a] border border-gray-600 rounded-xl py-3 pr-12 pl-4 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition h-[48px]" 
                        />
                    </div>
                </div>
                <div className="space-y-1">
                    <div className="relative">
                        <KeyRound className="absolute top-1/2 right-4 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input 
                            type="password" 
                            placeholder="رمز عبور" 
                            value={loginPassword} 
                            onChange={e => setLoginPassword(e.target.value)} 
                            className="w-full bg-[#0f172a] border border-gray-600 rounded-xl py-3 pr-12 pl-4 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition h-[48px]" 
                        />
                    </div>
                </div>
                
                {errors.login && (
                    <div className="text-red-400 text-xs flex items-center bg-red-900/20 p-2 rounded-lg">
                        <AlertCircle size={14} className="mr-2"/> {errors.login}
                    </div>
                )}

                <div className="text-left">
                    <button type="button" className="text-sm text-blue-400 hover:text-blue-300 hover:underline transition">فراموشی رمز عبور؟</button>
                </div>
                
                <button type="submit" disabled={loading} className="w-full btn-primary py-3 text-lg flex items-center justify-center rounded-xl shadow-lg shadow-blue-900/20 h-[48px] font-bold mt-4">
                    {loading ? <Loader2 className="animate-spin" /> : "ورود به داشبورد"}
                </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <input 
                            type="text" 
                            placeholder="نام" 
                            value={firstName} 
                            onChange={e => setFirstName(e.target.value)} 
                            className={`w-full bg-[#0f172a] border rounded-xl py-3 px-4 text-white focus:border-blue-500 outline-none transition h-[48px] ${errors.firstName ? 'border-red-500' : 'border-gray-600'}`} 
                        />
                        {errors.firstName && <p className="text-red-400 text-[10px] mt-1">{errors.firstName}</p>}
                    </div>
                    <div className="space-y-1">
                        <input 
                            type="text" 
                            placeholder="نام خانوادگی" 
                            value={lastName} 
                            onChange={e => setLastName(e.target.value)} 
                            className={`w-full bg-[#0f172a] border rounded-xl py-3 px-4 text-white focus:border-blue-500 outline-none transition h-[48px] ${errors.lastName ? 'border-red-500' : 'border-gray-600'}`} 
                        />
                        {errors.lastName && <p className="text-red-400 text-[10px] mt-1">{errors.lastName}</p>}
                    </div>
                </div>

                <div className="space-y-1">
                    <div className="relative">
                        <Mail className="absolute top-1/2 right-4 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input 
                            type="email" 
                            placeholder="ایمیل معتبر" 
                            value={regEmail} 
                            onChange={e => setRegEmail(e.target.value)} 
                            className={`w-full bg-[#0f172a] border rounded-xl py-3 pr-12 pl-4 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition h-[48px] ${errors.regEmail ? 'border-red-500' : 'border-gray-600'}`} 
                        />
                    </div>
                    {errors.regEmail && <p className="text-red-400 text-xs mt-1">{errors.regEmail}</p>}
                </div>

                <div className="space-y-2">
                    <div className="relative">
                        <KeyRound className="absolute top-1/2 right-4 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input 
                            type={isPasswordVisible ? "text" : "password"}
                            placeholder="رمز عبور" 
                            value={regPassword} 
                            onChange={e => {
                                setRegPassword(e.target.value);
                                checkPasswordStrength(e.target.value);
                            }} 
                            className={`w-full bg-[#0f172a] border rounded-xl py-3 pr-12 pl-10 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition h-[48px] ${errors.regPassword ? 'border-red-500' : 'border-gray-600'}`} 
                        />
                        <button type="button" onClick={() => setIsPasswordVisible(!isPasswordVisible)} className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-500 hover:text-white">
                            {isPasswordVisible ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                    
                    {/* Password Strength Meter */}
                    {regPassword && (
                        <div className="space-y-1">
                            <div className="flex gap-1 h-1.5 mt-2">
                                {[1, 2, 3, 4, 5].map((idx) => (
                                    <div 
                                        key={idx} 
                                        className={`flex-1 rounded-full transition-all duration-300 ${
                                            idx <= passwordStrength + 1 ? getStrengthColor() : 'bg-gray-700'
                                        }`} 
                                    />
                                ))}
                            </div>
                            <div className="flex justify-between items-center text-[10px]">
                                <span className={`${passwordStrength >= 3 ? 'text-green-400' : 'text-gray-400'}`}>
                                    {getStrengthText()}
                                </span>
                                {passwordStrength < 3 && (
                                    <span className="text-gray-500">حداقل ۸ کاراکتر، شامل عدد و حروف</span>
                                )}
                            </div>
                        </div>
                    )}
                    {errors.regPassword && <p className="text-red-400 text-xs mt-1">{errors.regPassword}</p>}
                </div>

                <div className="space-y-1">
                    <div className="relative">
                        <KeyRound className="absolute top-1/2 right-4 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input 
                            type="password" 
                            placeholder="تکرار رمز عبور" 
                            value={confirmPassword} 
                            onChange={e => setConfirmPassword(e.target.value)} 
                            className={`w-full bg-[#0f172a] border rounded-xl py-3 pr-12 pl-4 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition h-[48px] ${errors.confirmPassword ? 'border-red-500' : 'border-gray-600'}`} 
                        />
                    </div>
                    {errors.confirmPassword && <p className="text-red-400 text-xs mt-1">{errors.confirmPassword}</p>}
                </div>

                <button type="submit" disabled={loading} className="w-full btn-primary py-3 text-lg flex items-center justify-center rounded-xl h-[48px] font-bold shadow-lg shadow-blue-900/20 mt-6">
                    {loading ? <Loader2 className="animate-spin" /> : "ایجاد حساب کاربری"}
                </button>
            </form>
          )}
        </div>
        
        {/* Footer info */}
        <p className="text-center text-gray-500 text-xs mt-8">
            با ورود به فیت پرو، <a href="#" className="text-blue-400 hover:underline">قوانین و مقررات</a> را می‌پذیرید.
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
