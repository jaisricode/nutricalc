import React from 'react';
import { Calculator, Info } from 'lucide-react';

export default function FormulaCard({ title, formulaName, formulaString, calculatedValue, unit, breakdown, category, note }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-clinical flex flex-col justify-between hover:border-brand-300 transition-all">
      <div>
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">{formulaName}</span>
            <h4 className="text-base font-bold text-slate-900">{title}</h4>
          </div>
          <div className="w-8 h-8 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center flex-shrink-0">
            <Calculator className="w-4 h-4" />
          </div>
        </div>

        {/* Display calculated metric */}
        <div className="my-3 flex items-baseline gap-2">
          <span className="text-3xl font-extrabold tracking-tight text-slate-900 font-mono">
            {calculatedValue !== undefined && calculatedValue !== null && calculatedValue > 0 ? calculatedValue : '—'}
          </span>
          <span className="text-sm font-semibold text-slate-500">{unit}</span>
          {category && (
            <span className="ml-auto text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-medium border border-slate-200">
              {category}
            </span>
          )}
        </div>

        {/* Official Formula Definition */}
        <div className="mt-2 text-xs text-slate-500 font-mono bg-slate-50 p-2.5 rounded-md border border-slate-200/80">
          <span className="text-slate-400 select-none block text-[10px] uppercase font-sans font-semibold mb-0.5">Formula:</span>
          {formulaString}
        </div>
      </div>

      {/* Step-by-Step Calculation Breakdown for Research Auditing */}
      {breakdown && (
        <div className="mt-4 pt-3 border-t border-slate-100">
          <div className="flex items-center gap-1 text-[11px] font-semibold text-brand-700 mb-1">
            <Info className="w-3.5 h-3.5" />
            <span>Calculation Audit Breakdown:</span>
          </div>
          <p className="text-xs font-mono text-slate-700 bg-brand-50/50 p-2 rounded border border-brand-100/80 leading-relaxed overflow-x-auto">
            {breakdown}
          </p>
          {note && <p className="text-[11px] text-slate-500 mt-1 italic">{note}</p>}
        </div>
      )}
    </div>
  );
}
