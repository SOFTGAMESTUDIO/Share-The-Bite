import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShieldCheck,
  Key,
  Mail,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Sparkles,
  Leaf,
  Database,
  Cloud,
  ArrowLeft,
  Lock
} from 'lucide-react';
import { loginUser, switchTestAccount } from '../../db/storage';

export default function LoginPage({ onLoginSuccess, showToast, currentUser }) {
  const navigate = useNavigate();
  const [showKey, setShowKey] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const [adminEmail, setAdminEmail] = useState('admin@foodshare.org');
  const [adminKey, setAdminKey] = useState('admin123');

  // If already logged in as admin, provide quick jump to admin console
  const isAdmin = currentUser && currentUser.role === 'admin';

  // 1-Click Demo Admin Login
  const handleQuickAdminLogin = async () => {
    try {
      setLoading(true);
      setErrorMsg('');
      const user = await switchTestAccount('admin');
      if (onLoginSuccess) onLoginSuccess(user);
      if (showToast) {
        showToast({
          type: 'success',
          title: 'Administrator Authenticated',
          message: `Welcome back, ${user.name}! Firebase Auth verified.`
        });
      }
      navigate('/admin');
    } catch (err) {
      setErrorMsg(err.message || 'Authentication error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Manual Credentials Submit (Firebase Auth)
  const handleManualLogin = async (e) => {
    e.preventDefault();
    if (!adminEmail.trim() || !adminKey.trim()) return;

    try {
      setLoading(true);
      setErrorMsg('');
      const user = await loginUser(adminEmail, adminKey);
      if (user.role !== 'admin') {
        throw new Error('This account does not have administrator privileges.');
      }
      if (onLoginSuccess) onLoginSuccess(user);
      if (showToast) {
        showToast({
          type: 'success',
          title: 'Administrator Authenticated',
          message: `Welcome, ${user.name}! Central Control Center unlocked.`
        });
      }
      navigate('/admin');
    } catch (err) {
      setErrorMsg(err.message || 'Invalid administrator credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col justify-center items-center py-10 px-4 sm:px-6 lg:px-8">
      {/* Return to Home link */}
      <div className="w-full max-w-md mb-4 flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 hover:text-emerald-950 transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Back to Home</span>
        </Link>

        <span className="text-[11px] font-bold text-slate-500 bg-slate-200/70 px-2.5 py-0.5 rounded-full">
          UN SDG-2 Platform
        </span>
      </div>

      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
        
        {/* Card Header */}
        <div className="bg-emerald-950 text-white p-7 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 translate-x-4 -translate-y-4 w-32 h-32 bg-emerald-600/10 rounded-full blur-2xl pointer-events-none"></div>

          <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-emerald-900 border border-emerald-500/40 flex items-center justify-center text-emerald-300 shadow-inner">
            <ShieldCheck size={28} className="text-amber-400" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-900/90 border border-emerald-700/60 text-emerald-300 text-[11px] font-bold mb-2">
            <Leaf size={12} className="text-emerald-400" />
            <span>Share The Bite &bull; Zero Hunger</span>
          </div>

          <h1 className="text-2xl font-black tracking-tight text-white">
            Administrator Gateway
          </h1>
          <p className="text-xs text-emerald-200/80 mt-1 max-w-xs mx-auto">
            Centralized Logistics, Delivery Telemetry & Database Management
          </p>
        </div>

        <div className="p-6 sm:p-8 space-y-6">

          {/* Already Logged In Banner */}
          {isAdmin && (
            <div className="bg-emerald-50 border border-emerald-300 p-4 rounded-2xl flex items-center justify-between gap-3">
              <div className="text-xs text-emerald-900">
                <span className="font-extrabold block">Active Session Detected:</span>
                <span>{currentUser.name} ({currentUser.email})</span>
              </div>
              <button
                onClick={() => navigate('/admin')}
                className="bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded-xl transition-colors shrink-0 flex items-center gap-1"
              >
                <span>Go to Admin</span>
                <ArrowRight size={13} />
              </button>
            </div>
          )}

          {/* Public Access Notice */}
          <div className="text-xs text-slate-600 bg-slate-50 border border-slate-200 p-3.5 rounded-2xl leading-relaxed">
            <span className="font-bold text-slate-800 block mb-0.5">Public Access Policy:</span>
            Food donors can list surplus without an account, and relief shelters can submit distribution requests freely. Only platform administrators log in here.
          </div>

          {/* 1-Click Fast Administrator Login (For Testing / Evaluation) */}
          <div className="p-4 bg-emerald-50/80 rounded-2xl border border-emerald-200/80 space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-emerald-900 flex items-center gap-1.5">
                <Sparkles size={14} className="text-amber-500" />
                1-Click Administrator Testing:
              </span>
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full uppercase">
                Demo Ready
              </span>
            </div>

            <button
              type="button"
              onClick={handleQuickAdminLogin}
              disabled={loading}
              className="w-full bg-emerald-800 hover:bg-emerald-700 active:bg-emerald-900 text-white text-xs font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-xs transition-colors disabled:opacity-50"
            >
              <ShieldCheck size={16} className="text-amber-400" />
              <span>Sign In as Sarah Jenkins (Admin)</span>
              <ArrowRight size={14} />
            </button>
            <p className="text-[11px] text-emerald-700/80 text-center font-medium">
              Auto-fills admin@foodshare.org with full operational privileges
            </p>
          </div>

          {/* Separator */}
          <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-200 w-full"></div>
            <span className="bg-white px-3 text-[11px] text-slate-400 uppercase font-bold tracking-wider relative">
              Or Manual Sign In
            </span>
          </div>

          {/* Error Alert */}
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5 animate-in fade-in">
              <AlertCircle size={16} className="text-rose-600 shrink-0 mt-0.5" />
              <span className="font-medium">{errorMsg}</span>
            </div>
          )}

          {/* Manual Login Form */}
          <form onSubmit={handleManualLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Administrator Email Address
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  placeholder="admin@foodshare.org"
                  required
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-200 outline-none transition-all font-medium text-slate-900"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Password / Access Key
                </label>
                <span className="text-[11px] text-slate-400">Default: admin123</span>
              </div>
              <div className="relative">
                <Key size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={showKey ? 'text' : 'password'}
                  value={adminKey}
                  onChange={(e) => setAdminKey(e.target.value)}
                  placeholder="admin123"
                  required
                  className="w-full pl-10 pr-10 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-200 outline-none transition-all font-medium text-slate-900"
                />
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 rounded-md"
                  aria-label="Toggle password visibility"
                >
                  {showKey ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white text-xs font-bold py-3 rounded-xl flex items-center justify-center gap-2 shadow-xs transition-colors disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Authenticating with Firebase...</span>
                </>
              ) : (
                <>
                  <Lock size={14} className="text-amber-400" />
                  <span>Sign In with Firebase Auth</span>
                </>
              )}
            </button>
          </form>

          {/* Engine & Security Badges Footer */}
          <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500">
            <div className="flex items-center gap-1.5">
              <Cloud size={13} className="text-emerald-600" />
              <span>Firebase Cloud Auth</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Database size={13} className="text-emerald-600" />
              <span>Triple-Engine Storage</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-emerald-700 font-semibold">Online & Synced</span>
            </div>
          </div>

        </div>

      </div>

      {/* Auxiliary links */}
      <div className="mt-6 text-center space-x-4 text-xs text-slate-500">
        <Link to="/products" className="hover:text-emerald-800 font-medium">Browse Products</Link>
        <span>&bull;</span>
        <Link to="/donate" className="hover:text-emerald-800 font-medium">Donate Surplus Food</Link>
        <span>&bull;</span>
        <Link to="/report" className="hover:text-emerald-800 font-medium">SDG-2 Report</Link>
      </div>

    </div>
  );
}
