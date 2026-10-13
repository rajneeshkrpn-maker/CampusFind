import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CAMPUS_SECURITY_HUBS } from '../data/mockData';
import { 
  Search, 
  Check, 
  X, 
  RotateCcw,
  Building2,
  Clock,
  Phone,
  MapPin,
  UserCheck,
  ArrowLeft,
  Lock
} from 'lucide-react';

export const AdminPage = () => {
  const { 
    items, 
    claims, 
    updateClaimStatus, 
    updateItemStatus, 
    setActiveItemDetails,
    setCurrentView,
    resetDemoData
  } = useApp();

  const [activeTab, setActiveTab] = useState('claims'); // 'claims' | 'items' | 'guards'
  const [claimSearch, setClaimSearch] = useState('');
  const [itemSearch, setItemSearch] = useState('');
  const [itemStatusFilter, setItemStatusFilter] = useState('all');
  const [adminNote, setAdminNote] = useState('');

  // Stats
  const totalLost = items.filter(i => i.type === 'lost').length;
  const totalFound = items.filter(i => i.type === 'found').length;
  const pendingClaims = claims.filter(c => c.status === 'pending').length;
  const recoveredItems = items.filter(i => i.status === 'recovered').length;

  const handleApprove = (claimId) => {
    updateClaimStatus(claimId, 'approved', adminNote || 'Approved after student identity verification at security desk.');
    setAdminNote('');
  };

  const handleReject = (claimId) => {
    updateClaimStatus(claimId, 'rejected', adminNote || 'Rejected: Insufficient proof or verification challenge mismatch.');
    setAdminNote('');
  };

  // Filtered claims
  const filteredClaims = claims.filter((c) => {
    if (!claimSearch.trim()) return true;
    const q = claimSearch.toLowerCase();
    return (
      c.id.toLowerCase().includes(q) ||
      c.itemTitle.toLowerCase().includes(q) ||
      c.claimantName.toLowerCase().includes(q) ||
      c.claimantRoll.toLowerCase().includes(q)
    );
  });

  // Filtered items
  const filteredItems = items.filter((i) => {
    if (itemStatusFilter !== 'all' && i.status !== itemStatusFilter) {
      return false;
    }
    if (itemSearch.trim()) {
      const q = itemSearch.toLowerCase();
      return (
        i.title.toLowerCase().includes(q) ||
        i.id.toLowerCase().includes(q) ||
        i.location.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      
      {/* Admin Header Banner with Friend's Profile Image */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden border border-slate-800">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          
          {/* Admin Identity with uploaded picture */}
          <div className="flex items-start sm:items-center gap-4">
            <div className="relative shrink-0">
              <img
                src="/zaid-saifee.png"
                alt="Security Desk Officer"
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-amber-400 shadow-md ring-4 ring-amber-400/20"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80';
                }}
              />
              <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-amber-500 border-2 border-slate-900 flex items-center justify-center text-slate-950 font-bold text-[10px]">
                🛡️
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-slate-950 uppercase tracking-wider">
                  Campus Security & Proctorial Desk
                </span>
                <span className="text-stone-400 text-xs hidden sm:inline">Duty Control</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Staff & Security Portal
              </h1>
              <p className="text-xs text-stone-300 mt-1 max-w-xl">
                Officer Incharge: <strong>Zaid Saifee</strong> (Duty Security Incharge • Gate 1 Main Control). 
                Inspect physical custody logs, review student ownership claims, and contact campus guards.
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-3 self-stretch sm:self-auto justify-end">
            <button
              onClick={() => setCurrentView('dashboard')}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs rounded-xl transition-colors flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Student Dashboard</span>
            </button>
            <button
              onClick={resetDemoData}
              className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
              title="Reset sample demonstration data"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Data</span>
            </button>
          </div>
        </div>

        {/* 4 Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-800 text-xs">
          <div className="p-4 bg-slate-800/80 rounded-xl border border-slate-700/80">
            <span className="text-stone-400 font-medium block mb-1">Active Lost Reports</span>
            <span className="text-2xl font-extrabold text-rose-400 font-mono">{totalLost}</span>
          </div>
          <div className="p-4 bg-slate-800/80 rounded-xl border border-slate-700/80">
            <span className="text-stone-400 font-medium block mb-1">Found in Custody</span>
            <span className="text-2xl font-extrabold text-emerald-400 font-mono">{totalFound}</span>
          </div>
          <div className="p-4 bg-slate-800/80 rounded-xl border border-slate-700/80">
            <span className="text-stone-400 font-medium block mb-1">Pending Claims</span>
            <span className="text-2xl font-extrabold text-amber-400 font-mono">{pendingClaims}</span>
          </div>
          <div className="p-4 bg-slate-800/80 rounded-xl border border-slate-700/80">
            <span className="text-stone-400 font-medium block mb-1">Successfully Recovered</span>
            <span className="text-2xl font-extrabold text-blue-400 font-mono">{recoveredItems}</span>
          </div>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex items-center gap-4 sm:gap-6 border-b border-stone-200 text-xs font-bold overflow-x-auto">
        <button
          onClick={() => setActiveTab('claims')}
          className={`py-3 px-1 relative transition-colors whitespace-nowrap ${
            activeTab === 'claims' ? 'text-orange-600 border-b-2 border-orange-600' : 'text-stone-500 hover:text-slate-900'
          }`}
        >
          Ownership Claims Review ({claims.length})
        </button>
        <button
          onClick={() => setActiveTab('items')}
          className={`py-3 px-1 relative transition-colors whitespace-nowrap ${
            activeTab === 'items' ? 'text-orange-600 border-b-2 border-orange-600' : 'text-stone-500 hover:text-slate-900'
          }`}
        >
          Inventory Registry ({items.length})
        </button>
        <button
          onClick={() => setActiveTab('guards')}
          className={`py-3 px-1 relative transition-colors whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'guards' ? 'text-orange-600 border-b-2 border-orange-600' : 'text-stone-500 hover:text-slate-900'
          }`}
        >
          <Lock className="w-3.5 h-3.5" />
          <span>Security Guard Personnel & Desks ({CAMPUS_SECURITY_HUBS.length})</span>
        </button>
      </div>

      {/* Tab 1: Claims Review Desk */}
      {activeTab === 'claims' && (
        <div className="space-y-6">
          
          {/* Search bar */}
          <div className="flex items-center justify-between gap-4">
            <div className="relative max-w-sm w-full">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={claimSearch}
                onChange={(e) => setClaimSearch(e.target.value)}
                placeholder="Search claims by ID, item, claimant..."
                className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-stone-200 rounded-lg focus:outline-none focus:border-orange-500"
              />
            </div>
            <div className="text-xs text-stone-500">
              Showing <strong>{filteredClaims.length}</strong> claims
            </div>
          </div>

          {/* Claims List */}
          <div className="space-y-4">
            {filteredClaims.map((claim) => (
              <div
                key={claim.id}
                className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-xs font-bold text-slate-800 bg-stone-100 px-2.5 py-0.5 rounded">
                        {claim.id}
                      </span>
                      <span className="text-xs font-semibold text-stone-400">Target Item:</span>
                      <span className="text-xs font-bold text-slate-900">{claim.itemTitle}</span>
                    </div>
                    <div className="text-xs text-stone-500 flex items-center gap-3">
                      <span>Submitted: {claim.submittedAt}</span>
                      <span>•</span>
                      <span>Item Ref: <strong className="font-mono text-slate-700">{claim.itemId}</strong></span>
                    </div>
                  </div>

                  <div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                      claim.status === 'approved'
                        ? 'bg-emerald-100 text-emerald-800'
                        : claim.status === 'rejected'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {claim.status}
                    </span>
                  </div>
                </div>

                {/* Claimant Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 bg-stone-50 rounded-xl border border-stone-100 space-y-1.5">
                    <span className="font-bold text-slate-800 block text-[11px] uppercase tracking-wider text-stone-400">
                      Claimant Identity
                    </span>
                    <div className="text-slate-900 font-semibold">{claim.claimantName}</div>
                    <div className="text-stone-600">Roll No: <strong className="font-mono">{claim.claimantRoll}</strong></div>
                    <div className="text-stone-500">{claim.claimantEmail}</div>
                  </div>

                  <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-200/80 space-y-1.5">
                    <span className="font-bold text-amber-900 block text-[11px] uppercase tracking-wider">
                      Claimant Proof & Verification Details
                    </span>
                    <p className="text-stone-700 leading-relaxed font-normal">
                      "{claim.proofDescription}"
                    </p>
                  </div>
                </div>

                {/* Evidence Image (if uploaded) */}
                {claim.evidenceImage && (
                  <div className="pt-2">
                    <span className="text-[11px] font-bold text-slate-700 block mb-1">
                      Uploaded Supporting Photo:
                    </span>
                    <img
                      src={claim.evidenceImage}
                      alt="Claim Evidence"
                      className="w-24 h-24 rounded-lg object-cover border border-stone-200"
                    />
                  </div>
                )}

                {/* Admin Audit Notes & Actions */}
                <div className="pt-3 border-t border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="text-xs text-stone-500">
                    <strong className="text-slate-800">Security Decision Note:</strong> {claim.adminNotes}
                  </div>

                  {claim.status === 'pending' ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleReject(claim.id)}
                        className="px-3.5 py-1.5 rounded-lg border border-rose-300 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs transition-colors flex items-center gap-1"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Reject Claim</span>
                      </button>
                      <button
                        onClick={() => handleApprove(claim.id)}
                        className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors shadow-xs flex items-center gap-1"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Approve & Release</span>
                      </button>
                    </div>
                  ) : (
                    <span className="text-xs font-semibold text-stone-400">
                      Review Completed
                    </span>
                  )}
                </div>

              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: All Inventory Registry */}
      {activeTab === 'items' && (
        <div className="space-y-6">
          
          {/* Filters Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative max-w-sm w-full">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={itemSearch}
                onChange={(e) => setItemSearch(e.target.value)}
                placeholder="Search catalog by title, ref ID..."
                className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-stone-200 rounded-lg focus:outline-none focus:border-orange-500"
              />
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="font-bold text-stone-500">Status:</span>
              <select
                value={itemStatusFilter}
                onChange={(e) => setItemStatusFilter(e.target.value)}
                className="px-3 py-1.5 bg-white border border-stone-200 rounded-lg text-slate-800 font-semibold cursor-pointer"
              >
                <option value="all">All Statuses</option>
                <option value="lost">Lost</option>
                <option value="found">Found</option>
                <option value="claimed">Claimed</option>
                <option value="recovered">Recovered</option>
              </select>
            </div>
          </div>

          {/* Master Table */}
          <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-4">Ref ID</th>
                    <th className="p-4">Item Title</th>
                    <th className="p-4">Type</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Location</th>
                    <th className="p-4">Custody / Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filteredItems.map((item) => (
                    <tr key={item.id} className="hover:bg-stone-50/70 transition-colors">
                      <td className="p-4 font-mono font-bold text-slate-800">{item.id}</td>
                      <td className="p-4 font-bold text-slate-900 max-w-xs truncate">{item.title}</td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          item.type === 'lost' ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {item.type}
                        </span>
                      </td>
                      <td className="p-4 text-stone-600">{item.category}</td>
                      <td className="p-4 text-stone-600">{item.location}</td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          item.status === 'recovered' 
                            ? 'bg-blue-100 text-blue-800' 
                            : item.status === 'claimed'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-stone-100 text-stone-700'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="p-4 text-right space-x-1 whitespace-nowrap">
                        <button
                          onClick={() => setActiveItemDetails(item)}
                          className="px-2.5 py-1 text-[11px] font-semibold text-slate-700 bg-stone-100 hover:bg-stone-200 rounded transition-colors"
                        >
                          View
                        </button>
                        {item.status !== 'recovered' && (
                          <button
                            onClick={() => updateItemStatus(item.id, 'recovered')}
                            className="px-2.5 py-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded border border-emerald-200 transition-colors"
                          >
                            Mark Recovered
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* Tab 3: Security Guard Personnel & Campus Desks (Requested by User) */}
      {activeTab === 'guards' && (
        <div className="space-y-6">
          <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-5 text-xs text-amber-950 flex items-start gap-3">
            <Lock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-sm text-slate-900 mb-1">
                Official Campus Security Guards & Custody Counters Information
              </h3>
              <p className="text-stone-700 leading-relaxed">
                Hi-Tech Institute of Engineering maintains 4 physical recovery counters monitored by uniformed security staff and proctorial officers. All turned-in belongings are logged in the registry before physical handover.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {CAMPUS_SECURITY_HUBS.map((hub, idx) => (
              <div 
                key={idx}
                className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs hover:border-orange-300 transition-all space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">{hub.name}</h4>
                      <span className="text-[11px] font-semibold text-orange-600">{hub.incharge}</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                    Active Desk
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-stone-600 pt-2 border-t border-stone-100">
                  <div className="flex items-center gap-2">
                    <UserCheck className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    <span>Guard Incharge: <strong className="text-slate-800">{hub.officer}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-orange-600 shrink-0" />
                    <span>Location: {hub.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span>Hours: {hub.hours}</span>
                  </div>
                  <div className="flex items-center gap-2 text-indigo-700 font-semibold pt-1">
                    <Phone className="w-3.5 h-3.5 shrink-0" />
                    <span>Campus Intercom: {hub.phone}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
