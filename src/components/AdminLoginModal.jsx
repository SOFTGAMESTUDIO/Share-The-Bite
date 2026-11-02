import React, { useState } from 'react';
import {
  ShieldCheck,
  Key,
  Mail,
  X,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Sparkles
} from 'lucide-react';
import { loginUser, switchTestAccount } from '../db/storage';

export default function AdminLoginModal({ isOpen, onClose, onLoginSuccess }) {
  const [showKey, setShowKey] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const [adminEmail, setAdminEmail] = useState('admin@foodshare.org');
  const [adminKey, setAdminKey] = useState('admin123');

  if (!isOpen) return null;

  // 1-Click Demo Admin Login
  const handleQuickAdminLogin = async () => {
    try {
      setLoading(true);
      setErrorMsg('');
      const user = await switchTestAccount('admin');
      onLoginSuccess(user);
      onClose();
    } catch (err) {
      setErrorMsg(err.message || 'Authentication error');
    } finally {
      setLoading(false);
    }
  };

  // Manual Credentials Submit
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
      onLoginSuccess(user);
      onClose();
    } catch (err) {
      setErrorMsg(err.message || 'Invalid administrator credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden space-y-0 animate-in fade-in zoom-in-95">

        {/* Modal Top Banner */}
        <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-400">
              <ShieldCheck size={22} />
            </div>
            <div>
              <h2 className="font-extrabold text-base text-white">Administrator Access Only</h2>
              <p className="text-xs text-slate-400">Share The Bite Central Control Center</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors focus:outline-none"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 sm:p-8 space-y-6">

          {/* Explanation text */}
          <div className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
            <strong>Public Access Notice:</strong> Donors and shelters do not need an account to donate food or submit relief requests. Only authorized administrators sign in here to manage the logistics dispatch and database.
          </div>

          {/* 1-Click Fast Login Pill for Testing / Review */}
          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-emerald-900 flex items-center gap-1.5">
                <Sparkles size={14} className="text-amber-500" />
                Evaluation & Testing Shortcut:
              </span>
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full uppercase">
                Instant Access
              </span>
            </div>

            <button
              type="button"
              onClick={handleQuickAdminLogin}
              disabled={loading}
              className="w-full bg-emerald-800 hover:bg-emerald-700 active:bg-emerald-900 text-white font-bold text-xs py-3 px-4 rounded-xl transition-all shadow-xs flex items-center justify-center gap-2"
            >
              <ShieldCheck size={16} />
              <span>1-Click Demo Admin Sign In</span>
            </button>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-start gap-2">
              <AlertCircle size={15} className="shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleManualLogin} className="space-y-4">
            <div className="relative">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Admin Email ID
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-3 text-slate-400" />
                <input
                  type="email"
                  required
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  placeholder="admin@foodshare.org"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Admin Access Key
              </label>
              <div className="relative">
                <Key size={16} className="absolute left-3.5 top-3 text-slate-400" />
                <input
                  type={showKey ? 'text' : 'password'}
                  required
                  value={adminKey}
                  onChange={(e) => setAdminKey(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                >
                  {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-3 px-4 rounded-xl transition-all shadow-xs flex items-center justify-center gap-2"
              >
                <span>Authorize with Firebase Auth</span>
                <ArrowRight size={15} />
              </button>
            </div>
          </form>

          {/* Security & Provider Disclosure */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
            <span className="font-semibold text-emerald-700">Firebase Authentication (firebase/auth)</span>
            <span>Cloud Auth Active</span>
          </div>

        </div>
      </div>
    </div>
  );
}

