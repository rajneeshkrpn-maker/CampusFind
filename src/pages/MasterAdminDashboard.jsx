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
import { NeuralNetworkGraph } from '../components/admin/NeuralNetworkGraph';
import { FloatingAnalysisPanel } from '../components/admin/FloatingAnalysisPanel';
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
  Activity,
  Plus,
  Minus,
  Maximize2,
  Minimize2,
  GitGraph,
  Table,
  Send,
  HelpCircle,
  FolderOpen
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

  // Mode: 'neural' (Centerpiece Network Map + Floating Analysis) or 'console' (Directory Tables & Grids)
  const [viewMode, setViewMode] = useState('neural');

  // Navigation tab for console mode or direct drilling
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'analytics' | 'students' | 'staff' | 'lost-found' | 'issues' | 'claims' | 'election' | 'activity'

  // Data mode: 'demo' | 'live'
  const [dataMode, setDataMode] = useState('demo');

  // Analytics timeframe filter
  const [timeFilter, setTimeFilter] = useState('7d');

  // Neural Network state
  const [activeNodeId, setActiveNodeId] = useState('campus-issues');
  const [activeLeafId, setActiveLeafId] = useState(null);
  const [activeEntityObj, setActiveEntityObj] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });

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

  // Claims admin state
  const [claimsSearch, setClaimsSearch] = useState('');
  const [claimStatusFilter, setClaimStatusFilter] = useState('all');
  const [selectedClaim, setSelectedClaim] = useState(null);

  // Simulation Ticket Modal State
  const [showNewSimModal, setShowNewSimModal] = useState(false);
  const [newSimTitle, setNewSimTitle] = useState('');
  const [newSimCategory, setNewSimCategory] = useState('Water Supply');
  const [newSimLocation, setNewSimLocation] = useState('Academic Block A');
  const [newSimPriority, setNewSimPriority] = useState('High');

  // Role Access Barrier: Master Admin only
  const isMasterAdmin = currentUser?.role === 'admin' || userRole === 'admin';

  if (!isMasterAdmin) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center p-4 bg-[#06090e]">
        <div className="max-w-md w-full bg-slate-900/90 border border-slate-800 rounded-3xl p-8 shadow-2xl text-center space-y-6 text-white backdrop-blur-xl">
          <div className="w-16 h-16 rounded-2xl bg-rose-950/60 border border-rose-800 text-rose-400 flex items-center justify-center mx-auto shadow-inner">
            <Lock className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-rose-950 text-rose-300 border border-rose-800">
              Restricted Master Console
            </span>
            <h2 className="text-2xl font-black tracking-tight text-white">
              Master Admin Authorization Required
            </h2>
            <p className="text-xs text-stone-400 leading-relaxed">
              This cybernetic command interface is restricted to the Proctorial Directorate (<code>ADMIN/HIET/156</code>).
              {currentUser?.role === 'staff' ? (
                <span className="block mt-2 font-semibold text-indigo-400">
                  You are currently authenticated as Staff ({currentUser.name}).
                </span>
              ) : null}
            </p>
          </div>
          <div className="pt-2 flex flex-col gap-2.5">
            {currentUser?.role === 'staff' ? (
              <button
                onClick={() => setCurrentView('staff')}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <Briefcase className="w-3.5 h-3.5" />
                <span>Go to Staff Operations Portal</span>
              </button>
            ) : null}
            <button
              onClick={() => setCurrentView('login')}
              className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Authenticate as Master Admin</span>
            </button>
            <button
              onClick={() => setCurrentView('home')}
              className="text-xs font-semibold text-stone-400 hover:text-white"
            >
              Return to CampusFind Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Active items and counts
  const currentItems = dataMode === 'demo' ? items : items;
  const currentCampusIssues = dataMode === 'demo' ? issuesList : campusIssues;

  // 8 Summary Metrics
  const totalStudents = dataMode === 'demo' ? 250 : 250;
  const totalActiveStaff = staffList.filter(s => s.status === 'Active').length;
  const totalLostReports = currentItems.filter(i => i.type === 'lost').length;
  const totalFoundReports = currentItems.filter(i => i.type === 'found').length;
  const totalIssuesCount = currentCampusIssues.length;
  const resolvedIssuesCount = currentCampusIssues.filter(i => i.status === 'Resolved' || i.status === 'resolved').length;
  const inProgressIssuesCount = currentCampusIssues.filter(i => i.status === 'In Progress' || i.status === 'in_progress').length;
  const pendingIssuesCount = currentCampusIssues.filter(i => i.status === 'Submitted' || i.status === 'pending').length;

  // Active Entity Details displayed in Floating Analysis Panel
  const currentAnalysisEntity = useMemo(() => {
    if (activeEntityObj) return activeEntityObj;

    switch (activeNodeId) {
      case 'campus-issues': {
        const topIssue = currentCampusIssues[0] || DEMO_CAMPUS_ISSUES[0];
        return {
          title: topIssue.title,
          category: 'Campus Facilities & Maintenance',
          status: topIssue.status,
          subtext: `Location: ${topIssue.location} • Priority: ${topIssue.priority}`,
          insight: `Incident #${topIssue.id} logged under ${topIssue.category}. Dispatched to ${topIssue.assignedStaffName || 'Officer Rajesh Verma'}. Work order requires completion signoff.`,
          sectionTab: 'issues',
          raw: topIssue
        };
      }
      case 'lost-found': {
        const topItem = currentItems[0] || { id: 'CF-LST-1038', title: 'Boat Airdopes 141 Anc', location: 'Library 1st Floor', status: 'found' };
        return {
          title: topItem.title,
          category: 'Property Custody & Recovery',
          status: topItem.status === 'recovered' ? 'Recovered' : 'In Custody',
          subtext: `Custody Desk: Main Gate Security Safe • Ref #${topItem.id}`,
          insight: 'Item registered with physical proof verification challenge. Unclaimed turnaround tracking at 1.4 days across campus custody lockers.',
          sectionTab: 'lost-found',
          raw: topItem
        };
      }
      case 'students':
        return {
          title: 'Student Enrollment Roll & Directory',
          category: 'Academic Administration',
          status: '240 Active / 10 Suspended',
          subtext: '6 Academic Divisions • 250 Total Verified Accounts',
          insight: 'Real-time synchronization active with university registrar roll. 0 security infractions or unauthorized access attempts recorded this session.',
          sectionTab: 'students'
        };
      case 'staff':
        return {
          title: 'Proctorial Duty & Staff Desks',
          category: 'Campus Security Directorate',
          status: '20 Desks Active',
          subtext: 'STAFF/HIET/100 through STAFF/HIET/119 on Active Post',
          insight: 'All 20 security counters, hostel desks, and proctor inspection teams logged onto secure intercom frequency. 100% duty roster coverage verified.',
          sectionTab: 'staff'
        };
      case 'claims':
        return {
          title: 'Student Property Ownership Claims',
          category: 'Verification Adjudication',
          status: '16 Total Claims',
          subtext: `${claims.filter(c => c.status === 'pending').length || 3} Pending Document Review`,
          insight: 'Claim approval requires photo proof or serial match. 92% of submissions verified at security desks within 24 hours.',
          sectionTab: 'claims'
        };
      case 'election':
        return {
          title: 'HIET Student Council Election 2026-27',
          category: 'Electoral Governance',
          status: 'Coming Soon • Session 2026-27',
          subtext: '8 Automated Governance & Tabulation Modules',
          insight: 'High-security voting architecture under proctorial vetting. Electronic polling scheduled upon official university charter notification.',
          sectionTab: 'election'
        };
      default:
        return {
          title: 'CampusFind Neural Directorate',
          category: 'Proctorial Intelligence',
          status: 'Operational',
          subtext: 'HIET Central Master Administration',
          insight: 'All campus systems operational. 0 security infractions detected.'
        };
    }
  }, [activeNodeId, activeEntityObj, currentCampusIssues, currentItems, claims]);

  // Node Selection Handler
  const handleSelectNode = (nodeId) => {
    setActiveNodeId(nodeId);
    setActiveLeafId(null);
    setActiveEntityObj(null);
  };

  // Leaf Selection Handler
  const handleSelectLeaf = (leaf) => {
    setActiveLeafId(leaf.id);
    setActiveEntityObj({
      title: leaf.title,
      category: activeNodeId === 'campus-issues' ? 'Facility Work Order' : activeNodeId === 'lost-found' ? 'Property Custody' : 'Academic Record',
      status: leaf.status || leaf.badge,
      subtext: leaf.sub,
      insight: `Record #${leaf.id} focused in neural stream. Priority: ${leaf.badge}. Open directory to review full audit details.`,
      sectionTab: activeNodeId,
      raw: leaf.raw || leaf
    });
  };

  // Explore Details click
  const handleExploreDetails = () => {
    const targetTab = currentAnalysisEntity?.sectionTab || activeNodeId;
    setActiveTab(targetTab);
    setViewMode('console');
  };

  // AI Command Execution Handler
  const handleExecuteCommand = (tabName, filterValue) => {
    if (tabName === 'issues' && filterValue === 'Critical') {
      setActiveNodeId('campus-issues');
      setIssuePriorityFilter('Critical');
    } else if (tabName) {
      setActiveNodeId(tabName);
    }
  };

  // Zoom handlers
  const handleZoomIn = () => setZoomLevel(z => Math.min(1.5, z + 0.1));
  const handleZoomOut = () => setZoomLevel(z => Math.max(0.7, z - 0.1));
  const handleResetZoom = () => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
  };

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

  // Create Simulation Ticket Handler
  const handleCreateSimTicket = (e) => {
    e.preventDefault();
    if (!newSimTitle.trim()) return;

    const newTicket = {
      id: `ISS-2026-${Math.floor(100 + Math.random() * 900)}`,
      title: newSimTitle,
      category: newSimCategory,
      location: newSimLocation,
      description: 'Dispatched through Master Admin Neural Simulation Console.',
      reporterName: 'Dr. Arvind K. Swarup (Master Admin)',
      reporterRoll: 'ADMIN/HIET/156',
      assignedStaffId: 'STAFF/HIET/100',
      assignedStaffName: 'Officer Rajesh Verma',
      priority: newSimPriority,
      status: 'Submitted',
      upvotes: 1,
      createdAt: 'Just now',
      updatedAt: 'Just now',
      resolutionNotes: null
    };

    setIssuesList(prev => [newTicket, ...prev]);
    addToast(`Simulation Ticket #${newTicket.id} created and dispatched!`, 'success');
    setShowNewSimModal(false);
    setNewSimTitle('');
  };

  // Filtered Students
  const filteredStudents = useMemo(() => {
    return studentsList.filter((s) => {
      if (studentDeptFilter !== 'all' && s.department !== studentDeptFilter) return false;
      if (studentStatusFilter !== 'all' && s.status !== studentStatusFilter) return false;
      if (studentSearch.trim()) {
        const q = studentSearch.toLowerCase();
        return s.name.toLowerCase().includes(q) || s.studentId.toLowerCase().includes(q) || s.email.toLowerCase().includes(q);
      }
      return true;
    });
  }, [studentsList, studentSearch, studentDeptFilter, studentStatusFilter]);

  const pageSize = 15;
  const totalStudentPages = Math.ceil(filteredStudents.length / pageSize) || 1;
  const paginatedStudents = filteredStudents.slice((studentPage - 1) * pageSize, studentPage * pageSize);

  // Filtered Staff
  const filteredStaff = useMemo(() => {
    return staffList.filter((s) => {
      if (staffDeptFilter !== 'all' && s.department !== staffDeptFilter) return false;
      if (staffSearch.trim()) {
        const q = staffSearch.toLowerCase();
        return s.name.toLowerCase().includes(q) || s.staffId.toLowerCase().includes(q) || s.desk.toLowerCase().includes(q);
      }
      return true;
    });
  }, [staffList, staffSearch, staffDeptFilter]);

  // Filtered Issues
  const filteredIssues = useMemo(() => {
    return currentCampusIssues.filter((i) => {
      if (issueStatusFilter !== 'all' && i.status.toLowerCase() !== issueStatusFilter.toLowerCase()) return false;
      if (issuePriorityFilter !== 'all' && i.priority !== issuePriorityFilter) return false;
      if (issueSearch.trim()) {
        const q = issueSearch.toLowerCase();
        return i.title.toLowerCase().includes(q) || i.id.toLowerCase().includes(q) || i.location.toLowerCase().includes(q);
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
        return i.title.toLowerCase().includes(q) || i.id.toLowerCase().includes(q) || i.location.toLowerCase().includes(q);
      }
      return true;
    });
  }, [currentItems, lfSearch, lfTypeFilter, lfStatusFilter]);

  // Filtered Claims
  const filteredClaims = useMemo(() => {
    return claims.filter((c) => {
      if (claimStatusFilter !== 'all' && c.status !== claimStatusFilter) return false;
      if (claimsSearch.trim()) {
        const q = claimsSearch.toLowerCase();
        return c.itemTitle.toLowerCase().includes(q) || c.id.toLowerCase().includes(q) || c.claimantName.toLowerCase().includes(q);
      }
      return true;
    });
  }, [claims, claimsSearch, claimStatusFilter]);

  return (
    <div className="min-h-screen bg-[#05080d] text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
      
      {/* ===================================================================
          FUTURISTIC TOP BAR (Matching reference screenshot)
          =================================================================== */}
      <header className="sticky top-0 z-40 bg-[#080d14]/90 backdrop-blur-xl border-b border-slate-800/80 px-4 sm:px-6 py-3">
        <div className="max-w-[1720px] mx-auto flex items-center justify-between gap-4">
          
          {/* Left: Brand & Emblem */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setViewMode(v => v === 'neural' ? 'console' : 'neural')}
              className="p-2 rounded-xl text-stone-400 hover:text-white hover:bg-slate-800/80 transition-colors"
              title="Toggle View Mode"
            >
              <Layers className="w-5 h-5 text-cyan-400" />
            </button>

            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-indigo-600 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-cyan-500/20">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-black text-white tracking-tight">CampusFind AI</span>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-cyan-400/20 text-cyan-300 border border-cyan-400/40">
                    Master Neural Platform
                  </span>
                </div>
                <div className="text-[10px] text-stone-400">
                  Hi-Tech Institute Proctorial Directorate • Dr. Arvind K. Swarup
                </div>
              </div>
            </div>
          </div>

          {/* Center: Centerpiece Floating Capsule Toolbar */}
          <div className="hidden md:flex items-center bg-slate-900/90 border border-slate-700/80 rounded-2xl p-1 shadow-2xl backdrop-blur-md">
            
            <button
              onClick={() => setViewMode('neural')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                viewMode === 'neural'
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              <GitGraph className="w-3.5 h-3.5" />
              <span>Neural Map</span>
            </button>

            <button
              onClick={() => setViewMode('console')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                viewMode === 'console'
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              <Table className="w-3.5 h-3.5" />
              <span>Command Console</span>
            </button>

            <div className="w-[1px] h-4 bg-slate-700 mx-1" />

            <button
              onClick={handleZoomIn}
              className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Zoom In"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={handleZoomOut}
              className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Zoom Out"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={handleResetZoom}
              className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Reset View"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>

            <div className="w-[1px] h-4 bg-slate-700 mx-1" />

            {/* Filter Badge Button */}
            <button
              onClick={() => { setActiveTab('issues'); setViewMode('console'); }}
              className="px-2.5 py-1 rounded-xl text-[11px] font-bold text-stone-300 hover:text-white hover:bg-slate-800 transition-colors flex items-center gap-1"
            >
              <Filter className="w-3 h-3 text-amber-400" />
              <span className="w-4 h-4 rounded-full bg-amber-400 text-slate-950 text-[9px] flex items-center justify-center font-black">
                6
              </span>
            </button>

          </div>

          {/* Right: Actions, Simulation Mode, Profile */}
          <div className="flex items-center gap-2.5">
            
            {/* New Simulation Button */}
            <button
              onClick={() => setShowNewSimModal(true)}
              className="px-3.5 py-1.5 bg-slate-800/80 hover:bg-slate-700 text-cyan-300 font-bold text-xs rounded-xl border border-cyan-500/40 shadow-sm transition-all flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">New Simulation</span>
            </button>

            {/* Demo Mode Switcher */}
            <div className="flex items-center bg-slate-900 border border-slate-700 rounded-xl p-0.5 text-xs">
              <button
                onClick={() => { setDataMode('demo'); addToast('Viewing Comprehensive Demo Simulation', 'info'); }}
                className={`px-2 py-1 rounded-lg font-bold text-[10px] transition-all ${
                  dataMode === 'demo' ? 'bg-amber-400 text-slate-950 font-black' : 'text-stone-400 hover:text-white'
                }`}
              >
                Demo
              </button>
              <button
                onClick={() => { setDataMode('live'); addToast('Connected to Live Supabase DB', 'info'); }}
                className={`px-2 py-1 rounded-lg font-bold text-[10px] transition-all ${
                  dataMode === 'live' ? 'bg-emerald-500 text-slate-950 font-black' : 'text-stone-400 hover:text-white'
                }`}
              >
                Live
              </button>
            </div>

            {/* Exit to Home */}
            <button
              onClick={() => setCurrentView('home')}
              className="p-2 rounded-xl text-stone-400 hover:text-white hover:bg-slate-800 transition-colors hidden sm:block"
              title="Return to CampusFind Home"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>

            {/* Sign Out */}
            <button
              onClick={logout}
              className="p-2 rounded-xl text-rose-400 hover:bg-rose-950/40 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>

          </div>

        </div>
      </header>

      {/* Sub-header Context Pill (Matches reference top-right capsule) */}
      <div className="max-w-[1720px] mx-auto w-full px-4 sm:px-6 pt-3 flex items-center justify-between">
        <div className="flex items-center gap-2 overflow-x-auto text-xs font-semibold py-1">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'students', label: 'Students (250)', icon: Users },
            { id: 'staff', label: 'Staff Roster (20)', icon: Briefcase },
            { id: 'lost-found', label: 'Lost & Found', icon: Search },
            { id: 'issues', label: 'Campus Issues', icon: Wrench },
            { id: 'claims', label: 'Item Claims', icon: CheckCircle2 },
            { id: 'analytics', label: 'Analytics & Trends', icon: TrendingUp },
            { id: 'election', label: 'Election Coming Soon', icon: Vote },
            { id: 'activity', label: 'Audit Trail', icon: Activity }
          ].map((tab) => {
            const Icon = tab.icon;
            const isTabActive = viewMode === 'console' && activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setViewMode('console');
                }}
                className={`px-3 py-1 rounded-full whitespace-nowrap text-xs transition-all flex items-center gap-1.5 ${
                  isTabActive
                    ? 'bg-cyan-500 text-slate-950 font-black shadow-md shadow-cyan-500/20'
                    : 'text-stone-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-3 h-3" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div className="hidden lg:flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-900/80 border border-slate-800 text-[11px] text-stone-400">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></span>
          <span>KPI Overview • Hi-Tech Institute CampusFind Directorate</span>
        </div>
      </div>

      {/* ===================================================================
          VIEW MODE 1: NEURAL COMMAND VIEW (CENTERPIECE FROM SCREENSHOT)
          =================================================================== */}
      {viewMode === 'neural' && (
        <div className="max-w-[1720px] mx-auto w-full px-4 sm:px-6 py-4 flex-1 flex flex-col lg:flex-row gap-5 items-stretch">
          
          {/* Center-Left: Interactive Neural Network Graph */}
          <div className="flex-1 min-w-0 flex flex-col">
            <NeuralNetworkGraph
              activeNodeId={activeNodeId}
              onSelectNode={handleSelectNode}
              activeLeafId={activeLeafId}
              onSelectLeaf={handleSelectLeaf}
              onOpenDetails={handleExploreDetails}
              items={currentItems}
              claims={claims}
              campusIssues={currentCampusIssues}
              students={studentsList}
              staff={staffList}
              zoomLevel={zoomLevel}
              panOffset={panOffset}
              onResetView={handleResetZoom}
            />
          </div>

          {/* Center-Right: Floating Analysis Panel */}
          <FloatingAnalysisPanel
            activeEntity={currentAnalysisEntity}
            onExploreDetails={handleExploreDetails}
            items={currentItems}
            claims={claims}
            campusIssues={currentCampusIssues}
            students={studentsList}
            staff={staffList}
            onExecuteCommand={handleExecuteCommand}
          />

        </div>
      )}

      {/* ===================================================================
          VIEW MODE 2: TABULAR COMMAND CONSOLE & DETAILED DIRECTORIES
          =================================================================== */}
      {viewMode === 'console' && (
        <div className="max-w-[1720px] mx-auto w-full px-4 sm:px-6 py-6 flex-1 space-y-6">
          
          {/* Back to Neural Map Banner */}
          <div className="flex items-center justify-between p-4 bg-slate-900/80 border border-cyan-500/30 rounded-2xl">
            <div className="flex items-center gap-3">
              <GitGraph className="w-5 h-5 text-cyan-400" />
              <div>
                <span className="text-sm font-black text-white">Tabular Administrative Console</span>
                <p className="text-xs text-stone-400">Full directory inspection, pagination, search, and action controls.</p>
              </div>
            </div>
            <button
              onClick={() => setViewMode('neural')}
              className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs rounded-xl transition-all shadow-md flex items-center gap-1.5"
            >
              <GitGraph className="w-3.5 h-3.5" />
              <span>Return to Neural Network Map</span>
            </button>
          </div>

          {/* 8 TOP SUMMARY CARDS */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3 shadow-sm">
              <span className="text-[10px] text-stone-400 block font-bold">Total Students</span>
              <div className="text-xl font-black text-white mt-1">{totalStudents}</div>
              <span className="text-[9px] text-emerald-400 font-bold">240 Active Roll</span>
            </div>
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3 shadow-sm">
              <span className="text-[10px] text-stone-400 block font-bold">Active Staff</span>
              <div className="text-xl font-black text-white mt-1">{totalActiveStaff}/20</div>
              <span className="text-[9px] text-indigo-400 font-bold">STAFF 100-119</span>
            </div>
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3 shadow-sm">
              <span className="text-[10px] text-stone-400 block font-bold">Lost Items</span>
              <div className="text-xl font-black text-rose-400 mt-1">{totalLostReports}</div>
              <span className="text-[9px] text-stone-400">Recovery Search</span>
            </div>
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3 shadow-sm">
              <span className="text-[10px] text-stone-400 block font-bold">Found Items</span>
              <div className="text-xl font-black text-emerald-400 mt-1">{totalFoundReports}</div>
              <span className="text-[9px] text-stone-400">In Locker Safe</span>
            </div>
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3 shadow-sm">
              <span className="text-[10px] text-stone-400 block font-bold">Total Issues</span>
              <div className="text-xl font-black text-blue-400 mt-1">{totalIssuesCount}</div>
              <span className="text-[9px] text-stone-400">Campus Facilities</span>
            </div>
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3 shadow-sm">
              <span className="text-[10px] text-stone-400 block font-bold">Resolved</span>
              <div className="text-xl font-black text-emerald-400 mt-1">{resolvedIssuesCount}</div>
              <span className="text-[9px] text-emerald-400 font-bold">Closed Orders</span>
            </div>
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3 shadow-sm">
              <span className="text-[10px] text-stone-400 block font-bold">In Progress</span>
              <div className="text-xl font-black text-amber-400 mt-1">{inProgressIssuesCount}</div>
              <span className="text-[9px] text-amber-400 font-bold">Work Dispatched</span>
            </div>
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3 shadow-sm">
              <span className="text-[10px] text-stone-400 block font-bold">Pending Triage</span>
              <div className="text-xl font-black text-rose-400 mt-1">{pendingIssuesCount}</div>
              <span className="text-[9px] text-rose-400 font-bold">Awaiting Staff</span>
            </div>
          </div>

          {/* TAB CONTENT: STUDENTS */}
          {activeTab === 'students' && (
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-indigo-400" />
                  <span>Student Directory (250 Verified Accounts)</span>
                </h3>
                <span className="text-xs text-stone-400 font-mono">Showing {filteredStudents.length} of 250</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  value={studentSearch}
                  onChange={(e) => { setStudentSearch(e.target.value); setStudentPage(1); }}
                  placeholder="Search name, student roll, email..."
                  className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-400"
                />
                <select
                  value={studentDeptFilter}
                  onChange={(e) => { setStudentDeptFilter(e.target.value); setStudentPage(1); }}
                  className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white font-semibold"
                >
                  <option value="all">All Departments</option>
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
                  className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white font-semibold"
                >
                  <option value="all">All Account Statuses</option>
                  <option value="Active">Active Accounts</option>
                  <option value="Suspended">Suspended Accounts</option>
                </select>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-slate-800">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950/80 text-stone-400 font-bold border-b border-slate-800">
                    <tr>
                      <th className="py-3 px-4">Student ID / Roll</th>
                      <th className="py-3 px-4">Full Name & Email</th>
                      <th className="py-3 px-4">Department & Year</th>
                      <th className="py-3 px-4">Activity Summary</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {paginatedStudents.map((stu) => (
                      <tr key={stu.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-cyan-300">{stu.studentId}</td>
                        <td className="py-3 px-4">
                          <div className="font-bold text-white">{stu.name}</div>
                          <div className="text-[10px] text-stone-400 font-mono">{stu.email}</div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="text-stone-300">{stu.department}</div>
                          <div className="text-[10px] text-stone-500">{stu.academicYear}</div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-rose-400 font-bold">{stu.lostReports} Lost</span> • 
                          <span className="text-emerald-400 font-bold ml-1">{stu.foundReports} Found</span> • 
                          <span className="text-indigo-400 font-bold ml-1">{stu.claims} Claims</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            stu.status === 'Active' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-rose-950 text-rose-300 border border-rose-800'
                          }`}>
                            {stu.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right space-x-2">
                          <button
                            onClick={() => setSelectedStudent(stu)}
                            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-stone-300 rounded-lg font-bold text-[11px]"
                          >
                            Details
                          </button>
                          <button
                            onClick={() => handleToggleStudentStatus(stu.id)}
                            className={`px-2.5 py-1 rounded-lg font-bold text-[11px] ${
                              stu.status === 'Active' ? 'bg-rose-950/60 hover:bg-rose-900 text-rose-300' : 'bg-emerald-950/60 hover:bg-emerald-900 text-emerald-300'
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

              {/* Pagination */}
              <div className="flex items-center justify-between pt-2 text-xs">
                <span className="text-stone-400">Page {studentPage} of {totalStudentPages}</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setStudentPage(p => Math.max(1, p - 1))}
                    disabled={studentPage === 1}
                    className="px-3 py-1 bg-slate-800 text-stone-300 rounded-xl disabled:opacity-40"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setStudentPage(p => Math.min(totalStudentPages, p + 1))}
                    disabled={studentPage === totalStudentPages}
                    className="px-3 py-1 bg-slate-800 text-stone-300 rounded-xl disabled:opacity-40"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB CONTENT: STAFF (ALL 20 ACCOUNTS: STAFF/HIET/100-119) */}
          {activeTab === 'staff' && (
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-lg font-black text-white flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-emerald-400" />
                    <span>Staff Directory (20 Provisioned Accounts: STAFF/HIET/100 – 119)</span>
                  </h3>
                  <p className="text-xs text-stone-400">All 20 security officers, custody desks, and hostel duty posts.</p>
                </div>
                <span className="text-xs font-mono font-bold text-amber-300 bg-amber-950/60 border border-amber-800 px-3 py-1 rounded-full">
                  Shared Demo Passcode: 832006
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-2">
                {filteredStaff.map((st) => (
                  <div key={st.staffId} className="p-4 bg-slate-950/70 border border-slate-800 rounded-2xl space-y-3 hover:border-cyan-500/50 transition-all">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-cyan-400">{st.staffId}</span>
                          <span className="text-xs font-black text-white">{st.name}</span>
                        </div>
                        <p className="text-[11px] text-stone-400 mt-0.5">{st.desk}</p>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                        {st.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 py-2 border-y border-slate-800 text-center text-xs">
                      <div>
                        <div className="font-black text-white">{st.assignedIssues}</div>
                        <div className="text-[10px] text-stone-500">Assigned</div>
                      </div>
                      <div>
                        <div className="font-black text-emerald-400">{st.resolvedIssues}</div>
                        <div className="text-[10px] text-stone-500">Resolved</div>
                      </div>
                      <div>
                        <div className="font-black text-cyan-400">{st.activeCustodyItems}</div>
                        <div className="text-[10px] text-stone-500">Custody</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-stone-400">
                      <span>Intercom: {st.phone}</span>
                      <button
                        onClick={() => handleToggleStaffStatus(st.staffId)}
                        className="text-[11px] font-bold text-cyan-400 hover:underline"
                      >
                        {st.status === 'Active' ? 'Deactivate' : 'Reactivate'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB CONTENT: CAMPUS ISSUES DESK */}
          {activeTab === 'issues' && (
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  <Wrench className="w-5 h-5 text-amber-400" />
                  <span>Campus Issues & Work Orders Dispatch</span>
                </h3>
                <button
                  onClick={() => setShowNewSimModal(true)}
                  className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-xl flex items-center gap-1 shadow-md"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Dispatch New Ticket</span>
                </button>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-slate-800">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950 text-stone-400 font-bold border-b border-slate-800">
                    <tr>
                      <th className="py-3 px-4">Ticket</th>
                      <th className="py-3 px-4">Title & Category</th>
                      <th className="py-3 px-4">Location</th>
                      <th className="py-3 px-4">Assigned Staff</th>
                      <th className="py-3 px-4">Priority</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Dispatch Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {filteredIssues.map((iss) => (
                      <tr key={iss.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-cyan-300">{iss.id}</td>
                        <td className="py-3 px-4 max-w-xs">
                          <div className="font-bold text-white truncate">{iss.title}</div>
                          <div className="text-[10px] text-stone-500">{iss.category}</div>
                        </td>
                        <td className="py-3 px-4 text-stone-300">{iss.location}</td>
                        <td className="py-3 px-4 font-semibold text-emerald-400">{iss.assignedStaffName || 'Unassigned'}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            iss.priority === 'Critical' ? 'bg-rose-950 text-rose-300 border border-rose-800' :
                            iss.priority === 'High' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                            'bg-slate-800 text-stone-300'
                          }`}>
                            {iss.priority}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            iss.status === 'Resolved' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                            iss.status === 'In Progress' ? 'bg-blue-950 text-blue-300 border border-blue-800' :
                            'bg-slate-800 text-stone-300'
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
                            className="px-3 py-1 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-[11px] rounded-lg shadow-sm"
                          >
                            Update & Reassign
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB CONTENT: LOST & FOUND */}
          {activeTab === 'lost-found' && (
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-4">
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <Search className="w-5 h-5 text-cyan-400" />
                <span>Lost & Found Central Property Adjudication</span>
              </h3>

              <div className="overflow-x-auto rounded-2xl border border-slate-800">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950 text-stone-400 font-bold border-b border-slate-800">
                    <tr>
                      <th className="py-3 px-4">ID</th>
                      <th className="py-3 px-4">Item & Category</th>
                      <th className="py-3 px-4">Location</th>
                      <th className="py-3 px-4">Reporter (Unmasked)</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {filteredLF.map((it) => (
                      <tr key={it.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-cyan-300">{it.id}</td>
                        <td className="py-3 px-4">
                          <div className="font-bold text-white">{it.title}</div>
                          <div className="text-[10px] text-stone-500">{it.category}</div>
                        </td>
                        <td className="py-3 px-4 text-stone-300">{it.location}</td>
                        <td className="py-3 px-4">
                          <div className="font-bold text-white">{it.reporterName || 'Student'}</div>
                          <div className="text-[10px] text-stone-500 font-mono">{it.reporterRoll}</div>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            it.status === 'recovered' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-amber-950 text-amber-300 border border-amber-800'
                          }`}>
                            {it.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right space-x-1.5">
                          {it.status !== 'recovered' && (
                            <button
                              onClick={() => {
                                updateItemStatus(it.id, 'recovered');
                                addToast(`Item #${it.id} closed and marked recovered.`, 'success');
                              }}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] rounded-lg"
                            >
                              Close Case
                            </button>
                          )}
                          {it.isDuplicate && (
                            <button
                              onClick={() => resolveDuplicateFlag(it.id)}
                              className="px-2.5 py-1 bg-amber-500 text-slate-950 font-bold text-[11px] rounded-lg"
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

          {/* TAB CONTENT: CLAIMS DESK */}
          {activeTab === 'claims' && (
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-4">
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>Item Ownership Claims Adjudication</span>
              </h3>

              <div className="overflow-x-auto rounded-2xl border border-slate-800">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950 text-stone-400 font-bold border-b border-slate-800">
                    <tr>
                      <th className="py-3 px-4">Claim ID</th>
                      <th className="py-3 px-4">Claimed Item</th>
                      <th className="py-3 px-4">Claimant Student</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Decision</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {filteredClaims.map((clm) => (
                      <tr key={clm.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-cyan-300">{clm.id}</td>
                        <td className="py-3 px-4 font-bold text-white">{clm.itemTitle}</td>
                        <td className="py-3 px-4">
                          <div className="font-bold text-white">{clm.claimantName}</div>
                          <div className="text-[10px] text-stone-500 font-mono">{clm.claimantRoll}</div>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            clm.status === 'approved' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                            clm.status === 'rejected' ? 'bg-rose-950 text-rose-300 border border-rose-800' :
                            'bg-amber-950 text-amber-300 border border-amber-800'
                          }`}>
                            {clm.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right space-x-1.5">
                          {clm.status === 'pending' ? (
                            <>
                              <button
                                onClick={() => {
                                  updateClaimStatus(clm.id, 'approved', 'Approved by Master Admin');
                                  addToast(`Claim #${clm.id} approved.`, 'success');
                                }}
                                className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] rounded-lg"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => {
                                  updateClaimStatus(clm.id, 'rejected', 'Rejected by Master Admin');
                                  addToast(`Claim #${clm.id} rejected.`, 'info');
                                }}
                                className="px-2.5 py-1 bg-rose-600 hover:bg-rose-500 text-white font-bold text-[11px] rounded-lg"
                              >
                                Reject
                              </button>
                            </>
                          ) : (
                            <span className="text-stone-500 font-bold">Processed</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB CONTENT: COLLEGE ELECTIONS COMING SOON */}
          {activeTab === 'election' && (
            <div className="bg-gradient-to-br from-amber-500/10 via-slate-900 to-slate-950 border border-amber-500/30 rounded-3xl p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between border-b border-amber-500/20 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Vote className="w-6 h-6 text-amber-400" />
                    <h3 className="text-xl font-black text-white">College Election Management</h3>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-400 text-slate-950">
                      Coming Soon
                    </span>
                  </div>
                  <p className="text-xs text-stone-400 max-w-2xl">
                    High-security student council voting architecture undergoing institutional electoral committee verification.
                  </p>
                </div>
                <span className="text-xs font-bold font-mono text-amber-300 bg-amber-950 border border-amber-800 px-3 py-1 rounded-xl">
                  HIET Student Council Session 2026-27
                </span>
              </div>

              {/* 8 Module Preview Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                {[
                  { title: 'Election Overview', sub: 'Governance charter & bylaws' },
                  { title: 'Election Schedule', sub: 'Nomination windows & polling hours' },
                  { title: 'Candidate Vetting', sub: 'Proctorial clearance & attendance checks' },
                  { title: 'Candidate Manifestos', sub: 'Audio-visual declarations & proposals' },
                  { title: 'Official Circulars', sub: 'Model code of conduct directives' },
                  { title: 'Voter Roll & Eligibility', sub: 'Roll verification matching department' },
                  { title: 'Results & Cryptographic Audit', sub: 'Certified ballot tabulation' },
                  { title: 'Turnout Statistics', sub: 'Demographic participation rate' }
                ].map((mod, i) => (
                  <div key={i} className="p-4 bg-slate-950/70 border border-slate-800 rounded-2xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-white">{mod.title}</span>
                      <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                    </div>
                    <p className="text-[11px] text-stone-400">{mod.sub}</p>
                    <span className="inline-block text-[9px] font-bold uppercase text-stone-500 bg-slate-800 px-2 py-0.5 rounded">
                      Preview Module
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB CONTENT: AUDIT ACTIVITY LOG */}
          {activeTab === 'activity' && (
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-4">
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-emerald-400" />
                <span>Proctorial Master Audit Trail</span>
              </h3>

              <div className="divide-y divide-slate-800">
                {DEMO_AUDIT_LOGS.map((log) => (
                  <div key={log.id} className="py-3.5 flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-cyan-400">{log.id}</span>
                        <span className="font-bold text-xs text-white">{log.title}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-amber-950 text-amber-300 border border-amber-800">
                          {log.badge}
                        </span>
                      </div>
                      <p className="text-xs text-stone-400">{log.description}</p>
                      <div className="text-[10px] text-stone-500 font-mono">Actor: {log.actor}</div>
                    </div>
                    <span className="text-xs text-stone-500 shrink-0">{log.timestamp}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

      {/* ===================================================================
          MODAL 1: STUDENT DETAILS MODAL
          =================================================================== */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 text-white">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase">
                  Student Record • {selectedStudent.id}
                </span>
                <h3 className="text-lg font-black text-white">{selectedStudent.name}</h3>
              </div>
              <button
                onClick={() => setSelectedStudent(null)}
                className="p-1 rounded-full text-stone-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 p-4 bg-slate-950/70 border border-slate-800 rounded-2xl text-xs">
              <div>
                <span className="text-stone-500 text-[10px] block">College Roll Number</span>
                <strong className="font-mono text-cyan-300">{selectedStudent.studentId}</strong>
              </div>
              <div>
                <span className="text-stone-500 text-[10px] block">Account Status</span>
                <span className={`font-bold ${selectedStudent.status === 'Active' ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {selectedStudent.status}
                </span>
              </div>
              <div>
                <span className="text-stone-500 text-[10px] block">Department</span>
                <span className="font-semibold text-stone-300">{selectedStudent.department}</span>
              </div>
              <div>
                <span className="text-stone-500 text-[10px] block">Academic Year</span>
                <span className="font-semibold text-stone-300">{selectedStudent.academicYear}</span>
              </div>
              <div className="col-span-2">
                <span className="text-stone-500 text-[10px] block">Registered College Email</span>
                <span className="font-mono text-stone-300">{selectedStudent.email}</span>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between gap-3">
              <button
                onClick={() => {
                  handleToggleStudentStatus(selectedStudent.id);
                  setSelectedStudent(null);
                }}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                  selectedStudent.status === 'Active'
                    ? 'bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-800'
                    : 'bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-800'
                }`}
              >
                {selectedStudent.status === 'Active' ? 'Suspend Student Account' : 'Reactivate Student Account'}
              </button>
              <button
                onClick={() => setSelectedStudent(null)}
                className="px-4 py-2.5 bg-slate-800 text-stone-300 font-bold text-xs rounded-xl"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <form onSubmit={handleSaveIssueUpdate} className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 text-white animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold text-amber-400 uppercase">
                  Issue Dispatch • {editingIssue.id}
                </span>
                <h3 className="text-base font-black text-white">{editingIssue.title}</h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingIssue(null)}
                className="p-1 rounded-full text-stone-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs space-y-1">
              <div><strong>Location:</strong> {editingIssue.location}</div>
              <div><strong>Category:</strong> {editingIssue.category}</div>
              <p className="text-stone-400 text-[11px] pt-1">{editingIssue.description}</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-300 mb-1">
                Assign to Staff Member (20 Provisioned Accounts)
              </label>
              <select
                value={issueAssignedStaff}
                onChange={(e) => setIssueAssignedStaff(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white font-semibold"
              >
                {PROVISIONED_STAFF_ACCOUNTS.map((st) => (
                  <option key={st.staffId} value={st.staffId}>
                    {st.staffId} — {st.name} ({st.desk})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-300 mb-1">Update Status</label>
              <select
                value={issueNewStatus}
                onChange={(e) => setIssueNewStatus(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white font-semibold"
              >
                <option value="Submitted">Submitted (Pending Triage)</option>
                <option value="In Progress">In Progress (Work Order Dispatched)</option>
                <option value="Resolved">Resolved (Work Completed)</option>
                <option value="Rejected">Rejected (Out of Scope)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-300 mb-1">Resolution & Progress Notes</label>
              <textarea
                value={issueResolutionNotes}
                onChange={(e) => setIssueResolutionNotes(e.target.value)}
                rows={3}
                placeholder="Document actions taken, repair parts installed, or proctorial signoff..."
                className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setEditingIssue(null)}
                className="px-4 py-2 bg-slate-800 text-stone-300 font-bold text-xs rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs rounded-xl shadow-md transition-colors"
              >
                Save Dispatch Update
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ===================================================================
          MODAL 3: DISPATCH NEW SIMULATION TICKET MODAL
          =================================================================== */}
      {showNewSimModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <form onSubmit={handleCreateSimTicket} className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 text-white animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase">
                  Master Admin Dispatch Console
                </span>
                <h3 className="text-base font-black text-white">Create New Simulation Work Order</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowNewSimModal(false)}
                className="p-1 rounded-full text-stone-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-300 mb-1">Issue Title</label>
              <input
                type="text"
                value={newSimTitle}
                onChange={(e) => setNewSimTitle(e.target.value)}
                placeholder="e.g. Broken water valve in Block B Ground Floor"
                className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-400"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-stone-300 mb-1">Category</label>
                <select
                  value={newSimCategory}
                  onChange={(e) => setNewSimCategory(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white font-semibold"
                >
                  <option value="Water Supply">Water Supply</option>
                  <option value="Electricity">Electricity</option>
                  <option value="Classroom Equipment">Classroom Equipment</option>
                  <option value="Cleanliness">Cleanliness</option>
                  <option value="Internet & Wi-Fi">Internet & Wi-Fi</option>
                  <option value="Furniture">Furniture</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-300 mb-1">Priority</label>
                <select
                  value={newSimPriority}
                  onChange={(e) => setNewSimPriority(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white font-semibold"
                >
                  <option value="Critical">Critical</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-300 mb-1">Campus Location</label>
              <input
                type="text"
                value={newSimLocation}
                onChange={(e) => setNewSimLocation(e.target.value)}
                placeholder="e.g. Block A 2nd Floor Corridor"
                className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-400"
                required
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setShowNewSimModal(false)}
                className="px-4 py-2 bg-slate-800 text-stone-300 font-bold text-xs rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs rounded-xl shadow-md transition-colors"
              >
                Dispatch to Duty Staff
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
