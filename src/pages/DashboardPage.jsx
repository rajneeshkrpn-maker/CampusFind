import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Package, 
  ShieldCheck, 
  Trash2, 
  CheckCircle2, 
  Eye, 
  Plus 
} from 'lucide-react';

export const DashboardPage = () => {
  const { 
    currentUser, 
    items, 
    claims, 
    updateItemStatus, 
    deleteItem, 
    setActiveItemDetails,
    setCurrentView
  } = useApp();

  const [activeTab, setActiveTab] = useState('lost'); // 'lost' | 'found' | 'claims'

  // User's items
  const myLostItems = items.filter(
    (i) => i.type === 'lost' && (i.reporterName === currentUser?.name || i.reporterRoll === currentUser?.rollNo || i.id === 'CF-LST-101' || i.id === 'CF-LST-104')
  );

  const myFoundItems = items.filter(
    (i) => i.type === 'found' && (i.reporterName === currentUser?.name || i.reporterRoll === currentUser?.rollNo)
  );

  const myClaims = claims.filter(
    (c) => c.claimantName === currentUser?.name || c.claimantRoll === currentUser?.rollNo || c.id === 'CLM-8821'
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      
      {/* Profile Header Banner */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={currentUser?.avatar || '/zaid-saifee.png'}
                alt={currentUser?.name || 'Zaid Saifee'}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-orange-500 shadow-md ring-4 ring-orange-50"
              />
              <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-white text-[9px] font-bold">
                ✓
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                  {currentUser?.name || 'Zaid Saifee'}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-orange-100 text-orange-800">
                  Student Verified
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-0.5">
                {currentUser?.department || 'Computer Science & Engineering'} • Roll No: <strong className="text-slate-800 font-mono">{currentUser?.rollNo || '220132010045'}</strong>
              </p>
              <p className="text-[11px] text-stone-400 mt-0.5">
                Hi-Tech Institute of Engineering, Ghaziabad • {currentUser?.email || 'zaid.saifee@hitech.ac.in'}
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-2.5 self-stretch sm:self-auto justify-end">
            <button
              onClick={() => setCurrentView('report-lost')}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Report Lost</span>
            </button>
            <button
              onClick={() => setCurrentView('report-found')}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Report Found</span>
            </button>
            <button
              onClick={() => setCurrentView('admin')}
              className="px-3.5 py-2 border border-stone-200 hover:bg-stone-50 text-slate-700 font-semibold text-xs rounded-xl transition-colors flex items-center gap-1.5"
              title="View Security Guard Desks & Custody Inventory"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-stone-400" />
              <span>Security Guard Desk</span>
            </button>
          </div>

        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-6 pt-6 border-t border-stone-100 text-xs">
          <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
            <span className="text-stone-500 font-medium block mb-1">My Lost Reports</span>
            <span className="text-xl font-extrabold text-slate-900 font-mono">{myLostItems.length}</span>
          </div>
          <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
            <span className="text-stone-500 font-medium block mb-1">Items Found by Me</span>
            <span className="text-xl font-extrabold text-emerald-600 font-mono">{myFoundItems.length}</span>
          </div>
          <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
            <span className="text-stone-500 font-medium block mb-1">Submitted Claims</span>
            <span className="text-xl font-extrabold text-orange-600 font-mono">{myClaims.length}</span>
          </div>
          <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
            <span className="text-stone-500 font-medium block mb-1">Recovered Possessions</span>
            <span className="text-xl font-extrabold text-blue-600 font-mono">
              {myLostItems.filter(i => i.status === 'recovered').length}
            </span>
          </div>
        </div>

      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-stone-200">
        <div className="flex items-center gap-6 text-xs font-bold">
          <button
            onClick={() => setActiveTab('lost')}
            className={`py-3 relative transition-colors ${
              activeTab === 'lost' ? 'text-rose-600 border-b-2 border-rose-600' : 'text-stone-500 hover:text-slate-900'
            }`}
          >
            My Lost Items ({myLostItems.length})
          </button>
          <button
            onClick={() => setActiveTab('found')}
            className={`py-3 relative transition-colors ${
              activeTab === 'found' ? 'text-emerald-600 border-b-2 border-emerald-600' : 'text-stone-500 hover:text-slate-900'
            }`}
          >
            My Found Items ({myFoundItems.length})
          </button>
          <button
            onClick={() => setActiveTab('claims')}
            className={`py-3 relative transition-colors ${
              activeTab === 'claims' ? 'text-orange-600 border-b-2 border-orange-600' : 'text-stone-500 hover:text-slate-900'
            }`}
          >
            Submitted Claims ({myClaims.length})
          </button>
        </div>
      </div>

      {/* Tab 1: My Lost Reports */}
      {activeTab === 'lost' && (
        <div className="space-y-4">
          {myLostItems.length === 0 ? (
            <div className="bg-white rounded-2xl border border-stone-200 p-10 text-center space-y-3">
              <Package className="w-12 h-12 text-stone-300 mx-auto" />
              <h3 className="font-bold text-slate-800 text-sm">No Lost Items Reported Yet</h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                If you have misplaced an item on campus, report it now to notify security desks and student finders.
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
                  className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs flex flex-col justify-between space-y-4"
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

      {/* Tab 2: My Found Items */}
      {activeTab === 'found' && (
        <div className="space-y-4">
          {myFoundItems.length === 0 ? (
            <div className="bg-white rounded-2xl border border-stone-200 p-10 text-center space-y-3">
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
                  className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs flex flex-col justify-between space-y-4"
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

      {/* Tab 3: Submitted Claims */}
      {activeTab === 'claims' && (
        <div className="space-y-4">
          {myClaims.length === 0 ? (
            <div className="bg-white rounded-2xl border border-stone-200 p-10 text-center space-y-3">
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
                  className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs space-y-3"
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

                  <div className="p-3 bg-stone-50 rounded-lg text-xs space-y-1.5 border border-stone-100">
                    <div className="text-stone-500">
                      <strong>Submitted Proof: </strong>
                      <span className="text-stone-700">{claim.proofDescription}</span>
                    </div>
                    <div className="text-stone-500">
                      <strong>Admin Notes: </strong>
                      <span className="text-slate-800 font-medium">{claim.adminNotes}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-stone-400 pt-1">
                    <span>Submitted on: {claim.submittedAt}</span>
                    <span className="font-medium text-slate-700">Verification Desk: Admin Block Gate 1</span>
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
