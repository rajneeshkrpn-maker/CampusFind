import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Logo } from './Logo';
import { 
  Search, 
  Lock, 
  ChevronDown, 
  Menu, 
  X, 
  Bell, 
  MapPin, 
  CheckCheck,
  User,
  ShieldCheck,
  Package,
  Layers,
  ArrowRight,
  Bot,
  Vote,
  Wrench,
  Sparkles
} from 'lucide-react';

export const Navbar = () => {
  const { 
    currentView, 
    setCurrentView, 
    currentUser, 
    searchQuery, 
    setSearchQuery, 
    notifications, 
    markNotificationRead,
    markAllNotificationsRead,
    setShowSecurityHubsModal,
    setShowInquiryModal,
    setShowAIAssistantModal,
    setShowCollegeElectionModal,
    isSupabaseConnected
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const notificationRef = useRef(null);
  const profileRef = useRef(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  // Handle click-outside to dismiss notification dropdown or profile dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setNotificationsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setCurrentView('browse');
    }
  };

  const navItems = [
    { id: 'home', label: 'Home', hasDropdown: false },
    { id: 'browse', label: 'Browse Items', hasDropdown: true },
    { id: 'report-lost', label: 'Report Lost Item', hasDropdown: false, highlight: 'lost' },
    { id: 'report-found', label: 'Report Found Item', hasDropdown: false, highlight: 'found' },
    { id: 'campus-issues', label: 'Campus Issues', hasDropdown: false, badge: 'Hub' },
    { id: 'dashboard', label: 'My Dashboard', hasDropdown: true },
    { id: 'admin', label: 'Security Desk', hasDropdown: false, badge: 'Staff' }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200">
      
      {/* Top Tier: Academic Brand, Search, AI Assistant, Election, Staff Lock, Notifications, Profile */}
      <div className="border-b border-stone-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20 gap-3 sm:gap-6">
            
            {/* CampusFind Brand Logo */}
            <div 
              onClick={() => setCurrentView('home')}
              className="cursor-pointer shrink-0 group select-none"
            >
              <Logo />
            </div>

            {/* Desktop Center Utilities */}
            <div className="hidden lg:flex items-center gap-4 text-[13px] font-medium text-slate-600">
              <button 
                onClick={() => setCurrentView('browse')} 
                className="hover:text-slate-900 transition-colors"
              >
                Directory
              </button>
              <button 
                onClick={() => setShowSecurityHubsModal(true)} 
                className="hover:text-slate-900 transition-colors flex items-center gap-1.5"
              >
                <MapPin className="w-3.5 h-3.5 text-orange-600" />
                Campus Desks
              </button>

              {/* Campus AI Assistant Button */}
              <button
                onClick={() => setShowAIAssistantModal(true)}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100 hover:border-indigo-300 transition-all shadow-2xs group"
                title="Ask Campus Hub AI Assistant"
              >
                <Bot className="w-3.5 h-3.5 text-indigo-600 group-hover:scale-110 transition-transform" />
                <span>AI Assistant</span>
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
              </button>

              {/* College Election - Coming Soon */}
              <button
                onClick={() => setShowCollegeElectionModal(true)}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100 transition-all shadow-2xs"
                title="College Election System - Coming Soon"
              >
                <Vote className="w-3.5 h-3.5 text-amber-600" />
                <span>Election</span>
                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-200 text-amber-900">Soon</span>
              </button>

              {/* Staff Lock Pill (Dedicated Security Guard & Proctor Information) */}
              <button 
                onClick={() => setCurrentView('admin')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all border ${
                  currentView === 'admin' 
                    ? 'bg-slate-900 text-white border-slate-900 shadow-xs' 
                    : 'bg-stone-50 text-slate-700 border-stone-200 hover:border-slate-300 hover:bg-stone-100'
                }`}
                title="Security Guard & Staff Desk Information"
              >
                <span>Staff Portal</span>
                <Lock className="w-3 h-3 text-slate-400" />
              </button>

              {/* Campus Help Desk Inquiry Button */}
              <button
                onClick={() => setShowInquiryModal(true)}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-stone-50 text-slate-700 border border-stone-200 hover:border-orange-300 hover:text-orange-700 hover:bg-orange-50 transition-all"
                title="Submit Lost & Found Help Desk Inquiry"
              >
                <span>Help Desk</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500" title="Supabase Connected" />
              </button>
            </div>

            {/* Search Input Bar */}
            <form onSubmit={handleSearchSubmit} className="hidden md:flex items-center relative flex-1 max-w-xs">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search items, tags, places..."
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-stone-50 hover:bg-stone-100/80 focus:bg-white border border-stone-200 rounded-full focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition-all placeholder:text-stone-400 font-medium"
              />
            </form>

            {/* Right Controls: Scrollable Notifications + Student Profile */}
            <div className="flex items-center gap-2.5 sm:gap-4">
              
              {/* Notification Bell */}
              <div className="relative" ref={notificationRef}>
                <button
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className={`p-2.5 rounded-full transition-all relative ${
                    notificationsOpen 
                      ? 'bg-stone-100 text-slate-900 ring-2 ring-stone-200' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-stone-100'
                  }`}
                  aria-label="View Campus Notifications"
                  title="Campus Notifications"
                >
                  <Bell className="w-4 h-4" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-orange-600 ring-2 ring-white"></span>
                    </span>
                  )}
                </button>

                {/* Scrollable Notification Dropdown / Slide */}
                {notificationsOpen && (
                  <div className="absolute right-0 mt-2.5 w-[calc(100vw-2rem)] sm:w-96 bg-white rounded-2xl shadow-2xl border border-stone-200 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
                    
                    {/* Notification Header */}
                    <div className="flex items-center justify-between px-4 py-3 bg-stone-50/80 border-b border-stone-100">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">Campus Alerts</span>
                        {unreadCount > 0 && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-100 text-orange-800">
                            {unreadCount} new
                          </span>
                        )}
                      </div>
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllNotificationsRead}
                          className="text-[11px] font-semibold text-orange-600 hover:text-orange-700 flex items-center gap-1 transition-colors"
                        >
                          <CheckCheck className="w-3.5 h-3.5" />
                          <span>Mark all read</span>
                        </button>
                      )}
                    </div>

                    {/* Scrollable Notifications List */}
                    <div className="max-h-80 sm:max-h-96 overflow-y-auto divide-y divide-stone-100 overscroll-contain">
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
                          className={`p-3.5 text-xs cursor-pointer hover:bg-stone-50 transition-colors ${
                            !n.read ? 'bg-orange-50/30' : 'bg-white'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <div className="flex items-center gap-1.5">
                              {!n.read && (
                                <span className="w-1.5 h-1.5 rounded-full bg-orange-600 shrink-0"></span>
                              )}
                              <span className="font-bold text-slate-900 text-xs">{n.title}</span>
                            </div>
                            <span className="text-[10px] text-stone-400 shrink-0 font-medium">{n.time}</span>
                          </div>
                          <p className="text-stone-600 text-[11px] leading-relaxed pl-3">
                            {n.message}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Notification Footer */}
                    <div className="p-2.5 bg-stone-50 border-t border-stone-100 text-center">
                      <button
                        onClick={() => {
                          setCurrentView('dashboard');
                          setNotificationsOpen(false);
                        }}
                        className="text-[11px] font-bold text-slate-700 hover:text-orange-600 transition-colors"
                      >
                        Open Student Activity Center →
                      </button>
                    </div>

                  </div>
                )}
              </div>

              {/* Student Profile Widget */}
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2.5 p-1 sm:pl-2.5 sm:pr-3 sm:py-1 rounded-full bg-stone-100/90 hover:bg-stone-200/80 border border-stone-200/90 transition-all text-left group shadow-2xs"
                  aria-label="Account Menu"
                >
                  <div className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-full overflow-hidden ring-2 ring-white shadow-xs shrink-0">
                    <img
                      src={currentUser?.avatar || '/zaid-saifee.png'}
                      alt={currentUser?.name || 'Zaid Saifee'}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80';
                      }}
                    />
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white"></span>
                  </div>

                  <div className="hidden sm:flex flex-col pr-1">
                    <span className="text-xs font-bold text-slate-900 group-hover:text-orange-600 transition-colors leading-tight">
                      {currentUser?.name || 'Zaid Saifee'}
                    </span>
                    <span className="text-[10px] font-semibold text-stone-500 leading-none">
                      {currentUser?.role === 'Student' ? 'CSE • 3rd Year' : 'Security Desk'}
                    </span>
                  </div>

                  <ChevronDown className={`w-3.5 h-3.5 text-stone-400 group-hover:text-slate-700 transition-transform hidden sm:block ${
                    profileDropdownOpen ? 'rotate-180' : ''
                  }`} />
                </button>

                {/* Profile Dropdown */}
                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2.5 w-72 bg-white rounded-2xl shadow-2xl border border-stone-200 py-2 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 text-xs">
                    
                    <div className="px-4 py-3.5 border-b border-stone-100 bg-gradient-to-br from-stone-50 to-orange-50/20">
                      <div className="flex items-center gap-3">
                        <img
                          src={currentUser?.avatar || '/zaid-saifee.png'}
                          alt={currentUser?.name || 'Zaid Saifee'}
                          className="w-11 h-11 rounded-full object-cover ring-2 ring-orange-500/20 shadow-xs"
                        />
                        <div className="min-w-0 flex-1">
                          <h4 className="font-extrabold text-slate-900 text-sm truncate">
                            {currentUser?.name || 'Zaid Saifee'}
                          </h4>
                          <div className="text-[11px] text-stone-500 truncate">
                            ID: <strong className="font-mono text-slate-800">{currentUser?.rollNo || '220132010045'}</strong>
                          </div>
                          <div className="text-[10px] font-bold text-emerald-700 flex items-center gap-1 mt-0.5">
                            <ShieldCheck className="w-3 h-3 text-emerald-600" />
                            <span>Hi-Tech Verified Account</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-2 space-y-1">
                      <button
                        onClick={() => {
                          setCurrentView('dashboard');
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-slate-700 hover:bg-stone-50 font-semibold flex items-center justify-between transition-colors"
                      >
                        <div className="flex items-center gap-2.5">
                          <User className="w-4 h-4 text-orange-600" />
                          <span>Student Dashboard</span>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-stone-400" />
                      </button>

                      <button
                        onClick={() => {
                          setCurrentView('campus-issues');
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-slate-700 hover:bg-stone-50 font-semibold flex items-center justify-between transition-colors"
                      >
                        <div className="flex items-center gap-2.5">
                          <Wrench className="w-4 h-4 text-indigo-600" />
                          <span>Campus Issues Tracker</span>
                        </div>
                        <span className="text-[10px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full font-bold">New</span>
                      </button>

                      <button
                        onClick={() => {
                          setCurrentView('report-lost');
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-slate-700 hover:bg-stone-50 font-semibold flex items-center justify-between transition-colors"
                      >
                        <div className="flex items-center gap-2.5">
                          <Package className="w-4 h-4 text-rose-600" />
                          <span>Report Lost Belonging</span>
                        </div>
                      </button>

                      <button
                        onClick={() => {
                          setCurrentView('admin');
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-slate-700 hover:bg-stone-50 font-semibold flex items-center justify-between transition-colors"
                      >
                        <div className="flex items-center gap-2.5">
                          <Lock className="w-4 h-4 text-amber-600" />
                          <span>Security Staff Portal</span>
                        </div>
                      </button>
                    </div>

                    <div className="px-4 py-2 border-t border-stone-100 bg-stone-50/50 text-[11px] text-stone-500 flex items-center justify-between">
                      <span>Department: {currentUser?.department || 'CSE'}</span>
                      <button
                        onClick={() => {
                          setCurrentView('login');
                          setProfileDropdownOpen(false);
                        }}
                        className="text-orange-600 font-bold hover:underline"
                      >
                        Switch Account
                      </button>
                    </div>

                  </div>
                )}
              </div>

              {/* Mobile hamburger menu toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-md hover:bg-stone-100"
                aria-label="Toggle mobile menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>

            </div>

          </div>
        </div>
      </div>

      {/* Tier 2: Sub-Navigation Bar */}
      <div className="hidden lg:block bg-white border-b border-stone-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-6 h-11 text-xs font-semibold text-slate-700">
            {navItems.map((item) => {
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id)}
                  className={`flex items-center gap-1 py-2 relative transition-colors ${
                    isActive 
                      ? 'text-orange-600 font-bold' 
                      : 'hover:text-slate-950 text-slate-600'
                  }`}
                >
                  <span>{item.label}</span>
                  {item.hasDropdown && (
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isActive ? 'rotate-180 text-orange-600' : 'text-stone-400'}`} />
                  )}
                  {item.badge && (
                    <span className="ml-1 px-1.5 py-0.2 text-[9px] font-bold bg-amber-100 text-amber-800 rounded">
                      {item.badge}
                    </span>
                  )}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-600 rounded-t-full" />
                  )}
                </button>
              );
            })}

            {/* Quick Action shortcut pills */}
            <div className="ml-auto flex items-center gap-2 text-xs">
              <button
                onClick={() => setCurrentView('report-lost')}
                className="px-2.5 py-1 text-[11px] font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-md transition-colors border border-rose-200/60"
              >
                + Lost Something?
              </button>
              <button
                onClick={() => setCurrentView('report-found')}
                className="px-2.5 py-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-md transition-colors border border-emerald-200/60"
              >
                + Found an Item?
              </button>
            </div>
          </nav>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-stone-200 px-4 pt-3 pb-6 space-y-3 animate-in fade-in slide-in-from-top-2">
          {/* Mobile Search */}
          <form onSubmit={(e) => { handleSearchSubmit(e); setMobileMenuOpen(false); }}>
            <div className="relative">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search items, tags, places..."
                className="w-full pl-9 pr-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-orange-500 font-medium"
              />
            </div>
          </form>

          {/* Assistant & Election Quick Buttons for Mobile */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={() => {
                setShowAIAssistantModal(true);
                setMobileMenuOpen(false);
              }}
              className="py-2 px-3 bg-indigo-50 border border-indigo-200 rounded-xl text-indigo-700 text-xs font-bold flex items-center justify-center gap-1.5"
            >
              <Bot className="w-4 h-4" />
              <span>AI Assistant</span>
            </button>
            <button
              onClick={() => {
                setShowCollegeElectionModal(true);
                setMobileMenuOpen(false);
              }}
              className="py-2 px-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-xs font-bold flex items-center justify-center gap-1.5"
            >
              <Vote className="w-4 h-4" />
              <span>Election Hub</span>
            </button>
          </div>

          {/* Navigation Links */}
          <div className="space-y-1 pt-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentView(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold ${
                  currentView === item.id 
                    ? 'bg-orange-50 text-orange-600 font-bold' 
                    : 'text-slate-700 hover:bg-stone-50'
                }`}
              >
                <span>{item.label}</span>
                {item.badge && (
                  <span className="text-[10px] px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}

            <button
              onClick={() => {
                setShowInquiryModal(true);
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 hover:bg-stone-50"
            >
              <span className="flex items-center gap-2">
                <span>Campus Help Desk</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
              </span>
              <span className="text-[10px] text-orange-600 font-bold">Inquiry</span>
            </button>
          </div>

          {/* Mobile Profile Card */}
          <div className="pt-3 border-t border-stone-100">
            <div 
              onClick={() => {
                setCurrentView('dashboard');
                setMobileMenuOpen(false);
              }}
              className="p-3 bg-stone-50 rounded-xl flex items-center gap-3 cursor-pointer hover:bg-stone-100 transition-colors"
            >
              <img
                src={currentUser?.avatar || '/zaid-saifee.png'}
                alt={currentUser?.name || 'Zaid Saifee'}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-orange-500/20"
              />
              <div className="flex-1 min-w-0">
                <div className="font-bold text-slate-900 text-xs truncate">
                  {currentUser?.name || 'Zaid Saifee'}
                </div>
                <div className="text-[10px] text-stone-500">
                  {currentUser?.role} • {currentUser?.department || 'CSE'}
                </div>
              </div>
              <span className="text-[10px] font-bold bg-orange-600 text-white px-2 py-0.5 rounded">
                Dashboard
              </span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
