import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Bot, 
  X, 
  Send, 
  Sparkles, 
  HelpCircle, 
  ArrowRight, 
  PhoneCall, 
  Search, 
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

export const CAMPUS_FAQS = [
  {
    id: 1,
    question: 'Where can I report a lost or found item?',
    answer: 'You can report a lost or found belonging directly using the top navigation bar. Click "+ Lost Something?" or "+ Found an Item?". Once submitted, your report is saved in Supabase and matched with existing entries.',
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
    answer: 'Use the new "Campus Issues" section in the menu. Fill in the building, room number, category (Projector, Wi-Fi, Infrastructure, Cleanliness), and issue description. The estate and IT maintenance teams will be notified.',
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
    answer: 'Hi-Tech Institute maintains a 24/7 Security & Proctorial Desk at Main Gate 1 (Campus Intercom Ext. 101). You can also click the "Help Desk" button in the top navigation to file an official digital inquiry.',
    actionLabel: 'Open Help Desk Inquiry',
    actionModal: 'inquiry'
  },
  {
    id: 7,
    question: 'Where can I find official college notices or campus information?',
    answer: 'Verified campus security desk counters, custody points, and proctorial notices are displayed under "Campus Desks" in the top bar. You can also view recovery protocols in the footer of this portal.',
    actionLabel: 'View Campus Desks',
    actionModal: 'security-hubs'
  }
];

export const CampusAIAssistantModal = ({ isOpen, onClose }) => {
  const { setCurrentView, setShowInquiryModal, setShowSecurityHubsModal } = useApp();
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: 'Hello! I am your Campus Hub Assistant. You can click any of the official campus FAQs below or type your question to get verified assistance.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [selectedFaq, setSelectedFaq] = useState(null);

  if (!isOpen) return null;

  const handleSelectFaq = (faq) => {
    setSelectedFaq(faq);
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
        text: `I could not find a verified automated answer for "${inputQuery}". To avoid providing inaccurate details, please reach out to the authorized Campus Security Desk at Gate 1 (Intercom Ext. 101) or submit an official Help Desk inquiry.`,
        action: {
          actionLabel: 'Contact Campus Help Desk',
          actionModal: 'inquiry'
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full h-[620px] max-h-[90vh] flex flex-col shadow-2xl border border-stone-200 overflow-hidden">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white px-5 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-orange-500/20 border border-orange-500/40 text-orange-400 flex items-center justify-center shadow-xs">
              <Bot className="w-5 h-5 text-orange-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-sm sm:text-base tracking-tight">Campus AI Assistant</h3>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-orange-500/30 text-orange-300 border border-orange-400/30">
                  Verified FAQs
                </span>
              </div>
              <p className="text-[11px] text-stone-300">
                Official guide for Lost & Found, Claims, and Campus Maintenance
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat / FAQs Body */}
        <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-4 bg-stone-50/50">
          
          {/* Quick FAQ Suggestion Pills */}
          <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-2xs space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
              <Sparkles className="w-3.5 h-3.5 text-orange-600" />
              <span>Frequently Asked Campus Questions (Click to test):</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {CAMPUS_FAQS.map((faq) => (
                <button
                  key={faq.id}
                  onClick={() => handleSelectFaq(faq)}
                  className="text-left p-2.5 rounded-xl border border-stone-200 hover:border-orange-300 hover:bg-orange-50/40 transition-all text-[11px] text-slate-700 font-medium flex items-center justify-between group"
                >
                  <span className="line-clamp-2">{faq.question}</span>
                  <ArrowRight className="w-3 h-3 text-stone-400 group-hover:text-orange-600 shrink-0 ml-1.5 transition-colors" />
                </button>
              ))}
            </div>
          </div>

          {/* Conversation history */}
          <div className="space-y-3 pt-2">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'ai' && (
                  <div className="w-7 h-7 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-4 h-4" />
                  </div>
                )}
                <div
                  className={`max-w-[82%] rounded-2xl p-3.5 text-xs leading-relaxed shadow-2xs ${
                    msg.sender === 'user'
                      ? 'bg-orange-600 text-white rounded-br-xs font-medium'
                      : 'bg-white text-slate-800 border border-stone-200 rounded-bl-xs'
                  }`}
                >
                  <div className="whitespace-pre-line">{msg.text}</div>

                  {/* Contextual Action Button */}
                  {msg.action && (
                    <div className="mt-3 pt-2.5 border-t border-stone-100 flex items-center justify-between">
                      <span className="text-[10px] text-stone-400 font-semibold">Suggested Action:</span>
                      <button
                        onClick={() => handleActionClick(msg.action)}
                        className="px-3 py-1 bg-orange-50 hover:bg-orange-100 border border-orange-200 text-orange-700 font-bold text-[11px] rounded-lg transition-colors flex items-center gap-1 shadow-2xs"
                      >
                        <span>{msg.action.actionLabel}</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  )}

                  <div className={`text-[9px] mt-1.5 text-right ${msg.sender === 'user' ? 'text-orange-100' : 'text-stone-400'}`}>
                    {msg.timestamp}
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 bg-white border-t border-stone-200">
          <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                placeholder="Ask about lost items, claims, facility repairs..."
                className="w-full pl-9 pr-3 py-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:border-orange-500 font-medium"
              />
            </div>
            <button
              type="submit"
              disabled={!inputQuery.trim()}
              className="px-4 py-2.5 bg-orange-600 hover:bg-orange-700 disabled:opacity-40 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
            >
              <span>Ask</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
          <div className="text-[10px] text-stone-400 text-center mt-2 flex items-center justify-center gap-1">
            <ShieldCheck className="w-3 h-3 text-emerald-600" />
            <span>Strictly answers from approved college policies and verified campus records.</span>
          </div>
        </div>

      </div>
    </div>
  );
};
