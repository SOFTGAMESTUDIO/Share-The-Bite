import React, { useState, useMemo, useEffect } from 'react';
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
  Building2,
  Users,
  Truck,
  AlertCircle,
  FileText,
  CheckCircle2
} from 'lucide-react';
import { getCategoryIcon } from '../utils/categoryIcons';

const CATEGORIES = ["All", "Cooked Meals", "Fresh Produce", "Bakery", "Dairy", "Packaged & Canned"];

const RECEIVER_TYPES = [
  "Homeless Shelter",
  "Soup Kitchen / Community Dining",
  "Food Pantry / Food Bank",
  "Orphanage / Youth Shelter",
  "Elder Care & Senior Living",
  "Low-Income Family Relief",
  "Individual / Household in Need",
  "Disaster / Crisis Relief"
];

const VEHICLE_TYPES = [
  "Volunteer Van / SUV Available",
  "Personal Car / Hatchback",
  "Share The Bite Logistics Fleet Requested",
  "Walking / Handcart (Local Vicinity)"
];

const URGENCY_LEVELS = [
  "Immediate (Within 1-2 Hours)",
  "Today - For Lunch Service",
  "Today - For Dinner Service",
  "Tomorrow Morning Pickup"
];

export default function FoodListings({ 
  donations = [], 
  onApplyRequest, 
  onNavigate, 
  currentUser = null,
  initialRequestItem = null 
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  
  // Receiver Application modal state
  const [applyingItem, setApplyingItem] = useState(initialRequestItem || null);

  useEffect(() => {
    if (initialRequestItem) {
      setApplyingItem(initialRequestItem);
    }
  }, [initialRequestItem]);
  const [applicationForm, setApplicationForm] = useState({
    receiverName: currentUser?.organization || currentUser?.name || 'Hope Community Relief Center',
    receiverType: 'Homeless Shelter',
    contactPerson: currentUser?.name || 'Maria Santos',
    receiverPhone: currentUser?.phone || '+1 (555) 765-4321',
    receiverEmail: currentUser?.email || 'relief@hopeshare.org',
    deliveryAddress: '742 Evergreen Terrace, Downtown District',
    beneficiaryCount: 45,
    vehicleType: 'Volunteer Van / SUV Available',
    urgency: 'Today - For Dinner Service',
    receiverNotes: 'We operate a registered soup kitchen with cold-chain storage. 45 residents awaiting evening meal service.'
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
        d.dietary?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.receiver?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchCategory = selectedCategory === 'All' || d.category === selectedCategory;
      const matchStatus = selectedStatus === 'All' || d.status === selectedStatus;

      return matchSearch && matchCategory && matchStatus;
    });
  }, [donations, searchTerm, selectedCategory, selectedStatus]);

  const availableCount = donations.filter(d => d.status === 'Available').length;
  const requestedCount = donations.filter(d => d.status === 'Requested').length;

  const handleOpenApplication = (item) => {
    setApplyingItem(item);
    if (currentUser) {
      setApplicationForm(prev => ({
        ...prev,
        receiverName: currentUser.organization || currentUser.name || prev.receiverName,
        contactPerson: currentUser.name || prev.contactPerson,
        receiverPhone: currentUser.phone || prev.receiverPhone,
        receiverEmail: currentUser.email || prev.receiverEmail
      }));
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setApplicationForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitApplication = (e) => {
    e.preventDefault();
    if (!applyingItem) return;
    if (onApplyRequest) {
      onApplyRequest(applyingItem.id, applicationForm);
    }
    setApplyingItem(null);
  };

  const calculateHoursLeft = (expiryDateStr) => {
    if (!expiryDateStr) return null;
    const diff = new Date(expiryDateStr) - new Date();
    const hours = Math.round(diff / (1000 * 3600));
    return hours;
  };

  // Helper for status badge styling
  const renderStatusBadge = (status) => {
    switch (status) {
      case 'Available':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
            Available to Request
          </span>
        );
      case 'Requested':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span>
            Requested &bull; Admin Review
          </span>
        );
      case 'Request Accepted':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-bold bg-teal-100 text-teal-900 border border-teal-300">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-600"></span>
            Approved &bull; Awaiting Pickup
          </span>
        );
      case 'Out for Pickup':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-bold bg-indigo-100 text-indigo-900 border border-indigo-300">
            <Truck size={12} className="text-indigo-700" />
            Out for Pickup
          </span>
        );
      case 'Picked Up':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-bold bg-blue-100 text-blue-900 border border-blue-300">
            <Package size={12} className="text-blue-700" />
            Picked Up &bull; Hub
          </span>
        );
      case 'Out for Delivery':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-bold bg-purple-100 text-purple-900 border border-purple-300">
            <Truck size={12} className="text-purple-700" />
            Out for Delivery
          </span>
        );
      case 'Delivered':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-bold bg-slate-100 text-slate-800 border border-slate-300">
            <CheckCircle2 size={12} className="text-emerald-700" />
            Delivered &bull; Rescued
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-slate-700">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">

      {/* Title & Stats Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2">
            <Package size={15} />
            <span>SDG-2 Food Rescue Directory</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            All Products & Surplus Food Listings
          </h1>
          <p className="text-slate-600 text-sm mt-1 max-w-2xl">
            Anyone can donate surplus food without an account. Certified charities, shelters, and individuals can review real-time listings and submit an official food request application.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="bg-emerald-50 border border-emerald-200 px-3.5 py-2 rounded-xl text-emerald-900 font-bold text-xs flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
            <span>{availableCount} Available to Request</span>
          </div>
          <button
            onClick={() => onNavigate('donor')}
            className="bg-emerald-800 hover:bg-emerald-700 active:bg-emerald-900 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs transition-colors focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:outline-none flex items-center gap-1.5"
          >
            <span>+ Donate Food (Public)</span>
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
              placeholder="Search by food name, donor, recipient shelter, city, or dietary tag..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 text-xs outline-none transition-colors"
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
              className="px-3 py-2.5 rounded-xl border border-slate-300 bg-white text-xs font-medium focus:border-emerald-600 outline-none"
            >
              <option value="All">All Statuses ({donations.length})</option>
              <option value="Available">Available ({availableCount})</option>
              <option value="Requested">Requested ({requestedCount})</option>
              <option value="Request Accepted">Request Accepted</option>
              <option value="Out for Pickup">Out for Pickup</option>
              <option value="Picked Up">Picked Up</option>
              <option value="Out for Delivery">Out for Delivery</option>
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
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors whitespace-nowrap focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:outline-none ${selectedCategory === cat
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
          <h2 className="text-base font-bold text-slate-800">No matching food listings found</h2>
          <p className="text-slate-500 text-xs mt-1 max-w-sm mx-auto">
            Try adjusting your search query, resetting the category filter, or list new food without an account.
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

                  {renderStatusBadge(donation.status)}
                </div>

                {/* Card Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h2 className="font-bold text-slate-900 text-base leading-snug">
                      {donation.item}
                    </h2>
                    <p className="text-xs font-semibold text-emerald-800 mt-1 flex items-center gap-1">
                      <Building2 size={13} />
                      <span>{donation.donor}</span>
                      {donation.donorType && (
                        <span className="text-slate-400 font-normal">({donation.donorType})</span>
                      )}
                    </p>

                    {/* Metadata details */}
                    <div className="space-y-2 mt-4 text-xs text-slate-600">
                      <div className="flex items-center gap-2">
                        <Package size={14} className="text-slate-400 flex-shrink-0" />
                        <span><strong>Quantity:</strong> {donation.quantity} &bull; <strong className="text-emerald-800">{donation.servings || 10} portions</strong></span>
                      </div>

                      <div className="flex items-start gap-2">
                        <MapPin size={14} className="text-slate-400 flex-shrink-0 mt-0.5" />
                        <span className="line-clamp-1"><strong>Pickup:</strong> {donation.location}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Clock size={14} className="text-slate-400 flex-shrink-0" />
                        <span>
                          <strong>Expiry:</strong> {new Date(donation.expiry).toLocaleDateString()} {new Date(donation.expiry).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          {hoursLeft !== null && (
                            <span className={`ml-1 font-semibold ${hoursLeft < 12 ? 'text-rose-600' : 'text-slate-700'}`}>
                              ({hoursLeft > 0 ? `${hoursLeft}h left` : 'Expired'})
                            </span>
                          )}
                        </span>
                      </div>

                      {donation.dietary && (
                        <div className="pt-1 flex flex-wrap gap-1">
                          <span className="inline-block bg-slate-100 text-slate-700 text-[11px] font-medium px-2 py-0.5 rounded border border-slate-200">
                            {donation.dietary}
                          </span>
                        </div>
                      )}

                      {/* If claimed / requested, show receiver info snippet */}
                      {donation.receiver && (
                        <div className="mt-2.5 p-2 bg-slate-50 rounded-xl border border-slate-200/80 text-[11px] space-y-0.5">
                          <div className="font-semibold text-slate-700 flex items-center gap-1">
                            <Users size={12} className="text-emerald-700" />
                            <span>Requested by: <strong>{donation.receiver}</strong></span>
                          </div>
                          {donation.receiverApplication?.beneficiaryCount && (
                            <div className="text-slate-500">
                              Estimated Beneficiaries: <strong>{donation.receiverApplication.beneficiaryCount} people</strong>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-4 border-t border-slate-100 flex items-center gap-2">
                    <button
                      onClick={() => setDetailItem(donation)}
                      className="p-2.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:outline-none"
                      title="Inspect Listing and Request Details"
                    >
                      <Eye size={16} />
                    </button>

                    {isAvailable ? (
                      <button
                        onClick={() => handleOpenApplication(donation)}
                        className="flex-1 bg-emerald-800 hover:bg-emerald-700 active:bg-emerald-900 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-colors flex items-center justify-center gap-2 shadow-xs focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:outline-none"
                      >
                        <HeartHandshake size={15} />
                        <span>Request Food</span>
                      </button>
                    ) : (
                      <div className="flex-1 py-2 px-3 bg-slate-50 rounded-xl text-xs font-semibold text-slate-600 border border-slate-200 text-center">
                        {donation.status === 'Requested' ? 'Application Under Review' :
                          donation.status === 'Request Accepted' ? 'Approved &bull; Preparing Pickup' :
                            donation.status === 'Out for Pickup' ? 'Driver En Route to Donor' :
                              donation.status === 'Picked Up' ? 'Collected &bull; In Transit' :
                                donation.status === 'Out for Delivery' ? 'En Route to Receiver' : 'Delivered to Shelter'}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Receiver Food Request Application Modal */}
      {applyingItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <HeartHandshake size={20} />
                </div>
                <div>
                  <h2 className="font-bold text-slate-900 text-base">Food Relief Request Application</h2>
                  <p className="text-xs text-slate-500">Apply to receive this food donation for relief distribution</p>
                </div>
              </div>
              <button
                onClick={() => setApplyingItem(null)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:outline-none"
              >
                <X size={18} />
              </button>
            </div>

            {/* Donor Offer Summary Box */}
            <div className="bg-emerald-50/60 border border-emerald-200 rounded-2xl p-4 text-xs space-y-1.5 text-slate-700">
              <div className="font-bold text-slate-900 text-sm">{applyingItem.item}</div>
              <div className="text-emerald-900 font-semibold">
                Offered by: {applyingItem.donor} {applyingItem.donorType && `(${applyingItem.donorType})`}
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-slate-600 pt-0.5">
                <span><strong>Quantity:</strong> {applyingItem.quantity} ({applyingItem.servings || 10} portions)</span>
                <span>&bull;</span>
                <span><strong>Pickup Area:</strong> {applyingItem.location}</span>
              </div>
            </div>

            {/* Application Form */}
            <form onSubmit={handleSubmitApplication} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Receiver / Organization Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    required
                    type="text"
                    name="receiverName"
                    value={applicationForm.receiverName}
                    onChange={handleFormChange}
                    placeholder="e.g. Hope Shelter, Community Kitchen, St. Jude Pantry"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Receiver Type <span className="text-rose-500">*</span>
                  </label>
                  <select
                    name="receiverType"
                    value={applicationForm.receiverType}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs bg-white focus:border-emerald-600 outline-none font-medium"
                  >
                    {RECEIVER_TYPES.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Contact Person Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    required
                    type="text"
                    name="contactPerson"
                    value={applicationForm.contactPerson}
                    onChange={handleFormChange}
                    placeholder="e.g. Sarah Jenkins"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Phone Contact <span className="text-rose-500">*</span>
                  </label>
                  <input
                    required
                    type="tel"
                    name="receiverPhone"
                    value={applicationForm.receiverPhone}
                    onChange={handleFormChange}
                    placeholder="+1 (555) 000-0000"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="receiverEmail"
                    value={applicationForm.receiverEmail}
                    onChange={handleFormChange}
                    placeholder="coordinator@shelter.org"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Delivery / Distribution Address <span className="text-rose-500">*</span>
                  </label>
                  <input
                    required
                    type="text"
                    name="deliveryAddress"
                    value={applicationForm.deliveryAddress}
                    onChange={handleFormChange}
                    placeholder="Street address or designated drop-off center"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Beneficiaries to Feed <span className="text-rose-500">*</span>
                  </label>
                  <input
                    required
                    type="number"
                    min="1"
                    name="beneficiaryCount"
                    value={applicationForm.beneficiaryCount}
                    onChange={handleFormChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Urgency & Timing <span className="text-rose-500">*</span>
                  </label>
                  <select
                    name="urgency"
                    value={applicationForm.urgency}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs bg-white focus:border-emerald-600 outline-none font-medium"
                  >
                    {URGENCY_LEVELS.map(u => (
                      <option key={u} value={u}>{u}</option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Logistics / Vehicle Mode
                  </label>
                  <select
                    name="vehicleType"
                    value={applicationForm.vehicleType}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs bg-white focus:border-emerald-600 outline-none font-medium"
                  >
                    {VEHICLE_TYPES.map(v => (
                      <option key={v} value={v}>{v}</option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Storage Facilities & Special Notes
                  </label>
                  <textarea
                    rows={2}
                    name="receiverNotes"
                    value={applicationForm.receiverNotes}
                    onChange={handleFormChange}
                    placeholder="e.g. Cold storage available, dietary constraints, arrival instructions"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none"
                  />
                </div>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-[11px] text-slate-600 flex items-center gap-2">
                <AlertCircle size={15} className="text-emerald-700 flex-shrink-0" />
                <span>Submitting sends your request to the Central Admin Console for immediate review, approval, and logistics coordination.</span>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setApplyingItem(null)}
                  className="flex-1 py-2.5 border border-slate-300 font-semibold text-slate-700 rounded-xl text-xs hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-800 hover:bg-emerald-700 active:bg-emerald-900 text-white font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-2 shadow-xs focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:outline-none"
                >
                  <span>Submit Relief Request</span>
                  <ArrowRight size={15} />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Details View Modal */}
      {detailItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center">
                  {getCategoryIcon(detailItem.category, 20)}
                </div>
                <div>
                  <h2 className="font-bold text-slate-900 text-base leading-tight">{detailItem.item}</h2>
                  <span className="text-xs font-bold text-emerald-800">Record ID: #{detailItem.id}</span>
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
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div>
                  <span className="font-semibold text-slate-500 uppercase tracking-wider block text-[10px]">Category</span>
                  <span className="font-bold text-slate-800 text-xs">{detailItem.category}</span>
                </div>
                <div>
                  <span className="font-semibold text-slate-500 uppercase tracking-wider block text-[10px]">Quantity</span>
                  <span className="font-bold text-slate-800 text-xs">{detailItem.quantity} ({detailItem.servings} portions)</span>
                </div>
                <div>
                  <span className="font-semibold text-slate-500 uppercase tracking-wider block text-[10px]">Current Status</span>
                  <span className="font-bold text-emerald-800 text-xs">{detailItem.status}</span>
                </div>
                <div>
                  <span className="font-semibold text-slate-500 uppercase tracking-wider block text-[10px]">Dietary Info</span>
                  <span className="font-bold text-slate-800 text-xs">{detailItem.dietary || 'Standard Wholesome'}</span>
                </div>
              </div>

              {/* Side 1: Donor Details */}
              <div className="border border-slate-200 rounded-2xl p-4 space-y-2">
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Building2 size={15} className="text-emerald-700" />
                  <span>Donor Offer Information (Public Listing)</span>
                </div>
                <div className="text-slate-800 font-semibold">{detailItem.donor} {detailItem.donorType && `(${detailItem.donorType})`}</div>
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
                {detailItem.notes && (
                  <div className="mt-2 bg-slate-50 p-2.5 rounded-xl text-slate-700 border border-slate-200">
                    <strong>Donor Notes:</strong> {detailItem.notes}
                  </div>
                )}
              </div>

              {/* Side 2: Receiver Application Details (if submitted) */}
              {detailItem.receiverApplication ? (
                <div className="border border-blue-200 bg-blue-50/40 rounded-2xl p-4 space-y-2 text-slate-800">
                  <div className="font-bold text-blue-950 flex items-center gap-1.5">
                    <Users size={15} className="text-blue-700" />
                    <span>Receiver Request Application (Submitted)</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                    <div><strong>Recipient:</strong> {detailItem.receiverApplication.receiverName}</div>
                    <div><strong>Type:</strong> {detailItem.receiverApplication.receiverType}</div>
                    <div><strong>Contact:</strong> {detailItem.receiverApplication.contactPerson}</div>
                    <div><strong>Phone:</strong> {detailItem.receiverApplication.receiverPhone}</div>
                    <div><strong>Beneficiaries:</strong> {detailItem.receiverApplication.beneficiaryCount} meals</div>
                    <div><strong>Urgency:</strong> {detailItem.receiverApplication.urgency}</div>
                    <div className="col-span-2"><strong>Drop-off Address:</strong> {detailItem.receiverApplication.deliveryAddress}</div>
                    <div className="col-span-2"><strong>Logistics:</strong> {detailItem.receiverApplication.vehicleType}</div>
                  </div>
                  {detailItem.receiverApplication.receiverNotes && (
                    <div className="mt-2 bg-white/80 p-2.5 rounded-xl border border-blue-200 text-blue-950">
                      <strong>Receiver Application Notes:</strong> {detailItem.receiverApplication.receiverNotes}
                    </div>
                  )}
                </div>
              ) : detailItem.receiver && (
                <div className="border border-slate-200 bg-slate-50 rounded-2xl p-4 space-y-1 text-slate-700">
                  <div className="font-bold text-slate-900">Claimed Receiver:</div>
                  <div>{detailItem.receiver} &bull; {detailItem.receiverPhone}</div>
                </div>
              )}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setDetailItem(null)}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 font-semibold text-slate-700 rounded-xl text-xs transition-colors"
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
