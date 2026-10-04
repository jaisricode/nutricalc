import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Activity, 
  LayoutDashboard, 
  UserPlus, 
  Users, 
  Calculator, 
  Info, 
  Database,
  Menu,
  X
} from 'lucide-react';
import { useAssessment } from '../context/AssessmentContext.jsx';
import { api } from '../services/api.js';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { resetAssessment } = useAssessment();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [serverOnline, setServerOnline] = useState(null);

  useEffect(() => {
    let isMounted = true;
    api.getHealth()
      .then(() => { if (isMounted) setServerOnline(true); })
      .catch(() => { if (isMounted) setServerOnline(false); });
    return () => { isMounted = false; };
  }, [location.pathname]);

  const navLinks = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'New Assessment', path: '/register', icon: UserPlus, action: () => resetAssessment() },
    { name: 'Patient Records', path: '/patients', icon: Users },
    { name: 'About & Reference', path: '/about', icon: Info },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Clinical System Branding */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-sky-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
              <Activity className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight text-slate-900 font-sans">Nutri<span className="text-brand-600">Calc</span></span>
                <span className="bg-brand-100 text-brand-800 text-[11px] font-semibold px-2 py-0.5 rounded-full border border-brand-200 uppercase tracking-wider">Clinical</span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium hidden sm:block">Nutrition Assessment & Metabolic Calculation Platform</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={link.action}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-brand-50 text-brand-700 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-brand-600' : 'text-slate-400'}`} />
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Area: System Status / Quick Start */}
          <div className="hidden sm:flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-medium text-slate-600">
              <Database className="w-3.5 h-3.5 text-slate-500" />
              <span>Atlas DB</span>
              <span className={`w-2 h-2 rounded-full ${serverOnline === true ? 'bg-emerald-500 animate-pulse' : serverOnline === false ? 'bg-rose-500' : 'bg-amber-400'}`} />
            </div>
            <Link
              to="/register"
              onClick={() => resetAssessment()}
              className="clinical-btn-primary py-2 text-xs"
            >
              <UserPlus className="w-4 h-4" />
              <span>+ New Patient</span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-4 space-y-1 shadow-lg">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => {
                  if (link.action) link.action();
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                  isActive ? 'bg-brand-50 text-brand-700 font-semibold' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-5 h-5 text-brand-600" />
                {link.name}
              </Link>
            );
          })}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500">MongoDB Atlas / API Service:</span>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${serverOnline ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
              {serverOnline ? 'Connected' : 'Offline'}
            </span>
          </div>
        </div>
      )}
    </header>
  );
}
