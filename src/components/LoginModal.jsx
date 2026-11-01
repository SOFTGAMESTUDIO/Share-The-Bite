import React, { useState } from 'react';
import { 
  ShieldCheck, 
  UserCheck, 
  Key, 
  Mail, 
  Building2, 
  Phone, 
  X, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle,
  Sparkles,
  Users,
  Eye,
  EyeOff
} from 'lucide-react';
import { initialTestUsers, loginUser, registerUser, switchTestAccount } from '../db/storage';

export default function LoginModal({ isOpen, onClose, onLoginSuccess, currentUser }) {
  const [activeTab, setActiveTab] = useState('test_accounts'); // 'test_accounts' | 'sign_in' | 'register'
  const [showKey, setShowKey] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Sign In state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginKey, setLoginKey] = useState('');

  // Register state
  const [regData, setRegData] = useState({
    name: '',
    email: '',
    key: '',
    role: 'donor',
    organization: '',
    phone: '',
    title: ''
  });

  if (!isOpen) return null;

  const handleTestLogin = async (role) => {
    try {
      setLoading(true);
      setErrorMsg('');
      const user = await switchTestAccount(role);
      onLoginSuccess(user);
      onClose();
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleManualLogin = async (e) => {
    e.preventDefault();
    if (!loginEmail.trim() || !loginKey.trim()) return;
    try {
      setLoading(true);
      setErrorMsg('');
      const user = await loginUser(loginEmail, loginKey);
      onLoginSuccess(user);
      onClose();
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!regData.name.trim() || !regData.email.trim() || !regData.key.trim()) return;
    try {
      setLoading(true);
      setErrorMsg('');
      const user = await registerUser(regData);
      onLoginSuccess(user);
      onClose();
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden space-y-0">
        
        {/* Modal Header */}
        <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600/30 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Key size={18} />
            </div>
            <div>
              <h2 className="font-bold text-base text-white">FoodShare Authentication</h2>
              <p className="text-xs text-slate-300">IndexedDB Identity and Test Base Engine</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:outline-none"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 text-xs font-semibold">
          <button
            type="button"
            onClick={() => { setActiveTab('test_accounts'); setErrorMsg(''); }}
            className={`flex-1 py-3 text-center border-b-2 transition-colors ${
              activeTab === 'test_accounts' 
                ? 'border-emerald-700 text-emerald-800 bg-white font-bold' 
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            1-Click Test Accounts
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('sign_in'); setErrorMsg(''); }}
            className={`flex-1 py-3 text-center border-b-2 transition-colors ${
              activeTab === 'sign_in' 
                ? 'border-emerald-700 text-emerald-800 bg-white font-bold' 
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Direct Sign In
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('register'); setErrorMsg(''); }}
            className={`flex-1 py-3 text-center border-b-2 transition-colors ${
              activeTab === 'register' 
                ? 'border-emerald-700 text-emerald-800 bg-white font-bold' 
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Register Account
          </button>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="mx-6 mt-4 p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg text-xs flex items-center gap-2">
            <AlertCircle size={15} className="flex-shrink-0 text-rose-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        <div className="p-6">
          
          {/* TAB 1: 1-CLICK PRE-CONFIGURED TEST ACCOUNTS */}
          {activeTab === 'test_accounts' && (
            <div className="space-y-4">
              <div className="text-xs text-slate-500">
                IndexedDB comes pre-seeded with 4 verified role accounts for comprehensive test execution. Click any persona to authenticate immediately:
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {initialTestUsers.map((testAcc) => {
                  const isCurrent = currentUser?.email === testAcc.email;
                  return (
                    <div 
                      key={testAcc.id}
                      className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between space-y-2.5 ${
                        isCurrent 
                          ? 'border-emerald-500 bg-emerald-50/50 shadow-2xs' 
                          : 'border-slate-200 bg-slate-50/60 hover:bg-slate-100/80 hover:border-slate-300'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                            testAcc.role === 'admin' 
                              ? 'bg-amber-100 text-amber-900 border-amber-200'
                              : testAcc.role === 'donor'
                              ? 'bg-emerald-100 text-emerald-900 border-emerald-200'
                              : testAcc.role === 'receiver'
                              ? 'bg-blue-100 text-blue-900 border-blue-200'
                              : 'bg-indigo-100 text-indigo-900 border-indigo-200'
                          }`}>
                            {testAcc.badge}
                          </span>
                          {isCurrent && (
                            <span className="text-[10px] font-bold text-emerald-700 flex items-center gap-1">
                              <CheckCircle2 size={12} /> Active
                            </span>
                          )}
                        </div>

                        <div className="font-bold text-slate-900 text-xs mt-2">{testAcc.name}</div>
                        <div className="text-[11px] text-slate-500">{testAcc.organization}</div>

                        <div className="mt-2 text-[10px] font-mono text-slate-600 bg-white p-1.5 rounded border border-slate-200 space-y-0.5">
                          <div><strong>Email:</strong> {testAcc.email}</div>
                          <div><strong>Key:</strong> {testAcc.key}</div>
                        </div>
                      </div>

                      <button
                        type="button"
                        disabled={loading}
                        onClick={() => handleTestLogin(testAcc.role)}
                        className={`w-full py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 ${
                          isCurrent 
                            ? 'bg-emerald-700 text-white cursor-default' 
                            : 'bg-slate-900 hover:bg-slate-800 text-white'
                        }`}
                      >
                        <span>{isCurrent ? 'Current Session' : `Login as ${testAcc.role}`}</span>
                        <ArrowRight size={13} />
                      </button>
                    </div>
                  );
                })}
              </div>

              <div className="pt-2 text-[11px] text-slate-400 text-center border-t border-slate-100">
                Credentials saved in IndexedDB <code>users</code> store with LocalStorage session synchronization.
              </div>
            </div>
          )}

          {/* TAB 2: MANUAL EMAIL & ACCESS KEY SIGN IN */}
          {activeTab === 'sign_in' && (
            <form onSubmit={handleManualLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3.5 top-3 text-slate-400" />
                  <input
                    required
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="e.g. admin@foodshare.org or donor@fresheats.org"
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 text-xs outline-none"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Access Key / Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowKey(!showKey)}
                    className="text-[11px] text-emerald-800 hover:underline flex items-center gap-1"
                  >
                    {showKey ? <EyeOff size={12} /> : <Eye size={12} />}
                    <span>{showKey ? 'Hide' : 'Show'}</span>
                  </button>
                </div>
                <div className="relative">
                  <Key size={15} className="absolute left-3.5 top-3 text-slate-400" />
                  <input
                    required
                    type={showKey ? 'text' : 'password'}
                    value={loginKey}
                    onChange={(e) => setLoginKey(e.target.value)}
                    placeholder="Enter access key (e.g. admin123 or donor123)"
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 text-xs outline-none"
                  />
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2.5 border border-slate-300 font-semibold text-slate-700 rounded-lg text-xs hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white font-semibold rounded-lg text-xs transition-colors shadow-xs flex items-center justify-center gap-1.5"
                >
                  <span>Authenticate</span>
                  <ArrowRight size={15} />
                </button>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-[11px] text-slate-600">
                <strong>Demo Hint:</strong> Use <code>admin@foodshare.org</code> with key <code>admin123</code> for full administrative access.
              </div>
            </form>
          )}

          {/* TAB 3: REGISTER NEW TEST ACCOUNT */}
          {activeTab === 'register' && (
            <form onSubmit={handleRegister} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Full Name *
                </label>
                <input
                  required
                  type="text"
                  value={regData.name}
                  onChange={(e) => setRegData({ ...regData, name: e.target.value })}
                  placeholder="e.g. Robert Smith"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-emerald-600 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Email Address *
                  </label>
                  <input
                    required
                    type="email"
                    value={regData.email}
                    onChange={(e) => setRegData({ ...regData, email: e.target.value })}
                    placeholder="robert@example.org"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-emerald-600 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Access Key (Password) *
                  </label>
                  <input
                    required
                    type="password"
                    value={regData.key}
                    onChange={(e) => setRegData({ ...regData, key: e.target.value })}
                    placeholder="Create access key"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-emerald-600 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Account Role *
                  </label>
                  <select
                    value={regData.role}
                    onChange={(e) => setRegData({ ...regData, role: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-emerald-600 outline-none bg-white font-medium"
                  >
                    <option value="donor">Food Donor</option>
                    <option value="receiver">NGO Shelter</option>
                    <option value="volunteer">Volunteer Driver</option>
                    <option value="admin">Platform Admin</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Job Title / Position
                  </label>
                  <input
                    type="text"
                    value={regData.title}
                    onChange={(e) => setRegData({ ...regData, title: e.target.value })}
                    placeholder="e.g. Kitchen Director"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-emerald-600 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Organization / Company Name
                </label>
                <input
                  type="text"
                  value={regData.organization}
                  onChange={(e) => setRegData({ ...regData, organization: e.target.value })}
                  placeholder="e.g. City Central Shelter"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-emerald-600 outline-none"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2.5 border border-slate-300 font-semibold text-slate-700 rounded-lg text-xs hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white font-semibold rounded-lg text-xs transition-colors shadow-xs"
                >
                  Create & Save to IndexedDB
                </button>
              </div>
            </form>
          )}

        </div>

      </div>
    </div>
  );
}

