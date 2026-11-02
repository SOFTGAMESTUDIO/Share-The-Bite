import React, { useState } from 'react';
import {
  ShieldCheck,
  Key,
  Mail,
  X,
  ArrowRight,
  AlertCircle,
  Eye,
  EyeOff,
  Lock
} from 'lucide-react';
import { loginUser } from '../db/storage';

export default function AdminLoginModal({ isOpen, onClose, onLoginSuccess }) {
  const [showKey, setShowKey] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');

  if (!isOpen) return null;

  // Manual Credentials Submit via Firebase Authentication
  const handleManualLogin = async (e) => {
    e.preventDefault();
    if (!adminEmail.trim() || !adminPassword.trim()) {
      setErrorMsg('Please enter both your Firebase Auth email and password.');
      return;
    }

    try {
      setLoading(true);
      setErrorMsg('');
      const user = await loginUser(adminEmail, adminPassword);
      onLoginSuccess(user);
      onClose();
    } catch (err) {
      setErrorMsg(err.message || 'Firebase Authentication failed. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden space-y-0 animate-in fade-in zoom-in-95">

        {/* Modal Top Banner */}
        <div className="p-6 bg-emerald-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-400">
              <ShieldCheck size={22} />
            </div>
            <div>
              <h2 className="font-extrabold text-base text-white">Administrator Access Only</h2>
              <p className="text-xs text-emerald-300/80">Share The Bite Central Control Center</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors focus:outline-none"
            aria-label="Close Modal"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 sm:p-8 space-y-5">

          {/* Explanation text */}
          <div className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
            <strong>Firebase Authentication:</strong> Enter the administrator credentials you created in your Firebase Console. Public donors and shelters do not need an account.
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
            <div>
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
                  placeholder="admin@yourdomain.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none text-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Admin Password
              </label>
              <div className="relative">
                <Key size={16} className="absolute left-3.5 top-3 text-slate-400" />
                <input
                  type={showKey ? 'text' : 'password'}
                  required
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="Enter your Firebase password"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none font-mono text-slate-900"
                />
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 p-1"
                >
                  {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-800 hover:bg-emerald-700 active:bg-emerald-900 text-white font-bold text-xs py-3 px-4 rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <span>Verifying with Firebase Auth...</span>
                ) : (
                  <>
                    <Lock size={15} className="text-amber-400" />
                    <span>Authorize with Firebase Auth</span>
                    <ArrowRight size={15} />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Security & Provider Disclosure */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
            <span className="font-semibold text-emerald-700">Firebase Authentication (firebase/auth)</span>
            <span>Project: e-connect-sgs</span>
          </div>

        </div>
      </div>
    </div>
  );
}
