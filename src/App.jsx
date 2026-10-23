import React, { useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ToastContainer } from './components/Toast';
import { ItemDetailsModal } from './components/ItemDetailsModal';
import { ClaimModal } from './components/ClaimModal';
import { CampusMapModal } from './components/CampusMapModal';
import { InquiryModal } from './components/InquiryModal';
import { CampusAIAssistantModal } from './components/CampusAIAssistantModal';
import { CollegeElectionModal } from './components/CollegeElectionModal';
import { ProfileModal } from './components/ProfileModal';
import { FloatingAIAssistant } from './components/FloatingAIAssistant';
import { HomePage } from './pages/HomePage';
import { BrowsePage } from './pages/BrowsePage';
import { ReportLostPage } from './pages/ReportLostPage';
import { ReportFoundPage } from './pages/ReportFoundPage';
import { DashboardPage } from './pages/DashboardPage';
import { AdminPage } from './pages/AdminPage';
import { CampusIssuesPage } from './pages/CampusIssuesPage';
import { AuthPage } from './pages/AuthPage';

const AppContent = () => {
  const { 
    currentView, 
    showAIAssistantModal, 
    setShowAIAssistantModal,
    showCollegeElectionModal,
    setShowCollegeElectionModal,
    showProfileModal,
    setShowProfileModal
  } = useApp();

  // Scroll to top upon page navigation
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentView]);

  const renderView = () => {
    switch (currentView) {
      case 'home':
        return <HomePage />;
      case 'browse':
        return <BrowsePage />;
      case 'report-lost':
        return <ReportLostPage />;
      case 'report-found':
        return <ReportFoundPage />;
      case 'dashboard':
        return <DashboardPage />;
      case 'admin':
        return <AdminPage />;
      case 'campus-issues':
        return <CampusIssuesPage />;
      case 'login':
        return <AuthPage initialMode="login" />;
      case 'register':
        return <AuthPage initialMode="register" />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fbfbfa] dark:bg-[#0b0f19] text-slate-800 dark:text-slate-100 font-sans selection:bg-orange-100 selection:text-orange-900 dark:selection:bg-orange-950 dark:selection:text-orange-200 transition-colors duration-200">
      {/* Top Navbar */}
      <Navbar />

      {/* Main Page Content */}
      <main className="flex-1">
        {renderView()}
      </main>

      {/* Footer with College Credentials & Team credits */}
      <Footer />

      {/* Global Modals */}
      <ItemDetailsModal />
      <ClaimModal />
      <CampusMapModal />
      <InquiryModal />
      <CampusAIAssistantModal 
        isOpen={showAIAssistantModal} 
        onClose={() => setShowAIAssistantModal(false)} 
      />
      <CollegeElectionModal 
        isOpen={showCollegeElectionModal} 
        onClose={() => setShowCollegeElectionModal(false)} 
      />
      <ProfileModal 
        isOpen={showProfileModal} 
        onClose={() => setShowProfileModal(false)} 
      />

      {/* Floating 3D Robot AI Assistant */}
      <FloatingAIAssistant />

      {/* Toast Feedback Notifications */}
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
