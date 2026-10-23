import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Bot, 
  X, 
  Send, 
  Sparkles, 
  ArrowRight, 
  Search, 
  ShieldCheck
} from 'lucide-react';

export const CAMPUS_FAQS = [
  {
    id: 1,
    question: 'Where can I report a lost or found item?',
    answer: 'You can report a lost or found belonging directly using the top navigation bar. Click "Report Lost Item" or "Report Found Item". Once submitted, your report is saved in Supabase and matched with existing entries.',
    actionLabel: 'Report Lost Item',
    actionView: 'report-lost'
  },
  {
    id: 2,
    question: 'How do I claim an item?',
    answer: 'To claim an item, open the "Browse Items" catalog, select the found item, and click "Claim This Item". You will be asked to privately provide unique identifying marks (such as a serial code, engraved initials, or sticker details) that only the rightful owner would know.',
    actionLabel: 'Browse Items Catalog',
    actionView: 'browse'
  },
  {
    id: 3,
    question: 'How can I track my claim?',
    answer: 'Visit your "My Dashboard" page and click on the "Submitted Claims" tab. You can track real-time verification status (Pending Review, Approved, or Rejected) and read remarks left by the duty security officer.',
    actionLabel: 'Open My Claims',
    actionView: 'dashboard'
  },
  {
    id: 4,
    question: 'How do I report a broken projector, damaged facility, or Wi-Fi issue?',
    answer: 'Use the "Campus Issues" button in the top navigation. Fill in the building, room number, category (Projector, Wi-Fi, Infrastructure, Cleanliness), and issue description. The estate and IT maintenance teams will be notified.',
    actionLabel: 'Report Campus Issue',
    actionView: 'campus-issues'
  },
  {
    id: 5,
    question: 'How can I check the status of my campus issue?',
    answer: 'Head to "My Dashboard" or the "Campus Issues" tracker. Reported issues follow a transparent lifecycle: Submitted → Under Review → In Progress → Resolved, complete with resolution notes from assigned technicians.',
    actionLabel: 'View Campus Issues',
    actionView: 'campus-issues'
  },
  {
    id: 6,
    question: 'How do I contact the authorized campus helpdesk?',
    answer: 'Hi-Tech Institute maintains a 24/7 Security & Proctorial Desk at Main Gate 1 (Campus Intercom Ext. 101). You can also click "Staff Portal → Campus Desks" in the navigation to view all custody points.',
    actionLabel: 'View Campus Desks',
    actionModal: 'security-hubs'
  },
  {
    id: 7,
    question: 'Where can I find official college notices or campus information?',
    answer: 'Verified campus security desk counters, custody points, and proctorial notices are displayed under "Staff Portal → Campus Desks" in the main navigation. You can also view recovery protocols in the footer of this portal.',
    actionLabel: 'View Campus Desks',
    actionModal: 'security-hubs'
  }
];

export const CampusAIAssistantModal = ({ isOpen, onClose }) => {
  const { setCurrentView, setShowInquiryModal, setShowSecurityHubsModal } = useApp();
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: 'Hello! I am your 3D Campus AI Assistant. You can click any of the official campus FAQs below or type your question to get verified assistance.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');

  if (!isOpen) return null;

  const handleSelectFaq = (faq) => {
    setMessages((prev) => [
      ...prev,
      {
        sender: 'user',
        text: faq.question,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      },
      {
        sender: 'ai',
        text: faq.answer,
        action: faq,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!inputQuery.trim()) return;

    const query = inputQuery.toLowerCase().trim();
    const userMsg = {
      sender: 'user',
      text: inputQuery,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    // Keyword matching against approved FAQs
    const matchedFaq = CAMPUS_FAQS.find((faq) => {
      const qText = faq.question.toLowerCase();
      const aText = faq.answer.toLowerCase();
      return (
        query.split(/\s+/).some((token) => token.length > 3 && (qText.includes(token) || aText.includes(token)))
      );
    });

    let aiMsg;
    if (matchedFaq) {
      aiMsg = {
        sender: 'ai',
        text: `Here is the verified campus guidance regarding "${matchedFaq.question}":\n\n${matchedFaq.answer}`,
        action: matchedFaq,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
    } else {
      aiMsg = {
        sender: 'ai',
        text: `I could not find an automated answer for "${inputQuery}". For security and accuracy, please contact the authorized Security Desk at Gate 1 (Intercom Ext. 101) or review custody desks under Staff Portal.`,
        action: {
          actionLabel: 'View Campus Desks',
          actionModal: 'security-hubs'
        },
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
    }

    setMessages((prev) => [...prev, userMsg, aiMsg]);
    setInputQuery('');
  };

  const handleActionClick = (action) => {
    onClose();
    if (action.actionView) {
      setCurrentView(action.actionView);
    } else if (action.actionModal === 'inquiry') {
      setShowInquiryModal(true);
    } else if (action.actionModal === 'security-hubs') {
      setShowSecurityHubsModal(true);
    }
  };

  return (
    <>
      {/* Mobile Backdrop Overlay (only on mobile screens) */}
      <div 
        onClick={onClose}
        className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs sm:hidden animate-in fade-in"
      />

      {/* Floating Chat Panel Docked Above Floating Robot on Desktop, Modal on Mobile */}
      <div className="fixed inset-x-3 bottom-3 sm:inset-auto sm:bottom-28 sm:right-7 z-50 w-auto sm:w-[420px] max-w-[calc(100vw-1.5rem)] sm:max-w-md h-[560px] sm:h-[580px] max-h-[85vh] bg-white dark:bg-slate-900 rounded-3xl flex flex-col shadow-2xl border border-stone-200 dark:border-slate-800 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-250">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950 text-white px-5 py-3.5 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-orange-500/20 border border-orange-500/40 text-orange-400 flex items-center justify-center shadow-xs">
              <Bot className="w-5 h-5 text-orange-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-sm tracking-tight">Campus AI Assistant</h3>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Online
                </span>
              </div>
              <p className="text-[11px] text-stone-300">
                Official guide for Lost & Found, Claims & Issues
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
            aria-label="Close Assistant"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat / FAQs Body */}
        <div className="flex-1 p-3.5 sm:p-4 overflow-y-auto space-y-3.5 bg-stone-50/50 dark:bg-slate-950/40 overscroll-contain">
          
          {/* Quick FAQ Suggestion Pills */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-3 border border-stone-200 dark:border-slate-800 shadow-2xs space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200">
              <Sparkles className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" />
              <span>Campus Quick Answers:</span>
            </div>
            <div className="grid grid-cols-1 gap-1.5">
              {CAMPUS_FAQS.slice(0, 4).map((faq) => (
                <button
                  key={faq.id}
                  onClick={() => handleSelectFaq(faq)}
                  className="text-left p-2 rounded-xl border border-stone-200 dark:border-slate-800 hover:border-orange-300 dark:hover:border-orange-600 hover:bg-orange-50/50 dark:hover:bg-orange-950/30 transition-all text-[11px] text-slate-700 dark:text-slate-200 font-medium flex items-center justify-between group"
                >
                  <span className="line-clamp-1">{faq.question}</span>
                  <ArrowRight className="w-3 h-3 text-stone-400 group-hover:text-orange-600 shrink-0 ml-1.5 transition-colors" />
                </button>
              ))}
            </div>
          </div>

          {/* Conversation history */}
          <div className="space-y-3 pt-1">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'ai' && (
                  <div className="w-7 h-7 rounded-xl bg-orange-100 dark:bg-orange-950/80 text-orange-600 dark:text-orange-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-4 h-4" />
                  </div>
                )}
                <div
                  className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed shadow-2xs ${
                    msg.sender === 'user'
                      ? 'bg-orange-600 text-white rounded-br-xs font-medium'
                      : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 border border-stone-200 dark:border-slate-800 rounded-bl-xs'
                  }`}
                >
                  <div className="whitespace-pre-line">{msg.text}</div>

                  {/* Contextual Action Button */}
                  {msg.action && (
                    <div className="mt-2.5 pt-2 border-t border-stone-100 dark:border-slate-800 flex items-center justify-between">
                      <span className="text-[10px] text-stone-400 dark:text-stone-500 font-semibold">Action:</span>
                      <button
                        onClick={() => handleActionClick(msg.action)}
                        className="px-2.5 py-1 bg-orange-50 dark:bg-orange-950/80 hover:bg-orange-100 dark:hover:bg-orange-900/80 border border-orange-200 dark:border-orange-800 text-orange-700 dark:text-orange-300 font-bold text-[10px] rounded-lg transition-colors flex items-center gap-1 shadow-2xs"
                      >
                        <span>{msg.action.actionLabel}</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  )}

                  <div className={`text-[9px] mt-1 text-right ${msg.sender === 'user' ? 'text-orange-100' : 'text-stone-400 dark:text-stone-500'}`}>
                    {msg.timestamp}
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Input Bar */}
        <div className="p-3 bg-white dark:bg-slate-900 border-t border-stone-200 dark:border-slate-800 shrink-0">
          <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                placeholder="Ask about lost items, claims, facility repairs..."
                className="w-full pl-9 pr-3 py-2 text-xs bg-stone-50 dark:bg-slate-800 border border-stone-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:border-orange-500 font-medium text-slate-900 dark:text-slate-100"
              />
            </div>
            <button
              type="submit"
              disabled={!inputQuery.trim()}
              className="px-3.5 py-2 bg-orange-600 hover:bg-orange-700 disabled:opacity-40 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1"
            >
              <span>Ask</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
          <div className="text-[10px] text-stone-400 dark:text-stone-500 text-center mt-1.5 flex items-center justify-center gap-1">
            <ShieldCheck className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
            <span>Answers strictly from verified campus policies & recovery desks.</span>
          </div>
        </div>

      </div>
    </>
  );
};
