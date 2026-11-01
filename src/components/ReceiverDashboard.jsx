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
  Building2,
  Users,
  AlertCircle,
  FileCheck
} from 'lucide-react';
import { getCategoryIcon } from '../utils/categoryIcons';

const STAGES = [
  { key: 'Requested', label: '1. Applied / Review' },
  { key: 'Request Accepted', label: '2. Accepted' },
  { key: 'Out for Pickup', label: '3. Out for Pickup' },
  { key: 'Picked Up', label: '4. Picked Up' },
  { key: 'Out for Delivery', label: '5. Out for Delivery' },
  { key: 'Delivered', label: '6. Delivered' }
];

export default function ReceiverDashboard({ donations = [], onUpdateStatus, onNavigate, currentUser = null }) {
  const [statusFilter, setStatusFilter] = useState('All');

  const claimedDonations = donations.filter(d => d.status !== 'Available');

  const filteredItems = claimedDonations.filter(d => {
    if (statusFilter === 'All') return true;
    return d.status === statusFilter;
  });

  const requestedCount = claimedDonations.filter(d => d.status === 'Requested').length;
  const acceptedCount = claimedDonations.filter(d => d.status === 'Request Accepted').length;
  const pickupCount = claimedDonations.filter(d => d.status === 'Out for Pickup').length;
  const inTransitCount = claimedDonations.filter(d => d.status === 'Picked Up' || d.status === 'Out for Delivery').length;
  const deliveredCount = claimedDonations.filter(d => d.status === 'Delivered').length;

  const totalServingsRescued = claimedDonations
    .filter(d => d.status === 'Delivered')
    .reduce((sum, d) => sum + (Number(d.servings) || 10), 0);

  const getStageIndex = (status) => {
    switch (status) {
      case 'Requested': return 0;
      case 'Request Accepted': return 1;
      case 'Out for Pickup': return 2;
      case 'Picked Up': return 3;
      case 'Out for Delivery': return 4;
      case 'Delivered': return 5;
      default: return 0;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2">
            <LayoutDashboard size={15} />
            <span>Relief Logistics & Delivery Pipeline</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Receiver Tracking & Distribution Pipeline
          </h1>
          <p className="text-slate-600 text-sm mt-1 max-w-2xl">
            Track shelter food requests through every operational milestone: application submission, admin approval, donor pickup dispatch, in-transit telemetry, and verified shelter delivery.
          </p>
          {currentUser && (
            <div className="mt-3 inline-flex items-center gap-2 text-xs bg-slate-100 px-3 py-1 rounded-xl text-slate-700 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
              <span>Authenticated Shelter Operator: <strong>{currentUser.name}</strong> ({currentUser.organization || currentUser.role})</span>
            </div>
          )}
        </div>

        <button
          onClick={() => onNavigate('listings')}
          className="bg-emerald-800 hover:bg-emerald-700 active:bg-emerald-900 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-xs transition-colors flex items-center gap-2 self-start md:self-auto focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:outline-none"
        >
          <span>Browse Available Surplus</span>
          <ArrowRight size={15} />
        </button>
      </div>

      {/* Pipeline KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Total Pipeline</span>
          <div className="text-2xl sm:text-3xl font-bold text-slate-900">{claimedDonations.length}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Active relief claims</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-amber-200 bg-amber-50/20 shadow-xs">
          <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider block mb-1">Under Review</span>
          <div className="text-2xl sm:text-3xl font-bold text-amber-700">{requestedCount}</div>
          <div className="text-[11px] text-amber-700/80 mt-0.5">Awaiting admin review</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-indigo-200 bg-indigo-50/20 shadow-xs">
          <span className="text-[11px] font-bold text-indigo-800 uppercase tracking-wider block mb-1">Pickup Phase</span>
          <div className="text-2xl sm:text-3xl font-bold text-indigo-700">{acceptedCount + pickupCount}</div>
          <div className="text-[11px] text-indigo-700/80 mt-0.5">Approved or en route</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-purple-200 bg-purple-50/20 shadow-xs">
          <span className="text-[11px] font-bold text-purple-800 uppercase tracking-wider block mb-1">Out for Delivery</span>
          <div className="text-2xl sm:text-3xl font-bold text-purple-700">{inTransitCount}</div>
          <div className="text-[11px] text-purple-700/80 mt-0.5">En route to relief center</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-emerald-200 bg-emerald-50/20 shadow-xs">
          <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block mb-1">Rescued Meals</span>
          <div className="text-2xl sm:text-3xl font-bold text-emerald-700">{totalServingsRescued}</div>
          <div className="text-[11px] text-emerald-700/80 mt-0.5">{deliveredCount} delivered parcels</div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 bg-white p-2 rounded-xl border border-slate-200 shadow-xs overflow-x-auto text-xs font-semibold">
        <button
          onClick={() => setStatusFilter('All')}
          className={`px-3.5 py-1.5 rounded-lg transition-colors whitespace-nowrap focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:outline-none ${
            statusFilter === 'All' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          All Pipeline ({claimedDonations.length})
        </button>
        <button
          onClick={() => setStatusFilter('Requested')}
          className={`px-3.5 py-1.5 rounded-lg transition-colors whitespace-nowrap focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:outline-none ${
            statusFilter === 'Requested' ? 'bg-amber-600 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Requested ({requestedCount})
        </button>
        <button
          onClick={() => setStatusFilter('Request Accepted')}
          className={`px-3.5 py-1.5 rounded-lg transition-colors whitespace-nowrap focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:outline-none ${
            statusFilter === 'Request Accepted' ? 'bg-teal-700 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Accepted ({acceptedCount})
        </button>
        <button
          onClick={() => setStatusFilter('Out for Pickup')}
          className={`px-3.5 py-1.5 rounded-lg transition-colors whitespace-nowrap focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:outline-none ${
            statusFilter === 'Out for Pickup' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Out for Pickup ({pickupCount})
        </button>
        <button
          onClick={() => setStatusFilter('Out for Delivery')}
          className={`px-3.5 py-1.5 rounded-lg transition-colors whitespace-nowrap focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:outline-none ${
            statusFilter === 'Out for Delivery' ? 'bg-purple-600 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Out for Delivery
        </button>
        <button
          onClick={() => setStatusFilter('Delivered')}
          className={`px-3.5 py-1.5 rounded-lg transition-colors whitespace-nowrap focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:outline-none ${
            statusFilter === 'Delivered' ? 'bg-emerald-800 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Delivered ({deliveredCount})
        </button>
      </div>

      {/* Pipeline Items */}
      {filteredItems.length === 0 ? (
        <div className="bg-white rounded-2xl p-16 text-center border border-dashed border-slate-300">
          <Truck size={44} className="mx-auto text-slate-300 mb-3" />
          <h2 className="text-base font-bold text-slate-800">No relief requests in this stage</h2>
          <p className="text-slate-500 text-xs mt-1 max-w-sm mx-auto">
            Browse available food donations and submit an application to track logistics here.
          </p>
          <button
            onClick={() => onNavigate('listings')}
            className="mt-4 px-4 py-2 bg-emerald-800 text-white font-semibold rounded-lg text-xs hover:bg-emerald-700 transition-colors shadow-xs"
          >
            Browse Food Listings
          </button>
        </div>
      ) : (
        <div className="space-y-5">
          {filteredItems.map((donation) => {
            const currentStageIndex = getStageIndex(donation.status);
            const app = donation.receiverApplication || {};

            return (
              <div
                key={donation.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 hover:border-slate-300 transition-all space-y-4"
              >
                {/* Top Row: Food Details & Status Indicator */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div className="flex items-start gap-3.5">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center flex-shrink-0">
                      {getCategoryIcon(donation.category, 22)}
                    </div>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="font-bold text-slate-900 text-base">{donation.item}</h2>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200">
                          {donation.category}
                        </span>
                        <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                          #{donation.id}
                        </span>
                      </div>

                      <div className="text-xs text-slate-600 flex flex-wrap items-center gap-x-4 gap-y-1">
                        <span><strong>Offered by:</strong> {donation.donor}</span>
                        <span>&bull;</span>
                        <span><strong>Portions:</strong> {donation.quantity} ({donation.servings || 10} portions)</span>
                        <span>&bull;</span>
                        <span><strong>Recipient:</strong> <strong className="text-blue-900">{donation.receiver || 'Assigned Relief Center'}</strong></span>
                      </div>

                      <div className="text-xs text-slate-500 flex items-center gap-1.5 pt-0.5">
                        <MapPin size={13} className="text-emerald-700 flex-shrink-0" />
                        <span>Pickup: {donation.location}</span>
                      </div>
                    </div>
                  </div>

                  {/* Dynamic Action Button for receiver */}
                  <div className="flex items-center gap-2 self-start lg:self-center">
                    {donation.status === 'Requested' && (
                      <span className="text-xs font-semibold text-amber-800 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-xl flex items-center gap-1.5">
                        <AlertCircle size={14} className="text-amber-600" />
                        <span>Under Administrative Review</span>
                      </span>
                    )}

                    {donation.status === 'Request Accepted' && (
                      <span className="text-xs font-semibold text-teal-800 bg-teal-50 border border-teal-200 px-3 py-1.5 rounded-xl flex items-center gap-1.5">
                        <CheckCircle2 size={14} className="text-teal-600" />
                        <span>Approved &bull; Scheduling Driver</span>
                      </span>
                    )}

                    {donation.status === 'Out for Pickup' && (
                      <span className="text-xs font-semibold text-indigo-800 bg-indigo-50 border border-indigo-200 px-3 py-1.5 rounded-xl flex items-center gap-1.5">
                        <Truck size={14} className="text-indigo-600" />
                        <span>Driver En Route to Donor</span>
                      </span>
                    )}

                    {donation.status === 'Picked Up' && (
                      <button
                        onClick={() => onUpdateStatus(donation.id, 'Out for Delivery')}
                        className="bg-purple-700 hover:bg-purple-600 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-xs flex items-center gap-1.5"
                      >
                        <Truck size={14} />
                        <span>Dispatch Out for Delivery</span>
                      </button>
                    )}

                    {donation.status === 'Out for Delivery' && (
                      <button
                        onClick={() => onUpdateStatus(donation.id, 'Delivered')}
                        className="bg-emerald-800 hover:bg-emerald-700 active:bg-emerald-900 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-xs flex items-center gap-1.5"
                      >
                        <CheckCircle2 size={14} />
                        <span>Confirm Delivery Received</span>
                      </button>
                    )}

                    {donation.status === 'Delivered' && (
                      <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3.5 py-1.5 rounded-xl">
                        <CheckCircle2 size={14} className="text-emerald-700" />
                        <span>Delivery Verified & Rescued</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Multi-Step Pipeline Visual Stepper */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                    Service Progression Lifecycle
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-xs">
                    {STAGES.map((st, idx) => {
                      const isPastOrCurrent = currentStageIndex >= idx;
                      const isCurrent = currentStageIndex === idx;

                      return (
                        <div
                          key={st.key}
                          className={`p-2 rounded-lg border text-center transition-all ${
                            isCurrent
                              ? 'bg-emerald-800 text-white font-bold border-emerald-800 shadow-xs'
                              : isPastOrCurrent
                                ? 'bg-emerald-100 text-emerald-900 border-emerald-200 font-semibold'
                                : 'bg-white text-slate-400 border-slate-200'
                          }`}
                        >
                          <div className="text-[10px] uppercase font-bold flex items-center justify-center gap-1">
                            {isPastOrCurrent && !isCurrent ? <Check size={11} /> : null}
                            <span>{st.label}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Application Information Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-700 pt-1">
                  <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-1">
                    <span className="font-bold text-slate-900 block text-[11px] uppercase tracking-wider">
                      Donor Collection Logistics
                    </span>
                    <div><strong>Donor Phone:</strong> {donation.donorPhone || '+1 (555) 000-0000'}</div>
                    <div><strong>Pickup Address:</strong> {donation.location}</div>
                    {donation.driver && <div><strong>Assigned Driver:</strong> {donation.driver}</div>}
                  </div>

                  <div className="bg-blue-50/50 p-3.5 rounded-xl border border-blue-200 space-y-1 text-blue-950">
                    <span className="font-bold text-blue-950 block text-[11px] uppercase tracking-wider">
                      Shelter Application Specifications
                    </span>
                    <div><strong>Contact:</strong> {app.contactPerson || 'Coordinator'} &bull; {app.receiverPhone || donation.receiverPhone}</div>
                    <div><strong>Beneficiaries:</strong> {app.beneficiaryCount || donation.servings || 10} meals &bull; <strong>Urgency:</strong> {app.urgency || 'Standard'}</div>
                    <div><strong>Destination:</strong> {app.deliveryAddress || 'Shelter Facility'}</div>
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
