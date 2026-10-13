import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Logo } from '../components/Logo';
import { 
  Lock, 
  Mail, 
  User, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  AlertCircle, 
  ArrowUpRight 
} from 'lucide-react';

export const AuthPage = ({ initialMode = 'login' }) => {
  const { switchUserRole, setCurrentView, addToast } = useApp();

  const [mode, setMode] = useState(initialMode); // 'login' | 'register'
  const [roleSelection, setRoleSelection] = useState('student'); // 'student' | 'faculty'
  const [emailOrRoll, setEmailOrRoll] = useState('zaid.saifee@hitech.ac.in');
  const [fullName, setFullName] = useState('Zaid Saifee');
  const [password, setPassword] = useState('zaid#campus2026');
  const [department, setDepartment] = useState('Computer Science & Engineering');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (mode === 'register' && !fullName.trim()) {
      setError('Please provide your full legal name.');
      return;
    }
    if (!emailOrRoll.trim()) {
      setError('Please provide your College Roll Number or Official Email.');
      return;
    }
    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      switchUserRole('student');
      setCurrentView('dashboard');
      addToast(
        mode === 'login' ? 'Welcome back, Zaid Saifee!' : 'Student account registered successfully!',
        'success'
      );
    }, 500);
  };

  const handleDemoStudentLogin = () => {
    switchUserRole('student');
    setCurrentView('dashboard');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div 
            onClick={() => setCurrentView('home')}
            className="inline-flex items-center justify-center cursor-pointer"
          >
            <Logo />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight pt-2">
            {mode === 'login' ? 'Sign In to CampusFind' : 'Create CampusFind Account'}
          </h2>
          <p className="text-xs text-stone-600 max-w-xs mx-auto">
            {mode === 'login' 
              ? 'Enter your student credentials to report or reclaim items.' 
              : 'Join with your college roll number for verified campus recovery.'}
          </p>
        </div>

        {/* Quick Demo Switcher Card */}
        <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4 text-xs space-y-2">
          <div className="flex items-center gap-2 font-bold text-amber-900">
            <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Student Account Portal</span>
          </div>
          <p className="text-[11px] text-stone-600 leading-relaxed">
            Click below to instantly access Zaid Saifee's student portal:
          </p>
          <button
            type="button"
            onClick={handleDemoStudentLogin}
            className="w-full px-3.5 py-2.5 bg-white hover:bg-amber-100/50 border border-amber-300 rounded-xl text-left text-slate-800 transition-colors shadow-xs flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <img
                src="/zaid-saifee.png"
                alt="Zaid Saifee"
                className="w-9 h-9 rounded-full object-cover ring-2 ring-orange-500/20"
              />
              <div>
                <div className="font-bold text-xs text-slate-900">Sign in as Zaid Saifee ↗</div>
                <div className="text-[10px] text-stone-500">Roll: 220132010045 • CSE 3rd Year</div>
              </div>
            </div>
            <span className="text-[11px] font-bold text-orange-600">Quick Access</span>
          </button>
        </div>

        {/* Auth Box */}
        <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-md">
          
          {/* Mode Switch Tabs */}
          <div className="grid grid-cols-2 p-1 bg-stone-100 rounded-xl mb-6 text-xs font-bold">
            <button
              type="button"
              onClick={() => { setMode('login'); setError(''); }}
              className={`py-2 rounded-lg transition-all ${
                mode === 'login' ? 'bg-white text-slate-900 shadow-xs' : 'text-stone-500 hover:text-slate-900'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setMode('register'); setError(''); }}
              className={`py-2 rounded-lg transition-all ${
                mode === 'register' ? 'bg-white text-slate-900 shadow-xs' : 'text-stone-500 hover:text-slate-900'
              }`}
            >
              Register
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Role Radio */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Select Your Campus Role
              </label>
              <div className="grid grid-cols-3 gap-2 text-xs">
                {['student', 'faculty', 'staff'].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRoleSelection(r)}
                    className={`py-1.5 px-2 rounded-lg border text-center font-semibold capitalize transition-all ${
                      roleSelection === r 
                        ? 'border-orange-500 bg-orange-50/60 text-orange-800' 
                        : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* Name field (if register) */}
            {mode === 'register' && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Priyanshu Saxena"
                    className="w-full pl-9 pr-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:bg-white focus:outline-none focus:border-orange-500 font-medium"
                    required
                  />
                </div>
              </div>
            )}

            {/* Roll / Email field */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                College Roll No. or Campus Email <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={emailOrRoll}
                  onChange={(e) => setEmailOrRoll(e.target.value)}
                  placeholder="e.g. 220132010045 or roll@hitech.ac.in"
                  className="w-full pl-9 pr-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:bg-white focus:outline-none focus:border-orange-500 font-medium"
                  required
                />
              </div>
            </div>

            {/* Department (if register) */}
            {mode === 'register' && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Branch / Department
                </label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:bg-white focus:outline-none focus:border-orange-500 font-medium cursor-pointer"
                >
                  <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                  <option value="Information Technology">Information Technology</option>
                  <option value="Electronics & Communication">Electronics & Communication</option>
                  <option value="Mechanical Engineering">Mechanical Engineering</option>
                  <option value="Civil Engineering">Civil Engineering</option>
                  <option value="Management & MBA">Management & MBA</option>
                </select>
              </div>
            )}

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700">
                  Password <span className="text-rose-500">*</span>
                </label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => addToast('Please contact Gate 1 Security Admin for password resets during demo.', 'info')}
                    className="text-[11px] text-orange-600 hover:text-orange-700 font-medium"
                  >
                    Forgot?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-9 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:bg-white focus:outline-none focus:border-orange-500 font-medium"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 p-0.5"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit CTA */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 px-4 bg-[#3b5bf5] hover:bg-[#2f4de3] text-white font-bold text-xs rounded-xl shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-1.5"
              >
                {isLoading ? (
                  <span>Authenticating...</span>
                ) : (
                  <>
                    <span>{mode === 'login' ? 'Sign In to CampusFind' : 'Register Account'}</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

          </form>

          {/* Bottom Security Disclaimer */}
          <div className="mt-6 pt-4 border-t border-stone-100 text-center text-[11px] text-stone-400">
            Protected under Hi-Tech Institute Information Security Standards.
          </div>

        </div>

      </div>
    </div>
  );
};
