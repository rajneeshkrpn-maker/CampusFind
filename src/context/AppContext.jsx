import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  INITIAL_ITEMS, 
  INITIAL_CLAIMS, 
  DEMO_USERS, 
  INITIAL_NOTIFICATIONS 
} from '../data/mockData';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  // Items state (saved in localStorage for seamless reload persistence)
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

  // Notifications
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

  // Toasts
  const [toasts, setToasts] = useState([]);

  // Persist items
  useEffect(() => {
    localStorage.setItem('campusfind_items', JSON.stringify(items));
  }, [items]);

  // Persist claims
  useEffect(() => {
    localStorage.setItem('campusfind_claims', JSON.stringify(claims));
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

  // Add Item
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

    setItems((prev) => [newItem, ...prev]);
    addToast(
      `Success! ${itemData.type === 'lost' ? 'Lost' : 'Found'} report filed with ID: ${newItem.id}`,
      'success'
    );
    return newItem;
  };

  // Update Item Status
  const updateItemStatus = (itemId, newStatus) => {
    setItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, status: newStatus } : item))
    );
    addToast(`Item ${itemId} status updated to: ${newStatus.toUpperCase()}`, 'info');
  };

  // Delete / Withdraw Item
  const deleteItem = (itemId) => {
    setItems((prev) => prev.filter((item) => item.id !== itemId));
    addToast(`Report ${itemId} has been withdrawn.`, 'info');
  };

  // Add Claim
  const submitClaim = (claimData) => {
    const newClaimId = `CLM-${Math.floor(1000 + Math.random() * 9000)}`;
    const newClaim = {
      ...claimData,
      id: newClaimId,
      status: 'pending',
      submittedAt: new Date().toLocaleString(),
      adminNotes: 'Awaiting student verification at campus security desk.'
    };

    setClaims((prev) => [newClaim, ...prev]);

    // Update item claim count and mark status as 'claimed' if not already
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

    addToast(`Claim request ${newClaimId} submitted for review!`, 'success');
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
      addToast(`Claim ${claimId} Approved! Item marked as Recovered.`, 'success');
    } else if (newStatus === 'rejected') {
      addToast(`Claim ${claimId} marked as Rejected.`, 'info');
    }
  };

  // Switch role helper
  const switchUserRole = (role) => {
    setUserRole(role);
    if (role === 'admin') {
      addToast('Switched to Campus Security Officer R. Verma (Admin)', 'info');
    } else if (role === 'student') {
      addToast('Switched to Student Aarav Sharma (CSE 3rd Year)', 'info');
    } else {
      addToast('Logged out of demo session.', 'info');
    }
  };

  // Reset to original mock data
  const resetDemoData = () => {
    localStorage.removeItem('campusfind_items');
    localStorage.removeItem('campusfind_claims');
    setItems(INITIAL_ITEMS);
    setClaims(INITIAL_CLAIMS);
    setNotifications(INITIAL_NOTIFICATIONS);
    addToast('Demo database restored to default state.', 'info');
  };

  // Mark notifications read
  const markNotificationRead = (notifId) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notifId ? { ...n, read: true } : n))
    );
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
        switchUserRole,
        resetDemoData
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
