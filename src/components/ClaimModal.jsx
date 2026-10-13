import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  ShieldCheck, 
  Upload, 
  AlertCircle 
} from 'lucide-react';

export const ClaimModal = () => {
  const { 
    activeClaimItem, 
    setActiveClaimItem, 
    currentUser, 
    submitClaim 
  } = useApp();

  const [claimantName, setClaimantName] = useState(currentUser?.name || '');
  const [claimantRoll, setClaimantRoll] = useState(currentUser?.rollNo || '');
  const [claimantEmail, setClaimantEmail] = useState(currentUser?.email || '');
  const [proofDescription, setProofDescription] = useState('');
  const [verificationAnswer, setVerificationAnswer] = useState('');
  const [evidencePreview, setEvidencePreview] = useState(null);
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!activeClaimItem) return null;

  const item = activeClaimItem;

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEvidencePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!claimantName.trim()) {
      setError('Please provide your full name.');
      return;
    }
    if (!claimantRoll.trim()) {
      setError('Please provide your College Roll Number or Employee ID.');
      return;
    }
    if (!proofDescription.trim() || proofDescription.length < 15) {
      setError('Please describe specific proof of ownership in detail (min 15 chars).');
      return;
    }
    if (!termsAgreed) {
      setError('You must confirm the truthfulness of your claim.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      submitClaim({
        itemId: item.id,
        itemTitle: item.title,
        claimantName,
        claimantRoll,
        claimantEmail,
        proofDescription: `${proofDescription} ${verificationAnswer ? `[Answer to Challenge: ${verificationAnswer}]` : ''}`,
        evidenceImage: evidencePreview
      });

      setIsSubmitting(false);
      setActiveClaimItem(null);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative bg-white rounded-2xl max-w-xl w-full overflow-hidden shadow-2xl border border-stone-200 my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-stone-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">Claim Ownership of Item</h3>
              <p className="text-[11px] text-stone-500">Security Verification Protocol • Hi-Tech Institute</p>
            </div>
          </div>
          <button
            onClick={() => setActiveClaimItem(null)}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Item Summary Card */}
        <div className="p-4 mx-6 mt-4 rounded-xl bg-orange-50/50 border border-orange-200/60 flex items-center gap-3">
          <img
            src={item.image}
            alt={item.title}
            className="w-14 h-14 rounded-lg object-cover border border-stone-200 shrink-0"
          />
          <div className="min-w-0 flex-1">
            <div className="text-[10px] font-mono font-bold text-orange-700 uppercase">
              {item.id} • {item.category}
            </div>
            <div className="font-bold text-slate-900 text-sm truncate">{item.title}</div>
            <div className="text-[11px] text-stone-600 truncate">
              Found at: {item.location} ({item.date})
            </div>
          </div>
        </div>

        {/* Claim Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={claimantName}
                onChange={(e) => setClaimantName(e.target.value)}
                placeholder="e.g. Zaid Saifee"
                className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-orange-500"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Roll No. / Staff ID <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={claimantRoll}
                onChange={(e) => setClaimantRoll(e.target.value)}
                placeholder="e.g. 220132010045"
                className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-orange-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Official College Email
            </label>
            <input
              type="email"
              value={claimantEmail}
              onChange={(e) => setClaimantEmail(e.target.value)}
              placeholder="e.g. rollno@hitech.ac.in"
              className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-orange-500"
            />
          </div>

          {/* Verification Challenge (if item has one) */}
          {item.verificationQuestion && (
            <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-200 text-xs">
              <label className="block font-bold text-blue-900 mb-1">
                Security Question: "{item.verificationQuestion}" <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={verificationAnswer}
                onChange={(e) => setVerificationAnswer(e.target.value)}
                placeholder="Your secret answer matching the item..."
                className="w-full px-3 py-1.5 text-xs bg-white border border-blue-300 rounded-lg focus:outline-none focus:border-blue-600"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Proof of Ownership Details <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows="3"
              value={proofDescription}
              onChange={(e) => setProofDescription(e.target.value)}
              placeholder="Describe unique marks, serial number prefix, stickers, lockscreen wallpaper, or internal contents not shown in public photos..."
              className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-orange-500 leading-relaxed"
              required
            ></textarea>
            <span className="text-[10px] text-stone-700">
              Only authorized proctor & security officers will inspect these proof details.
            </span>
          </div>

          {/* Optional Proof Evidence Image */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Supporting Evidence (Purchase Bill, Serial Photo, Box Photo - Optional)
            </label>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 px-3 py-2 bg-stone-50 border border-dashed border-stone-300 hover:border-orange-500 rounded-lg cursor-pointer text-xs text-stone-600 transition-colors">
                <Upload className="w-4 h-4 text-stone-400" />
                <span>Upload Evidence Photo</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
              {evidencePreview && (
                <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-stone-200">
                  <img src={evidencePreview} alt="Preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setEvidencePreview(null)}
                    className="absolute top-0 right-0 bg-black/60 text-white rounded-bl p-0.5"
                  >
                    <X className="w-2.5 h-2.5" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Declaration Checkbox */}
          <div className="pt-2">
            <label className="flex items-start gap-2.5 text-xs text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={termsAgreed}
                onChange={(e) => setTermsAgreed(e.target.checked)}
                className="mt-0.5 rounded border-stone-300 text-orange-600 focus:ring-orange-500"
              />
              <span className="leading-snug">
                I solemnly affirm under student code of conduct that this item is my personal property. 
                I understand false claims constitute disciplinary misconduct.
              </span>
            </label>
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-stone-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setActiveClaimItem(null)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 text-xs font-bold bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
            >
              {isSubmitting ? 'Verifying...' : 'Submit Claim Request'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
