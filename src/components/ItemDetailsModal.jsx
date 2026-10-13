import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  MapPin, 
  Calendar, 
  ShieldCheck, 
  User, 
  HelpCircle 
} from 'lucide-react';

export const ItemDetailsModal = () => {
  const { 
    activeItemDetails, 
    setActiveItemDetails, 
    setActiveClaimItem,
    addToast 
  } = useApp();

  const [sightingText, setSightingText] = useState('');
  const [sightingSubmitted, setSightingSubmitted] = useState(false);

  if (!activeItemDetails) return null;

  const item = activeItemDetails;

  const handleSightingSubmit = (e) => {
    e.preventDefault();
    if (sightingText.trim()) {
      setSightingSubmitted(true);
      addToast('Thank you! Sighting report forwarded to Campus Security Desk.', 'success');
      setTimeout(() => {
        setSightingSubmitted(false);
        setSightingText('');
      }, 3000);
    }
  };

  const copyRefId = () => {
    navigator.clipboard?.writeText(item.id);
    addToast(`Reference ID ${item.id} copied to clipboard!`, 'info');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl border border-stone-200 my-8">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-stone-50/50">
          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
              item.type === 'lost' 
                ? 'bg-rose-100 text-rose-800' 
                : 'bg-emerald-100 text-emerald-800'
            }`}>
              {item.type === 'lost' ? 'Lost Report' : 'Found Report'}
            </span>
            <button
              onClick={copyRefId}
              className="text-xs font-mono font-bold text-stone-500 bg-white px-2 py-0.5 rounded border border-stone-200 hover:text-slate-800"
              title="Click to copy ID"
            >
              {item.id}
            </button>
          </div>
          <button
            onClick={() => setActiveItemDetails(null)}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[80vh] overflow-y-auto space-y-6">
          
          {/* Main Visual & Title */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-6">
            <div className="sm:col-span-6 rounded-xl overflow-hidden bg-stone-100 border border-stone-200 relative aspect-square sm:aspect-auto">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-2 left-2 right-2 bg-black/50 backdrop-blur-xs px-2.5 py-1 rounded text-white text-[11px] font-medium flex items-center justify-between">
                <span>Category: {item.category}</span>
                <span>{item.date}</span>
              </div>
            </div>

            <div className="sm:col-span-6 flex flex-col justify-between space-y-4">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900 tracking-tight leading-snug mb-2">
                  {item.title}
                </h2>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-4">
                  {item.description}
                </p>

                {/* Specific identifying hint */}
                {item.identifyingMarks && (
                  <div className="p-3 rounded-lg bg-amber-50/70 border border-amber-200/80 text-xs text-amber-900">
                    <span className="font-bold flex items-center gap-1 mb-0.5">
                      <HelpCircle className="w-3.5 h-3.5 text-amber-700" />
                      Identifying Characteristic:
                    </span>
                    <span className="text-stone-700">{item.identifyingMarks}</span>
                  </div>
                )}
              </div>

              {/* Status & Custody */}
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-stone-500 font-medium">Status</span>
                  <span className="font-bold uppercase text-slate-800">{item.status}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-stone-500 font-medium">Current Custody</span>
                  <span className="font-semibold text-slate-800 text-right">{item.custodyLocation || 'N/A'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Details Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-stone-50 border border-stone-200 text-xs">
            <div>
              <div className="text-stone-400 mb-0.5 flex items-center gap-1 font-medium">
                <MapPin className="w-3.5 h-3.5 text-orange-600" /> Location
              </div>
              <div className="font-semibold text-slate-800">{item.location}</div>
            </div>
            <div>
              <div className="text-stone-400 mb-0.5 flex items-center gap-1 font-medium">
                <Calendar className="w-3.5 h-3.5 text-blue-600" /> Date Reported
              </div>
              <div className="font-semibold text-slate-800">{item.date}</div>
            </div>
            <div>
              <div className="text-stone-400 mb-0.5 flex items-center gap-1 font-medium">
                <User className="w-3.5 h-3.5 text-emerald-600" /> Reported By
              </div>
              <div className="font-semibold text-slate-800">{item.reporterRole}</div>
            </div>
          </div>

          {/* Verification Challenge Notice */}
          {item.verificationQuestion && (
            <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-900 flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Ownership Verification Required:</span>
                <p className="mt-0.5 text-blue-800">
                  To prevent fraudulent claims, the finder/proctor has recorded a security challenge: 
                  <em className="font-semibold"> "{item.verificationQuestion}"</em>
                </p>
              </div>
            </div>
          )}

          {/* Action Section */}
          {item.type === 'found' ? (
            <div className="pt-2 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-xs text-stone-500">
                Are you the rightful owner of this item? Submit a verified claim.
              </div>
              <button
                onClick={() => {
                  setActiveItemDetails(null);
                  setActiveClaimItem(item);
                }}
                className="w-full sm:w-auto px-6 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Claim This Item</span>
              </button>
            </div>
          ) : (
            <div className="pt-2 border-t border-stone-200 space-y-3">
              <div className="text-xs font-bold text-slate-800">
                Have you seen this lost item or found something similar?
              </div>
              <form onSubmit={handleSightingSubmit} className="flex gap-2">
                <input
                  type="text"
                  value={sightingText}
                  onChange={(e) => setSightingText(e.target.value)}
                  placeholder="e.g., 'Saw this on 3rd floor library rack at 2 PM'..."
                  className="flex-1 px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-blue-500"
                />
                <button
                  type="submit"
                  disabled={sightingSubmitted || !sightingText.trim()}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-semibold text-xs rounded-lg transition-colors whitespace-nowrap"
                >
                  {sightingSubmitted ? 'Reported!' : 'Submit Sighting'}
                </button>
              </form>
            </div>
          )}

        </div>

        {/* Footer info notice */}
        <div className="px-6 py-3 bg-stone-100/70 border-t border-stone-200 text-[11px] text-stone-500 flex items-center justify-between">
          <span>Protected under Hi-Tech Institute Campus Privacy Guidelines</span>
          <span className="font-mono">Desk: Gate 1 & Central Library</span>
        </div>

      </div>
    </div>
  );
};
