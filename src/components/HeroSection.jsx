import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ArrowUpRight, 
  MapPin, 
  Search, 
  PackagePlus, 
  Layers, 
  ShieldCheck 
} from 'lucide-react';

export const HeroSection = () => {
  const { setCurrentView } = useApp();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: 'Main Campus Quadrangle & Admin Block',
      tag: 'Main Quadrangle',
      image: '/campus-quadrangle.jpg',
      caption: 'Hi-Tech Institute of Engineering, Ghaziabad — Central Campus Entrance & Smt. Savitri Auditorium'
    },
    {
      title: 'Computer Lab & Innovation Center',
      tag: 'Tech Hub',
      image: '/campus-computer-lab.jpg',
      caption: 'Hi-Tech Block 2 — State-of-the-Art Computing Labs & Student Innovation Zone'
    },
    {
      title: 'Academic Block A & B Complex',
      tag: 'Lecture Block A & B',
      image: '/campus-block-ab.jpg',
      caption: 'Hi-Tech Institute Main Academic Wing — Engineering & Technology Lecture Halls'
    },
    {
      title: 'Central Library & Reading Hall',
      tag: 'Knowledge Center',
      image: '/campus-library.jpg',
      caption: 'Hi-Tech Digital Library & High-Density Lost-and-Found Recovery Desk'
    }
  ];

  // Auto-rotate hero architectural slides smoothly
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <section className="relative overflow-hidden bg-[#fbfbfa] border-b border-stone-200">
      
      {/* Reference Geometric Lattice Watermark Pattern */}
      <div 
        aria-hidden="true" 
        className="absolute inset-0 opacity-[0.035] pointer-events-none bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px]" 
      />

      {/* Decorative architectural subtle radial glow */}
      <div 
        aria-hidden="true"
        className="absolute top-0 right-1/4 w-96 h-96 bg-orange-100/40 rounded-full blur-3xl pointer-events-none"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14 lg:py-16 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Heading, Subtitle, Reference 2x2 Grid, Location Pin */}
          <div className="lg:col-span-7 flex flex-col justify-between z-10">
            
            {/* Pre-title Tagline (Matches reference "Combine Quality with Morality" in teal/sage) */}
            <div className="mb-3">
              <span className="text-xs sm:text-sm font-semibold tracking-wide text-teal-700 bg-teal-50/80 px-3 py-1 rounded-full border border-teal-200/60 inline-flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-600 animate-pulse"></span>
                Lost on Campus. Found Together.
              </span>
            </div>

            {/* Main Hero Headline (Matches Reference bold sans typography) */}
            <h1 className="text-3xl sm:text-5xl lg:text-[54px] font-extrabold text-slate-900 tracking-tight leading-[1.08] mb-4">
              Lost Something <br />
              <span className="text-slate-900">on Campus?</span> <br />
              <span className="text-orange-600">Let's Find It.</span>
            </h1>

            {/* Description Subtitle */}
            <p className="text-sm sm:text-base text-slate-600 max-w-xl mb-8 leading-relaxed font-normal">
              The official centralized recovery portal for <strong>Hi-Tech Institute of Engineering, Ghaziabad</strong>. 
              Report lost belongings, discover found items turned in to campus security, and reclaim your essentials with verified identity safeguards.
            </p>

            {/* Reference 2x2 Quick Action Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg mb-8">
              
              {/* Card 1: Vibrant Terracotta / Orange Active CTA (Matches Reference "Admission ↗" card) */}
              <button
                onClick={() => setCurrentView('report-lost')}
                className="group flex items-center justify-between p-4 sm:p-4.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl shadow-sm hover:shadow-md transition-all text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
                    <Search className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="font-bold text-sm tracking-tight">Report Lost Item</div>
                    <div className="text-[11px] text-orange-100 font-normal">Post details & notify desk</div>
                  </div>
                </div>
                <ArrowUpRight className="w-5 h-5 text-white/90 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0" />
              </button>

              {/* Card 2: Crisp White Card (Matches Reference "Research" card) */}
              <button
                onClick={() => setCurrentView('report-found')}
                className="group flex items-center justify-between p-4 sm:p-4.5 bg-white hover:bg-stone-50 border border-stone-200/90 rounded-xl shadow-xs hover:shadow-md transition-all text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-100">
                    <PackagePlus className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-sm text-slate-900 group-hover:text-emerald-700 transition-colors">
                      Report Found Item
                    </div>
                    <div className="text-[11px] text-stone-500 font-normal">Turn in an item found</div>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-stone-400 group-hover:text-emerald-700 transition-colors shrink-0" />
              </button>

              {/* Card 3: Crisp White Card (Matches Reference "Faculty" card) */}
              <button
                onClick={() => setCurrentView('browse')}
                className="group flex items-center justify-between p-4 sm:p-4.5 bg-white hover:bg-stone-50 border border-stone-200/90 rounded-xl shadow-xs hover:shadow-md transition-all text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-50 text-[#3b5bf5] flex items-center justify-center shrink-0 border border-blue-100">
                    <Layers className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-sm text-slate-900 group-hover:text-[#3b5bf5] transition-colors">
                      Browse Directory
                    </div>
                    <div className="text-[11px] text-stone-500 font-normal">Search active listings</div>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-stone-400 group-hover:text-[#3b5bf5] transition-colors shrink-0" />
              </button>

              {/* Card 4: Crisp White Card (Matches Reference "Events" card) */}
              <button
                onClick={() => setCurrentView('dashboard')}
                className="group flex items-center justify-between p-4 sm:p-4.5 bg-white hover:bg-stone-50 border border-stone-200/90 rounded-xl shadow-xs hover:shadow-md transition-all text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 border border-amber-100">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-sm text-slate-900 group-hover:text-amber-700 transition-colors">
                      Claim & Recover
                    </div>
                    <div className="text-[11px] text-stone-500 font-normal">Track ongoing claims</div>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-stone-400 group-hover:text-amber-700 transition-colors shrink-0" />
              </button>

            </div>

            {/* Bottom Campus Location Badge (Matches Reference "📍 Al Maktoum Street, Dubai, UAE") */}
            <div className="flex items-center gap-2 text-xs text-slate-500 pt-2 border-t border-stone-200/60 max-w-lg">
              <MapPin className="w-4 h-4 text-orange-600 shrink-0" />
              <span className="font-medium text-slate-700">
                Hi-Tech Institute of Engineering, NH-24, Ghaziabad, Uttar Pradesh, India
              </span>
            </div>

          </div>

          {/* Right Column: Architectural Campus Photography + Carousel Dots (Matches Reference) */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border border-stone-200/90 shadow-xl bg-white aspect-[4/3] sm:aspect-[16/11]">
              
              {/* Background architectural image */}
              <img
                src={slides[currentSlide].image}
                alt={slides[currentSlide].title}
                className="w-full h-full object-cover transition-all duration-700 hover:scale-105"
              />

              {/* Soft gradient overlay matching reference mood */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent pointer-events-none" />

              {/* Top Campus Zone Tag */}
              <div className="absolute top-4 left-4 z-10">
                <span className="text-[11px] font-bold text-white bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                  {slides[currentSlide].tag}
                </span>
              </div>

              {/* Bottom Information & Reference Slider Dots */}
              <div className="absolute bottom-4 left-4 right-4 z-10 flex flex-col gap-2">
                <div>
                  <h4 className="text-white font-bold text-sm sm:text-base drop-shadow-sm">
                    {slides[currentSlide].title}
                  </h4>
                  <p className="text-white/80 text-[11px] drop-shadow-sm line-clamp-1">
                    {slides[currentSlide].caption}
                  </p>
                </div>

                {/* Reference Slider Dots & Pill Indicator: "────── ••••••" */}
                <div className="flex items-center justify-end gap-1.5 pt-1">
                  {slides.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentSlide(idx)}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        currentSlide === idx 
                          ? 'w-7 bg-white' 
                          : 'w-2 bg-white/40 hover:bg-white/70'
                      }`}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>
              </div>

            </div>

            {/* Quick Live Stats Pill floating on bottom edge */}
            <div className="absolute -bottom-4 left-6 right-6 hidden sm:flex items-center justify-between bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-xl border border-stone-200 shadow-md text-xs">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></div>
                <span className="font-semibold text-slate-800">89% Recovery Rate</span>
              </div>
              <div className="text-stone-400">|</div>
              <div className="text-stone-600 font-medium">
                Verified Security Counters • 24hr Campus Turnaround
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
