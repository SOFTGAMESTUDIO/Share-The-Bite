import React from 'react';
import {
  Leaf,
  Target,
  Database,
  Server,
  Layers,
  Users,
  TrendingUp,
  ArrowRight,
  CheckCircle2,
  Globe,
  AlertTriangle,
  Clock,
  ShieldCheck,
  Building2,
  HeartHandshake,
  FileCheck,
  Scale,
  RefreshCw
} from 'lucide-react';

export default function ProjectReport({ onNavigate, stats }) {
  const totalRecords = stats?.total ?? 0;
  const availableCount = stats?.available ?? 0;
  const claimedCount = stats?.claimed ?? 0;
  const deliveredCount = stats?.delivered ?? 0;

  return (
    <article className="space-y-12 max-w-6xl mx-auto text-slate-800">

      {/* SECTION: HERO COMPOSITION */}
      <section
        aria-labelledby="hero-heading"
        className="animate-report-entrance bg-slate-900 text-white rounded-2xl border border-slate-800 shadow-xl p-8 sm:p-12 relative overflow-hidden"
      >
        <div className="grid lg:grid-cols-12 gap-8 items-center">

          {/* Left Column: Heading, Copy, & Actions */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 text-xs font-semibold px-3 py-1.5 rounded-md">
              <Globe size={14} className="text-emerald-400" />
              <span>United Nations SDG 2: Zero Hunger Platform</span>
            </div>

            <h1
              id="hero-heading"
              className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight text-white"
            >
              Bridging Commercial Food Surplus to Local Communities Facing Hunger
            </h1>

            <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl">
              A decentralized client-synchronized web application engineered for hospitality providers, caterers, and food retailers to catalog surplus edible meals directly to verified local shelters, soup kitchens, and non-profit food pantries.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => onNavigate('listings')}
                className="bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white text-sm font-semibold px-5 py-3 rounded-lg transition-colors shadow-sm focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:outline-none flex items-center gap-2"
              >
                <span>Browse Food Listings</span>
                <ArrowRight size={16} />
              </button>

              <button
                type="button"
                onClick={() => onNavigate('donor')}
                className="bg-slate-800 hover:bg-slate-700 active:bg-slate-900 text-slate-100 border border-slate-700 text-sm font-semibold px-5 py-3 rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:outline-none flex items-center gap-2"
              >
                <HeartHandshake size={16} className="text-emerald-400" />
                <span>List Food Donation</span>
              </button>

              <button
                type="button"
                onClick={() => onNavigate('admin')}
                className="text-slate-400 hover:text-white text-xs font-semibold px-3 py-3 rounded-lg transition-colors underline underline-offset-4 focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:outline-none"
              >
                Administrative Console
              </button>
            </div>
          </div>

          {/* Right Column: Architectural Visual Representation */}
          <div className="lg:col-span-5">
            <figure className="bg-slate-950/90 rounded-xl border border-slate-800 p-5 shadow-2xl space-y-4">
              <figcaption className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-3 font-mono">
                <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                  <Database size={13} />
                  <span>CLIENT STORAGE PIPELINE</span>
                </span>
                <span className="text-[11px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
                  IndexedDB active
                </span>
              </figcaption>

              {/* Data Flow Steps */}
              <div className="space-y-3 text-xs">
                <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded bg-emerald-950 text-emerald-400 flex items-center justify-center font-bold text-[11px]">
                      1
                    </div>
                    <div>
                      <div className="font-semibold text-slate-200">Donor Surplus Intake</div>
                      <div className="text-[11px] text-slate-400">Validated items, quantity, expiry time</div>
                    </div>
                  </div>
                  <CheckCircle2 size={15} className="text-emerald-500" />
                </div>

                <div className="bg-slate-900/80 p-3 rounded-lg border border-emerald-900/40 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded bg-blue-950 text-blue-400 flex items-center justify-center font-bold text-[11px]">
                      2
                    </div>
                    <div>
                      <div className="font-semibold text-slate-200">IndexedDB Database</div>
                      <div className="text-[11px] text-slate-400">FoodShareAppDB Object Store & LocalStorage Mirror</div>
                    </div>
                  </div>
                  <RefreshCw size={14} className="text-blue-400 animate-spin" />
                </div>

                <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded bg-amber-950 text-amber-400 flex items-center justify-center font-bold text-[11px]">
                      3
                    </div>
                    <div>
                      <div className="font-semibold text-slate-200">Shelter Claim & Logistics</div>
                      <div className="text-[11px] text-slate-400">Status transitions: Pickup to Delivered</div>
                    </div>
                  </div>
                  <CheckCircle2 size={15} className="text-amber-400" />
                </div>
              </div>

              <div className="pt-2 text-[11px] text-slate-400 flex items-center justify-between border-t border-slate-800/80">
                <span>Database Engine: Transactional</span>
                <span className="font-semibold text-emerald-400">100% Offline Ready</span>
              </div>
            </figure>
          </div>

        </div>
      </section>

      {/* SECTION 1: VERIFIED IMPACT & LIVE TELEMETRY */}
      <section aria-labelledby="metrics-heading" className="animate-report-entrance stagger-1 space-y-4">
        <h2 id="metrics-heading" className="sr-only">Live Operational Metrics</h2>

        <dl className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
            <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center justify-between">
              <span>Total Food Listings</span>
              <Layers size={16} className="text-slate-400" />
            </dt>
            <dd className="text-2xl sm:text-3xl font-bold text-slate-900 mt-2" aria-live="polite">
              {totalRecords}
            </dd>
            <p className="text-xs text-emerald-700 font-medium mt-1">Indexed in local storage</p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
            <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center justify-between">
              <span>Available Now</span>
              <Clock size={16} className="text-blue-500" />
            </dt>
            <dd className="text-2xl sm:text-3xl font-bold text-blue-700 mt-2" aria-live="polite">
              {availableCount}
            </dd>
            <p className="text-xs text-slate-500 mt-1">Ready for pickup</p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
            <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center justify-between">
              <span>In Dispatch</span>
              <TrendingUp size={16} className="text-amber-500" />
            </dt>
            <dd className="text-2xl sm:text-3xl font-bold text-amber-700 mt-2" aria-live="polite">
              {claimedCount}
            </dd>
            <p className="text-xs text-slate-500 mt-1">Claimed by NGO receivers</p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
            <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center justify-between">
              <span>Delivered Meals</span>
              <CheckCircle2 size={16} className="text-emerald-500" />
            </dt>
            <dd className="text-2xl sm:text-3xl font-bold text-emerald-700 mt-2" aria-live="polite">
              {deliveredCount}
            </dd>
            <p className="text-xs text-slate-500 mt-1">Safely handed over</p>
          </div>
        </dl>
      </section>

      {/* SECTION 2: EXECUTIVE SUMMARY & PROBLEM STATEMENT */}
      <section
        aria-labelledby="summary-heading"
        className="animate-report-entrance stagger-2 bg-white p-8 sm:p-10 rounded-2xl border border-slate-200 shadow-xs space-y-6"
      >
        <div className="border-b border-slate-100 pb-4">
          <div className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5 mb-1">
            <Target size={15} />
            <span>Problem Analysis and Strategic Need</span>
          </div>
          <h2 id="summary-heading" className="text-2xl font-bold text-slate-900 tracking-tight">
            The Global Inefficiency: Food Loss Amid Widespread Nutritional Insecurity
          </h2>
        </div>

        <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
          Data published by the Food and Agriculture Organization (FAO) reveals that one-third of all global food production, equivalent to approximately 1.3 billion metric tons, is wasted every year. Concurrently, over 828 million individuals suffer chronic hunger. This imbalance represents a logistical failure in communication and localized distribution rather than an absolute shortage of sustenance.
        </p>

        {/* Structured Problem Breakdown Cards */}
        <div className="grid md:grid-cols-2 gap-6 pt-2">

          <div className="border border-red-100 bg-red-50/40 rounded-xl p-6 space-y-3">
            <div className="flex items-center gap-2 text-red-900 font-bold text-sm">
              <AlertTriangle size={18} className="text-red-600" />
              <span>Critical Operational Bottlenecks</span>
            </div>
            <ul className="space-y-2 text-xs text-slate-700">
              <li className="flex items-start gap-2">
                <span className="text-red-500 font-bold mt-0.5">•</span>
                <span><strong>Tight Perishability Windows:</strong> Commercial banquet and dining surplus becomes unusable within 4 to 24 hours if uncollected.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 font-bold mt-0.5">•</span>
                <span><strong>Coordination Blindspot:</strong> Donors lack real-time digital discovery channels to notify verified emergency relief shelters nearby.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 font-bold mt-0.5">•</span>
                <span><strong>Landfill Methane Emissions:</strong> Organic decomposition in municipal dumps generates greenhouse emissions 28 times more potent than carbon dioxide.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 font-bold mt-0.5">•</span>
                <span><strong>Administrative Friction:</strong> Non-profit staff spend disproportionate hours on telephone coordination without verified audit logs.</span>
              </li>
            </ul>
          </div>

          <div className="border border-emerald-100 bg-emerald-50/40 rounded-xl p-6 space-y-3">
            <div className="flex items-center gap-2 text-emerald-950 font-bold text-sm">
              <CheckCircle2 size={18} className="text-emerald-700" />
              <span>The FoodShare Technological Solution</span>
            </div>
            <ul className="space-y-2 text-xs text-slate-700">
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold mt-0.5">•</span>
                <span><strong>Zero-Cost Client Architecture:</strong> Runs directly within modern web browsers using IndexedDB with LocalStorage synchronization.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold mt-0.5">•</span>
                <span><strong>Rapid Listing Intake:</strong> Kitchen staff catalog meal portions, dietary classifications, and pickup instructions in under 60 seconds.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold mt-0.5">•</span>
                <span><strong>Transparent Status Tracking:</strong> Direct state progression from Available, through Pending Pickup, to Delivered confirmation.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold mt-0.5">•</span>
                <span><strong>Comprehensive Oversight:</strong> Central administration console with full data export, JSON import, and audit trail maintenance.</span>
              </li>
            </ul>
          </div>

        </div>
      </section>

      {/* SECTION 3: TECHNICAL ARCHITECTURE & DATA STORAGE ENGINE */}
      <section
        aria-labelledby="tech-heading"
        className="animate-report-entrance stagger-3 bg-white p-8 sm:p-10 rounded-2xl border border-slate-200 shadow-xs space-y-6"
      >
        <div className="border-b border-slate-100 pb-4">
          <div className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5 mb-1">
            <Server size={15} />
            <span>Systems Engineering and Reliability</span>
          </div>
          <h2 id="tech-heading" className="text-2xl font-bold text-slate-900 tracking-tight">
            Client-Side Database Architecture: IndexedDB and LocalStorage Dual Engine
          </h2>
        </div>

        <p className="text-slate-600 text-sm leading-relaxed">
          FoodShare operates as a resilient, client-synchronized single page application. To eliminate dependencies on centralized server infrastructure while retaining persistent transactional guarantees, the application implements a dual-tier storage strategy.
        </p>

        <div className="grid md:grid-cols-3 gap-6 pt-2">

          <div className="border border-slate-200 rounded-xl p-5 bg-slate-50/50 space-y-2">
            <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold mb-3">
              <Database size={18} />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">IndexedDB Object Store</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Transactional browser database named <code>FoodShareAppDB</code> maintaining structured object stores for food donations, activity logs, users, and settings with indices on status, category, and creation date.
            </p>
          </div>

          <div className="border border-slate-200 rounded-xl p-5 bg-slate-50/50 space-y-2">
            <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center font-bold mb-3">
              <RefreshCw size={18} />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Real-Time LocalStorage Mirror</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every data mutation is synchronously mirrored to browser LocalStorage. This guarantees instantaneous failover if privacy settings or private browsing sandboxes restrict IndexedDB capabilities.
            </p>
          </div>

          <div className="border border-slate-200 rounded-xl p-5 bg-slate-50/50 space-y-2">
            <div className="w-9 h-9 rounded-lg bg-purple-100 text-purple-800 flex items-center justify-center font-bold mb-3">
              <FileCheck size={18} />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Data Portability and Backup</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Built-in JSON backup export and import methods allow administrators to download complete database snapshots, transfer data across testing environments, or reset to verified seed data with one click.
            </p>
          </div>

        </div>
      </section>

      {/* SECTION 4: STAKEHOLDER WORKFLOW */}
      <section
        aria-labelledby="workflow-heading"
        className="animate-report-entrance stagger-4 bg-white p-8 sm:p-10 rounded-2xl border border-slate-200 shadow-xs space-y-6"
      >
        <div className="border-b border-slate-100 pb-4">
          <div className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5 mb-1">
            <Users size={15} />
            <span>Operational Roles and Responsibilities</span>
          </div>
          <h2 id="workflow-heading" className="text-2xl font-bold text-slate-900 tracking-tight">
            Coordinated Multi-Stakeholder Redistribution Workflow
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">

          <div className="border border-slate-200 rounded-xl p-6 space-y-3 bg-white">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
              Role 1: Donors
            </span>
            <h3 className="font-bold text-base text-slate-900">Hospitality and Retailers</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Commercial restaurants, caterers, bakeries, corporate cafeterias, and wholesale markets with surplus consumable stock.
            </p>
            <div className="text-xs font-medium text-slate-700 bg-slate-50 p-2.5 rounded border border-slate-100">
              <strong>Action:</strong> Rapid listing input with dietary specifications and pickup window.
            </div>
          </div>

          <div className="border border-slate-200 rounded-xl p-6 space-y-3 bg-white">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-800 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
              Role 2: Receivers
            </span>
            <h3 className="font-bold text-base text-slate-900">Community Shelters and NGOs</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Registered charity kitchens, emergency shelters, food banks, and humanitarian feeding programs serving populations in need.
            </p>
            <div className="text-xs font-medium text-slate-700 bg-slate-50 p-2.5 rounded border border-slate-100">
              <strong>Action:</strong> Real-time reservation, volunteer dispatch, and delivery receipt confirmation.
            </div>
          </div>

          <div className="border border-slate-200 rounded-xl p-6 space-y-3 bg-white">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-100">
              Role 3: Administrators
            </span>
            <h3 className="font-bold text-base text-slate-900">System Supervisors</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Platform moderators overseeing database integrity, verifying participating entities, and reviewing audit trails.
            </p>
            <div className="text-xs font-medium text-slate-700 bg-slate-50 p-2.5 rounded border border-slate-100">
              <strong>Action:</strong> Audit review, category oversight, data backup, and emergency status overrides.
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 5: UNITED NATIONS SDG ALIGNMENT */}
      <section
        aria-labelledby="sdg-heading"
        className="animate-report-entrance stagger-4 bg-white p-8 sm:p-10 rounded-2xl border border-slate-200 shadow-xs space-y-6"
      >
        <div className="border-b border-slate-100 pb-4">
          <div className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5 mb-1">
            <Scale size={15} />
            <span>Sustainable Development Targets</span>
          </div>
          <h2 id="sdg-heading" className="text-2xl font-bold text-slate-900 tracking-tight">
            Alignment with UN Sustainable Development Goals (SDG 2 and SDG 12)
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">

          <div className="border border-emerald-100 bg-emerald-50/30 rounded-xl p-6 space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-900 bg-emerald-100 px-2 py-0.5 rounded">
                Target 2.1
              </span>
              <h3 className="font-bold text-slate-900 text-sm">Universal Access to Safe Food</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              By 2030, end hunger and ensure access by all people, in particular the poor and people in vulnerable situations, to safe, nutritious and sufficient food all year round. FoodShare contributes directly by channeling high-grade surplus meals from commercial dining rooms to vulnerable populations.
            </p>
          </div>

          <div className="border border-emerald-100 bg-emerald-50/30 rounded-xl p-6 space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-900 bg-emerald-100 px-2 py-0.5 rounded">
                Target 12.3
              </span>
              <h3 className="font-bold text-slate-900 text-sm">Halving Global Food Waste</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              By 2030, halve per capita global food waste at the retail and consumer levels and reduce food losses along production and supply chains. FoodShare prevents retail and commercial food from entering municipal waste streams, preserving resources expended during agriculture and transport.
            </p>
          </div>

        </div>
      </section>

      {/* FOOTER CALL TO ACTION */}
      <footer className="animate-report-entrance stagger-4 bg-slate-900 text-white p-8 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <h2 className="text-xl font-bold text-white">Experience the Live Prototype</h2>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            Evaluate the donor intake form, explore available listings, simulate shelter claiming, and inspect data persistence in the administrative console.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          <button
            type="button"
            onClick={() => onNavigate('listings')}
            className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-4 py-2.5 rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:outline-none"
          >
            Open Marketplace
          </button>
          <button
            type="button"
            onClick={() => onNavigate('admin')}
            className="border border-slate-700 hover:bg-slate-800 text-slate-200 text-xs font-semibold px-4 py-2.5 rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:outline-none"
          >
            System Console
          </button>
        </div>
      </footer>

    </article>
  );
}
