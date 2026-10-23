import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { findSuggestedMatches } from '../lib/matchEngine';
import { 
  Package, 
  ShieldCheck, 
  Trash2, 
  CheckCircle2, 
  Eye, 
  Plus, 
  Sparkles, 
  Wrench, 
  Bot, 
  Bell, 
  ArrowRight, 
  Clock, 
  AlertCircle 
} from 'lucide-react';

export const DashboardPage = () => {
  const { 
    currentUser, 
    setShowProfileModal,
    items, 
    claims, 
    campusIssues, 
    notifications, 
    updateItemStatus, 
    deleteItem, 
    setActiveItemDetails, 
    setActiveClaimItem, 
    setCurrentView, 
    setShowAIAssistantModal 
  } = useApp();

  const [activeTab, setActiveTab] = useState('lost'); // 'lost' | 'matches' | 'found' | 'claims' | 'issues'

  // If visitor is not authenticated, show sign-in gatekeeper
  if (!currentUser) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-orange-100 border border-orange-200 text-orange-600 flex items-center justify-center mx-auto shadow-inner">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Student Recovery Dashboard</h2>
          <p className="text-xs text-stone-500 max-w-md mx-auto leading-relaxed">
            Please sign in with your verified college email to view your filed lost reports, track custody verification of found belongings, and check ownership claims.
          </p>
        </div>
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={() => setCurrentView('login')}
            className="px-6 py-2.5 bg-white hover:bg-stone-50 border border-stone-200 text-slate-800 font-bold text-xs rounded-xl shadow-xs transition-colors"
          >
            Sign In to Account
          </button>
          <button
            onClick={() => setCurrentView('register')}
            className="px-6 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
          >
            Create Student Account
          </button>
        </div>
      </div>
    );
  }

  // User's lost items (scoped strictly to authenticated user)
  const myLostItems = items.filter(
    (i) => i.type === 'lost' && (
      (currentUser.rollNo && i.reporterRoll === currentUser.rollNo) || 
      (currentUser.email && i.reporterEmail === currentUser.email) ||
      i.reporterName === currentUser.name
    )
  );

  // User's found items
  const myFoundItems = items.filter(
    (i) => i.type === 'found' && (
      (currentUser.rollNo && i.reporterRoll === currentUser.rollNo) || 
      (currentUser.email && i.reporterEmail === currentUser.email) ||
      i.reporterName === currentUser.name
    )
  );

  // User's submitted claims
  const myClaims = claims.filter(
    (c) => 
      (currentUser.rollNo && c.claimantRoll === currentUser.rollNo) ||
      (currentUser.email && c.claimantEmail === currentUser.email) ||
      c.claimantName === currentUser.name
  );

  // User's reported campus issues
  const myIssues = campusIssues.filter(
    (issue) =>
      (currentUser.rollNo && issue.reporterRoll === currentUser.rollNo) ||
      (currentUser.email && issue.reporterEmail === currentUser.email) ||
      issue.reporterName === currentUser.name
  );

  // Suggested matches for my lost items (Feature 1: Smart Match Engine)
  const suggestedMatchesList = [];
  myLostItems.forEach((lostItem) => {
    const matches = findSuggestedMatches(lostItem, items, 40);
    matches.forEach((m) => {
      suggestedMatchesList.push({
        lostItem,
        candidateItem: m.item,
        score: m.score,
        reasons: m.reasons
      });
    });
  });

  const unreadNotifs = notifications.filter((n) => !n.read);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      
      {/* Profile Header Banner */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 border-orange-500 shadow-md ring-4 ring-orange-50 bg-stone-100 flex items-center justify-center">
                {currentUser?.avatar ? (
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-orange-500 to-amber-600 text-white font-extrabold flex items-center justify-center text-2xl select-none">
                    {(currentUser?.name || 'U').charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-white text-[9px] font-bold">
                ✓
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                  {currentUser?.name || 'Verified Member'}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-orange-100 text-orange-800">
                  {currentUser?.role === 'admin' || currentUser?.role === 'staff' ? 'Staff Desk' : 'Student Verified'}
                </span>
                <button
                  onClick={() => setShowProfileModal(true)}
                  className="text-[11px] font-bold text-orange-600 hover:underline ml-1"
                >
                  Edit Profile
                </button>
              </div>
              <p className="text-xs text-stone-500 mt-0.5">
                {currentUser?.department || 'Engineering'} • Roll No: <strong className="text-slate-800 font-mono">{currentUser?.rollNo || 'N/A'}</strong>
              </p>
              <p className="text-[11px] text-stone-400 mt-0.5">
                Hi-Tech Institute of Engineering • {currentUser?.email}
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-2.5 self-stretch sm:self-auto justify-end">
            <button
              onClick={() => setCurrentView('report-lost')}
              className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Report Lost</span>
            </button>
            <button
              onClick={() => setCurrentView('report-found')}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Report Found</span>
            </button>
            <button
              onClick={() => setCurrentView('campus-issues')}
              className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Wrench className="w-3.5 h-3.5" />
              <span>Report Issue</span>
            </button>
            <button
              onClick={() => setShowAIAssistantModal(true)}
              className="px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-slate-800 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5 border border-stone-200"
            >
              <Bot className="w-3.5 h-3.5 text-indigo-600" />
              <span>Campus AI</span>
            </button>
          </div>

        </div>

        {/* Unread Alert Card */}
        {unreadNotifs.length > 0 && (
          <div className="mt-6 p-3.5 bg-orange-50/70 border border-orange-200/80 rounded-2xl flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5 text-orange-900 font-medium">
              <Bell className="w-4 h-4 text-orange-600 shrink-0" />
              <span>You have <strong>{unreadNotifs.length} unread campus notifications</strong> (matches, claim updates, or maintenance notes).</span>
            </div>
            <span className="text-[11px] font-bold text-orange-700 underline cursor-pointer" onClick={() => setActiveTab('matches')}>
              Review Alerts →
            </span>
          </div>
        )}

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-6 pt-6 border-t border-stone-100 text-xs">
          <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
            <span className="text-stone-500 font-medium block mb-1">My Lost Reports</span>
            <span className="text-xl font-extrabold text-slate-900 font-mono">{myLostItems.length}</span>
          </div>
          <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
            <span className="text-stone-500 font-medium block mb-1">Suggested Matches</span>
            <span className="text-xl font-extrabold text-orange-600 font-mono">{suggestedMatchesList.length}</span>
          </div>
          <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
            <span className="text-stone-500 font-medium block mb-1">Items Found by Me</span>
            <span className="text-xl font-extrabold text-emerald-600 font-mono">{myFoundItems.length}</span>
          </div>
          <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
            <span className="text-stone-500 font-medium block mb-1">Submitted Claims</span>
            <span className="text-xl font-extrabold text-amber-600 font-mono">{myClaims.length}</span>
          </div>
          <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
            <span className="text-stone-500 font-medium block mb-1">Facility Issues</span>
            <span className="text-xl font-extrabold text-indigo-600 font-mono">{myIssues.length}</span>
          </div>
        </div>

      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-stone-200">
        <div className="flex items-center gap-6 text-xs font-bold overflow-x-auto">
          <button
            onClick={() => setActiveTab('lost')}
            className={`py-3 relative transition-colors whitespace-nowrap ${
              activeTab === 'lost' ? 'text-rose-600 border-b-2 border-rose-600' : 'text-stone-500 hover:text-slate-900'
            }`}
          >
            My Lost Items ({myLostItems.length})
          </button>
          <button
            onClick={() => setActiveTab('matches')}
            className={`py-3 relative transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'matches' ? 'text-orange-600 border-b-2 border-orange-600' : 'text-stone-500 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Suggested Matches ({suggestedMatchesList.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('claims')}
            className={`py-3 relative transition-colors whitespace-nowrap ${
              activeTab === 'claims' ? 'text-amber-600 border-b-2 border-amber-600' : 'text-stone-500 hover:text-slate-900'
            }`}
          >
            My Claims ({myClaims.length})
          </button>
          <button
            onClick={() => setActiveTab('found')}
            className={`py-3 relative transition-colors whitespace-nowrap ${
              activeTab === 'found' ? 'text-emerald-600 border-b-2 border-emerald-600' : 'text-stone-500 hover:text-slate-900'
            }`}
          >
            Items Found by Me ({myFoundItems.length})
          </button>
          <button
            onClick={() => setActiveTab('issues')}
            className={`py-3 relative transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'issues' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-stone-500 hover:text-slate-900'
            }`}
          >
            <Wrench className="w-3.5 h-3.5" />
            <span>Facility Reports ({myIssues.length})</span>
          </button>
        </div>
      </div>

      {/* Tab 1: My Lost Reports */}
      {activeTab === 'lost' && (
        <div className="space-y-4">
          {myLostItems.length === 0 ? (
            <div className="bg-white rounded-3xl border border-stone-200 p-10 text-center space-y-3">
              <Package className="w-12 h-12 text-stone-300 mx-auto" />
              <h3 className="font-bold text-slate-800 text-sm">No Lost Items Reported Yet</h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                Misplaced an item on campus? Report it now to trigger automated matching and notify security desks.
              </p>
              <button
                onClick={() => setCurrentView('report-lost')}
                className="px-4 py-2 bg-rose-600 text-white font-bold text-xs rounded-xl shadow-xs"
              >
                Report Lost Item
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myLostItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs flex flex-col justify-between space-y-4"
                >
                  <div className="flex items-start gap-4">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-16 h-16 rounded-xl object-cover border border-stone-200 shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="text-[10px] font-mono font-bold text-stone-400">{item.id}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                          item.status === 'recovered' 
                            ? 'bg-indigo-100 text-indigo-800' 
                            : 'bg-rose-100 text-rose-800'
                        }`}>
                          {item.status}
                        </span>
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm truncate">{item.title}</h4>
                      <p className="text-[11px] text-stone-500 line-clamp-1">{item.description}</p>
                      <div className="text-[11px] text-stone-400 mt-1 flex items-center gap-2">
                        <span>📍 {item.location}</span>
                        <span>•</span>
                        <span>{item.date}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                    <button
                      onClick={() => setActiveItemDetails(item)}
                      className="text-slate-700 hover:text-slate-900 font-semibold flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View</span>
                    </button>

                    <div className="flex items-center gap-2">
                      {item.status !== 'recovered' && (
                        <button
                          onClick={() => updateItemStatus(item.id, 'recovered')}
                          className="px-2.5 py-1 text-[11px] font-bold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-md border border-emerald-200 transition-colors flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Mark Recovered</span>
                        </button>
                      )}
                      <button
                        onClick={() => deleteItem(item.id)}
                        className="p-1.5 text-stone-400 hover:text-rose-600 rounded transition-colors"
                        title="Withdraw Report"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Suggested Matches (Feature 1: Smart Match Engine) */}
      {activeTab === 'matches' && (
        <div className="space-y-4">
          <div className="p-4 bg-orange-50/70 border border-orange-200 rounded-2xl text-xs text-orange-950 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-sm text-slate-900 mb-0.5">
                Smart Match Engine — Investigative Leads
              </div>
              <p className="text-stone-700 leading-relaxed text-[11px]">
                Potential matches are calculated based on category, color, keywords, campus location, and report dates. 
                Matches are investigative leads, not verified ownership proofs. Please inspect custody details before filing a claim.
              </p>
            </div>
          </div>

          {suggestedMatchesList.length === 0 ? (
            <div className="bg-white rounded-3xl border border-stone-200 p-10 text-center space-y-3">
              <Sparkles className="w-12 h-12 text-stone-300 mx-auto" />
              <h3 className="font-bold text-slate-800 text-sm">No Strong Matches Identified Yet</h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                When found items matching your lost reports are registered at security counters, they will automatically appear here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {suggestedMatchesList.map((match, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-orange-300 transition-colors"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-stone-400">
                        Lead for: <strong className="text-slate-800">{match.lostItem.title}</strong>
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-orange-100 text-orange-800 border border-orange-300">
                        {match.score}% Similarity Match
                      </span>
                    </div>

                    <div className="flex items-start gap-3">
                      <img
                        src={match.candidateItem.image}
                        alt={match.candidateItem.title}
                        className="w-16 h-16 rounded-xl object-cover border border-stone-200 shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <span className="font-mono text-[10px] font-bold text-slate-400 block mb-0.5">
                          {match.candidateItem.id} • Found Item
                        </span>
                        <h4 className="font-bold text-slate-900 text-sm truncate">{match.candidateItem.title}</h4>
                        <div className="text-[11px] text-stone-500 mt-0.5">
                          Custody: <strong>{match.candidateItem.custodyLocation || match.candidateItem.location}</strong>
                        </div>
                      </div>
                    </div>

                    {/* Match Explanation Bullet Points */}
                    <div className="p-3 bg-stone-50 rounded-xl border border-stone-100 space-y-1 text-xs">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                        Why this was suggested:
                      </span>
                      {match.reasons.map((r, rIdx) => (
                        <div key={rIdx} className="text-[11px] text-stone-600 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-orange-600 shrink-0" />
                          <span>{r}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                    <button
                      onClick={() => setActiveItemDetails(match.candidateItem)}
                      className="text-slate-700 hover:text-slate-900 font-semibold flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Inspect Details</span>
                    </button>

                    <button
                      onClick={() => setActiveClaimItem(match.candidateItem)}
                      className="px-3.5 py-1.5 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1"
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Claim This Item</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Submitted Claims */}
      {activeTab === 'claims' && (
        <div className="space-y-4">
          {myClaims.length === 0 ? (
            <div className="bg-white rounded-3xl border border-stone-200 p-10 text-center space-y-3">
              <ShieldCheck className="w-12 h-12 text-stone-300 mx-auto" />
              <h3 className="font-bold text-slate-800 text-sm">No Claims Submitted</h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                Browse found items in the directory to find and claim possessions that match what you lost.
              </p>
              <button
                onClick={() => setCurrentView('browse')}
                className="px-4 py-2 bg-orange-600 text-white font-bold text-xs rounded-xl shadow-xs"
              >
                Browse Found Items
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {myClaims.map((claim) => (
                <div
                  key={claim.id}
                  className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs font-bold text-slate-900 bg-stone-100 px-2 py-0.5 rounded">
                        {claim.id}
                      </span>
                      <h4 className="font-bold text-slate-900 text-sm">{claim.itemTitle}</h4>
                    </div>
                    <div>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        claim.status === 'approved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : claim.status === 'rejected'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {claim.status === 'pending' ? 'Security Review In Progress' : claim.status}
                      </span>
                    </div>
                  </div>

                  <div className="p-3 bg-stone-50 rounded-xl text-xs space-y-1.5 border border-stone-100">
                    <div className="text-stone-500">
                      <strong>Submitted Proof: </strong>
                      <span className="text-stone-700">{claim.proofDescription}</span>
                    </div>
                    {claim.adminNotes && (
                      <div className="text-stone-500">
                        <strong>Admin Notes: </strong>
                        <span className="text-slate-800 font-medium">{claim.adminNotes}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-stone-400 pt-1">
                    <span>Submitted on: {claim.submittedAt}</span>
                    <span className="font-medium text-slate-700">Custody Desk: Main Gate 1</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Found Items */}
      {activeTab === 'found' && (
        <div className="space-y-4">
          {myFoundItems.length === 0 ? (
            <div className="bg-white rounded-3xl border border-stone-200 p-10 text-center space-y-3">
              <Package className="w-12 h-12 text-stone-300 mx-auto" />
              <h3 className="font-bold text-slate-800 text-sm">No Found Items Registered Yet</h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                Found someone's ID card, keys, or accessories on campus? Report it to help reunite them.
              </p>
              <button
                onClick={() => setCurrentView('report-found')}
                className="px-4 py-2 bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-xs"
              >
                Report Found Item
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myFoundItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs flex flex-col justify-between space-y-4"
                >
                  <div className="flex items-start gap-4">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-16 h-16 rounded-xl object-cover border border-stone-200 shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="text-[10px] font-mono font-bold text-stone-400">{item.id}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider bg-emerald-100 text-emerald-800">
                          {item.status}
                        </span>
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm truncate">{item.title}</h4>
                      <p className="text-[11px] text-stone-500 line-clamp-1">{item.description}</p>
                      <div className="text-[11px] text-stone-400 mt-1 flex items-center gap-2">
                        <span>Custody: {item.custodyLocation}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                    <button
                      onClick={() => setActiveItemDetails(item)}
                      className="text-slate-700 hover:text-slate-900 font-semibold flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Details</span>
                    </button>
                    <button
                      onClick={() => deleteItem(item.id)}
                      className="p-1.5 text-stone-400 hover:text-rose-600 rounded transition-colors"
                      title="Withdraw"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 5: My Campus Facility Reports */}
      {activeTab === 'issues' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">My Reported Infrastructure & Facility Issues</h3>
              <p className="text-xs text-stone-500">Track resolution progress and remarks from college technicians.</p>
            </div>
            <button
              onClick={() => setCurrentView('campus-issues')}
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Report New Issue</span>
            </button>
          </div>

          {myIssues.length === 0 ? (
            <div className="bg-white rounded-3xl border border-stone-200 p-10 text-center space-y-3">
              <Wrench className="w-12 h-12 text-stone-300 mx-auto" />
              <h3 className="font-bold text-slate-800 text-sm">No Campus Issues Reported</h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                Notice a broken projector, flickering light, or Wi-Fi problem on campus? File a quick report to notify estate technicians.
              </p>
              <button
                onClick={() => setCurrentView('campus-issues')}
                className="px-4 py-2 bg-indigo-600 text-white font-bold text-xs rounded-xl shadow-xs"
              >
                File Maintenance Report
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {myIssues.map((issue) => (
                <div
                  key={issue.id}
                  className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs font-bold text-slate-900 bg-stone-100 px-2.5 py-0.5 rounded">
                        {issue.id}
                      </span>
                      <span className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                        {issue.category}
                      </span>
                      <h4 className="font-bold text-slate-900 text-sm">{issue.title}</h4>
                    </div>

                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      issue.status === 'resolved'
                        ? 'bg-emerald-100 text-emerald-800'
                        : issue.status === 'in_progress'
                        ? 'bg-blue-100 text-blue-800'
                        : issue.status === 'under_review'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-stone-100 text-stone-700'
                    }`}>
                      {issue.status.replace('_', ' ')}
                    </span>
                  </div>

                  <p className="text-xs text-stone-600 leading-relaxed">
                    {issue.description}
                  </p>

                  {issue.resolutionNotes && (
                    <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl text-xs space-y-1">
                      <div className="font-bold text-amber-900 text-[11px] flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
                        <span>Technician Update:</span>
                      </div>
                      <p className="text-stone-700 text-[11px]">{issue.resolutionNotes}</p>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-[11px] text-stone-400 pt-1">
                    <span>📍 {issue.location}</span>
                    <span>Reported: {issue.createdAt ? new Date(issue.createdAt).toLocaleDateString() : 'Recent'}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
};
