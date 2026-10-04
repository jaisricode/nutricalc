import React from 'react';
import { 
  X, 
  User, 
  ClipboardCheck, 
  Calculator, 
  Flame, 
  History, 
  Printer, 
  Calendar,
  Building2,
  FileText
} from 'lucide-react';
import ClinicalBadge from '../components/ClinicalBadge.jsx';

export default function PatientDetailModal({ patient, isOpen, onClose, onEdit }) {
  if (!isOpen || !patient) return null;

  const { patientDetails, screening, formulas, clinicalNotes, metadata, createdAt } = patient;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto animate-fade-in">
      <div className="bg-white rounded-2xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto space-y-6 animate-scale-up">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-200 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-700 flex items-center justify-center font-bold text-lg">
              {patientDetails?.name ? patientDetails.name.charAt(0) : 'P'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-slate-900">{patientDetails?.name}</h2>
                {screening?.selected && screening?.result && (
                  <ClinicalBadge
                    classification={screening.result.classification}
                    severity={screening.result.severity}
                    risk={screening.result.risk}
                    score={screening.result.score}
                    size="sm"
                  />
                )}
              </div>
              <p className="text-xs text-slate-500 font-mono mt-0.5">
                Record ID: {patient._id} • Registered: {new Date(createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
              title="Print"
            >
              <Printer className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Patient Demographics */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-slate-500 block">IP Number:</span>
            <strong className="font-mono text-slate-900">{patientDetails?.ipNo || '—'}</strong>
          </div>
          <div>
            <span className="text-slate-500 block">Age / Gender:</span>
            <strong className="text-slate-900">{patientDetails?.age} yrs / {patientDetails?.gender}</strong>
          </div>
          <div>
            <span className="text-slate-500 block">Weight / Height:</span>
            <strong className="text-slate-900 font-mono">{patientDetails?.weight} kg / {patientDetails?.height} cm</strong>
          </div>
          <div>
            <span className="text-slate-500 block">Location:</span>
            <strong className="text-slate-900">{patientDetails?.district}, {patientDetails?.state} ({patientDetails?.pincode})</strong>
          </div>
        </div>

        {/* Screening Details & Raw Answers */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <ClipboardCheck className="w-4 h-4 text-brand-600" />
            <span>Screening Assessment: {screening?.selected ? screening.tool : 'None'}</span>
          </h3>

          {screening?.selected && screening?.result ? (
            <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3 text-xs">
              <div className="flex justify-between items-center bg-slate-50 p-3 rounded-lg">
                <span className="font-bold text-slate-800">Result Classification:</span>
                <span className="font-extrabold text-brand-800">{screening.result.classification}</span>
              </div>

              {/* Raw Data Accordion / Display */}
              <div className="space-y-1">
                <span className="font-semibold text-slate-600 text-[11px]">Assessment Responses & Clinical Metrics:</span>
                <pre className="bg-slate-900 text-slate-200 p-3 rounded-lg text-[11px] font-mono overflow-x-auto max-h-48">
                  {JSON.stringify(screening.assessmentData || {}, null, 2)}
                </pre>
              </div>
            </div>
          ) : (
            <div className="text-xs text-slate-400 italic bg-slate-50 p-3 rounded-lg">
              No malnutrition screening performed for this record.
            </div>
          )}
        </div>

        {/* Formulas & Calculations */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <Calculator className="w-4 h-4 text-emerald-600" />
            <span>Formulas & Caloric Requirements</span>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-500 block">BMI:</span>
              <strong className="font-mono text-sm text-slate-900">{formulas?.bmi} kg/m²</strong>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-500 block">IBW:</span>
              <strong className="font-mono text-sm text-slate-900">{formulas?.ibw} kg</strong>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-500 block">ABW:</span>
              <strong className="font-mono text-sm text-slate-900">{formulas?.abw} kg</strong>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-500 block">BMR:</span>
              <strong className="font-mono text-sm text-slate-900">{formulas?.bmr} kcal/d</strong>
            </div>
          </div>

          <div className="bg-slate-900 text-white p-4 rounded-xl space-y-2 text-xs">
            <div className="flex justify-between items-center border-b border-slate-700 pb-2">
              <span>Activity: <strong>{formulas?.physicalActivity?.level} ({formulas?.physicalActivity?.factor})</strong></span>
              <span>Injury: <strong>{formulas?.injury?.condition} ({formulas?.injury?.factor})</strong></span>
            </div>
            <div className="flex justify-between items-baseline pt-1">
              <span className="font-mono text-sky-300">Total Energy Expenditure (TEE):</span>
              <span className="text-2xl font-bold font-mono text-sky-300">{formulas?.tee} kcal/day</span>
            </div>
            {formulas?.breakdowns?.tee && (
              <div className="text-[11px] font-mono text-slate-400 pt-1">
                Audit: {formulas.breakdowns.tee}
              </div>
            )}
          </div>
        </div>

        {/* Clinical Notes & Audit Trail */}
        {clinicalNotes && (
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Dietitian Consultation Notes:</span>
            <div className="text-xs text-slate-700 bg-amber-50/60 p-3 rounded-lg border border-amber-100 leading-relaxed">
              {clinicalNotes}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
          <button
            onClick={() => {
              onClose();
              if (onEdit) onEdit(patient);
            }}
            className="clinical-btn-outline-brand text-xs py-2 px-4"
          >
            <span>Edit / Recalculate</span>
          </button>

          <button
            onClick={onClose}
            className="clinical-btn-primary text-xs py-2 px-4"
          >
            <span>Close</span>
          </button>
        </div>

      </div>
    </div>
  );
}
