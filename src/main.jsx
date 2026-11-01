import React, { useState, useEffect, useCallback } from 'react';
import { createRoot } from 'react-dom/client';
import {
  initializeStorage,
  getAllDonations,
  addDonation,
  claimDonation,
  applyFoodRequest,
  updateDonationStatus,
  getCurrentUser,
  logoutUser,
  switchTestAccount
} from './db/storage';
import { useHashRoute, navigateTo } from './utils/router';

// Styling & Subcomponents
import './style.css';
import Navbar from './components/Navbar';
import Toast from './components/Toast';
import HomePage from './components/HomePage';
import FoodListings from './components/FoodListings';
import DonorForm from './components/DonorForm';
import AdminPanel from './components/AdminPanel';
import ProjectReport from './components/ProjectReport';
import Conclusion from './components/Conclusion';
import AdminLoginModal from './components/AdminLoginModal';

export default function App() {
  const { route, navigate } = useHashRoute();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [adminLoginModalOpen, setAdminLoginModalOpen] = useState(false);
  const [selectedRequestItem, setSelectedRequestItem] = useState(null);

  // Helper: Trigger Toast Notification
  const showToast = useCallback(({ type = 'success', title = '', message = '' }) => {
    const id = 'toast_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6);
    setToasts((prev) => [...prev, { id, type, title, message }]);

    // Auto dismiss after 4.5 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const dismissToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Reload donations from IndexedDB & LocalStorage
  const loadDonations = useCallback(async () => {
    try {
      const items = await getAllDonations();
      setDonations(items);
    } catch (err) {
      console.error('Failed to load donations:', err);
    }
  }, []);

  // Initialize DB on mount
  useEffect(() => {
    async function boot() {
      try {
        setLoading(true);
        const initial = await initializeStorage();
        setDonations(initial);
        const activeUser = getCurrentUser();
        if (activeUser && activeUser.role === 'admin') {
          setCurrentUser(activeUser);
        }
      } catch (err) {
        console.error('Storage initialization failed:', err);
      } finally {
        setLoading(false);
      }
    }
    boot();
  }, []);

  // Handler: Admin Login Success
  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    showToast({
      type: 'success',
      title: 'Administrator Authenticated',
      message: `Welcome, ${user.name}! Central Control Center is now unlocked.`
    });
    navigate('admin');
  };

  // Handler: Admin Logout
  const handleLogout = async () => {
    await logoutUser();
    setCurrentUser(null);
    showToast({
      type: 'info',
      title: 'Signed Out',
      message: 'Administrator session cleared from IndexedDB & LocalStorage.'
    });
    navigate('home');
  };

  // Handler: 1-Click Fast Switch to Administrator
  const handleQuickSwitch = async (roleOrEmail = 'admin') => {
    try {
      const user = await switchTestAccount(roleOrEmail);
      setCurrentUser(user);
      showToast({
        type: 'success',
        title: `Administrator Active: ${user.name}`,
        message: 'Admin permissions verified from IndexedDB credentials.'
      });
      navigate('admin');
    } catch (err) {
      showToast({
        type: 'error',
        title: 'Authentication Failed',
        message: err.message
      });
    }
  };

  // Handler: Add New Donation (Public or Admin)
  const handleAddDonation = async (formData) => {
    try {
      const created = await addDonation(formData);
      await loadDonations();
      showToast({
        type: 'success',
        title: 'Donation Listed Successfully!',
        message: `"${created.item}" is saved to IndexedDB and ready for local shelters to claim.`
      });
      navigate('listings');
    } catch (err) {
      showToast({
        type: 'error',
        title: 'Listing Failed',
        message: err.message
      });
    }
  };

  // Handler: Apply Food Request (Comprehensive Form)
  const handleApplyRequest = async (id, application) => {
    try {
      const updated = await applyFoodRequest(id, application);
      await loadDonations();
      showToast({
        type: 'success',
        title: 'Relief Request Submitted!',
        message: `Application from "${application.receiverName}" for ${application.beneficiaryCount || 20} beneficiaries sent to Admin for dispatch.`
      });
      navigate('listings');
    } catch (err) {
      showToast({
        type: 'error',
        title: 'Application Error',
        message: err.message
      });
    }
  };

  // Handler: Claim Donation (Backwards compatible)
  const handleClaimDonation = async (id, receiverInfo) => {
    return handleApplyRequest(id, receiverInfo);
  };

  // Quick action from Home page: "Request This Food"
  const handleHomeApplyRequest = (item) => {
    setSelectedRequestItem(item);
    navigate('listings');
  };

  // Calculate stats for report & headers
  const availableCount = donations.filter((d) => d.status === 'Available').length;
  const claimedCount = donations.filter((d) => d.status !== 'Available').length;
  const deliveredCount = donations.filter((d) => d.status === 'Delivered').length;

  const stats = {
    total: donations.length,
    available: availableCount,
    claimed: claimedCount,
    delivered: deliveredCount
  };

  const isAdmin = currentUser && currentUser.role === 'admin';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-emerald-200 selection:text-emerald-900">

      {/* Navigation Bar */}
      <Navbar
        activeRoute={route}
        onNavigate={navigate}
        availableCount={availableCount}
        isAdmin={isAdmin}
        currentUser={currentUser}
        onOpenAdminLogin={() => setAdminLoginModalOpen(true)}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-28 text-emerald-800 space-y-3">
            <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="font-bold text-sm tracking-wide">Initializing IndexedDB & LocalStorage Engine...</p>
          </div>
        ) : (
          <>
            {/* 1st: Home Page */}
            {route === 'home' && (
              <HomePage
                donations={donations}
                onNavigate={navigate}
                onOpenApplyModal={handleHomeApplyRequest}
                onOpenAdminLogin={() => setAdminLoginModalOpen(true)}
                isAdmin={isAdmin}
              />
            )}

            {/* 2nd: All Products / Listings */}
            {route === 'listings' && (
              <FoodListings
                donations={donations}
                onApplyRequest={handleApplyRequest}
                onClaim={handleClaimDonation}
                onNavigate={navigate}
                currentUser={currentUser}
                initialRequestItem={selectedRequestItem}
              />
            )}

            {/* 3rd: Public Donor Intake Form */}
            {route === 'donor' && (
              <DonorForm
                onSubmit={handleAddDonation}
                currentUser={currentUser}
              />
            )}

            {/* 4th: Admin Control Panel (Only By Admin Control) */}
            {route === 'admin' && (
              <AdminPanel
                donations={donations}
                onRefreshData={loadDonations}
                showToast={showToast}
                onNavigate={navigate}
                currentUser={currentUser}
                onSwitchUser={handleQuickSwitch}
                onOpenLogin={() => setAdminLoginModalOpen(true)}
              />
            )}

            {/* Project Report */}
            {route === 'report' && (
              <ProjectReport onNavigate={navigate} stats={stats} />
            )}

            {/* Conclusion & Evaluation */}
            {route === 'conclusion' && (
              <Conclusion onNavigate={navigate} />
            )}
          </>
        )}
      </main>

      {/* Toast Notification Container */}
      <Toast toasts={toasts} onDismiss={dismissToast} />

      {/* 5th: The Admin Login ONLY Modal */}
      <AdminLoginModal
        isOpen={adminLoginModalOpen}
        onClose={() => setAdminLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Professional Footer */}
      <footer className="bg-white border-t border-slate-200 mt-auto py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
            <span><strong>Share The Bite Platform</strong> &bull; UN SDG 2 (Zero Hunger) &bull; IndexedDB Active</span>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold">
            <button onClick={() => navigate('home')} className="hover:text-emerald-800 transition-colors">Home</button>
            <span>&bull;</span>
            <button onClick={() => navigate('listings')} className="hover:text-emerald-800 transition-colors">All Products ({availableCount})</button>
            <span>&bull;</span>
            <button onClick={() => navigate('donor')} className="hover:text-emerald-800 transition-colors">+ Donate Food</button>
            <span>&bull;</span>
            <button onClick={() => navigate('admin')} className="hover:text-emerald-800 transition-colors text-emerald-900 font-bold">Admin Control</button>
            <span>&bull;</span>
            <button onClick={() => navigate('report')} className="hover:text-emerald-800 transition-colors">SDG 2 Report</button>
          </div>
        </div>
      </footer>

    </div>
  );
}

// React 18 / 19 Root Mount
const rootElement = document.getElementById('root');
if (rootElement) {
  const root = createRoot(rootElement);
  root.render(<App />);
}
