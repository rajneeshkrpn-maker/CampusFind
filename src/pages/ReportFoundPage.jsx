import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ITEM_CATEGORIES, CAMPUS_LOCATIONS } from '../data/mockData';
import { 
  PackagePlus, 
  Upload, 
  X, 
  AlertCircle, 
  CheckCircle2, 
  ShieldCheck 
} from 'lucide-react';

export const ReportFoundPage = () => {
  const { addItem, setCurrentView, currentUser } = useApp();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Electronics & Gadgets');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('Campus Canteen & Nescafe Stall');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('11:30 AM');
  const [custodyLocation, setCustodyLocation] = useState('Main Security Gate 1 Desk');
  const [verificationQuestion, setVerificationQuestion] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState('');
  const [successItem, setSuccessItem] = useState(null);

  const samplePhotoPresets = [
    { label: 'Student ID Card', url: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80' },
    { label: 'Casio Calculator', url: 'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?w=600&auto=format&fit=crop&q=80' },
    { label: 'Laptop Charger', url: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600&auto=format&fit=crop&q=80' },
    { label: 'Keys with Strap', url: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?w=600&auto=format&fit=crop&q=80' }
  ];

  const custodyOptions = [
    'Main Security Gate 1 Desk',
    'Central Library Ground Floor Circulation Counter',
    'Student Welfare & Proctor Office (Room 12)',
    'Sports Complex Equipment Counter',
    'Currently in My Possession (Will surrender to Security Desk)'
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
      type: 'found',
      title,
      category,
      description,
      location,
      date,
      time,
      custodyLocation,
      verificationQuestion: verificationQuestion.trim() || 'Describe internal marks or specific accessories to verify ownership.',
      image: imagePreview || 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80'
    });

    setSuccessItem(newItem);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      
      {/* Success Modal */}
      {successItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 text-center shadow-2xl border border-stone-200 space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-extrabold text-slate-900">
              Found Item Registered!
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Thank you for being a responsible member of Hi-Tech Institute! 
              The item is cataloged under custody: <strong>{custodyLocation}</strong>.
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
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 block mb-1">
          Good Samaritan Deposit
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Report a Found Item
        </h1>
        <p className="text-stone-700 text-xs sm:text-sm mt-1">
          Help reunite a fellow student or professor with their missing belongings. Register the discovery and indicate custody location.
        </p>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-xs">
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Title & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                Found Item Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Casio Scientific Calculator or Student ID Card"
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
              Public Visual Description <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows="3"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Color, general model, condition, where it was resting. Do NOT reveal private contents or full serial numbers here..."
              className="w-full px-3.5 py-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:border-orange-500 font-medium leading-relaxed"
              required
            ></textarea>
            <span className="text-[11px] text-stone-700">
              Keep sensitive identifying numbers concealed so true ownership can be verified later.
            </span>
          </div>

          {/* Discovered Location & Date */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                Where Was It Discovered? <span className="text-rose-500">*</span>
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
                Date Discovered <span className="text-rose-500">*</span>
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
                Time Discovered
              </label>
              <input
                type="text"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="e.g. 11:30 AM"
                className="w-full px-3.5 py-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:border-orange-500 font-medium"
              />
            </div>
          </div>

          {/* Physical Custody Desk */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">
              Current Physical Custody Drop-Off Location <span className="text-rose-500">*</span>
            </label>
            <select
              value={custodyLocation}
              onChange={(e) => setCustodyLocation(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:border-orange-500 font-medium cursor-pointer"
            >
              {custodyOptions.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
            <span className="text-[11px] text-stone-700 mt-1 block">
              We strongly recommend dropping items at Gate 1 or Central Library for physical security.
            </span>
          </div>

          {/* Verification Challenge Question */}
          <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-blue-900">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span>Concealed Verification Question (Anti-Imposter Filter)</span>
            </div>
            <p className="text-[11px] text-stone-700 leading-relaxed">
              Ask a question that only the true owner would know the answer to (e.g. "What sticker is inside?", "What name is stamped on the strap?").
            </p>
            <input
              type="text"
              value={verificationQuestion}
              onChange={(e) => setVerificationQuestion(e.target.value)}
              placeholder="e.g. What color is the keychain attachment or what initials are engraved?"
              className="w-full px-3 py-2 text-xs bg-white border border-blue-300 rounded-lg focus:outline-none focus:border-blue-600 font-medium"
            />
          </div>

          {/* Item Photo */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">
              Photograph of Found Item
            </label>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <label className="flex items-center gap-2 px-4 py-3 bg-stone-50 hover:bg-stone-100 border border-dashed border-stone-300 hover:border-orange-500 rounded-xl cursor-pointer text-xs font-semibold text-slate-700 transition-colors">
                <Upload className="w-4 h-4 text-stone-500" />
                <span>Upload Photograph</span>
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
                {samplePhotoPresets.map((preset) => (
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

            {imagePreview && (
              <div className="mt-3 relative inline-block">
                <img
                  src={imagePreview}
                  alt="Found item"
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

          {/* Submitter Credentials */}
          <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-600 flex items-center justify-between">
            <div>
              <span className="font-bold text-slate-900">Found By: </span>
              {currentUser ? (
                <span>{currentUser.name} ({currentUser.role || 'Student'})</span>
              ) : (
                <span className="text-stone-700 font-medium">Campus Good Samaritan</span>
              )}
            </div>
            <span className="text-blue-700 font-semibold bg-blue-50 px-2 py-0.5 rounded text-[11px]">
              Hi-Tech Campus Honor Code
            </span>
          </div>

          {/* Actions */}
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
              className="px-7 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs hover:shadow-md transition-all flex items-center gap-2"
            >
              <PackagePlus className="w-4 h-4" />
              <span>Register Found Item</span>
            </button>
          </div>

        </form>
      </div>

    </div>
  );
};
