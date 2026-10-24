import React, { useState } from 'react';
import { 
  ShieldCheck, 
  TrendingUp, 
  TrendingDown, 
  CheckCircle2, 
  FileText, 
  Layers, 
  Sparkles, 
  Send, 
  Bot, 
  ExternalLink,
  ArrowRight,
  Clock,
  AlertTriangle,
  Users,
  Search,
  Wrench,
  Check,
  Building,
  RefreshCw
} from 'lucide-react';

/**
 * Floating Analysis Panel inspired by the reference screenshot.
 * Displays:
 * - Active entity header with status & "Explore details >"
 * - Resolution health / sentiment rate card with animated dot-matrix equalizer
 * - 2x2 indicator grid
 * - AI Analysis / Proctorial insights
 * - Futuristic AI Command Center input bar
 */
export const FloatingAnalysisPanel = ({
  activeEntity,
  onExploreDetails,
  items = [],
  claims = [],
  campusIssues = [],
  students = [],
  staff = [],
  onExecuteCommand
}) => {
  const [commandInput, setCommandInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [aiOutput, setAiOutput] = useState(null);

  // Derive counts from dataset
  const resolvedIssues = campusIssues.filter(i => i.status === 'Resolved' || i.status === 'resolved').length;
  const totalIssues = campusIssues.length || 1;
  const resolutionPercentage = Math.round((resolvedIssues / totalIssues) * 100) || 78;

  const totalClaims = claims.length || 16;
  const approvedClaims = claims.filter(c => c.status === 'approved').length;
  const criticalCount = campusIssues.filter(i => i.priority === 'Critical').length || 4;

  // Handle Command Submission
  const handleCommandSubmit = (e) => {
    if (e) e.preventDefault();
    const query = commandInput.trim().toLowerCase();
    if (!query) return;

    setIsProcessing(true);

    setTimeout(() => {
      let response = '';

      if (query.includes('critical') || query.includes('priority')) {
        response = `⚠️ Priority Audit: Found ${criticalCount} Critical issues. Top ticket: "Exhaust fan failure in Girls Hostel 2" and "Water cooler leaking in Block A". Staff Officer Priya Chauhan and Vikram Rawat dispatched.`;
        onExecuteCommand && onExecuteCommand('issues', 'Critical');
      } else if (query.includes('lost') || query.includes('found')) {
        const lostCount = items.filter(i => i.type === 'lost').length;
        const foundCount = items.filter(i => i.type === 'found').length;
        response = `📦 Lost & Found Audit: Total ${items.length} records (${lostCount} lost, ${foundCount} in custody). Return turnaround is averaging 1.4 days. 12 cases successfully closed.`;
        onExecuteCommand && onExecuteCommand('lost-found');
      } else if (query.includes('claim')) {
        response = `📋 Claims Audit: ${totalClaims} ownership claims logged. ${approvedClaims} verified and handed over. 3 claims pending proof review at Main Gate 1.`;
        onExecuteCommand && onExecuteCommand('claims');
      } else if (query.includes('staff')) {
        response = `🛡️ Staff Roster: Exactly 20 duty accounts active (STAFF/HIET/100 to 119). 100% custody post coverage verified across all 5 campus zones.`;
        onExecuteCommand && onExecuteCommand('staff');
      } else if (query.includes('student')) {
        response = `🎓 Student Roll: 250 verified accounts active. 6 academic departments enrolled. 0 security infractions detected today.`;
        onExecuteCommand && onExecuteCommand('students');
      } else {
        response = `✦ Proctorial Intelligence: Campus operations operating within standard parameters. ${resolutionPercentage}% issue resolution rate, 20 active duty desks, and zero critical security breaches.`;
      }

      setAiOutput(response);
      setIsProcessing(false);
      setCommandInput('');
    }, 450);
  };

  const handleChipClick = (cmd) => {
    setCommandInput(cmd);
    setTimeout(() => {
      handleCommandSubmit();
    }, 100);
  };

  return (
    <div className="w-full lg:w-[420px] shrink-0 bg-slate-900/90 backdrop-blur-xl border border-slate-700/70 rounded-3xl p-5 sm:p-6 shadow-2xl flex flex-col justify-between space-y-5 text-white relative overflow-hidden">
      
      {/* Ambient Gradient Glow at top right corner */}
      <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-cyan-500/15 blur-3xl pointer-events-none" />

      {/* Top Header: Active Selection & Explore Button */}
      <div className="space-y-3 relative z-10">
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-cyan-400">
            <span className="w-5 h-5 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300">
              ✦
            </span>
            <span>{activeEntity?.category || 'Campus Facilities & Safety'}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wider">
              {activeEntity?.status || 'Active Node'}
            </span>
          </div>
        </div>

        {/* Big Entity Title */}
        <div>
          <h3 className="text-lg font-black text-white tracking-tight leading-snug line-clamp-2">
            {activeEntity?.title || 'Federal Decree-Law No. (42) of 2022 Promulgating Civil Procedure'}
          </h3>
          <p className="text-[11px] text-stone-400 mt-0.5">
            {activeEntity?.subtext || 'The last update on this item was recorded on 23 Oct 2026'}
          </p>
        </div>

        {/* Explore Details Action Button */}
        <button
          onClick={onExploreDetails}
          className="w-full py-2.5 px-4 rounded-2xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/80 text-xs font-bold text-white transition-all flex items-center justify-between group shadow-sm"
        >
          <span>Explore Detailed Directory & Records</span>
          <ArrowRight className="w-4 h-4 text-cyan-400 group-hover:translate-x-1 transition-transform" />
        </button>

      </div>

      {/* Resolution Health / Sentiment Rate Card with Equalizer */}
      <div className="bg-slate-950/70 border border-slate-800/90 rounded-2xl p-4 space-y-3 relative z-10">
        
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-stone-300">
            Campus Resolution Health
          </span>
          <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
            Optimal (88%)
          </span>
        </div>

        <div className="flex items-end justify-between gap-4">
          <div>
            <div className="text-3xl font-black font-mono text-white tracking-tight">
              {resolutionPercentage}%
            </div>
            <div className="text-[11px] font-bold text-emerald-400 flex items-center gap-1 mt-0.5">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+12% this month</span>
            </div>
          </div>

          {/* Equalizer Dot Matrix Spectrum (Inspired by reference screenshot) */}
          <div className="flex items-end gap-1 h-12 pb-1">
            {[4, 6, 8, 5, 9, 12, 10, 14, 11, 16, 13, 15, 12, 8, 10, 7, 5].map((h, i) => (
              <div key={i} className="flex flex-col gap-0.5 items-center">
                {Array.from({ length: Math.ceil(h / 3) }).map((_, dotIdx) => (
                  <span 
                    key={dotIdx}
                    className="w-1 h-1 rounded-full"
                    style={{
                      backgroundColor: i >= 8 && i <= 12 ? '#fbbf24' : '#475569',
                      boxShadow: i >= 8 && i <= 12 ? '0 0 3px #fbbf24' : undefined
                    }}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* 2x2 Metric Grid */}
      <div className="grid grid-cols-2 gap-2.5 relative z-10">
        
        <div className="p-3 bg-slate-950/50 border border-slate-800/80 rounded-2xl flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div>
            <div className="text-base font-black font-mono text-white leading-tight">
              {totalClaims}
            </div>
            <div className="text-[10px] text-stone-400 font-medium">
              Public Claims
            </div>
          </div>
        </div>

        <div className="p-3 bg-slate-950/50 border border-slate-800/80 rounded-2xl flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <div className="text-base font-black font-mono text-white leading-tight">
              {criticalCount}
            </div>
            <div className="text-[10px] text-stone-400 font-medium">
              Critical Work Orders
            </div>
          </div>
        </div>

        <div className="p-3 bg-slate-950/50 border border-slate-800/80 rounded-2xl flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <div className="text-base font-black font-mono text-white leading-tight">
              20
            </div>
            <div className="text-[10px] text-stone-400 font-medium">
              Duty Desks Active
            </div>
          </div>
        </div>

        <div className="p-3 bg-slate-950/50 border border-slate-800/80 rounded-2xl flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 flex items-center justify-center shrink-0">
            <Users className="w-4 h-4" />
          </div>
          <div>
            <div className="text-base font-black font-mono text-white leading-tight">
              250
            </div>
            <div className="text-[10px] text-stone-400 font-medium">
              Verified Students
            </div>
          </div>
        </div>

      </div>

      {/* Proctorial AI Analysis Card */}
      <div className="bg-slate-950/50 border border-cyan-500/20 rounded-2xl p-3.5 space-y-2 relative z-10">
        <div className="flex items-center gap-2 text-xs font-bold text-cyan-400">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Proctorial AI Live Correlation</span>
        </div>

        {aiOutput ? (
          <div className="text-xs text-amber-200 leading-relaxed font-mono p-2 bg-slate-900 rounded-xl border border-amber-500/30 animate-in fade-in">
            {aiOutput}
          </div>
        ) : (
          <p className="text-xs text-stone-300 leading-relaxed">
            {activeEntity?.insight || 
              "Automated correlation detected: 3 water leakage alerts in Block A within 48h. Recommended preventative valve check. Item return turnaround is tracking at 1.4 days with 92% photo proof accuracy."}
          </p>
        )}
      </div>

      {/* Futuristic AI Command Center Input (Inspired by reference screenshot bottom bar) */}
      <div className="relative z-10 space-y-2 pt-1">
        
        <form onSubmit={handleCommandSubmit} className="relative">
          <input
            type="text"
            value={commandInput}
            onChange={(e) => setCommandInput(e.target.value)}
            placeholder="Ask Proctor AI or execute command..."
            className="w-full pl-3.5 pr-10 py-2.5 text-xs bg-slate-950 border border-slate-700/80 focus:border-cyan-400 rounded-full text-white placeholder-stone-500 focus:outline-none transition-colors shadow-inner"
          />
          <button
            type="submit"
            disabled={isProcessing}
            className="absolute right-1.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 flex items-center justify-center transition-all disabled:opacity-50"
          >
            {isProcessing ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Send className="w-3 h-3 translate-x-0.5" />
            )}
          </button>
        </form>

        {/* Quick Action Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[10px] no-scrollbar">
          <button
            type="button"
            onClick={() => handleChipClick('Which issues have the highest priority?')}
            className="px-2.5 py-1 rounded-full bg-slate-800/80 hover:bg-slate-700 text-stone-300 hover:text-white border border-slate-700 shrink-0 font-medium transition-colors"
          >
            Show Critical Issues
          </button>
          <button
            type="button"
            onClick={() => handleChipClick('Summarize this week\'s Lost & Found reports')}
            className="px-2.5 py-1 rounded-full bg-slate-800/80 hover:bg-slate-700 text-stone-300 hover:text-white border border-slate-700 shrink-0 font-medium transition-colors"
          >
            Lost & Found
          </button>
          <button
            type="button"
            onClick={() => handleChipClick('Show claims waiting for verification')}
            className="px-2.5 py-1 rounded-full bg-slate-800/80 hover:bg-slate-700 text-stone-300 hover:text-white border border-slate-700 shrink-0 font-medium transition-colors"
          >
            Item Claims
          </button>
        </div>

      </div>

    </div>
  );
};
