import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  INITIAL_ITEMS, 
  INITIAL_CLAIMS, 
  DEMO_USERS, 
  INITIAL_NOTIFICATIONS 
} from '../data/mockData';
import {
  fetchItemsFromSupabase,
  insertItemToSupabase,
  updateItemStatusInSupabase,
  flagItemDuplicateInSupabase,
  deleteItemFromSupabase,
  fetchClaimsFromSupabase,
  insertClaimToSupabase,
  updateClaimStatusInSupabase,
  submitInquiryToSupabase,
  fetchNotificationsFromSupabase,
  insertNotificationToSupabase,
  markNotificationReadInSupabase,
  fetchCampusIssuesFromSupabase,
  insertCampusIssueToSupabase,
  updateCampusIssueStatusInSupabase
} from '../lib/supabase';
import { findSuggestedMatches, detectDuplicateReports } from '../lib/matchEngine';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  // Items state (initialized with localStorage or initial mock data, then hydrated from Supabase)
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem('campusfind_items');
      return saved ? JSON.parse(saved) : INITIAL_ITEMS;
    } catch {
      return INITIAL_ITEMS;
    }
  });

  // Claims state
  const [claims, setClaims] = useState(() => {
    try {
      const saved = localStorage.getItem('campusfind_claims');
      return saved ? JSON.parse(saved) : INITIAL_CLAIMS;
    } catch {
      return INITIAL_CLAIMS;
    }
  });

  // Campus Issues state
  const [campusIssues, setCampusIssues] = useState(() => {
    try {
      const saved = localStorage.getItem('campusfind_issues');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Backend connection status & loading
  const [isSupabaseConnected, setIsSupabaseConnected] = useState(false);
  const [isLoadingBackend, setIsLoadingBackend] = useState(true);

  // Current User: student account (Zaid Saifee) or admin
  const [userRole, setUserRole] = useState(() => {
    return localStorage.getItem('campusfind_user_role') || 'student';
  });

  // Active view: 'home' | 'browse' | 'report-lost' | 'report-found' | 'dashboard' | 'admin' | 'campus-issues' | 'login' | 'register'
  const [currentView, setCurrentView] = useState('home');

  // Search filter
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all'); // 'all' | 'lost' | 'found'
  const [filterCategory, setFilterCategory] = useState('All Categories');
  const [filterLocation, setFilterLocation] = useState('All Campus Locations');

  // Modals state
  const [activeItemDetails, setActiveItemDetails] = useState(null);
  const [activeClaimItem, setActiveClaimItem] = useState(null);
  const [showSecurityHubsModal, setShowSecurityHubsModal] = useState(false);
  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const [showAIAssistantModal, setShowAIAssistantModal] = useState(false);
  const [showCollegeElectionModal, setShowCollegeElectionModal] = useState(false);

  // Notifications
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

  // Toasts
  const [toasts, setToasts] = useState([]);

  // Hydrate items, claims, notifications, and campus issues from Supabase on load
  useEffect(() => {
    let isMounted = true;

    const loadSupabaseData = async () => {
      try {
        setIsLoadingBackend(true);
        const [supabaseItems, supabaseClaims, supabaseNotifs, supabaseIssues] = await Promise.all([
          fetchItemsFromSupabase().catch(() => null),
          fetchClaimsFromSupabase().catch(() => null),
          fetchNotificationsFromSupabase().catch(() => null),
          fetchCampusIssuesFromSupabase().catch(() => null)
        ]);

        if (isMounted) {
          if (supabaseItems && supabaseItems.length > 0) {
            setItems(supabaseItems);
            localStorage.setItem('campusfind_items', JSON.stringify(supabaseItems));
            setIsSupabaseConnected(true);
          }
          if (supabaseClaims && supabaseClaims.length > 0) {
            setClaims(supabaseClaims);
            localStorage.setItem('campusfind_claims', JSON.stringify(supabaseClaims));
          }
          if (supabaseNotifs && supabaseNotifs.length > 0) {
            setNotifications(supabaseNotifs);
          }
          if (supabaseIssues && supabaseIssues.length > 0) {
            setCampusIssues(supabaseIssues);
            localStorage.setItem('campusfind_issues', JSON.stringify(supabaseIssues));
          }
        }
      } catch (err) {
        console.warn('Supabase initial fetch warning (using local fallback):', err);
      } finally {
        if (isMounted) {
          setIsLoadingBackend(false);
        }
      }
    };

    loadSupabaseData();

    return () => {
      isMounted = false;
    };
  }, []);

  // Persist items locally as safety cache
  useEffect(() => {
    try {
      localStorage.setItem('campusfind_items', JSON.stringify(items));
    } catch (e) {
      // quota or private browsing safeguard
    }
  }, [items]);

  // Persist claims locally
  useEffect(() => {
    try {
      localStorage.setItem('campusfind_claims', JSON.stringify(claims));
    } catch (e) {
      // ignore
    }
  }, [claims]);

  // Persist campus issues locally
  useEffect(() => {
    try {
      localStorage.setItem('campusfind_issues', JSON.stringify(campusIssues));
    } catch (e) {
      // ignore
    }
  }, [campusIssues]);

  // Persist user role
  useEffect(() => {
    if (userRole) {
      localStorage.setItem('campusfind_user_role', userRole);
    } else {
      localStorage.removeItem('campusfind_user_role');
    }
  }, [userRole]);

  // Toast helper
  const addToast = (message, type = 'success') => {
    const id = Date.now() + Math.random().toString(36).substring(2, 6);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Add Item with Duplicate Detection and Match Alerts
  const addItem = (itemData) => {
    const newItem = {
      ...itemData,
      id: itemData.type === 'lost' 
        ? `CF-LST-${Math.floor(1000 + Math.random() * 9000)}` 
        : `CF-FND-${Math.floor(1000 + Math.random() * 9000)}`,
      date: itemData.date || new Date().toISOString().split('T')[0],
      time: itemData.time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: itemData.type === 'lost' ? 'lost' : 'found',
      claimCount: 0,
      reporterName: DEMO_USERS[userRole]?.name || 'Student Reporter',
      reporterRole: DEMO_USERS[userRole]?.role || 'Student',
      reporterRoll: DEMO_USERS[userRole]?.rollNo || '220132010045',
      reporterEmail: DEMO_USERS[userRole]?.email || 'student@hitech.ac.in',
      isDuplicate: false,
      duplicateOf: null
    };

    // FEATURE 3: Check for potential duplicate reports
    const duplicates = detectDuplicateReports(newItem, items, 65);
    if (duplicates.length > 0) {
      const topDup = duplicates[0];
      newItem.isDuplicate = true;
      newItem.duplicateOf = topDup.item.id;
      addToast(
        `Notice: A similar ${newItem.type} report (#${topDup.item.id}) was already reported. It has been flagged for security review.`,
        'info'
      );
    }

    // FEATURE 1 & 4: Check for potential matches against opposite items
    const matches = findSuggestedMatches(newItem, items, 50);

    // Update UI state immediately
    setItems((prev) => [newItem, ...prev]);

    // Async persist to Supabase
    insertItemToSupabase(newItem)
      .then(() => {
        setIsSupabaseConnected(true);
      })
      .catch((err) => {
        console.error('Failed to sync new item to Supabase:', err);
      });

    // If matches found, dispatch automatic match alert notification
    if (matches.length > 0) {
      const topMatch = matches[0];
      const matchNotif = {
        title: 'Potential Match Alert!',
        message: `A newly reported item "${newItem.title}" shares characteristics with "${topMatch.item.title}" (${topMatch.score}% match lead).`,
        time: 'Just now',
        type: 'match',
        linkView: 'dashboard',
        linkId: newItem.id
      };
      setNotifications((prev) => [matchNotif, ...prev]);
      insertNotificationToSupabase(matchNotif);
    }

    addToast(
      `Success! ${itemData.type === 'lost' ? 'Lost' : 'Found'} report filed with Ref: ${newItem.id} (Saved in Supabase)`,
      'success'
    );
    return newItem;
  };

  // Update Item Status
  const updateItemStatus = (itemId, newStatus) => {
    const extraFields = {};
    if (newStatus === 'recovered') {
      extraFields.resolved_at = new Date().toISOString();
    }

    setItems((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? { ...item, status: newStatus, resolvedAt: extraFields.resolved_at || item.resolvedAt }
          : item
      )
    );

    updateItemStatusInSupabase(itemId, newStatus, extraFields).catch((err) => {
      console.warn('Could not sync status update to Supabase:', err);
    });

    addToast(`Item ${itemId} status updated to: ${newStatus.toUpperCase()}`, 'info');
  };

  // Dismiss or Confirm Duplicate Report Flag
  const resolveDuplicateFlag = (itemId, isDuplicate, duplicateOf = null) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? { ...item, isDuplicate, duplicateOf }
          : item
      )
    );

    flagItemDuplicateInSupabase(itemId, isDuplicate, duplicateOf).catch((err) => {
      console.warn('Could not update duplicate flag in Supabase:', err);
    });

    addToast(
      isDuplicate ? `Report ${itemId} confirmed as duplicate.` : `Duplicate flag dismissed for ${itemId}.`,
      'info'
    );
  };

  // Delete / Withdraw Item
  const deleteItem = (itemId) => {
    setItems((prev) => prev.filter((item) => item.id !== itemId));

    deleteItemFromSupabase(itemId).catch((err) => {
      console.warn('Could not sync deletion to Supabase:', err);
    });

    addToast(`Report ${itemId} has been withdrawn.`, 'info');
  };

  // Submit Claim (Saves directly to Supabase claims table)
  const submitClaim = (claimData) => {
    const newClaimId = `CLM-${Math.floor(1000 + Math.random() * 9000)}`;
    const newClaim = {
      ...claimData,
      id: newClaimId,
      status: 'pending',
      submittedAt: new Date().toLocaleString(),
      adminNotes: 'Awaiting student verification at campus security desk.'
    };

    // Immediate UI update
    setClaims((prev) => [newClaim, ...prev]);

    setItems((prev) =>
      prev.map((item) => {
        if (item.id === claimData.itemId) {
          return {
            ...item,
            status: item.status === 'found' ? 'claimed' : item.status,
            claimCount: (item.claimCount || 0) + 1
          };
        }
        return item;
      })
    );

    // Sync to Supabase
    insertClaimToSupabase(newClaim)
      .then(() => {
        setIsSupabaseConnected(true);
      })
      .catch((err) => {
        console.error('Failed to sync claim to Supabase:', err);
      });

    // Notify staff of new incoming claim
    const adminNotif = {
      title: 'New Ownership Claim Submitted',
      message: `Claim ${newClaimId} submitted for "${claimData.itemTitle}" by ${claimData.claimantName}. Pending review.`,
      time: 'Just now',
      type: 'claim',
      linkView: 'admin',
      linkId: newClaimId
    };
    setNotifications((prev) => [adminNotif, ...prev]);
    insertNotificationToSupabase(adminNotif);

    addToast(`Claim request ${newClaimId} submitted and logged in Supabase!`, 'success');
    return newClaim;
  };

  // Admin Claim Approval / Rejection with Competing Claim Safety
  const updateClaimStatus = (claimId, newStatus, adminNote = '') => {
    const targetClaim = claims.find((c) => c.id === claimId);

    setClaims((prev) =>
      prev.map((c) => {
        if (c.id === claimId) {
          return {
            ...c,
            status: newStatus,
            adminNotes: adminNote || (newStatus === 'approved' ? 'Verified by Security Desk' : 'Insufficient verification')
          };
        }
        // If approving this claim, auto-reject other competing claims for the same item to prevent conflicts
        if (newStatus === 'approved' && targetClaim && c.itemId === targetClaim.itemId && c.id !== claimId) {
          return {
            ...c,
            status: 'rejected',
            adminNotes: `Claim concluded. Another verified claimant was approved for this item.`
          };
        }
        return c;
      })
    );

    // If approved, update item to 'recovered'
    if (targetClaim && newStatus === 'approved') {
      const nowIso = new Date().toISOString();
      setItems((prev) =>
        prev.map((it) =>
          it.id === targetClaim.itemId ? { ...it, status: 'recovered', resolvedAt: nowIso } : it
        )
      );
      addToast(`Claim ${claimId} Approved! Item marked as Recovered in Supabase.`, 'success');
    } else if (newStatus === 'rejected') {
      addToast(`Claim ${claimId} marked as Rejected.`, 'info');
    }

    // Persist claim status in Supabase
    updateClaimStatusInSupabase(claimId, newStatus, adminNote).catch((err) => {
      console.warn('Could not sync claim status to Supabase:', err);
    });

    // Send in-app notification to the claimant
    if (targetClaim) {
      const claimantNotif = {
        title: newStatus === 'approved' ? 'Claim Approved! 🎉' : 'Claim Status Update',
        message:
          newStatus === 'approved'
            ? `Your claim for "${targetClaim.itemTitle}" was approved by Campus Security. You may collect your item at Main Gate 1 Desk.`
            : `Your claim for "${targetClaim.itemTitle}" was marked as rejected: ${adminNote || 'Insufficient proof.'}`,
        time: 'Just now',
        type: newStatus === 'approved' ? 'success' : 'claim',
        linkView: 'dashboard'
      };
      setNotifications((prev) => [claimantNotif, ...prev]);
      insertNotificationToSupabase(claimantNotif);
    }
  };

  // Campus Issue Reporting
  const reportCampusIssue = async (issueData) => {
    const newIssue = {
      ...issueData,
      id: `ISSUE-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'submitted',
      reporterName: DEMO_USERS[userRole]?.name || 'Student Reporter',
      reporterRoll: DEMO_USERS[userRole]?.rollNo || '220132010045',
      reporterEmail: DEMO_USERS[userRole]?.email || 'student@hitech.ac.in',
      createdAt: new Date().toISOString()
    };

    setCampusIssues((prev) => [newIssue, ...prev]);

    const saved = await insertCampusIssueToSupabase(newIssue);

    const issueNotif = {
      title: 'Facility Issue Logged',
      message: `Your maintenance report "${newIssue.title}" was submitted to estate staff (ID: ${newIssue.id}).`,
      time: 'Just now',
      type: 'info',
      linkView: 'campus-issues',
      linkId: newIssue.id
    };
    setNotifications((prev) => [issueNotif, ...prev]);
    insertNotificationToSupabase(issueNotif);

    addToast(`Campus Issue ${newIssue.id} submitted and stored in Supabase!`, 'success');
    return saved;
  };

  // Campus Issue Status Update (Staff / Admin)
  const updateCampusIssueStatus = async (issueId, newStatus, resolutionNotes = '', assignedTo = null) => {
    const targetIssue = campusIssues.find((i) => i.id === issueId);

    setCampusIssues((prev) =>
      prev.map((i) =>
        i.id === issueId
          ? {
              ...i,
              status: newStatus,
              resolutionNotes: resolutionNotes || i.resolutionNotes,
              assignedTo: assignedTo || i.assignedTo,
              resolvedAt: (newStatus === 'resolved' || newStatus === 'closed') ? new Date().toISOString() : i.resolvedAt
            }
          : i
      )
    );

    const updated = await updateCampusIssueStatusInSupabase(issueId, newStatus, resolutionNotes, assignedTo);

    if (targetIssue) {
      const notif = {
        title: `Campus Issue ${newStatus.toUpperCase()}`,
        message: `Facility report "${targetIssue.title}" status changed to ${newStatus.replace('_', ' ')}. ${resolutionNotes ? `Notes: ${resolutionNotes}` : ''}`,
        time: 'Just now',
        type: newStatus === 'resolved' ? 'success' : 'info',
        linkView: 'campus-issues',
        linkId: issueId
      };
      setNotifications((prev) => [notif, ...prev]);
      insertNotificationToSupabase(notif);
    }

    addToast(`Issue ${issueId} status updated to ${newStatus.toUpperCase()}`, 'success');
    return updated;
  };

  // Submit Inquiry (Saves to Supabase inquiries table)
  const submitInquiry = async (inquiryData) => {
    try {
      const savedInquiry = await submitInquiryToSupabase(inquiryData);
      addToast('Your inquiry has been submitted and stored in Supabase!', 'success');
      return savedInquiry;
    } catch (err) {
      addToast('Could not save inquiry to backend. Please check connection.', 'error');
      throw err;
    }
  };

  // Switch role helper
  const switchUserRole = (role) => {
    setUserRole(role);
    if (role === 'admin') {
      addToast('Switched to Campus Security Officer R. Verma (Admin)', 'info');
    } else if (role === 'student') {
      addToast('Switched to Student Zaid Saifee (CSE 3rd Year)', 'info');
    } else {
      addToast('Logged out of demo session.', 'info');
    }
  };

  // Reset to original sample data
  const resetDemoData = () => {
    localStorage.removeItem('campusfind_items');
    localStorage.removeItem('campusfind_claims');
    localStorage.removeItem('campusfind_issues');
    setItems(INITIAL_ITEMS);
    setClaims(INITIAL_CLAIMS);
    setNotifications(INITIAL_NOTIFICATIONS);
    addToast('Database demo state re-synchronized.', 'info');
  };

  // Mark notifications read
  const markNotificationRead = (notifId) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notifId ? { ...n, read: true } : n))
    );
    markNotificationReadInSupabase(notifId);
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    addToast('All notifications marked as read', 'info');
  };

  const currentUser = userRole ? DEMO_USERS[userRole] : null;

  return (
    <AppContext.Provider
      value={{
        items,
        claims,
        campusIssues,
        userRole,
        currentUser,
        currentView,
        setCurrentView,
        searchQuery,
        setSearchQuery,
        filterType,
        setFilterType,
        filterCategory,
        setFilterCategory,
        filterLocation,
        setFilterLocation,
        activeItemDetails,
        setActiveItemDetails,
        activeClaimItem,
        setActiveClaimItem,
        showSecurityHubsModal,
        setShowSecurityHubsModal,
        showInquiryModal,
        setShowInquiryModal,
        showAIAssistantModal,
        setShowAIAssistantModal,
        showCollegeElectionModal,
        setShowCollegeElectionModal,
        notifications,
        markNotificationRead,
        markAllNotificationsRead,
        toasts,
        addToast,
        removeToast,
        addItem,
        updateItemStatus,
        resolveDuplicateFlag,
        deleteItem,
        submitClaim,
        updateClaimStatus,
        reportCampusIssue,
        updateCampusIssueStatus,
        submitInquiry,
        switchUserRole,
        resetDemoData,
        isSupabaseConnected,
        isLoadingBackend
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
