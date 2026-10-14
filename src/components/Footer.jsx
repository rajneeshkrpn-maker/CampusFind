import React from 'react';
import { useApp } from '../context/AppContext';
import { Logo } from './Logo';
import { MapPin, Phone, Mail, Heart, Clock } from 'lucide-react';

export const Footer = () => {
  const { setCurrentView, setShowSecurityHubsModal, setShowInquiryModal } = useApp();

  return (
    <footer className="bg-slate-900 text-stone-300 border-t border-slate-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10">
          
          {/* Brand & College Credentials */}
          <div className="lg:col-span-2 space-y-4">
            <Logo inverted={true} />

            <p className="text-stone-400 text-xs leading-relaxed max-w-sm">
              The centralized lost-and-found recovery ecosystem for students, faculty, and proctorial staff at <strong>Hi-Tech Institute of Engineering, Ghaziabad</strong>. Built to eliminate lost item anxiety across lecture halls, labs, and sports grounds.
            </p>

            <div className="pt-2 text-[11px] text-stone-400 space-y-1.5">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                <span>NH-24, Delhi-Hapur Bypass Road, Adhyatmik Nagar, Ghaziabad, UP — 201015</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                <span>Security Desk: 24/7 Gate 1 Reception | Proctor Desk: 9 AM - 5 PM</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider">Navigation</h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => setCurrentView('home')} className="hover:text-white transition-colors">
                  Home Landing
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('browse')} className="hover:text-white transition-colors">
                  Browse Items Directory
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('report-lost')} className="hover:text-white transition-colors">
                  Report Lost Belonging
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('report-found')} className="hover:text-white transition-colors">
                  Report Found Item
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('dashboard')} className="hover:text-white transition-colors">
                  Student Dashboard
                </button>
              </li>
            </ul>
          </div>

          {/* Security & Verification Desks */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider">Campus Recovery</h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => setShowSecurityHubsModal(true)} className="hover:text-white transition-colors">
                  Campus Desks & Locations
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('admin')} className="hover:text-white transition-colors">
                  Security Officer Portal 🔒
                </button>
              </li>
              <li>
                <a href="#how-it-works" onClick={() => setCurrentView('home')} className="hover:text-white transition-colors">
                  3-Step Recovery Protocol
                </a>
              </li>
              <li>
                <a href="#safety-guide" onClick={() => setCurrentView('home')} className="hover:text-white transition-colors">
                  Anti-Fraud Guidelines
                </a>
              </li>
            </ul>
          </div>

          {/* Contact & Hackathon Badge */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider">Helpline & Credits</h4>
            <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/80 space-y-2">
              <div className="text-[11px] font-semibold text-white flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span>Intercom Ext: 101 / 204</span>
              </div>
              <div className="text-[11px] text-stone-400 flex items-center gap-1.5 truncate">
                <Mail className="w-3.5 h-3.5 text-blue-400" />
                <span>campusfind@hitech.ac.in</span>
              </div>
            </div>

            <button
              onClick={() => setShowInquiryModal(true)}
              className="w-full py-2 px-3 bg-stone-800 hover:bg-stone-700 text-orange-400 font-semibold rounded-lg border border-stone-700 transition-colors text-center text-[11px] flex items-center justify-center gap-1.5"
            >
              <span>Submit Help Desk Inquiry</span>
              <span>✉️</span>
            </button>

            <div className="pt-2">
              <span className="inline-block px-2.5 py-1 rounded bg-orange-600/20 text-orange-400 border border-orange-500/30 text-[10px] font-semibold">
                Project 2026 • 24hr College Hackathon
              </span>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-stone-400 text-[11px]">
          <div>
            © 2026 CampusFind — Hi-Tech Institute of Engineering, Ghaziabad. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              Crafted with <Heart className="w-3 h-3 text-rose-500 fill-rose-500" /> for Hi-Tech Campus Community
            </span>
            <span className="text-stone-600">•</span>
            <span className="text-stone-300 font-mono">Frontend Demo v1.0.0</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
