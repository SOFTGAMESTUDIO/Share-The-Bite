import React, { useState, useRef, useEffect } from 'react';
import {
  Leaf,
  FileText,
  HeartHandshake,
  List,
  LayoutDashboard,
  ShieldCheck,
  CheckCircle,
  Menu,
  X,
  Database,
  UserCheck,
  LogIn,
  LogOut,
  ChevronDown,
  Key,
  Building2,
  Mail,
  UserPlus,
  Sparkles
} from 'lucide-react';
import { initialTestUsers } from '../db/storage';

export default function Navbar({
  activeRoute,
  onNavigate,
  availableCount = 0,
  claimedCount = 0,
  currentUser = null,
  onOpenLogin,
  onLogout,
  onQuickSwitch
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setUserDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems = [
    { id: 'report', label: 'Project Report', icon: FileText, badge: null },
    { id: 'donor', label: 'Donate Food', icon: HeartHandshake, badge: null },
    { id: 'listings', label: 'Food Listings', icon: List, badge: availableCount > 0 ? availableCount : null },
    { id: 'dashboard', label: 'NGO Dashboard', icon: LayoutDashboard, badge: claimedCount > 0 ? claimedCount : null },
    { id: 'admin', label: 'Admin Panel', icon: ShieldCheck, badge: 'PRO', isAdmin: true },
    { id: 'conclusion', label: 'Evaluation', icon: CheckCircle, badge: null },
  ];

  const handleNavClick = (id) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'admin':
        return 'bg-amber-400 text-amber-950 border-amber-300';
      case 'donor':
        return 'bg-emerald-400 text-emerald-950 border-emerald-300';
      case 'receiver':
        return 'bg-blue-400 text-blue-950 border-blue-300';
      case 'volunteer':
        return 'bg-purple-400 text-purple-950 border-purple-300';
      default:
        return 'bg-slate-300 text-slate-800 border-slate-200';
    }
  };

  return (
    <header className="bg-emerald-950 text-white shadow-lg sticky top-0 z-40 border-b border-emerald-800/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo & Brand */}
          <div
            onClick={() => handleNavClick('report')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-800/90 border border-emerald-500/40 flex items-center justify-center text-emerald-300 group-hover:scale-105 transition-transform shadow-inner">
              <Leaf className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight text-white group-hover:text-emerald-200 transition-colors">
                  FoodShare
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-900 border border-emerald-700/60 text-emerald-300 px-2 py-0.5 rounded-full hidden sm:inline-block">
                  SDG 2 Zero Hunger
                </span>
              </div>
              <p className="text-[10px] text-emerald-300/80 tracking-wide font-medium hidden md:block">
                IndexedDB & LocalStorage Enabled
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeRoute === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`relative flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all ${isActive
                    ? item.isAdmin
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-400/40 shadow-sm'
                      : 'bg-emerald-800 text-white border border-emerald-600/40 shadow-inner'
                    : 'text-emerald-100/90 hover:text-white hover:bg-emerald-900/60'
                    }`}
                >
                  <Icon size={16} className={item.isAdmin ? 'text-amber-400' : 'text-emerald-400'} />
                  <span>{item.label}</span>
                  {item.badge !== null && (
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold leading-tight ${item.isAdmin
                      ? 'bg-amber-400 text-amber-950'
                      : 'bg-emerald-500 text-white'
                      }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Section: Storage Engine Indicator & Authenticated User Control */}
          <div className="hidden sm:flex items-center gap-3">
            {/* DB indicator */}
            <div
              title="Primary IndexedDB engine with real-time LocalStorage mirror"
              className="flex items-center gap-1.5 text-[11px] font-medium bg-emerald-900/60 border border-emerald-700/50 px-2.5 py-1.5 rounded-lg text-emerald-300"
            >
              <Database size={13} className="text-emerald-400 animate-pulse" />
              <span className="hidden xl:inline">Dual Engine:</span>
              <span>IDB + LocalStorage</span>
            </div>

            {/* Authenticated User Menu or Sign In */}
            {currentUser ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2.5 bg-emerald-900/90 hover:bg-emerald-850 border border-emerald-700/80 px-2.5 py-1.5 rounded-xl transition-all text-left shadow-sm group focus:outline-none focus:ring-2 focus:ring-emerald-400/40"
                  aria-label="User Account Menu"
                >
                  {/* Avatar circle */}
                  <div className="w-8 h-8 rounded-lg bg-emerald-700 border border-emerald-400/50 text-white font-black text-xs flex items-center justify-center shadow-xs">
                    {currentUser.avatarInitials || currentUser.name.slice(0, 2).toUpperCase()}
                  </div>

                  <div className="hidden md:block text-left leading-tight">
                    <div className="text-xs font-bold text-white max-w-[120px] truncate">
                      {currentUser.name}
                    </div>
                    <div className="text-[10px] text-emerald-300/90 font-medium capitalize">
                      {currentUser.role}
                    </div>
                  </div>

                  <span className={`text-[10px] uppercase font-extrabold px-1.5 py-0.5 rounded-md border ${getRoleBadgeColor(currentUser.role)}`}>
                    {currentUser.role}
                  </span>

                  <ChevronDown size={14} className={`text-emerald-300 transition-transform ${userDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Card */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-slate-200 py-2 text-slate-800 z-50 animate-in fade-in zoom-in-95">
                    
                    {/* User Profile Header */}
                    <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/70">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-800 text-white font-extrabold text-sm flex items-center justify-center shadow-xs">
                          {currentUser.avatarInitials || currentUser.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-bold text-slate-900 text-sm truncate">{currentUser.name}</p>
                          <p className="text-xs text-slate-500 truncate flex items-center gap-1">
                            <Mail size={11} /> {currentUser.email}
                          </p>
                          <p className="text-[11px] text-slate-500 truncate flex items-center gap-1 mt-0.5">
                            <Building2 size={11} /> {currentUser.organization || 'FoodShare Partner'}
                          </p>
                        </div>
                      </div>
                      <div className="mt-2.5 flex items-center justify-between text-[11px]">
                        <span className="text-slate-500">Storage Location:</span>
                        <span className="font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/60">
                          IndexedDB &bull; users store
                        </span>
                      </div>
                    </div>

                    {/* Quick Switch Test Persona */}
                    <div className="px-3 py-2 border-b border-slate-100">
                      <div className="px-1 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                        <span>1-Click Test Accounts (IndexedDB)</span>
                        <Sparkles size={11} className="text-amber-500" />
                      </div>
                      <div className="grid grid-cols-2 gap-1.5 mt-1">
                        {initialTestUsers.map((testUser) => (
                          <button
                            key={testUser.id}
                            onClick={() => {
                              onQuickSwitch(testUser.role);
                              setUserDropdownOpen(false);
                            }}
                            className={`px-2 py-1.5 rounded-lg text-left text-xs transition-colors flex items-center justify-between border ${currentUser.email === testUser.email
                              ? 'bg-emerald-50 text-emerald-900 font-bold border-emerald-300'
                              : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                              }`}
                          >
                            <span className="capitalize text-[11px]">{testUser.role}</span>
                            {currentUser.email === testUser.email && (
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="p-1.5 space-y-1">
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          onOpenLogin();
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 flex items-center gap-2 transition-colors"
                      >
                        <Key size={14} className="text-emerald-700" />
                        <span>Manage Logins & Keys</span>
                      </button>

                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          onLogout();
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-rose-700 hover:bg-rose-50 flex items-center gap-2 transition-colors"
                      >
                        <LogOut size={14} className="text-rose-600" />
                        <span>Sign Out of Session</span>
                      </button>
                    </div>

                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={onOpenLogin}
                  className="flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs px-3.5 py-2 rounded-xl shadow-xs transition-all"
                >
                  <LogIn size={14} />
                  <span>Sign In / Test Keys</span>
                </button>
              </div>
            )}

          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-emerald-200 hover:text-white hover:bg-emerald-900 focus:outline-none transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-emerald-950 border-b border-emerald-800 px-4 pt-2 pb-4 space-y-2 animate-in slide-in-from-top-2">
          
          {/* User profile card inside mobile menu */}
          <div className="p-3 bg-emerald-900/80 rounded-xl border border-emerald-700/60 mb-2">
            {currentUser ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white font-bold text-xs flex items-center justify-center">
                      {currentUser.avatarInitials || currentUser.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-xs text-white">{currentUser.name}</p>
                      <p className="text-[11px] text-emerald-300">{currentUser.email}</p>
                    </div>
                  </div>
                  <span className={`text-[10px] uppercase font-extrabold px-2 py-0.5 rounded border ${getRoleBadgeColor(currentUser.role)}`}>
                    {currentUser.role}
                  </span>
                </div>
                <div className="flex items-center gap-2 pt-2 border-t border-emerald-800/80 text-xs">
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenLogin();
                    }}
                    className="flex-1 text-center bg-emerald-800 hover:bg-emerald-700 py-1.5 rounded-lg text-emerald-100 font-semibold"
                  >
                    Switch Account
                  </button>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onLogout();
                    }}
                    className="px-3 py-1.5 rounded-lg bg-rose-900/50 hover:bg-rose-900 text-rose-200 font-semibold"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenLogin();
                }}
                className="w-full py-2 bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs rounded-lg flex items-center justify-center gap-2"
              >
                <LogIn size={15} />
                <span>Sign In / Select Test Account</span>
              </button>
            )}
          </div>

          {/* Navigation Links */}
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeRoute === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive
                  ? item.isAdmin
                    ? 'bg-amber-500/20 text-amber-300 font-bold'
                    : 'bg-emerald-800 text-white font-bold'
                  : 'text-emerald-100 hover:bg-emerald-900'
                  }`}
              >
                <div className="flex items-center gap-3">
                  <Icon size={18} className={item.isAdmin ? 'text-amber-400' : 'text-emerald-400'} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== null && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${item.isAdmin ? 'bg-amber-400 text-amber-950' : 'bg-emerald-500 text-white'
                    }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          <div className="pt-3 mt-3 border-t border-emerald-800/80 flex items-center justify-between text-xs text-emerald-300">
            <span className="flex items-center gap-1.5">
              <Database size={12} className="text-emerald-400" />
              IndexedDB (FoodShareAppDB) Active
            </span>
            <span className="text-[11px] text-emerald-400 font-mono">v2.0</span>
          </div>
        </div>
      )}
    </header>
  );
}
