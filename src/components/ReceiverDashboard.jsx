import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  Truck, 
  ArrowRight,
  Filter,
  Phone,
  Check,
  Building2
} from 'lucide-react';
import { getCategoryIcon } from '../utils/categoryIcons';

export default function ReceiverDashboard({ donations = [], onUpdateStatus, onNavigate, currentUser = null }) {
  const [statusFilter, setStatusFilter] = useState('All');

  const claimedDonations = donations.filter(d => d.status !== 'Available');

  const filteredItems = claimedDonations.filter(d => {
    if (statusFilter === 'All') return true;
    return d.status === statusFilter;
  });

  const pendingCount = claimedDonations.filter(d => d.status === 'Pending Pickup').length;
  const inTransitCount = claimedDonations.filter(d => d.status === 'Picked Up').length;
  const deliveredCount = claimedDonations.filter(d => d.status === 'Delivered').length;

  const totalServingsRescued = claimedDonations
    .filter(d => d.status === 'Delivered')
    .reduce((sum, d) => sum + (d.servings || 10), 0);

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-emerald-800 text-xs font-semibold uppercase tracking-wider mb-2">
            <LayoutDashboard size={15} />
            <span>Relief Logistics Pipeline</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Receiver and Distribution Pipeline
          </h1>
          <p className="text-slate-600 text-sm mt-1">
            Track claims, coordinate volunteer pickup arrivals, and record verified delivery to beneficiaries.
          </p>
          {currentUser && (
            <div className="mt-2.5 inline-flex items-center gap-1.5 text-xs bg-slate-100 px-2.5 py-1 rounded-lg text-slate-700 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>Active Operator: <strong>{currentUser.name}</strong> ({currentUser.role} &bull; {currentUser.organization})</span>
            </div>
          )}
        </div>

        <button
          onClick={() => onNavigate('listings')}
          className="bg-emerald-700 hover:bg-emerald-600 active:bg-emerald-800 text-white font-semibold text-xs px-5 py-2.5 rounded-lg shadow-xs transition-colors flex items-center gap-2 self-start md:self-auto focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:outline-none"
        >
          <span>Claim Additional Surplus</span>
          <ArrowRight size={15} />
        </button>
      </div>

      {/* Pipeline KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Total Claimed</span>
          <div className="text-2xl sm:text-3xl font-bold text-slate-900">{claimedDonations.length}</div>
          <div className="text-xs text-slate-400 mt-1">Active claims logged</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-amber-200 bg-amber-50/20 shadow-xs">
          <span className="text-xs font-semibold text-amber-800 uppercase tracking-wider block mb-1">Pending Pickup</span>
          <div className="text-2xl sm:text-3xl font-bold text-amber-700">{pendingCount}</div>
          <div className="text-xs text-amber-700/80 mt-1">Awaiting driver collection</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-blue-200 bg-blue-50/20 shadow-xs">
          <span className="text-xs font-semibold text-blue-800 uppercase tracking-wider block mb-1">In Transit</span>
          <div className="text-2xl sm:text-3xl font-bold text-blue-700">{inTransitCount}</div>
          <div className="text-xs text-blue-700/80 mt-1">Collected and en route</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-emerald-200 bg-emerald-50/20 shadow-xs">
          <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider block mb-1">Rescued Servings</span>
          <div className="text-2xl sm:text-3xl font-bold text-emerald-700">{totalServingsRescued}</div>
          <div className="text-xs text-emerald-700/80 mt-1">Meals safely distributed</div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 bg-white p-2 rounded-xl border border-slate-200 shadow-xs overflow-x-auto text-xs font-semibold">
        <button
          onClick={() => setStatusFilter('All')}
          className={`px-3.5 py-1.5 rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:outline-none ${
            statusFilter === 'All' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          All Claimed ({claimedDonations.length})
        </button>
        <button
          onClick={() => setStatusFilter('Pending Pickup')}
          className={`px-3.5 py-1.5 rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:outline-none ${
            statusFilter === 'Pending Pickup' ? 'bg-amber-600 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Pending Pickup ({pendingCount})
        </button>
        <button
          onClick={() => setStatusFilter('Picked Up')}
          className={`px-3.5 py-1.5 rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:outline-none ${
            statusFilter === 'Picked Up' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          In Transit ({inTransitCount})
        </button>
        <button
          onClick={() => setStatusFilter('Delivered')}
          className={`px-3.5 py-1.5 rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:outline-none ${
            statusFilter === 'Delivered' ? 'bg-emerald-700 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Delivered ({deliveredCount})
        </button>
      </div>

      {/* Pipeline Items Table / Cards */}
      {filteredItems.length === 0 ? (
        <div className="bg-white rounded-2xl p-16 text-center border border-dashed border-slate-300">
          <Truck size={44} className="mx-auto text-slate-300 mb-3" />
          <h2 className="text-base font-bold text-slate-800">No donations in this pipeline stage</h2>
          <p className="text-slate-500 text-xs mt-1 max-w-sm mx-auto">
            Browse available food listings and claim surplus meals to track them here.
          </p>
          <button
            onClick={() => onNavigate('listings')}
            className="mt-4 px-4 py-2 bg-emerald-700 text-white font-semibold rounded-lg text-xs hover:bg-emerald-600 transition-colors shadow-xs"
          >
            Go to Food Listings
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredItems.map((donation) => {
            const isPending = donation.status === 'Pending Pickup';
            const isInTransit = donation.status === 'Picked Up';
            const isDelivered = donation.status === 'Delivered';

            return (
              <div
                key={donation.id}
                className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 hover:border-slate-300 transition-all"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  
                  {/* Left Column: Food Details & Status Indicator */}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center flex-shrink-0">
                      {getCategoryIcon(donation.category, 22)}
                    </div>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="font-bold text-slate-900 text-base">{donation.item}</h2>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200">
                          {donation.category}
                        </span>
                      </div>

                      <div className="text-xs text-slate-600 flex flex-wrap items-center gap-x-4 gap-y-1">
                        <span><strong>Donor:</strong> {donation.donor}</span>
                        <span>•</span>
                        <span><strong>Quantity:</strong> {donation.quantity}</span>
                        <span>•</span>
                        <span><strong>Claimed by:</strong> {donation.receiver || 'Assigned NGO'}</span>
                      </div>

                      <div className="text-xs text-slate-500 flex items-center gap-1.5 pt-0.5">
                        <MapPin size={13} className="text-emerald-700 flex-shrink-0" />
                        <span>{donation.location}</span>
                      </div>

                      {donation.receiverNotes && (
                        <div className="text-xs text-slate-700 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 inline-block mt-2">
                          <strong>Dispatch Note:</strong> {donation.receiverNotes}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Column: Interactive Pipeline Steps & Status Controls */}
                  <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end justify-between gap-4 pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                    
                    {/* Visual 3-Step Pipeline Progression */}
                    <div className="flex items-center gap-2 text-xs font-semibold">
                      <div className={`flex items-center gap-1 px-2.5 py-1 rounded-md border ${
                        isPending || isInTransit || isDelivered ? 'bg-amber-50 text-amber-800 border-amber-200' : 'bg-slate-100 text-slate-400 border-slate-200'
                      }`}>
                        <Check size={12} /> Claimed
                      </div>
                      <span className="text-slate-300">→</span>
                      <div className={`flex items-center gap-1 px-2.5 py-1 rounded-md border ${
                        isInTransit || isDelivered ? 'bg-blue-50 text-blue-800 border-blue-200' : 'bg-slate-100 text-slate-400 border-slate-200'
                      }`}>
                        {isInTransit || isDelivered ? <Check size={12} /> : null} In Transit
                      </div>
                      <span className="text-slate-300">→</span>
                      <div className={`flex items-center gap-1 px-2.5 py-1 rounded-md border ${
                        isDelivered ? 'bg-emerald-50 text-emerald-800 border-emerald-200 font-bold' : 'bg-slate-100 text-slate-400 border-slate-200'
                      }`}>
                        {isDelivered ? <Check size={12} /> : null} Delivered
                      </div>
                    </div>

                    {/* Action Transition Buttons */}
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      {isPending && (
                        <button
                          onClick={() => onUpdateStatus(donation.id, 'Picked Up')}
                          className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs px-4 py-2 rounded-lg shadow-xs transition-colors flex items-center justify-center gap-1.5 focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:outline-none"
                        >
                          <Truck size={14} />
                          <span>Confirm Picked Up</span>
                        </button>
                      )}

                      {isInTransit && (
                        <button
                          onClick={() => onUpdateStatus(donation.id, 'Delivered')}
                          className="w-full sm:w-auto bg-emerald-700 hover:bg-emerald-600 text-white font-semibold text-xs px-4 py-2 rounded-lg shadow-xs transition-colors flex items-center justify-center gap-1.5 focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:outline-none"
                        >
                          <CheckCircle2 size={14} />
                          <span>Mark Delivered to Shelter</span>
                        </button>
                      )}

                      {isDelivered && (
                        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg">
                          <CheckCircle2 size={14} className="text-emerald-700" />
                          <span>Delivery Verified</span>
                        </div>
                      )}
                    </div>

                  </div>

                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
