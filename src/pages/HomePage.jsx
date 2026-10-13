import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { HeroSection } from '../components/HeroSection';
import { ItemCard } from '../components/ItemCard';
import { 
  Search, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  Clock, 
  MapPin, 
  Users, 
  Lock, 
  Tag
} from 'lucide-react';

export const HomePage = () => {
  const { 
    items, 
    setCurrentView, 
    searchQuery, 
    setSearchQuery, 
    setShowSecurityHubsModal 
  } = useApp();

  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'lost' | 'found'

  // Quick category pills
  const popularTags = [
    'Boat Airdopes',
    'College ID Card',
    'Dell Charger',
    'Casio Calculator',
    'Backpack',
    'Keys',
    'Water Bottle'
  ];

  const handleTagClick = (tag) => {
    setSearchQuery(tag);
    setCurrentView('browse');
  };

  const handleHeroSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setCurrentView('browse');
    }
  };

  // Filter recently reported items
  const filteredItems = items.filter((item) => {
    if (activeTab === 'lost') return item.type === 'lost';
    if (activeTab === 'found') return item.type === 'found';
    return true;
  }).slice(0, 6);

  // Compute live metrics
  const totalLost = items.filter(i => i.type === 'lost').length;
  const totalFound = items.filter(i => i.type === 'found').length;
  const totalRecovered = items.filter(i => i.status === 'recovered').length;

  return (
    <div className="space-y-12 sm:space-y-16">
      
      {/* 1. Reference-accurate Hero Section */}
      <HeroSection />

      {/* 2. Interactive Search & Quick Tags Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-8 relative z-20">
        <div className="bg-white rounded-2xl shadow-xl border border-stone-200/90 p-4 sm:p-6">
          <form onSubmit={handleHeroSearchSubmit} className="flex flex-col md:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-5 h-5 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by item name (e.g., 'Boat Airdopes', 'ID Card', 'Keys', 'Backpack')..."
                className="w-full pl-12 pr-4 py-3.5 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition-all font-medium placeholder:text-stone-400"
              />
            </div>
            <button
              type="submit"
              className="w-full md:w-auto px-7 py-3.5 bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 shrink-0"
            >
              <Search className="w-4 h-4" />
              <span>Search Directory</span>
            </button>
          </form>

          {/* Quick Filter Tag Pills */}
          <div className="mt-4 pt-3 border-t border-stone-100 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-stone-700 font-semibold flex items-center gap-1">
              <Tag className="w-3.5 h-3.5 text-orange-600" /> Frequent Searches:
            </span>
            {popularTags.map((tag) => (
              <button
                key={tag}
                onClick={() => handleTagClick(tag)}
                className="px-3 py-1 rounded-full bg-stone-100 hover:bg-orange-50 hover:text-orange-700 text-slate-700 font-medium transition-colors border border-stone-200/60"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Live Campus Recovery Statistics Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 sm:p-8 bg-stone-900 text-white rounded-2xl shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="border-r border-stone-800 pr-4">
            <div className="text-2xl sm:text-3xl font-extrabold text-orange-400 font-mono">
              {totalLost + 14}
            </div>
            <div className="text-xs text-stone-400 font-medium mt-1">Lost Reports Logged</div>
          </div>
          <div className="border-r border-stone-800 pr-4">
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono">
              {totalFound + 28}
            </div>
            <div className="text-xs text-stone-400 font-medium mt-1">Found Belongings Deposited</div>
          </div>
          <div className="border-r border-stone-800 pr-4">
            <div className="text-2xl sm:text-3xl font-extrabold text-blue-400 font-mono">
              {totalRecovered + 31}
            </div>
            <div className="text-xs text-stone-400 font-medium mt-1">Reunited with Owners</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-mono">
              92.4%
            </div>
            <div className="text-xs text-stone-400 font-medium mt-1">Verified Return Success</div>
          </div>
        </div>
      </section>

      {/* 4. Most Common Lost Items — 8 items in 2 rows of 4 */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-orange-600 mb-1">
              Frequently Lost
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Most Common Lost Items on Campus
            </h2>
            <p className="text-stone-700 text-xs sm:text-sm mt-1">
              These items are reported most often across Hi-Tech Institute campus — check before you claim.
            </p>
          </div>
          <button
            onClick={() => setCurrentView('browse')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-slate-800 font-bold text-xs shadow-xs hover:shadow-md transition-all self-start sm:self-auto shrink-0"
          >
            <span>View All Reports</span>
            <ArrowRight className="w-4 h-4 text-orange-600" />
          </button>
        </div>

        {/* 2-row grid of 4 columns */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-5">
          {[
            {
              name: 'Airbuds',
              category: 'Electronics',
              location: 'Computer Lab / Canteen',
              date: 'Oct 12, 2026',
              status: 'lost',
              ref: 'CF-1041',
              image: '/item-airbuds.jpg',
            },
            {
              name: 'College ID Card',
              category: 'Identity Document',
              location: 'Main Gate / Library',
              date: 'Oct 11, 2026',
              status: 'found',
              ref: 'CF-1038',
              image: '/item-college-id.jpg',
            },
            {
              name: 'Laptop Adapter',
              category: 'Electronics',
              location: 'Block A — Room 204',
              date: 'Oct 10, 2026',
              status: 'lost',
              ref: 'CF-1035',
              image: '/item-laptop-adapter.jpg',
            },
            {
              name: 'Wallet',
              category: 'Personal Accessory',
              location: 'Canteen / Sports Ground',
              date: 'Oct 10, 2026',
              status: 'found',
              ref: 'CF-1034',
              image: '/item-wallet.jpg',
            },
            {
              name: 'Calculator',
              category: 'Stationery / Academic',
              location: 'Examination Hall / Lab',
              date: 'Oct 09, 2026',
              status: 'lost',
              ref: 'CF-1031',
              image: '/item-calculator.jpg',
            },
            {
              name: 'Watch',
              category: 'Personal Accessory',
              location: 'Sports Ground / Gym',
              date: 'Oct 09, 2026',
              status: 'lost',
              ref: 'CF-1030',
              image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80',
            },
            {
              name: 'Key Chain',
              category: 'Personal Accessory',
              location: 'Hostel / Parking Area',
              date: 'Oct 08, 2026',
              status: 'found',
              ref: 'CF-1027',
              image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&auto=format&fit=crop&q=80',
            },
            {
              name: 'Sunglasses',
              category: 'Personal Accessory',
              location: 'Quadrangle / Canteen',
              date: 'Oct 08, 2026',
              status: 'found',
              ref: 'CF-1026',
              image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&auto=format&fit=crop&q=80',
            },
          ].map((item) => (
            <div
              key={item.ref}
              className="bg-white rounded-2xl border border-stone-200 shadow-xs hover:shadow-md transition-all overflow-hidden group cursor-pointer"
              onClick={() => setCurrentView('browse')}
            >
              {/* Image */}
              <div className="relative h-36 sm:h-40 overflow-hidden bg-stone-100">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {/* Status badge */}
                <span className={`absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  item.status === 'lost'
                    ? 'bg-rose-600 text-white'
                    : 'bg-emerald-600 text-white'
                }`}>
                  {item.status === 'lost' ? 'Lost' : 'Found'}
                </span>
              </div>

              {/* Info */}
              <div className="p-3">
                <h3 className="text-sm font-bold text-slate-900 truncate">{item.name}</h3>
                <p className="text-[10px] text-stone-500 font-medium mb-2">{item.category}</p>

                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-[10px] text-stone-600">
                    <MapPin className="w-3 h-3 text-orange-500 shrink-0" />
                    <span className="truncate">{item.location}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-stone-500">
                    <Clock className="w-3 h-3 shrink-0" />
                    <span>{item.date}</span>
                  </div>
                </div>

                <div className="mt-2.5 flex items-center justify-between">
                  <span className="text-[9px] font-mono text-stone-400">#{item.ref}</span>
                  <span className="text-[10px] font-bold text-orange-600 hover:text-orange-700">
                    View →
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Explore Complete Campus Directory ── */}
        <div className="mt-14">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-1">
                Full Item Catalogue
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                Explore Complete Campus Directory
              </h2>
              <p className="text-stone-600 text-xs mt-1">
                Browse all categories of items that frequently go missing on campus.
              </p>
            </div>
            <button
              onClick={() => setCurrentView('browse')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition-all self-start sm:self-auto shrink-0"
            >
              Browse All Items
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-5">
            {[
              {
                name: 'Power Bank',
                image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=600&auto=format&fit=crop&q=80',
                count: 9,
              },
              {
                name: 'Headphone',
                image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
                count: 7,
              },
              {
                name: 'Water Bottle',
                image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&auto=format&fit=crop&q=80',
                count: 14,
              },
              {
                name: 'Umbrella',
                image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600&auto=format&fit=crop&q=80',
                count: 6,
              },
              {
                name: 'Phone Charger',
                image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600&auto=format&fit=crop&q=80',
                count: 11,
              },
              {
                name: 'Geometry Box & Drafter',
                image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&auto=format&fit=crop&q=80',
                count: 8,
              },
              {
                name: 'Notebook',
                image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80',
                count: 13,
              },
              {
                name: 'Helmet',
                image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&auto=format&fit=crop&q=80',
                count: 5,
              },
            ].map((item) => (
              <div
                key={item.name}
                className="relative bg-white rounded-2xl border border-stone-200 shadow-xs hover:shadow-md transition-all overflow-hidden group cursor-pointer"
                onClick={() => setCurrentView('browse')}
              >
                <div className="h-32 sm:h-36 overflow-hidden bg-stone-100">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-3 flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 leading-tight">{item.name}</h3>
                    <p className="text-[10px] text-stone-500 mt-0.5">{item.count} reports</p>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. "How It Works" Section (Report, Match, Recover) */}
      <section id="how-it-works" className="bg-stone-50/70 border-y border-stone-200 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-orange-600 mb-2 inline-block">
              Standard Operating Procedure
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              How CampusFind Works in 3 Simple Steps
            </h2>
            <p className="text-stone-700 text-xs sm:text-sm mt-2">
              A transparent, safe, and proctor-verified recovery process for students and faculty.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Step 1 */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-xs relative">
              <div className="w-12 h-12 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-lg mb-5">
                01
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">
                1. Report the Item
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed mb-4">
                Lost an earbud or found a college ID? Submit the details with category, last-seen location, photo preview, and private identifying marks.
              </p>
              <div className="text-[11px] font-semibold text-orange-700 bg-orange-50 px-3 py-1.5 rounded-lg inline-flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" /> Takes under 60 seconds
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-xs relative">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-[#3b5bf5] flex items-center justify-center font-bold text-lg mb-5">
                02
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">
                2. Automated Matching & Deposit
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed mb-4">
                Found items are deposited at designated campus security desks (Gate 1, Central Library, or Proctor Office). System flags matching reports.
              </p>
              <div className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg inline-flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" /> Physical custody logged
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-xs relative">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-lg mb-5">
                03
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">
                3. Verify Ownership & Recover
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed mb-4">
                Submit a claim with private details (serial no., screen unlock, unique mark). Once security staff approves, collect your item with your student ID.
              </p>
              <div className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-lg inline-flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" /> Zero false handover guarantee
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 6. Campus Physical Hubs Highlight */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-10 rounded-2xl bg-gradient-to-br from-stone-900 to-slate-900 text-white relative overflow-hidden border border-stone-800">
          <div className="max-w-2xl relative z-10">
            <span className="text-xs font-bold text-orange-400 uppercase tracking-wider mb-2 block">
              Official Custody Counters
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-4">
              Physical Lost-and-Found Desks Across Campus
            </h2>
            <p className="text-stone-300 text-xs sm:text-sm leading-relaxed mb-6 font-normal">
              Found an expensive belonging? Please hand it over to one of our 4 official proctor desks rather than keeping it. Items are cataloged with security seal and high-res photos.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => setShowSecurityHubsModal(true)}
                className="px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
              >
                <MapPin className="w-4 h-4" />
                <span>View All Desk Locations & Hours</span>
              </button>
              <button
                onClick={() => setCurrentView('report-found')}
                className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl transition-colors"
              >
                Report Drop-Off Now
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Safety, Verification & Anti-Fraud Guarantees */}
      <section id="safety-guide" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-4">
        <div className="border border-stone-200 rounded-2xl p-6 sm:p-8 bg-white">
          <div className="flex items-center gap-2 mb-4">
            <ShieldCheck className="w-6 h-6 text-emerald-600" />
            <h3 className="text-lg font-bold text-slate-900">CampusFind Trust & Verification Safeguards</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-stone-600">
            <div>
              <h4 className="font-bold text-slate-800 mb-1 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                Zero-Dox Privacy Shield
              </h4>
              <p className="leading-relaxed">
                Personal mobile numbers and hostel room numbers are never published publicly. All handovers happen via official campus security counters.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-slate-800 mb-1 flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-blue-600 shrink-0" />
                Double Blind Verification
              </h4>
              <p className="leading-relaxed">
                Unique characteristics (such as serial numbers or hidden scratches) are kept confidential so only the rightful owner can substantiate a claim.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-slate-800 mb-1 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-orange-600 shrink-0" />
                College ERP Verified Roll Numbers
              </h4>
              <p className="leading-relaxed">
                Every claimant must furnish their Hi-Tech Institute Roll Number and present their physical college ID card during collection.
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
