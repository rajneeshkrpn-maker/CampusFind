import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  MapPin, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  ShieldCheck, 
  Eye
} from 'lucide-react';

export const ItemCard = ({ item }) => {
  const { setActiveItemDetails, setActiveClaimItem } = useApp();

  const getStatusBadge = () => {
    switch (item.status) {
      case 'lost':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-600"></span>
            Lost Report
          </span>
        );
      case 'found':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
            Found Item
          </span>
        );
      case 'claimed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-pulse"></span>
            Claim Pending
          </span>
        );
      case 'recovered':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
            <CheckCircle2 className="w-3 h-3 text-indigo-600" />
            Recovered
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="group bg-white rounded-xl border border-stone-200/90 overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between hover:-translate-y-1">
      <div>
        {/* Card Image Container */}
        <div className="relative aspect-[16/10] bg-stone-100 overflow-hidden">
          <img
            src={item.image || 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=600&auto=format&fit=crop&q=80'}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=600&auto=format&fit=crop&q=80';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none opacity-60" />
          
          {/* Top Status and Category Tags */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
            <div>{getStatusBadge()}</div>
            <span className="text-[10px] font-semibold text-slate-800 bg-white/90 backdrop-blur-md px-2 py-0.5 rounded-md border border-stone-200 shadow-xs">
              {item.category}
            </span>
          </div>

          {/* Reference ID Pill */}
          <div className="absolute bottom-2.5 left-3 text-[10px] font-mono font-medium text-white/90 bg-black/40 backdrop-blur-xs px-2 py-0.5 rounded">
            {item.id}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-5">
          <h3 className="font-bold text-slate-900 text-base mb-1.5 line-clamp-1 group-hover:text-orange-600 transition-colors">
            {item.title}
          </h3>
          <p className="text-slate-600 text-xs line-clamp-2 mb-4 leading-relaxed font-normal">
            {item.description}
          </p>

          {/* Meta Details: Location & Date */}
          <div className="space-y-1.5 text-[11px] text-slate-600 border-t border-stone-100 pt-3">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-orange-600 shrink-0" />
              <span className="line-clamp-1 font-medium text-slate-700">{item.location}</span>
            </div>
            <div className="flex items-center justify-between text-stone-700">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                <span>{item.date}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-stone-400" />
                <span>{item.time}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Card Footer Actions */}
      <div className="px-4 py-3 bg-stone-50/70 border-t border-stone-100 flex items-center justify-between gap-2">
        <button
          onClick={() => setActiveItemDetails(item)}
          className="text-xs font-semibold text-slate-700 hover:text-slate-900 flex items-center gap-1 transition-colors"
        >
          <Eye className="w-3.5 h-3.5 text-slate-400" />
          <span>View Details</span>
        </button>

        {item.type === 'found' && item.status !== 'recovered' ? (
          <button
            onClick={() => setActiveClaimItem(item)}
            className="text-xs font-semibold px-3 py-1.5 rounded-md bg-orange-600 hover:bg-orange-700 text-white transition-colors shadow-xs flex items-center gap-1"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Claim Item</span>
          </button>
        ) : item.type === 'lost' && item.status === 'lost' ? (
          <button
            onClick={() => setActiveItemDetails(item)}
            className="text-xs font-semibold px-3 py-1.5 rounded-md bg-stone-200 hover:bg-stone-300 text-slate-800 transition-colors"
          >
            <span>I Found This</span>
          </button>
        ) : (
          <span className="text-[11px] font-medium text-stone-400">
            Case Closed
          </span>
        )}
      </div>
    </div>
  );
};
