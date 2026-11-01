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
  Phone
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
  switchTestAccount
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
  const [adminTab, setAdminTab] = useState('overview'); // 'overview' | 'listings' | 'database' | 'audit' | 'users'
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Storage diagnostics
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

  // Modals
  const [confirmClearOpen, setConfirmClearOpen] = useState(false);
  const [confirmResetOpen, setConfirmResetOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [newItemModalOpen, setNewItemModalOpen] = useState(false);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [importJsonText, setImportJsonText] = useState('');

  // New item form state
  const [newDonationData, setNewDonationData] = useState({
    item: '',
    category: 'Cooked Meals',
    quantity: '20 servings',
    servings: 20,
    donor: 'Admin Staff / Partner',
    donorPhone: '+1 (555) 100-2000',
    donorEmail: 'admin@foodshare.org',
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
      showToast({
        type: 'error',
        title: 'Registration Failed',
        message: err.message
      });
    }
  };

  // Status counters
  const total = donations.length;
  const available = donations.filter(d => d.status === 'Available').length;
  const pending = donations.filter(d => d.status === 'Pending Pickup').length;
  const inTransit = donations.filter(d => d.status === 'Picked Up').length;
  const delivered = donations.filter(d => d.status === 'Delivered').length;
  const totalServings = donations.reduce((sum, d) => sum + (Number(d.servings) || 10), 0);

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

  // Action: Clear All Data
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
      showToast({
        type: 'error',
        title: 'Clear Failed',
        message: err.message
      });
    }
  };

  // Action: Reset to Mock Data
  const handleResetMock = async () => {
    try {
      await resetToMockData();
      await onRefreshData();
      await refreshStorageAndLogs();
      setConfirmResetOpen(false);
      showToast({
        type: 'success',
        title: 'Seed Data Restored',
        message: 'Reset database to 6 default SDG 2 Zero Hunger mock listings in IndexedDB & LocalStorage.'
      });
    } catch (err) {
      showToast({
        type: 'error',
        title: 'Reset Failed',
        message: err.message
      });
    }
  };

  // Action: Export JSON
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
      showToast({
        type: 'error',
        title: 'Export Failed',
        message: err.message
      });
    }
  };

  // Action: Import JSON
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
      showToast({
        type: 'error',
        title: 'Import Failed',
        message: err.message
      });
    }
  };

  // Action: File upload for import
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setImportJsonText(event.target.result);
    };
    reader.readAsText(file);
  };

  // Action: Delete Single Item
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
      showToast({
        type: 'error',
        title: 'Delete Error',
        message: err.message
      });
    }
  };

  // Action: Update Status Directly
  const handleInlineStatusChange = async (id, newStatus) => {
    try {
      await updateDonation(id, { status: newStatus });
      await onRefreshData();
      await refreshStorageAndLogs();
      showToast({
        type: 'success',
        title: 'Status Updated',
        message: `Listing #${id} status set to "${newStatus}".`
      });
    } catch (err) {
      showToast({
        type: 'error',
        title: 'Update Error',
        message: err.message
      });
    }
  };

  // Action: Save Edited Item
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
      showToast({
        type: 'error',
        title: 'Save Error',
        message: err.message
      });
    }
  };

  // Action: Create Item from Admin
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
        message: `Added new donation listing from Admin Panel.`
      });
    } catch (err) {
      showToast({
        type: 'error',
        title: 'Creation Failed',
        message: err.message
      });
    }
  };

  // Action: Clear Audit Logs
  const handleClearLogs = async () => {
    await clearAuditLogs();
    await refreshStorageAndLogs();
    showToast({
      type: 'info',
      title: 'Logs Cleared',
      message: 'Audit activity trail has been cleared.'
    });
  };

  // Security Gate: Non-admin protection with 1-click bypass for evaluation/testing
  if (currentUser && currentUser.role !== 'admin') {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 animate-in fade-in duration-300">
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-xl space-y-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto shadow-inner">
            <ShieldCheck size={32} />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 bg-amber-100/80 border border-amber-300/60 px-3 py-1 rounded-full">
              Access Restricted
            </span>
            <h2 className="text-2xl font-bold text-slate-900 mt-3 tracking-tight">Administrator Credentials Required</h2>
            <p className="text-sm text-slate-600 mt-2 max-w-md mx-auto leading-relaxed">
              You are currently authenticated as <strong>{currentUser.name}</strong> with the <strong>{currentUser.role}</strong> persona. 
              The Admin Control Center manages core storage operations, mock database resetting, and audit logs.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs text-left space-y-2">
            <div className="font-bold text-slate-800 flex items-center gap-1.5">
              <Key size={14} className="text-emerald-700" />
              <span>Available Test Administrator Account (Saved in IndexedDB):</span>
            </div>
            <div className="grid sm:grid-cols-2 gap-2 pt-1 font-mono text-[11px] text-slate-700">
              <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                <span className="text-slate-400 block text-[10px]">Email ID:</span>
                <strong>admin@foodshare.org</strong>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                <span className="text-slate-400 block text-[10px]">Access Key:</span>
                <strong>admin123</strong>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => onSwitchUser && onSwitchUser('admin')}
              className="w-full sm:w-auto bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs px-6 py-3 rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
            >
              <ShieldCheck size={16} />
              <span>1-Click Switch to Administrator</span>
            </button>
            <button
              onClick={onOpenLogin}
              className="w-full sm:w-auto bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs px-6 py-3 rounded-xl transition-all flex items-center justify-center gap-2 border border-slate-300"
            >
              <Key size={16} />
              <span>Manage Authentication Keys</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-gray-900 to-emerald-900 text-white p-6 sm:p-8 rounded-3xl border border-emerald-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
            <ShieldCheck size={16} /> Central Administrative Control Center
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            FoodShare System Administration
          </h1>
          <p className="text-gray-300 text-sm mt-1 max-w-xl">
            Manage food listings, configure storage engines (IndexedDB & LocalStorage), wipe or reset mock data, export backups, and audit user activity.
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
      <div className="flex items-center gap-2 bg-white p-2 rounded-2xl border border-emerald-100 shadow-sm overflow-x-auto text-xs font-bold">
        <button
          onClick={() => setAdminTab('overview')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all whitespace-nowrap ${adminTab === 'overview' ? 'bg-emerald-800 text-white shadow-xs' : 'text-gray-600 hover:bg-gray-100'
            }`}
        >
          <Layers size={15} />
          <span>System Overview</span>
        </button>

        <button
          onClick={() => setAdminTab('listings')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all whitespace-nowrap ${adminTab === 'listings' ? 'bg-emerald-800 text-white shadow-xs' : 'text-gray-600 hover:bg-gray-100'
            }`}
        >
          <List size={15} />
          <span>Manage Listings ({donations.length})</span>
        </button>

        <button
          onClick={() => setAdminTab('users')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all whitespace-nowrap ${adminTab === 'users' ? 'bg-emerald-800 text-white shadow-xs' : 'text-gray-600 hover:bg-gray-100'
            }`}
        >
          <Users size={15} />
          <span>IndexedDB Users & Keys ({usersList.length})</span>
        </button>

        <button
          onClick={() => setAdminTab('database')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all whitespace-nowrap ${adminTab === 'database' ? 'bg-emerald-800 text-white shadow-xs' : 'text-gray-600 hover:bg-gray-100'
            }`}
        >
          <Database size={15} />
          <span>Database & Storage Hub</span>
        </button>

        <button
          onClick={() => setAdminTab('audit')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all whitespace-nowrap ${adminTab === 'audit' ? 'bg-emerald-800 text-white shadow-xs' : 'text-gray-600 hover:bg-gray-100'
            }`}
        >
          <Activity size={15} />
          <span>Audit Logs ({auditLogs.length})</span>
        </button>
      </div>

      {/* TAB 1: SYSTEM OVERVIEW */}
      {adminTab === 'overview' && (
        <div className="space-y-6">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-sm">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Total Food Records</span>
              <div className="text-3xl font-extrabold text-gray-900">{total}</div>
              <div className="text-xs text-emerald-600 font-semibold mt-1">In IndexedDB Object Store</div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-blue-100 shadow-sm">
              <span className="text-xs font-bold text-blue-700 uppercase tracking-wider block mb-1">Available Food</span>
              <div className="text-3xl font-extrabold text-blue-600">{available}</div>
              <div className="text-xs text-gray-400 mt-1">Ready for pickup</div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-amber-100 shadow-sm">
              <span className="text-xs font-bold text-amber-700 uppercase tracking-wider block mb-1">Claimed / In-Transit</span>
              <div className="text-3xl font-extrabold text-amber-600">{pending + inTransit}</div>
              <div className="text-xs text-gray-400 mt-1">Awaiting completion</div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-sm">
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block mb-1">Total Rescued Servings</span>
              <div className="text-3xl font-extrabold text-emerald-600">{totalServings}</div>
              <div className="text-xs text-emerald-600 font-semibold mt-1">Beneficiaries fed</div>
            </div>
          </div>

          {/* Database & Storage Health Card */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-emerald-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <Database size={20} />
                </div>
                <div>
                  <h3 className="font-extrabold text-gray-900 text-base">Storage Engine Diagnostics</h3>
                  <p className="text-xs text-gray-500">Dual-engine synchronization status</p>
                </div>
              </div>
              <button
                onClick={refreshStorageAndLogs}
                className="p-2 hover:bg-gray-100 text-gray-600 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <RefreshCw size={14} /> Refresh
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <div className="bg-gray-50 p-4 rounded-2xl">
                <span className="font-bold text-gray-500 block mb-1">Active Storage Mode</span>
                <span className="font-extrabold text-emerald-800 text-sm">{storageInfo?.engine || 'IndexedDB + LocalStorage'}</span>
              </div>

              <div className="bg-gray-50 p-4 rounded-2xl">
                <span className="font-bold text-gray-500 block mb-1">IndexedDB Status</span>
                <span className="font-extrabold text-emerald-700 text-sm flex items-center gap-1">
                  <CheckCircle2 size={16} /> Connected (`{storageInfo?.databaseName || 'FoodShareAppDB'}`)
                </span>
              </div>

              <div className="bg-gray-50 p-4 rounded-2xl">
                <span className="font-bold text-gray-500 block mb-1">LocalStorage Backup</span>
                <span className="font-extrabold text-emerald-700 text-sm flex items-center gap-1">
                  <CheckCircle2 size={16} /> Real-time Synchronized
                </span>
              </div>

              <div className="bg-gray-50 p-4 rounded-2xl">
                <span className="font-bold text-gray-500 block mb-1">Database Size Estimate</span>
                <span className="font-extrabold text-gray-800 text-sm">{storageInfo?.approximateSizeFormatted || '12.4 KB'}</span>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={handleExportJSON}
                className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-sm flex items-center gap-1.5"
              >
                <Download size={14} /> Export Backup (.JSON)
              </button>
              <button
                onClick={() => setImportModalOpen(true)}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5"
              >
                <Upload size={14} /> Import Backup (.JSON)
              </button>
              <button
                onClick={() => setConfirmResetOpen(true)}
                className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5"
              >
                <RotateCcw size={14} /> Restore Default Seed Data
              </button>
              <button
                onClick={() => setConfirmClearOpen(true)}
                className="bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 ml-auto"
              >
                <Trash2 size={14} /> Clear All Records
              </button>
            </div>
          </div>

          {/* Recent Audit Stream Preview */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-emerald-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                  <Activity size={20} />
                </div>
                <div>
                  <h3 className="font-extrabold text-gray-900 text-base">Recent System Activity</h3>
                  <p className="text-xs text-gray-500">Live transaction audit log</p>
                </div>
              </div>
              <button
                onClick={() => setAdminTab('audit')}
                className="text-emerald-700 hover:underline text-xs font-bold flex items-center gap-1"
              >
                <span>View Full Audit Log ({auditLogs.length})</span>
                <ArrowRight size={14} />
              </button>
            </div>

            <div className="divide-y divide-gray-100">
              {auditLogs.slice(0, 5).map((log) => (
                <div key={log.id} className="py-3 flex items-start justify-between gap-4 text-xs">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-800 bg-gray-100 px-2 py-0.5 rounded text-[10px]">
                        {log.action}
                      </span>
                      <span className="text-gray-500 font-medium">by {log.actor}</span>
                    </div>
                    <p className="text-gray-700">{log.details}</p>
                  </div>
                  <span className="text-[10px] text-gray-400 whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
              {auditLogs.length === 0 && (
                <div className="py-6 text-center text-xs text-gray-400">No activity recorded yet.</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MANAGE FOOD LISTINGS */}
      {adminTab === 'listings' && (
        <div className="bg-white rounded-3xl border border-emerald-100 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
            <div>
              <h2 className="text-xl font-extrabold text-gray-900">All Database Food Listings</h2>
              <p className="text-xs text-gray-500 mt-0.5">Modify, reassign status, or remove any donation in the system</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setNewItemModalOpen(true)}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-sm flex items-center gap-1.5"
              >
                <Plus size={15} />
                <span>Add Food Listing</span>
              </button>
            </div>
          </div>

          {/* Search & Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3.5 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search food, donor, receiver, location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 text-xs font-medium focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-gray-200 text-xs font-medium bg-white focus:border-emerald-500 outline-none"
            >
              <option value="All">All Statuses</option>
              <option value="Available">Available</option>
              <option value="Pending Pickup">Pending Pickup</option>
              <option value="Picked Up">Picked Up</option>
              <option value="Delivered">Delivered</option>
            </select>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-gray-50 text-gray-500 uppercase tracking-wider text-[10px] font-bold border-y border-gray-100">
                  <th className="py-3 px-4">Item & Donor</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Quantity</th>
                  <th className="py-3 px-4">Status Selector</th>
                  <th className="py-3 px-4">Claimed By</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium">
                {filteredDonations.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-8 text-center text-gray-400">
                      No listings match your search or the database is currently empty.
                    </td>
                  </tr>
                ) : (
                  filteredDonations.map((d) => (
                    <tr key={d.id} className="hover:bg-gray-50/70 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-md bg-slate-100 border border-slate-200 flex items-center justify-center flex-shrink-0">
                            {getCategoryIcon(d.category, 14)}
                          </div>
                          <div>
                            <div className="font-extrabold text-gray-900">{d.item}</div>
                            <div className="text-[11px] text-gray-500 font-normal">
                              #{d.id} • {d.donor}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-gray-600">
                        <span className="bg-gray-100 px-2 py-0.5 rounded text-[11px]">
                          {d.category}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-gray-700">
                        {d.quantity} ({d.servings || 10} portions)
                      </td>

                      {/* Direct Inline Status Changer */}
                      <td className="py-3.5 px-4">
                        <select
                          value={d.status}
                          onChange={(e) => handleInlineStatusChange(d.id, e.target.value)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold border outline-none ${d.status === 'Available'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : d.status === 'Pending Pickup'
                              ? 'bg-amber-50 text-amber-800 border-amber-300'
                              : d.status === 'Picked Up'
                                ? 'bg-blue-50 text-blue-800 border-blue-300'
                                : 'bg-emerald-100 text-emerald-900 border-emerald-400'
                            }`}
                        >
                          <option value="Available">Available</option>
                          <option value="Pending Pickup">Pending Pickup</option>
                          <option value="Picked Up">Picked Up</option>
                          <option value="Delivered">Delivered</option>
                        </select>
                      </td>

                      <td className="py-3.5 px-4 text-gray-600 text-[11px]">
                        {d.receiver ? (
                          <span className="font-bold text-gray-800">{d.receiver}</span>
                        ) : (
                          <span className="text-gray-400 italic">Unclaimed</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setEditingItem({ ...d })}
                            className="p-1.5 text-gray-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
                            title="Edit Listing"
                          >
                            <Edit3 size={15} />
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(d.id)}
                            className="p-1.5 text-gray-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
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

      {/* TAB 3: DATABASE & STORAGE HUB */}
      {adminTab === 'database' && (
        <div className="space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-emerald-100 shadow-sm space-y-6">
            <div>
              <h2 className="text-xl font-extrabold text-gray-900">IndexedDB & LocalStorage Engine Center</h2>
              <p className="text-xs text-gray-500 mt-0.5">
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
                  Permanently deletes all food donation entries from the IndexedDB `donations` store and LocalStorage backup cache. Useful for clearing test transactions or resetting the state.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => setConfirmClearOpen(true)}
                    className="bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-sm transition-all"
                  >
                    Clear All Donations ({total})
                  </button>
                </div>
              </div>

              {/* Card 2: Restore Default Mock Data */}
              <div className="border border-emerald-200 bg-emerald-50/40 rounded-2xl p-6 space-y-3">
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-base">
                  <RotateCcw size={18} className="text-emerald-600" />
                  Restore Demo Mock Dataset
                </div>
                <p className="text-xs text-emerald-950/80 leading-relaxed">
                  Populates IndexedDB and LocalStorage with the 6 verified SDG 2 Zero Hunger food listings (Banquet buffet, Fresh produce crate, Sandwiches, Artisan bread, Farm milk, Canned goods).
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => setConfirmResetOpen(true)}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-sm transition-all"
                  >
                    Restore 6 Demo Listings
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
                  Creates an export file (`foodshare_backup.json`) containing all donations, activity audit logs, and metrics.
                </p>
                <div className="pt-2">
                  <button
                    onClick={handleExportJSON}
                    className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-sm transition-all flex items-center gap-1.5"
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
                  Restore or merge donations from a previously exported `.json` file or raw JSON payload directly into IndexedDB.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => setImportModalOpen(true)}
                    className="bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-sm transition-all flex items-center gap-1.5"
                  >
                    <Upload size={15} /> Open Import Tool
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* TAB 4: AUDIT ACTIVITY LOGS */}
      {adminTab === 'audit' && (
        <div className="bg-white rounded-3xl border border-emerald-100 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
            <div>
              <h2 className="text-xl font-extrabold text-gray-900">System Activity & Audit Logs</h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Cryptographically tracked history of all creations, claims, deletions, and database resets
              </p>
            </div>

            <button
              onClick={handleClearLogs}
              className="px-4 py-2 border border-gray-200 hover:bg-gray-100 text-gray-600 rounded-xl text-xs font-bold transition-colors self-start"
            >
              Clear Audit Log Trail
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-gray-50 text-gray-500 uppercase tracking-wider text-[10px] font-bold border-y border-gray-100">
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Event Action</th>
                  <th className="py-3 px-4">Actor</th>
                  <th className="py-3 px-4">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {auditLogs.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="py-8 text-center text-gray-400">
                      No logs currently stored.
                    </td>
                  </tr>
                ) : (
                  auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50/70">
                      <td className="py-3 px-4 text-gray-400 text-[11px] whitespace-nowrap">
                        {new Date(log.timestamp).toLocaleString()}
                      </td>
                      <td className="py-3 px-4 font-bold text-gray-800">
                        <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-[10px]">
                          {log.action}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-medium text-emerald-800">
                        {log.actor}
                      </td>
                      <td className="py-3 px-4 text-gray-700">
                        {log.details}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: INDEXEDDB USERS & AUTHENTICATION KEYS */}
      {adminTab === 'users' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Header */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-emerald-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-1">
                <Database size={15} />
                <span>IndexedDB Object Store: users & sessions</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                User Accounts & Test Credentials
              </h2>
              <p className="text-slate-600 text-xs mt-1 max-w-2xl leading-relaxed">
                All accounts and secret access keys below are stored directly inside your browser's IndexedDB database (<code className="bg-slate-100 px-1.5 py-0.5 rounded text-emerald-800 font-mono">FoodShareAppDB</code>). You can copy test keys, switch active sessions in 1-click, or register new credentials.
              </p>
            </div>

            <button
              onClick={() => setNewUserModalOpen(true)}
              className="bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-sm transition-all flex items-center gap-2 self-start sm:self-auto whitespace-nowrap"
            >
              <UserPlus size={15} />
              <span>Register Test User</span>
            </button>
          </div>

          {/* User Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {usersList.map((user) => {
              const isCurrent = currentUser?.email === user.email;
              const isKeyRevealed = revealedKeys[user.id];
              return (
                <div
                  key={user.id}
                  className={`bg-white rounded-2xl border p-5 transition-all shadow-xs space-y-4 ${
                    isCurrent
                      ? 'border-emerald-500 ring-2 ring-emerald-500/20'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {/* Top user row */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-emerald-800 text-white font-black text-sm flex items-center justify-center shadow-xs">
                        {user.avatarInitials || user.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-slate-900 text-sm">{user.name}</h3>
                          {isCurrent && (
                            <span className="flex items-center gap-1 text-[10px] font-extrabold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-300">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                              Active
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500">{user.title} &bull; {user.organization}</p>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] uppercase font-extrabold px-2.5 py-1 rounded-lg border ${
                        user.role === 'admin'
                          ? 'bg-amber-100 text-amber-900 border-amber-300'
                          : user.role === 'donor'
                          ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                          : user.role === 'receiver'
                          ? 'bg-blue-100 text-blue-900 border-blue-300'
                          : 'bg-purple-100 text-purple-900 border-purple-300'
                      }`}
                    >
                      {user.role}
                    </span>
                  </div>

                  {/* ID & Email & Phone metadata */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs bg-slate-50/80 p-3 rounded-xl border border-slate-100 font-mono text-[11px]">
                    <div className="text-slate-600">
                      <span className="text-slate-400 block text-[10px] font-sans font-semibold">User ID:</span>
                      <span className="font-bold text-slate-800">{user.id}</span>
                    </div>
                    <div className="text-slate-600">
                      <span className="text-slate-400 block text-[10px] font-sans font-semibold">Email:</span>
                      <span className="font-bold text-slate-800 truncate block">{user.email}</span>
                    </div>
                    <div className="text-slate-600">
                      <span className="text-slate-400 block text-[10px] font-sans font-semibold">Contact Phone:</span>
                      <span>{user.phone || '+1 (555) 000-0000'}</span>
                    </div>
                    <div className="text-slate-600">
                      <span className="text-slate-400 block text-[10px] font-sans font-semibold">Storage Location:</span>
                      <span className="text-emerald-700 font-semibold font-sans">IndexedDB / users</span>
                    </div>
                  </div>

                  {/* Test Access Key */}
                  <div className="bg-slate-100/80 border border-slate-200/80 p-3 rounded-xl flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-xs min-w-0">
                      <Key size={14} className="text-emerald-700 shrink-0" />
                      <span className="text-slate-500 font-medium text-[11px] shrink-0">Access Key:</span>
                      <span className="font-mono font-bold text-slate-900 tracking-wider">
                        {isKeyRevealed ? user.key : '••••••••'}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => toggleKeyReveal(user.id)}
                        className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-white rounded-lg transition-colors"
                        title={isKeyRevealed ? "Hide Key" : "Reveal Key"}
                      >
                        {isKeyRevealed ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                      <button
                        onClick={() => copyKeyToClipboard(user.key)}
                        className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-white rounded-lg transition-colors"
                        title="Copy Key to Clipboard"
                      >
                        <Copy size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Switch Persona Action */}
                  <div className="pt-1">
                    {isCurrent ? (
                      <div className="text-center py-2 text-xs font-bold text-emerald-800 bg-emerald-50 rounded-xl border border-emerald-200">
                        Currently Signed In
                      </div>
                    ) : (
                      <button
                        onClick={() => onSwitchUser && onSwitchUser(user.role)}
                        className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5"
                      >
                        <UserCheck size={14} />
                        <span>1-Click Switch to {user.name} ({user.role})</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* MODAL: CLEAR ALL CONFIRMATION */}
      {confirmClearOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-rose-100 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle size={24} />
            </div>

            <div className="text-center">
              <h3 className="font-extrabold text-gray-900 text-lg">Clear All Food Donations?</h3>
              <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                This will wipe <strong>all {total} food listings</strong> from both <strong>IndexedDB</strong> and <strong>LocalStorage</strong>. This action cannot be undone unless you have a JSON backup file.
              </p>
            </div>

            <div className="flex gap-3 pt-3">
              <button
                type="button"
                onClick={() => setConfirmClearOpen(false)}
                className="flex-1 py-3 border border-gray-200 font-semibold text-gray-700 rounded-xl text-xs hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleClearAll}
                className="flex-1 py-3 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-xs transition-all shadow-md shadow-rose-600/20"
              >
                Yes, Clear All Data
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: RESET DEMO DATA CONFIRMATION */}
      {confirmResetOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-emerald-100 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
              <RotateCcw size={24} />
            </div>

            <div className="text-center">
              <h3 className="font-extrabold text-gray-900 text-lg">Restore Default Demo Data?</h3>
              <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                This will overwrite current records with the 6 default SDG 2 Zero Hunger mock listings in IndexedDB and LocalStorage.
              </p>
            </div>

            <div className="flex gap-3 pt-3">
              <button
                type="button"
                onClick={() => setConfirmResetOpen(false)}
                className="flex-1 py-3 border border-gray-200 font-semibold text-gray-700 rounded-xl text-xs hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleResetMock}
                className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition-all shadow-md shadow-emerald-600/20"
              >
                Yes, Restore Demo Data
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: DELETE SINGLE ITEM CONFIRMATION */}
      {deleteConfirmId !== null && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-rose-100 space-y-4 text-center">
            <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 size={20} />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-base">Delete Listing #{deleteConfirmId}?</h3>
              <p className="text-xs text-gray-500 mt-1">This item will be removed permanently.</p>
            </div>
            <div className="flex gap-2.5 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-2.5 border border-gray-200 text-gray-700 font-semibold rounded-xl text-xs"
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
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-emerald-100 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="font-extrabold text-gray-900 text-base">Edit Donation Listing #{editingItem.id}</h3>
              <button onClick={() => setEditingItem(null)} className="text-gray-400 hover:text-gray-600 p-1">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">Item Title</label>
                <input
                  required
                  type="text"
                  value={editingItem.item}
                  onChange={(e) => setEditingItem({ ...editingItem, item: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 outline-none focus:border-emerald-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">Category</label>
                  <select
                    value={editingItem.category}
                    onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 outline-none focus:border-emerald-500 font-medium bg-white"
                  >
                    <option value="Cooked Meals">Cooked Meals</option>
                    <option value="Fresh Produce">Fresh Produce</option>
                    <option value="Bakery">Bakery</option>
                    <option value="Dairy">Dairy</option>
                    <option value="Packaged & Canned">Packaged & Canned</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">Status</label>
                  <select
                    value={editingItem.status}
                    onChange={(e) => setEditingItem({ ...editingItem, status: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 outline-none focus:border-emerald-500 font-medium bg-white"
                  >
                    <option value="Available">Available</option>
                    <option value="Pending Pickup">Pending Pickup</option>
                    <option value="Picked Up">Picked Up</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">Quantity</label>
                  <input
                    type="text"
                    value={editingItem.quantity}
                    onChange={(e) => setEditingItem({ ...editingItem, quantity: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 outline-none focus:border-emerald-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">Portions / Servings</label>
                  <input
                    type="number"
                    value={editingItem.servings || 10}
                    onChange={(e) => setEditingItem({ ...editingItem, servings: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 outline-none focus:border-emerald-500 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">Donor Name</label>
                <input
                  type="text"
                  value={editingItem.donor}
                  onChange={(e) => setEditingItem({ ...editingItem, donor: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 outline-none focus:border-emerald-500 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">Pickup Location</label>
                <input
                  type="text"
                  value={editingItem.location}
                  onChange={(e) => setEditingItem({ ...editingItem, location: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 outline-none focus:border-emerald-500 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">Claimed By (Receiver)</label>
                <input
                  type="text"
                  value={editingItem.receiver || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, receiver: e.target.value })}
                  placeholder="e.g. Hope Shelter (leave blank if available)"
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 outline-none focus:border-emerald-500 font-medium"
                />
              </div>

              <div className="pt-3 flex gap-3">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="flex-1 py-2.5 border border-gray-200 text-gray-700 font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-sm"
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
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-emerald-100 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="font-extrabold text-gray-900 text-base">Create Food Listing (Admin)</h3>
              <button onClick={() => setNewItemModalOpen(false)} className="text-gray-400 hover:text-gray-600 p-1">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateNewItem} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">Food Item Name *</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. 40 Trays of Fresh Rice & Vegetables"
                  value={newDonationData.item}
                  onChange={(e) => setNewDonationData({ ...newDonationData, item: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 outline-none focus:border-emerald-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">Category</label>
                  <select
                    value={newDonationData.category}
                    onChange={(e) => setNewDonationData({ ...newDonationData, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 outline-none focus:border-emerald-500 font-medium bg-white"
                  >
                    <option value="Cooked Meals">Cooked Meals</option>
                    <option value="Fresh Produce">Fresh Produce</option>
                    <option value="Bakery">Bakery</option>
                    <option value="Dairy">Dairy</option>
                    <option value="Packaged & Canned">Packaged & Canned</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">Quantity</label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. 40 servings"
                    value={newDonationData.quantity}
                    onChange={(e) => setNewDonationData({ ...newDonationData, quantity: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 outline-none focus:border-emerald-500 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">Donor Name</label>
                <input
                  required
                  type="text"
                  value={newDonationData.donor}
                  onChange={(e) => setNewDonationData({ ...newDonationData, donor: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 outline-none focus:border-emerald-500 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">Location</label>
                <input
                  required
                  type="text"
                  value={newDonationData.location}
                  onChange={(e) => setNewDonationData({ ...newDonationData, location: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 outline-none focus:border-emerald-500 font-medium"
                />
              </div>

              <div className="pt-3 flex gap-3">
                <button
                  type="button"
                  onClick={() => setNewItemModalOpen(false)}
                  className="flex-1 py-2.5 border border-gray-200 text-gray-700 font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-sm"
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
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-purple-100 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="font-extrabold text-gray-900 text-base">Import Database JSON</h3>
              <button onClick={() => setImportModalOpen(false)} className="text-gray-400 hover:text-gray-600 p-1">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleImportJSON} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Select Backup .JSON File
                </label>
                <input
                  type="file"
                  accept=".json,application/json"
                  onChange={handleFileUpload}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Or Paste JSON Text
                </label>
                <textarea
                  rows={6}
                  placeholder='{"donations": [...], "logs": [...]}'
                  value={importJsonText}
                  onChange={(e) => setImportJsonText(e.target.value)}
                  className="w-full p-3 font-mono text-[11px] rounded-xl border border-gray-200 focus:border-purple-500 outline-none"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setImportModalOpen(false)}
                  className="flex-1 py-2.5 border border-gray-200 text-gray-700 font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl shadow-sm"
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
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-emerald-100 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  <UserPlus size={16} />
                </div>
                <h3 className="font-extrabold text-gray-900 text-base">Register User in IndexedDB</h3>
              </div>
              <button onClick={() => setNewUserModalOpen(false)} className="text-gray-400 hover:text-gray-600 p-1">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">Full Name *</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Jordan Lee"
                  value={newUserData.name}
                  onChange={(e) => setNewUserData({ ...newUserData, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 outline-none focus:border-emerald-500 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">Email Address *</label>
                <input
                  required
                  type="email"
                  placeholder="e.g. jordan@foodshare.org"
                  value={newUserData.email}
                  onChange={(e) => setNewUserData({ ...newUserData, email: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 outline-none focus:border-emerald-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">Role *</label>
                  <select
                    value={newUserData.role}
                    onChange={(e) => setNewUserData({ ...newUserData, role: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 outline-none focus:border-emerald-500 font-medium bg-white"
                  >
                    <option value="donor">Food Donor</option>
                    <option value="receiver">NGO Shelter Receiver</option>
                    <option value="volunteer">Volunteer Driver</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">Access Key / Password *</label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. pass123"
                    value={newUserData.key}
                    onChange={(e) => setNewUserData({ ...newUserData, key: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 outline-none focus:border-emerald-500 font-medium font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">Organization</label>
                  <input
                    type="text"
                    placeholder="e.g. City Relief Kitchen"
                    value={newUserData.organization}
                    onChange={(e) => setNewUserData({ ...newUserData, organization: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 outline-none focus:border-emerald-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">Phone Number</label>
                  <input
                    type="text"
                    placeholder="e.g. +1 (555) 345-6789"
                    value={newUserData.phone}
                    onChange={(e) => setNewUserData({ ...newUserData, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 outline-none focus:border-emerald-500 font-medium"
                  />
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 text-[11px] text-emerald-900 leading-relaxed">
                This account will be committed immediately to the <strong>IndexedDB users store</strong> and mirrored to LocalStorage.
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setNewUserModalOpen(false)}
                  className="flex-1 py-2.5 border border-gray-200 text-gray-700 font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white font-bold rounded-xl shadow-sm"
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

