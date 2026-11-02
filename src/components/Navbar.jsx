import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Leaf,
  Home,
  Package,
  HeartHandshake,
  ShieldCheck,
  FileText,
  Menu,
  X,
  Key,
  LogOut,
  CheckCircle2
} from 'lucide-react';

export default function Navbar({
  availableCount = 0,
  isAdmin = false,
  currentUser = null,
  onLogout
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const navLinks = [
    { to: '/', label: 'Home', icon: Home, end: true },
    { to: '/products', label: 'Food Listings', icon: Package, badge: availableCount > 0 ? availableCount : null },
    { to: '/admin', label: 'Admin Console', icon: ShieldCheck, badge: 'PRO', isAdminItem: true },
    { to: '/report', label: 'Report', icon: FileText },
    { to: '/evaluation', label: 'Evaluation', icon: CheckCircle2 }
  ];

  const handleLogoutClick = async () => {
    if (onLogout) await onLogout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const getUserInitials = () => {
    if (!currentUser) return 'AD';
    if (currentUser.displayName) {
      return currentUser.displayName
        .split(' ')
        .map((p) => p[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    if (currentUser.email) {
      return currentUser.email.slice(0, 2).toUpperCase();
    }
    return 'AD';
  };

  const getUserDisplayName = () => {
    if (!currentUser) return 'Admin';
    if (currentUser.displayName) return currentUser.displayName;
    if (currentUser.email) return currentUser.email.split('@')[0];
    return 'Admin';
  };

  return (
    <header className="bg-emerald-950 text-white shadow-md sticky top-0 z-50 border-b border-emerald-800/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">

          {/* Left Brand: Share The Bite • Zero Hunger Initiative */}
          <NavLink
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2.5 cursor-pointer group select-none shrink-0"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-900 border border-emerald-500/40 flex items-center justify-center text-emerald-300 group-hover:scale-105 transition-transform shadow-inner">
              <Leaf className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 leading-none">
                <span className="font-black text-lg sm:text-xl tracking-tight text-white group-hover:text-emerald-200 transition-colors">
                  Share The Bite
                </span>
              </div>
              <p className="text-[10px] text-emerald-300/80 font-medium tracking-wide leading-none mt-1">
                Zero Hunger Initiative
              </p>
            </div>
          </NavLink>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navLinks.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold tracking-normal transition-all whitespace-nowrap ${
                      isActive
                        ? item.isAdminItem
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-400/40 shadow-xs'
                          : 'bg-emerald-800 text-white border border-emerald-600/40 shadow-inner'
                        : 'text-emerald-100/90 hover:text-white hover:bg-emerald-900/60'
                    }`
                  }
                >
                  <Icon size={14} className={item.isAdminItem ? 'text-amber-400' : 'text-emerald-400'} />
                  <span>{item.label}</span>
                  {item.badge !== null && item.badge !== undefined && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold leading-tight ${
                        item.isAdminItem
                          ? 'bg-amber-400 text-amber-950'
                          : 'bg-emerald-500 text-white'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>

          {/* Right Controls: + Donate Food CTA & Firebase Auth Admin Pill */}
          <div className="hidden sm:flex items-center gap-2.5 shrink-0">
            
            {/* Donate Food Button - Anyone can donate without account */}
            <NavLink
              to="/donate"
              className={({ isActive }) =>
                `flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 rounded-xl transition-all shadow-xs whitespace-nowrap ${
                  isActive
                    ? 'bg-emerald-500 text-emerald-950 ring-2 ring-emerald-300 font-extrabold'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                }`
              }
              title="Anyone can donate surplus food without an account"
            >
              <HeartHandshake size={15} />
              <span>+ Donate Food</span>
            </NavLink>

            {/* Admin Profile (if logged in via Firebase Auth) OR Admin Login button */}
            {isAdmin ? (
              <div className="flex items-center gap-2 bg-emerald-900/90 border border-emerald-700/80 pl-2 pr-1.5 py-1 rounded-xl text-xs shadow-xs">
                <div className="w-6 h-6 rounded-lg bg-emerald-700 border border-emerald-500/50 flex items-center justify-center text-[10px] font-black text-amber-300">
                  {getUserInitials()}
                </div>
                <div className="flex items-center gap-1.5 text-slate-200 text-xs font-bold max-w-[120px] truncate">
                  <span className="truncate">{getUserDisplayName()}</span>
                  <span className="bg-amber-400 text-amber-950 text-[9px] px-1.5 py-0.5 rounded font-black shrink-0">
                    ADMIN
                  </span>
                </div>
                <button
                  onClick={handleLogoutClick}
                  className="bg-emerald-950 hover:bg-rose-900/80 text-slate-300 hover:text-rose-200 p-1.5 rounded-lg transition-colors ml-0.5"
                  title="Sign Out of Firebase Auth Session"
                >
                  <LogOut size={13} />
                </button>
              </div>
            ) : (
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  `flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all shadow-xs border whitespace-nowrap ${
                    isActive
                      ? 'bg-amber-500/20 text-amber-300 border-amber-400/50'
                      : 'bg-emerald-900/80 hover:bg-emerald-850 border-emerald-700/70 text-emerald-100 hover:text-white'
                  }`
                }
                title="Sign in with your Firebase Authentication account"
              >
                <Key size={14} className="text-amber-400" />
                <span>Admin Login</span>
              </NavLink>
            )}

          </div>

          {/* Mobile Actions: Donate Button & Hamburger Toggle */}
          <div className="flex md:hidden items-center gap-1.5">
            <NavLink
              to="/donate"
              className="sm:hidden bg-emerald-600 text-white text-xs font-bold px-2.5 py-1.5 rounded-lg flex items-center gap-1"
            >
              <HeartHandshake size={13} />
              <span>Donate</span>
            </NavLink>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-emerald-200 hover:text-white hover:bg-emerald-900/60 rounded-xl transition-colors focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-emerald-950 border-b border-emerald-800 p-4 space-y-1.5 animate-in slide-in-from-top-2">
          {navLinks.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `w-full flex items-center justify-between p-3 rounded-xl text-xs font-bold transition-colors ${
                    isActive ? 'bg-emerald-800 text-white' : 'text-emerald-100 hover:bg-emerald-900/60'
                  }`
                }
              >
                <div className="flex items-center gap-2.5">
                  <Icon size={16} className={item.isAdminItem ? 'text-amber-400' : 'text-emerald-400'} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== null && item.badge !== undefined && (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      item.isAdminItem ? 'bg-amber-400 text-amber-950' : 'bg-emerald-500 text-white'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}

          <div className="pt-3 border-t border-emerald-800/80 flex flex-col gap-2">
            <NavLink
              to="/donate"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-3 rounded-xl flex items-center justify-center gap-2 shadow-xs"
            >
              <HeartHandshake size={15} />
              <span>+ Donate Surplus Food (No Account Needed)</span>
            </NavLink>

            {isAdmin ? (
              <button
                onClick={handleLogoutClick}
                className="w-full bg-rose-900/40 border border-rose-700/60 text-rose-200 font-bold text-xs py-2.5 rounded-xl flex items-center justify-center gap-2"
              >
                <LogOut size={14} />
                <span>Sign Out ({getUserDisplayName()})</span>
              </button>
            ) : (
              <NavLink
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full bg-emerald-900 border border-emerald-700 text-emerald-100 font-bold text-xs py-2.5 rounded-xl flex items-center justify-center gap-2"
              >
                <Key size={14} className="text-amber-400" />
                <span>Admin Login (Firebase Auth)</span>
              </NavLink>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
