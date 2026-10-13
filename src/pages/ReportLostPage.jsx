import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ITEM_CATEGORIES, CAMPUS_LOCATIONS } from '../data/mockData';
import { 
  Search, 
  Upload, 
  X, 
  AlertCircle, 
  CheckCircle2, 
  ShieldAlert 
} from 'lucide-react';

export const ReportLostPage = () => {
  const { addItem, setCurrentView, currentUser } = useApp();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Electronics & Gadgets');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('Central Library (2nd Floor)');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('02:00 PM');
  const [identifyingMarks, setIdentifyingMarks] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState('');
  const [successItem, setSuccessItem] = useState(null);

  const samplePhotoUrls = [
    { label: 'Boat Earbuds', url: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80' },
    { label: 'Backpack', url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80' },
    { label: 'Water Bottle', url: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&auto=format&fit=crop&q=80' },
    { label: 'Keys', url: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?w=600&auto=format&fit=crop&q=80' }
  ];

  const handleImageFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Item title is required.');
      return;
    }
    if (!description.trim() || description.length < 15) {
      setError('Please provide a detailed description (minimum 15 characters).');
      return;
    }

    const newItem = addItem({
      type: 'lost',
      title,
      category,
      description,
      location,
      date,
      time,
      identifyingMarks,
      image: imagePreview || 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=600&auto=format&fit=crop&q=80',
      custodyLocation: 'N/A (Still Lost)'
    });

    setSuccessItem(newItem);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      
      {/* Success Notification Modal */}
      {successItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 text-center shadow-2xl border border-stone-200 space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-extrabold text-slate-900">
              Lost Report Logged Successfully!
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Your lost item report has been published to the campus bulletin and forwarded to the security desk at <strong>{location}</strong>.
            </p>
            <div className="p-3 bg-stone-100 rounded-xl font-mono text-sm font-bold text-slate-800">
              Ref ID: {successItem.id}
            </div>
            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => {
                  setSuccessItem(null);
                  setCurrentView('browse');
                }}
                className="flex-1 px-4 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs rounded-xl transition-colors shadow-xs"
              >
                View in Directory
              </button>
              <button
                onClick={() => {
                  setSuccessItem(null);
                  setCurrentView('dashboard');
                }}
                className="flex-1 px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-slate-800 font-bold text-xs rounded-xl transition-colors"
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="border-b border-stone-200 pb-6 mb-8">
        <span className="text-xs font-bold uppercase tracking-wider text-rose-600 block mb-1">
          Incident Reporting
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Report a Lost Belonging
        </h1>
        <p className="text-stone-700 text-xs sm:text-sm mt-1">
          Submit the details of your misplaced item. Once filed, campus security and students will be able to search and flag sightings.
        </p>
      </div>

      {/* Form Container */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-xs">
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Item Name & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                Item Title / Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Boat Airdopes 141 (Black Case)"
                className="w-full px-3.5 py-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:border-orange-500 font-medium"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                Category <span className="text-rose-500">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:border-orange-500 font-medium cursor-pointer"
              >
                {ITEM_CATEGORIES.filter(c => c !== 'All Categories').map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">
              Comprehensive Description <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows="3"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Color, brand, shape, scratches, stickers, condition, contents, or circumstances of loss..."
              className="w-full px-3.5 py-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:border-orange-500 font-medium leading-relaxed"
              required
            ></textarea>
            <span className="text-[11px] text-stone-700">
              Provide thorough visual details so finders can recognize your item quickly.
            </span>
          </div>

          {/* Location & Date / Time */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                Last-Seen Location <span className="text-rose-500">*</span>
              </label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:border-orange-500 font-medium cursor-pointer"
              >
                {CAMPUS_LOCATIONS.filter(l => l !== 'All Campus Locations').map((loc) => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                Date Misplaced <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:border-orange-500 font-medium cursor-pointer"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                Approximate Time
              </label>
              <input
                type="text"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="e.g. 02:30 PM"
                className="w-full px-3.5 py-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:border-orange-500 font-medium"
              />
            </div>
          </div>

          {/* Private Identifying Details */}
          <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200/80 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
              <ShieldAlert className="w-4 h-4 text-amber-600" />
              <span>Private Distinguishing Proof (Kept Confidential)</span>
            </div>
            <p className="text-[11px] text-stone-700 leading-relaxed">
              Enter details that ONLY you know (e.g. serial number suffix, specific wallpaper, small cut, engraving). 
              This will be used to verify ownership when someone claims to have found it.
            </p>
            <input
              type="text"
              value={identifyingMarks}
              onChange={(e) => setIdentifyingMarks(e.target.value)}
              placeholder="e.g. Batman logo sticker, serial barcode ends in 49B"
              className="w-full px-3 py-2 text-xs bg-white border border-amber-300 rounded-lg focus:outline-none focus:border-amber-600 font-medium"
            />
          </div>

          {/* Image Upload or Quick Sample Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">
              Item Photograph (Upload from Device or pick a demo asset)
            </label>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <label className="flex items-center gap-2 px-4 py-3 bg-stone-50 hover:bg-stone-100 border border-dashed border-stone-300 hover:border-orange-500 rounded-xl cursor-pointer text-xs font-semibold text-slate-700 transition-colors">
                <Upload className="w-4 h-4 text-stone-500" />
                <span>Upload Photo from Computer</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageFile}
                  className="hidden"
                />
              </label>

              {/* Sample Photo Presets */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] text-stone-700">Quick presets:</span>
                {samplePhotoUrls.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => setImagePreview(preset.url)}
                    className="px-2.5 py-1 text-[11px] font-medium bg-stone-100 hover:bg-stone-200 text-slate-700 rounded-md border border-stone-200"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Photo Preview */}
            {imagePreview && (
              <div className="mt-3 relative inline-block">
                <img
                  src={imagePreview}
                  alt="Item Preview"
                  className="w-28 h-28 object-cover rounded-xl border border-stone-200 shadow-xs"
                />
                <button
                  type="button"
                  onClick={() => setImagePreview(null)}
                  className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-rose-600 text-white flex items-center justify-center hover:bg-rose-700 shadow-xs"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Submitter Credentials Summary */}
          <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-600 flex items-center justify-between">
            <div>
              <span className="font-bold text-slate-900">Reporter Identity: </span>
              <span>{currentUser?.name || 'Zaid Saifee'} (Roll: {currentUser?.rollNo || '220132010045'})</span>
            </div>
            <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded text-[11px]">
              Hi-Tech Student Verified
            </span>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-stone-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setCurrentView('browse')}
              className="px-5 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-7 py-3 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs rounded-xl shadow-xs hover:shadow-md transition-all flex items-center gap-2"
            >
              <Search className="w-4 h-4" />
              <span>Publish Lost Item Report</span>
            </button>
          </div>

        </form>
      </div>

    </div>
  );
};
