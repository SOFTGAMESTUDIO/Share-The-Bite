import React, { useState } from 'react';
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
  ArrowRight
} from 'lucide-react';

export default function Navbar({
  activeRoute = 'home',
  onNavigate,
  availableCount = 0,
  isAdmin = false,
  currentUser = null,
  onOpenAdminLogin,
  onLogout
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'listings', label: 'All Products', icon: Package, badge: availableCount > 0 ? availableCount : null },
    { id: 'admin', label: 'Admin Control', icon: ShieldCheck, badge: 'PRO', isAdminItem: true },
    { id: 'report', label: 'SDG 2 Report', icon: FileText }
  ];

  const handleNavClick = (id) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="bg-emerald-950 text-white shadow-md sticky top-0 z-40 border-b border-emerald-800/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 gap-3">

          {/* Logo & Brand: Share The Bite */}
          <div
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2.5 cursor-pointer group select-none shrink-0"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-800 border border-emerald-500/40 flex items-center justify-center text-emerald-300 group-hover:scale-105 transition-transform shadow-inner">
              <Leaf className="h-5 w-5" />
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight text-white group-hover:text-emerald-200 transition-colors leading-none block">
                Share The Bite
              </span>
              <p className="text-[10px] text-emerald-300/80 font-medium tracking-wide leading-none mt-1">
                Zero Hunger Initiative
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = activeRoute === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold tracking-wide transition-all ${
                    isActive
                      ? item.isAdminItem
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-400/40 shadow-xs'
                        : 'bg-emerald-800 text-white border border-emerald-600/40 shadow-inner'
                      : 'text-emerald-100/90 hover:text-white hover:bg-emerald-900/60'
                  }`}
                >
                  <Icon size={15} className={item.isAdminItem ? 'text-amber-400' : 'text-emerald-400'} />
                  <span>{item.label}</span>
                  {item.badge !== null && (
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold leading-tight ${
                      item.isAdminItem
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

          {/* Right Controls: + Donate Food CTA + Admin Login Only */}
          <div className="hidden sm:flex items-center gap-2.5 shrink-0">
            {/* 3rd Request: Donor Form CTA */}
            <button
              onClick={() => handleNavClick('donor')}
              className={`flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 rounded-xl transition-all shadow-sm ${
                activeRoute === 'donor'
                  ? 'bg-emerald-500 text-emerald-950 ring-2 ring-emerald-300 font-extrabold'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white hover:shadow-emerald-900/40'
              }`}
              title="Anyone can donate food without an account"
            >
              <HeartHandshake size={15} />
              <span>+ Donate Food</span>
            </button>

            {/* 5th Request: The Admin Login ONLY */}
            {isAdmin ? (
              <div className="flex items-center gap-2 bg-emerald-900/80 border border-emerald-700/80 pl-2.5 pr-1.5 py-1 rounded-xl text-xs">
                <div className="flex items-center gap-1.5 text-amber-300 font-bold">
                  <ShieldCheck size={14} className="text-amber-400" />
                  <span className="hidden xl:inline">Admin Active</span>
                </div>
                <button
                  onClick={onLogout}
                  className="bg-emerald-950/80 hover:bg-rose-900/70 text-slate-300 hover:text-rose-200 p-1.5 rounded-lg transition-colors"
                  title="Sign Out of Administrator Session"
                >
                  <LogOut size={13} />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAdminLogin}
                className="flex items-center gap-1.5 bg-emerald-900/80 hover:bg-emerald-850 border border-emerald-700/70 text-emerald-100 hover:text-white px-3 py-2 rounded-xl text-xs font-bold transition-all shadow-xs"
                title="Administrator access only"
              >
                <Key size={14} className="text-amber-400" />
                <span>Admin Login</span>
              </button>
            )}
          </div>

          {/* Mobile Menu Hamburger Button */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={() => handleNavClick('donor')}
              className="bg-emerald-600 text-white text-xs font-bold px-2.5 py-1.5 rounded-lg flex items-center gap-1"
            >
              <HeartHandshake size={13} />
              <span>Donate</span>
            </button>

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

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-emerald-950 border-b border-emerald-800 p-4 space-y-2 animate-in slide-in-from-top-2">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = activeRoute === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-bold transition-colors ${
                  isActive ? 'bg-emerald-800 text-white' : 'text-emerald-100 hover:bg-emerald-900/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon size={16} className={item.isAdminItem ? 'text-amber-400' : 'text-emerald-400'} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== null && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-500 text-white">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          <div className="pt-2 border-t border-emerald-800/80 flex flex-col gap-2">
            <button
              onClick={() => handleNavClick('donor')}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-3 rounded-xl flex items-center justify-center gap-2 shadow-xs"
            >
              <HeartHandshake size={15} />
              <span>+ Donate Food (No Account Needed)</span>
            </button>

            {isAdmin ? (
              <button
                onClick={() => {
                  onLogout();
                  setMobileMenuOpen(false);
                }}
                className="w-full bg-rose-900/40 border border-rose-700/60 text-rose-200 font-bold text-xs py-2.5 rounded-xl flex items-center justify-center gap-2"
              >
                <LogOut size={14} />
                <span>Sign Out of Admin</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAdminLogin();
                }}
                className="w-full bg-emerald-900 border border-emerald-700 text-emerald-100 font-bold text-xs py-2.5 rounded-xl flex items-center justify-center gap-2"
              >
                <Key size={14} className="text-amber-400" />
                <span>Admin Login Only</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
