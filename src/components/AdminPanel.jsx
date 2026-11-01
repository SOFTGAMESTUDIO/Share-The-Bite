import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Database,
  Trash2,
  RotateCcw,
  Download,
  Upload,
  List,
  Activity,
  Plus,
  Edit3,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Search,
  Filter,
  X,
  ArrowRight,
  RefreshCw,
  Server,
  Layers,
  Sparkles,
  FileJson,
  Check,
  Users,
  Key,
  Eye,
  EyeOff,
  Copy,
  UserPlus,
  Building2,
  Mail,
  Phone,
  Truck,
  Package,
  XCircle,
  HelpCircle,
  FileCheck,
  MapPin,
  ClipboardList
} from 'lucide-react';

import {
  clearAllDonations,
  resetToMockData,
  exportDatabaseJSON,
  downloadDatabaseBackup,
  importDatabaseJSON,
  getStorageDiagnostics,
  getAuditLogs,
  clearAuditLogs,
  deleteDonation,
  updateDonation,
  addDonation,
  getAllUsers,
  registerUser,
  switchTestAccount,
  acceptRequest,
  rejectRequest,
  dispatchForPickup,
  markPickedUp,
  dispatchForDelivery,
  markDelivered,
  updateDonationStatus
} from '../db/storage';
import { getCategoryIcon } from '../utils/categoryIcons';

export default function AdminPanel({
  donations = [],
  onRefreshData,
  showToast,
  onNavigate,
  currentUser = null,
  onSwitchUser,
  onOpenLogin
}) {
  const [adminTab, setAdminTab] = useState('requests'); // 'requests' | 'overview' | 'listings' | 'users' | 'database' | 'audit'
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [requestFilter, setRequestFilter] = useState('All');

  // Storage diagnostics & activity
  const [storageInfo, setStorageInfo] = useState(null);
  const [auditLogs, setAuditLogs] = useState([]);

  // IndexedDB Users state
  const [usersList, setUsersList] = useState([]);
  const [revealedKeys, setRevealedKeys] = useState({});
  const [newUserModalOpen, setNewUserModalOpen] = useState(false);
  const [newUserData, setNewUserData] = useState({
    name: '',
    email: '',
    key: '',
    role: 'donor',
    organization: '',
    phone: '',
    title: ''
  });

  // Action Modals
  const [confirmClearOpen, setConfirmClearOpen] = useState(false);
  const [confirmResetOpen, setConfirmResetOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [newItemModalOpen, setNewItemModalOpen] = useState(false);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [importJsonText, setImportJsonText] = useState('');

  // Service Lifecycle Specific Modals
  const [rejectModalItem, setRejectModalItem] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('Logistical route distance exceeds current operating radius.');
  const [pickupModalItem, setPickupModalItem] = useState(null);
  const [driverInfo, setDriverInfo] = useState('Share The Bite Fleet Van #2 (Driver: Marcus Vance)');
  const [deliveryModalItem, setDeliveryModalItem] = useState(null);
  const [deliveryProof, setDeliveryProof] = useState('Verified in-person handover signature collected at recipient facility.');

  // New item form state
  const [newDonationData, setNewDonationData] = useState({
    item: '',
    category: 'Cooked Meals',
    quantity: '25 servings',
    servings: 25,
    donor: 'Central Hospitality Depot',
    donorType: 'Caterer',
    donorPhone: '+1 (555) 100-2000',
    donorEmail: 'admin@Share The Bite.org',
    location: 'Central Storage Hub, Depot 1',
    city: 'Metro Central',
    expiry: new Date(Date.now() + 48 * 3600 * 1000).toISOString().slice(0, 16),
    status: 'Available',
    dietary: 'Vegetarian',
    notes: 'Registered directly by System Administrator.'
  });

  // Load diagnostics, logs & registered users
  const refreshStorageAndLogs = async () => {
    try {
      const diag = await getStorageDiagnostics();
      setStorageInfo(diag);
      const logs = await getAuditLogs();
      setAuditLogs(logs);
      const users = await getAllUsers();
      setUsersList(users);
    } catch (e) {
      console.warn('Diagnostics load error:', e);
    }
  };

  useEffect(() => {
    refreshStorageAndLogs();
  }, [donations]);

  const toggleKeyReveal = (id) => {
    setRevealedKeys(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const copyKeyToClipboard = (key) => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(key);
      showToast({ type: 'info', title: 'Key Copied', message: `Test key "${key}" copied to clipboard.` });
    }
  };

  // Status counts
  const total = donations.length;
  const available = donations.filter(d => d.status === 'Available').length;
  const requested = donations.filter(d => d.status === 'Requested').length;
  const accepted = donations.filter(d => d.status === 'Request Accepted').length;
  const outForPickup = donations.filter(d => d.status === 'Out for Pickup').length;
  const pickedUp = donations.filter(d => d.status === 'Picked Up').length;
  const outForDelivery = donations.filter(d => d.status === 'Out for Delivery').length;
  const delivered = donations.filter(d => d.status === 'Delivered').length;
  const totalServings = donations.reduce((sum, d) => sum + (Number(d.servings) || 10), 0);

  // Active service requests list (items that have been requested or claimed)
  const serviceRequests = donations.filter(d => d.receiver || d.status !== 'Available');
  const filteredServiceRequests = serviceRequests.filter(d => {
    if (requestFilter === 'All') return true;
    return d.status === requestFilter;
  });

  // Filter listings
  const filteredDonations = donations.filter(d => {
    const matchSearch =
      d.item?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.donor?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.receiver?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'All' || d.status === statusFilter;
    return matchSearch && matchStatus;
  });

  // --------------------------------------------------------------------------
  // Service Lifecycle Action Handlers
  // --------------------------------------------------------------------------

  const handleAcceptRequest = async (id) => {
    try {
      await acceptRequest(id, 'Request reviewed and approved by System Administration.');
      await onRefreshData();
      await refreshStorageAndLogs();
      showToast({
        type: 'success',
        title: 'Request Accepted',
        message: `Approved food request for donation #${id}. Ready for pickup dispatch.`
      });
    } catch (err) {
      showToast({ type: 'error', title: 'Accept Failed', message: err.message });
    }
  };

  const handleConfirmReject = async () => {
    if (!rejectModalItem) return;
    try {
      await rejectRequest(rejectModalItem.id, rejectionReason);
      await onRefreshData();
      await refreshStorageAndLogs();
      const id = rejectModalItem.id;
      setRejectModalItem(null);
      showToast({
        type: 'warning',
        title: 'Request Rejected',
        message: `Request for donation #${id} declined. Item reset to "Available" for other shelters.`
      });
    } catch (err) {
      showToast({ type: 'error', title: 'Rejection Failed', message: err.message });
    }
  };

  const handleConfirmPickupDispatch = async () => {
    if (!pickupModalItem) return;
    try {
      await dispatchForPickup(pickupModalItem.id, driverInfo);
      await onRefreshData();
      await refreshStorageAndLogs();
      const id = pickupModalItem.id;
      setPickupModalItem(null);
      showToast({
        type: 'info',
        title: 'Dispatched for Pickup',
        message: `Donation #${id} is now "Out for Pickup" with driver "${driverInfo}".`
      });
    } catch (err) {
      showToast({ type: 'error', title: 'Dispatch Failed', message: err.message });
    }
  };

  const handleMarkPickedUp = async (id) => {
    try {
      await markPickedUp(id);
      await onRefreshData();
      await refreshStorageAndLogs();
      showToast({
        type: 'info',
        title: 'Food Picked Up',
        message: `Donation #${id} successfully collected from donor. Status updated to "Picked Up".`
      });
    } catch (err) {
      showToast({ type: 'error', title: 'Update Failed', message: err.message });
    }
  };

  const handleDispatchDelivery = async (id) => {
    try {
      await dispatchForDelivery(id);
      await onRefreshData();
      await refreshStorageAndLogs();
      showToast({
        type: 'info',
        title: 'Out for Delivery',
        message: `Donation #${id} is now "Out for Delivery" en route to recipient shelter.`
      });
    } catch (err) {
      showToast({ type: 'error', title: 'Dispatch Failed', message: err.message });
    }
  };

  const handleConfirmDelivered = async () => {
    if (!deliveryModalItem) return;
    try {
      await markDelivered(deliveryModalItem.id, deliveryProof);
      await onRefreshData();
      await refreshStorageAndLogs();
      const id = deliveryModalItem.id;
      setDeliveryModalItem(null);
      showToast({
        type: 'success',
        title: 'Delivery Confirmed & Verified',
        message: `Donation #${id} marked as "Delivered". Rescued meals distributed!`
      });
    } catch (err) {
      showToast({ type: 'error', title: 'Delivery Confirmation Failed', message: err.message });
    }
  };

  const handleInlineStatusChange = async (id, newStatus) => {
    try {
      await updateDonationStatus(id, newStatus, 'System Admin');
      await onRefreshData();
      await refreshStorageAndLogs();
      showToast({
        type: 'success',
        title: 'Status Updated',
        message: `Listing #${id} status changed to "${newStatus}".`
      });
    } catch (err) {
      showToast({ type: 'error', title: 'Update Error', message: err.message });
    }
  };

  // --------------------------------------------------------------------------
  // Standard Admin Handlers
  // --------------------------------------------------------------------------

  const handleClearAll = async () => {
    try {
      await clearAllDonations();
      await onRefreshData();
      await refreshStorageAndLogs();
      setConfirmClearOpen(false);
      showToast({
        type: 'warning',
        title: 'Database Cleared',
        message: 'All food donation listings have been permanently deleted from IndexedDB & LocalStorage.'
      });
    } catch (err) {
      showToast({ type: 'error', title: 'Clear Failed', message: err.message });
    }
  };

  const handleResetMock = async () => {
    try {
      await resetToMockData();
      await onRefreshData();
      await refreshStorageAndLogs();
      setConfirmResetOpen(false);
      showToast({
        type: 'success',
        title: 'Seed Data Restored',
        message: 'Reset database to default SDG 2 Zero Hunger mock listings in IndexedDB & LocalStorage.'
      });
    } catch (err) {
      showToast({ type: 'error', title: 'Reset Failed', message: err.message });
    }
  };

  const handleExportJSON = async () => {
    try {
      const jsonStr = await exportDatabaseJSON();
      downloadDatabaseBackup(jsonStr);
      showToast({
        type: 'success',
        title: 'Database Exported',
        message: 'Saved complete IndexedDB & LocalStorage state to JSON backup file.'
      });
    } catch (err) {
      showToast({ type: 'error', title: 'Export Failed', message: err.message });
    }
  };

  const handleImportJSON = async (e) => {
    e.preventDefault();
    try {
      if (!importJsonText.trim()) return;
      await importDatabaseJSON(importJsonText);
      await onRefreshData();
      await refreshStorageAndLogs();
      setImportModalOpen(false);
      setImportJsonText('');
      showToast({
        type: 'success',
        title: 'Database Restored',
        message: 'Successfully imported records into IndexedDB and LocalStorage.'
      });
    } catch (err) {
      showToast({ type: 'error', title: 'Import Failed', message: err.message });
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => setImportJsonText(event.target.result);
    reader.readAsText(file);
  };

  const handleDeleteItem = async (id) => {
    try {
      await deleteDonation(id);
      await onRefreshData();
      await refreshStorageAndLogs();
      setDeleteConfirmId(null);
      showToast({
        type: 'info',
        title: 'Item Deleted',
        message: `Removed donation listing #${id} from database.`
      });
    } catch (err) {
      showToast({ type: 'error', title: 'Delete Error', message: err.message });
    }
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editingItem) return;
    try {
      await updateDonation(editingItem.id, editingItem);
      await onRefreshData();
      await refreshStorageAndLogs();
      setEditingItem(null);
      showToast({
        type: 'success',
        title: 'Listing Updated',
        message: `Saved changes to #${editingItem.id} (${editingItem.item}).`
      });
    } catch (err) {
      showToast({ type: 'error', title: 'Save Error', message: err.message });
    }
  };

  const handleCreateNewItem = async (e) => {
    e.preventDefault();
    try {
      await addDonation(newDonationData);
      await onRefreshData();
      await refreshStorageAndLogs();
      setNewItemModalOpen(false);
      showToast({
        type: 'success',
        title: 'Listing Created',
        message: `Added new donation listing directly from Admin Console.`
      });
    } catch (err) {
      showToast({ type: 'error', title: 'Creation Failed', message: err.message });
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (!newUserData.name.trim() || !newUserData.email.trim() || !newUserData.key.trim()) return;
    try {
      const created = await registerUser(newUserData);
      await refreshStorageAndLogs();
      setNewUserModalOpen(false);
      setNewUserData({
        name: '',
        email: '',
        key: '',
        role: 'donor',
        organization: '',
        phone: '',
        title: ''
      });
      showToast({
        type: 'success',
        title: 'Account Stored in IndexedDB',
        message: `Registered "${created.name}" with key "${created.key}". Ready for authentication.`
      });
    } catch (err) {
      showToast({ type: 'error', title: 'Registration Failed', message: err.message });
    }
  };

  const handleClearLogs = async () => {
    await clearAuditLogs();
    await refreshStorageAndLogs();
    showToast({
      type: 'info',
      title: 'Logs Cleared',
      message: 'Audit activity trail has been cleared.'
    });
  };

  // Helper for rendering request status badge
  const renderRequestStatusBadge = (status) => {
    switch (status) {
      case 'Requested':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
            <span className="w-2 h-2 rounded-full bg-amber-600 animate-pulse"></span>
            Requested &bull; Needs Admin Review
          </span>
        );
      case 'Request Accepted':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-teal-100 text-teal-900 border border-teal-300">
            <CheckCircle2 size={13} className="text-teal-700" />
            Request Accepted &bull; Ready for Pickup
          </span>
        );
      case 'Out for Pickup':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-100 text-indigo-900 border border-indigo-300">
            <Truck size={13} className="text-indigo-700" />
            Out for Pickup (Driver Dispatched)
          </span>
        );
      case 'Picked Up':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-900 border border-blue-300">
            <Package size={13} className="text-blue-700" />
            Picked Up &bull; At Logistics Hub
          </span>
        );
      case 'Out for Delivery':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-900 border border-purple-300">
            <Truck size={13} className="text-purple-700" />
            Out for Delivery &bull; En Route to Receiver
          </span>
        );
      case 'Delivered':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
            <CheckCircle2 size={13} className="text-emerald-700" />
            Delivered & Verified
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
            {status}
          </span>
        );
    }
  };

  // Security Gate: Non-admin protection with 1-click bypass for evaluation/testing
  const isAdmin = currentUser && currentUser.role === 'admin';

  if (!isAdmin) {
    return (
      <div className="max-w-xl mx-auto py-12 px-4 animate-in fade-in duration-300">
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-xl space-y-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto shadow-inner">
            <ShieldCheck size={32} />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 bg-amber-100/80 border border-amber-300/60 px-3 py-1 rounded-full">
              Admin Login Required
            </span>
            <h2 className="text-2xl font-bold text-slate-900 mt-3 tracking-tight">Administrator Access Only</h2>
            <p className="text-sm text-slate-600 mt-2 max-w-md mx-auto leading-relaxed">
              The Admin Control Center is restricted to authorized operators to review two-sided request dossiers, manage logistics dispatches, and configure storage.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs text-left space-y-2">
            <div className="font-bold text-slate-800 flex items-center gap-1.5">
              <Key size={14} className="text-emerald-700" />
              <span>Standard Admin Credentials (Stored in IndexedDB):</span>
            </div>
            <div className="grid sm:grid-cols-2 gap-2 pt-1 font-mono text-[11px] text-slate-700">
              <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                <span className="text-slate-400 block text-[10px]">Email ID:</span>
                <strong>admin@foodshare.org</strong>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                <span className="text-slate-400 block text-[10px]">Access Key:</span>
                <strong>admin123</strong>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => onSwitchUser && onSwitchUser('admin')}
              className="w-full sm:w-auto bg-emerald-800 hover:bg-emerald-700 active:bg-emerald-900 text-white font-bold text-xs px-6 py-3.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
            >
              <ShieldCheck size={16} />
              <span>1-Click Sign In as Administrator</span>
            </button>
            <button
              onClick={onOpenLogin}
              className="w-full sm:w-auto bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs px-6 py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 border border-slate-300"
            >
              <Key size={16} />
              <span>Enter Admin Key</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-900 text-white p-6 sm:p-8 rounded-3xl border border-emerald-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
            <ShieldCheck size={16} /> Central Administrative Console & Logistics Dispatch
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Share The Bite Operations Management
          </h1>
          <p className="text-slate-300 text-sm mt-1 max-w-2xl leading-relaxed">
            Review two-sided request dossiers (Donor offer specs vs. Receiver application details), authorize pickups, accept or reject claims, dispatch volunteer transport, and manage the database.
          </p>
        </div>

        {/* Global Admin Quick Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setConfirmResetOpen(true)}
            className="bg-emerald-800 hover:bg-emerald-700 text-emerald-100 border border-emerald-600/50 text-xs font-bold px-3.5 py-2.5 rounded-xl transition-all flex items-center gap-1.5 shadow-sm"
            title="Reset to 6 default SDG 2 mock listings"
          >
            <RotateCcw size={14} />
            <span>Reset Demo Data</span>
          </button>

          <button
            onClick={() => setConfirmClearOpen(true)}
            className="bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold px-3.5 py-2.5 rounded-xl transition-all flex items-center gap-1.5 shadow-sm"
            title="Permanently wipe all records from IndexedDB and LocalStorage"
          >
            <Trash2 size={14} />
            <span>Clear All Data</span>
          </button>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex items-center gap-2 bg-white p-2 rounded-2xl border border-slate-200 shadow-xs overflow-x-auto text-xs font-bold">
        <button
          onClick={() => setAdminTab('requests')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all whitespace-nowrap ${adminTab === 'requests' ? 'bg-emerald-800 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
        >
          <ClipboardList size={15} />
          <span>Service Requests & Logistics ({serviceRequests.length})</span>
          {requested > 0 && (
            <span className="bg-amber-400 text-slate-950 font-black px-1.5 py-0.2 rounded-full text-[10px]">
              {requested} new
            </span>
          )}
        </button>

        <button
          onClick={() => setAdminTab('overview')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all whitespace-nowrap ${adminTab === 'overview' ? 'bg-emerald-800 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
        >
          <Layers size={15} />
          <span>System Overview</span>
        </button>

        <button
          onClick={() => setAdminTab('listings')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all whitespace-nowrap ${adminTab === 'listings' ? 'bg-emerald-800 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
        >
          <List size={15} />
          <span>All Listings ({donations.length})</span>
        </button>

        <button
          onClick={() => setAdminTab('users')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all whitespace-nowrap ${adminTab === 'users' ? 'bg-emerald-800 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
        >
          <Users size={15} />
          <span>IndexedDB Users & Keys ({usersList.length})</span>
        </button>

        <button
          onClick={() => setAdminTab('database')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all whitespace-nowrap ${adminTab === 'database' ? 'bg-emerald-800 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
        >
          <Database size={15} />
          <span>Database & Backup Hub</span>
        </button>

        <button
          onClick={() => setAdminTab('audit')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all whitespace-nowrap ${adminTab === 'audit' ? 'bg-emerald-800 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
        >
          <Activity size={15} />
          <span>Audit Logs ({auditLogs.length})</span>
        </button>
      </div>

      {/* =====================================================================
          TAB 1: SERVICE REQUESTS & LOGISTICS (BOTH SIDES MANAGEMENT)
          ===================================================================== */}
      {adminTab === 'requests' && (
        <div className="space-y-6">

          {/* Top Stage KPI summary */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Available</span>
              <div className="text-2xl font-extrabold text-slate-800">{available}</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Ready for requests</div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-amber-300 bg-amber-50/30 shadow-xs">
              <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider block">Requested</span>
              <div className="text-2xl font-extrabold text-amber-700">{requested}</div>
              <div className="text-[10px] text-amber-700/80 mt-0.5">Needs Admin Action</div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-teal-200 bg-teal-50/30 shadow-xs">
              <span className="text-[11px] font-bold text-teal-800 uppercase tracking-wider block">Accepted</span>
              <div className="text-2xl font-extrabold text-teal-700">{accepted}</div>
              <div className="text-[10px] text-teal-700/80 mt-0.5">Ready for dispatch</div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-indigo-200 bg-indigo-50/30 shadow-xs">
              <span className="text-[11px] font-bold text-indigo-800 uppercase tracking-wider block">Out for Pickup</span>
              <div className="text-2xl font-extrabold text-indigo-700">{outForPickup}</div>
              <div className="text-[10px] text-indigo-700/80 mt-0.5">Driver en route</div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-purple-200 bg-purple-50/30 shadow-xs">
              <span className="text-[11px] font-bold text-purple-800 uppercase tracking-wider block">Out for Delivery</span>
              <div className="text-2xl font-extrabold text-purple-700">{outForDelivery + pickedUp}</div>
              <div className="text-[10px] text-purple-700/80 mt-0.5">In transit to shelter</div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-emerald-200 bg-emerald-50/30 shadow-xs">
              <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">Delivered</span>
              <div className="text-2xl font-extrabold text-emerald-700">{delivered}</div>
              <div className="text-[10px] text-emerald-700/80 mt-0.5">Verified completed</div>
            </div>
          </div>

          {/* Filter Pills for Requests */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-2 overflow-x-auto text-xs font-semibold">
            <span className="text-slate-400 mr-1 flex items-center gap-1 font-bold whitespace-nowrap">
              <Filter size={13} /> Filter Requests:
            </span>
            {['All', 'Requested', 'Request Accepted', 'Out for Pickup', 'Picked Up', 'Out for Delivery', 'Delivered'].map((st) => (
              <button
                key={st}
                onClick={() => setRequestFilter(st)}
                className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors ${requestFilter === st ? 'bg-slate-900 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
              >
                {st} {st === 'All' ? `(${serviceRequests.length})` : ''}
              </button>
            ))}
          </div>

          {/* Service Requests Dossiers List */}
          {filteredServiceRequests.length === 0 ? (
            <div className="bg-white rounded-3xl p-16 text-center border border-dashed border-slate-300">
              <ClipboardList size={48} className="mx-auto text-slate-300 mb-3" />
              <h2 className="text-base font-bold text-slate-800">No relief requests in this stage</h2>
              <p className="text-slate-500 text-xs mt-1 max-w-sm mx-auto">
                When receivers or shelters apply for food donations from the listings page, they will appear here with complete two-sided dossiers for administrative dispatch.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredServiceRequests.map((item) => {
                const app = item.receiverApplication || {};
                const isRequested = item.status === 'Requested';
                const isAccepted = item.status === 'Request Accepted';
                const isOutForPickup = item.status === 'Out for Pickup';
                const isPickedUp = item.status === 'Picked Up';
                const isOutForDelivery = item.status === 'Out for Delivery';
                const isDelivered = item.status === 'Delivered';

                return (
                  <div
                    key={item.id}
                    className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden hover:border-slate-300 transition-all space-y-4 p-6 sm:p-8"
                  >
                    {/* Header: Title, Category & Current Status */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center flex-shrink-0 shadow-2xs">
                          {getCategoryIcon(item.category, 22)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h2 className="text-lg font-bold text-slate-900">{item.item}</h2>
                            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-lg">
                              #{item.id}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5">
                            Category: <strong>{item.category}</strong> &bull; Volume: <strong>{item.quantity}</strong> ({item.servings || 10} portions)
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-3">
                        {renderRequestStatusBadge(item.status)}
                      </div>
                    </div>

                    {/* TWO-SIDED DOSSIER GRID: DONOR SIDE VS RECEIVER SIDE */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

                      {/* SIDE 1: DONOR OFFER SPECIFICATIONS */}
                      <div className="bg-slate-50/70 border border-slate-200 rounded-2xl p-5 space-y-3">
                        <div className="flex items-center justify-between pb-2 border-b border-slate-200/80">
                          <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
                            <Building2 size={15} className="text-emerald-700" />
                            Side 1: Donor Intake Specifications
                          </span>
                          <span className="text-[11px] font-semibold text-emerald-800 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                            Public Offer
                          </span>
                        </div>

                        <div className="space-y-2 text-xs text-slate-700">
                          <div>
                            <span className="text-slate-400 block text-[10px] uppercase font-bold">Donor Entity</span>
                            <span className="font-bold text-slate-900 text-sm">{item.donor}</span>
                            {item.donorType && (
                              <span className="ml-1 text-slate-500 font-medium">({item.donorType})</span>
                            )}
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                            <div>
                              <span className="text-slate-400 block text-[10px] uppercase font-bold">Contact Phone</span>
                              <span className="font-semibold text-slate-800">{item.donorPhone || 'N/A'}</span>
                            </div>
                            <div>
                              <span className="text-slate-400 block text-[10px] uppercase font-bold">Email</span>
                              <span className="font-semibold text-slate-800">{item.donorEmail || 'N/A'}</span>
                            </div>
                          </div>

                          <div>
                            <span className="text-slate-400 block text-[10px] uppercase font-bold">Pickup Address</span>
                            <div className="flex items-start gap-1 font-medium text-slate-800">
                              <MapPin size={13} className="text-emerald-700 flex-shrink-0 mt-0.5" />
                              <span>{item.location} {item.city && `(${item.city})`}</span>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-2 pt-1">
                            <div>
                              <span className="text-slate-400 block text-[10px] uppercase font-bold">Perishability Expiry</span>
                              <span className="font-semibold text-slate-800">
                                {new Date(item.expiry).toLocaleDateString()} {new Date(item.expiry).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            <div>
                              <span className="text-slate-400 block text-[10px] uppercase font-bold">Dietary Classification</span>
                              <span className="font-semibold text-slate-800">{item.dietary || 'Standard'}</span>
                            </div>
                          </div>

                          {item.notes && (
                            <div className="bg-white p-2.5 rounded-xl border border-slate-200 text-[11px] text-slate-600">
                              <span className="font-bold text-slate-700 block">Donor Notes:</span>
                              {item.notes}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* SIDE 2: RECEIVER APPLICATION SPECIFICATIONS */}
                      <div className="bg-blue-50/40 border border-blue-200/80 rounded-2xl p-5 space-y-3">
                        <div className="flex items-center justify-between pb-2 border-b border-blue-200/80">
                          <span className="text-xs font-bold text-blue-950 uppercase tracking-wider flex items-center gap-1.5">
                            <Users size={15} className="text-blue-700" />
                            Side 2: Receiver Application Details
                          </span>
                          <span className="text-[11px] font-bold text-blue-800 bg-white px-2 py-0.5 rounded-md border border-blue-200">
                            {app.receiverType || 'Relief Partner'}
                          </span>
                        </div>

                        <div className="space-y-2 text-xs text-slate-700">
                          <div>
                            <span className="text-slate-400 block text-[10px] uppercase font-bold">Recipient Organization</span>
                            <span className="font-bold text-blue-950 text-sm">
                              {app.receiverName || item.receiver || 'Community Shelter'}
                            </span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                            <div>
                              <span className="text-slate-400 block text-[10px] uppercase font-bold">Contact Person</span>
                              <span className="font-semibold text-slate-800">{app.contactPerson || 'Coordinator'}</span>
                            </div>
                            <div>
                              <span className="text-slate-400 block text-[10px] uppercase font-bold">Receiver Phone</span>
                              <span className="font-semibold text-slate-800">{app.receiverPhone || item.receiverPhone || 'N/A'}</span>
                            </div>
                          </div>

                          <div>
                            <span className="text-slate-400 block text-[10px] uppercase font-bold">Delivery / Drop-Off Destination</span>
                            <div className="flex items-start gap-1 font-medium text-slate-800">
                              <MapPin size={13} className="text-blue-700 flex-shrink-0 mt-0.5" />
                              <span>{app.deliveryAddress || 'Shelter Central Dining'}</span>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-2 pt-1">
                            <div>
                              <span className="text-slate-400 block text-[10px] uppercase font-bold">Beneficiaries to Feed</span>
                              <span className="font-bold text-emerald-800 text-sm">
                                {app.beneficiaryCount || item.servings || 10} meals
                              </span>
                            </div>
                            <div>
                              <span className="text-slate-400 block text-[10px] uppercase font-bold">Urgency Timeline</span>
                              <span className="font-semibold text-amber-800">{app.urgency || 'Immediate'}</span>
                            </div>
                          </div>

                          <div>
                            <span className="text-slate-400 block text-[10px] uppercase font-bold">Logistics & Vehicle Mode</span>
                            <span className="font-semibold text-slate-800">{app.vehicleType || 'Volunteer Transport'}</span>
                          </div>

                          {app.receiverNotes && (
                            <div className="bg-white p-2.5 rounded-xl border border-blue-200 text-[11px] text-slate-700">
                              <span className="font-bold text-blue-950 block">Receiver Application Notes:</span>
                              {app.receiverNotes}
                            </div>
                          )}
                        </div>
                      </div>

                    </div>

                    {/* ADMIN SERVICE LIFECYCLE ACTION CONTROLS */}
                    <div className="pt-3 border-t border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">

                      {/* Left: Administrative Manual Status Selector Override */}
                      <div className="flex items-center gap-2 text-xs">
                        <span className="font-bold text-slate-500 whitespace-nowrap">Override Status:</span>
                        <select
                          value={item.status}
                          onChange={(e) => handleInlineStatusChange(item.id, e.target.value)}
                          className="px-3 py-1.5 rounded-xl border border-slate-300 font-bold bg-white text-xs outline-none focus:border-emerald-600"
                        >
                          <option value="Available">Available (Reset Claim)</option>
                          <option value="Requested">Requested (Review)</option>
                          <option value="Request Accepted">Request Accepted</option>
                          <option value="Out for Pickup">Out for Pickup</option>
                          <option value="Picked Up">Picked Up</option>
                          <option value="Out for Delivery">Out for Delivery</option>
                          <option value="Delivered">Delivered</option>
                        </select>
                      </div>

                      {/* Right: Quick Operational Workflow Buttons */}
                      <div className="flex flex-wrap items-center gap-2">

                        {/* When REQUESTED: Accept or Reject */}
                        {isRequested && (
                          <>
                            <button
                              onClick={() => {
                                setRejectModalItem(item);
                                setRejectionReason('Logistical route distance exceeds current operating radius.');
                              }}
                              className="bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-xs px-4 py-2 rounded-xl transition-all flex items-center gap-1.5"
                            >
                              <XCircle size={15} />
                              <span>Reject Request</span>
                            </button>

                            <button
                              onClick={() => handleAcceptRequest(item.id)}
                              className="bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-2 rounded-xl transition-all shadow-xs flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:outline-none"
                            >
                              <CheckCircle2 size={15} />
                              <span>Accept Request</span>
                            </button>
                          </>
                        )}

                        {/* When REQUEST ACCEPTED: Dispatch Driver Out for Pickup */}
                        {isAccepted && (
                          <button
                            onClick={() => {
                              setPickupModalItem(item);
                              setDriverInfo('Share The Bite Fleet Van #2 (Driver: Marcus Vance)');
                            }}
                            className="bg-indigo-700 hover:bg-indigo-600 text-white font-bold text-xs px-5 py-2 rounded-xl transition-all shadow-xs flex items-center gap-1.5"
                          >
                            <Truck size={15} />
                            <span>Dispatch Driver (Out for Pickup)</span>
                          </button>
                        )}

                        {/* When OUT FOR PICKUP: Mark Picked Up */}
                        {isOutForPickup && (
                          <button
                            onClick={() => handleMarkPickedUp(item.id)}
                            className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-5 py-2 rounded-xl transition-all shadow-xs flex items-center gap-1.5"
                          >
                            <Package size={15} />
                            <span>Confirm Picked Up from Donor</span>
                          </button>
                        )}

                        {/* When PICKED UP: Dispatch Out for Delivery */}
                        {isPickedUp && (
                          <button
                            onClick={() => handleDispatchDelivery(item.id)}
                            className="bg-purple-700 hover:bg-purple-600 text-white font-bold text-xs px-5 py-2 rounded-xl transition-all shadow-xs flex items-center gap-1.5"
                          >
                            <Truck size={15} />
                            <span>Dispatch Out for Delivery</span>
                          </button>
                        )}

                        {/* When OUT FOR DELIVERY: Confirm Delivered */}
                        {isOutForDelivery && (
                          <button
                            onClick={() => {
                              setDeliveryModalItem(item);
                              setDeliveryProof('Verified in-person handover signature collected at recipient facility.');
                            }}
                            className="bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs px-5 py-2 rounded-xl transition-all shadow-xs flex items-center gap-1.5"
                          >
                            <CheckCircle2 size={15} />
                            <span>Confirm Delivered to Shelter</span>
                          </button>
                        )}

                        {/* When DELIVERED */}
                        {isDelivered && (
                          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5">
                            <CheckCircle2 size={15} className="text-emerald-700" />
                            <span>Mission Complete &bull; Servings Distributed</span>
                          </div>
                        )}

                      </div>

                    </div>

                  </div>
                );
              })}
            </div>
          )}

        </div>
      )}

      {/* =====================================================================
          TAB 2: SYSTEM OVERVIEW
          ===================================================================== */}
      {adminTab === 'overview' && (
        <div className="space-y-6">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Total Food Records</span>
              <div className="text-3xl font-extrabold text-slate-900">{total}</div>
              <div className="text-xs text-emerald-800 font-semibold mt-1">In IndexedDB Object Store</div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-emerald-200 bg-emerald-50/20 shadow-xs">
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block mb-1">Available Food</span>
              <div className="text-3xl font-extrabold text-emerald-700">{available}</div>
              <div className="text-xs text-slate-500 mt-1">Ready for requests</div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-amber-200 bg-amber-50/20 shadow-xs">
              <span className="text-xs font-bold text-amber-800 uppercase tracking-wider block mb-1">Active Pipeline</span>
              <div className="text-3xl font-extrabold text-amber-700">{requested + accepted + outForPickup + outForDelivery}</div>
              <div className="text-xs text-slate-500 mt-1">In logistics progress</div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-emerald-200 bg-emerald-50/20 shadow-xs">
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block mb-1">Total Servings Rescued</span>
              <div className="text-3xl font-extrabold text-emerald-700">{totalServings}</div>
              <div className="text-xs text-emerald-800 font-semibold mt-1">Beneficiaries fed</div>
            </div>
          </div>

          {/* Database Diagnostics */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <Database size={20} />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">Dual-Engine Storage Diagnostics</h3>
                  <p className="text-xs text-slate-500">IndexedDB primary database + LocalStorage persistent mirror</p>
                </div>
              </div>
              <button
                onClick={refreshStorageAndLogs}
                className="p-2 hover:bg-slate-100 text-slate-600 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <RefreshCw size={14} /> Refresh
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <div className="bg-slate-50 p-4 rounded-2xl">
                <span className="font-bold text-slate-500 block mb-1">Engine Configuration</span>
                <span className="font-extrabold text-emerald-900 text-sm">{storageInfo?.engine || 'IndexedDB + LocalStorage'}</span>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl">
                <span className="font-bold text-slate-500 block mb-1">IndexedDB Status</span>
                <span className="font-extrabold text-emerald-700 text-sm flex items-center gap-1">
                  <CheckCircle2 size={16} /> Connected (`{storageInfo?.databaseName || 'Share The BiteAppDB'}`)
                </span>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl">
                <span className="font-bold text-slate-500 block mb-1">LocalStorage Backup</span>
                <span className="font-extrabold text-emerald-700 text-sm flex items-center gap-1">
                  <CheckCircle2 size={16} /> Synchronized Mirror
                </span>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl">
                <span className="font-bold text-slate-500 block mb-1">Estimated Size</span>
                <span className="font-extrabold text-slate-800 text-sm">{storageInfo?.approximateSizeFormatted || '12.4 KB'}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 3: MANAGE FOOD LISTINGS TABLE
          ===================================================================== */}
      {adminTab === 'listings' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">All Database Food Listings</h2>
              <p className="text-xs text-slate-500 mt-0.5">Modify, reassign status, or remove any donation in the system</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setNewItemModalOpen(true)}
                className="bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-xs flex items-center gap-1.5"
              >
                <Plus size={15} />
                <span>+ Add Food Listing (Admin)</span>
              </button>
            </div>
          </div>

          {/* Search & Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3.5 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Search food, donor, receiver, location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-300 text-xs font-medium focus:border-emerald-600 outline-none"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium bg-white focus:border-emerald-600 outline-none"
            >
              <option value="All">All Statuses</option>
              <option value="Available">Available</option>
              <option value="Requested">Requested</option>
              <option value="Request Accepted">Request Accepted</option>
              <option value="Out for Pickup">Out for Pickup</option>
              <option value="Picked Up">Picked Up</option>
              <option value="Out for Delivery">Out for Delivery</option>
              <option value="Delivered">Delivered</option>
            </select>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-600 uppercase tracking-wider text-[10px] font-bold border-y border-slate-200">
                  <th className="py-3 px-4">Item & Donor</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Quantity</th>
                  <th className="py-3 px-4">Status Selector</th>
                  <th className="py-3 px-4">Claimed / Requested By</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredDonations.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-8 text-center text-slate-400">
                      No listings match your search or the database is currently empty.
                    </td>
                  </tr>
                ) : (
                  filteredDonations.map((d) => (
                    <tr key={d.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-md bg-slate-100 border border-slate-200 flex items-center justify-center flex-shrink-0">
                            {getCategoryIcon(d.category, 14)}
                          </div>
                          <div>
                            <div className="font-extrabold text-slate-900">{d.item}</div>
                            <div className="text-[11px] text-slate-500 font-normal">
                              #{d.id} &bull; {d.donor}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-slate-600">
                        <span className="bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                          {d.category}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-slate-700">
                        {d.quantity} ({d.servings || 10} portions)
                      </td>

                      {/* Direct Inline Status Changer */}
                      <td className="py-3.5 px-4">
                        <select
                          value={d.status}
                          onChange={(e) => handleInlineStatusChange(d.id, e.target.value)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold border outline-none ${d.status === 'Available'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                              : d.status === 'Requested'
                                ? 'bg-amber-50 text-amber-800 border-amber-300'
                                : d.status === 'Picked Up'
                                  ? 'bg-blue-50 text-blue-800 border-blue-300'
                                  : 'bg-emerald-100 text-emerald-900 border-emerald-400'
                            }`}
                        >
                          <option value="Available">Available</option>
                          <option value="Requested">Requested</option>
                          <option value="Request Accepted">Request Accepted</option>
                          <option value="Out for Pickup">Out for Pickup</option>
                          <option value="Picked Up">Picked Up</option>
                          <option value="Out for Delivery">Out for Delivery</option>
                          <option value="Delivered">Delivered</option>
                        </select>
                      </td>

                      <td className="py-3.5 px-4 text-slate-600 text-[11px]">
                        {d.receiver ? (
                          <span className="font-bold text-slate-800">{d.receiver}</span>
                        ) : (
                          <span className="text-slate-400 italic">Unclaimed</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setEditingItem({ ...d })}
                            className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
                            title="Edit Listing"
                          >
                            <Edit3 size={15} />
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(d.id)}
                            className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Delete Listing"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 4: INDEXEDDB USERS & ACCESS KEYS
          ===================================================================== */}
      {adminTab === 'users' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-1">
                <Users size={15} /> IndexedDB Object Store: `users`
              </div>
              <h2 className="text-xl font-extrabold text-slate-900">User Accounts & Authentication Credentials</h2>
              <p className="text-xs text-slate-500 mt-0.5">All test credentials and personas are persisted natively in your browser's IndexedDB</p>
            </div>

            <button
              onClick={() => setNewUserModalOpen(true)}
              className="bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-xs flex items-center gap-1.5 self-start sm:self-auto"
            >
              <UserPlus size={15} />
              <span>Register User in IndexedDB</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {usersList.map((user) => {
              const isRevealed = !!revealedKeys[user.id];
              return (
                <div key={user.id} className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3 relative group">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-800 text-white font-extrabold text-xs flex items-center justify-center shadow-xs">
                        {user.avatarInitials || user.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm leading-tight">{user.name}</h4>
                        <span className="text-[11px] text-slate-500">{user.organization || user.title || 'Member'}</span>
                      </div>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${user.role === 'admin' ? 'bg-amber-100 text-amber-900 border border-amber-300' :
                        user.role === 'donor' ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' :
                          'bg-blue-100 text-blue-900 border border-blue-300'
                      }`}>
                      {user.role}
                    </span>
                  </div>

                  <div className="space-y-1 text-xs text-slate-600 pt-1">
                    <div className="flex items-center gap-1.5">
                      <Mail size={13} className="text-slate-400" />
                      <span>{user.email}</span>
                    </div>
                    {user.phone && (
                      <div className="flex items-center gap-1.5">
                        <Phone size={13} className="text-slate-400" />
                        <span>{user.phone}</span>
                      </div>
                    )}
                  </div>

                  {/* Credentials Box */}
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200 flex items-center justify-between gap-2 text-xs">
                    <div className="font-mono text-[11px] truncate">
                      <span className="text-slate-400 text-[10px] mr-1">Key:</span>
                      <strong>{isRevealed ? user.key : '••••••••••••'}</strong>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => toggleKeyReveal(user.id)}
                        className="p-1 text-slate-400 hover:text-slate-700"
                        title={isRevealed ? 'Hide Key' : 'Reveal Key'}
                      >
                        {isRevealed ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                      <button
                        onClick={() => copyKeyToClipboard(user.key)}
                        className="p-1 text-slate-400 hover:text-emerald-700"
                        title="Copy Key to Clipboard"
                      >
                        <Copy size={14} />
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={() => onSwitchUser && onSwitchUser(user.email)}
                    className="w-full py-2 bg-white hover:bg-emerald-50 text-emerald-900 border border-slate-200 hover:border-emerald-300 font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
                  >
                    <span>Authenticate As {user.name.split(' ')[0]}</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 5: DATABASE & STORAGE HUB
          ===================================================================== */}
      {adminTab === 'database' && (
        <div className="space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">IndexedDB & LocalStorage Engine Center</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Full programmatic control over the browser-native database and backup files.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">

              {/* Card 1: Clear All Data */}
              <div className="border border-rose-200 bg-rose-50/40 rounded-2xl p-6 space-y-3">
                <div className="flex items-center gap-2 text-rose-800 font-bold text-base">
                  <Trash2 size={18} className="text-rose-600" />
                  Clear All Database Records
                </div>
                <p className="text-xs text-rose-950/80 leading-relaxed">
                  Permanently deletes all food donation entries from the IndexedDB `donations` store and LocalStorage backup cache.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => setConfirmClearOpen(true)}
                    className="bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-xs transition-all"
                  >
                    Clear All Donations ({total})
                  </button>
                </div>
              </div>

              {/* Card 2: Restore Default Mock Data */}
              <div className="border border-emerald-200 bg-emerald-50/40 rounded-2xl p-6 space-y-3">
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-base">
                  <RotateCcw size={18} className="text-emerald-700" />
                  Restore Demo Mock Dataset
                </div>
                <p className="text-xs text-emerald-950/80 leading-relaxed">
                  Populates IndexedDB and LocalStorage with the default verified SDG 2 Zero Hunger food listings and sample active requests.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => setConfirmResetOpen(true)}
                    className="bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-xs transition-all"
                  >
                    Restore Demo Seed Data
                  </button>
                </div>
              </div>

              {/* Card 3: Export Database JSON */}
              <div className="border border-blue-200 bg-blue-50/40 rounded-2xl p-6 space-y-3">
                <div className="flex items-center gap-2 text-blue-800 font-bold text-base">
                  <Download size={18} className="text-blue-600" />
                  Export Full Database Backup
                </div>
                <p className="text-xs text-blue-950/80 leading-relaxed">
                  Creates an export file (`Share The Bite_backup.json`) containing all donations, activity audit logs, and users.
                </p>
                <div className="pt-2">
                  <button
                    onClick={handleExportJSON}
                    className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-xs transition-all flex items-center gap-1.5"
                  >
                    <FileJson size={15} /> Download Backup (.JSON)
                  </button>
                </div>
              </div>

              {/* Card 4: Import Database JSON */}
              <div className="border border-purple-200 bg-purple-50/40 rounded-2xl p-6 space-y-3">
                <div className="flex items-center gap-2 text-purple-800 font-bold text-base">
                  <Upload size={18} className="text-purple-600" />
                  Import Database Backup
                </div>
                <p className="text-xs text-purple-950/80 leading-relaxed">
                  Upload an existing JSON export to completely restore donations, claims, and activity logs into IndexedDB.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => setImportModalOpen(true)}
                    className="bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-xs transition-all flex items-center gap-1.5"
                  >
                    <Upload size={15} /> Import From File or Text
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 6: AUDIT LOGS
          ===================================================================== */}
      {adminTab === 'audit' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">System Activity Audit Trail</h2>
              <p className="text-xs text-slate-500 mt-0.5">Chronological record of donations, receiver requests, status changes, and admin decisions</p>
            </div>

            <button
              onClick={handleClearLogs}
              className="px-4 py-2 border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl transition-colors"
            >
              Clear Audit Log
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {auditLogs.map((log) => (
              <div key={log.id} className="py-3.5 flex items-start justify-between gap-4 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-800 bg-slate-100 px-2.5 py-0.5 rounded-md text-[10px] uppercase">
                      {log.action}
                    </span>
                    <span className="text-slate-500 font-medium">Actor: <strong>{log.actor}</strong></span>
                  </div>
                  <p className="text-slate-700">{log.details}</p>
                </div>
                <span className="text-[11px] text-slate-400 whitespace-nowrap">
                  {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </span>
              </div>
            ))}
            {auditLogs.length === 0 && (
              <div className="py-12 text-center text-slate-400 text-xs">
                No activity recorded yet in the audit log store.
              </div>
            )}
          </div>
        </div>
      )}

      {/* =====================================================================
          MODALS
          ===================================================================== */}

      {/* MODAL: REJECT REQUEST WITH REASON */}
      {rejectModalItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-rose-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 text-rose-700 font-bold text-base">
                <XCircle size={20} />
                <span>Decline Relief Request</span>
              </div>
              <button onClick={() => setRejectModalItem(null)} className="text-slate-400 hover:text-slate-600 p-1">
                <X size={18} />
              </button>
            </div>

            <div className="text-xs text-slate-600 space-y-2">
              <p>
                You are declining the application from <strong>{rejectModalItem.receiver || 'Applicant'}</strong> for donation #{rejectModalItem.id} (<strong>{rejectModalItem.item}</strong>).
              </p>
              <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl text-amber-900">
                <strong>Important:</strong> Declining this application will reset the listing status back to <span className="font-bold text-emerald-800">"Available"</span> so other shelters can apply immediately.
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Reason for Rejection <span className="text-rose-500">*</span>
              </label>

              {/* Preset buttons */}
              <div className="flex flex-wrap gap-1.5 text-[11px]">
                {[
                  'Logistical route distance exceeds operating perimeter.',
                  'Insufficient cold storage at destination facility.',
                  'Duplicate request received for the same dining shift.',
                  'Unable to confirm telephone contact with applicant coordinator.'
                ].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setRejectionReason(preset)}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-left"
                  >
                    {preset}
                  </button>
                ))}
              </div>

              <textarea
                rows={3}
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="w-full p-3 text-xs rounded-xl border border-slate-300 focus:border-rose-500 outline-none font-medium mt-2"
                placeholder="Enter justification for administrative decline..."
              />
            </div>

            <div className="pt-2 flex gap-3">
              <button
                type="button"
                onClick={() => setRejectModalItem(null)}
                className="flex-1 py-2.5 border border-slate-300 text-slate-700 font-semibold rounded-xl text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmReject}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-xs shadow-xs"
              >
                Confirm Decline & Reset to Available
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: DISPATCH PICKUP DRIVER */}
      {pickupModalItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-indigo-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 text-indigo-800 font-bold text-base">
                <Truck size={20} />
                <span>Dispatch Driver for Pickup</span>
              </div>
              <button onClick={() => setPickupModalItem(null)} className="text-slate-400 hover:text-slate-600 p-1">
                <X size={18} />
              </button>
            </div>

            <div className="text-xs text-slate-600 space-y-2">
              <p>
                Assign driver and vehicle details to collect donation #{pickupModalItem.id} (<strong>{pickupModalItem.item}</strong>) from <strong>{pickupModalItem.donor}</strong>.
              </p>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <strong>Donor Location:</strong> {pickupModalItem.location}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Driver Name / Fleet Van Information
              </label>
              <input
                type="text"
                value={driverInfo}
                onChange={(e) => setDriverInfo(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:border-indigo-600 outline-none"
              />
            </div>

            <div className="pt-2 flex gap-3">
              <button
                type="button"
                onClick={() => setPickupModalItem(null)}
                className="flex-1 py-2.5 border border-slate-300 text-slate-700 font-semibold rounded-xl text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmPickupDispatch}
                className="flex-1 py-2.5 bg-indigo-700 hover:bg-indigo-600 text-white font-bold rounded-xl text-xs shadow-xs"
              >
                Confirm Dispatch Out for Pickup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: CONFIRM DELIVERED */}
      {deliveryModalItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-emerald-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 text-emerald-800 font-bold text-base">
                <CheckCircle2 size={20} />
                <span>Confirm Delivery Handover</span>
              </div>
              <button onClick={() => setDeliveryModalItem(null)} className="text-slate-400 hover:text-slate-600 p-1">
                <X size={18} />
              </button>
            </div>

            <div className="text-xs text-slate-600 space-y-2">
              <p>
                Confirming delivery of #{deliveryModalItem.id} (<strong>{deliveryModalItem.item}</strong>) to receiver <strong>{deliveryModalItem.receiver}</strong>.
              </p>
              <div className="bg-emerald-50 p-2.5 rounded-xl border border-emerald-200 text-emerald-900">
                Rescuing <strong>{deliveryModalItem.quantity}</strong> ({deliveryModalItem.servings || 10} portions) for zero hunger relief.
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Delivery Verification Note / Signature Proof
              </label>
              <input
                type="text"
                value={deliveryProof}
                onChange={(e) => setDeliveryProof(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:border-emerald-600 outline-none"
              />
            </div>

            <div className="pt-2 flex gap-3">
              <button
                type="button"
                onClick={() => setDeliveryModalItem(null)}
                className="flex-1 py-2.5 border border-slate-300 text-slate-700 font-semibold rounded-xl text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelivered}
                className="flex-1 py-2.5 bg-emerald-800 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-xs"
              >
                Confirm Delivered & Rescued
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: CLEAR ALL CONFIRMATION */}
      {confirmClearOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-rose-100 space-y-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 size={24} />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">Permanently Clear All Records?</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                This will delete all food listings and active requests from IndexedDB and LocalStorage.
              </p>
            </div>
            <div className="flex gap-2.5 pt-2">
              <button
                onClick={() => setConfirmClearOpen(false)}
                className="flex-1 py-2.5 border border-slate-300 text-slate-700 font-semibold rounded-xl text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleClearAll}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-xs"
              >
                Clear Database
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: RESTORE MOCK SEED DATA */}
      {confirmResetOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-emerald-100 space-y-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
              <RotateCcw size={24} />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">Restore SDG-2 Demo Data?</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Replaces current records with verified SDG 2 Zero Hunger mock listings, including active request and logistics pipelines.
              </p>
            </div>
            <div className="flex gap-2.5 pt-2">
              <button
                onClick={() => setConfirmResetOpen(false)}
                className="flex-1 py-2.5 border border-slate-300 text-slate-700 font-semibold rounded-xl text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleResetMock}
                className="flex-1 py-2.5 bg-emerald-800 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs"
              >
                Restore Demo Data
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: DELETE CONFIRM */}
      {deleteConfirmId !== null && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-rose-100 space-y-4 text-center">
            <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 size={20} />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Delete Listing #{deleteConfirmId}?</h3>
              <p className="text-xs text-slate-500 mt-1">This item will be removed permanently.</p>
            </div>
            <div className="flex gap-2.5 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-2.5 border border-slate-300 text-slate-700 font-semibold rounded-xl text-xs"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteItem(deleteConfirmId)}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-xs"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: EDIT DONATION ITEM */}
      {editingItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-slate-900 text-base">Edit Donation Listing #{editingItem.id}</h3>
              <button onClick={() => setEditingItem(null)} className="text-slate-400 hover:text-slate-600 p-1">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Item Title</label>
                <input
                  required
                  type="text"
                  value={editingItem.item}
                  onChange={(e) => setEditingItem({ ...editingItem, item: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 outline-none focus:border-emerald-600 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Category</label>
                  <select
                    value={editingItem.category}
                    onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 outline-none focus:border-emerald-600 font-medium bg-white"
                  >
                    <option value="Cooked Meals">Cooked Meals</option>
                    <option value="Fresh Produce">Fresh Produce</option>
                    <option value="Bakery">Bakery</option>
                    <option value="Dairy">Dairy</option>
                    <option value="Packaged & Canned">Packaged & Canned</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Status</label>
                  <select
                    value={editingItem.status}
                    onChange={(e) => setEditingItem({ ...editingItem, status: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 outline-none focus:border-emerald-600 font-medium bg-white"
                  >
                    <option value="Available">Available</option>
                    <option value="Requested">Requested</option>
                    <option value="Request Accepted">Request Accepted</option>
                    <option value="Out for Pickup">Out for Pickup</option>
                    <option value="Picked Up">Picked Up</option>
                    <option value="Out for Delivery">Out for Delivery</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Quantity</label>
                  <input
                    type="text"
                    value={editingItem.quantity}
                    onChange={(e) => setEditingItem({ ...editingItem, quantity: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 outline-none focus:border-emerald-600 font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Portions / Servings</label>
                  <input
                    type="number"
                    value={editingItem.servings || 10}
                    onChange={(e) => setEditingItem({ ...editingItem, servings: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 outline-none focus:border-emerald-600 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Donor Name</label>
                <input
                  type="text"
                  value={editingItem.donor}
                  onChange={(e) => setEditingItem({ ...editingItem, donor: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 outline-none focus:border-emerald-600 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Pickup Location</label>
                <input
                  type="text"
                  value={editingItem.location}
                  onChange={(e) => setEditingItem({ ...editingItem, location: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 outline-none focus:border-emerald-600 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Claimed By (Receiver)</label>
                <input
                  type="text"
                  value={editingItem.receiver || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, receiver: e.target.value })}
                  placeholder="e.g. Hope Shelter (leave blank if available)"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 outline-none focus:border-emerald-600 font-medium"
                />
              </div>

              <div className="pt-3 flex gap-3">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="flex-1 py-2.5 border border-slate-300 text-slate-700 font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-800 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD NEW ITEM FROM ADMIN */}
      {newItemModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-slate-900 text-base">Create Food Listing (Admin)</h3>
              <button onClick={() => setNewItemModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateNewItem} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Food Item Name *</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. 40 Trays of Fresh Rice & Vegetables"
                  value={newDonationData.item}
                  onChange={(e) => setNewDonationData({ ...newDonationData, item: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 outline-none focus:border-emerald-600 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Category</label>
                  <select
                    value={newDonationData.category}
                    onChange={(e) => setNewDonationData({ ...newDonationData, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 outline-none focus:border-emerald-600 font-medium bg-white"
                  >
                    <option value="Cooked Meals">Cooked Meals</option>
                    <option value="Fresh Produce">Fresh Produce</option>
                    <option value="Bakery">Bakery</option>
                    <option value="Dairy">Dairy</option>
                    <option value="Packaged & Canned">Packaged & Canned</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Quantity</label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. 40 servings"
                    value={newDonationData.quantity}
                    onChange={(e) => setNewDonationData({ ...newDonationData, quantity: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 outline-none focus:border-emerald-600 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Donor Name</label>
                <input
                  required
                  type="text"
                  value={newDonationData.donor}
                  onChange={(e) => setNewDonationData({ ...newDonationData, donor: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 outline-none focus:border-emerald-600 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Location</label>
                <input
                  required
                  type="text"
                  value={newDonationData.location}
                  onChange={(e) => setNewDonationData({ ...newDonationData, location: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 outline-none focus:border-emerald-600 font-medium"
                />
              </div>

              <div className="pt-3 flex gap-3">
                <button
                  type="button"
                  onClick={() => setNewItemModalOpen(false)}
                  className="flex-1 py-2.5 border border-slate-300 text-slate-700 font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-800 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs"
                >
                  Publish to Database
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: IMPORT JSON */}
      {importModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-purple-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-slate-900 text-base">Import Database JSON</h3>
              <button onClick={() => setImportModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleImportJSON} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Select Backup .JSON File
                </label>
                <input
                  type="file"
                  accept=".json,application/json"
                  onChange={handleFileUpload}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Or Paste JSON Text
                </label>
                <textarea
                  rows={6}
                  placeholder='{"donations": [...], "logs": [...]}'
                  value={importJsonText}
                  onChange={(e) => setImportJsonText(e.target.value)}
                  className="w-full p-3 font-mono text-[11px] rounded-xl border border-slate-300 focus:border-purple-600 outline-none"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setImportModalOpen(false)}
                  className="flex-1 py-2.5 border border-slate-300 text-slate-700 font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl shadow-xs"
                >
                  Validate & Import
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: REGISTER NEW USER IN INDEXEDDB */}
      {newUserModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  <UserPlus size={16} />
                </div>
                <h3 className="font-extrabold text-slate-900 text-base">Register User in IndexedDB</h3>
              </div>
              <button onClick={() => setNewUserModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Full Name *</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Jordan Lee"
                  value={newUserData.name}
                  onChange={(e) => setNewUserData({ ...newUserData, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 outline-none focus:border-emerald-600 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Email Address *</label>
                <input
                  required
                  type="email"
                  placeholder="e.g. jordan@Share The Bite.org"
                  value={newUserData.email}
                  onChange={(e) => setNewUserData({ ...newUserData, email: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 outline-none focus:border-emerald-600 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Role *</label>
                  <select
                    value={newUserData.role}
                    onChange={(e) => setNewUserData({ ...newUserData, role: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 outline-none focus:border-emerald-600 font-medium bg-white"
                  >
                    <option value="donor">Food Donor</option>
                    <option value="receiver">NGO Shelter Receiver</option>
                    <option value="volunteer">Volunteer Driver</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Access Key / Password *</label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. pass123"
                    value={newUserData.key}
                    onChange={(e) => setNewUserData({ ...newUserData, key: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 outline-none focus:border-emerald-600 font-medium font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Organization</label>
                  <input
                    type="text"
                    placeholder="e.g. City Relief Kitchen"
                    value={newUserData.organization}
                    onChange={(e) => setNewUserData({ ...newUserData, organization: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 outline-none focus:border-emerald-600 font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Phone Number</label>
                  <input
                    type="text"
                    placeholder="e.g. +1 (555) 345-6789"
                    value={newUserData.phone}
                    onChange={(e) => setNewUserData({ ...newUserData, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 outline-none focus:border-emerald-600 font-medium"
                  />
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-[11px] text-emerald-950 leading-relaxed">
                This account will be committed immediately to the <strong>IndexedDB users store</strong> and mirrored to LocalStorage.
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setNewUserModalOpen(false)}
                  className="flex-1 py-2.5 border border-slate-300 text-slate-700 font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-800 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs"
                >
                  Save to IndexedDB
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
