import React, { useState, useEffect, useCallback } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import {
  initializeStorage,
  getAllDonations,
  addDonation,
  applyFoodRequest,
  updateDonationStatus,
  getCurrentUser,
  logoutUser,
  subscribeToDonations,
  subscribeToAuthChanges
} from './db/storage';

// Reusable Layout & Navigation
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Toast from './components/Toast';
import AdminLoginModal from './components/AdminLoginModal';

// Feature Pages
import HomePage from './features/home/HomePage';
import FoodListingsPage from './features/products/FoodListingsPage';
import DonatePage from './features/donate/DonatePage';
import AdminPage from './features/admin/AdminPage';
import LoginPage from './features/auth/LoginPage';
import ProjectReportPage from './features/report/ProjectReportPage';
import EvaluationPage from './features/evaluation/EvaluationPage';

export default function App() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [adminLoginModalOpen, setAdminLoginModalOpen] = useState(false);

  // Helper: Trigger Toast Notification
  const showToast = useCallback(({ type = 'success', title = '', message = '' }) => {
    const id = 'toast_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6);
    setToasts((prev) => [...prev, { id, type, title, message }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const dismissToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Reload donations from Cloud Firestore
  const loadDonations = useCallback(async () => {
    try {
      const items = await getAllDonations();
      setDonations(items);
    } catch (err) {
      console.error('Failed to load donations:', err);
    }
  }, []);

  // Initialize Cloud Firestore connection on mount
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

  // Real-time Cloud Firestore & Firebase Auth Subscribers
  useEffect(() => {
    const unsubDonations = subscribeToDonations((updatedList) => {
      if (Array.isArray(updatedList)) {
        setDonations(updatedList);
      }
    });

    const unsubAuth = subscribeToAuthChanges((authMember) => {
      if (authMember && authMember.role === 'admin') {
        setCurrentUser(authMember);
      } else {
        setCurrentUser(null);
      }
    });

    return () => {
      if (unsubDonations) unsubDonations();
      if (unsubAuth) unsubAuth();
    };
  }, []);

  // Handler: Admin Login Success
  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    showToast({
      type: 'success',
      title: 'Administrator Authenticated',
      message: `Welcome, ${user.name || user.email}! Firebase Cloud Control Center unlocked.`
    });
  };

  // Handler: Admin Logout
  const handleLogout = async () => {
    await logoutUser();
    setCurrentUser(null);
    showToast({
      type: 'info',
      title: 'Signed Out',
      message: 'Signed out of Firebase Authentication.'
    });
  };

  // Handler: Add New Donation (Public: Anyone can donate without account)
  const handleAddDonation = async (formData) => {
    try {
      const created = await addDonation(formData);
      await loadDonations();
      showToast({
        type: 'success',
        title: 'Donation Listed Successfully!',
        message: `"${created.item}" saved to Firebase Cloud Firestore.`
      });
    } catch (err) {
      showToast({
        type: 'error',
        title: 'Listing Failed',
        message: err.message
      });
      throw err;
    }
  };

  // Handler: Apply Food Request (Comprehensive Form by Receiver)
  const handleApplyRequest = async (id, application) => {
    try {
      const updated = await applyFoodRequest(id, application);
      await loadDonations();
      showToast({
        type: 'success',
        title: 'Relief Request Submitted!',
        message: `Request for "${updated.item}" submitted. Administrator will review and dispatch.`
      });
    } catch (err) {
      showToast({
        type: 'error',
        title: 'Application Error',
        message: err.message
      });
      throw err;
    }
  };

  // Calculate live counts & statistics
  const safeDonations = Array.isArray(donations) ? donations : [];
  const availableCount = safeDonations.filter((d) => d.status === 'Available').length;
  const claimedCount = safeDonations.filter((d) => d.status !== 'Available').length;
  const deliveredCount = safeDonations.filter((d) => d.status === 'Delivered').length;

  const stats = {
    total: safeDonations.length,
    available: availableCount,
    claimed: claimedCount,
    delivered: deliveredCount
  };

  const isAdmin = currentUser && currentUser.role === 'admin';

  return (
    <HashRouter>
      <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-emerald-200 selection:text-emerald-900">

        {/* Global Responsive Navigation Bar */}
        <Navbar
          availableCount={availableCount}
          isAdmin={isAdmin}
          currentUser={currentUser}
          onLogout={handleLogout}
        />

        {/* Main Routed Content Area */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-28 text-emerald-800 space-y-3">
              <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="font-bold text-sm tracking-wide">
                Connecting to Firebase Cloud Firestore...
              </p>
            </div>
          ) : (
            <Routes>
              {/* 1st: Home Page */}
              <Route
                path="/"
                element={
                  <HomePage
                    donations={donations}
                    isAdmin={isAdmin}
                    onOpenAdminLogin={() => setAdminLoginModalOpen(true)}
                  />
                }
              />
              <Route path="/home" element={<Navigate to="/" replace />} />

              {/* 2nd: All Products / Food Listings */}
              <Route
                path="/products"
                element={
                  <FoodListingsPage
                    donations={donations}
                    onApplyRequest={handleApplyRequest}
                    currentUser={currentUser}
                  />
                }
              />
              <Route path="/listings" element={<Navigate to="/products" replace />} />

              {/* 3rd: Public Donor Intake Form (Donate Food without account) */}
              <Route
                path="/donate"
                element={
                  <DonatePage
                    onAddDonation={handleAddDonation}
                    currentUser={currentUser}
                  />
                }
              />
              <Route path="/donor" element={<Navigate to="/donate" replace />} />

              {/* 4th: Central Admin Control Console */}
              <Route
                path="/admin"
                element={
                  <AdminPage
                    donations={donations}
                    onRefreshData={loadDonations}
                    showToast={showToast}
                    currentUser={currentUser}
                    onOpenLogin={() => setAdminLoginModalOpen(true)}
                  />
                }
              />

              {/* Dedicated Firebase Auth Login Page */}
              <Route
                path="/login"
                element={
                  <LoginPage
                    onLoginSuccess={handleLoginSuccess}
                    showToast={showToast}
                    currentUser={currentUser}
                  />
                }
              />

              {/* UN SDG 2 Project Report */}
              <Route
                path="/report"
                element={<ProjectReportPage stats={stats} />}
              />

              {/* Evaluation & Conclusion */}
              <Route
                path="/evaluation"
                element={<EvaluationPage />}
              />
              <Route path="/conclusion" element={<Navigate to="/evaluation" replace />} />

              {/* Catch-all redirect to Home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          )}
        </main>

        {/* Global Footer */}
        <Footer />

        {/* Global Toast Notification Container */}
        <Toast toasts={toasts} onDismiss={dismissToast} />

        {/* Optional Admin Login Modal */}
        <AdminLoginModal
          isOpen={adminLoginModalOpen}
          onClose={() => setAdminLoginModalOpen(false)}
          onLoginSuccess={handleLoginSuccess}
        />

      </div>
    </HashRouter>
  );
}
