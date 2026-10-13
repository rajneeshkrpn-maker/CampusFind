import React from 'react';
import { useApp } from '../context/AppContext';
import { CAMPUS_SECURITY_HUBS } from '../data/mockData';
import { X, MapPin, Clock, Phone, Shield, Building2, UserCheck } from 'lucide-react';

export const CampusMapModal = () => {
  const { showSecurityHubsModal, setShowSecurityHubsModal } = useApp();

  if (!showSecurityHubsModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl border border-stone-200 my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-stone-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Campus Recovery Desks & Hubs</h3>
              <p className="text-[11px] text-stone-500">Hi-Tech Institute of Engineering, Ghaziabad</p>
            </div>
          </div>
          <button
            onClick={() => setShowSecurityHubsModal(false)}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          <p className="text-xs text-slate-600 leading-relaxed">
            All physically handed-over lost items on campus are registered into CampusFind and stored at designated custody desks until claimed. Visit any desk below with your student ID card:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {CAMPUS_SECURITY_HUBS.map((hub, idx) => (
              <div 
                key={idx}
                className="p-4 rounded-xl border border-stone-200 bg-stone-50/60 hover:bg-white hover:border-orange-300 transition-all shadow-xs"
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <Building2 className="w-4 h-4 text-orange-600 shrink-0" />
                  <h4 className="font-bold text-xs sm:text-sm text-slate-900">{hub.name}</h4>
                </div>
                <div className="space-y-1 text-[11px] text-stone-600">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3 h-3 text-stone-400 shrink-0" />
                    <span>{hub.location}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3 h-3 text-stone-400 shrink-0" />
                    <span>{hub.hours}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <UserCheck className="w-3 h-3 text-stone-400 shrink-0" />
                    <span className="font-medium text-slate-700">{hub.officer}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-blue-600 font-semibold pt-1">
                    <Phone className="w-3 h-3 shrink-0" />
                    <span>Intercom: {hub.phone}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3.5 rounded-xl bg-orange-50/70 border border-orange-200 text-xs text-orange-950 flex items-start gap-2.5">
            <Shield className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Lost High-Value Items (Laptops, Wallets, Jewellery)?</span>
              <p className="mt-0.5 text-stone-700 leading-relaxed">
                Directly report to Proctor Office (Admin Block, Room 12). Unclaimed items are securely logged in the Central Campus Safe.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-stone-50 border-t border-stone-200 text-right">
          <button
            onClick={() => setShowSecurityHubsModal(false)}
            className="px-4 py-1.5 text-xs font-bold bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
