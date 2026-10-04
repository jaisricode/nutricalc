import React from 'react';
import { ShieldCheck, AlertTriangle, AlertOctagon, CheckCircle2, Info } from 'lucide-react';

export default function ClinicalBadge({ classification, severity, score, risk, size = 'md' }) {
  const text = classification || severity || risk || 'Normal';
  const lower = text.toLowerCase();

  let colorClasses = 'bg-slate-100 text-slate-700 border-slate-300';
  let Icon = Info;

  if (lower.includes('severe') || lower.includes('high risk') || lower.includes('malnourished') || lower.includes('sga-c')) {
    colorClasses = 'bg-rose-50 text-rose-700 border-rose-200 ring-1 ring-rose-300/40';
    Icon = AlertOctagon;
  } else if (lower.includes('moderate') || lower.includes('medium risk') || lower.includes('at risk') || lower.includes('sga-b') || lower.includes('stage 1')) {
    colorClasses = 'bg-amber-50 text-amber-700 border-amber-200 ring-1 ring-amber-300/40';
    Icon = AlertTriangle;
  } else if (lower.includes('normal') || lower.includes('low risk') || lower.includes('well nourished') || lower.includes('sga-a') || lower.includes('no glim')) {
    colorClasses = 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-1 ring-emerald-300/40';
    Icon = CheckCircle2;
  }

  const sizeClasses = size === 'lg' 
    ? 'px-4 py-2 text-sm font-bold gap-2' 
    : size === 'sm' 
    ? 'px-2.5 py-0.5 text-xs font-semibold gap-1' 
    : 'px-3 py-1 text-xs font-semibold gap-1.5';

  return (
    <span className={`inline-flex items-center rounded-full border shadow-2xs ${colorClasses} ${sizeClasses}`}>
      <Icon className={size === 'lg' ? 'w-4 h-4' : 'w-3.5 h-3.5'} />
      <span>{text}</span>
      {score !== undefined && score !== null && (
        <span className="ml-1 opacity-80 font-mono text-[11px]">({score})</span>
      )}
    </span>
  );
}
