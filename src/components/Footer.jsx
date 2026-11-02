import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, HeartHandshake, ShieldCheck, Database, Cloud, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-emerald-950 text-emerald-100 border-t border-emerald-900 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand & Mission */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-900 border border-emerald-600/50 flex items-center justify-center text-emerald-300">
                <Leaf className="h-4 w-4" />
              </div>
              <span className="font-black text-xl text-white tracking-tight">Share The Bite</span>
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-emerald-800 text-emerald-300 border border-emerald-600/50">
                SDG-2 Initiative
              </span>
            </div>
            <p className="text-xs text-emerald-200/80 leading-relaxed max-w-md">
              A community food-sharing platform dedicated to UN Sustainable Development Goal 2: Zero Hunger. 
              Connecting restaurants, caterers, and grocers with frontline relief shelters to eliminate food waste and nourish local communities.
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-emerald-300">
              <span className="flex items-center gap-1 bg-emerald-900/60 px-2.5 py-1 rounded-lg border border-emerald-800">
                <Cloud size={12} className="text-emerald-400" />
                Firebase Cloud Firestore
              </span>
              <span className="flex items-center gap-1 bg-emerald-900/60 px-2.5 py-1 rounded-lg border border-emerald-800">
                <Database size={12} className="text-emerald-400" />
                IndexedDB & LocalStorage
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-emerald-400 mb-3">Navigation</h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/" className="text-emerald-200/80 hover:text-white transition-colors">Home Platform</Link>
              </li>
              <li>
                <Link to="/products" className="text-emerald-200/80 hover:text-white transition-colors">All Food Listings</Link>
              </li>
              <li>
                <Link to="/donate" className="text-emerald-200/80 hover:text-white transition-colors">+ Donate Surplus (No Account)</Link>
              </li>
              <li>
                <Link to="/requests" className="text-emerald-200/80 hover:text-white transition-colors">Relief Distribution Pipeline</Link>
              </li>
              <li>
                <Link to="/admin" className="text-emerald-200/80 hover:text-white transition-colors">Admin Console (PRO)</Link>
              </li>
            </ul>
          </div>

          {/* Platform & Impact */}
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-emerald-400 mb-3">Documentation</h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/report" className="text-emerald-200/80 hover:text-white transition-colors">SDG-2 Project Report</Link>
              </li>
              <li>
                <Link to="/evaluation" className="text-emerald-200/80 hover:text-white transition-colors">Evaluation & Methodology</Link>
              </li>
              <li>
                <Link to="/login" className="text-emerald-200/80 hover:text-white transition-colors">Admin Gateway (Firebase Auth)</Link>
              </li>
              <li className="pt-2">
                <a
                  href="https://sdgs.un.org/goals/goal2"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] text-amber-300 hover:text-amber-200"
                >
                  <span>UN Zero Hunger Target 2.1</span>
                  <ExternalLink size={10} />
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 mt-8 border-t border-emerald-900/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-emerald-400/80">
          <p>&copy; {new Date().getFullYear()} Share The Bite &bull; Built with React 19, React Router DOM &amp; Firebase modular v13.</p>
          <p className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Triple-Engine Storage Online (Firestore + IndexedDB + LocalStorage)</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
