import React from 'react';

export const Logo = ({ size = 'normal', showSubtitle = true, inverted = false, className = '' }) => {
  const isLarge = size === 'large';
  const isSmall = size === 'small';

  const iconSizes = isLarge 
    ? 'w-12 h-12' 
    : isSmall 
    ? 'w-8 h-8' 
    : 'w-10 h-10 sm:w-11 sm:h-11';

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Aesthetic Custom Vector Emblem */}
      <div className={`relative ${iconSizes} rounded-xl bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600 p-[1.5px] shadow-sm shadow-orange-500/20 group-hover:shadow-md group-hover:shadow-orange-500/30 transition-all shrink-0`}>
        <div className="w-full h-full bg-gradient-to-br from-orange-600 to-orange-700 rounded-[10px] flex items-center justify-center relative overflow-hidden">
          
          {/* Subtle inner sheen */}
          <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/25 pointer-events-none" />

          {/* Custom Stylized Beacon & Discovery Cap Emblem */}
          <svg
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6 text-white drop-shadow-xs"
          >
            {/* Campus Mortarboard / Academic Roof */}
            <path
              d="M16 5L5 10.5L16 16L27 10.5L16 5Z"
              fill="white"
              fillOpacity="0.95"
            />
            {/* Compass / Location Pin Base */}
            <path
              d="M9 13.2V19.5C9 23.3 12.1 26.5 16 27C19.9 26.5 23 23.3 23 19.5V13.2L16 16.8L9 13.2Z"
              fill="white"
              fillOpacity="0.82"
            />
            {/* Discovery Core Pulse (Magnifying Lens Loop) */}
            <circle
              cx="16"
              cy="19"
              r="3.2"
              fill="#ea580c"
            />
            <circle
              cx="16"
              cy="19"
              r="1.5"
              fill="white"
            />
            {/* Radiant Sparkle in Top Corner */}
            <path
              d="M24 4.5L24.7 6.3L26.5 7L24.7 7.7L24 9.5L23.3 7.7L21.5 7L23.3 6.3L24 4.5Z"
              fill="#fed7aa"
            />
          </svg>
        </div>
      </div>

      {/* Typography Wordmark */}
      <div className="flex flex-col">
        <div className={`font-extrabold tracking-tight leading-none ${
          isLarge 
            ? 'text-2xl' 
            : isSmall 
            ? 'text-base' 
            : 'text-lg sm:text-xl'
        } ${inverted ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
          <span>Campus</span>
          <span className="text-orange-600 dark:text-orange-500">Find</span>
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-orange-600 dark:bg-orange-500 ml-1 mb-0.5"></span>
        </div>

        {showSubtitle && (
          <span className={`text-[10px] sm:text-[11px] font-semibold tracking-wider uppercase mt-0.5 ${
            inverted ? 'text-stone-400' : 'text-stone-600 dark:text-stone-400'
          }`}>
            Hi-Tech Institute of Engineering, Ghaziabad
          </span>
        )}
      </div>
    </div>
  );
};
