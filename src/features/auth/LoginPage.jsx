import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShieldCheck,
  Key,
  Mail,
  ArrowRight,
  AlertCircle,
  Eye,
  EyeOff,
  Leaf,
  ArrowLeft,
  Lock,
  CheckCircle2
} from 'lucide-react';
import { loginUser } from '../../db/storage';

export default function LoginPage({ onLoginSuccess, showToast, currentUser }) {
  const navigate = useNavigate();
  const [showKey, setShowKey] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');

  const isAdmin = currentUser && currentUser.role === 'admin';

  // Manual Credentials Submit via Firebase Authentication
  const handleFirebaseLogin = async (e) => {
    e.preventDefault();
    if (!adminEmail.trim() || !adminPassword.trim()) {
      setErrorMsg('Please enter both your Firebase Auth email and password.');
      return;
    }

    try {
      setLoading(true);
      setErrorMsg('');
      const user = await loginUser(adminEmail, adminPassword);
      if (onLoginSuccess) onLoginSuccess(user);
      if (showToast) {
        showToast({
          type: 'success',
          title: 'Administrator Authenticated',
          message: `Welcome, ${user.name || user.email}! Signed in with Firebase Auth.`
        });
      }
      navigate('/admin');
    } catch (err) {
      setErrorMsg(err.message || 'Firebase Authentication failed. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex flex-col justify-center items-center py-8 px-4 sm:px-6 lg:px-8">
      {/* Return to Home link */}
      <div className="w-full max-w-md mb-4 flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 hover:text-emerald-950 transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Back to Home</span>
        </Link>

        <span className="text-[11px] font-bold text-slate-500 bg-slate-200/80 px-2.5 py-0.5 rounded-full">
          Firebase Auth Gateway
        </span>
      </div>

      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
        
        {/* Card Header */}
        <div className="bg-emerald-950 text-white p-7 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 translate-x-4 -translate-y-4 w-32 h-32 bg-emerald-600/10 rounded-full blur-2xl pointer-events-none"></div>

          <div className="w-13 h-13 mx-auto mb-3 rounded-2xl bg-emerald-900 border border-emerald-500/40 flex items-center justify-center text-emerald-300 shadow-inner">
            <ShieldCheck size={26} className="text-amber-400" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-900/90 border border-emerald-700/60 text-emerald-300 text-[11px] font-bold mb-2">
            <Leaf size={12} className="text-emerald-400" />
            <span>Share The Bite &bull; Zero Hunger</span>
          </div>

          <h1 className="text-2xl font-black tracking-tight text-white">
            Administrator Login
          </h1>
          <p className="text-xs text-emerald-200/80 mt-1 max-w-xs mx-auto">
            Sign in with the administrator account created in your Firebase Console
          </p>
        </div>

        <div className="p-6 sm:p-8 space-y-5">

          {/* Active Session Notice (if already logged in) */}
          {isAdmin && (
            <div className="bg-emerald-50 border border-emerald-300 p-3.5 rounded-2xl flex items-center justify-between gap-3">
              <div className="text-xs text-emerald-900">
                <span className="font-extrabold block">Active Session:</span>
                <span className="truncate block max-w-[200px]">{currentUser.email}</span>
              </div>
              <button
                onClick={() => navigate('/admin')}
                className="bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded-xl transition-colors shrink-0 flex items-center gap-1"
              >
                <span>Open Admin</span>
                <ArrowRight size={13} />
              </button>
            </div>
          )}

          {/* Public Access Notice */}
          <div className="text-xs text-slate-600 bg-slate-50 border border-slate-200 p-3.5 rounded-2xl leading-relaxed">
            <span className="font-bold text-slate-800 block mb-0.5">Public Access Notice:</span>
            Food donors and relief shelters do not need an account. Anyone can list donations or submit relief requests freely without signing in.
          </div>

          {/* Error Alert */}
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5 animate-in fade-in">
              <AlertCircle size={16} className="text-rose-600 shrink-0 mt-0.5" />
              <span className="font-medium">{errorMsg}</span>
            </div>
          )}

          {/* Real Firebase Auth Login Form */}
          <form onSubmit={handleFirebaseLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Firebase Auth Email
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  placeholder="admin@yourdomain.com"
                  required
                  autoFocus
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-200 outline-none transition-all font-medium text-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Key size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={showKey ? 'text' : 'password'}
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="Enter your Firebase password"
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
              className="w-full bg-emerald-800 hover:bg-emerald-700 active:bg-emerald-900 text-white text-xs font-bold py-3 rounded-xl flex items-center justify-center gap-2 shadow-xs transition-colors disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Verifying with Firebase Auth...</span>
                </>
              ) : (
                <>
                  <Lock size={14} className="text-amber-400" />
                  <span>Sign In with Firebase Auth</span>
                </>
              )}
            </button>
          </form>

          {/* Security & Authentication Info */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span className="flex items-center gap-1 font-semibold text-emerald-800">
              <ShieldCheck size={13} className="text-emerald-600" />
              Firebase Authentication
            </span>
            <span className="text-[10px] text-slate-400">
              Project: e-connect-sgs
            </span>
          </div>

        </div>

      </div>

      {/* Auxiliary links */}
      <div className="mt-6 text-center space-x-4 text-xs text-slate-500">
        <Link to="/products" className="hover:text-emerald-800 font-medium">Browse Food Products</Link>
        <span>&bull;</span>
        <Link to="/donate" className="hover:text-emerald-800 font-medium">Donate Food</Link>
        <span>&bull;</span>
        <Link to="/report" className="hover:text-emerald-800 font-medium">SDG-2 Report</Link>
      </div>

    </div>
  );
}
