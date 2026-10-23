import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  Camera, 
  User, 
  Mail, 
  GraduationCap, 
  ShieldCheck, 
  Phone, 
  Check, 
  Loader2, 
  AlertCircle,
  UploadCloud
} from 'lucide-react';

export const ProfileModal = ({ isOpen, onClose }) => {
  const { currentUser, updateProfile, uploadUserAvatar, addToast } = useApp();

  const fileInputRef = useRef(null);
  const [fullName, setFullName] = useState(currentUser?.name || '');
  const [department, setDepartment] = useState(currentUser?.department || 'Computer Science & Engineering');
  const [academicYear, setAcademicYear] = useState(currentUser?.year || '3rd Year (5th Sem)');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !currentUser) return null;

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file (PNG, JPG, WEBP).');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be under 5MB.');
      return;
    }

    setError('');
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = () => setAvatarPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');

    if (!fullName.trim()) {
      setError('Full name cannot be empty.');
      return;
    }

    setIsSaving(true);
    try {
      let newAvatarUrl = currentUser.avatar;

      // Upload avatar to Supabase Storage if a new file was chosen
      if (selectedFile) {
        newAvatarUrl = await uploadUserAvatar(selectedFile);
      }

      // Update profile in Supabase
      await updateProfile({
        fullName: fullName.trim(),
        department: department.trim(),
        academicYear: academicYear.trim(),
        phone: phone.trim(),
        avatarUrl: newAvatarUrl
      });

      onClose();
    } catch (err) {
      console.error('Error saving profile:', err);
      setError(err.message || 'Could not save profile changes.');
    } finally {
      setIsSaving(false);
    }
  };

  const currentDisplayAvatar = avatarPreview || currentUser.avatar;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-stone-200 my-6">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-stone-50/70">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">My Campus Profile</h3>
              <p className="text-[11px] text-stone-500">Manage your verified student credentials and photo</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSave} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Avatar Upload Banner */}
          <div className="flex items-center gap-5 p-4 rounded-2xl bg-gradient-to-br from-stone-50 to-orange-50/30 border border-stone-200">
            <div className="relative group shrink-0">
              <div className="w-20 h-20 rounded-2xl overflow-hidden ring-4 ring-white shadow-md bg-stone-200 flex items-center justify-center">
                {currentDisplayAvatar ? (
                  <img
                    src={currentDisplayAvatar}
                    alt={currentUser.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-orange-500 to-amber-600 text-white font-extrabold flex items-center justify-center text-2xl select-none">
                    {(fullName || 'U').charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-1.5 -right-1.5 p-2 bg-slate-900 text-white rounded-xl shadow-md hover:bg-orange-600 transition-colors"
                title="Upload Photo"
              >
                <Camera className="w-3.5 h-3.5" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 mb-0.5">
                <span>Profile Picture</span>
                <span className="text-[10px] text-emerald-700 bg-emerald-100 font-extrabold px-1.5 py-0.2 rounded flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  Verified
                </span>
              </div>
              <p className="text-[11px] text-stone-500 leading-relaxed mb-2">
                Upload a real photo to help campus security verify your identity during lost item pickups.
              </p>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1 transition-colors"
              >
                <UploadCloud className="w-3.5 h-3.5" />
                <span>{selectedFile ? 'Change Selected Photo' : 'Upload New Photo (Max 5MB)'}</span>
              </button>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-4 text-xs">
            
            {/* Full Name */}
            <div>
              <label className="block font-bold text-slate-800 mb-1">
                Full Legal Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter full name"
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:border-orange-500 font-medium"
                required
              />
            </div>

            {/* Readonly locked credentials */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-500 mb-1">
                  Student Roll / Staff ID
                </label>
                <input
                  type="text"
                  value={currentUser.rollNo || ''}
                  disabled
                  className="w-full px-3.5 py-2 bg-stone-100 border border-stone-200 rounded-xl text-stone-600 font-mono font-bold cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-500 mb-1">
                  College Email
                </label>
                <input
                  type="email"
                  value={currentUser.email || ''}
                  disabled
                  className="w-full px-3.5 py-2 bg-stone-100 border border-stone-200 rounded-xl text-stone-600 font-medium cursor-not-allowed truncate"
                />
              </div>
            </div>

            {/* Department */}
            <div>
              <label className="block font-bold text-slate-800 mb-1">
                Department / Branch
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:border-orange-500 font-medium cursor-pointer"
              >
                <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                <option value="Information Technology">Information Technology</option>
                <option value="Electronics & Communication">Electronics & Communication</option>
                <option value="Mechanical Engineering">Mechanical Engineering</option>
                <option value="Civil Engineering">Civil Engineering</option>
                <option value="Management & MBA">Management & MBA</option>
                <option value="Campus Security & Proctorial Desk">Campus Security & Proctorial Desk</option>
              </select>
            </div>

            {/* Year / Semester & Phone */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Academic Year / Status
                </label>
                <input
                  type="text"
                  value={academicYear}
                  onChange={(e) => setAcademicYear(e.target.value)}
                  placeholder="e.g. 3rd Year (5th Sem)"
                  className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:border-orange-500 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Contact Phone (Optional)
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:border-orange-500 font-medium"
                />
              </div>
            </div>

          </div>

          {/* Action buttons */}
          <div className="pt-3 border-t border-stone-200 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="px-4 py-2.5 rounded-xl border border-stone-200 text-slate-700 font-bold hover:bg-stone-50 transition-colors text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Saving Changes...</span>
                </>
              ) : (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Save Profile</span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
