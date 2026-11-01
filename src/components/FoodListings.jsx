import React, { useState, useMemo } from 'react';
import { 
  Package, 
  MapPin, 
  Clock, 
  Search, 
  Filter, 
  CheckCircle, 
  Phone, 
  Mail, 
  HeartHandshake, 
  Eye, 
  X, 
  ArrowRight,
  Sparkles,
  Building2
} from 'lucide-react';
import { getCategoryIcon, CategoryBadge } from '../utils/categoryIcons';

const CATEGORIES = ["All", "Cooked Meals", "Fresh Produce", "Bakery", "Dairy", "Packaged & Canned"];

export default function FoodListings({ donations = [], onClaim, onNavigate, currentUser = null }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  
  // Claim modal state
  const [claimingItem, setClaimingItem] = useState(null);
  const [claimForm, setClaimForm] = useState({
    receiverName: currentUser?.organization || currentUser?.name || 'Hope Foundation Shelter',
    receiverPhone: currentUser?.phone || '+1 (555) 888-1212',
    receiverNotes: 'Volunteer van dispatched for immediate pickup.'
  });

  // Details modal state
  const [detailItem, setDetailItem] = useState(null);

  // Filter listings
  const filteredDonations = useMemo(() => {
    return donations.filter((d) => {
      const matchSearch = 
        d.item?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.donor?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.dietary?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchCategory = selectedCategory === 'All' || d.category === selectedCategory;
      const matchStatus = selectedStatus === 'All' || d.status === selectedStatus;

      return matchSearch && matchCategory && matchStatus;
    });
  }, [donations, searchTerm, selectedCategory, selectedStatus]);

  const availableCount = donations.filter(d => d.status === 'Available').length;

  const handleOpenClaim = (item) => {
    setClaimingItem(item);
    if (currentUser) {
      setClaimForm(prev => ({
        ...prev,
        receiverName: currentUser.organization || currentUser.name || prev.receiverName,
        receiverPhone: currentUser.phone || prev.receiverPhone
      }));
    }
  };

  const handleConfirmClaim = (e) => {
    e.preventDefault();
    if (!claimingItem) return;
    onClaim(claimingItem.id, claimForm);
    setClaimingItem(null);
  };

  const calculateHoursLeft = (expiryDateStr) => {
    if (!expiryDateStr) return null;
    const diff = new Date(expiryDateStr) - new Date();
    const hours = Math.round(diff / (1000 * 3600));
    return hours;
  };

  return (
    <div className="space-y-6">
      
      {/* Title & Stats Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-emerald-800 text-xs font-semibold uppercase tracking-wider mb-2">
            <Package size={15} />
            <span>Marketplace Directory</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Surplus Food Listings
          </h1>
          <p className="text-slate-600 text-sm mt-1">
            Browse wholesome surplus meals from local catering, hotels, and markets ready for immediate rescue.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-emerald-50 border border-emerald-200 px-4 py-2 rounded-lg text-emerald-800 font-bold text-xs flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
            <span>{availableCount} Available Now</span>
          </div>
          <button
            onClick={() => onNavigate('donor')}
            className="bg-emerald-700 hover:bg-emerald-600 text-white font-semibold text-xs px-4 py-2.5 rounded-lg shadow-xs transition-colors focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:outline-none flex items-center gap-1.5"
          >
            <span>+ List Food</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by food name, donor, location, or dietary tag..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 text-xs outline-none transition-colors"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 text-xs font-semibold"
              >
                Clear
              </button>
            )}
          </div>

          {/* Status Select */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 whitespace-nowrap hidden sm:inline">Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2.5 rounded-lg border border-slate-300 bg-white text-xs font-medium focus:border-emerald-600 outline-none"
            >
              <option value="All">All Statuses</option>
              <option value="Available">Available Only</option>
              <option value="Pending Pickup">Pending Pickup</option>
              <option value="Picked Up">Picked Up</option>
              <option value="Delivered">Delivered</option>
            </select>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <span className="font-semibold text-slate-400 mr-1 flex items-center gap-1">
            <Filter size={13} /> Categories:
          </span>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors whitespace-nowrap focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:outline-none ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Listings */}
      {filteredDonations.length === 0 ? (
        <div className="bg-white rounded-2xl p-16 text-center border border-dashed border-slate-300">
          <Package size={44} className="mx-auto text-slate-300 mb-3" />
          <h2 className="text-base font-bold text-slate-800">No food listings found</h2>
          <p className="text-slate-500 text-xs mt-1 max-w-sm mx-auto">
            Try adjusting your search criteria, selecting another category, or list new food donations.
          </p>
          <button
            onClick={() => { setSearchTerm(''); setSelectedCategory('All'); setSelectedStatus('All'); }}
            className="mt-4 px-4 py-2 bg-slate-100 text-slate-700 font-semibold rounded-lg text-xs hover:bg-slate-200 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDonations.map((donation) => {
            const hoursLeft = calculateHoursLeft(donation.expiry);
            const isAvailable = donation.status === 'Available';
            const isPending = donation.status === 'Pending Pickup';
            const isInTransit = donation.status === 'Picked Up';
            const isDelivered = donation.status === 'Delivered';

            return (
              <div
                key={donation.id}
                className="bg-white rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between overflow-hidden"
              >
                {/* Card Top Badge Bar */}
                <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center shadow-2xs">
                      {getCategoryIcon(donation.category, 16)}
                    </div>
                    <span className="text-xs font-semibold text-slate-700">
                      {donation.category}
                    </span>
                  </div>

                  {isAvailable && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                      Available
                    </span>
                  )}
                  {isPending && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
                      Claimed / Pending
                    </span>
                  )}
                  {isInTransit && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">
                      In Transit
                    </span>
                  )}
                  {isDelivered && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                      <CheckCircle size={12} className="text-emerald-700" /> Delivered
                    </span>
                  )}
                </div>

                {/* Card Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h2 className="font-bold text-slate-900 text-base leading-snug">
                      {donation.item}
                    </h2>
                    <p className="text-xs font-medium text-emerald-800 mt-1 flex items-center gap-1">
                      <Building2 size={13} />
                      <span>{donation.donor}</span>
                    </p>

                    {/* Metadata details */}
                    <div className="space-y-2 mt-4 text-xs text-slate-600">
                      <div className="flex items-center gap-2">
                        <Package size={14} className="text-slate-400 flex-shrink-0" />
                        <span><strong>Quantity:</strong> {donation.quantity} ({donation.servings || 10} portions)</span>
                      </div>

                      <div className="flex items-start gap-2">
                        <MapPin size={14} className="text-slate-400 flex-shrink-0 mt-0.5" />
                        <span className="line-clamp-1"><strong>Location:</strong> {donation.location}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Clock size={14} className="text-slate-400 flex-shrink-0" />
                        <span>
                          <strong>Expiry:</strong> {new Date(donation.expiry).toLocaleDateString()} {new Date(donation.expiry).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          {hoursLeft !== null && (
                            <span className={`ml-1 font-semibold ${hoursLeft < 12 ? 'text-rose-600' : 'text-slate-700'}`}>
                              ({hoursLeft > 0 ? `${hoursLeft}h remaining` : 'Expired'})
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

                  {/* Action Buttons */}
                  <div className="pt-4 border-t border-slate-100 flex items-center gap-2">
                    <button
                      onClick={() => setDetailItem(donation)}
                      className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:outline-none"
                      title="Inspect Listing Details"
                    >
                      <Eye size={17} />
                    </button>

                    {isAvailable ? (
                      <button
                        onClick={() => handleOpenClaim(donation)}
                        className="flex-1 bg-emerald-700 hover:bg-emerald-600 active:bg-emerald-800 text-white font-semibold py-2 px-4 rounded-lg text-xs transition-colors flex items-center justify-center gap-1.5 focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:outline-none"
                      >
                        <HeartHandshake size={15} />
                        <span>Claim for Relief</span>
                      </button>
                    ) : (
                      <div className="flex-1 text-center py-2 px-3 bg-slate-50 rounded-lg text-xs font-semibold text-slate-500 border border-slate-100">
                        {isPending ? `Claimed: ${donation.receiver || 'NGO'}` : isInTransit ? 'Volunteer En Route' : 'Delivered to Shelter'}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Claim Donation Modal */}
      {claimingItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-xl border border-slate-200 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <HeartHandshake size={18} />
                </div>
                <div>
                  <h2 className="font-bold text-slate-900 text-base">Claim Food Donation</h2>
                  <p className="text-xs text-slate-500">Coordinate volunteer pickup with donor</p>
                </div>
              </div>
              <button
                onClick={() => setClaimingItem(null)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:outline-none"
              >
                <X size={18} />
              </button>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
              <div className="font-bold text-slate-900 text-sm">{claimingItem.item}</div>
              <div className="text-xs text-emerald-800 font-medium">Offered by: {claimingItem.donor}</div>
              <div className="text-xs text-slate-600 pt-0.5">Location: {claimingItem.location}</div>
            </div>

            <form onSubmit={handleConfirmClaim} className="space-y-4">
              {currentUser && (
                <div className="bg-emerald-50 text-emerald-950 p-2.5 rounded-lg border border-emerald-200/80 text-[11px] flex items-center justify-between">
                  <span>Pre-filled from session: <strong>{currentUser.name}</strong> ({currentUser.organization || currentUser.role})</span>
                  <span className="font-bold text-emerald-800 uppercase text-[10px]">Verified</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Recipient Organization / Shelter Name <span className="text-rose-500">*</span>
                </label>
                <input
                  required
                  type="text"
                  value={claimForm.receiverName}
                  onChange={(e) => setClaimForm({ ...claimForm, receiverName: e.target.value })}
                  placeholder="e.g. Hope Shelter, Community Kitchen"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Volunteer Driver Phone Contact <span className="text-rose-500">*</span>
                </label>
                <input
                  required
                  type="tel"
                  value={claimForm.receiverPhone}
                  onChange={(e) => setClaimForm({ ...claimForm, receiverPhone: e.target.value })}
                  placeholder="+1 (555) 000-0000"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Dispatch Notes and Estimated Arrival
                </label>
                <textarea
                  rows={2}
                  value={claimForm.receiverNotes}
                  onChange={(e) => setClaimForm({ ...claimForm, receiverNotes: e.target.value })}
                  placeholder="e.g. Van en route. Estimated pickup in 30 minutes."
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setClaimingItem(null)}
                  className="flex-1 py-2.5 border border-slate-300 font-semibold text-slate-700 rounded-lg text-xs hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-700 hover:bg-emerald-600 active:bg-emerald-800 text-white font-semibold rounded-lg text-xs transition-colors flex items-center justify-center gap-1.5 focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:outline-none"
                >
                  <span>Confirm Claim</span>
                  <ArrowRight size={15} />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Details View Modal */}
      {detailItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-xl border border-slate-200 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center">
                  {getCategoryIcon(detailItem.category, 18)}
                </div>
                <div>
                  <h2 className="font-bold text-slate-900 text-base leading-tight">{detailItem.item}</h2>
                  <span className="text-xs font-semibold text-emerald-800">Record ID: #{detailItem.id}</span>
                </div>
              </div>
              <button
                onClick={() => setDetailItem(null)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:outline-none"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div>
                  <span className="font-semibold text-slate-500 uppercase tracking-wider block text-[10px]">Category</span>
                  <span className="font-bold text-slate-800 text-xs">{detailItem.category}</span>
                </div>
                <div>
                  <span className="font-semibold text-slate-500 uppercase tracking-wider block text-[10px]">Quantity</span>
                  <span className="font-bold text-slate-800 text-xs">{detailItem.quantity} ({detailItem.servings} portions)</span>
                </div>
                <div>
                  <span className="font-semibold text-slate-500 uppercase tracking-wider block text-[10px]">Status</span>
                  <span className="font-bold text-emerald-800 text-xs">{detailItem.status}</span>
                </div>
                <div>
                  <span className="font-semibold text-slate-500 uppercase tracking-wider block text-[10px]">Dietary Info</span>
                  <span className="font-bold text-slate-800 text-xs">{detailItem.dietary || 'Standard Wholesome'}</span>
                </div>
              </div>

              <div className="border border-slate-200 rounded-xl p-4 space-y-2">
                <div className="font-bold text-slate-900">Donor and Pickup Location</div>
                <div className="text-slate-700 font-medium">{detailItem.donor}</div>
                <div className="flex items-start gap-1.5 text-slate-600">
                  <MapPin size={14} className="text-emerald-700 flex-shrink-0 mt-0.5" />
                  <span>{detailItem.location}</span>
                </div>
                {detailItem.donorPhone && (
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <Phone size={14} className="text-emerald-700" />
                    <span>{detailItem.donorPhone}</span>
                  </div>
                )}
                {detailItem.donorEmail && (
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <Mail size={14} className="text-emerald-700" />
                    <span>{detailItem.donorEmail}</span>
                  </div>
                )}
              </div>

              {detailItem.notes && (
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-slate-800">
                  <span className="font-bold block mb-1">Handling and Transport Notes:</span>
                  <span>{detailItem.notes}</span>
                </div>
              )}

              {detailItem.receiver && (
                <div className="bg-blue-50/60 p-3.5 rounded-xl border border-blue-200 text-blue-950">
                  <span className="font-bold block mb-1">Claimed Receiver Details:</span>
                  <div><strong>Shelter:</strong> {detailItem.receiver}</div>
                  {detailItem.receiverPhone && <div><strong>Driver Contact:</strong> {detailItem.receiverPhone}</div>}
                  {detailItem.receiverNotes && <div className="mt-1 text-slate-600">{detailItem.receiverNotes}</div>}
                </div>
              )}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setDetailItem(null)}
                className="px-5 py-2 bg-slate-100 hover:bg-slate-200 font-semibold text-slate-700 rounded-lg text-xs transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
