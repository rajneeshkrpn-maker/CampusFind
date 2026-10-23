import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { 
  PROVISIONED_STAFF_ACCOUNTS, 
  DEMO_CAMPUS_ISSUES, 
  DEMO_AUDIT_LOGS 
} from '../data/adminDemoData';
import { 
  Briefcase, 
  Search, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  ShieldCheck, 
  User, 
  MapPin, 
  FileText, 
  Bell, 
  ArrowRight, 
  LogOut, 
  ChevronRight, 
  Check, 
  X, 
  Lock, 
  RotateCcw, 
  Layers, 
  Filter, 
  Calendar,
  AlertCircle,
  Eye,
  PlusCircle,
  Flag,
  ArrowUpRight
} from 'lucide-react';

export const StaffPortalPage = () => {
  const { 
    currentUser, 
    userRole, 
    setCurrentView, 
    logout, 
    addToast,
    items, 
    claims, 
    campusIssues, 
    updateCampusIssueStatus,
    updateItemStatus,
    updateClaimStatus,
    resolveDuplicateFlag
  } = useApp();

  // Navigation tab state
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'issues' | 'lost-found' | 'claims' | 'assignments' | 'notifications' | 'profile'

  // Access check: Staff or Admin
  const isAuthorizedStaff = currentUser && (currentUser.role === 'staff' || currentUser.role === 'admin' || userRole === 'staff' || userRole === 'admin');

  // Find logged in staff account details from provisioned list or current user
  const staffProfile = useMemo(() => {
    if (!currentUser) return PROVISIONED_STAFF_ACCOUNTS[0];
    const match = PROVISIONED_STAFF_ACCOUNTS.find(
      s => s.staffId === currentUser.studentId || s.staffId === currentUser.rollNo || s.email === currentUser.email
    );
    return match || {
      staffId: currentUser.studentId || 'STAFF/HIET/100',
      name: currentUser.name || 'Duty Staff Officer',
      department: currentUser.department || 'Proctorial & Custody Services',
      desk: currentUser.year || 'Campus Security Custody Desk',
      email: currentUser.email || 'staff@hitech.ac.in',
      phone: 'Ext. 101',
      status: 'Active',
      assignedIssues: 4,
      resolvedIssues: 18,
      activeCustodyItems: 6
    };
  }, [currentUser]);

  // Combined issues from database and demo
  const allIssues = campusIssues.length > 0 ? campusIssues : DEMO_CAMPUS_ISSUES;

  // Filter issues assigned to this officer or matching their desk
  const myAssignedIssues = useMemo(() => {
    return allIssues.filter(
      iss => iss.assignedStaffId === staffProfile.staffId || 
             (iss.assignedStaffName && iss.assignedStaffName.includes(staffProfile.name.split(' ')[1]))
    );
  }, [allIssues, staffProfile]);

  // Summary Metrics
  const myAssignedCount = myAssignedIssues.length || 4;
  const myPendingCount = myAssignedIssues.filter(i => i.status === 'Submitted' || i.status === 'pending').length || 1;
  const myInProgressCount = myAssignedIssues.filter(i => i.status === 'In Progress' || i.status === 'in_progress').length || 2;
  const myResolvedCount = myAssignedIssues.filter(i => i.status === 'Resolved' || i.status === 'resolved').length || 1;
  const custodyReportsCount = items.filter(i => i.type === 'found' && i.status !== 'recovered').length;
  const pendingClaimsCount = claims.filter(c => c.status === 'pending').length;

  // State for Issues Desk Tab
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [resolutionNote, setResolutionNote] = useState('');
  const [issueNewStatus, setIssueNewStatus] = useState('In Progress');
  const [escalateToAdmin, setEscalateToAdmin] = useState(false);

  // State for Claims Tab
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [claimAdminNote, setClaimAdminNote] = useState('');
  const [claimFilter, setClaimFilter] = useState('all');

  // State for Lost & Found Tab
  const [lfSearch, setLfSearch] = useState('');
  const [lfFilter, setLfFilter] = useState('all');

  // State for Tasks/Assignments Tab
  const [taskPriorityFilter, setTaskPriorityFilter] = useState('all');

  // Staff Notifications state
  const [notificationsList, setNotificationsList] = useState([
    {
      id: 'S-NOTIF-01',
      title: 'New Campus Issue Assigned',
      message: `Master Admin Dr. Arvind K. Swarup assigned you Issue #${myAssignedIssues[0]?.id || 'ISS-2026-081'} (Water cooler leak).`,
      time: '25 mins ago',
      type: 'assignment',
      unread: true
    },
    {
      id: 'S-NOTIF-02',
      title: 'Item Claim Verification Pending',
      message: 'Student submitted serial proof for Boat Airdopes in Custody Locker 04. Verification required.',
      time: '1 hour ago',
      type: 'claim',
      unread: true
    },
    {
      id: 'S-NOTIF-03',
      title: 'Custody Handover Confirmed',
      message: 'Receipt signed for Titan Watch return. Handover certificate archived.',
      time: '3 hours ago',
      type: 'handover',
      unread: false
    }
  ]);

  // Barrier check
  if (!isAuthorizedStaff) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-3xl p-8 shadow-xl text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto shadow-inner">
            <Lock className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-indigo-100 dark:bg-indigo-900/60 text-indigo-800 dark:text-indigo-300">
              Staff Clearance Required
            </span>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Staff Portal Access
            </h2>
            <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
              This duty console is restricted to authorized campus security guards, proctorial officers, and facility desks (<code>STAFF/HIET/100</code> to <code>STAFF/HIET/119</code>).
            </p>
          </div>
          <div className="pt-2 flex flex-col gap-2.5">
            <button
              onClick={() => setCurrentView('login')}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Sign In with Staff Account</span>
            </button>
            <button
              onClick={() => setCurrentView('home')}
              className="text-xs font-semibold text-stone-500 dark:text-stone-400 hover:text-slate-900 dark:hover:text-white"
            >
              Return to CampusFind Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Issue update submission handler
  const handleUpdateIssue = (e) => {
    e.preventDefault();
    if (!selectedIssue) return;

    if (issueNewStatus === 'Resolved' && !resolutionNote.trim()) {
      addToast('Resolution notes are required before marking an issue as Resolved.', 'warning');
      return;
    }

    updateCampusIssueStatus(
      selectedIssue.id, 
      issueNewStatus, 
      resolutionNote || (escalateToAdmin ? 'Escalated to Master Admin by Staff Officer.' : 'Inspected by duty officer.'),
      staffProfile.name
    );

    addToast(`Issue #${selectedIssue.id} updated to "${issueNewStatus}".`, 'success');
    setSelectedIssue(null);
    setResolutionNote('');
    setEscalateToAdmin(false);
  };

  // Claim Adjudication Handler
  const handleClaimDecision = (claimId, decision) => {
    updateClaimStatus(
      claimId, 
      decision, 
      claimAdminNote || (decision === 'approved' ? 'Identity & proof verified by staff at duty desk.' : 'Rejected by duty staff officer.')
    );
    addToast(`Claim #${claimId} marked as ${decision.toUpperCase()}.`, decision === 'approved' ? 'success' : 'info');
    setSelectedClaim(null);
    setClaimAdminNote('');
  };

  return (
    <div className="min-h-screen bg-stone-100/70 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col transition-colors">
      
      {/* ===================================================================
          STAFF TOP BAR & OFFICER BADGE
          =================================================================== */}
      <header className="bg-white dark:bg-slate-900 border-b border-stone-200 dark:border-slate-800 sticky top-0 z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-4">
          
          {/* Officer identity */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white font-black flex items-center justify-center text-xs shadow-xs shrink-0">
              {staffProfile.staffId.split('/')[2] || 'STF'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-extrabold text-slate-900 dark:text-white">
                  {staffProfile.name}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 font-mono">
                  {staffProfile.staffId}
                </span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
                  On Duty
                </span>
              </div>
              <p className="text-[11px] text-stone-500 dark:text-stone-400">
                {staffProfile.desk}
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2 ml-auto">
            {currentUser?.role === 'admin' && (
              <button
                onClick={() => setCurrentView('admin')}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-400 hover:bg-amber-500 text-slate-950 transition-colors flex items-center gap-1 shadow-xs"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Switch to Master Admin</span>
              </button>
            )}

            <button
              onClick={() => setCurrentView('home')}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-slate-800 transition-colors hidden sm:flex items-center gap-1"
            >
              <span>Campus Home</span>
            </button>

            <button
              onClick={logout}
              className="px-3 py-1.5 rounded-xl text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors flex items-center gap-1"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>

        </div>
      </header>

      {/* ===================================================================
          STAFF WORKSPACE LAYOUT
          =================================================================== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full flex-1 flex flex-col lg:flex-row gap-6">
        
        {/* ===================================================================
            SIDEBAR NAVIGATION (PART 3.B)
            =================================================================== */}
        <aside className="w-full lg:w-60 shrink-0 space-y-4">
          <div className="bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-3xl p-3 shadow-xs space-y-1">
            <div className="px-3 py-2 text-[10px] font-black uppercase tracking-wider text-stone-400 dark:text-stone-500">
              Staff Desk Navigation
            </div>

            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full text-left px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center justify-between ${
                activeTab === 'overview'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-stone-600 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Layers className="w-4 h-4" />
                <span>Desk Overview</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 opacity-60" />
            </button>

            <button
              onClick={() => setActiveTab('issues')}
              className={`w-full text-left px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center justify-between ${
                activeTab === 'issues'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-stone-600 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <AlertTriangle className="w-4 h-4" />
                <span>Campus Issues Desk</span>
              </div>
              <span className="text-[10px] px-1.5 py-0.5 rounded-md font-mono font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                {myAssignedCount}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('lost-found')}
              className={`w-full text-left px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center justify-between ${
                activeTab === 'lost-found'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-stone-600 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Search className="w-4 h-4" />
                <span>Lost & Found Desk</span>
              </div>
              <span className="text-[10px] px-1.5 py-0.5 rounded-md font-mono font-bold bg-stone-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                {custodyReportsCount}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('claims')}
              className={`w-full text-left px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center justify-between ${
                activeTab === 'claims'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-stone-600 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>Item Claims</span>
              </div>
              <span className="text-[10px] px-1.5 py-0.5 rounded-md font-mono font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                {pendingClaimsCount}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('assignments')}
              className={`w-full text-left px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center justify-between ${
                activeTab === 'assignments'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-stone-600 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Calendar className="w-4 h-4" />
                <span>My Assignments</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 opacity-60" />
            </button>

            <button
              onClick={() => setActiveTab('notifications')}
              className={`w-full text-left px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center justify-between ${
                activeTab === 'notifications'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-stone-600 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Bell className="w-4 h-4" />
                <span>Notifications</span>
              </div>
              <span className="w-2 h-2 rounded-full bg-rose-500"></span>
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full text-left px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center justify-between ${
                activeTab === 'profile'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-stone-600 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <User className="w-4 h-4" />
                <span>My Profile</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 opacity-60" />
            </button>
          </div>
        </aside>

        {/* ===================================================================
            MAIN CONTENT AREA
            =================================================================== */}
        <main className="flex-1 space-y-6 min-w-0">
          
          {/* ===================================================================
              PART 3.A — STAFF DASHBOARD OVERVIEW SUMMARY CARDS
              =================================================================== */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            
            <div className="bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-2xl p-3.5 shadow-2xs">
              <span className="text-[10px] font-bold text-stone-500 dark:text-stone-400 block">My Assigned Issues</span>
              <div className="text-xl font-black text-slate-900 dark:text-white mt-1">{myAssignedCount}</div>
              <span className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400">Total tickets</span>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-2xl p-3.5 shadow-2xs">
              <span className="text-[10px] font-bold text-stone-500 dark:text-stone-400 block">Pending Issues</span>
              <div className="text-xl font-black text-amber-600 dark:text-amber-400 mt-1">{myPendingCount}</div>
              <span className="text-[10px] text-stone-400">Requires triage</span>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-2xl p-3.5 shadow-2xs">
              <span className="text-[10px] font-bold text-stone-500 dark:text-stone-400 block">In-Progress</span>
              <div className="text-xl font-black text-blue-600 dark:text-blue-400 mt-1">{myInProgressCount}</div>
              <span className="text-[10px] text-stone-400">Work underway</span>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-2xl p-3.5 shadow-2xs">
              <span className="text-[10px] font-bold text-stone-500 dark:text-stone-400 block">Resolved By Me</span>
              <div className="text-xl font-black text-emerald-600 dark:text-emerald-400 mt-1">{staffProfile.resolvedIssues || 18}</div>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">Closed orders</span>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-2xl p-3.5 shadow-2xs">
              <span className="text-[10px] font-bold text-stone-500 dark:text-stone-400 block">Custody Items</span>
              <div className="text-xl font-black text-slate-900 dark:text-white mt-1">{custodyReportsCount}</div>
              <span className="text-[10px] text-stone-400">Locker storage</span>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-2xl p-3.5 shadow-2xs">
              <span className="text-[10px] font-bold text-stone-500 dark:text-stone-400 block">Pending Claims</span>
              <div className="text-xl font-black text-rose-600 dark:text-rose-400 mt-1">{pendingClaimsCount}</div>
              <span className="text-[10px] text-rose-500 font-bold">Needs review</span>
            </div>

          </div>

          {/* ===================================================================
              TAB 1: DESK OVERVIEW
              =================================================================== */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              
              {/* Officer Duty Status Card */}
              <div className="bg-gradient-to-r from-indigo-900 to-slate-900 text-white rounded-3xl p-6 shadow-md border border-indigo-800/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-indigo-500 text-white">
                    Official Campus Post
                  </span>
                  <h3 className="text-xl font-black tracking-tight">
                    {staffProfile.desk}
                  </h3>
                  <p className="text-xs text-indigo-200 max-w-xl leading-relaxed">
                    Responsible for physical lost property custody, student claimant identity checks, and resolving assigned facility work tickets.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setActiveTab('issues')}
                    className="px-4 py-2 bg-white text-slate-900 hover:bg-stone-100 font-bold text-xs rounded-xl shadow-xs transition-colors"
                  >
                    Manage Assigned Tickets
                  </button>
                  <button
                    onClick={() => setActiveTab('claims')}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
                  >
                    Adjudicate Claims
                  </button>
                </div>
              </div>

              {/* Two Column Layout: Urgent Tickets + Pending Claims */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Urgent Assigned Tickets */}
                <div className="bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                        My Priority Work Tickets
                      </h4>
                      <p className="text-[11px] text-stone-500 dark:text-stone-400">
                        Assigned facility issues requiring inspection or updates
                      </p>
                    </div>
                    <button
                      onClick={() => setActiveTab('issues')}
                      className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                    >
                      View All →
                    </button>
                  </div>

                  <div className="divide-y divide-stone-100 dark:divide-slate-800">
                    {myAssignedIssues.slice(0, 3).map((iss) => (
                      <div key={iss.id} className="py-3 flex items-start justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[10px] font-bold text-indigo-600">{iss.id}</span>
                            <span className="font-bold text-xs text-slate-900 dark:text-white">{iss.title}</span>
                          </div>
                          <p className="text-[11px] text-stone-500 dark:text-stone-400">
                            Location: <strong>{iss.location}</strong>
                          </p>
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
                          iss.priority === 'Critical' ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300' :
                          'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        }`}>
                          {iss.priority}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Property Claims Ready for Handover */}
                <div className="bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                        Custody Claims Requiring Handover
                      </h4>
                      <p className="text-[11px] text-stone-500 dark:text-stone-400">
                        Approved ownership claims awaiting physical student collection
                      </p>
                    </div>
                    <button
                      onClick={() => setActiveTab('claims')}
                      className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                    >
                      View All →
                    </button>
                  </div>

                  <div className="divide-y divide-stone-100 dark:divide-slate-800">
                    {claims.slice(0, 3).map((c) => (
                      <div key={c.id} className="py-3 flex items-start justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[10px] font-bold text-stone-400">{c.id}</span>
                            <span className="font-bold text-xs text-slate-900 dark:text-white">{c.itemTitle}</span>
                          </div>
                          <p className="text-[11px] text-stone-500 dark:text-stone-400">
                            Claimant: <strong>{c.claimantName}</strong> ({c.claimantRoll})
                          </p>
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
                          c.status === 'approved' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' :
                          'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        }`}>
                          {c.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* ===================================================================
              PART 3.C — CAMPUS ISSUES DESK
              =================================================================== */}
          {activeTab === 'issues' && (
            <div className="bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-5">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-amber-500" />
                    <span>My Assigned Campus Work Orders</span>
                  </h3>
                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                    Update status, record mandatory resolution notes, or escalate to Master Admin.
                  </p>
                </div>
              </div>

              {/* Issues List Table */}
              <div className="overflow-x-auto rounded-2xl border border-stone-200 dark:border-slate-800">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-50 dark:bg-slate-800/80 text-stone-500 dark:text-stone-400 font-bold border-b border-stone-200 dark:border-slate-800">
                    <tr>
                      <th className="py-3 px-4">Ticket</th>
                      <th className="py-3 px-4">Title & Details</th>
                      <th className="py-3 px-4">Location</th>
                      <th className="py-3 px-4">Priority</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 dark:divide-slate-800">
                    {myAssignedIssues.map((iss) => (
                      <tr key={iss.id} className="hover:bg-stone-50/60 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                          {iss.id}
                        </td>
                        <td className="py-3 px-4 max-w-xs">
                          <div className="font-bold text-slate-900 dark:text-white truncate">{iss.title}</div>
                          <div className="text-[10px] text-stone-400 truncate">{iss.description}</div>
                        </td>
                        <td className="py-3 px-4 font-medium text-slate-800 dark:text-slate-200">
                          {iss.location}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            iss.priority === 'Critical' ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300' :
                            'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          }`}>
                            {iss.priority}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            iss.status === 'Resolved' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' :
                            iss.status === 'In Progress' ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300' :
                            'bg-stone-100 text-stone-700 dark:bg-slate-800 dark:text-stone-300'
                          }`}>
                            {iss.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => {
                              setSelectedIssue(iss);
                              setIssueNewStatus(iss.status);
                              setResolutionNote(iss.resolutionNotes || '');
                            }}
                            className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[11px] rounded-lg transition-colors"
                          >
                            Update Progress
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>
          )}

          {/* ===================================================================
              PART 3.D — LOST & FOUND DESK
              =================================================================== */}
          {activeTab === 'lost-found' && (
            <div className="bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-5">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                    <Search className="w-5 h-5 text-rose-500" />
                    <span>Physical Custody & Verification Desk</span>
                  </h3>
                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                    Log items into locker custody, verify serial identifiers, and confirm handovers.
                  </p>
                </div>
              </div>

              {/* Items List */}
              <div className="overflow-x-auto rounded-2xl border border-stone-200 dark:border-slate-800">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-50 dark:bg-slate-800/80 text-stone-500 dark:text-stone-400 font-bold border-b border-stone-200 dark:border-slate-800">
                    <tr>
                      <th className="py-3 px-4">Item ID</th>
                      <th className="py-3 px-4">Title & Category</th>
                      <th className="py-3 px-4">Custody Location</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 dark:divide-slate-800">
                    {items.filter(i => i.type === 'found').map((item) => (
                      <tr key={item.id} className="hover:bg-stone-50/60 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-slate-900 dark:text-white">
                          {item.id}
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-bold text-slate-900 dark:text-white">{item.title}</div>
                          <div className="text-[10px] text-stone-400">{item.category}</div>
                        </td>
                        <td className="py-3 px-4 font-medium text-slate-800 dark:text-slate-200">
                          {item.location}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            item.status === 'recovered' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' :
                            'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          }`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          {item.status !== 'recovered' && (
                            <button
                              onClick={() => {
                                updateItemStatus(item.id, 'recovered');
                                addToast(`Item #${item.id} marked as handed over and recovered.`, 'success');
                              }}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] rounded-lg transition-colors"
                            >
                              Confirm Handover
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>
          )}

          {/* ===================================================================
              PART 3.E — ITEM CLAIMS TABLE
              =================================================================== */}
          {activeTab === 'claims' && (
            <div className="bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-5">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span>Student Ownership Claims Desk</span>
                  </h3>
                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                    Review verification proof, challenge answers, and authorize custody release.
                  </p>
                </div>
              </div>

              {/* Claims Table */}
              <div className="overflow-x-auto rounded-2xl border border-stone-200 dark:border-slate-800">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-50 dark:bg-slate-800/80 text-stone-500 dark:text-stone-400 font-bold border-b border-stone-200 dark:border-slate-800">
                    <tr>
                      <th className="py-3 px-4">Claim ID</th>
                      <th className="py-3 px-4">Claimed Item</th>
                      <th className="py-3 px-4">Claimant Student</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Adjudication</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 dark:divide-slate-800">
                    {claims.map((clm) => (
                      <tr key={clm.id} className="hover:bg-stone-50/60 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-slate-900 dark:text-white">
                          {clm.id}
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-bold text-slate-900 dark:text-white">{clm.itemTitle}</div>
                          <div className="text-[10px] text-stone-400">Ref: {clm.itemId}</div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-bold text-slate-900 dark:text-white">{clm.claimantName}</div>
                          <div className="text-[10px] text-stone-400 font-mono">Roll: {clm.claimantRoll}</div>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            clm.status === 'approved' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' :
                            clm.status === 'rejected' ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300' :
                            'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          }`}>
                            {clm.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right space-x-1.5">
                          {clm.status === 'pending' ? (
                            <>
                              <button
                                onClick={() => handleClaimDecision(clm.id, 'approved')}
                                className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] rounded-lg transition-colors"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleClaimDecision(clm.id, 'rejected')}
                                className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white font-bold text-[11px] rounded-lg transition-colors"
                              >
                                Reject
                              </button>
                            </>
                          ) : (
                            <span className="text-[11px] font-semibold text-stone-400">Adjudicated</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>
          )}

          {/* ===================================================================
              PART 3.F — MY ASSIGNMENTS TASK LIST
              =================================================================== */}
          {activeTab === 'assignments' && (
            <div className="bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-5">
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-indigo-500" />
                  <span>My Scheduled Duty Tasks & Work Orders</span>
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                  Direct work roster items prioritized by campus safety severity.
                </p>
              </div>

              <div className="space-y-3">
                {myAssignedIssues.map((task) => (
                  <div 
                    key={task.id}
                    className="p-4 bg-stone-50 dark:bg-slate-800/60 border border-stone-200 dark:border-slate-700 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-indigo-600">{task.id}</span>
                        <h4 className="font-bold text-xs text-slate-900 dark:text-white">{task.title}</h4>
                      </div>
                      <p className="text-[11px] text-stone-500 dark:text-stone-400">
                        Location: {task.location} • Upvotes: {task.upvotes || 12}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        task.priority === 'Critical' ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300' :
                        'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      }`}>
                        {task.priority} Priority
                      </span>
                      <button
                        onClick={() => {
                          setSelectedIssue(task);
                          setActiveTab('issues');
                        }}
                        className="px-3 py-1 bg-indigo-600 text-white font-bold text-[11px] rounded-lg"
                      >
                        Inspect
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ===================================================================
              PART 3.G — NOTIFICATIONS
              =================================================================== */}
          {activeTab === 'notifications' && (
            <div className="bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-5">
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                  <Bell className="w-5 h-5 text-amber-500" />
                  <span>Staff Alerts & Dispatch Notifications</span>
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                  Real-time alerts for newly assigned tickets, escalated issues, and pending claim reviews.
                </p>
              </div>

              <div className="divide-y divide-stone-100 dark:divide-slate-800">
                {notificationsList.map((notif) => (
                  <div key={notif.id} className="py-4 flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        {notif.unread && <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0"></span>}
                        <h4 className="font-bold text-xs text-slate-900 dark:text-white">{notif.title}</h4>
                      </div>
                      <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                        {notif.message}
                      </p>
                    </div>
                    <span className="text-[11px] font-medium text-stone-400 shrink-0">
                      {notif.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ===================================================================
              PART 3.H — STAFF PROFILE
              =================================================================== */}
          {activeTab === 'profile' && (
            <div className="bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-5">
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                  <User className="w-5 h-5 text-indigo-500" />
                  <span>Staff Officer Profile & Credentials</span>
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                  Proctorial staff duty credentials. Role and Staff ID are protected and can only be modified by the Master Admin.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 bg-stone-50 dark:bg-slate-800/60 rounded-2xl text-xs">
                <div>
                  <span className="text-stone-400 text-[10px] block">Staff Identification Number</span>
                  <strong className="font-mono text-sm text-indigo-600 dark:text-indigo-400">{staffProfile.staffId}</strong>
                </div>

                <div>
                  <span className="text-stone-400 text-[10px] block">Officer Name</span>
                  <strong className="text-sm text-slate-900 dark:text-white">{staffProfile.name}</strong>
                </div>

                <div>
                  <span className="text-stone-400 text-[10px] block">Assigned Duty Desk</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{staffProfile.desk}</span>
                </div>

                <div>
                  <span className="text-stone-400 text-[10px] block">Department</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{staffProfile.department}</span>
                </div>

                <div>
                  <span className="text-stone-400 text-[10px] block">Official Email</span>
                  <span className="font-mono text-slate-800 dark:text-slate-200">{staffProfile.email}</span>
                </div>

                <div>
                  <span className="text-stone-400 text-[10px] block">Account Status</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    {staffProfile.status || 'Active'}
                  </span>
                </div>
              </div>

              <div className="p-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 rounded-2xl text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
                <p className="leading-relaxed">
                  <strong>Role Protection Notice:</strong> In accordance with Hi-Tech Institute security protocol, staff accounts cannot grant themselves elevated administrative privileges or modify institutional role records.
                </p>
              </div>
            </div>
          )}

        </main>

      </div>

      {/* ===================================================================
          MODAL: STAFF ISSUE PROGRESS & RESOLUTION MODAL
          =================================================================== */}
      {selectedIssue && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <form onSubmit={handleUpdateIssue} className="bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold text-indigo-600 uppercase">
                  Staff Work Order • {selectedIssue.id}
                </span>
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  {selectedIssue.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedIssue(null)}
                className="p-1 rounded-full text-stone-400 hover:text-slate-900 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-stone-50 dark:bg-slate-800/60 rounded-xl text-xs space-y-1">
              <div><strong>Location:</strong> {selectedIssue.location}</div>
              <p className="text-stone-500 text-[11px] pt-1">{selectedIssue.description}</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                Progress Status
              </label>
              <select
                value={issueNewStatus}
                onChange={(e) => setIssueNewStatus(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-stone-50 dark:bg-slate-800 border border-stone-200 dark:border-slate-700 rounded-xl font-semibold"
              >
                <option value="In Progress">In Progress (Work Dispatched)</option>
                <option value="Resolved">Resolved (Completed on Site)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                Resolution / Progress Notes {issueNewStatus === 'Resolved' && <span className="text-rose-500">*</span>}
              </label>
              <textarea
                value={resolutionNote}
                onChange={(e) => setResolutionNote(e.target.value)}
                rows={3}
                placeholder="Required before marking resolved: specify actions taken, repairs completed, or inspection notes..."
                className="w-full px-3 py-2 text-xs bg-stone-50 dark:bg-slate-800 border border-stone-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="escalateCheck"
                checked={escalateToAdmin}
                onChange={(e) => setEscalateToAdmin(e.target.checked)}
                className="rounded text-indigo-600 focus:ring-0"
              />
              <label htmlFor="escalateCheck" className="text-xs text-stone-600 dark:text-stone-300 font-semibold cursor-pointer">
                Flag for escalation to Master Admin (High severity / Budget required)
              </label>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setSelectedIssue(null)}
                className="px-4 py-2 bg-stone-100 dark:bg-slate-800 text-stone-600 dark:text-stone-300 font-bold text-xs rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
              >
                Save Progress
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
