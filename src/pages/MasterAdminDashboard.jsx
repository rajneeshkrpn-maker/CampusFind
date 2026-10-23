import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { 
  PROVISIONED_STAFF_ACCOUNTS, 
  FICTIONAL_STUDENTS, 
  DEMO_CAMPUS_ISSUES, 
  DEMO_AUDIT_LOGS, 
  ANALYTICS_TREND_DATA, 
  ISSUES_CATEGORY_BREAKDOWN,
  MASTER_ADMIN_ACCOUNT 
} from '../data/adminDemoData';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Users, 
  Briefcase, 
  Search, 
  PlusCircle, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Filter, 
  BarChart3, 
  TrendingUp, 
  FileText, 
  Vote, 
  Settings, 
  LogOut, 
  ArrowLeft, 
  RefreshCw, 
  UserX, 
  UserCheck, 
  ChevronRight, 
  ChevronDown, 
  Eye, 
  MapPin, 
  Wrench, 
  ExternalLink,
  Calendar,
  Lock,
  Layers,
  Sparkles,
  Database,
  Sliders,
  Check,
  X,
  Building,
  Activity
} from 'lucide-react';

export const MasterAdminDashboard = () => {
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
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'analytics' | 'students' | 'staff' | 'lost-found' | 'issues' | 'election' | 'activity'

  // Data mode: 'demo' | 'live'
  const [dataMode, setDataMode] = useState('demo'); // 'demo' (comprehensive simulation) or 'live' (real Supabase records)

  // Analytics timeframe filter
  const [timeFilter, setTimeFilter] = useState('7d'); // '7d' | '30d' | '90d' | 'all'

  // Student directory state
  const [studentSearch, setStudentSearch] = useState('');
  const [studentDeptFilter, setStudentDeptFilter] = useState('all');
  const [studentStatusFilter, setStudentStatusFilter] = useState('all');
  const [studentPage, setStudentPage] = useState(1);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentsList, setStudentsList] = useState(FICTIONAL_STUDENTS);

  // Staff management state
  const [staffSearch, setStaffSearch] = useState('');
  const [staffDeptFilter, setStaffDeptFilter] = useState('all');
  const [staffList, setStaffList] = useState(PROVISIONED_STAFF_ACCOUNTS);
  const [selectedStaff, setSelectedStaff] = useState(null);

  // Issues management state
  const [issuesList, setIssuesList] = useState(DEMO_CAMPUS_ISSUES);
  const [issueSearch, setIssueSearch] = useState('');
  const [issueStatusFilter, setIssueStatusFilter] = useState('all');
  const [issuePriorityFilter, setIssuePriorityFilter] = useState('all');
  const [editingIssue, setEditingIssue] = useState(null);
  const [issueResolutionNotes, setIssueResolutionNotes] = useState('');
  const [issueNewStatus, setIssueNewStatus] = useState('In Progress');
  const [issueAssignedStaff, setIssueAssignedStaff] = useState('STAFF/HIET/100');

  // Lost & Found admin state
  const [lfSearch, setLfSearch] = useState('');
  const [lfTypeFilter, setLfTypeFilter] = useState('all');
  const [lfStatusFilter, setLfStatusFilter] = useState('all');

  // Role Access Barrier: If not Master Admin, show clear institutional access screen
  const isMasterAdmin = currentUser?.role === 'admin' || userRole === 'admin';

  if (!isMasterAdmin) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-3xl p-8 shadow-xl text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto shadow-inner">
            <Lock className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-rose-100 dark:bg-rose-900/60 text-rose-800 dark:text-rose-300">
              Restricted Master Console
            </span>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Master Admin Access Required
            </h2>
            <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
              This institutional dashboard is restricted to the Proctorial Directorate (<code>ADMIN/HIET/156</code>).
              {currentUser?.role === 'staff' ? (
                <span className="block mt-2 font-semibold text-indigo-600 dark:text-indigo-400">
                  You are currently authenticated as Staff ({currentUser.name}). Please use the Staff Portal.
                </span>
              ) : (
                <span className="block mt-2">
                  Please authenticate with your Master Admin credentials to continue.
                </span>
              )}
            </p>
          </div>
          <div className="pt-2 flex flex-col gap-2.5">
            {currentUser?.role === 'staff' ? (
              <button
                onClick={() => setCurrentView('staff')}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <Briefcase className="w-3.5 h-3.5" />
                <span>Go to Staff Portal</span>
              </button>
            ) : null}
            <button
              onClick={() => setCurrentView('login')}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 dark:bg-amber-500 dark:hover:bg-amber-600 dark:text-slate-950 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Authenticate as Master Admin</span>
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

  // Active items and counts based on mode
  const currentItems = dataMode === 'demo' ? items : items;
  const currentCampusIssues = dataMode === 'demo' ? issuesList : campusIssues;

  // 8 Summary Metrics derived strictly from the dataset
  const totalStudents = dataMode === 'demo' ? 250 : 250;
  const totalActiveStaff = staffList.filter(s => s.status === 'Active').length;
  const totalLostReports = currentItems.filter(i => i.type === 'lost').length;
  const totalFoundReports = currentItems.filter(i => i.type === 'found').length;
  const totalIssuesCount = currentCampusIssues.length;
  const resolvedIssuesCount = currentCampusIssues.filter(i => i.status === 'Resolved' || i.status === 'resolved').length;
  const inProgressIssuesCount = currentCampusIssues.filter(i => i.status === 'In Progress' || i.status === 'in_progress').length;
  const pendingIssuesCount = currentCampusIssues.filter(i => i.status === 'Submitted' || i.status === 'pending').length;

  // Filtered Students
  const filteredStudents = useMemo(() => {
    return studentsList.filter((s) => {
      if (studentDeptFilter !== 'all' && s.department !== studentDeptFilter) return false;
      if (studentStatusFilter !== 'all' && s.status !== studentStatusFilter) return false;
      if (studentSearch.trim()) {
        const q = studentSearch.toLowerCase();
        return (
          s.name.toLowerCase().includes(q) ||
          s.studentId.toLowerCase().includes(q) ||
          s.email.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [studentsList, studentSearch, studentDeptFilter, studentStatusFilter]);

  // Paginated students
  const pageSize = 15;
  const totalStudentPages = Math.ceil(filteredStudents.length / pageSize) || 1;
  const paginatedStudents = filteredStudents.slice((studentPage - 1) * pageSize, studentPage * pageSize);

  // Filtered Staff
  const filteredStaff = useMemo(() => {
    return staffList.filter((s) => {
      if (staffDeptFilter !== 'all' && s.department !== staffDeptFilter) return false;
      if (staffSearch.trim()) {
        const q = staffSearch.toLowerCase();
        return (
          s.name.toLowerCase().includes(q) ||
          s.staffId.toLowerCase().includes(q) ||
          s.desk.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [staffList, staffSearch, staffDeptFilter]);

  // Filtered Campus Issues
  const filteredIssues = useMemo(() => {
    return currentCampusIssues.filter((i) => {
      if (issueStatusFilter !== 'all' && i.status.toLowerCase() !== issueStatusFilter.toLowerCase()) return false;
      if (issuePriorityFilter !== 'all' && i.priority !== issuePriorityFilter) return false;
      if (issueSearch.trim()) {
        const q = issueSearch.toLowerCase();
        return (
          i.title.toLowerCase().includes(q) ||
          i.id.toLowerCase().includes(q) ||
          i.location.toLowerCase().includes(q) ||
          (i.assignedStaffName && i.assignedStaffName.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [currentCampusIssues, issueSearch, issueStatusFilter, issuePriorityFilter]);

  // Filtered Lost & Found
  const filteredLF = useMemo(() => {
    return currentItems.filter((i) => {
      if (lfTypeFilter !== 'all' && i.type !== lfTypeFilter) return false;
      if (lfStatusFilter !== 'all' && i.status !== lfStatusFilter) return false;
      if (lfSearch.trim()) {
        const q = lfSearch.toLowerCase();
        return (
          i.title.toLowerCase().includes(q) ||
          i.id.toLowerCase().includes(q) ||
          i.location.toLowerCase().includes(q) ||
          (i.reporterName && i.reporterName.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [currentItems, lfSearch, lfTypeFilter, lfStatusFilter]);

  // Student Status Toggle Handler
  const handleToggleStudentStatus = (id) => {
    setStudentsList(prev => prev.map(s => {
      if (s.id === id) {
        const nextStatus = s.status === 'Active' ? 'Suspended' : 'Active';
        addToast(`Student ${s.name} account marked ${nextStatus}.`, nextStatus === 'Active' ? 'success' : 'info');
        return { ...s, status: nextStatus };
      }
      return s;
    }));
    if (selectedStudent && selectedStudent.id === id) {
      setSelectedStudent(prev => ({
        ...prev,
        status: prev.status === 'Active' ? 'Suspended' : 'Active'
      }));
    }
  };

  // Staff Status Toggle Handler
  const handleToggleStaffStatus = (staffId) => {
    setStaffList(prev => prev.map(s => {
      if (s.staffId === staffId) {
        const nextStatus = s.status === 'Active' ? 'Deactivated' : 'Active';
        addToast(`Staff account ${staffId} status set to ${nextStatus}.`, nextStatus === 'Active' ? 'success' : 'info');
        return { ...s, status: nextStatus };
      }
      return s;
    }));
  };

  // Save Issue Update Handler
  const handleSaveIssueUpdate = (e) => {
    e.preventDefault();
    if (!editingIssue) return;

    const assignedStaffObj = PROVISIONED_STAFF_ACCOUNTS.find(s => s.staffId === issueAssignedStaff);

    if (dataMode === 'demo') {
      setIssuesList(prev => prev.map(iss => {
        if (iss.id === editingIssue.id) {
          return {
            ...iss,
            status: issueNewStatus,
            resolutionNotes: issueResolutionNotes || iss.resolutionNotes,
            assignedStaffId: issueAssignedStaff,
            assignedStaffName: assignedStaffObj?.name || iss.assignedStaffName,
            updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
          };
        }
        return iss;
      }));
    } else {
      updateCampusIssueStatus(editingIssue.id, issueNewStatus, issueResolutionNotes, assignedStaffObj?.name);
    }

    addToast(`Issue #${editingIssue.id} updated to "${issueNewStatus}".`, 'success');
    setEditingIssue(null);
    setIssueResolutionNotes('');
  };

  // Active trend series for SVG chart
  const currentTrendData = ANALYTICS_TREND_DATA[timeFilter] || ANALYTICS_TREND_DATA['7d'];
  const maxTrendVal = Math.max(...currentTrendData.map(d => Math.max(d.lost, d.found, d.issues, d.resolved))) || 20;

  return (
    <div className="min-h-screen bg-stone-100/70 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col transition-colors">
      
      {/* ===================================================================
          MASTER ADMIN HEADER BANNER
          =================================================================== */}
      <header className="bg-slate-950 text-white border-b border-slate-800 sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
          
          {/* Left: Branding & Role Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 shadow-md shrink-0 ring-2 ring-amber-400/30">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-black text-white tracking-tight">CampusFind</span>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-amber-400 text-slate-950 uppercase tracking-wider">
                  Master Admin Console
                </span>
                <span className="text-stone-400 text-xs hidden sm:inline">• Hi-Tech Institute Proctorial Directorate</span>
              </div>
              <p className="text-[11px] text-stone-300">
                Authorized Officer: <strong>{MASTER_ADMIN_ACCOUNT.name}</strong> ({MASTER_ADMIN_ACCOUNT.adminId})
              </p>
            </div>
          </div>

          {/* Right: Data Mode Badge & Actions */}
          <div className="flex items-center gap-2.5 ml-auto">
            
            {/* Live vs Demo Toggle */}
            <div className="flex items-center bg-slate-900 border border-slate-700/80 rounded-xl p-0.5 text-xs">
              <button
                onClick={() => { setDataMode('demo'); addToast('Viewing Comprehensive Demo Simulation (250 Students, 20 Staff)', 'info'); }}
                className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all flex items-center gap-1.5 ${
                  dataMode === 'demo' ? 'bg-amber-400 text-slate-950 shadow-xs' : 'text-stone-400 hover:text-white'
                }`}
              >
                <Sparkles className="w-3 h-3" />
                <span>Demo Simulation</span>
              </button>
              <button
                onClick={() => { setDataMode('live'); addToast('Connected to Live Supabase Database', 'info'); }}
                className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all flex items-center gap-1.5 ${
                  dataMode === 'live' ? 'bg-emerald-500 text-slate-950 shadow-xs' : 'text-stone-400 hover:text-white'
                }`}
              >
                <Database className="w-3 h-3" />
                <span>Live Supabase</span>
              </button>
            </div>

            {/* Quick exit to Student Dashboard */}
            <button
              onClick={() => setCurrentView('home')}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold text-stone-300 hover:text-white hover:bg-slate-900 border border-slate-800 transition-colors hidden sm:flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Campus Home</span>
            </button>

            {/* Sign Out */}
            <button
              onClick={logout}
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-rose-950/60 hover:bg-rose-900 text-rose-300 border border-rose-800/80 transition-colors flex items-center gap-1"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>

        </div>
      </header>

      {/* ===================================================================
          MASTER ADMIN MAIN WORKSPACE
          =================================================================== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full flex-1 flex flex-col lg:flex-row gap-6">
        
        {/* ===================================================================
            SIDEBAR NAVIGATION
            =================================================================== */}
        <aside className="w-full lg:w-64 shrink-0 space-y-4">
          
          <div className="bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-3xl p-3 shadow-xs space-y-1">
            <div className="px-3 py-2 text-[10px] font-black uppercase tracking-wider text-stone-400 dark:text-stone-500">
              Institutional Command
            </div>

            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full text-left px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center justify-between ${
                activeTab === 'overview'
                  ? 'bg-amber-400 text-slate-950 shadow-xs'
                  : 'text-stone-600 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <BarChart3 className="w-4 h-4" />
                <span>Overview Dashboard</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 opacity-60" />
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              className={`w-full text-left px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center justify-between ${
                activeTab === 'analytics'
                  ? 'bg-amber-400 text-slate-950 shadow-xs'
                  : 'text-stone-600 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <TrendingUp className="w-4 h-4" />
                <span>Analytics & Graphs</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 opacity-60" />
            </button>

            <button
              onClick={() => setActiveTab('students')}
              className={`w-full text-left px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center justify-between ${
                activeTab === 'students'
                  ? 'bg-amber-400 text-slate-950 shadow-xs'
                  : 'text-stone-600 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Users className="w-4 h-4" />
                <span>Student Directory</span>
              </div>
              <span className="text-[10px] px-1.5 py-0.5 rounded-md font-mono font-bold bg-stone-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                250
              </span>
            </button>

            <button
              onClick={() => setActiveTab('staff')}
              className={`w-full text-left px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center justify-between ${
                activeTab === 'staff'
                  ? 'bg-amber-400 text-slate-950 shadow-xs'
                  : 'text-stone-600 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Briefcase className="w-4 h-4" />
                <span>Staff Management</span>
              </div>
              <span className="text-[10px] px-1.5 py-0.5 rounded-md font-mono font-bold bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                20
              </span>
            </button>

            <div className="my-2 border-t border-stone-100 dark:border-slate-800" />

            <div className="px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-stone-400 dark:text-stone-500">
              Operations Administration
            </div>

            <button
              onClick={() => setActiveTab('lost-found')}
              className={`w-full text-left px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center justify-between ${
                activeTab === 'lost-found'
                  ? 'bg-amber-400 text-slate-950 shadow-xs'
                  : 'text-stone-600 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Search className="w-4 h-4" />
                <span>Lost & Found Admin</span>
              </div>
              <span className="text-[10px] px-1.5 py-0.5 rounded-md font-mono font-bold bg-stone-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                {currentItems.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('issues')}
              className={`w-full text-left px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center justify-between ${
                activeTab === 'issues'
                  ? 'bg-amber-400 text-slate-950 shadow-xs'
                  : 'text-stone-600 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Wrench className="w-4 h-4" />
                <span>Campus Issues Desk</span>
              </div>
              <span className="text-[10px] px-1.5 py-0.5 rounded-md font-mono font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                {totalIssuesCount}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('activity')}
              className={`w-full text-left px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center justify-between ${
                activeTab === 'activity'
                  ? 'bg-amber-400 text-slate-950 shadow-xs'
                  : 'text-stone-600 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Activity className="w-4 h-4" />
                <span>Audit Activity Log</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 opacity-60" />
            </button>

            <div className="my-2 border-t border-stone-100 dark:border-slate-800" />

            <button
              onClick={() => setActiveTab('election')}
              className={`w-full text-left px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center justify-between ${
                activeTab === 'election'
                  ? 'bg-amber-400 text-slate-950 shadow-xs'
                  : 'text-amber-800 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-950/40'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Vote className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span>Election Management</span>
              </div>
              <span className="text-[9px] px-1.5 py-0.2 rounded font-extrabold uppercase bg-amber-200 text-amber-900 dark:bg-amber-900/60 dark:text-amber-200">
                Soon
              </span>
            </button>

          </div>

          {/* Quick Staff Portal Navigation Link */}
          <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white rounded-3xl p-4 shadow-sm border border-indigo-800/60 space-y-3">
            <div className="flex items-center gap-2 text-indigo-300 text-xs font-bold">
              <Briefcase className="w-4 h-4" />
              <span>Staff Duty Perspective</span>
            </div>
            <p className="text-[11px] text-stone-300 leading-relaxed">
              Open the duty desk view to inspect how campus officers handle custody handovers and assign tickets.
            </p>
            <button
              onClick={() => setCurrentView('staff')}
              className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Open Staff Operations Portal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>

        </aside>

        {/* ===================================================================
            MAIN CONTENT AREA
            =================================================================== */}
        <main className="flex-1 space-y-6 min-w-0">
          
          {/* ===================================================================
              PART 2.A — 8 TOP SUMMARY CARDS
              =================================================================== */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            
            {/* Card 1: Registered Students */}
            <div className="bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-3xl p-4 shadow-2xs hover:shadow-sm transition-shadow">
              <div className="flex items-center justify-between text-stone-400 dark:text-stone-500 mb-2">
                <span className="text-[11px] font-bold text-stone-600 dark:text-stone-400">Total Students</span>
                <Users className="w-4 h-4 text-indigo-500" />
              </div>
              <div className="text-2xl font-black text-slate-900 dark:text-white">
                {totalStudents}
              </div>
              <div className="mt-1 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <span>● 240 Active</span>
                <span className="text-stone-400">({dataMode === 'demo' ? 'Sample Seed' : 'DB Records'})</span>
              </div>
            </div>

            {/* Card 2: Active Staff */}
            <div className="bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-3xl p-4 shadow-2xs hover:shadow-sm transition-shadow">
              <div className="flex items-center justify-between text-stone-400 dark:text-stone-500 mb-2">
                <span className="text-[11px] font-bold text-stone-600 dark:text-stone-400">Active Staff</span>
                <Briefcase className="w-4 h-4 text-amber-500" />
              </div>
              <div className="text-2xl font-black text-slate-900 dark:text-white">
                {totalActiveStaff} / 20
              </div>
              <div className="mt-1 text-[10px] font-semibold text-stone-500 dark:text-stone-400">
                STAFF/HIET/100 – 119
              </div>
            </div>

            {/* Card 3: Lost Items */}
            <div className="bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-3xl p-4 shadow-2xs hover:shadow-sm transition-shadow">
              <div className="flex items-center justify-between text-stone-400 dark:text-stone-500 mb-2">
                <span className="text-[11px] font-bold text-stone-600 dark:text-stone-400">Lost Reports</span>
                <Search className="w-4 h-4 text-rose-500" />
              </div>
              <div className="text-2xl font-black text-slate-900 dark:text-white">
                {totalLostReports}
              </div>
              <div className="mt-1 text-[10px] font-semibold text-rose-600 dark:text-rose-400">
                Pending recovery search
              </div>
            </div>

            {/* Card 4: Found Items */}
            <div className="bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-3xl p-4 shadow-2xs hover:shadow-sm transition-shadow">
              <div className="flex items-center justify-between text-stone-400 dark:text-stone-500 mb-2">
                <span className="text-[11px] font-bold text-stone-600 dark:text-stone-400">Found In Custody</span>
                <PlusCircle className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="text-2xl font-black text-slate-900 dark:text-white">
                {totalFoundReports}
              </div>
              <div className="mt-1 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                {claims.filter(c => c.status === 'approved').length} Handed Over
              </div>
            </div>

            {/* Card 5: Total Campus Issues */}
            <div className="bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-3xl p-4 shadow-2xs hover:shadow-sm transition-shadow">
              <div className="flex items-center justify-between text-stone-400 dark:text-stone-500 mb-2">
                <span className="text-[11px] font-bold text-stone-600 dark:text-stone-400">Total Issues</span>
                <Wrench className="w-4 h-4 text-blue-500" />
              </div>
              <div className="text-2xl font-black text-slate-900 dark:text-white">
                {totalIssuesCount}
              </div>
              <div className="mt-1 text-[10px] font-semibold text-blue-600 dark:text-blue-400">
                All campus facilities
              </div>
            </div>

            {/* Card 6: Resolved Issues */}
            <div className="bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-3xl p-4 shadow-2xs hover:shadow-sm transition-shadow">
              <div className="flex items-center justify-between text-stone-400 dark:text-stone-500 mb-2">
                <span className="text-[11px] font-bold text-stone-600 dark:text-stone-400">Resolved Issues</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-2xl font-black text-slate-900 dark:text-white">
                {resolvedIssuesCount}
              </div>
              <div className="mt-1 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                {Math.round((resolvedIssuesCount / (totalIssuesCount || 1)) * 100)}% Resolution Rate
              </div>
            </div>

            {/* Card 7: In-Progress Issues */}
            <div className="bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-3xl p-4 shadow-2xs hover:shadow-sm transition-shadow">
              <div className="flex items-center justify-between text-stone-400 dark:text-stone-500 mb-2">
                <span className="text-[11px] font-bold text-stone-600 dark:text-stone-400">In Progress</span>
                <Clock className="w-4 h-4 text-amber-500" />
              </div>
              <div className="text-2xl font-black text-slate-900 dark:text-white">
                {inProgressIssuesCount}
              </div>
              <div className="mt-1 text-[10px] font-semibold text-amber-600 dark:text-amber-400">
                Assigned to staff
              </div>
            </div>

            {/* Card 8: Pending Issues */}
            <div className="bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-3xl p-4 shadow-2xs hover:shadow-sm transition-shadow">
              <div className="flex items-center justify-between text-stone-400 dark:text-stone-500 mb-2">
                <span className="text-[11px] font-bold text-stone-600 dark:text-stone-400">Pending Issues</span>
                <AlertTriangle className="w-4 h-4 text-rose-500" />
              </div>
              <div className="text-2xl font-black text-slate-900 dark:text-white">
                {pendingIssuesCount}
              </div>
              <div className="mt-1 text-[10px] font-semibold text-rose-600 dark:text-rose-400">
                Awaiting staff assignment
              </div>
            </div>

          </div>

          {/* ===================================================================
              TAB 1: OVERVIEW & ANALYTICS VISUALIZATIONS
              =================================================================== */}
          {(activeTab === 'overview' || activeTab === 'analytics') && (
            <div className="space-y-6">
              
              {/* Analytics Header with Time Filters */}
              <div className="bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-amber-500" />
                    <span>Campus Intelligence & Operational Trends</span>
                  </h3>
                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                    Real-time comparative performance across Lost & Found recovery and Campus facility resolutions.
                  </p>
                </div>

                {/* Filters */}
                <div className="flex items-center bg-stone-100 dark:bg-slate-800 p-1 rounded-2xl text-xs font-bold">
                  {['7d', '30d', '90d', 'all'].map((tf) => (
                    <button
                      key={tf}
                      onClick={() => setTimeFilter(tf)}
                      className={`px-3 py-1.5 rounded-xl uppercase transition-all ${
                        timeFilter === tf
                          ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                          : 'text-stone-500 dark:text-stone-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      {tf === '7d' ? '7 Days' : tf === '30d' ? '30 Days' : tf === '90d' ? '90 Days' : 'All Time'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Chart Grid: Trend Bars & Category Distribution */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Visual 1: Lost vs Found Reports Over Time */}
                <div className="bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                        Lost vs Found Incident Trends
                      </h4>
                      <p className="text-[11px] text-stone-500 dark:text-stone-400">
                        Weekly intake volume across campus security custody counters
                      </p>
                    </div>
                    <div className="flex items-center gap-3 text-xs font-bold">
                      <span className="flex items-center gap-1.5 text-rose-500">
                        <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block"></span>
                        Lost
                      </span>
                      <span className="flex items-center gap-1.5 text-emerald-500">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
                        Found
                      </span>
                    </div>
                  </div>

                  {/* SVG Bar Chart */}
                  <div className="pt-4 h-48 flex items-end justify-between gap-2 border-b border-stone-200 dark:border-slate-800 pb-2">
                    {currentTrendData.map((d, i) => {
                      const lostHeight = Math.round((d.lost / maxTrendVal) * 140);
                      const foundHeight = Math.round((d.found / maxTrendVal) * 140);
                      return (
                        <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
                          <div className="w-full flex items-end justify-center gap-1 h-36">
                            <div 
                              style={{ height: `${lostHeight}px` }}
                              title={`Lost: ${d.lost}`}
                              className="w-1/2 max-w-[16px] bg-rose-500 hover:bg-rose-600 rounded-t-md transition-all relative"
                            />
                            <div 
                              style={{ height: `${foundHeight}px` }}
                              title={`Found: ${d.found}`}
                              className="w-1/2 max-w-[16px] bg-emerald-500 hover:bg-emerald-600 rounded-t-md transition-all relative"
                            />
                          </div>
                          <span className="text-[10px] font-bold text-stone-500 dark:text-stone-400 truncate max-w-[45px]">
                            {d.date}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 pt-1">
                    <span>Average Return Turnaround: <strong>1.4 Days</strong></span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">92% Claim Verification Accuracy</span>
                  </div>
                </div>

                {/* Visual 2: Campus Issues by Category Breakdown */}
                <div className="bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                        Campus Issues by Facility Category
                      </h4>
                      <p className="text-[11px] text-stone-500 dark:text-stone-400">
                        Dispatched work orders by physical infrastructure division
                      </p>
                    </div>
                    <span className="text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950 px-2.5 py-1 rounded-full">
                      {totalIssuesCount} Total Tickets
                    </span>
                  </div>

                  <div className="space-y-2.5 pt-2">
                    {ISSUES_CATEGORY_BREAKDOWN.map((cat, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                            <span>{cat.category}</span>
                          </span>
                          <span className="font-mono text-stone-500 dark:text-stone-400 text-[11px]">
                            <strong>{cat.count}</strong> ({cat.percentage}%)
                          </span>
                        </div>
                        <div className="w-full h-2 bg-stone-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div 
                            className="h-full rounded-full transition-all duration-500"
                            style={{ width: `${cat.percentage}%`, backgroundColor: cat.color }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                </div>

              </div>

              {/* Visual 3: Recent Activity Timeline */}
              <div className="bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                      Recent Proctorial & Security Audit Feed
                    </h4>
                    <p className="text-[11px] text-stone-500 dark:text-stone-400">
                      Immutable trail of verified staff claim approvals, assignments, and ticket closures
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab('activity')}
                    className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline"
                  >
                    View All Logs →
                  </button>
                </div>

                <div className="divide-y divide-stone-100 dark:divide-slate-800">
                  {DEMO_AUDIT_LOGS.slice(0, 4).map((log) => (
                    <div key={log.id} className="py-3 flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900 dark:text-white">
                            {log.title}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-stone-100 dark:bg-slate-800 text-stone-700 dark:text-stone-300">
                            {log.badge}
                          </span>
                        </div>
                        <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                          {log.description}
                        </p>
                        <div className="text-[10px] text-stone-400 font-mono">
                          Actor: {log.actor}
                        </div>
                      </div>
                      <span className="text-[11px] font-medium text-stone-400 shrink-0">
                        {log.timestamp}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* ===================================================================
              TAB 2: STUDENT DIRECTORY (250 STUDENTS)
              =================================================================== */}
          {activeTab === 'students' && (
            <div className="bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-5">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                    <Users className="w-5 h-5 text-indigo-500" />
                    <span>Student Directory & Academic Roll</span>
                  </h3>
                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                    250 verified student accounts. Inspect reporting history, active claims, and account status.
                  </p>
                </div>
                <div className="text-xs text-stone-500 font-mono">
                  Showing <strong>{filteredStudents.length}</strong> of <strong>250</strong> students
                </div>
              </div>

              {/* Filters & Search Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="relative">
                  <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={studentSearch}
                    onChange={(e) => { setStudentSearch(e.target.value); setStudentPage(1); }}
                    placeholder="Search name, roll no, email..."
                    className="w-full pl-9 pr-3 py-2 text-xs bg-stone-50 dark:bg-slate-800 border border-stone-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-amber-500"
                  />
                </div>

                <select
                  value={studentDeptFilter}
                  onChange={(e) => { setStudentDeptFilter(e.target.value); setStudentPage(1); }}
                  className="w-full px-3 py-2 text-xs bg-stone-50 dark:bg-slate-800 border border-stone-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-amber-500 font-semibold"
                >
                  <option value="all">All Academic Departments</option>
                  <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                  <option value="Information Technology">Information Technology</option>
                  <option value="Electronics & Communication">Electronics & Communication</option>
                  <option value="Mechanical Engineering">Mechanical Engineering</option>
                  <option value="Civil Engineering">Civil Engineering</option>
                  <option value="Management & MBA">Management & MBA</option>
                </select>

                <select
                  value={studentStatusFilter}
                  onChange={(e) => { setStudentStatusFilter(e.target.value); setStudentPage(1); }}
                  className="w-full px-3 py-2 text-xs bg-stone-50 dark:bg-slate-800 border border-stone-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-amber-500 font-semibold"
                >
                  <option value="all">All Account Statuses</option>
                  <option value="Active">Active Accounts</option>
                  <option value="Suspended">Suspended Accounts</option>
                </select>
              </div>

              {/* Students Directory Table */}
              <div className="overflow-x-auto rounded-2xl border border-stone-200 dark:border-slate-800">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-50 dark:bg-slate-800/80 text-stone-500 dark:text-stone-400 font-bold border-b border-stone-200 dark:border-slate-800">
                    <tr>
                      <th className="py-3 px-4">Student ID / Roll</th>
                      <th className="py-3 px-4">Full Name</th>
                      <th className="py-3 px-4">Department & Year</th>
                      <th className="py-3 px-4">Reports & Claims</th>
                      <th className="py-3 px-4">Account Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 dark:divide-slate-800">
                    {paginatedStudents.map((stu) => (
                      <tr key={stu.id} className="hover:bg-stone-50/60 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-slate-900 dark:text-white">
                          {stu.studentId}
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-bold text-slate-900 dark:text-white">{stu.name}</div>
                          <div className="text-[10px] text-stone-400 font-mono">{stu.email}</div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-medium text-slate-800 dark:text-slate-200">{stu.department}</div>
                          <div className="text-[10px] text-stone-400">{stu.academicYear}</div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2 text-[11px] font-semibold">
                            <span className="text-rose-600 dark:text-rose-400">{stu.lostReports} Lost</span>
                            <span className="text-stone-300">•</span>
                            <span className="text-emerald-600 dark:text-emerald-400">{stu.foundReports} Found</span>
                            <span className="text-stone-300">•</span>
                            <span className="text-indigo-600 dark:text-indigo-400">{stu.claims} Claims</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            stu.status === 'Active' 
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' 
                              : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                          }`}>
                            {stu.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right space-x-2">
                          <button
                            onClick={() => setSelectedStudent(stu)}
                            className="px-2.5 py-1 bg-stone-100 dark:bg-slate-800 hover:bg-stone-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg font-bold text-[11px] transition-colors"
                          >
                            Details
                          </button>
                          <button
                            onClick={() => handleToggleStudentStatus(stu.id)}
                            className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-colors ${
                              stu.status === 'Active'
                                ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 dark:bg-rose-950/40 dark:text-rose-300'
                                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-300'
                            }`}
                          >
                            {stu.status === 'Active' ? 'Suspend' : 'Activate'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination Controls */}
              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-stone-500 dark:text-stone-400">
                  Page <strong>{studentPage}</strong> of <strong>{totalStudentPages}</strong>
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setStudentPage(p => Math.max(1, p - 1))}
                    disabled={studentPage === 1}
                    className="px-3 py-1 bg-stone-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold disabled:opacity-40"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setStudentPage(p => Math.min(totalStudentPages, p + 1))}
                    disabled={studentPage === totalStudentPages}
                    className="px-3 py-1 bg-stone-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold disabled:opacity-40"
                  >
                    Next
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* ===================================================================
              TAB 3: STAFF MANAGEMENT (EXACTLY 20 ACCOUNTS: STAFF/HIET/100 - 119)
              =================================================================== */}
          {activeTab === 'staff' && (
            <div className="bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-5">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-indigo-500" />
                    <span>Staff Directory & Custody Desk Roster</span>
                  </h3>
                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                    Exactly 20 provisioned staff accounts (<code>STAFF/HIET/100</code> through <code>STAFF/HIET/119</code>).
                  </p>
                </div>
                <div className="text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 px-3 py-1 rounded-full border border-indigo-200 dark:border-indigo-900">
                  Shared Demo Passcode: 832006
                </div>
              </div>

              {/* Search & Desk Filters */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="relative">
                  <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={staffSearch}
                    onChange={(e) => setStaffSearch(e.target.value)}
                    placeholder="Search staff ID, officer name, or assigned desk..."
                    className="w-full pl-9 pr-3 py-2 text-xs bg-stone-50 dark:bg-slate-800 border border-stone-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="text-xs text-stone-500 dark:text-stone-400 flex items-center justify-end font-semibold">
                  All 20 staff accounts provisioned with individual officer desks.
                </div>
              </div>

              {/* Staff Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {filteredStaff.map((st) => (
                  <div 
                    key={st.staffId} 
                    className="bg-stone-50/70 dark:bg-slate-800/60 border border-stone-200 dark:border-slate-700/80 rounded-2xl p-4 space-y-3 hover:border-amber-400/80 transition-all"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white font-black flex items-center justify-center text-xs shadow-xs">
                          {st.staffId.split('/')[2]}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-extrabold text-xs text-slate-900 dark:text-white">
                              {st.name}
                            </h4>
                            <span className="text-[10px] font-mono font-bold text-indigo-600 dark:text-indigo-400">
                              {st.staffId}
                            </span>
                          </div>
                          <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                            {st.desk}
                          </p>
                        </div>
                      </div>

                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        st.status === 'Active' 
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' 
                          : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                      }`}>
                        {st.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 py-2 border-y border-stone-200/80 dark:border-slate-700/60 text-center text-[11px]">
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white">{st.assignedIssues}</div>
                        <div className="text-[10px] text-stone-400">Assigned</div>
                      </div>
                      <div>
                        <div className="font-bold text-emerald-600 dark:text-emerald-400">{st.resolvedIssues}</div>
                        <div className="text-[10px] text-stone-400">Resolved</div>
                      </div>
                      <div>
                        <div className="font-bold text-indigo-600 dark:text-indigo-400">{st.activeCustodyItems}</div>
                        <div className="text-[10px] text-stone-400">Custody</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-stone-500 dark:text-stone-400">
                      <span>Intercom: <strong>{st.phone}</strong></span>
                      <button
                        onClick={() => handleToggleStaffStatus(st.staffId)}
                        className="text-[11px] font-bold text-amber-600 dark:text-amber-400 hover:underline"
                      >
                        {st.status === 'Active' ? 'Deactivate' : 'Reactivate'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* ===================================================================
              TAB 4: LOST & FOUND ADMINISTRATION
              =================================================================== */}
          {activeTab === 'lost-found' && (
            <div className="bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-5">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                    <Search className="w-5 h-5 text-rose-500" />
                    <span>Lost & Found Central Adjudication</span>
                  </h3>
                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                    Adjudicate property claims, resolve duplicate postings, and inspect unmasked reporter identities.
                  </p>
                </div>
              </div>

              {/* Filters */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="relative">
                  <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={lfSearch}
                    onChange={(e) => setLfSearch(e.target.value)}
                    placeholder="Search report ID, title, reporter..."
                    className="w-full pl-9 pr-3 py-2 text-xs bg-stone-50 dark:bg-slate-800 border border-stone-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-amber-500"
                  />
                </div>

                <select
                  value={lfTypeFilter}
                  onChange={(e) => setLfTypeFilter(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-stone-50 dark:bg-slate-800 border border-stone-200 dark:border-slate-700 rounded-xl font-semibold"
                >
                  <option value="all">All Report Types</option>
                  <option value="lost">Lost Item Reports</option>
                  <option value="found">Found Item Reports</option>
                </select>

                <select
                  value={lfStatusFilter}
                  onChange={(e) => setLfStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-stone-50 dark:bg-slate-800 border border-stone-200 dark:border-slate-700 rounded-xl font-semibold"
                >
                  <option value="all">All Case Statuses</option>
                  <option value="lost">Open Lost</option>
                  <option value="found">In Custody (Found)</option>
                  <option value="recovered">Recovered & Returned</option>
                </select>
              </div>

              {/* Reports Table */}
              <div className="overflow-x-auto rounded-2xl border border-stone-200 dark:border-slate-800">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-50 dark:bg-slate-800/80 text-stone-500 dark:text-stone-400 font-bold border-b border-stone-200 dark:border-slate-800">
                    <tr>
                      <th className="py-3 px-4">Report ID</th>
                      <th className="py-3 px-4">Item Details</th>
                      <th className="py-3 px-4">Location & Date</th>
                      <th className="py-3 px-4">Reporter (Admin View)</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Adjudication</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 dark:divide-slate-800">
                    {filteredLF.map((item) => (
                      <tr key={item.id} className="hover:bg-stone-50/60 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-slate-900 dark:text-white">
                          {item.id}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                              item.type === 'lost' ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300' : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            }`}>
                              {item.type}
                            </span>
                            <span className="font-bold text-slate-900 dark:text-white">{item.title}</span>
                          </div>
                          <div className="text-[10px] text-stone-400 mt-0.5">Category: {item.category}</div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-medium text-slate-800 dark:text-slate-200">{item.location}</div>
                          <div className="text-[10px] text-stone-400 font-mono">{item.date}</div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-bold text-slate-900 dark:text-white">
                            {item.reporterName || 'Anonymous Student'}
                          </div>
                          <div className="text-[10px] text-stone-400 font-mono">
                            {item.reporterRoll || 'Roll Pending'}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            item.status === 'recovered'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                              : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          }`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right space-x-1.5">
                          {item.status !== 'recovered' && (
                            <button
                              onClick={() => {
                                updateItemStatus(item.id, 'recovered');
                                addToast(`Item #${item.id} closed and marked recovered.`, 'success');
                              }}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] rounded-lg transition-colors"
                            >
                              Close Case
                            </button>
                          )}
                          {item.isDuplicate && (
                            <button
                              onClick={() => resolveDuplicateFlag(item.id)}
                              className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-white font-bold text-[11px] rounded-lg transition-colors"
                            >
                              Resolve Dup
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
              TAB 5: CAMPUS ISSUES ADMINISTRATION
              =================================================================== */}
          {activeTab === 'issues' && (
            <div className="bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-5">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                    <Wrench className="w-5 h-5 text-blue-500" />
                    <span>Campus Facilities & Grievance Dispatch</span>
                  </h3>
                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                    Assign tickets to any of the 20 staff accounts, change priorities, and track resolution notes.
                  </p>
                </div>
              </div>

              {/* Filters */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="relative">
                  <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={issueSearch}
                    onChange={(e) => setIssueSearch(e.target.value)}
                    placeholder="Search title, ID, or officer..."
                    className="w-full pl-9 pr-3 py-2 text-xs bg-stone-50 dark:bg-slate-800 border border-stone-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-amber-500"
                  />
                </div>

                <select
                  value={issueStatusFilter}
                  onChange={(e) => setIssueStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-stone-50 dark:bg-slate-800 border border-stone-200 dark:border-slate-700 rounded-xl font-semibold"
                >
                  <option value="all">All Ticket Statuses</option>
                  <option value="Submitted">Submitted (Pending)</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Rejected">Rejected</option>
                </select>

                <select
                  value={issuePriorityFilter}
                  onChange={(e) => setIssuePriorityFilter(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-stone-50 dark:bg-slate-800 border border-stone-200 dark:border-slate-700 rounded-xl font-semibold"
                >
                  <option value="all">All Priorities</option>
                  <option value="Critical">Critical Priority</option>
                  <option value="High">High Priority</option>
                  <option value="Medium">Medium Priority</option>
                  <option value="Low">Low Priority</option>
                </select>
              </div>

              {/* Issues Table */}
              <div className="overflow-x-auto rounded-2xl border border-stone-200 dark:border-slate-800">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-50 dark:bg-slate-800/80 text-stone-500 dark:text-stone-400 font-bold border-b border-stone-200 dark:border-slate-800">
                    <tr>
                      <th className="py-3 px-4">Ticket ID</th>
                      <th className="py-3 px-4">Issue Title & Category</th>
                      <th className="py-3 px-4">Campus Location</th>
                      <th className="py-3 px-4">Assigned Staff</th>
                      <th className="py-3 px-4">Priority</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 dark:divide-slate-800">
                    {filteredIssues.map((iss) => (
                      <tr key={iss.id} className="hover:bg-stone-50/60 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-slate-900 dark:text-white">
                          {iss.id}
                        </td>
                        <td className="py-3 px-4 max-w-xs">
                          <div className="font-bold text-slate-900 dark:text-white truncate">{iss.title}</div>
                          <div className="text-[10px] text-stone-400 font-medium">Category: {iss.category}</div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-medium text-slate-800 dark:text-slate-200">{iss.location}</div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                            {iss.assignedStaffName || 'Unassigned'}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            iss.priority === 'Critical' ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300' :
                            iss.priority === 'High' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' :
                            'bg-stone-100 text-stone-700 dark:bg-slate-800 dark:text-stone-300'
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
                              setEditingIssue(iss);
                              setIssueNewStatus(iss.status);
                              setIssueResolutionNotes(iss.resolutionNotes || '');
                              setIssueAssignedStaff(iss.assignedStaffId || 'STAFF/HIET/100');
                            }}
                            className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 dark:bg-amber-400 dark:hover:bg-amber-500 dark:text-slate-950 text-white font-bold text-[11px] rounded-lg transition-colors"
                          >
                            Dispatch / Update
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
              TAB 6: AUDIT ACTIVITY LOG
              =================================================================== */}
          {activeTab === 'activity' && (
            <div className="bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-5">
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                  <Activity className="w-5 h-5 text-emerald-500" />
                  <span>Proctorial Master Audit Trail</span>
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                  Complete chronological activity trail of security desk approvals, credential events, and work orders.
                </p>
              </div>

              <div className="divide-y divide-stone-100 dark:divide-slate-800">
                {DEMO_AUDIT_LOGS.map((log) => (
                  <div key={log.id} className="py-4 flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] font-bold text-stone-400">{log.id}</span>
                        <span className="font-bold text-xs text-slate-900 dark:text-white">{log.title}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                          {log.badge}
                        </span>
                      </div>
                      <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                        {log.description}
                      </p>
                      <div className="text-[11px] font-mono text-stone-500 dark:text-stone-400">
                        Authorized Actor: <strong>{log.actor}</strong>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-stone-400 shrink-0">
                      {log.timestamp}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ===================================================================
              TAB 7 / PART 2.H — COLLEGE ELECTION MANAGEMENT (COMING SOON)
              =================================================================== */}
          {(activeTab === 'election' || activeTab === 'overview') && (
            <div className="bg-gradient-to-br from-amber-500/10 via-white to-stone-50 dark:from-amber-950/20 dark:via-slate-900 dark:to-slate-950 border border-amber-300/80 dark:border-amber-800/60 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-amber-200/80 dark:border-amber-800/40 pb-5">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Vote className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                    <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                      College Election Management
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-400 text-slate-950">
                      Coming Soon
                    </span>
                  </div>
                  <p className="text-xs text-stone-600 dark:text-stone-400 max-w-2xl">
                    High-security student council voting architecture undergoing institutional electoral committee verification.
                    Electronic voting will only be enabled following official university charter notification.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-extrabold text-amber-900 dark:text-amber-200 bg-amber-100 dark:bg-amber-950 px-3 py-1 rounded-xl border border-amber-300/60 dark:border-amber-800">
                    HIET Student Council Session 2026-27
                  </span>
                </div>
              </div>

              {/* 8 Election Management Modules (Clear Coming Soon State) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                
                {/* Module 1: Overview */}
                <div className="bg-white/80 dark:bg-slate-800/80 border border-amber-200 dark:border-slate-700/80 rounded-2xl p-4 space-y-2 opacity-90 hover:opacity-100 transition-opacity">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-slate-900 dark:text-white">Election Overview</span>
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                  </div>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400 leading-relaxed">
                    Institutional governance charter, returning officer desk, and campus election bylaws.
                  </p>
                  <span className="inline-block text-[9px] font-bold uppercase text-stone-400 bg-stone-100 dark:bg-slate-700 px-2 py-0.5 rounded">
                    Preview Module
                  </span>
                </div>

                {/* Module 2: Schedule */}
                <div className="bg-white/80 dark:bg-slate-800/80 border border-amber-200 dark:border-slate-700/80 rounded-2xl p-4 space-y-2 opacity-90 hover:opacity-100 transition-opacity">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-slate-900 dark:text-white">Election Schedule</span>
                    <Calendar className="w-3.5 h-3.5 text-amber-500" />
                  </div>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400 leading-relaxed">
                    Nomination windows, scrutiny deadlines, withdrawal dates, and official polling hours.
                  </p>
                  <span className="inline-block text-[9px] font-bold uppercase text-stone-400 bg-stone-100 dark:bg-slate-700 px-2 py-0.5 rounded">
                    Locked for Notification
                  </span>
                </div>

                {/* Module 3: Candidate Management */}
                <div className="bg-white/80 dark:bg-slate-800/80 border border-amber-200 dark:border-slate-700/80 rounded-2xl p-4 space-y-2 opacity-90 hover:opacity-100 transition-opacity">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-slate-900 dark:text-white">Candidate Vetting</span>
                    <Users className="w-3.5 h-3.5 text-amber-500" />
                  </div>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400 leading-relaxed">
                    Proctorial clearance, academic attendance checks, and disciplinary record validation.
                  </p>
                  <span className="inline-block text-[9px] font-bold uppercase text-stone-400 bg-stone-100 dark:bg-slate-700 px-2 py-0.5 rounded">
                    Verification Pipeline
                  </span>
                </div>

                {/* Module 4: Manifestos */}
                <div className="bg-white/80 dark:bg-slate-800/80 border border-amber-200 dark:border-slate-700/80 rounded-2xl p-4 space-y-2 opacity-90 hover:opacity-100 transition-opacity">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-slate-900 dark:text-white">Candidate Manifestos</span>
                    <FileText className="w-3.5 h-3.5 text-amber-500" />
                  </div>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400 leading-relaxed">
                    Authorized student council manifestos, audio-visual declarations, and policy proposals.
                  </p>
                  <span className="inline-block text-[9px] font-bold uppercase text-stone-400 bg-stone-100 dark:bg-slate-700 px-2 py-0.5 rounded">
                    Content Scrutiny
                  </span>
                </div>

                {/* Module 5: Announcements */}
                <div className="bg-white/80 dark:bg-slate-800/80 border border-amber-200 dark:border-slate-700/80 rounded-2xl p-4 space-y-2 opacity-90 hover:opacity-100 transition-opacity">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-slate-900 dark:text-white">Official Circulars</span>
                    <Activity className="w-3.5 h-3.5 text-amber-500" />
                  </div>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400 leading-relaxed">
                    Electoral Commission advisories, model code of conduct directives, and press releases.
                  </p>
                  <span className="inline-block text-[9px] font-bold uppercase text-stone-400 bg-stone-100 dark:bg-slate-700 px-2 py-0.5 rounded">
                    Proctorial Dispatch
                  </span>
                </div>

                {/* Module 6: Voter Eligibility */}
                <div className="bg-white/80 dark:bg-slate-800/80 border border-amber-200 dark:border-slate-700/80 rounded-2xl p-4 space-y-2 opacity-90 hover:opacity-100 transition-opacity">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-slate-900 dark:text-white">Voter Roll & Eligibility</span>
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
                  </div>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400 leading-relaxed">
                    Automated roll verification matching department enrollment and active student credentials.
                  </p>
                  <span className="inline-block text-[9px] font-bold uppercase text-stone-400 bg-stone-100 dark:bg-slate-700 px-2 py-0.5 rounded">
                    Database Synced
                  </span>
                </div>

                {/* Module 7: Results & Reports */}
                <div className="bg-white/80 dark:bg-slate-800/80 border border-amber-200 dark:border-slate-700/80 rounded-2xl p-4 space-y-2 opacity-90 hover:opacity-100 transition-opacity">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-slate-900 dark:text-white">Results & Audit</span>
                    <BarChart3 className="w-3.5 h-3.5 text-amber-500" />
                  </div>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400 leading-relaxed">
                    Cryptographic audit trail, certified ballot tabulation, and returning officer signature logs.
                  </p>
                  <span className="inline-block text-[9px] font-bold uppercase text-stone-400 bg-stone-100 dark:bg-slate-700 px-2 py-0.5 rounded">
                    Post-Poll Audit
                  </span>
                </div>

                {/* Module 8: Statistics */}
                <div className="bg-white/80 dark:bg-slate-800/80 border border-amber-200 dark:border-slate-700/80 rounded-2xl p-4 space-y-2 opacity-90 hover:opacity-100 transition-opacity">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-slate-900 dark:text-white">Turnout Statistics</span>
                    <TrendingUp className="w-3.5 h-3.5 text-amber-500" />
                  </div>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400 leading-relaxed">
                    Demographic participation breakdown across departments, years of study, and hostel blocks.
                  </p>
                  <span className="inline-block text-[9px] font-bold uppercase text-stone-400 bg-stone-100 dark:bg-slate-700 px-2 py-0.5 rounded">
                    Real-time Metrics
                  </span>
                </div>

              </div>

            </div>
          )}

        </main>

      </div>

      {/* ===================================================================
          MODAL 1: STUDENT DETAILS MODAL
          =================================================================== */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold text-indigo-600 dark:text-indigo-400 uppercase">
                  Student Record • {selectedStudent.id}
                </span>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  {selectedStudent.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedStudent(null)}
                className="p-1 rounded-full text-stone-400 hover:text-slate-900 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 p-4 bg-stone-50 dark:bg-slate-800/60 rounded-2xl text-xs">
              <div>
                <span className="text-stone-400 text-[10px] block">College Roll Number</span>
                <strong className="font-mono text-slate-900 dark:text-white">{selectedStudent.studentId}</strong>
              </div>
              <div>
                <span className="text-stone-400 text-[10px] block">Account Status</span>
                <span className={`font-bold ${selectedStudent.status === 'Active' ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {selectedStudent.status}
                </span>
              </div>
              <div>
                <span className="text-stone-400 text-[10px] block">Academic Department</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedStudent.department}</span>
              </div>
              <div>
                <span className="text-stone-400 text-[10px] block">Academic Year</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedStudent.academicYear}</span>
              </div>
              <div className="col-span-2">
                <span className="text-stone-400 text-[10px] block">Registered College Email</span>
                <span className="font-mono text-slate-800 dark:text-slate-200">{selectedStudent.email}</span>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-900 dark:text-white">Activity Overview:</span>
              <div className="flex items-center gap-3 text-xs">
                <div className="flex-1 p-2.5 bg-rose-50 dark:bg-rose-950/30 rounded-xl text-center">
                  <div className="text-base font-black text-rose-600">{selectedStudent.lostReports}</div>
                  <div className="text-[10px] text-stone-500">Lost Items Reported</div>
                </div>
                <div className="flex-1 p-2.5 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl text-center">
                  <div className="text-base font-black text-emerald-600">{selectedStudent.foundReports}</div>
                  <div className="text-[10px] text-stone-500">Found Items Turned In</div>
                </div>
                <div className="flex-1 p-2.5 bg-indigo-50 dark:bg-indigo-950/30 rounded-xl text-center">
                  <div className="text-base font-black text-indigo-600">{selectedStudent.claims}</div>
                  <div className="text-[10px] text-stone-500">Ownership Claims</div>
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between gap-3">
              <button
                onClick={() => handleToggleStudentStatus(selectedStudent.id)}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-colors ${
                  selectedStudent.status === 'Active'
                    ? 'bg-rose-600 hover:bg-rose-700 text-white'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                }`}
              >
                {selectedStudent.status === 'Active' ? 'Suspend Student Account' : 'Reactivate Account'}
              </button>
              <button
                onClick={() => setSelectedStudent(null)}
                className="px-4 py-2 bg-stone-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================
          MODAL 2: ISSUE DISPATCH & UPDATE MODAL
          =================================================================== */}
      {editingIssue && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <form onSubmit={handleSaveIssueUpdate} className="bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold text-amber-600 dark:text-amber-400 uppercase">
                  Issue Dispatch • {editingIssue.id}
                </span>
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  {editingIssue.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingIssue(null)}
                className="p-1 rounded-full text-stone-400 hover:text-slate-900 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-stone-50 dark:bg-slate-800/60 rounded-xl text-xs space-y-1">
              <div><strong>Location:</strong> {editingIssue.location}</div>
              <div><strong>Category:</strong> {editingIssue.category}</div>
              <p className="text-stone-500 text-[11px] pt-1 leading-relaxed">{editingIssue.description}</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                Assign to Staff Member (20 Provisioned Accounts)
              </label>
              <select
                value={issueAssignedStaff}
                onChange={(e) => setIssueAssignedStaff(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-stone-50 dark:bg-slate-800 border border-stone-200 dark:border-slate-700 rounded-xl font-semibold"
              >
                {PROVISIONED_STAFF_ACCOUNTS.map((st) => (
                  <option key={st.staffId} value={st.staffId}>
                    {st.staffId} — {st.name} ({st.desk})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                Update Status
              </label>
              <select
                value={issueNewStatus}
                onChange={(e) => setIssueNewStatus(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-stone-50 dark:bg-slate-800 border border-stone-200 dark:border-slate-700 rounded-xl font-semibold"
              >
                <option value="Submitted">Submitted (Pending Inspection)</option>
                <option value="In Progress">In Progress (Work Order Dispatched)</option>
                <option value="Resolved">Resolved (Work Completed)</option>
                <option value="Rejected">Rejected (Out of Scope)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                Resolution & Progress Notes
              </label>
              <textarea
                value={issueResolutionNotes}
                onChange={(e) => setIssueResolutionNotes(e.target.value)}
                rows={3}
                placeholder="Document action taken, parts replaced, or proctorial directive..."
                className="w-full px-3 py-2 text-xs bg-stone-50 dark:bg-slate-800 border border-stone-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setEditingIssue(null)}
                className="px-4 py-2 bg-stone-100 dark:bg-slate-800 text-stone-600 dark:text-stone-300 font-bold text-xs rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs rounded-xl shadow-xs transition-colors"
              >
                Save Dispatch Update
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
