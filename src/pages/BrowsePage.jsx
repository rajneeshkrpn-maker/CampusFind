import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { ItemCard } from '../components/ItemCard';
import { ITEM_CATEGORIES, CAMPUS_LOCATIONS } from '../data/mockData';
import { 
  Search, 
  RotateCcw, 
  LayoutGrid, 
  List, 
  ChevronDown, 
  X, 
  PackageSearch, 
  MapPin, 
  Calendar 
} from 'lucide-react';

export const BrowsePage = () => {
  const { 
    items, 
    searchQuery, 
    setSearchQuery, 
    filterType, 
    setFilterType, 
    filterCategory, 
    setFilterCategory, 
    filterLocation, 
    setFilterLocation,
    setActiveItemDetails,
    setActiveClaimItem
  } = useApp();

  const [sortBy, setSortBy] = useState('newest'); // 'newest' | 'oldest' | 'title'
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'

  // Filtered & Sorted items
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // Type filter
      if (filterType !== 'all') {
        if (filterType === 'lost' && item.type !== 'lost') return false;
        if (filterType === 'found' && item.type !== 'found') return false;
        if (filterType === 'recovered' && item.status !== 'recovered') return false;
      }

      // Category filter
      if (filterCategory !== 'All Categories' && item.category !== filterCategory) {
        return false;
      }

      // Location filter
      if (filterLocation !== 'All Campus Locations' && item.location !== filterLocation) {
        return false;
      }

      // Search Query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchTitle = item.title.toLowerCase().includes(query);
        const matchDesc = item.description.toLowerCase().includes(query);
        const matchLoc = item.location.toLowerCase().includes(query);
        const matchId = item.id.toLowerCase().includes(query);
        const matchCat = item.category.toLowerCase().includes(query);
        if (!matchTitle && !matchDesc && !matchLoc && !matchId && !matchCat) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.date) - new Date(a.date);
      }
      if (sortBy === 'oldest') {
        return new Date(a.date) - new Date(b.date);
      }
      if (sortBy === 'title') {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });
  }, [items, filterType, filterCategory, filterLocation, searchQuery, sortBy]);

  const resetFilters = () => {
    setSearchQuery('');
    setFilterType('all');
    setFilterCategory('All Categories');
    setFilterLocation('All Campus Locations');
    setSortBy('newest');
  };

  const hasActiveFilters = 
    searchQuery.trim() !== '' || 
    filterType !== 'all' || 
    filterCategory !== 'All Categories' || 
    filterLocation !== 'All Campus Locations';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-stone-200 pb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-orange-600 block mb-1">
            Campus Catalog
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Browse Lost & Found Items
          </h1>
          <p className="text-stone-700 text-xs sm:text-sm mt-1">
            Real-time registry of all belongings reported at Hi-Tech Institute of Engineering.
          </p>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-stone-100 p-1 rounded-lg border border-stone-200">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === 'grid' ? 'bg-white text-slate-900 shadow-xs' : 'text-stone-700 hover:text-slate-900'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === 'list' ? 'bg-white text-slate-900 shadow-xs' : 'text-stone-700 hover:text-slate-900'
              }`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-4">
        
        {/* Search bar & Type tabs */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
          
          <div className="lg:col-span-6 relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by keywords, ID, marks..."
              className="w-full pl-10 pr-9 py-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:border-orange-500 font-medium"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Type status pills */}
          <div className="lg:col-span-6 flex flex-wrap items-center gap-1.5">
            {[
              { id: 'all', label: 'All Items' },
              { id: 'lost', label: 'Lost Reports' },
              { id: 'found', label: 'Found Belongings' },
              { id: 'recovered', label: 'Recovered' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilterType(tab.id)}
                className={`px-3 py-2 text-xs font-bold rounded-lg transition-all ${
                  filterType === tab.id
                    ? tab.id === 'lost'
                      ? 'bg-rose-600 text-white shadow-xs'
                      : tab.id === 'found'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-900 text-white shadow-xs'
                    : 'bg-stone-100 hover:bg-stone-200 text-slate-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

        </div>

        {/* Dropdown Filters Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-stone-100 text-xs">
          
          {/* Category Dropdown */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">
              Filter by Category
            </label>
            <div className="relative">
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full appearance-none px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-slate-800 font-medium focus:outline-none focus:border-orange-500 cursor-pointer pr-8"
              >
                {ITEM_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-stone-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Location Dropdown */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">
              Campus Location
            </label>
            <div className="relative">
              <select
                value={filterLocation}
                onChange={(e) => setFilterLocation(e.target.value)}
                className="w-full appearance-none px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-slate-800 font-medium focus:outline-none focus:border-orange-500 cursor-pointer pr-8"
              >
                {CAMPUS_LOCATIONS.map((loc) => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-stone-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Sort By Dropdown */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">
              Sort Sequence
            </label>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full appearance-none px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-slate-800 font-medium focus:outline-none focus:border-orange-500 cursor-pointer pr-8"
              >
                <option value="newest">Newest Reported First</option>
                <option value="oldest">Oldest First</option>
                <option value="title">Alphabetical (A - Z)</option>
              </select>
              <ChevronDown className="w-4 h-4 text-stone-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

        </div>

        {/* Results Counter & Reset Action */}
        <div className="flex items-center justify-between text-xs pt-1">
          <span className="font-semibold text-stone-500">
            Showing <strong className="text-slate-900">{filteredItems.length}</strong> items matching filters
          </span>
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="text-orange-600 hover:text-orange-700 font-bold flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset All Filters</span>
            </button>
          )}
        </div>

      </div>

      {/* Main Results Display */}
      {filteredItems.length === 0 ? (
        /* Empty State */
        <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center max-w-lg mx-auto space-y-4">
          <div className="w-16 h-16 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mx-auto">
            <PackageSearch className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">No Matching Items Found</h3>
          <p className="text-xs text-stone-500 leading-relaxed">
            We couldn't find any lost or found records that match your specific search terms or filter combinations.
          </p>
          <div className="pt-2">
            <button
              onClick={resetFilters}
              className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        </div>
      ) : viewMode === 'grid' ? (
        /* Grid View */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        /* List View */
        <div className="bg-white rounded-2xl border border-stone-200 divide-y divide-stone-100 overflow-hidden shadow-xs">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-stone-50/70 transition-colors"
            >
              <div className="flex items-center gap-4">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-16 h-16 rounded-xl object-cover border border-stone-200 shrink-0"
                />
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      item.type === 'lost' ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {item.type}
                    </span>
                    <span className="text-[10px] font-mono text-stone-400">{item.id}</span>
                    <span className="text-xs font-semibold text-stone-600 bg-stone-100 px-2 py-0.5 rounded">
                      {item.category}
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">{item.title}</h4>
                  <div className="flex items-center gap-3 text-[11px] text-stone-500">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-orange-600" /> {item.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-stone-400" /> {item.date}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                <button
                  onClick={() => setActiveItemDetails(item)}
                  className="px-3.5 py-1.5 rounded-lg border border-stone-200 text-slate-700 hover:bg-stone-100 text-xs font-bold transition-colors"
                >
                  View Details
                </button>
                {item.type === 'found' && item.status !== 'recovered' && (
                  <button
                    onClick={() => setActiveClaimItem(item)}
                    className="px-3.5 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold transition-colors shadow-xs"
                  >
                    Claim Item
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
