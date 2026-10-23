import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Logo } from './Logo';
import { 
  Home,
  Search,
  PlusCircle,
  Compass,
  LayoutDashboard,
  Briefcase,
  ChevronDown, 
  Menu, 
  X, 
  Bell, 
  MapPin, 
  CheckCheck,
  User,
  ShieldCheck,
  Lock,
  ArrowRight,
  Vote,
  Wrench,
  Sun,
  Moon,
  LogOut,
  LogIn,
  UserPlus,
  AlertTriangle
} from 'lucide-react';

export const Navbar = () => {
  const { 
    currentView, 
    setCurrentView, 
    currentUser, 
    logout,
    setShowProfileModal,
    notifications, 
    markNotificationRead,
    markAllNotificationsRead,
    setShowSecurityHubsModal,
    setShowCollegeElectionModal,
    theme,
    toggleTheme
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [staffDropdownOpen, setStaffDropdownOpen] = useState(false);
  const [mobileStaffOpen, setMobileStaffOpen] = useState(false);

  const notificationRef = useRef(null);
  const profileRef = useRef(null);
  const staffRef = useRef(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  // Handle click-outside to dismiss notification, profile, or staff dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setNotificationsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
      if (staffRef.current && !staffRef.current.contains(event.target)) {
        setStaffDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  // Main navigation items in exact requested order
  const mainNavItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'report-lost', label: 'Report Lost Item', icon: Search },
    { id: 'report-found', label: 'Report Found Item', icon: PlusCircle },
    { id: 'browse', label: 'Browse Items', icon: Compass },
    { id: 'dashboard', label: 'My Dashboard', icon: LayoutDashboard }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-stone-200 dark:border-slate-800 transition-colors duration-200">
      
      {/* ===================================================================
          FIRST ROW: Top Header (Logo, Campus Issues, Alerts, Theme, Auth)
          =================================================================== */}
      <div className="border-b border-stone-100 dark:border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20 gap-3 sm:gap-6">
            
            {/* Left Section: CampusFind Brand Logo & Subtitle */}
            <div 
              onClick={() => setCurrentView('home')}
              className="cursor-pointer shrink-0 select-none group"
            >
              <Logo />
            </div>

            {/* Right Section: Campus Issues -> Bell -> Theme -> Log In / Sign Up */}
            <div className="flex items-center gap-2 sm:gap-3">
              
              {/* 1. Prominent "Campus Issues" Button */}
              <button
                onClick={() => setCurrentView('campus-issues')}
                className={`flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-full text-xs font-bold transition-all border shadow-2xs ${
                  currentView === 'campus-issues'
                    ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-xs'
                    : 'bg-amber-50/80 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 border-amber-200/80 dark:border-amber-800/60 hover:bg-amber-100 dark:hover:bg-amber-900/60'
                }`}
                title="Report campus infrastructure, IT, or facility issues"
              >
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                <span className="hidden sm:inline">Campus Issues</span>
                <span className="sm:hidden">Issues</span>
                <span className="text-[9px] font-black uppercase px-1.5 py-0.2 rounded bg-amber-200/80 dark:bg-amber-800/80 text-amber-900 dark:text-amber-200 hidden md:inline">
                  Hub
                </span>
              </button>

              {/* 2. Notification Bell Icon */}
              <div className="relative" ref={notificationRef}>
                <button
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className={`p-2 sm:p-2.5 rounded-full transition-all relative ${
                    notificationsOpen 
                      ? 'bg-stone-100 dark:bg-slate-800 text-slate-900 dark:text-white ring-2 ring-stone-200 dark:ring-slate-700' 
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-slate-800'
                  }`}
                  aria-label="View Campus Notifications"
                  title="Campus Notifications"
                >
                  <Bell className="w-4 h-4" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-orange-600 ring-2 ring-white dark:ring-slate-900"></span>
                    </span>
                  )}
                </button>

                {/* Notification Dropdown Panel */}
                {notificationsOpen && (
                  <div className="absolute right-0 mt-2.5 w-[calc(100vw-2rem)] sm:w-96 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-stone-200 dark:border-slate-800 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
                    <div className="flex items-center justify-between px-4 py-3 bg-stone-50/80 dark:bg-slate-800/60 border-b border-stone-100 dark:border-slate-800">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900 dark:text-white">Campus Alerts</span>
                        {unreadCount > 0 && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-100 dark:bg-orange-950 text-orange-800 dark:text-orange-300">
                            {unreadCount} new
                          </span>
                        )}
                      </div>
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllNotificationsRead}
                          className="text-[11px] font-semibold text-orange-600 dark:text-orange-400 hover:text-orange-700 flex items-center gap-1 transition-colors"
                        >
                          <CheckCheck className="w-3.5 h-3.5" />
                          <span>Mark all read</span>
                        </button>
                      )}
                    </div>

                    <div className="max-h-80 sm:max-h-96 overflow-y-auto divide-y divide-stone-100 dark:divide-slate-800 overscroll-contain">
                      {notifications.map((n) => (
                        <div
                          key={n.id}
                          onClick={() => {
                            markNotificationRead(n.id);
                            if (n.linkView) {
                              setCurrentView(n.linkView);
                            } else if (n.type === 'claim' || n.type === 'match') {
                              setCurrentView('dashboard');
                            }
                            setNotificationsOpen(false);
                          }}
                          className={`p-3.5 text-xs cursor-pointer hover:bg-stone-50 dark:hover:bg-slate-800/50 transition-colors ${
                            !n.read ? 'bg-orange-50/40 dark:bg-orange-950/20' : 'bg-white dark:bg-slate-900'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <div className="flex items-center gap-1.5">
                              {!n.read && (
                                <span className="w-1.5 h-1.5 rounded-full bg-orange-600 shrink-0"></span>
                              )}
                              <span className="font-bold text-slate-900 dark:text-slate-100 text-xs">{n.title}</span>
                            </div>
                            <span className="text-[10px] text-stone-400 dark:text-stone-500 shrink-0 font-medium">{n.time}</span>
                          </div>
                          <p className="text-stone-600 dark:text-stone-300 text-[11px] leading-relaxed pl-3">
                            {n.message}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="p-2.5 bg-stone-50 dark:bg-slate-800/40 border-t border-stone-100 dark:border-slate-800 text-center">
                      <button
                        onClick={() => {
                          setCurrentView('dashboard');
                          setNotificationsOpen(false);
                        }}
                        className="text-[11px] font-bold text-slate-700 dark:text-slate-300 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
                      >
                        Open Student Activity Center →
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* 3. Dark/Light Theme Toggle (Positioned immediately beside notification icon) */}
              <button
                onClick={toggleTheme}
                aria-label={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
                title={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
                className="p-2 sm:p-2.5 rounded-full text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-slate-800 transition-all border border-stone-200/60 dark:border-slate-700/60 shadow-2xs"
              >
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4 text-amber-400 hover:rotate-45 transition-transform" />
                ) : (
                  <Moon className="w-4 h-4 text-slate-700 hover:-rotate-12 transition-transform" />
                )}
              </button>

              {/* 4. Login & Sign Up Actions (Aligned on one horizontal line on desktop) */}
              {!currentUser ? (
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <button
                    onClick={() => setCurrentView('login')}
                    className="px-3 sm:px-4 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white border border-stone-200 dark:border-slate-700 rounded-full bg-stone-50 dark:bg-slate-800 hover:bg-stone-100 dark:hover:bg-slate-700/80 transition-all shadow-2xs flex items-center gap-1.5"
                  >
                    <LogIn className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                    <span>Log In</span>
                  </button>
                  <button
                    onClick={() => setCurrentView('register')}
                    className="px-3.5 sm:px-4 py-1.5 text-xs font-bold text-white bg-orange-600 hover:bg-orange-700 rounded-full transition-all shadow-xs flex items-center gap-1.5"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Sign Up</span>
                  </button>
                </div>
              ) : (
                /* Authenticated User Profile Pill & Dropdown */
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="flex items-center gap-2 p-1 sm:pl-2 sm:pr-3 sm:py-1 rounded-full bg-stone-100/90 dark:bg-slate-800 hover:bg-stone-200/80 dark:hover:bg-slate-700 border border-stone-200/90 dark:border-slate-700 transition-all text-left shadow-2xs group"
                    aria-label="Account Menu"
                  >
                    <div className="relative w-8 h-8 rounded-full overflow-hidden ring-2 ring-white dark:ring-slate-900 shadow-xs shrink-0 bg-stone-200 dark:bg-slate-700 flex items-center justify-center">
                      {currentUser?.avatar ? (
                        <img
                          src={currentUser.avatar}
                          alt={currentUser.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-orange-500 to-amber-600 text-white font-extrabold flex items-center justify-center text-xs select-none">
                          {(currentUser?.name || 'U').charAt(0).toUpperCase()}
                        </div>
                      )}
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900"></span>
                    </div>

                    <div className="hidden sm:flex flex-col pr-1">
                      <span className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors leading-tight">
                        {currentUser?.name ? currentUser.name.split(' ')[0] : 'Account'}
                      </span>
                      <span className="text-[10px] font-semibold text-stone-500 dark:text-stone-400 leading-none">
                        {currentUser?.role === 'admin' || currentUser?.role === 'staff' ? 'Staff Desk' : (currentUser?.rollNo || 'Student')}
                      </span>
                    </div>

                    <ChevronDown className={`w-3.5 h-3.5 text-stone-400 group-hover:text-slate-700 dark:group-hover:text-slate-200 transition-transform hidden sm:block ${
                      profileDropdownOpen ? 'rotate-180' : ''
                    }`} />
                  </button>

                  {/* Profile Menu Dropdown */}
                  {profileDropdownOpen && (
                    <div className="absolute right-0 mt-2.5 w-72 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-stone-200 dark:border-slate-800 py-2 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 text-xs">
                      <div className="px-4 py-3.5 border-b border-stone-100 dark:border-slate-800 bg-gradient-to-br from-stone-50 to-orange-50/20 dark:from-slate-800/80 dark:to-orange-950/20">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-orange-500/20 shadow-xs shrink-0 bg-stone-200 dark:bg-slate-700 flex items-center justify-center">
                            {currentUser?.avatar ? (
                              <img
                                src={currentUser.avatar}
                                alt={currentUser.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-orange-500 to-amber-600 text-white font-extrabold flex items-center justify-center text-sm select-none">
                                {(currentUser?.name || 'U').charAt(0).toUpperCase()}
                              </div>
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <h4 className="font-extrabold text-slate-900 dark:text-white text-sm truncate">
                              {currentUser?.name || 'Verified Member'}
                            </h4>
                            <div className="text-[11px] text-stone-500 dark:text-stone-400 truncate">
                              ID: <strong className="font-mono text-slate-800 dark:text-slate-200">{currentUser?.rollNo || 'N/A'}</strong>
                            </div>
                            <div className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1 mt-0.5">
                              <ShieldCheck className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                              <span>{currentUser?.role === 'admin' || currentUser?.role === 'staff' ? 'Staff Security Officer' : 'Verified Campus Student'}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="p-2 space-y-1">
                        <button
                          onClick={() => {
                            setShowProfileModal(true);
                            setProfileDropdownOpen(false);
                          }}
                          className="w-full text-left px-3 py-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-stone-50 dark:hover:bg-slate-800 font-semibold flex items-center justify-between transition-colors"
                        >
                          <div className="flex items-center gap-2.5">
                            <User className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                            <span>My Profile & Avatar</span>
                          </div>
                          <ArrowRight className="w-3.5 h-3.5 text-stone-400" />
                        </button>

                        <button
                          onClick={() => {
                            setCurrentView('dashboard');
                            setProfileDropdownOpen(false);
                          }}
                          className="w-full text-left px-3 py-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-stone-50 dark:hover:bg-slate-800 font-semibold flex items-center justify-between transition-colors"
                        >
                          <div className="flex items-center gap-2.5">
                            <LayoutDashboard className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                            <span>Student Dashboard</span>
                          </div>
                          <ArrowRight className="w-3.5 h-3.5 text-stone-400" />
                        </button>

                        <button
                          onClick={() => {
                            setCurrentView('campus-issues');
                            setProfileDropdownOpen(false);
                          }}
                          className="w-full text-left px-3 py-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-stone-50 dark:hover:bg-slate-800 font-semibold flex items-center justify-between transition-colors"
                        >
                          <div className="flex items-center gap-2.5">
                            <Wrench className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                            <span>Campus Issues Tracker</span>
                          </div>
                          <span className="text-[10px] bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full font-bold">Hub</span>
                        </button>
                      </div>

                      <div className="px-4 py-2.5 border-t border-stone-100 dark:border-slate-800 bg-stone-50/50 dark:bg-slate-800/40 flex items-center justify-between">
                        <span className="text-[11px] text-stone-500 dark:text-stone-400 truncate max-w-[130px]" title={currentUser?.email}>
                          {currentUser?.email}
                        </span>
                        <button
                          onClick={() => {
                            logout();
                            setProfileDropdownOpen(false);
                          }}
                          className="text-rose-600 dark:text-rose-400 hover:text-rose-700 font-bold text-xs flex items-center gap-1 transition-colors"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Mobile Menu Hamburger Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-md hover:bg-stone-100 dark:hover:bg-slate-800"
                aria-label="Toggle mobile menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>

            </div>

          </div>
        </div>
      </div>

      {/* ===================================================================
          SECOND ROW: Main Navigation (Exact Order) + Staff Portal + Election
          =================================================================== */}
      <div className="hidden lg:block bg-white dark:bg-slate-900 border-b border-stone-200/80 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center h-12 text-xs font-semibold text-slate-700 dark:text-slate-200">
            
            {/* 1 to 5: Main Navigation Items (Horizontal alignment) */}
            <div className="flex items-center gap-6">
              {mainNavItems.map((item) => {
                const IconComponent = item.icon;
                const isActive = currentView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setCurrentView(item.id)}
                    className={`flex items-center gap-2 py-3 relative transition-colors ${
                      isActive 
                        ? 'text-orange-600 dark:text-orange-400 font-bold' 
                        : 'hover:text-slate-950 dark:hover:text-white text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    <IconComponent className={`w-4 h-4 ${isActive ? 'text-orange-600 dark:text-orange-400' : 'text-stone-400 dark:text-slate-500'}`} />
                    <span>{item.label}</span>
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-600 dark:bg-orange-500 rounded-t-full" />
                    )}
                  </button>
                );
              })}

              {/* 6. Staff Portal Dropdown (Campus Desks & Security Desk) */}
              <div className="relative" ref={staffRef}>
                <button
                  onClick={() => setStaffDropdownOpen(!staffDropdownOpen)}
                  className={`flex items-center gap-1.5 py-3 relative transition-colors ${
                    currentView === 'admin' || staffDropdownOpen
                      ? 'text-orange-600 dark:text-orange-400 font-bold'
                      : 'hover:text-slate-950 dark:hover:text-white text-slate-600 dark:text-slate-300'
                  }`}
                  aria-expanded={staffDropdownOpen}
                >
                  <Briefcase className={`w-4 h-4 ${currentView === 'admin' ? 'text-orange-600 dark:text-orange-400' : 'text-stone-400 dark:text-slate-500'}`} />
                  <span>Staff Portal</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${staffDropdownOpen ? 'rotate-180 text-orange-600 dark:text-orange-400' : 'text-stone-400 dark:text-slate-500'}`} />
                  {currentView === 'admin' && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-600 dark:bg-orange-500 rounded-t-full" />
                  )}
                </button>

                {/* Staff Portal Dropdown Menu */}
                {staffDropdownOpen && (
                  <div className="absolute left-0 mt-1 w-64 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-stone-200 dark:border-slate-800 py-1.5 z-50 animate-in fade-in slide-in-from-top-1">
                    <button
                      onClick={() => {
                        setShowSecurityHubsModal(true);
                        setStaffDropdownOpen(false);
                      }}
                      className="w-full text-left px-3.5 py-2.5 hover:bg-stone-50 dark:hover:bg-slate-800 transition-colors flex items-start gap-2.5 group"
                    >
                      <MapPin className="w-4 h-4 text-orange-600 dark:text-orange-400 shrink-0 mt-0.5" />
                      <div>
                        <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400">
                          Campus Desks
                        </div>
                        <div className="text-[11px] text-stone-500 dark:text-stone-400">
                          Official custody points & proctor desks
                        </div>
                      </div>
                    </button>

                    <div className="my-1 border-t border-stone-100 dark:border-slate-800" />

                    <button
                      onClick={() => {
                        setCurrentView('admin');
                        setStaffDropdownOpen(false);
                      }}
                      className="w-full text-left px-3.5 py-2.5 hover:bg-stone-50 dark:hover:bg-slate-800 transition-colors flex items-start gap-2.5 group"
                    >
                      <Lock className="w-4 h-4 text-slate-700 dark:text-slate-300 shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 flex items-center justify-between">
                          <span>Security Desk</span>
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-slate-900 dark:bg-slate-700 text-white">
                            Staff
                          </span>
                        </div>
                        <div className="text-[11px] text-stone-500 dark:text-stone-400">
                          Guard duty authorization & claims review
                        </div>
                      </div>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Right Action Area of Row 2: Election Coming Soon Button */}
            <div className="ml-auto flex items-center">
              <button
                onClick={() => setShowCollegeElectionModal(true)}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 border border-amber-200/90 dark:border-amber-800/80 hover:bg-amber-100 dark:hover:bg-amber-900/60 hover:border-amber-300 transition-all shadow-2xs group"
                title="Student Council Election System — Coming Soon"
              >
                <Vote className="w-4 h-4 text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform" />
                <span>Election Coming Soon</span>
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              </button>
            </div>

          </nav>
        </div>
      </div>

      {/* ===================================================================
          MOBILE DRAWER MENU: Responsive, clean, space-efficient
          =================================================================== */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white dark:bg-slate-900 border-b border-stone-200 dark:border-slate-800 px-4 pt-3 pb-6 space-y-3 animate-in fade-in slide-in-from-top-2">
          
          {/* Quick Action Top Bar for Mobile */}
          <div className="flex items-center justify-between pb-2 border-b border-stone-100 dark:border-slate-800">
            <button
              onClick={() => {
                setCurrentView('campus-issues');
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-amber-50 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 border border-amber-200 dark:border-amber-800"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              <span>Campus Issues</span>
            </button>

            <button
              onClick={toggleTheme}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-slate-700 dark:text-slate-200 border border-stone-200 dark:border-slate-700"
            >
              {theme === 'dark' ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-slate-600" />}
              <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
            </button>
          </div>

          {/* Navigation Links in exact order */}
          <div className="space-y-1">
            {mainNavItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentView(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                    isActive 
                      ? 'bg-orange-50 dark:bg-orange-950/50 text-orange-600 dark:text-orange-400' 
                      : 'text-slate-700 dark:text-slate-200 hover:bg-stone-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <IconComponent className="w-4 h-4 text-stone-400 dark:text-slate-400" />
                    <span>{item.label}</span>
                  </div>
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-orange-600"></span>}
                </button>
              );
            })}

            {/* Mobile Staff Portal Accordion */}
            <div className="pt-1 border-t border-stone-100 dark:border-slate-800">
              <button
                onClick={() => setMobileStaffOpen(!mobileStaffOpen)}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-stone-50 dark:hover:bg-slate-800"
              >
                <div className="flex items-center gap-2.5">
                  <Briefcase className="w-4 h-4 text-stone-400 dark:text-slate-400" />
                  <span>Staff Portal</span>
                </div>
                <ChevronDown className={`w-3.5 h-3.5 text-stone-400 transition-transform ${mobileStaffOpen ? 'rotate-180' : ''}`} />
              </button>

              {mobileStaffOpen && (
                <div className="pl-6 pr-2 py-1 space-y-1 bg-stone-50/70 dark:bg-slate-800/50 rounded-xl my-1">
                  <button
                    onClick={() => {
                      setShowSecurityHubsModal(true);
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-left py-2 px-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-orange-600 flex items-center gap-2"
                  >
                    <MapPin className="w-3.5 h-3.5 text-orange-600" />
                    <span>Campus Desks</span>
                  </button>
                  <button
                    onClick={() => {
                      setCurrentView('admin');
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-left py-2 px-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-orange-600 flex items-center gap-2"
                  >
                    <Lock className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
                    <span>Security Desk (Staff Only)</span>
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Election Coming Soon */}
            <div className="pt-2">
              <button
                onClick={() => {
                  setShowCollegeElectionModal(true);
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 px-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl text-amber-900 dark:text-amber-200 text-xs font-bold flex items-center justify-center gap-2"
              >
                <Vote className="w-4 h-4 text-amber-600" />
                <span>Election Coming Soon</span>
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              </button>
            </div>
          </div>

          {/* Auth State in Mobile Menu */}
          <div className="pt-3 border-t border-stone-100 dark:border-slate-800">
            {!currentUser ? (
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setCurrentView('login');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 text-center text-xs font-bold text-slate-700 dark:text-slate-200 bg-stone-100 dark:bg-slate-800 rounded-xl"
                >
                  Log In
                </button>
                <button
                  onClick={() => {
                    setCurrentView('register');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 text-center text-xs font-bold text-white bg-orange-600 rounded-xl"
                >
                  Sign Up
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between p-3 bg-stone-50 dark:bg-slate-800 rounded-xl">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-orange-600 text-white font-bold text-xs flex items-center justify-center">
                    {(currentUser?.name || 'U').charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">{currentUser?.name}</div>
                    <div className="text-[10px] text-stone-500 dark:text-stone-400">{currentUser?.email}</div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="text-rose-600 dark:text-rose-400 text-xs font-bold"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>

        </div>
      )}

    </header>
  );
};
