import React, { useState, useEffect, useCallback } from 'react';
import { createRoot } from 'react-dom/client';
import {
  initializeStorage,
  getAllDonations,
  addDonation,
  claimDonation,
  updateDonationStatus,
  getCurrentUser,
  logoutUser,
  switchTestAccount
} from './db/storage';
import { useHashRoute, navigateTo } from './utils/router';

// Subcomponents
import './style.css';
import Navbar from './components/Navbar';
import Toast from './components/Toast';
import ProjectReport from './components/ProjectReport';
import DonorForm from './components/DonorForm';
import FoodListings from './components/FoodListings';
import ReceiverDashboard from './components/ReceiverDashboard';
import AdminPanel from './components/AdminPanel';
import Conclusion from './components/Conclusion';
import LoginModal from './components/LoginModal';

export default function App() {
  const { route, navigate } = useHashRoute();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState([]);
  const [currentRole, setCurrentRole] = useState('admin');
  const [currentUser, setCurrentUser] = useState(null);
  const [loginModalOpen, setLoginModalOpen] = useState(false);

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
        if (activeUser) {
          setCurrentUser(activeUser);
          setCurrentRole(activeUser.role);
        }
      } catch (err) {
        console.error('Storage initialization failed:', err);
      } finally {
        setLoading(false);
      }
    }
    boot();
  }, []);

  // Handler: Login Success (from LoginModal)
  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    setCurrentRole(user.role);
    showToast({
      type: 'success',
      title: `Welcome back, ${user.name}!`,
      message: `Authenticated with role "${user.role}" via IndexedDB session.`
    });
  };

  // Handler: Logout
  const handleLogout = async () => {
    await logoutUser();
    setCurrentUser(null);
    setCurrentRole('public');
    showToast({
      type: 'info',
      title: 'Signed Out',
      message: 'Active session cleared from IndexedDB & LocalStorage.'
    });
  };

  // Handler: 1-Click Quick Switch Test Account
  const handleQuickSwitch = async (roleOrEmail) => {
    try {
      const user = await switchTestAccount(roleOrEmail);
      setCurrentUser(user);
      setCurrentRole(user.role);
      showToast({
        type: 'success',
        title: `Switched to ${user.name}`,
        message: `Active persona: ${user.role} (${user.email}). Stored in IndexedDB.`
      });
    } catch (err) {
      showToast({
        type: 'error',
        title: 'Switch Failed',
        message: err.message
      });
    }
  };

  // Handler: Add New Donation
  const handleAddDonation = async (formData) => {
    try {
      const created = await addDonation(formData);
      await loadDonations();
      showToast({
        type: 'success',
        title: 'Donation Listed Successfully!',
        message: `"${created.item}" is now saved to IndexedDB & ready for local NGOs to claim.`
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

  // Handler: Claim Donation
  const handleClaimDonation = async (id, receiverInfo) => {
    try {
      const updated = await claimDonation(id, receiverInfo);
      await loadDonations();
      showToast({
        type: 'success',
        title: 'Food Donation Claimed!',
        message: `Claimed by "${receiverInfo.receiverName}". Track pickup in your Receiver Dashboard.`
      });
      navigate('dashboard');
    } catch (err) {
      showToast({
        type: 'error',
        title: 'Claim Failed',
        message: err.message
      });
    }
  };

  // Handler: Update Status (Pending Pickup -> Picked Up -> Delivered)
  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await updateDonationStatus(id, newStatus, currentRole);
      await loadDonations();
      showToast({
        type: 'success',
        title: 'Status Updated',
        message: `Listing status advanced to "${newStatus}" in IndexedDB & LocalStorage.`
      });
    } catch (err) {
      showToast({
        type: 'error',
        title: 'Status Update Error',
        message: err.message
      });
    }
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

  return (
    <div className="min-h-screen bg-slate-50 text-gray-800 flex flex-col font-sans selection:bg-emerald-200 selection:text-emerald-900">

      {/* Navigation Bar */}
      <Navbar
        activeRoute={route}
        onNavigate={navigate}
        availableCount={availableCount}
        claimedCount={claimedCount}
        currentUser={currentUser}
        onOpenLogin={() => setLoginModalOpen(true)}
        onLogout={handleLogout}
        onQuickSwitch={handleQuickSwitch}
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
            {route === 'report' && (
              <ProjectReport onNavigate={navigate} stats={stats} />
            )}
            {route === 'donor' && (
              <DonorForm
                onSubmit={handleAddDonation}
                currentUser={currentUser}
              />
            )}
            {route === 'listings' && (
              <FoodListings
                donations={donations}
                onClaim={handleClaimDonation}
                onNavigate={navigate}
                currentUser={currentUser}
              />
            )}
            {route === 'dashboard' && (
              <ReceiverDashboard
                donations={donations}
                onUpdateStatus={handleUpdateStatus}
                onNavigate={navigate}
                currentUser={currentUser}
              />
            )}
            {route === 'admin' && (
              <AdminPanel
                donations={donations}
                onRefreshData={loadDonations}
                showToast={showToast}
                onNavigate={navigate}
                currentUser={currentUser}
                onSwitchUser={handleQuickSwitch}
                onOpenLogin={() => setLoginModalOpen(true)}
              />
            )}
            {route === 'conclusion' && (
              <Conclusion onNavigate={navigate} />
            )}
          </>
        )}
      </main>

      {/* Toast Notification Container */}
      <Toast toasts={toasts} onDismiss={dismissToast} />

      {/* Login & Auth Manager Modal */}
      <LoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        currentUser={currentUser}
      />

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-auto py-8 text-xs text-gray-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
            <span><strong>FoodShare Platform</strong>: Aligned with UN SDG 2 (Zero Hunger)</span>
          </div>

          <div className="flex items-center gap-4 text-xs font-medium">
            <button onClick={() => navigate('report')} className="hover:text-emerald-700 transition-colors">Report</button>
            <span>•</span>
            <button onClick={() => navigate('listings')} className="hover:text-emerald-700 transition-colors">Listings ({availableCount})</button>
            <span>•</span>
            <button onClick={() => navigate('admin')} className="hover:text-emerald-700 transition-colors font-bold text-emerald-800">Admin Control</button>
            <span>•</span>
            <button onClick={() => navigate('conclusion')} className="hover:text-emerald-700 transition-colors">Evaluation</button>
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
