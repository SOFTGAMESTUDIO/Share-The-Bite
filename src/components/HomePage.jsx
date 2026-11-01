import React from 'react';
import { 
  HeartHandshake, 
  Package, 
  MapPin, 
  Clock, 
  ArrowRight, 
  ShieldCheck, 
  Users, 
  Building2, 
  Truck, 
  CheckCircle2, 
  Sparkles, 
  Leaf, 
  Database,
  ChevronRight,
  Eye,
  FileText
} from 'lucide-react';
import { getCategoryIcon } from '../utils/categoryIcons';

export default function HomePage({ 
  donations = [], 
  onNavigate, 
  onOpenApplyModal, 
  onOpenAdminLogin, 
  isAdmin = false 
}) {
  const availableDonations = donations.filter(d => d.status === 'Available');
  const latestDonations = donations.slice(0, 6);
  const totalServingsRescued = donations
    .filter(d => d.status === 'Delivered')
    .reduce((sum, d) => sum + (Number(d.servings) || 10), 0) + 120; // baseline community rescue

  const calculateHoursLeft = (expiryDateStr) => {
    if (!expiryDateStr) return null;
    const diff = new Date(expiryDateStr) - new Date();
    const hours = Math.round(diff / (1000 * 3600));
    return hours;
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-950 via-slate-900 to-emerald-900 text-white rounded-3xl p-8 sm:p-12 lg:p-16 border border-emerald-800 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-900/80 border border-emerald-500/40 text-emerald-300 text-xs font-bold uppercase tracking-wider shadow-inner">
            <Leaf size={14} className="text-emerald-400" />
            <span>UN SDG 2: Zero Hunger &bull; Surplus Food Rescue Platform</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Share The Bite. <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-200">
              End Hunger. Reduce Waste.
            </span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base lg:text-lg leading-relaxed max-w-2xl font-normal">
            A real-time community bridge connecting hotels, bakeries, caterers, and supermarkets with local shelters, soup kitchens, and families in need. 
            Anyone can donate without an account, and shelters can apply to request meals instantly.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('listings')}
              className="bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-emerald-950 font-extrabold text-xs sm:text-sm px-6 py-3.5 rounded-xl transition-all shadow-lg hover:shadow-emerald-500/25 flex items-center gap-2 focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:outline-none"
            >
              <span>Browse All Surplus Products</span>
              <ArrowRight size={16} />
            </button>

            <button
              onClick={() => onNavigate('donor')}
              className="bg-white/10 hover:bg-white/15 active:bg-white/20 text-white font-bold text-xs sm:text-sm px-6 py-3.5 rounded-xl border border-white/20 transition-all flex items-center gap-2 backdrop-blur-xs"
            >
              <HeartHandshake size={16} className="text-emerald-300" />
              <span>Donate Food (No Account Needed)</span>
            </button>
          </div>

          {/* Quick Features Row */}
          <div className="pt-4 border-t border-emerald-800/60 grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs text-slate-300 font-medium">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
              <span>Open Public Donation Intake</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
              <span>Receiver Application Form</span>
            </div>
            <div className="flex items-center gap-2 col-span-2 sm:col-span-1">
              <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
              <span>Central Admin Logistics Control</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. REAL-TIME STATS STRIP */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider">
            <span>Available Products</span>
            <Package size={16} className="text-emerald-700" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900">{availableDonations.length}</div>
          <p className="text-[11px] text-emerald-800 font-semibold">Ready for shelter application</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider">
            <span>Total Surplus Batches</span>
            <Building2 size={16} className="text-blue-700" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900">{donations.length}</div>
          <p className="text-[11px] text-slate-500 font-medium">Logged in IndexedDB</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider">
            <span>Rescued Servings</span>
            <Users size={16} className="text-amber-700" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900">{totalServingsRescued}</div>
          <p className="text-[11px] text-amber-800 font-semibold">Meals delivered to beneficiaries</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider">
            <span>Storage Architecture</span>
            <Database size={16} className="text-emerald-700" />
          </div>
          <div className="text-lg font-extrabold text-emerald-900">IndexedDB + LS</div>
          <p className="text-[11px] text-emerald-800 font-semibold">Dual engine real-time sync</p>
        </div>
      </section>

      {/* 3. LATEST DONOR PRODUCTS SECTION */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-1">
              <Sparkles size={14} />
              <span>Real-Time Community Supply</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Latest Surplus Food Products
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm mt-0.5">
              Wholesome food listings posted by local donors, ready for immediate shelter claim.
            </p>
          </div>

          <button
            onClick={() => onNavigate('listings')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 hover:text-emerald-700 transition-colors self-start sm:self-auto"
          >
            <span>View All ({donations.length}) Products</span>
            <ChevronRight size={15} />
          </button>
        </div>

        {/* Latest Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {latestDonations.map((donation) => {
            const hoursLeft = calculateHoursLeft(donation.expiry);
            const isAvailable = donation.status === 'Available';

            return (
              <div
                key={donation.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 hover:shadow-md transition-all flex flex-col justify-between overflow-hidden"
              >
                {/* Card Header Bar */}
                <div className="p-4 bg-slate-50/80 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center shadow-2xs">
                      {getCategoryIcon(donation.category, 16)}
                    </div>
                    <span className="text-xs font-bold text-slate-700">
                      {donation.category}
                    </span>
                  </div>

                  {isAvailable ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                      Available
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
                      {donation.status}
                    </span>
                  )}
                </div>

                {/* Card Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="font-bold text-slate-900 text-base leading-snug">
                      {donation.item}
                    </h3>
                    <p className="text-xs font-semibold text-emerald-800 mt-1 flex items-center gap-1">
                      <Building2 size={13} />
                      <span>{donation.donor}</span>
                      {donation.donorType && (
                        <span className="text-slate-400 font-normal">({donation.donorType})</span>
                      )}
                    </p>

                    <div className="space-y-2 mt-4 text-xs text-slate-600">
                      <div className="flex items-center gap-2">
                        <Package size={14} className="text-slate-400 shrink-0" />
                        <span><strong>Quantity:</strong> {donation.quantity} &bull; <strong className="text-emerald-800">{donation.servings || 10} portions</strong></span>
                      </div>

                      <div className="flex items-start gap-2">
                        <MapPin size={14} className="text-slate-400 shrink-0 mt-0.5" />
                        <span className="line-clamp-1"><strong>Location:</strong> {donation.location}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Clock size={14} className="text-slate-400 shrink-0" />
                        <span>
                          <strong>Expiry:</strong> {new Date(donation.expiry).toLocaleDateString()}
                          {hoursLeft !== null && (
                            <span className={`ml-1 font-semibold ${hoursLeft < 12 ? 'text-rose-600' : 'text-slate-700'}`}>
                              ({hoursLeft > 0 ? `${hoursLeft}h left` : 'Expired'})
                            </span>
                          )}
                        </span>
                      </div>

                      {donation.dietary && (
                        <div className="pt-1">
                          <span className="inline-block bg-slate-100 text-slate-700 text-[11px] font-medium px-2 py-0.5 rounded border border-slate-200">
                            {donation.dietary}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Bar */}
                  <div className="pt-4 border-t border-slate-100 flex items-center gap-2">
                    {isAvailable ? (
                      <button
                        onClick={() => {
                          if (onOpenApplyModal) {
                            onOpenApplyModal(donation);
                          } else {
                            onNavigate('listings');
                          }
                        }}
                        className="w-full bg-emerald-800 hover:bg-emerald-700 active:bg-emerald-900 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-colors flex items-center justify-center gap-2 shadow-xs"
                      >
                        <HeartHandshake size={15} />
                        <span>Request Food</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => onNavigate('listings')}
                        className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2 px-3 rounded-xl text-xs transition-colors text-center"
                      >
                        View in All Products &bull; {donation.status}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center pt-2">
          <button
            onClick={() => onNavigate('listings')}
            className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-6 py-3 rounded-xl shadow-xs transition-colors"
          >
            <span>Explore All {donations.length} Surplus Food Products</span>
            <ArrowRight size={15} />
          </button>
        </div>
      </section>

      {/* 4. HOW IT WORKS 3-STEP PIPELINE */}
      <section className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-xs space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-emerald-800 text-xs font-bold uppercase tracking-wider">
            Operational Blueprint
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            How Share The Bite Works
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm">
            A frictionless 3-step workflow designed to eliminate food waste and ensure prompt relief delivery.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Step 1 */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-800 text-white font-black text-sm flex items-center justify-center shadow-xs">
              1
            </div>
            <h3 className="font-bold text-slate-900 text-base">Public Donor Intake</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Anyone with surplus food (restaurants, hotels, bakeries, farms, households) submits the food details. No account or password required.
            </p>
            <button
              onClick={() => onNavigate('donor')}
              className="text-xs font-bold text-emerald-800 hover:underline inline-flex items-center gap-1 pt-1"
            >
              <span>Open Donor Form</span>
              <ArrowRight size={13} />
            </button>
          </div>

          {/* Step 2 */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-700 text-white font-black text-sm flex items-center justify-center shadow-xs">
              2
            </div>
            <h3 className="font-bold text-slate-900 text-base">Shelter Relief Application</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Shelters, food banks, and soup kitchens browse active listings and submit a structured request application specifying beneficiaries and timing.
            </p>
            <button
              onClick={() => onNavigate('listings')}
              className="text-xs font-bold text-blue-700 hover:underline inline-flex items-center gap-1 pt-1"
            >
              <span>Browse All Products</span>
              <ArrowRight size={13} />
            </button>
          </div>

          {/* Step 3 */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white font-black text-sm flex items-center justify-center shadow-xs">
              3
            </div>
            <h3 className="font-bold text-slate-900 text-base">Central Admin Logistics</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              System Administrator reviews the two-sided dossier, authorizes claims, dispatches pickup drivers, tracks in-transit delivery, and verifies handover.
            </p>
            <button
              onClick={() => {
                if (isAdmin) {
                  onNavigate('admin');
                } else if (onOpenAdminLogin) {
                  onOpenAdminLogin();
                } else {
                  onNavigate('admin');
                }
              }}
              className="text-xs font-bold text-slate-900 hover:underline inline-flex items-center gap-1 pt-1"
            >
              <span>{isAdmin ? 'Open Admin Control' : 'Admin Login Required'}</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </div>
      </section>

      {/* 5. CALL TO ACTION BANNER */}
      <section className="bg-emerald-900 text-white rounded-3xl p-8 sm:p-10 border border-emerald-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight">Have Surplus Food to Donate Right Now?</h2>
          <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-xl">
            It takes less than 60 seconds to list surplus meals. Rescue fresh food before it spoils and feed vulnerable people today.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => onNavigate('donor')}
            className="bg-white hover:bg-emerald-50 text-emerald-950 font-bold text-xs sm:text-sm px-6 py-3 rounded-xl transition-all shadow-md"
          >
            + Donate Food (Public)
          </button>
          <button
            onClick={() => onNavigate('listings')}
            className="bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm px-5 py-3 rounded-xl border border-emerald-600 transition-all"
          >
            View Available Food
          </button>
        </div>
      </section>

    </div>
  );
}

