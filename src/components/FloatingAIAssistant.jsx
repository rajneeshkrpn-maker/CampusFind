import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, MessageSquare, X } from 'lucide-react';

export const FloatingAIAssistant = () => {
  const { showAIAssistantModal, setShowAIAssistantModal } = useApp();
  const [tooltipDismissed, setTooltipDismissed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const toggleAssistant = () => {
    setShowAIAssistantModal(!showAIAssistantModal);
  };

  return (
    <div 
      className="fixed bottom-5 right-5 sm:bottom-7 sm:right-7 z-40 select-none flex flex-col items-end"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Speech Bubble / Greeting Pill */}
      {!showAIAssistantModal && !tooltipDismissed && (
        <div className="mb-2.5 mr-1 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-3.5 py-2 rounded-2xl shadow-xl border border-stone-200/90 dark:border-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-300 group max-w-[210px]">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
          <span className="truncate">Need help? Ask Campus AI!</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setTooltipDismissed(true);
            }}
            className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 ml-1 p-0.5 rounded-full"
            aria-label="Dismiss greeting"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Interactive 3D Robot Character Button */}
      <button
        onClick={toggleAssistant}
        aria-label="Toggle Campus AI Assistant"
        className="relative group focus:outline-none focus-visible:ring-4 focus-visible:ring-orange-500/50 rounded-full transition-transform active:scale-95"
      >
        {/* Ambient Backlight Glow */}
        <div className="absolute -inset-2 bg-gradient-to-r from-orange-500/20 via-indigo-500/25 to-cyan-500/20 rounded-full blur-xl opacity-75 group-hover:opacity-100 transition-opacity animate-subtle-glow pointer-events-none" />

        {/* Levitation Container */}
        <div className={`relative flex flex-col items-center animate-float-robot ${isHovered ? 'scale-105' : 'scale-100'} transition-transform duration-300`}>
          
          {/* Status Badge: AI Online */}
          <div className="absolute -top-2.5 -right-1 z-10 px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md border border-emerald-400/30 flex items-center gap-1 tracking-wider uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            <span>AI</span>
          </div>

          {/* 3D Rendered Vector Robot Character */}
          <div className="w-16 h-16 sm:w-[72px] sm:h-[72px] relative filter drop-shadow-lg">
            <svg
              viewBox="0 0 100 100"
              className="w-full h-full overflow-visible"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                {/* 3D Helmet Dome Gradient */}
                <radialGradient id="helmetGrad" cx="35%" cy="30%" r="65%">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="45%" stopColor="#f1f5f9" />
                  <stop offset="85%" stopColor="#cbd5e1" />
                  <stop offset="100%" stopColor="#94a3b8" />
                </radialGradient>

                {/* Glass Visor Gradient */}
                <linearGradient id="visorGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#0f172a" />
                  <stop offset="50%" stopColor="#1e1b4b" />
                  <stop offset="100%" stopColor="#0284c7" />
                </linearGradient>

                {/* Visor Glare / Specular Highlight */}
                <linearGradient id="visorGlare" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.45" />
                  <stop offset="60%" stopColor="#ffffff" stopOpacity="0.05" />
                  <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                </linearGradient>

                {/* Glowing LED Cyan Eyes */}
                <radialGradient id="eyeGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#67e8f9" />
                  <stop offset="45%" stopColor="#06b6d4" />
                  <stop offset="100%" stopColor="#0891b2" />
                </radialGradient>

                {/* Torso Metallic Gradient */}
                <linearGradient id="torsoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f8fafc" />
                  <stop offset="60%" stopColor="#e2e8f0" />
                  <stop offset="100%" stopColor="#cbd5e1" />
                </linearGradient>

                {/* Chest Emblem Core */}
                <linearGradient id="coreGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#fb923c" />
                  <stop offset="50%" stopColor="#ea580c" />
                  <stop offset="100%" stopColor="#c2410c" />
                </linearGradient>

                {/* Soft Drop Shadow for Head */}
                <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="4" stdDeviation="3" floodOpacity="0.25" />
                </filter>
              </defs>

              {/* Antenna Rod */}
              <rect x="48" y="10" width="4" height="15" rx="2" fill="#64748b" />
              {/* Antenna Glowing Orb */}
              <circle 
                cx="50" 
                cy="8" 
                r="6.5" 
                fill="#06b6d4" 
                className="animate-antenna-pulse" 
              />
              <circle cx="50" cy="8" r="3" fill="#ffffff" opacity="0.9" />

              {/* Ears / Side Audio Pods */}
              <rect x="14" y="38" width="6" height="18" rx="3" fill="#475569" />
              <rect x="15" y="42" width="2" height="10" rx="1" fill="#22d3ee" />
              
              <rect x="80" y="38" width="6" height="18" rx="3" fill="#475569" />
              <rect x="83" y="42" width="2" height="10" rx="1" fill="#22d3ee" />

              {/* Robot Head (Rounded 3D Chassis) */}
              <rect 
                x="18" 
                y="22" 
                width="64" 
                height="50" 
                rx="24" 
                fill="url(#helmetGrad)" 
                filter="url(#softShadow)"
              />

              {/* Glossy Curved Visor Screen */}
              <rect 
                x="24" 
                y="29" 
                width="52" 
                height="34" 
                rx="16" 
                fill="url(#visorGrad)" 
              />

              {/* Visor Inner Specular Reflection */}
              <path 
                d="M26 38 C32 31, 68 31, 74 38 C68 33, 32 33, 26 38 Z" 
                fill="#ffffff" 
                opacity="0.3" 
              />
              <ellipse cx="50" cy="34" rx="20" ry="3.5" fill="url(#visorGlare)" />

              {/* Animated Expressive LED Eyes */}
              <g className="animate-eye-blink">
                {/* Left Eye */}
                <circle cx="39" cy="45" r="5.5" fill="url(#eyeGlow)" />
                <circle cx="41" cy="43" r="1.8" fill="#ffffff" />
                <path d="M35 41 Q39 39 43 41" stroke="#22d3ee" strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.8" />

                {/* Right Eye */}
                <circle cx="61" cy="45" r="5.5" fill="url(#eyeGlow)" />
                <circle cx="63" cy="43" r="1.8" fill="#ffffff" />
                <path d="M57 41 Q61 39 65 41" stroke="#22d3ee" strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.8" />
              </g>

              {/* Friendly LED Smile Indicator */}
              <path 
                d="M44 55 Q50 60 56 55" 
                stroke="#38bdf8" 
                strokeWidth="2" 
                strokeLinecap="round" 
                fill="none" 
              />

              {/* Neck Ring */}
              <ellipse cx="50" cy="72" rx="14" ry="4" fill="#64748b" />

              {/* Torso / Body */}
              <path 
                d="M32 73 C32 73, 26 94, 50 94 C74 94, 68 73, 68 73 Z" 
                fill="url(#torsoGrad)" 
                filter="url(#softShadow)"
              />

              {/* Chest Core Jewel (CampusFind Emblem) */}
              <circle cx="50" cy="82" r="4.5" fill="url(#coreGrad)" />
              <circle cx="50" cy="82" r="2" fill="#ffffff" opacity="0.75" />
            </svg>
          </div>

          {/* Floating Shadow Below Robot */}
          <div className="w-10 h-2 bg-slate-900/40 dark:bg-black/60 rounded-full blur-[2.5px] mt-1 animate-robot-shadow" />
        </div>

      </button>
    </div>
  );
};
