import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  Search, 
  AlertTriangle, 
  Users, 
  Briefcase, 
  CheckCircle2, 
  Vote, 
  Sparkles, 
  ChevronRight, 
  Layers,
  ArrowUpRight,
  TrendingUp,
  ShieldCheck,
  Building2,
  Clock,
  ExternalLink
} from 'lucide-react';

/**
 * High-Tech Interactive Network Visualization Component
 * Inspired by policy/AI platform node graphs.
 * Features:
 * - Glowing central core orb with aura ripples
 * - Branching primary entity cards (Lost & Found, Campus Issues, Students, Staff, Claims, Elections)
 * - Fanning illuminated bezier splines to leaf nodes
 * - Smooth pan, zoom, reset, hover tooltips, and click-to-focus
 */
export const NeuralNetworkGraph = ({
  activeNodeId,
  onSelectNode,
  activeLeafId,
  onSelectLeaf,
  onOpenDetails,
  items = [],
  claims = [],
  campusIssues = [],
  students = [],
  staff = [],
  zoomLevel = 1,
  panOffset = { x: 0, y: 0 },
  onResetView
}) => {
  const containerRef = useRef(null);
  const [hoveredNode, setHoveredNode] = useState(null);
  const [hoveredLeaf, setHoveredLeaf] = useState(null);
  const [pulsePhase, setPulsePhase] = useState(0);

  // Subtle continuous energy pulse
  useEffect(() => {
    const interval = setInterval(() => {
      setPulsePhase((prev) => (prev + 1) % 100);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // Primary Hub Nodes Configuration
  const primaryNodes = useMemo(() => {
    const lostCount = items.filter(i => i.type === 'lost').length;
    const foundCount = items.filter(i => i.type === 'found').length;
    const criticalIssues = campusIssues.filter(i => i.priority === 'Critical').length;
    const pendingClaims = claims.filter(c => c.status === 'pending').length;
    const activeStaff = staff.filter(s => s.status === 'Active').length;

    return [
      {
        id: 'lost-found',
        title: 'Lost & Found Hub',
        metric: items.length || 34,
        metricLabel: 'Active Reports',
        subtext: `${lostCount} Lost • ${foundCount} In Custody`,
        color: '#06b6d4', // Cyan
        glowColor: 'rgba(6, 182, 212, 0.4)',
        icon: Search,
        y: 110,
        sectionTab: 'lost-found'
      },
      {
        id: 'campus-issues',
        title: 'Campus Issues Desk',
        metric: campusIssues.length || 28,
        metricLabel: 'Work Orders',
        subtext: `${criticalIssues} Critical • ${campusIssues.filter(i => i.status === 'Resolved').length} Resolved`,
        color: '#f59e0b', // Amber/Gold
        glowColor: 'rgba(245, 158, 11, 0.45)',
        icon: AlertTriangle,
        y: 200,
        sectionTab: 'issues'
      },
      {
        id: 'students',
        title: 'Student Registry',
        metric: students.length || 250,
        metricLabel: 'Verified Roll',
        subtext: '6 Academic Departments',
        color: '#8b5cf6', // Violet
        glowColor: 'rgba(139, 92, 246, 0.4)',
        icon: Users,
        y: 290,
        sectionTab: 'students'
      },
      {
        id: 'staff',
        title: 'Staff Officers Roster',
        metric: staff.length || 20,
        metricLabel: 'Duty Desks',
        subtext: `${activeStaff} Active on Campus`,
        color: '#10b981', // Emerald
        glowColor: 'rgba(16, 185, 129, 0.4)',
        icon: Briefcase,
        y: 380,
        sectionTab: 'staff'
      },
      {
        id: 'claims',
        title: 'Item Claims Desk',
        metric: claims.length || 16,
        metricLabel: 'Adjudications',
        subtext: `${pendingClaims} Pending Review`,
        color: '#38bdf8', // Sky Blue
        glowColor: 'rgba(56, 189, 248, 0.4)',
        icon: CheckCircle2,
        y: 470,
        sectionTab: 'claims'
      },
      {
        id: 'election',
        title: 'College Elections',
        metric: '2026-27',
        metricLabel: 'Council Session',
        subtext: '8 Modules • Coming Soon',
        color: '#eab308', // Gold
        glowColor: 'rgba(234, 179, 8, 0.4)',
        icon: Vote,
        y: 560,
        sectionTab: 'election'
      }
    ];
  }, [items, campusIssues, students, staff, claims]);

  // Leaf Nodes fanning out from the currently active primary node
  const activeLeaves = useMemo(() => {
    switch (activeNodeId) {
      case 'campus-issues':
        return campusIssues.slice(0, 12).map((iss, idx) => ({
          id: iss.id,
          title: iss.title,
          badge: iss.priority,
          badgeColor: iss.priority === 'Critical' ? '#f43f5e' : iss.priority === 'High' ? '#f59e0b' : '#10b981',
          sub: iss.location,
          status: iss.status,
          raw: iss
        }));
      case 'lost-found':
        return items.slice(0, 12).map((it, idx) => ({
          id: it.id,
          title: it.title,
          badge: it.type.toUpperCase(),
          badgeColor: it.type === 'lost' ? '#f43f5e' : '#10b981',
          sub: `${it.location} • ${it.category}`,
          status: it.status,
          raw: it
        }));
      case 'students':
        return [
          { id: 'dept-cse', title: 'Computer Science & Engineering', badge: '74 Students', badgeColor: '#8b5cf6', sub: 'Block A • Labs 1-4' },
          { id: 'dept-it', title: 'Information Technology', badge: '52 Students', badgeColor: '#38bdf8', sub: 'Block B • Media Labs' },
          { id: 'dept-ece', title: 'Electronics & Communication', badge: '46 Students', badgeColor: '#06b6d4', sub: 'Tech Tower • VLSI Lab' },
          { id: 'dept-me', title: 'Mechanical Engineering', badge: '38 Students', badgeColor: '#f59e0b', sub: 'Workshop Complex' },
          { id: 'dept-ce', title: 'Civil Engineering', badge: '24 Students', badgeColor: '#10b981', sub: 'Hydraulics Wing' },
          { id: 'dept-mba', title: 'Management & MBA', badge: '16 Students', badgeColor: '#ec4899', sub: 'Admin Block 3rd Floor' }
        ];
      case 'staff':
        return staff.slice(0, 12).map((st) => ({
          id: st.staffId,
          title: st.name,
          badge: st.staffId,
          badgeColor: '#10b981',
          sub: st.desk,
          status: st.status,
          raw: st
        }));
      case 'claims':
        return claims.slice(0, 10).map((clm) => ({
          id: clm.id,
          title: clm.itemTitle,
          badge: clm.status.toUpperCase(),
          badgeColor: clm.status === 'approved' ? '#10b981' : clm.status === 'rejected' ? '#f43f5e' : '#f59e0b',
          sub: `Claimant: ${clm.claimantName} (${clm.claimantRoll})`,
          status: clm.status,
          raw: clm
        }));
      case 'election':
        return [
          { id: 'el-01', title: 'Voter Roll & Eligibility', badge: 'Charter Sync', badgeColor: '#eab308', sub: 'Automated student roll validation' },
          { id: 'el-02', title: 'Candidate Vetting Pipeline', badge: 'Proctor Check', badgeColor: '#eab308', sub: 'Academic attendance & conduct clearance' },
          { id: 'el-03', title: 'Manifestos & Speeches', badge: 'Declaration', badgeColor: '#eab308', sub: 'Official audio-visual manifesto vault' },
          { id: 'el-04', title: 'Polling Schedule & Phases', badge: 'Timetable', badgeColor: '#eab308', sub: 'Nomination, scrutiny, and vote hours' },
          { id: 'el-05', title: 'Results & Audit Trail', badge: 'Cryptographic', badgeColor: '#eab308', sub: 'Returning officer certified tabulation' },
          { id: 'el-06', title: 'Turnout & Analytics', badge: 'Live Gauge', badgeColor: '#eab308', sub: 'Departmental voter participation rates' }
        ];
      default:
        return [];
    }
  }, [activeNodeId, campusIssues, items, staff, claims]);

  // Center Coordinates of Root Core Orb
  const rootCoreX = 130;
  const rootCoreY = 340;

  // X position of primary nodes
  const primaryNodeX = 350;
  const primaryNodeW = 180;
  const primaryNodeH = 64;

  // X position of leaf nodes
  const leafX = 660;

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-[680px] bg-[#070b10] rounded-3xl overflow-hidden select-none border border-slate-800/80 shadow-2xl"
      style={{
        backgroundImage: `
          radial-gradient(circle at 18% 50%, rgba(13, 71, 79, 0.45) 0%, rgba(7, 11, 16, 0.95) 45%),
          radial-gradient(circle at 80% 30%, rgba(15, 23, 42, 0.6) 0%, rgba(7, 11, 16, 0.9) 70%)
        `
      }}
    >
      {/* Background Grid Pattern & Ambient Particles */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      />

      {/* SVG Canvas for Glowing Conduits & Splines */}
      <svg 
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{
          transform: `scale(${zoomLevel}) translate(${panOffset.x}px, ${panOffset.y}px)`,
          transformOrigin: '25% 50%',
          transition: 'transform 0.25s ease-out'
        }}
      >
        <defs>
          {/* Glowing Filters */}
          <filter id="coreGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>

          <filter id="splineGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Gradients */}
          <linearGradient id="coreOrbGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#c084fc" />
            <stop offset="50%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>

          <linearGradient id="activeSplineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.8" />
            <stop offset="60%" stopColor="#f59e0b" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.3" />
          </linearGradient>

          <linearGradient id="passiveSplineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#1e293b" stopOpacity="0.15" />
          </linearGradient>
        </defs>

        {/* 1. Splines from Root Core to Primary Nodes */}
        {primaryNodes.map((node) => {
          const isActive = node.id === activeNodeId;
          const nodeTargetY = node.y + primaryNodeH / 2;
          const nodeTargetX = primaryNodeX;

          // Smooth cubic bezier spline
          const cp1x = rootCoreX + (nodeTargetX - rootCoreX) * 0.45;
          const cp1y = rootCoreY;
          const cp2x = rootCoreX + (nodeTargetX - rootCoreX) * 0.55;
          const cp2y = nodeTargetY;
          const pathD = `M ${rootCoreX} ${rootCoreY} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${nodeTargetX} ${nodeTargetY}`;

          return (
            <g key={`spline-root-${node.id}`}>
              {/* Outer Glow Path */}
              <path
                d={pathD}
                fill="none"
                stroke={isActive ? node.color : 'rgba(51, 65, 85, 0.4)'}
                strokeWidth={isActive ? 3 : 1.2}
                strokeOpacity={isActive ? 0.85 : 0.35}
                filter={isActive ? 'url(#splineGlow)' : undefined}
              />
              {/* Animated energy pulses along active conduit */}
              {isActive && (
                <path
                  d={pathD}
                  fill="none"
                  stroke="#fbbf24"
                  strokeWidth="2.5"
                  strokeDasharray="6 14"
                  strokeDashoffset={-pulsePhase * 2}
                  strokeLinecap="round"
                />
              )}
            </g>
          );
        })}

        {/* 2. Splines from Active Primary Node to Fanning Leaf Nodes */}
        {activeLeaves.map((leaf, index) => {
          const activeNodeObj = primaryNodes.find(n => n.id === activeNodeId) || primaryNodes[0];
          const startX = primaryNodeX + primaryNodeW;
          const startY = activeNodeObj.y + primaryNodeH / 2;

          // Calculate vertical distribution of leaf nodes on the right
          const totalLeaves = activeLeaves.length || 1;
          const leafSpacing = Math.min(44, 520 / totalLeaves);
          const leafStartY = Math.max(70, startY - (totalLeaves * leafSpacing) / 2);
          const targetY = leafStartY + index * leafSpacing;
          const targetX = leafX;

          const cp1x = startX + (targetX - startX) * 0.4;
          const cp1y = startY;
          const cp2x = startX + (targetX - startX) * 0.7;
          const cp2y = targetY + 14;
          const pathD = `M ${startX} ${startY} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${targetX} ${targetY + 14}`;

          const isHovered = hoveredLeaf === leaf.id || activeLeafId === leaf.id;

          return (
            <g key={`spline-leaf-${leaf.id}`}>
              <path
                d={pathD}
                fill="none"
                stroke={isHovered ? '#fbbf24' : 'rgba(245, 158, 11, 0.35)'}
                strokeWidth={isHovered ? 2.5 : 1.2}
                strokeDasharray={isHovered ? 'none' : '4 3'}
                strokeOpacity={isHovered ? 1 : 0.45}
                filter={isHovered ? 'url(#splineGlow)' : undefined}
              />
              {/* Small junction node */}
              <circle
                cx={targetX}
                cy={targetY + 14}
                r={isHovered ? 4 : 2.5}
                fill={isHovered ? '#fbbf24' : activeNodeObj.color}
                filter="url(#splineGlow)"
              />
            </g>
          );
        })}
      </svg>

      {/* Main Interactive HTML Elements Overlay */}
      <div 
        className="absolute inset-0 w-full h-full"
        style={{
          transform: `scale(${zoomLevel}) translate(${panOffset.x}px, ${panOffset.y}px)`,
          transformOrigin: '25% 50%',
          transition: 'transform 0.25s ease-out'
        }}
      >
        
        {/* ===================================================================
            ROOT CENTRAL CORE ORB (Left Side)
            =================================================================== */}
        <div 
          className="absolute z-20 flex flex-col items-center justify-center cursor-pointer group"
          style={{
            left: `${rootCoreX - 60}px`,
            top: `${rootCoreY - 60}px`,
            width: '120px',
            height: '120px'
          }}
          onClick={onResetView}
          title="CampusFind Central Neural Core • Click to Reset View"
        >
          {/* Outer Ambient Corona Glow */}
          <div 
            className="absolute -inset-10 rounded-full pointer-events-none opacity-40 animate-pulse"
            style={{
              background: 'radial-gradient(circle, rgba(6, 182, 212, 0.3) 0%, rgba(99, 102, 241, 0.15) 50%, transparent 75%)'
            }}
          />

          {/* Dotted Corona Ring */}
          <div 
            className="absolute -inset-6 rounded-full border border-dashed border-cyan-400/40 pointer-events-none animate-spin"
            style={{ animationDuration: '40s' }}
          />

          {/* Core Glowing Sphere */}
          <div 
            className="w-16 h-16 rounded-full p-1 shadow-2xl relative flex items-center justify-center transition-transform group-hover:scale-105"
            style={{
              background: 'radial-gradient(circle at 35% 35%, #e9d5ff 0%, #a855f7 35%, #4f46e5 70%, #082f49 100%)',
              boxShadow: '0 0 35px rgba(168, 85, 247, 0.6), inset 0 0 15px rgba(255, 255, 255, 0.5)'
            }}
          >
            <ShieldCheck className="w-8 h-8 text-white drop-shadow-md" />
            
            {/* Specular Highlight dot */}
            <span className="absolute top-2.5 left-3.5 w-2.5 h-2.5 rounded-full bg-white/70 blur-[0.5px]" />
          </div>

          {/* Core Labels */}
          <div className="text-center mt-3 space-y-0.5">
            <span className="text-[11px] font-black text-white tracking-wider uppercase drop-shadow block">
              CampusFind Core
            </span>
            <span className="text-[9px] font-mono font-bold text-cyan-300 block">
              HIET Proctorial AI
            </span>
            <div className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-slate-900/80 border border-slate-700/80 rounded-full mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
              <span className="text-[8px] font-mono text-emerald-400 uppercase font-bold">ONLINE 100%</span>
            </div>
          </div>
        </div>

        {/* ===================================================================
            PRIMARY ENTITY CARDS (Middle Column)
            =================================================================== */}
        {primaryNodes.map((node) => {
          const isActive = node.id === activeNodeId;
          const Icon = node.icon;

          return (
            <div
              key={node.id}
              onClick={() => onSelectNode(node.id)}
              onMouseEnter={() => setHoveredNode(node.id)}
              onMouseLeave={() => setHoveredNode(null)}
              className={`absolute z-20 cursor-pointer rounded-2xl p-3 transition-all duration-200 backdrop-blur-md flex items-center justify-between group ${
                isActive
                  ? 'bg-slate-900/95 border-2 shadow-2xl scale-105'
                  : 'bg-slate-900/70 hover:bg-slate-900/90 border border-slate-700/60 hover:border-slate-500/80'
              }`}
              style={{
                left: `${primaryNodeX}px`,
                top: `${node.y}px`,
                width: `${primaryNodeW}px`,
                height: `${primaryNodeH}px`,
                borderColor: isActive ? '#fbbf24' : undefined,
                boxShadow: isActive ? `0 0 25px ${node.glowColor}, inset 0 0 10px rgba(251, 191, 36, 0.15)` : undefined
              }}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div 
                  className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-inner"
                  style={{
                    backgroundColor: `${node.color}20`,
                    color: node.color,
                    border: `1px solid ${node.color}40`
                  }}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-black text-white truncate group-hover:text-amber-300 transition-colors">
                      {node.title}
                    </span>
                  </div>
                  <div className="text-[10px] text-stone-400 truncate">
                    {node.subtext}
                  </div>
                </div>
              </div>

              {/* Right Counter / Metric Badge */}
              <div className="text-right shrink-0 pl-1.5">
                <div 
                  className="text-sm font-black font-mono leading-none"
                  style={{ color: isActive ? '#fbbf24' : node.color }}
                >
                  {node.metric}
                </div>
                <span className="text-[8px] font-bold text-stone-400 uppercase tracking-tighter block mt-0.5">
                  {node.metricLabel.split(' ')[0]}
                </span>
              </div>
            </div>
          );
        })}

        {/* ===================================================================
            FANNING LEAF NODES (Right Column)
            =================================================================== */}
        {activeLeaves.map((leaf, index) => {
          const activeNodeObj = primaryNodes.find(n => n.id === activeNodeId) || primaryNodes[0];
          const totalLeaves = activeLeaves.length || 1;
          const leafSpacing = Math.min(44, 520 / totalLeaves);
          const startY = activeNodeObj.y + primaryNodeH / 2;
          const leafStartY = Math.max(70, startY - (totalLeaves * leafSpacing) / 2);
          const nodeTop = leafStartY + index * leafSpacing;

          const isSelected = activeLeafId === leaf.id;
          const isHovered = hoveredLeaf === leaf.id;

          return (
            <div
              key={leaf.id}
              onClick={() => onSelectLeaf(leaf)}
              onMouseEnter={() => setHoveredLeaf(leaf.id)}
              onMouseLeave={() => setHoveredLeaf(null)}
              className={`absolute z-20 cursor-pointer rounded-xl px-2.5 py-1.5 transition-all duration-150 backdrop-blur-md flex items-center justify-between gap-2 border ${
                isSelected
                  ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-lg scale-102 font-bold'
                  : isHovered
                  ? 'bg-slate-800/90 text-white border-cyan-400/60 shadow-md translate-x-1'
                  : 'bg-slate-900/60 text-slate-200 border-slate-700/50 hover:bg-slate-800/80'
              }`}
              style={{
                left: `${leafX}px`,
                top: `${nodeTop}px`,
                width: '260px'
              }}
            >
              <div className="min-w-0 flex-1">
                <div className="text-[11px] font-bold truncate">
                  {leaf.title}
                </div>
                <div className={`text-[9px] truncate ${isSelected ? 'text-slate-800' : 'text-stone-400'}`}>
                  {leaf.sub}
                </div>
              </div>

              {/* Status Badge */}
              <span 
                className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold shrink-0 shadow-2xs"
                style={{
                  backgroundColor: isSelected ? '#00000025' : `${leaf.badgeColor || '#06b6d4'}25`,
                  color: isSelected ? '#000000' : (leaf.badgeColor || '#06b6d4'),
                  border: `1px solid ${isSelected ? '#00000030' : (leaf.badgeColor || '#06b6d4')}40`
                }}
              >
                {leaf.badge}
              </span>
            </div>
          );
        })}

      </div>

      {/* Floating Network Guide Tooltip (Bottom Left) */}
      <div className="absolute bottom-4 left-4 z-30 flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 backdrop-blur-md border border-slate-800 text-[10px] text-stone-400">
        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
        <span>Interactive Neural Map • Click primary node to fan out sub-records</span>
      </div>

    </div>
  );
};
