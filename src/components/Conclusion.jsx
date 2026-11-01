import React from 'react';
import {
  Leaf,
  Award,
  TrendingUp,
  Truck,
  Cpu,
  ShieldCheck,
  BookOpen,
  ArrowRight,
  HeartHandshake
} from 'lucide-react';

export default function Conclusion({ onNavigate }) {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">

      {/* Header Banner */}
      <div className="bg-white p-8 sm:p-12 rounded-3xl border border-emerald-100 shadow-sm text-center max-w-4xl mx-auto">
        <div className="w-20 h-20 bg-emerald-100 text-emerald-700 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner">
          <Leaf size={42} />
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mb-3">
          Project Evaluation & Future Roadmap
        </h1>
        <p className="text-emerald-700 font-semibold text-base max-w-2xl mx-auto leading-relaxed">
          Evaluating the feasibility, societal impact, and long-term technological vision of the FoodShare platform.
        </p>
      </div>

      {/* Main Content Grid */}
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Card 1: Project Feasibility & Validation */}
        <div className="bg-white p-8 rounded-3xl border border-emerald-100 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-emerald-800 font-bold text-lg">
            <ShieldCheck size={22} className="text-emerald-600" />
            1. Technological Feasibility & Architectural Validation
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">
            The FoodShare web application confirms that a zero-cost, serverless, client-first architecture powered by <strong>IndexedDB</strong> and mirrored via <strong>LocalStorage</strong> is extraordinarily capable of handling local food rescue coordination. Donors, shelters, and administrators interact with a persistent transactional data store directly in the browser, eliminating expensive server hosting requirements while providing instantaneous responsiveness even in areas with fluctuating internet connectivity.
          </p>
          <div className="bg-emerald-50/60 p-5 rounded-2xl border border-emerald-100 text-xs text-emerald-950 space-y-2">
            <div className="font-bold text-emerald-900">Key Architectural Validations:</div>
            <ul className="list-disc pl-5 space-y-1 text-emerald-850">
              <li><strong>Zero-Latency Offline Transactions:</strong> Additions and claims happen in sub-milliseconds without waiting for remote server roundtrips.</li>
              <li><strong>Resilient Dual-Sync:</strong> Changes replicate immediately between IndexedDB and LocalStorage, guaranteeing persistence across tab closures and device reboots.</li>
              <li><strong>Audit Trail Integrity:</strong> Cryptographic activity logging ensures full accountability across donors, NGOs, and platform administrators.</li>
            </ul>
          </div>
        </div>

        {/* Card 2: SDG 2 Alignment & Environmental Returns */}
        <div className="bg-white p-8 rounded-3xl border border-emerald-100 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-emerald-800 font-bold text-lg">
            <Award size={22} className="text-emerald-600" />
            2. United Nations SDG Alignment
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">
            FoodShare operates at the nexus of multiple United Nations Sustainable Development Goals:
          </p>
          <div className="grid sm:grid-cols-3 gap-4 pt-2">
            <div className="bg-amber-50/60 border border-amber-200 p-4 rounded-2xl">
              <span className="text-[10px] font-extrabold uppercase text-amber-800 bg-amber-200/80 px-2 py-0.5 rounded">
                SDG 2: Zero Hunger
              </span>
              <h4 className="font-bold text-gray-900 text-sm mt-2 mb-1">Target 2.1 & 2.2</h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                Directly channel wholesome surplus meals from banquets and markets to vulnerable citizens, reducing caloric deficits.
              </p>
            </div>

            <div className="bg-emerald-50/60 border border-emerald-200 p-4 rounded-2xl">
              <span className="text-[10px] font-extrabold uppercase text-emerald-800 bg-emerald-200/80 px-2 py-0.5 rounded">
                SDG 12: Consumption
              </span>
              <h4 className="font-bold text-gray-900 text-sm mt-2 mb-1">Target 12.3</h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                Halving per capita global food waste at retail and consumer levels by rescuing wholesome food before disposal.
              </p>
            </div>

            <div className="bg-blue-50/60 border border-blue-200 p-4 rounded-2xl">
              <span className="text-[10px] font-extrabold uppercase text-blue-800 bg-blue-200/80 px-2 py-0.5 rounded">
                SDG 13: Climate Action
              </span>
              <h4 className="font-bold text-gray-900 text-sm mt-2 mb-1">Emissions Prevention</h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                Preventing organic decomposition in landfills, reducing methane emissions by an estimated 2.5 kg CO2e per kg of food rescued.
              </p>
            </div>
          </div>
        </div>

        {/* Card 3: Future Scope & Roadmap */}
        <div className="bg-white p-8 rounded-3xl border border-emerald-100 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-emerald-800 font-bold text-lg">
            <TrendingUp size={22} className="text-emerald-600" />
            3. Future Expansion Scope
          </div>
          <div className="grid sm:grid-cols-2 gap-4 pt-1">
            <div className="p-4 rounded-2xl border border-gray-100 bg-gray-50/50 space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-gray-900 text-xs">
                <Truck size={16} className="text-emerald-600" />
                Crowdsourced Volunteer Logistics
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                Integrating a third participant tier for on-demand transport volunteers (like bike couriers or rideshare drivers) to resolve the last-mile transportation bottleneck for resource-constrained shelters.
              </p>
            </div>

            <div className="p-4 rounded-2xl border border-gray-100 bg-gray-50/50 space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-gray-900 text-xs">
                <Cpu size={16} className="text-emerald-600" />
                AI Vision Shelf-Life Verification
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                Employing computer vision models in the browser to analyze photos of donated produce, automatically validating freshness and recommending optimal consume-by thresholds.
              </p>
            </div>
          </div>
        </div>

        {/* Card 4: References & Standards */}
        <div className="bg-white p-8 rounded-3xl border border-emerald-100 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-emerald-800 font-bold text-lg">
            <BookOpen size={22} className="text-emerald-600" />
            4. Authoritative References & Citations
          </div>
          <ul className="space-y-2.5 text-xs text-gray-600">
            <li className="flex items-start gap-2">
              <span className="font-bold text-emerald-600">1.</span>
              <span><strong>FAO (2023):</strong> <em>The State of Food Security and Nutrition in the World</em>. Food and Agriculture Organization of the United Nations, Rome.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-emerald-600">2.</span>
              <span><strong>UNEP (2024):</strong> <em>Food Waste Index Report 2024: Think Eat Save</em>. United Nations Environment Programme, Nairobi.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-emerald-600">3.</span>
              <span><strong>W3C Indexed Database API 3.0:</strong> <em>Transactional client-side database storage standards for modern web applications</em>.</span>
            </li>
          </ul>
        </div>

        {/* Bottom CTA */}
        <div className="bg-gradient-to-r from-emerald-800 to-teal-800 text-white p-8 rounded-3xl text-center space-y-4">
          <h3 className="text-2xl font-extrabold">Ready to explore FoodShare in action?</h3>
          <p className="text-emerald-100 text-xs max-w-lg mx-auto leading-relaxed">
            Test the entire live cycle: add a food item as a donor, claim it from the listings as an NGO, track pickup in the dashboard, and manage or clear database records in the admin panel.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => onNavigate('listings')}
              className="bg-white text-emerald-900 font-bold px-5 py-2.5 rounded-xl text-xs hover:bg-emerald-50 transition-colors flex items-center gap-1.5 shadow-md"
            >
              <span>Explore Food Listings</span>
              <ArrowRight size={14} />
            </button>
            <button
              onClick={() => onNavigate('admin')}
              className="bg-emerald-950/60 border border-emerald-400/40 text-emerald-200 font-bold px-5 py-2.5 rounded-xl text-xs hover:bg-emerald-900 transition-colors"
            >
              Open Admin Control Center
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}

