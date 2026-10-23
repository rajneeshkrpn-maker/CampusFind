import React, { useState, useRef, useEffect } from 'react';
import { 
  Compass, 
  Maximize2, 
  Minimize2, 
  ExternalLink, 
  Info, 
  RefreshCw, 
  Building2, 
  Sparkles, 
  Eye,
  AlertCircle
} from 'lucide-react';

/**
 * CAMPUS 360° TOUR CONFIGURATION
 * -------------------------------------------------------------
 * When Hi-Tech Institute of Engineering, Ghaziabad provides official
 * 360° panoramic or drone imagery, simply update the `tourUrl` below.
 */
export const CAMPUS_360_CONFIG = {
  collegeName: "Hi-Tech Institute of Engineering, Ghaziabad",
  isDemo: true,
  demoCampusName: "Amrita Vishwa Vidyapeetham (Reference Campus)",
  tourUrl: "https://www.p4panorama.com/panos/amrita-university-360-virtual-reality-tour/",
  sourcePageUrl: "https://www.p4panorama.com/gallery-item/amrita-university-coimbatore-tamil-nadu/",
  instructions: "Replace tourUrl with Hi-Tech Institute's authorized panoramic embed link once available."
};

export const CampusTourSection = () => {
  const viewerContainerRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Sync fullscreen state with browser events (e.g. Escape key)
  useEffect(() => {
    const handleFullscreenChange = () => {
      const activeElement = document.fullscreenElement || 
                            document.webkitFullscreenElement || 
                            document.mozFullScreenElement || 
                            document.msFullscreenElement;
      setIsFullscreen(!!activeElement && activeElement === viewerContainerRef.current);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, []);

  // Handle Fullscreen toggle
  const toggleFullscreen = async () => {
    try {
      const container = viewerContainerRef.current;
      if (!container) return;

      const isCurrentlyFullscreen = document.fullscreenElement || 
                                    document.webkitFullscreenElement || 
                                    document.mozFullScreenElement || 
                                    document.msFullscreenElement;

      if (!isCurrentlyFullscreen) {
        if (container.requestFullscreen) {
          await container.requestFullscreen();
        } else if (container.webkitRequestFullscreen) {
          await container.webkitRequestFullscreen();
        } else if (container.mozRequestFullScreen) {
          await container.mozRequestFullScreen();
        } else if (container.msRequestFullscreen) {
          await container.msRequestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
          await document.webkitExitFullscreen();
        } else if (document.mozCancelFullScreen) {
          await document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
          await document.msExitFullscreen();
        }
      }
    } catch (err) {
      console.warn("Fullscreen request error:", err);
    }
  };

  const handleReload = () => {
    setHasError(false);
    setIsLoading(true);
  };

  return (
    <section 
      id="campus-360-tour" 
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2"
      aria-label="Explore Campus in 360 Virtual Tour"
    >
      <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200/90 dark:border-stone-800 shadow-xl overflow-hidden transition-all duration-300">
        
        {/* Header Bar */}
        <div className="p-6 sm:p-8 border-b border-stone-100 dark:border-stone-800/80 bg-gradient-to-b from-stone-50/70 to-white dark:from-stone-900 dark:to-stone-900/90">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            
            <div className="space-y-1.5 max-w-3xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-orange-100 dark:bg-orange-950/70 text-orange-700 dark:text-orange-400 border border-orange-200/70 dark:border-orange-800/50">
                  <Compass className="w-3.5 h-3.5 animate-spin-slow" />
                  Virtual Campus Experience
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200/60 dark:border-amber-800/40">
                  <Sparkles className="w-3 h-3" />
                  Interactive 360° Panorama
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Explore Campus in 360°
              </h2>

              <p className="text-stone-600 dark:text-stone-300 text-xs sm:text-sm leading-relaxed">
                Experience an immersive virtual campus tour. This demo uses a reference campus experience; our own college tour can be added with authorized campus imagery.
              </p>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex items-center gap-2.5 shrink-0 self-start lg:self-center">
              <a
                href={CAMPUS_360_CONFIG.tourUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-xs hover:shadow-md transition-all"
                title="Open 360° tour in a new browser tab"
              >
                <span>Open in New Tab</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <a
                href={CAMPUS_360_CONFIG.sourcePageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 hover:bg-stone-50 dark:hover:bg-stone-700/60 text-slate-700 dark:text-stone-200 font-semibold text-xs shadow-2xs transition-colors"
                title="View original photography source & credits"
              >
                <span>Reference Source</span>
              </a>
            </div>

          </div>

          {/* Interactive Navigation Tips Bar */}
          <div className="mt-4 pt-4 border-t border-stone-100 dark:border-stone-800 flex flex-wrap items-center justify-between gap-3 text-xs text-stone-500 dark:text-stone-400">
            <div className="flex flex-wrap items-center gap-4">
              <span className="flex items-center gap-1.5 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
                Drag or swipe to rotate 360°
              </span>
              <span className="hidden sm:inline text-stone-300 dark:text-stone-700">•</span>
              <span className="hidden sm:flex items-center gap-1.5 font-medium">
                Click hotspots to move across campus zones
              </span>
              <span className="hidden md:inline text-stone-300 dark:text-stone-700">•</span>
              <span className="hidden md:flex items-center gap-1.5 font-medium">
                Scroll to zoom in / out
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleReload}
                className="inline-flex items-center gap-1 hover:text-orange-600 dark:hover:text-orange-400 transition-colors text-[11px]"
                title="Refresh 360° viewer"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Reload Viewer</span>
              </button>
            </div>
          </div>
        </div>

        {/* 360° Panorama Viewer Container */}
        <div 
          ref={viewerContainerRef}
          className={`relative w-full bg-stone-950 overflow-hidden transition-all duration-300 ${
            isFullscreen 
              ? 'h-screen w-screen fixed inset-0 z-[99999] rounded-none' 
              : 'h-[400px] sm:h-[500px] lg:h-[620px] aspect-[16/9]'
          }`}
        >
          {/* Top-Left Mode & College Tag */}
          <div className="absolute top-4 left-4 z-20 pointer-events-none">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/85 backdrop-blur-md border border-white/15 text-white shadow-lg text-xs font-medium">
              <Building2 className="w-3.5 h-3.5 text-orange-400 shrink-0" />
              <span className="tracking-wide">
                Virtual Tour Demo <span className="text-stone-400 text-[10px] hidden sm:inline">(Reference Campus)</span>
              </span>
            </div>
          </div>

          {/* Fallback View (Shown if iframe fails to load or error occurs) */}
          {hasError ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-white bg-gradient-to-br from-slate-900 to-stone-900">
              <div className="w-16 h-16 rounded-2xl bg-orange-500/20 text-orange-400 border border-orange-500/30 flex items-center justify-center mb-4 shadow-lg">
                <AlertCircle className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">Direct 360° Embed Restricted</h3>
              <p className="text-stone-300 text-xs sm:text-sm max-w-md mb-6 leading-relaxed">
                The reference 360° campus viewer can be opened directly in an interactive browser window.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <a
                  href={CAMPUS_360_CONFIG.tourUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm shadow-lg transition-colors inline-flex items-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  <span>Open 360° Demo</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
                <button
                  onClick={handleReload}
                  className="px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-xs transition-colors"
                >
                  Try Reloading
                </button>
              </div>
            </div>
          ) : (
            /* Live Interactive 360° Iframe */
            <>
              {isLoading && (
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-stone-900 text-white gap-3">
                  <div className="w-10 h-10 border-3 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-xs text-stone-300 font-medium tracking-wide">
                    Loading 360° Virtual Campus Experience...
                  </p>
                </div>
              )}

              <iframe
                src={CAMPUS_360_CONFIG.tourUrl}
                title="Explore Campus in 360° — Interactive Tour"
                className="w-full h-full border-0 select-none"
                allow="accelerometer; gyroscope; magnetometer; vr; fullscreen"
                allowFullScreen
                loading="lazy"
                onLoad={() => setIsLoading(false)}
                onError={() => {
                  setIsLoading(false);
                  setHasError(true);
                }}
              />
            </>
          )}

          {/* Full-Screen Toggle Button (Bottom-Right Inside Viewer) */}
          <div className="absolute bottom-4 right-4 z-20">
            <button
              onClick={toggleFullscreen}
              aria-label={isFullscreen ? 'Exit full screen' : 'Open full screen'}
              title={isFullscreen ? 'Exit full screen (Esc)' : 'Open full screen'}
              className="group inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900/85 hover:bg-slate-900 text-white backdrop-blur-md border border-white/20 shadow-xl transition-all duration-200 active:scale-95 hover:border-white/40 focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              {isFullscreen ? (
                <>
                  <Minimize2 className="w-4 h-4 text-orange-400 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold tracking-tight">Exit Full Screen</span>
                </>
              ) : (
                <>
                  <Maximize2 className="w-4 h-4 text-orange-400 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold tracking-tight">Open Full Screen</span>
                </>
              )}
            </button>
          </div>

          {/* Bottom-Left Tour Guidance Pill */}
          <div className="absolute bottom-4 left-4 z-20 hidden sm:block pointer-events-none">
            <div className="px-3 py-1.5 rounded-lg bg-black/60 backdrop-blur-sm border border-white/10 text-white/90 text-[11px] font-medium">
              360° Panorama Navigation Enabled
            </div>
          </div>
        </div>

        {/* Honest Demonstration & Institutional Integration Note Footer */}
        <div className="p-4 sm:p-5 bg-stone-50 dark:bg-stone-900/80 border-t border-stone-200/80 dark:border-stone-800 text-stone-600 dark:text-stone-400 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-2.5">
            <Info className="w-4 h-4 text-orange-600 dark:text-orange-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong className="text-slate-900 dark:text-white font-semibold">Concept Demonstration Note: </strong> 
              This interactive tour demonstrates CampusFind's virtual navigation framework using an authorized reference campus 
              (<span className="font-medium text-stone-800 dark:text-stone-200">{CAMPUS_360_CONFIG.demoCampusName}</span>). 
              A tailored tour of <strong>{CAMPUS_360_CONFIG.collegeName}</strong> will be substituted when official panoramic and drone assets are integrated.
            </p>
          </div>
          <a
            href={CAMPUS_360_CONFIG.tourUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-600 dark:text-orange-400 hover:underline font-bold text-xs shrink-0 self-start sm:self-auto inline-flex items-center gap-1"
          >
            <span>Open 360° Demo</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

      </div>
    </section>
  );
};
