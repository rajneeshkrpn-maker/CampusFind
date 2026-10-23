import React from 'react';
import { 
  Vote, 
  X, 
  Sparkles, 
  Calendar, 
  ShieldCheck, 
  Users, 
  CheckCircle2 
} from 'lucide-react';

export const CollegeElectionModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-stone-200">
        
        {/* Banner */}
        <div className="relative bg-gradient-to-br from-indigo-900 via-slate-900 to-amber-900 text-white p-7 text-center">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 text-stone-300 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-14 h-14 rounded-2xl bg-amber-400/20 border border-amber-400/40 text-amber-300 flex items-center justify-center mx-auto mb-3 shadow-inner">
            <Vote className="w-7 h-7" />
          </div>

          <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-amber-400 text-slate-950 inline-block mb-2">
            Roadmap Preview
          </span>

          <h3 className="text-2xl font-black tracking-tight">
            College Election — Coming Soon
          </h3>

          <p className="text-xs text-stone-300 mt-2 max-w-sm mx-auto leading-relaxed">
            The Student Council digital governance and verified ballot system is scheduled for release in the upcoming semester.
          </p>
        </div>

        {/* Planned Features List */}
        <div className="p-6 space-y-4">
          <div className="text-xs font-bold text-slate-800 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>Planned Election Hub Features (Semester 6 Release):</span>
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-stone-50 rounded-xl border border-stone-200">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div className="text-xs">
                <span className="font-bold text-slate-900 block">Verified Student Voter Roll</span>
                <span className="text-stone-500 text-[11px]">
                  Cryptographically verified student ID eligibility to prevent duplicate or proxy ballots.
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-stone-50 rounded-xl border border-stone-200">
              <Users className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div className="text-xs">
                <span className="font-bold text-slate-900 block">Candidate Manifesto Portal</span>
                <span className="text-stone-500 text-[11px]">
                  Official department representative profiles, campaign agendas, and Q&A boards.
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-stone-50 rounded-xl border border-stone-200">
              <Calendar className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
              <div className="text-xs">
                <span className="font-bold text-slate-900 block">Tamper-Evident Election Auditing</span>
                <span className="text-stone-500 text-[11px]">
                  Real-time turn-out telemetry monitored under proctorial board oversight.
                </span>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={onClose}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4 text-amber-400" />
              <span>Got it, back to CampusFind</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
