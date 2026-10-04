import React from 'react';
import { ShieldCheck, HeartPulse, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 mt-16 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-slate-500">
          
          <div className="flex items-center gap-2">
            <HeartPulse className="w-4 h-4 text-brand-600" />
            <span className="font-semibold text-slate-700">NutriCalc v1.0.0</span>
            <span>—</span>
            <span>Clinical Nutrition Assessment & Research Platform</span>
          </div>

          <div className="flex items-center gap-6">
            <Link to="/about" className="hover:text-brand-600 transition-colors flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Assessment Guidelines (GLIM, SGA, MNA, MUST)</span>
            </Link>
            <div className="flex items-center gap-1 text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Clinical Decision Support Tool</span>
            </div>
          </div>

        </div>

        <div className="mt-4 pt-4 border-t border-slate-100 text-[11px] text-slate-400 text-center leading-relaxed">
          <strong className="font-semibold text-slate-500">Medical Research Disclaimer:</strong> NutriCalc provides calculations and standardized screening algorithms to assist qualified clinical nutritionists and dietitians. It is designed for clinical decision-support and academic research workflows and should be utilized in conjunction with comprehensive clinical judgment.
        </div>
      </div>
    </footer>
  );
}
