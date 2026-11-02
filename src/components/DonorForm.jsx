import React, { useState, useEffect } from 'react';
import { 
  HeartHandshake, 
  MapPin, 
  Clock, 
  Package, 
  Sparkles, 
  Phone, 
  Mail, 
  Check, 
  ArrowRight,
  Info,
  Utensils,
  Apple,
  Wheat,
  Boxes,
  UserCheck,
  Building2,
  AlertCircle
} from 'lucide-react';
import { getCategoryIcon } from '../utils/categoryIcons';

const CATEGORIES = [
  "Cooked Meals",
  "Fresh Produce",
  "Bakery",
  "Dairy",
  "Packaged & Canned",
  "Beverages"
];

const DONOR_TYPES = [
  "Commercial Restaurant",
  "Hotel & Banquet Kitchen",
  "Catering & Event Services",
  "Supermarket / Grocery Retail",
  "Bakery & Confectionery",
  "Corporate / College Dining",
  "Farm / Agriculture Wholesale",
  "Individual Citizen / Household"
];

const QUICK_TEMPLATES = [
  {
    name: "Banquet Catering",
    category: "Cooked Meals",
    item: "Buffet Spread: Steamed Basmati Rice, Lentil Dal and Roasted Vegetables",
    quantity: "35 portions",
    servings: 35,
    donor: "Grand Horizon Hotel Kitchen",
    donorType: "Hotel & Banquet Kitchen",
    donorPhone: "+1 (555) 777-3322",
    donorEmail: "chef@grandhorizon.com",
    location: "450 Ocean Boulevard, Kitchen Loading Bay 2",
    city: "Metro Central",
    dietary: "Vegetarian and Halal",
    notes: "Packed in sanitized food-grade steel containers. Warm and ready for pickup.",
    hoursExpiry: 6
  },
  {
    name: "Bakery Assortment",
    category: "Bakery",
    item: "Fresh Multi-grain Loaves and Croissants",
    quantity: "25 loaves and 30 croissants",
    servings: 50,
    donor: "Golden Crust Bakery",
    donorType: "Bakery & Confectionery",
    donorPhone: "+1 (555) 333-8899",
    donorEmail: "contact@goldencrust.com",
    location: "12 Baker Street, Shop 4",
    city: "North Ward",
    dietary: "Vegetarian",
    notes: "Freshly baked earlier this morning. Sealed in clean paper bags.",
    hoursExpiry: 24
  },
  {
    name: "Farm Fresh Produce",
    category: "Fresh Produce",
    item: "Organic Apples, Pears and Root Vegetables",
    quantity: "30 kg assortment",
    servings: 75,
    donor: "Sun Valley Farmers Market",
    donorType: "Farm / Agriculture Wholesale",
    donorPhone: "+1 (555) 444-1122",
    donorEmail: "farm@sunvalley.org",
    location: "Wholesale Market Gate 5, Stall 18",
    city: "West District",
    dietary: "100% Vegan",
    notes: "Slight aesthetic blemishes, crisp and rich in nutrition.",
    hoursExpiry: 72
  },
  {
    name: "Supermarket Pantry",
    category: "Packaged & Canned",
    item: "Canned Soups, Pasta, and Oats Boxes",
    quantity: "50 packaged units",
    servings: 50,
    donor: "Cornerstone Superstore",
    donorType: "Supermarket / Grocery Retail",
    donorPhone: "+1 (555) 999-5566",
    donorEmail: "manager@cornerstores.com",
    location: "88 Main Boulevard, Customer Service Desk",
    city: "South District",
    dietary: "Shelf-Stable Non-Perishable",
    notes: "Overstock inventory, all factory seals intact.",
    hoursExpiry: 240
  }
];

export default function DonorForm({ onSubmit, currentUser }) {
  const defaultExpiry = new Date(Date.now() + 24 * 3600 * 1000).toISOString().slice(0, 16);

  const [formData, setFormData] = useState({
    item: '',
    category: 'Cooked Meals',
    quantity: '',
    servings: 20,
    donor: currentUser?.organization || currentUser?.name || '',
    donorType: 'Commercial Restaurant',
    donorPhone: currentUser?.phone || '',
    donorEmail: currentUser?.email || '',
    location: '',
    city: 'Metro Central',
    expiry: defaultExpiry,
    dietary: 'Vegetarian',
    notes: ''
  });

  // Keep synced if user switches persona
  useEffect(() => {
    if (currentUser) {
      setFormData(prev => ({
        ...prev,
        donor: prev.donor || currentUser.organization || currentUser.name || '',
        donorEmail: prev.donorEmail || currentUser.email || '',
        donorPhone: prev.donorPhone || currentUser.phone || ''
      }));
    }
  }, [currentUser]);

  const applyTemplate = (template) => {
    const calculatedExpiry = new Date(Date.now() + template.hoursExpiry * 3600 * 1000).toISOString().slice(0, 16);
    setFormData({
      ...formData,
      item: template.item,
      category: template.category,
      quantity: template.quantity,
      servings: template.servings,
      donor: template.donor,
      donorType: template.donorType || 'Commercial Restaurant',
      donorPhone: template.donorPhone,
      donorEmail: template.donorEmail,
      location: template.location,
      city: template.city,
      dietary: template.dietary,
      notes: template.notes,
      expiry: calculatedExpiry
    });
  };

  const handleExpiryShortcut = (hours) => {
    const date = new Date(Date.now() + hours * 3600 * 1000).toISOString().slice(0, 16);
    setFormData({ ...formData, expiry: date });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.item.trim() || !formData.donor.trim()) return;
    onSubmit(formData);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-sm text-center relative overflow-hidden">
        
        {/* Open Access Pill */}
        <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-800 border border-emerald-200 px-3.5 py-1.5 rounded-full text-xs font-bold mb-4 shadow-xs">
          <Sparkles size={14} className="text-emerald-600" />
          <span>Open Public Intake: Donate Food Without An Account</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          List Surplus Food For Immediate Relief Rescue
        </h1>
        <p className="text-slate-600 mt-2 max-w-2xl mx-auto text-sm leading-relaxed">
          Anyone can donate wholesome meals, fresh produce, or pantry surplus. No sign-up or login is required. Every submission is saved directly to Firebase Cloud Firestore and made available to verified relief shelters.
        </p>

        {/* Quick Fill Templates */}
        <div className="mt-6 pt-6 border-t border-slate-100">
          <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
            <Sparkles size={14} className="text-amber-500" />
            <span>1-Click Sample Intake Templates</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {QUICK_TEMPLATES.map((tmpl) => (
              <button
                key={tmpl.name}
                type="button"
                onClick={() => applyTemplate(tmpl)}
                className="bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-slate-800 hover:text-emerald-900 text-xs font-semibold px-3.5 py-2 rounded-xl transition-all flex items-center gap-2 shadow-2xs hover:scale-102"
              >
                {getCategoryIcon(tmpl.category, 14)}
                <span>{tmpl.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Intake Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-sm space-y-6">
        
        {/* Authenticated user prefill banner if logged in */}
        {currentUser && (
          <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-emerald-950">
            <div className="flex items-center gap-2.5">
              <UserCheck size={18} className="text-emerald-700 shrink-0" />
              <span>
                Signed in as <strong>{currentUser.name}</strong> ({currentUser.role} &bull; {currentUser.organization}). Contact details auto-linked.
              </span>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full border border-emerald-300 self-start sm:self-auto">
              Verified Session
            </span>
          </div>
        )}

        {/* Section 1: Food Details */}
        <div>
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider pb-3 border-b border-slate-100 flex items-center gap-2">
            <Package size={17} className="text-emerald-700" />
            <span>1. Food Item Specifications</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-4">
            
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Food Item Description <span className="text-rose-500">*</span>
              </label>
              <input
                required
                type="text"
                placeholder="e.g. 40 Trays of Freshly Cooked Rice, Dal & Roasted Vegetables"
                value={formData.item}
                onChange={(e) => setFormData({ ...formData, item: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none text-sm font-medium transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Food Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none text-sm font-medium transition-colors bg-white"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Quantity Description <span className="text-rose-500">*</span>
              </label>
              <input
                required
                type="text"
                placeholder="e.g. 40 portions, or 20 kg assortment"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none text-sm font-medium transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Estimated Meal Portions (For SDG Impact Tracking)
              </label>
              <input
                type="number"
                min="1"
                max="5000"
                value={formData.servings}
                onChange={(e) => setFormData({ ...formData, servings: Number(e.target.value) })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none text-sm font-medium transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Dietary & Allergen Specifications
              </label>
              <input
                type="text"
                placeholder="e.g. Vegetarian, Halal, Nut-Free, 100% Vegan"
                value={formData.dietary}
                onChange={(e) => setFormData({ ...formData, dietary: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none text-sm font-medium transition-colors"
              />
            </div>

            <div className="md:col-span-2">
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Expiration / Consume By Window <span className="text-rose-500">*</span>
                </label>
                <div className="flex gap-2 text-xs font-medium text-emerald-800">
                  <button type="button" onClick={() => handleExpiryShortcut(6)} className="hover:underline">+6 Hours</button>
                  <span>•</span>
                  <button type="button" onClick={() => handleExpiryShortcut(24)} className="hover:underline">+24 Hours</button>
                  <span>•</span>
                  <button type="button" onClick={() => handleExpiryShortcut(72)} className="hover:underline">+3 Days</button>
                </div>
              </div>
              <input
                required
                type="datetime-local"
                value={formData.expiry}
                onChange={(e) => setFormData({ ...formData, expiry: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none text-sm font-medium transition-colors"
              />
            </div>

          </div>
        </div>

        {/* Section 2: Donor & Location Details */}
        <div className="pt-4">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider pb-3 border-b border-slate-100 flex items-center gap-2">
            <MapPin size={17} className="text-emerald-700" />
            <span>2. Donor Identity & Pickup Logistics</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-4">
            
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Donor / Business / Individual Name <span className="text-rose-500">*</span>
              </label>
              <input
                required
                type="text"
                placeholder="e.g. Grand Horizon Hotel Kitchen or Jane Doe"
                value={formData.donor}
                onChange={(e) => setFormData({ ...formData, donor: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none text-sm font-medium transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Donor Entity Type
              </label>
              <select
                value={formData.donorType}
                onChange={(e) => setFormData({ ...formData, donorType: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none text-sm font-medium transition-colors bg-white"
              >
                {DONOR_TYPES.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Coordinator Phone Number <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Phone size={15} className="absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  required
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={formData.donorPhone}
                  onChange={(e) => setFormData({ ...formData, donorPhone: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none text-sm font-medium transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Email Address (Optional)
              </label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type="email"
                  placeholder="chef@grandhorizon.com"
                  value={formData.donorEmail}
                  onChange={(e) => setFormData({ ...formData, donorEmail: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none text-sm font-medium transition-colors"
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Exact Pickup Address & Loading Bay Instructions <span className="text-rose-500">*</span>
              </label>
              <input
                required
                type="text"
                placeholder="Street address, building floor, service gate, or pickup instructions"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none text-sm font-medium transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                City / Municipal Region
              </label>
              <input
                type="text"
                placeholder="e.g. Metro Central, West District"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none text-sm font-medium transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Food Storage & Handling Notes
              </label>
              <input
                type="text"
                placeholder="e.g. Refrigerated transport required (2-4°C) or Keep warm"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none text-sm font-medium transition-colors"
              />
            </div>

          </div>
        </div>

        {/* Submit Actions */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <Info size={14} className="text-emerald-700 shrink-0" />
            <span>Listing is committed directly to Firebase Cloud Firestore and open for relief claims.</span>
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto bg-emerald-700 hover:bg-emerald-600 active:bg-emerald-800 text-white font-bold px-7 py-3 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-sm"
          >
            <HeartHandshake size={17} />
            <span>Publish Food Listing</span>
            <ArrowRight size={15} />
          </button>
        </div>

      </form>

    </div>
  );
}
