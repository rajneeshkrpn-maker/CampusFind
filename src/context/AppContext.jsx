import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  INITIAL_ITEMS, 
  INITIAL_CLAIMS, 
  INITIAL_NOTIFICATIONS 
} from '../data/mockData';
import {
  supabase,
  getCurrentSession,
  onAuthStateChange,
  signOutUser,
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
  updateCampusIssueStatusInSupabase,
  fetchProfileByUserId,
  fetchProfileByEmail,
  upsertUserProfile,
  updateUserProfile,
  uploadAvatar
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

  // Authentication State (Session & Unique Profile)
  const [session, setSession] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null); // 'student' | 'admin' | 'staff' | null
  const [authLoading, setAuthLoading] = useState(true);

  // Active view: 'home' | 'browse' | 'report-lost' | 'report-found' | 'dashboard' | 'admin' | 'campus-issues' | 'login' | 'register' | 'profile'
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
  const [showProfileModal, setShowProfileModal] = useState(false);

  // Notifications
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

  // Toasts
  const [toasts, setToasts] = useState([]);

  // Authenticated Session Listener and Profile Hydration
  useEffect(() => {
    let isMounted = true;

    const initAuthAndProfile = async () => {
      try {
        setAuthLoading(true);
        const currentSession = await getCurrentSession();
        if (!isMounted) return;

        if (currentSession?.user) {
          setSession(currentSession);
          // Look up user profile by auth ID or email
          const profile = await fetchProfileByUserId(currentSession.user.id) ||
                          await fetchProfileByEmail(currentSession.user.email);
          if (isMounted) {
            if (profile) {
              setCurrentUser(profile);
              setUserRole(profile.role || 'student');
            } else {
              // If authenticated user has no profile yet, create standard student profile from auth metadata
              const meta = currentSession.user.user_metadata || {};
              const initialStudentId = meta.student_id || `STU-${currentSession.user.id.substring(0, 8).toUpperCase()}`;
              const initialName = meta.full_name || currentSession.user.email.split('@')[0];
              const created = await upsertUserProfile({
                userId: currentSession.user.id,
                studentId: initialStudentId,
                fullName: initialName,
                department: meta.department || 'Computer Science & Engineering',
                academicYear: meta.academic_year || 'Student',
                email: currentSession.user.email,
                avatarUrl: meta.avatar_url || null,
                role: 'student'
              }).catch(() => null);

              if (created && isMounted) {
                setCurrentUser(created);
                setUserRole(created.role || 'student');
              }
            }
          }
        } else {
          // Public visitor state: No default user!
          setSession(null);
          setCurrentUser(null);
          setUserRole(null);
        }
      } catch (authErr) {
        console.warn('Auth initialization warning:', authErr);
      } finally {
        if (isMounted) {
          setAuthLoading(false);
        }
      }
    };

    initAuthAndProfile();

    // Listen to real-time auth state events (SIGN_IN, SIGN_OUT, TOKEN_REFRESH)
    const { data: authListener } = onAuthStateChange(async (event, newSession) => {
      if (!isMounted) return;

      if (event === 'SIGNED_OUT' || !newSession?.user) {
        setSession(null);
        setCurrentUser(null);
        setUserRole(null);
        setAuthLoading(false);
        return;
      }

      if (event === 'SIGNED_IN' || event === 'USER_UPDATED' || event === 'TOKEN_REFRESHED') {
        setSession(newSession);
        let profile = await fetchProfileByUserId(newSession.user.id) ||
                      await fetchProfileByEmail(newSession.user.email);

        // Auto-provision profile from auth metadata if not yet created in public.profiles
        if (!profile && newSession.user) {
          const meta = newSession.user.user_metadata || {};
          const fallbackStudentId = meta.student_id || `STU-${newSession.user.id.substring(0, 8).toUpperCase()}`;
          const fallbackName = meta.full_name || newSession.user.email.split('@')[0];
          profile = await upsertUserProfile({
            userId: newSession.user.id,
            studentId: fallbackStudentId,
            fullName: fallbackName,
            department: meta.department || 'Computer Science & Engineering',
            academicYear: meta.academic_year || 'Student',
            email: newSession.user.email,
            avatarUrl: meta.avatar_url || null,
            role: 'student'
          }).catch((err) => {
            console.warn('Could not auto-provision profile on auth change:', err?.message);
            return null;
          });
        }

        if (isMounted) {
          if (profile) {
            setCurrentUser(profile);
            setUserRole(profile.role || 'student');
          }
          setAuthLoading(false);
        }
      }
    });

    return () => {
      isMounted = false;
      authListener?.subscription?.unsubscribe();
    };
  }, []);

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
      reporterName: currentUser?.name || 'Campus Student',
      reporterRole: currentUser?.role === 'admin' ? 'Campus Security Desk' : (currentUser?.role || 'Student'),
      reporterRoll: currentUser?.rollNo || 'Pending',
      reporterEmail: currentUser?.email || '',
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
      claimantName: claimData.claimantName || currentUser?.name || 'Claimant',
      claimantRoll: claimData.claimantRoll || currentUser?.rollNo || '',
      claimantEmail: claimData.claimantEmail || currentUser?.email || '',
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
      message: `Claim ${newClaimId} submitted for "${claimData.itemTitle}" by ${newClaim.claimantName}. Pending review.`,
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
      reporterName: currentUser?.name || 'Campus Member',
      reporterRoll: currentUser?.rollNo || 'N/A',
      reporterEmail: currentUser?.email || '',
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

  // Logout session
  const logout = async () => {
    try {
      await signOutUser();
    } catch (e) {
      console.warn('Signout warning:', e);
    }
    setSession(null);
    setCurrentUser(null);
    setUserRole(null);
    setCurrentView('home');
    addToast('Signed out of CampusFind.', 'info');
  };

  // Update Profile
  const updateProfile = async (updates) => {
    if (!currentUser?.id) throw new Error('Not authenticated');
    const updated = await updateUserProfile(currentUser.id, updates);
    setCurrentUser(updated);
    addToast('Profile updated successfully!', 'success');
    return updated;
  };

  // Upload Avatar
  const uploadUserAvatar = async (file) => {
    const uid = session?.user?.id || currentUser?.userId || currentUser?.id;
    if (!uid) throw new Error('Authentication required for profile picture upload.');
    const avatarUrl = await uploadAvatar(file, uid);
    const updated = await updateUserProfile(currentUser.id, { avatarUrl });
    setCurrentUser(updated);
    addToast('Profile picture uploaded successfully!', 'success');
    return avatarUrl;
  };

  // Reset to original sample data (admin/debug only)
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

  return (
    <AppContext.Provider
      value={{
        items,
        claims,
        campusIssues,
        session,
        currentUser,
        setCurrentUser,
        userRole,
        authLoading,
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
        showProfileModal,
        setShowProfileModal,
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
        logout,
        updateProfile,
        uploadUserAvatar,
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
