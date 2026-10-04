import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  FileText, 
  Save, 
  Printer, 
  UserPlus, 
  Users, 
  CheckCircle2, 
  AlertCircle, 
  Activity, 
  Calculator, 
  Flame, 
  ClipboardCheck,
  ShieldCheck,
  Building2,
  Calendar,
  Sparkles,
  Database
} from 'lucide-react';
import { useAssessment } from '../context/AssessmentContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { api } from '../services/api.js';
import ClinicalBadge from '../components/ClinicalBadge.jsx';

export default function FinalResult() {
  const navigate = useNavigate();
  const { 
    patientDetails, 
    screening, 
    formulas, 
    clinicalNotes, 
    setClinicalNotes,
    activeRecordId,
    resetAssessment 
  } = useAssessment();
  const { success, error } = useToast();

  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [savedId, setSavedId] = useState(activeRecordId);

  const handleSaveToMongoDB = async () => {
    if (!patientDetails.name) {
      error('Patient details are missing. Please complete patient registration.');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        patientDetails,
        screening,
        formulas,
        clinicalNotes,
        assessor: 'Clinical Nutritionist'
      };

      let res;
      if (savedId) {
        res = await api.updatePatient(savedId, payload);
      } else {
        res = await api.createPatient(payload);
      }

      if (res.success) {
        setSavedSuccess(true);
        if (res.data?._id) setSavedId(res.data._id);
        success(res.message || 'Complete clinical record saved to MongoDB Atlas successfully!');
      }
    } catch (err) {
      error(`Save failed: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleStartNew = () => {
    resetAssessment();
    navigate('/register');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Action Bar (No-Print) */}
      <div className="no-print bg-white rounded-2xl border border-slate-200 p-4 shadow-clinical flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-brand-600" />
          <span className="font-bold text-sm text-slate-800">Final Assessment Report</span>
          {savedSuccess && (
            <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
              <CheckCircle2 className="w-3 h-3" /> Saved in Database
            </span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handlePrint}
            className="clinical-btn-secondary py-2 px-3.5 text-xs"
            title="Print or export as PDF"
          >
            <Printer className="w-4 h-4" />
            <span>Print / PDF</span>
          </button>

          <button
            onClick={handleSaveToMongoDB}
            disabled={saving}
            className="clinical-btn-primary py-2 px-4 text-xs font-bold"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving to Atlas...' : savedSuccess ? 'Update Record' : 'Save to MongoDB'}</span>
          </button>

          <button
            onClick={handleStartNew}
            className="clinical-btn-outline-brand py-2 px-3 text-xs"
          >
            <UserPlus className="w-4 h-4" />
            <span>New Patient</span>
          </button>
        </div>
      </div>

      {/* MASTER CLINICAL ASSESSMENT REPORT DOCUMENT */}
      <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 shadow-clinical space-y-8 print:border-none print:shadow-none print:p-0">
        
        {/* Report Document Header */}
        <div className="border-b-2 border-slate-900 pb-6 flex flex-col sm:flex-row sm:items-start justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black tracking-tight text-slate-900 font-sans">
                Nutri<span className="text-brand-600">Calc</span>
              </span>
              <span className="bg-slate-900 text-white text-[10px] font-bold px-2 py-0.5 rounded tracking-wider uppercase">
                Official Report
              </span>
            </div>
            <h1 className="text-lg font-bold text-slate-800 font-sans">
              Patient Nutrition Assessment & Metabolic Report
            </h1>
            <p className="text-xs text-slate-500 font-mono">
              Generated on {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>

          <div className="text-left sm:text-right text-xs text-slate-600 space-y-0.5">
            <div><strong>Clinical Protocol:</strong> Standardized Nutrition Care</div>
            <div><strong>Assessor:</strong> Clinical Nutritionist</div>
            {savedId && <div className="font-mono text-slate-400">Record ID: {savedId.substring(0, 12)}...</div>}
          </div>
        </div>

        {/* PATIENT DEMOGRAPHICS & ANTHROPOMETRY */}
        <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono">
            Patient Demographics & Physical Parameters
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-slate-500 block">Patient Name:</span>
              <strong className="text-slate-900 text-sm font-bold">{patientDetails.name || '—'}</strong>
            </div>

            <div>
              <span className="text-slate-500 block">IP / Inpatient Number:</span>
              <strong className="text-slate-900 font-mono">{patientDetails.ipNo || '—'}</strong>
            </div>

            <div>
              <span className="text-slate-500 block">Age / Gender:</span>
              <strong className="text-slate-900">{patientDetails.age || '—'} yrs / {patientDetails.gender || '—'}</strong>
            </div>

            <div>
              <span className="text-slate-500 block">Weight / Height:</span>
              <strong className="text-slate-900 font-mono">{patientDetails.weight || '—'} kg / {patientDetails.height || '—'} cm</strong>
            </div>

            <div className="col-span-2 sm:col-span-4 pt-2 border-t border-slate-200 flex flex-wrap items-center gap-6 text-slate-600 text-[11px]">
              <span><strong>District:</strong> {patientDetails.district || '—'}</span>
              <span><strong>State:</strong> {patientDetails.state || '—'}</span>
              <span><strong>Pincode:</strong> {patientDetails.pincode || '—'}</span>
            </div>
          </div>
        </div>

        {/* SECTION 1: SCREENING RESULT */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <ClipboardCheck className="w-5 h-5 text-brand-600" />
              <span>Section 1: Malnutrition Screening & Assessment</span>
            </h2>

            {screening?.selected && screening?.result && (
              <ClinicalBadge
                classification={screening.result.classification}
                severity={screening.result.severity}
                risk={screening.result.risk}
                score={screening.result.score}
              />
            )}
          </div>

          {screening?.selected && screening?.result ? (
            <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4 text-xs">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="text-slate-500">Assessment Tool Used:</span>{' '}
                  <strong className="text-brand-700 font-bold text-sm ml-1 font-mono">{screening.tool}</strong>
                </div>
                <div className="font-semibold text-slate-800">
                  Diagnosis / Finding: <span className="text-slate-900 font-bold">{screening.result.classification}</span>
                </div>
              </div>

              {/* Tool specific presentation */}
              {screening.tool === 'GLIM' && screening.result.criteria && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-lg border border-slate-200">
                  <div className="space-y-1.5">
                    <strong className="text-slate-900 block font-bold">Phenotypic Criteria:</strong>
                    <div className="text-slate-700">Weight Loss: {screening.result.criteria.phenotypic.weightLoss.positive ? `✓ Positive (${screening.result.criteria.phenotypic.weightLoss.stage})` : '○ Negative'}</div>
                    <div className="text-slate-700">Low BMI: {screening.result.criteria.phenotypic.lowBMI.positive ? `✓ Positive (${screening.result.criteria.phenotypic.lowBMI.stage})` : '○ Within Cutoff'}</div>
                    <div className="text-slate-700">Muscle Mass: {screening.result.criteria.phenotypic.reducedMuscleMass.positive ? `✓ Positive (${screening.result.criteria.phenotypic.reducedMuscleMass.method})` : '○ Normal'}</div>
                  </div>
                  <div className="space-y-1.5">
                    <strong className="text-slate-900 block font-bold">Etiologic Criteria:</strong>
                    <div className="text-slate-700">Reduced Intake / GI: {screening.result.criteria.etiologic.reducedIntake.positive ? '✓ Positive' : '○ Adequate'}</div>
                    <div className="text-slate-700">Disease Burden / Inflammation: {screening.result.criteria.etiologic.diseaseBurden.positive ? '✓ Positive' : '○ None'}</div>
                    {screening.result.severity && <div className="text-rose-700 font-bold pt-1">Severity: {screening.result.severity}</div>}
                  </div>
                </div>
              )}

              {screening.tool === 'SGA' && (
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-2">
                  <div><strong>Overall Qualitative Clinical Rating:</strong> <span className="font-bold text-teal-800 text-sm">{screening.result.score} ({screening.result.classification})</span></div>
                  <p className="text-slate-600">{screening.result.description}</p>
                </div>
              )}

              {screening.tool === 'MNA' && (
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <span className="text-slate-500">Total MNA Score:</span>{' '}
                    <strong className="font-mono text-purple-800 text-base">{screening.result.score} / 14</strong>
                  </div>
                  <div className="text-slate-700 font-medium">
                    Status: <strong>{screening.result.classification}</strong>
                  </div>
                </div>
              )}

              {screening.tool === 'MUST' && (
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-2">
                  <div className="flex justify-between items-center">
                    <span>Overall MUST Score: <strong className="font-mono text-amber-900 text-base">{screening.result.score}</strong></span>
                    <span>Risk Category: <strong className="font-bold text-amber-800">{screening.result.risk}</strong></span>
                  </div>
                  {screening.result.management?.action && (
                    <div className="text-slate-600"><strong>Recommended Clinical Action:</strong> {screening.result.management.action}</div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="bg-slate-50 rounded-xl p-4 border border-dashed border-slate-300 text-slate-500 text-xs italic">
              Screening not performed (Direct Formula calculation selected).
            </div>
          )}
        </div>

        {/* SECTION 2: FORMULA RESULTS */}
        <div className="space-y-4 pt-2">
          <div className="border-b border-slate-200 pb-2">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Calculator className="w-5 h-5 text-brand-600" />
              <span>Section 2: Nutritional & Anthropometric Formulas</span>
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-1">
              <span className="text-[11px] font-semibold text-slate-500 uppercase">Body Mass Index</span>
              <div className="text-xl font-bold font-mono text-slate-900">{formulas?.bmi || '—'} <span className="text-xs font-normal text-slate-500">kg/m²</span></div>
              <div className="text-[10px] text-brand-700 font-medium">{formulas?.bmiCategory}</div>
            </div>

            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-1">
              <span className="text-[11px] font-semibold text-slate-500 uppercase">Ideal Body Weight</span>
              <div className="text-xl font-bold font-mono text-slate-900">{formulas?.ibw || '—'} <span className="text-xs font-normal text-slate-500">kg</span></div>
              <div className="text-[10px] text-slate-500 font-mono">H(cm) - 100</div>
            </div>

            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-1">
              <span className="text-[11px] font-semibold text-slate-500 uppercase">Adjusted Body Weight</span>
              <div className="text-xl font-bold font-mono text-slate-900">{formulas?.abw || '—'} <span className="text-xs font-normal text-slate-500">kg</span></div>
              <div className="text-[10px] text-slate-500 font-mono">IBW + 0.4(W - IBW)</div>
            </div>

            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-1">
              <span className="text-[11px] font-semibold text-slate-500 uppercase">Basal Metabolic Rate</span>
              <div className="text-xl font-bold font-mono text-slate-900">{formulas?.bmr || '—'} <span className="text-xs font-normal text-slate-500">kcal/d</span></div>
              <div className="text-[10px] text-slate-500 font-mono">{patientDetails.gender || 'Male'} equation</div>
            </div>

          </div>
        </div>

        {/* SECTION 3: ENERGY REQUIREMENT & TEE */}
        <div className="space-y-4 pt-2">
          <div className="border-b border-slate-200 pb-2">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Flame className="w-5 h-5 text-amber-600" />
              <span>Section 3: Total Energy Expenditure (TEE) Requirement</span>
            </h2>
          </div>

          <div className="bg-slate-900 text-white rounded-2xl p-6 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="bg-white/10 rounded-xl p-3 border border-white/10">
                <span className="text-slate-400 block mb-1">Physical Activity Level:</span>
                <strong className="text-white text-sm block">{formulas?.physicalActivity?.level}</strong>
                <span className="font-mono text-sky-300">Factor: {formulas?.physicalActivity?.factor?.toFixed(2)}</span>
              </div>

              <div className="bg-white/10 rounded-xl p-3 border border-white/10">
                <span className="text-slate-400 block mb-1">Clinical Injury / Stress:</span>
                <strong className="text-white text-sm block">{formulas?.injury?.condition}</strong>
                <span className="font-mono text-amber-300">Factor: {formulas?.injury?.factor?.toFixed(2)}</span>
              </div>

              <div className="bg-white/10 rounded-xl p-3 border border-white/10">
                <span className="text-slate-400 block mb-1">Basal Metabolic Rate:</span>
                <strong className="text-white text-sm block">{formulas?.bmr} kcal/day</strong>
                <span className="text-slate-300">Mifflin-St Jeor derivative</span>
              </div>
            </div>

            <div className="border-t border-slate-700 pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-mono text-sky-400 uppercase tracking-wider block">TEE Calculation Formula:</span>
                <span className="text-sm font-mono text-slate-200">
                  TEE = {formulas?.bmr} × {formulas?.physicalActivity?.factor?.toFixed(2)} × {formulas?.injury?.factor?.toFixed(2)}
                </span>
              </div>

              <div className="text-left sm:text-right">
                <div className="text-3xl sm:text-4xl font-black text-sky-300 font-mono">
                  {formulas?.tee} <span className="text-sm font-normal text-slate-300">kcal/day</span>
                </div>
                <div className="text-[11px] text-slate-400">Total daily caloric goal</div>
              </div>
            </div>
          </div>
        </div>

        {/* CLINICAL CONSULTATION NOTES */}
        <div className="space-y-2 pt-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
            Nutritionist Consultation & Care Plan Notes
          </label>
          <textarea
            rows={3}
            value={clinicalNotes}
            onChange={(e) => setClinicalNotes(e.target.value)}
            placeholder="Add specific dietetic recommendations, protein target (g/kg), enteral feeding rate, or follow-up schedule..."
            className="clinical-input text-xs"
          />
        </div>

        {/* Report Signature Area */}
        <div className="pt-8 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-end gap-6 text-xs text-slate-500">
          <div className="space-y-1">
            <div>NutriCalc Clinical Nutrition System v1.0.0</div>
            <div>Stored in MongoDB Atlas Cloud Healthcare Database</div>
          </div>

          <div className="text-right border-t border-slate-300 pt-2 min-w-[200px]">
            <div className="font-bold text-slate-800">Authorized Clinical Dietitian</div>
            <div className="text-[11px] text-slate-400">Signature / Stamp</div>
          </div>
        </div>

      </div>

      {/* Bottom Navigation Links (No-Print) */}
      <div className="no-print flex flex-wrap items-center justify-between gap-4 pt-4">
        <Link
          to="/patients"
          className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1.5"
        >
          <Users className="w-4 h-4" />
          <span>Go to Patient Records Registry</span>
        </Link>

        <button
          onClick={handleStartNew}
          className="clinical-btn-primary py-2.5 px-6 text-xs"
        >
          <UserPlus className="w-4 h-4" />
          <span>Start Next Assessment</span>
        </button>
      </div>

    </div>
  );
}
