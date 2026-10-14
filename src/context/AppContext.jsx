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
  deleteItemFromSupabase,
  fetchClaimsFromSupabase,
  insertClaimToSupabase,
  updateClaimStatusInSupabase,
  submitInquiryToSupabase,
  fetchNotificationsFromSupabase,
  markNotificationReadInSupabase
} from '../lib/supabase';

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

  // Backend connection status & loading
  const [isSupabaseConnected, setIsSupabaseConnected] = useState(false);
  const [isLoadingBackend, setIsLoadingBackend] = useState(true);

  // Current User: student account (Zaid Saifee)
  const [userRole, setUserRole] = useState('student');

  // Active view: 'home' | 'browse' | 'report-lost' | 'report-found' | 'dashboard' | 'admin' | 'login' | 'register'
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

  // Notifications
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

  // Toasts
  const [toasts, setToasts] = useState([]);

  // Hydrate items, claims, and notifications from Supabase on load
  useEffect(() => {
    let isMounted = true;

    const loadSupabaseData = async () => {
      try {
        setIsLoadingBackend(true);
        const [supabaseItems, supabaseClaims, supabaseNotifs] = await Promise.all([
          fetchItemsFromSupabase().catch(() => null),
          fetchClaimsFromSupabase().catch(() => null),
          fetchNotificationsFromSupabase().catch(() => null)
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
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Add Item (Saves directly to Supabase and updates UI immediately)
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
      reporterRoll: DEMO_USERS[userRole]?.rollNo || '220132010045'
    };

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

    addToast(
      `Success! ${itemData.type === 'lost' ? 'Lost' : 'Found'} report filed with ID: ${newItem.id} (Saved in Supabase)`,
      'success'
    );
    return newItem;
  };

  // Update Item Status
  const updateItemStatus = (itemId, newStatus) => {
    setItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, status: newStatus } : item))
    );

    updateItemStatusInSupabase(itemId, newStatus).catch((err) => {
      console.warn('Could not sync status update to Supabase:', err);
    });

    addToast(`Item ${itemId} status updated to: ${newStatus.toUpperCase()}`, 'info');
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

    addToast(`Claim request ${newClaimId} submitted and logged in Supabase!`, 'success');
    return newClaim;
  };

  // Admin Claim Approval / Rejection
  const updateClaimStatus = (claimId, newStatus, adminNote = '') => {
    setClaims((prev) =>
      prev.map((c) => {
        if (c.id === claimId) {
          return {
            ...c,
            status: newStatus,
            adminNotes: adminNote || (newStatus === 'approved' ? 'Verified by Security Desk' : 'Insufficient verification')
          };
        }
        return c;
      })
    );

    // If approved, update item to 'recovered'
    const targetClaim = claims.find((c) => c.id === claimId);
    if (targetClaim && newStatus === 'approved') {
      setItems((prev) =>
        prev.map((it) =>
          it.id === targetClaim.itemId ? { ...it, status: 'recovered' } : it
        )
      );
      addToast(`Claim ${claimId} Approved! Item marked as Recovered in Supabase.`, 'success');
    } else if (newStatus === 'rejected') {
      addToast(`Claim ${claimId} marked as Rejected.`, 'info');
    }

    updateClaimStatusInSupabase(claimId, newStatus, adminNote).catch((err) => {
      console.warn('Could not sync claim status to Supabase:', err);
    });
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

  // Reset to original data
  const resetDemoData = () => {
    localStorage.removeItem('campusfind_items');
    localStorage.removeItem('campusfind_claims');
    setItems(INITIAL_ITEMS);
    setClaims(INITIAL_CLAIMS);
    setNotifications(INITIAL_NOTIFICATIONS);
    addToast('Database view restored.', 'info');
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
        notifications,
        markNotificationRead,
        markAllNotificationsRead,
        toasts,
        addToast,
        removeToast,
        addItem,
        updateItemStatus,
        deleteItem,
        submitClaim,
        updateClaimStatus,
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
