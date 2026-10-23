import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CAMPUS_LOCATIONS } from '../data/mockData';
import { 
  Wrench, 
  Wifi, 
  Tv, 
  Lightbulb, 
  Sparkles, 
  Plus, 
  Search, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  MapPin, 
  Send,
  Upload,
  ShieldCheck,
  Building
} from 'lucide-react';

export const ISSUE_CATEGORIES = [
  { label: 'Classroom Projector / AV', icon: Tv, desc: 'HDMI no signal, projector bulb failure, audio system' },
  { label: 'Wi-Fi / Network', icon: Wifi, desc: 'Hotspot down, captive portal error, slow lab connection' },
  { label: 'Electrical & Lighting', icon: Lightbulb, desc: 'Flickering tubes, broken switches, unfunctional fans' },
  { label: 'Campus Infrastructure', icon: Wrench, desc: 'Broken desks, lab chairs, damaged door handles, gates' },
  { label: 'Cleanliness & Sanitation', icon: Sparkles, desc: 'Restroom maintenance, water cooler servicing, waste bin' },
  { label: 'Other Facility Need', icon: Building, desc: 'Any other infrastructure or facility maintenance concern' }
];

export const CampusIssuesPage = () => {
  const { 
    campusIssues, 
    reportCampusIssue, 
    currentUser, 
    setCurrentView, 
    userRole 
  } = useApp();

  const [activeTab, setActiveTab] = useState('browse'); // 'browse' | 'report' | 'my-issues'
  const [selectedCategory, setSelectedCategory] = useState(ISSUE_CATEGORIES[0].label);
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('Lecture Hall 102 (Block B)');
  const [specificRoom, setSpecificRoom] = useState('');
  const [description, setDescription] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [searchFilter, setSearchFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedIssueId, setSubmittedIssueId] = useState(null);

  const handleImageFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Please provide a concise issue title.');
      return;
    }
    if (!description.trim() || description.length < 15) {
      setError('Please provide specific details about the issue (min 15 characters).');
      return;
    }

    setIsSubmitting(true);
    try {
      const fullLocation = specificRoom ? `${location} (${specificRoom})` : location;
      const createdIssue = await reportCampusIssue({
        title,
        category: selectedCategory,
        description,
        location: fullLocation,
        image: imagePreview
      });

      setSubmittedIssueId(createdIssue.id);
      setTitle('');
      setDescription('');
      setSpecificRoom('');
      setImagePreview(null);
    } catch (_err) {
      setError('Could not record campus issue. Please check network connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'submitted':
        return {
          bg: 'bg-stone-100 text-stone-700 border-stone-200',
          label: 'Submitted'
        };
      case 'under_review':
        return {
          bg: 'bg-amber-100 text-amber-800 border-amber-300',
          label: 'Under Review'
        };
      case 'in_progress':
        return {
          bg: 'bg-blue-100 text-blue-800 border-blue-300',
          label: 'In Progress'
        };
      case 'resolved':
        return {
          bg: 'bg-emerald-100 text-emerald-800 border-emerald-300',
          label: 'Resolved'
        };
      case 'rejected':
      case 'closed':
        return {
          bg: 'bg-rose-100 text-rose-800 border-rose-300',
          label: 'Closed'
        };
      default:
        return {
          bg: 'bg-stone-100 text-stone-700 border-stone-200',
          label: status
        };
    }
  };

  const myReportedIssues = campusIssues.filter(
    (issue) =>
      issue.reporterRoll === currentUser?.rollNo ||
      issue.reporterName === currentUser?.name ||
      issue.reporterEmail === currentUser?.email
  );

  const filteredIssues = campusIssues.filter((issue) => {
    if (statusFilter !== 'all' && issue.status !== statusFilter) return false;
    if (categoryFilter !== 'all' && issue.category !== categoryFilter) return false;
    if (searchFilter.trim()) {
      const q = searchFilter.toLowerCase();
      return (
        issue.title.toLowerCase().includes(q) ||
        issue.id.toLowerCase().includes(q) ||
        issue.location.toLowerCase().includes(q) ||
        issue.category.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      
      {/* Banner */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-orange-100 text-orange-800 uppercase tracking-wider">
              Campus Hub Maintenance
            </span>
            <span className="text-xs text-stone-400">• Estate & IT Facility Desk</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Campus Issues & Infrastructure
          </h1>
          <p className="text-xs text-stone-600 max-w-xl leading-relaxed">
            Report broken projectors, Wi-Fi drops, lighting faults, or laboratory equipment issues. 
            All reports are routed to college facility teams with real-time status tracking.
          </p>
        </div>

        <div className="flex items-center gap-3 self-stretch sm:self-auto justify-end">
          <button
            onClick={() => setActiveTab('report')}
            className="px-4 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Report Facility Issue</span>
          </button>
          {userRole === 'admin' && (
            <button
              onClick={() => setCurrentView('admin')}
              className="px-3.5 py-2.5 border border-stone-200 hover:bg-stone-50 text-slate-700 font-semibold text-xs rounded-xl transition-colors"
            >
              Security Admin Desk →
            </button>
          )}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-6 border-b border-stone-200 text-xs font-bold">
        <button
          onClick={() => setActiveTab('browse')}
          className={`py-3 relative transition-colors ${
            activeTab === 'browse' ? 'text-orange-600 border-b-2 border-orange-600' : 'text-stone-500 hover:text-slate-900'
          }`}
        >
          All Campus Issues ({campusIssues.length})
        </button>
        <button
          onClick={() => setActiveTab('my-issues')}
          className={`py-3 relative transition-colors ${
            activeTab === 'my-issues' ? 'text-orange-600 border-b-2 border-orange-600' : 'text-stone-500 hover:text-slate-900'
          }`}
        >
          My Reported Issues ({myReportedIssues.length})
        </button>
        <button
          onClick={() => setActiveTab('report')}
          className={`py-3 relative transition-colors ${
            activeTab === 'report' ? 'text-orange-600 border-b-2 border-orange-600' : 'text-stone-500 hover:text-slate-900'
          }`}
        >
          + File New Maintenance Request
        </button>
      </div>

      {/* View 1: Report New Issue Form */}
      {activeTab === 'report' && (
        <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs max-w-3xl mx-auto space-y-6">
          
          {submittedIssueId && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between text-xs text-emerald-800">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <div className="font-bold">Maintenance Request Logged Successfully!</div>
                  <div className="text-[11px] text-emerald-700">Ref ID: {submittedIssueId}. Estate & IT staff have been notified.</div>
                </div>
              </div>
              <button
                onClick={() => {
                  setSubmittedIssueId(null);
                  setActiveTab('my-issues');
                }}
                className="px-3 py-1 bg-emerald-600 text-white font-bold rounded-lg text-xs hover:bg-emerald-700 transition-colors"
              >
                View Status →
              </button>
            </div>
          )}

          <div>
            <h2 className="text-lg font-extrabold text-slate-900">Report Campus Facility Problem</h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Please provide precise location and symptoms so technicians can bring the right tools.
            </p>
          </div>

          {error && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Category selection */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-2">
                1. Select Issue Category <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {ISSUE_CATEGORIES.map((cat) => {
                  const Icon = cat.icon;
                  const isSelected = selectedCategory === cat.label;
                  return (
                    <button
                      key={cat.label}
                      type="button"
                      onClick={() => setSelectedCategory(cat.label)}
                      className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between space-y-2 ${
                        isSelected 
                          ? 'border-orange-500 bg-orange-50/60 ring-2 ring-orange-500/20' 
                          : 'border-stone-200 hover:border-stone-300 bg-white hover:bg-stone-50/50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                          isSelected ? 'bg-orange-600 text-white' : 'bg-stone-100 text-slate-700'
                        }`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        {isSelected && (
                          <span className="w-2 h-2 rounded-full bg-orange-600" />
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-xs text-slate-900">{cat.label}</div>
                        <div className="text-[10px] text-stone-500 leading-tight mt-0.5 line-clamp-1">{cat.desc}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                2. Problem Summary Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Projector HDMI 2 port loose in Lecture Hall 102"
                className="w-full px-3.5 py-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:border-orange-500 font-medium"
                required
              />
            </div>

            {/* Location & Room */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  3. Campus Block / Zone <span className="text-rose-500">*</span>
                </label>
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:border-orange-500 font-semibold cursor-pointer"
                >
                  {CAMPUS_LOCATIONS.filter((l) => l !== 'All Campus Locations').map((loc) => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Specific Room / Seat / Pillar (Optional)
                </label>
                <input
                  type="text"
                  value={specificRoom}
                  onChange={(e) => setSpecificRoom(e.target.value)}
                  placeholder="e.g. Room 204, Row 3 Terminal 12"
                  className="w-full px-3.5 py-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:border-orange-500 font-medium"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                4. Detailed Description of Malfunction <span className="text-rose-500">*</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                placeholder="Describe what is malfunctioning, when it started, and any symptoms or error messages observed..."
                className="w-full px-3.5 py-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:border-orange-500 font-medium leading-relaxed"
                required
              />
              <span className="text-[10px] text-stone-400 mt-1 block">Minimum 15 characters.</span>
            </div>

            {/* Image upload */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                5. Attach Photo of Defect (Optional)
              </label>
              <div className="flex items-center gap-4">
                <label className="px-4 py-2 border border-stone-200 hover:border-orange-300 rounded-xl bg-stone-50 hover:bg-orange-50/40 text-slate-700 text-xs font-bold cursor-pointer transition-all flex items-center gap-2">
                  <Upload className="w-4 h-4 text-orange-600" />
                  <span>Choose Photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageFile}
                    className="hidden"
                  />
                </label>
                {imagePreview && (
                  <div className="relative w-14 h-14 rounded-xl overflow-hidden border border-stone-200">
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            </div>

            {/* Reporter details summary */}
            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 text-xs flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
                  {currentUser?.name?.[0] || 'S'}
                </div>
                <div>
                  <div className="font-bold text-slate-900">{currentUser?.name || 'Student Reporter'}</div>
                  <div className="text-[11px] text-stone-500">
                    Roll: <strong className="font-mono">{currentUser?.rollNo || '220132010045'}</strong> • {currentUser?.email || 'student@hitech.ac.in'}
                  </div>
                </div>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                Verified Reporter
              </span>
            </div>

            {/* Submit CTA */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <span>Recording in Supabase...</span>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Submit Maintenance Report to College Staff</span>
                </>
              )}
            </button>

          </form>
        </div>
      )}

      {/* View 2: Browse All Campus Issues */}
      {(activeTab === 'browse' || activeTab === 'my-issues') && (
        <div className="space-y-6">
          
          {/* Filter Bar */}
          <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Search issues by title, ref ID, place..."
                className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-orange-500 font-medium"
              />
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-slate-800 font-semibold cursor-pointer"
              >
                <option value="all">All Categories</option>
                {ISSUE_CATEGORIES.map((c) => (
                  <option key={c.label} value={c.label}>{c.label}</option>
                ))}
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-slate-800 font-semibold cursor-pointer"
              >
                <option value="all">All Statuses</option>
                <option value="submitted">Submitted</option>
                <option value="under_review">Under Review</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>
          </div>

          {/* Issue Cards */}
          {(activeTab === 'my-issues' ? myReportedIssues : filteredIssues).length === 0 ? (
            <div className="bg-white rounded-3xl border border-stone-200 p-12 text-center space-y-3">
              <Wrench className="w-12 h-12 text-stone-300 mx-auto" />
              <h3 className="font-bold text-slate-800 text-sm">No Campus Issues Found</h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                {activeTab === 'my-issues'
                  ? 'You have not submitted any campus facility or infrastructure reports yet.'
                  : 'No open reports match your active search filters.'}
              </p>
              <button
                onClick={() => setActiveTab('report')}
                className="px-4 py-2 bg-orange-600 text-white font-bold text-xs rounded-xl shadow-xs"
              >
                Report Facility Problem
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(activeTab === 'my-issues' ? myReportedIssues : filteredIssues).map((issue) => {
                const badge = getStatusBadge(issue.status);
                return (
                  <div
                    key={issue.id}
                    className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs space-y-4 flex flex-col justify-between hover:border-orange-300 transition-colors"
                  >
                    <div className="space-y-2.5">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-slate-800 bg-stone-100 px-2.5 py-0.5 rounded">
                            {issue.id}
                          </span>
                          <span className="text-[11px] font-semibold text-orange-700 bg-orange-50 px-2 py-0.5 rounded">
                            {issue.category}
                          </span>
                        </div>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${badge.bg}`}>
                          {badge.label}
                        </span>
                      </div>

                      <h4 className="font-bold text-slate-900 text-sm">{issue.title}</h4>
                      <p className="text-xs text-stone-600 line-clamp-3 leading-relaxed">
                        {issue.description}
                      </p>
                      
                      <div className="text-[11px] text-stone-400 flex items-center gap-2 pt-1">
                        <MapPin className="w-3.5 h-3.5 text-orange-600 shrink-0" />
                        <span>{issue.location}</span>
                      </div>
                    </div>

                    {/* Resolution Notes (if technician updated) */}
                    {issue.resolutionNotes && (
                      <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl text-xs space-y-1">
                        <div className="font-bold text-amber-900 flex items-center gap-1.5 text-[11px]">
                          <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
                          <span>Staff / Estate Update:</span>
                        </div>
                        <p className="text-stone-700 text-[11px] leading-relaxed">
                          {issue.resolutionNotes}
                        </p>
                        {issue.assignedTo && (
                          <div className="text-[10px] text-stone-500 pt-0.5">
                            Assigned to: <strong>{issue.assignedTo}</strong>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Footer */}
                    <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-400">
                      <span>Reporter: {issue.reporterName}</span>
                      <span>
                        {issue.createdAt ? new Date(issue.createdAt).toLocaleDateString() : 'Recent'}
                      </span>
                    </div>

                  </div>
                );
              })}
            </div>
          )}

        </div>
      )}

    </div>
  );
};
