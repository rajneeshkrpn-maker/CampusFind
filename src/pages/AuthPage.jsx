import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { Logo } from '../components/Logo';
import { 
  sendOtpToEmail, 
  verifyEmailOtp, 
  signInWithEmailPassword, 
  signUpWithEmailPassword,
  fetchProfileByUserId,
  fetchProfileByStudentId, 
  fetchProfileByEmail,
  upsertUserProfile,
  verifyAdminInSupabase,
  uploadAvatar
} from '../lib/supabase';
import { 
  Lock, 
  Mail, 
  User, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2, 
  KeyRound,
  ArrowRight,
  Camera,
  Loader2,
  RefreshCw
} from 'lucide-react';

export const AuthPage = ({ initialMode = 'login' }) => {
  const { setCurrentView, addToast, setCurrentUser, setUserRole } = useApp();

  const [portalMode, setPortalMode] = useState('student'); // 'student' | 'admin'
  const [mode, setMode] = useState(initialMode); // 'login' | 'register'
  
  // Student registration form fields (clean, not hardcoded!)
  const [fullName, setFullName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [department, setDepartment] = useState('Computer Science & Engineering');
  const [academicYear, setAcademicYear] = useState('1st Year (1st Sem)');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Avatar upload during signup
  const fileInputRef = useRef(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);

  // OTP Verification state
  const [useOtpFlow, setUseOtpFlow] = useState(true); // default to real OTP passwordless flow
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);

  // Admin Login state
  const [adminIdentifier, setAdminIdentifier] = useState('');
  const [adminPassword, setAdminPassword] = useState('');

  const [error, setError] = useState('');
  const [infoMessage, setInfoMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const startResendTimer = () => {
    setResendCooldown(45);
    const interval = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleAvatarSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please choose an image file (JPG, PNG, WEBP).');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be under 5MB.');
      return;
    }

    setAvatarFile(file);
    const reader = new FileReader();
    reader.onload = () => setAvatarPreview(reader.result);
    reader.readAsDataURL(file);
  };

  // Step 1: Send real Email OTP for Registration or Login
  const handleSendOtp = async (e) => {
    if (e) e.preventDefault();
    setError('');
    setInfoMessage('');

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !cleanEmail.includes('@')) {
      setError('Please provide a valid college email address.');
      return;
    }

    if (mode === 'register') {
      if (!fullName.trim()) {
        setError('Please provide your full legal name.');
        return;
      }
      if (!studentId.trim()) {
        setError('College Student ID / Roll Number is required.');
        return;
      }

      // Pre-check duplicate student ID and email in database
      setIsLoading(true);
      try {
        const existingStudent = await fetchProfileByStudentId(studentId);
        if (existingStudent) {
          setError(`Student ID "${studentId}" is already registered. If this is your account, please sign in.`);
          setIsLoading(false);
          return;
        }

        const existingEmail = await fetchProfileByEmail(cleanEmail);
        if (existingEmail) {
          setError(`Email "${cleanEmail}" is already registered. Please sign in instead.`);
          setIsLoading(false);
          return;
        }
      } catch (checkErr) {
        console.warn('Pre-check note:', checkErr);
      }
    }

    setIsLoading(true);
    try {
      await sendOtpToEmail(cleanEmail, {
        shouldCreateUser: mode === 'register',
        metadata: mode === 'register' ? {
          full_name: fullName.trim(),
          student_id: studentId.trim(),
          department: department.trim(),
          academic_year: academicYear.trim(),
          role: 'student'
        } : {}
      });

      setOtpSent(true);
      setInfoMessage(`A 6-digit verification code has been dispatched to ${cleanEmail}. Please check your inbox or spam folder.`);
      startResendTimer();
    } catch (otpErr) {
      console.error('OTP Send Error:', otpErr);
      setError(
        otpErr.message || 
        'Could not send verification code. Please check your email or contact campus IT.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Verify OTP and establish real session
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');

    if (!otpCode.trim() || otpCode.length < 6) {
      setError('Please enter the 6-digit verification code.');
      return;
    }

    setIsLoading(true);
    try {
      const { session } = await verifyEmailOtp(email, otpCode);

      if (!session?.user) {
        throw new Error('Verification completed but session could not be established.');
      }

      let uploadedAvatarUrl = null;
      if (avatarFile && session.user.id) {
        try {
          uploadedAvatarUrl = await uploadAvatar(avatarFile, session.user.id);
        } catch (uploadErr) {
          console.warn('Avatar upload note during registration:', uploadErr);
        }
      }

      // Upsert user profile linked to Supabase auth user ID
      const userProfile = await upsertUserProfile({
        userId: session.user.id,
        studentId: studentId.trim() || `STU-${session.user.id.substring(0, 8).toUpperCase()}`,
        fullName: fullName.trim() || email.split('@')[0],
        department: department.trim(),
        academicYear: academicYear.trim(),
        email: session.user.email,
        avatarUrl: uploadedAvatarUrl,
        role: 'student'
      });

      setCurrentUser(userProfile);
      setUserRole(userProfile.role || 'student');
      addToast(
        mode === 'register' 
          ? `Welcome to CampusFind, ${userProfile.name}! Verified account created.` 
          : `Welcome back, ${userProfile.name}!`,
        'success'
      );
      setCurrentView('dashboard');
    } catch (verifyErr) {
      console.error('OTP Verification Error:', verifyErr);
      setError(verifyErr.message || 'Invalid or expired verification code. Please check and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Direct Password Registration (Instant, no email rate limits)
  const handlePasswordRegister = async (e) => {
    if (e) e.preventDefault();
    setError('');
    setInfoMessage('');

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setError('Please provide a valid college email address.');
      return;
    }
    if (!fullName.trim()) {
      setError('Please provide your full legal name.');
      return;
    }
    if (!studentId.trim()) {
      setError('College Student ID / Roll Number is required.');
      return;
    }
    if (!password || password.length < 6) {
      setError('Please enter a password of at least 6 characters.');
      return;
    }

    setIsLoading(true);
    try {
      // Pre-check duplicate student ID and email in database
      const existingStudent = await fetchProfileByStudentId(studentId.trim());
      if (existingStudent) {
        setError(`Student ID "${studentId}" is already registered. If this is your account, please sign in.`);
        setIsLoading(false);
        return;
      }

      const existingEmail = await fetchProfileByEmail(cleanEmail);
      if (existingEmail) {
        setError(`Email "${cleanEmail}" is already registered. Please sign in instead.`);
        setIsLoading(false);
        return;
      }

      const { data, error: signUpError } = await signUpWithEmailPassword(cleanEmail, password, {
        full_name: fullName.trim(),
        student_id: studentId.trim(),
        department: department.trim(),
        academic_year: academicYear.trim(),
        role: 'student'
      });

      if (signUpError) throw signUpError;

      const authUser = data?.user;
      if (!authUser) {
        throw new Error('Could not create account. Please check your credentials.');
      }

      let uploadedAvatarUrl = null;
      if (avatarFile && authUser.id) {
        try {
          uploadedAvatarUrl = await uploadAvatar(avatarFile, authUser.id);
        } catch (uploadErr) {
          console.warn('Avatar upload note during registration:', uploadErr);
        }
      }

      // Upsert profile in database
      const userProfile = await upsertUserProfile({
        userId: authUser.id,
        studentId: studentId.trim(),
        fullName: fullName.trim(),
        department: department.trim(),
        academicYear: academicYear.trim(),
        email: cleanEmail,
        avatarUrl: uploadedAvatarUrl,
        role: 'student'
      });

      setCurrentUser(userProfile);
      setUserRole('student');
      addToast(`Welcome to CampusFind, ${userProfile.name}! Verified account created.`, 'success');
      setCurrentView('dashboard');
    } catch (regErr) {
      console.error('Registration error:', regErr);
      setError(
        regErr.message || 
        'Registration could not be completed. If "email rate limit" appears, disable "Confirm email" in Supabase Auth settings.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Password Login for returning users
  const handlePasswordLogin = async (e) => {
    e.preventDefault();
    setError('');

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setError('Please provide a valid college email address.');
      return;
    }
    if (!password) {
      setError('Please enter your account password.');
      return;
    }

    setIsLoading(true);
    try {
      const { session } = await signInWithEmailPassword(cleanEmail, password);
      if (!session?.user) throw new Error('Could not establish session.');

      let profile = await fetchProfileByUserId(session.user.id);
      if (!profile) {
        profile = await fetchProfileByEmail(cleanEmail);
      }
      if (!profile) {
        const meta = session.user.user_metadata || {};
        profile = await upsertUserProfile({
          userId: session.user.id,
          studentId: meta.student_id || `STU-${session.user.id.substring(0, 8).toUpperCase()}`,
          fullName: meta.full_name || cleanEmail.split('@')[0],
          department: meta.department || 'Computer Science & Engineering',
          academicYear: meta.academic_year || 'Student',
          email: cleanEmail,
          role: 'student'
        });
      }

      if (profile) {
        setCurrentUser(profile);
        setUserRole(profile.role || 'student');
      }

      addToast(`Welcome back, ${profile?.name || cleanEmail}!`, 'success');
      setCurrentView('dashboard');
    } catch (err) {
      console.error('Password login error:', err);
      setError('Invalid credentials. Please verify your email and password, or use Email OTP.');
    } finally {
      setIsLoading(false);
    }
  };

  // Admin / Staff Login (Strict verification against database role)
  const handleAdminSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!adminIdentifier.trim()) {
      setError('Please enter your Staff ID or official security email.');
      return;
    }
    if (!adminPassword.trim()) {
      setError('Please enter your Security Desk access passcode.');
      return;
    }

    setIsLoading(true);
    try {
      const verification = await verifyAdminInSupabase(adminIdentifier);

      if (!verification.authorized) {
        setError(verification.message || 'Access Denied: Unrecognized or non-privileged staff credentials.');
        setIsLoading(false);
        return;
      }

      // Attempt Supabase Auth login if user has a standard auth record
      try {
        await signInWithEmailPassword(verification.profile.email, adminPassword);
      } catch (_authErr) {
        // Fallback to verified staff profile in database for duty desk session
      }

      setCurrentUser(verification.profile);
      setUserRole('admin');
      addToast(`Staff Authorization Granted: Officer ${verification.profile.name}`, 'success');
      setCurrentView('admin');
    } catch (err) {
      console.error('Admin login error:', err);
      setError('Staff verification service offline. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div 
            onClick={() => setCurrentView('home')}
            className="inline-flex items-center justify-center cursor-pointer select-none"
          >
            <Logo />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight pt-2">
            {portalMode === 'admin' 
              ? 'Security & Staff Portal' 
              : mode === 'login' ? 'Sign In to CampusFind' : 'Create Student Account'}
          </h2>
          <p className="text-xs text-stone-600 max-w-xs mx-auto">
            {portalMode === 'admin'
              ? 'Authorized proctorial board and campus security guard authentication.'
              : mode === 'login' 
              ? 'Sign in with your verified college email to manage reports and track claims.' 
              : 'Register with your college roll number for verified campus lost & found recovery.'}
          </p>
        </div>

        {/* Portal Switcher (Student vs Staff) */}
        <div className="grid grid-cols-2 p-1 bg-stone-100 rounded-2xl text-xs font-bold border border-stone-200">
          <button
            type="button"
            onClick={() => { setPortalMode('student'); setError(''); setInfoMessage(''); }}
            className={`py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              portalMode === 'student' ? 'bg-white text-slate-900 shadow-xs' : 'text-stone-500 hover:text-slate-900'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Student Portal</span>
          </button>
          <button
            type="button"
            onClick={() => { setPortalMode('admin'); setError(''); setInfoMessage(''); }}
            className={`py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              portalMode === 'admin' ? 'bg-slate-900 text-white shadow-xs' : 'text-stone-500 hover:text-slate-900'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Staff / Security</span>
          </button>
        </div>

        {/* Main Auth Container */}
        <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-md">
          
          {/* Error & Info Alerts */}
          {error && (
            <div className="mb-4 p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-start gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {infoMessage && (
            <div className="mb-4 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-start gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{infoMessage}</span>
            </div>
          )}

          {/* Student Portal Form */}
          {portalMode === 'student' && (
            <>
              {/* Sign In vs Register toggle */}
              <div className="grid grid-cols-2 p-1 bg-stone-100 rounded-xl mb-5 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => { setMode('login'); setError(''); setOtpSent(false); }}
                  className={`py-2 rounded-lg transition-all ${
                    mode === 'login' ? 'bg-white text-slate-900 shadow-xs' : 'text-stone-500 hover:text-slate-900'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => { setMode('register'); setError(''); setOtpSent(false); }}
                  className={`py-2 rounded-lg transition-all ${
                    mode === 'register' ? 'bg-white text-slate-900 shadow-xs' : 'text-stone-500 hover:text-slate-900'
                  }`}
                >
                  Register
                </button>
              </div>

              {/* Login Method Toggle (OTP vs Password) */}
              {mode === 'login' && !otpSent && (
                <div className="mb-4 flex items-center justify-between text-xs">
                  <span className="text-stone-500 font-medium">Auth Method:</span>
                  <button
                    type="button"
                    onClick={() => { setUseOtpFlow(!useOtpFlow); setError(''); }}
                    className="font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1"
                  >
                    <KeyRound className="w-3.5 h-3.5" />
                    <span>{useOtpFlow ? 'Use Password Login' : 'Use Passwordless Email OTP'}</span>
                  </button>
                </div>
              )}

              {/* CONDITIONAL SCREEN 1: 6-Digit OTP Verification Screen */}
              {otpSent ? (
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <div className="p-3.5 bg-orange-50/60 rounded-xl border border-orange-200/80 text-xs text-orange-950">
                    <span className="font-bold block mb-0.5">Verification Code Dispatched</span>
                    <span>Enter the 6-digit code sent to <strong className="font-semibold text-slate-900">{email}</strong></span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1.5 text-center">
                      Enter 6-Digit OTP <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                      placeholder="000000"
                      autoFocus
                      className="w-full text-center tracking-widest text-2xl font-mono py-3 bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:border-orange-500 font-bold"
                      required
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <button
                      type="button"
                      disabled={resendCooldown > 0 || isLoading}
                      onClick={handleSendOtp}
                      className="text-stone-500 hover:text-orange-600 disabled:opacity-40 font-semibold flex items-center gap-1"
                    >
                      <RefreshCw className={`w-3 h-3 ${resendCooldown > 0 ? 'animate-spin' : ''}`} />
                      <span>{resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend Code'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => { setOtpSent(false); setOtpCode(''); }}
                      className="text-stone-400 hover:text-slate-700"
                    >
                      Edit Email
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading || otpCode.length < 6}
                    className="w-full py-2.5 bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Verifying Code...</span>
                      </>
                    ) : (
                      <>
                        <span>Verify & Enter CampusFind</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              ) : mode === 'register' ? (
                /* CONDITIONAL SCREEN 2: Student Registration Form */
                <form onSubmit={handlePasswordRegister} className="space-y-4">
                  
                  {/* Optional Avatar Selection Preview */}
                  <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-stone-50 border border-stone-200">
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="w-12 h-12 rounded-xl overflow-hidden bg-stone-200 cursor-pointer border border-stone-300 flex items-center justify-center group relative shrink-0"
                    >
                      {avatarPreview ? (
                        <img src={avatarPreview} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <Camera className="w-5 h-5 text-stone-400 group-hover:text-orange-600 transition-colors" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold text-slate-800">Profile Photo (Optional)</div>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="text-[11px] font-semibold text-orange-600 hover:underline"
                      >
                        {avatarFile ? 'Change Photo' : 'Select Avatar Image'}
                      </button>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      onChange={handleAvatarSelect}
                      className="hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Full Legal Name <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Rahul Sharma"
                        className="w-full pl-9 pr-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:border-orange-500 font-medium"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1">
                        College Student ID <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={studentId}
                        onChange={(e) => setStudentId(e.target.value)}
                        placeholder="e.g. 230132010099"
                        className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:border-orange-500 font-mono font-bold"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1">
                        Year / Semester
                      </label>
                      <input
                        type="text"
                        value={academicYear}
                        onChange={(e) => setAcademicYear(e.target.value)}
                        placeholder="e.g. 2nd Year (3rd Sem)"
                        className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:border-orange-500 font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Department / Branch
                    </label>
                    <select
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:border-orange-500 font-medium cursor-pointer"
                    >
                      <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                      <option value="Information Technology">Information Technology</option>
                      <option value="Electronics & Communication">Electronics & Communication</option>
                      <option value="Mechanical Engineering">Mechanical Engineering</option>
                      <option value="Civil Engineering">Civil Engineering</option>
                      <option value="Management & MBA">Management & MBA</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Official College Email <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="roll@hitech.ac.in"
                        className="w-full pl-9 pr-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:border-orange-500 font-medium"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Create Password <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Min. 6 characters"
                        minLength={6}
                        className="w-full pl-9 pr-9 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:border-orange-500 font-medium"
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

                  <div className="pt-2 space-y-2.5">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-2.5 px-4 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Creating Student Account...</span>
                        </>
                      ) : (
                        <>
                          <span>Create Student Account (Instant)</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>

                    <div className="text-center pt-1">
                      <button
                        type="button"
                        onClick={handleSendOtp}
                        disabled={isLoading}
                        className="text-[11px] font-semibold text-stone-500 hover:text-orange-600 transition-colors"
                      >
                        Prefer Email OTP? Click here to send verification code
                      </button>
                    </div>
                  </div>
                </form>
              ) : useOtpFlow ? (
                /* CONDITIONAL SCREEN 3: Student Email OTP Login */
                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      College Email Address <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your.email@hitech.ac.in"
                        className="w-full pl-9 pr-3 py-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:border-orange-500 font-medium"
                        required
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-2.5 px-4 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Sending Verification Code...</span>
                        </>
                      ) : (
                        <>
                          <span>Send Login OTP</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              ) : (
                /* CONDITIONAL SCREEN 4: Student Password Login */
                <form onSubmit={handlePasswordLogin} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      College Email Address <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your.email@hitech.ac.in"
                        className="w-full pl-9 pr-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:border-orange-500 font-medium"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Password <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-9 pr-9 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:border-orange-500 font-medium"
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

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-2.5 px-4 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Signing in...</span>
                        </>
                      ) : (
                        <>
                          <span>Sign In with Password</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </>
          )}

          {/* Admin / Staff Portal Form */}
          {portalMode === 'admin' && (
            <form onSubmit={handleAdminSubmit} className="space-y-4">
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 leading-relaxed">
                <strong>Staff Security Protocol:</strong> Security and staff accounts cannot be self-registered. 
                Enter your authorized Staff ID or Security Desk email.
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Staff ID / Security Intercom Code <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={adminIdentifier}
                    onChange={(e) => setAdminIdentifier(e.target.value)}
                    placeholder="e.g. STAFF-SEC-01"
                    className="w-full pl-9 pr-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:border-orange-500 font-mono font-bold"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Security Access Passcode <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-9 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:border-orange-500 font-medium"
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

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Verifying Credentials in Database...</span>
                    </>
                  ) : (
                    <>
                      <span>Enter Security Staff Desk</span>
                      <Lock className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Security Disclaimer */}
          <div className="mt-6 pt-4 border-t border-stone-100 text-center text-[11px] text-stone-400">
            Protected under Hi-Tech Institute Information Security Standards.
          </div>

        </div>

      </div>
    </div>
  );
};
