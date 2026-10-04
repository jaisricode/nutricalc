import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ClipboardCheck, 
  ArrowRight, 
  RotateCcw, 
  Calculator, 
  User, 
  CheckCircle2, 
  AlertCircle, 
  Info,
  ShieldCheck,
  Building2,
  Home,
  Users
} from 'lucide-react';
import { useAssessment } from '../context/AssessmentContext.jsx';
import ClinicalBadge from '../components/ClinicalBadge.jsx';

export default function ScreeningResult() {
  const navigate = useNavigate();
  const { patientDetails, screening } = useAssessment();

  const tool = screening?.tool;
  const result = screening?.result;

  if (!screening?.selected || !result) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-amber-500 mx-auto" />
        <h2 className="text-xl font-bold text-slate-900">No Assessment Completed Yet</h2>
        <p className="text-sm text-slate-600">
          Please select and complete a screening tool (GLIM, SGA, MNA, or MUST) first.
        </p>
        <div className="pt-2">
          <Link to="/select-tool" className="clinical-btn-primary text-xs py-2 px-4">
            <span>Select Screening Tool</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Patient Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-clinical flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-700 flex items-center justify-center font-bold text-lg">
            {patientDetails.name ? patientDetails.name.charAt(0) : 'P'}
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Patient Assessment Summary
            </div>
            <h1 className="text-xl font-black text-slate-900">
              {patientDetails.name}
            </h1>
            <div className="text-xs text-slate-500 flex items-center gap-3 mt-0.5 font-medium">
              <span>{patientDetails.age} yrs</span>
              <span>•</span>
              <span>{patientDetails.gender}</span>
              <span>•</span>
              <span>{patientDetails.weight} kg</span>
              <span>•</span>
              <span>{patientDetails.height} cm</span>
              {patientDetails.ipNo && (
                <>
                  <span>•</span>
                  <span className="font-mono text-slate-700">IP: {patientDetails.ipNo}</span>
                </>
              )}
            </div>
          </div>
        </div>

        <div>
          <ClinicalBadge
            classification={result.classification}
            severity={result.severity}
            risk={result.risk}
            score={result.score}
            size="lg"
          />
        </div>
      </div>

      {/* Primary Result Details Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-clinical space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ClipboardCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
                {tool} Result Findings
              </span>
              <h2 className="text-lg font-bold text-slate-900">
                {result.classification}
              </h2>
            </div>
          </div>

          <Link
            to={`/assessment/${tool.toLowerCase()}`}
            className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Re-evaluate {tool}</span>
          </Link>
        </div>

        {/* TOOL SPECIFIC TRANSPARENT BREAKDOWN */}

        {/* 1. GLIM Breakdown */}
        {tool === 'GLIM' && result.criteria && (
          <div className="space-y-6">
            <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-100 text-xs text-blue-950 leading-relaxed font-medium">
              {result.summaryText}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Phenotypic Summary */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3 text-xs">
                <div className="flex items-center justify-between font-bold text-slate-900 border-b pb-2">
                  <span>Phenotypic Criteria</span>
                  <span className={result.criteria.phenotypic.positive ? 'text-emerald-700 font-extrabold' : 'text-slate-500'}>
                    {result.criteria.phenotypic.count} / 3 Positive
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <span>Unintentional Weight Loss:</span>
                    <strong className={result.criteria.phenotypic.weightLoss.positive ? 'text-rose-600' : 'text-slate-500'}>
                      {result.criteria.phenotypic.weightLoss.positive ? `Positive (${result.criteria.phenotypic.weightLoss.stage})` : 'Negative'}
                    </strong>
                  </div>
                  <div className="flex items-start justify-between">
                    <span>Low BMI ({result.criteria.phenotypic.lowBMI.bmi} kg/m²):</span>
                    <strong className={result.criteria.phenotypic.lowBMI.positive ? 'text-rose-600' : 'text-slate-500'}>
                      {result.criteria.phenotypic.lowBMI.positive ? `Positive (${result.criteria.phenotypic.lowBMI.stage})` : 'Within Threshold'}
                    </strong>
                  </div>
                  <div className="flex items-start justify-between">
                    <span>Reduced Muscle Mass:</span>
                    <strong className={result.criteria.phenotypic.reducedMuscleMass.positive ? 'text-rose-600' : 'text-slate-500'}>
                      {result.criteria.phenotypic.reducedMuscleMass.positive ? `Positive (${result.criteria.phenotypic.reducedMuscleMass.method})` : 'Normal'}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Etiologic Summary */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3 text-xs">
                <div className="flex items-center justify-between font-bold text-slate-900 border-b pb-2">
                  <span>Etiologic Criteria</span>
                  <span className={result.criteria.etiologic.positive ? 'text-emerald-700 font-extrabold' : 'text-slate-500'}>
                    {result.criteria.etiologic.count} / 2 Positive
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <span>Reduced Food Intake / GI:</span>
                    <strong className={result.criteria.etiologic.reducedIntake.positive ? 'text-rose-600' : 'text-slate-500'}>
                      {result.criteria.etiologic.reducedIntake.positive ? 'Positive' : 'Adequate'}
                    </strong>
                  </div>
                  <div className="flex items-start justify-between">
                    <span>Disease Burden / Inflammation:</span>
                    <strong className={result.criteria.etiologic.diseaseBurden.positive ? 'text-rose-600' : 'text-slate-500'}>
                      {result.criteria.etiologic.diseaseBurden.positive ? 'Positive' : 'None'}
                    </strong>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* 2. SGA Breakdown */}
        {tool === 'SGA' && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-teal-50/60 border border-teal-100 text-xs text-teal-950 leading-relaxed font-medium">
              {result.description}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="font-bold text-slate-900">Medical History Review:</div>
                <ul className="space-y-1 text-slate-600 list-disc list-inside">
                  <li>6-Month Loss: {result.assessmentData?.medicalHistory?.past6MonthsLoss || 'Completed'}</li>
                  <li>2-Week Change: {result.assessmentData?.medicalHistory?.past2WeeksChange || 'Completed'}</li>
                  <li>Dietary Intake: {result.assessmentData?.medicalHistory?.dietaryIntake || 'Completed'}</li>
                  <li>Functional Capacity: {result.assessmentData?.medicalHistory?.functionalCapacity || 'Completed'}</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="font-bold text-slate-900">Physical Exam Review:</div>
                <ul className="space-y-1 text-slate-600 list-disc list-inside">
                  <li>Subcutaneous Fat: Evaluated (Eyes, Triceps, Biceps)</li>
                  <li>Muscle Wasting: Evaluated (8 Anatomical Sites)</li>
                  <li>Oedema: {result.assessmentData?.physicalExam?.oedema || 'No sign'}</li>
                  <li>Ascites: {result.assessmentData?.physicalExam?.ascites || 'No sign'}</li>
                </ul>
              </div>
            </div>

            {result.assessmentData?.clinicalNotes && (
              <div className="p-3 rounded-lg bg-amber-50/50 border border-amber-200 text-xs text-amber-900">
                <strong>Clinician Notes:</strong> {result.assessmentData.clinicalNotes}
              </div>
            )}
          </div>
        )}

        {/* 3. MNA Breakdown */}
        {tool === 'MNA' && result.breakdown && (
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 rounded-xl bg-purple-50 border border-purple-200 text-purple-900">
              <span className="font-bold text-sm">Total MNA Screening Score:</span>
              <span className="text-2xl font-black font-mono">{result.score} / 14</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              {Object.entries(result.breakdown).map(([key, item]) => (
                <div key={key} className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="text-slate-500 font-medium truncate">{item.label}</div>
                  <div className="font-mono font-bold text-slate-900 text-sm">
                    {item.score} / {item.max}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-1">
              <strong className="text-slate-900">Clinical Recommendation:</strong>
              <p>{result.actionGuideline}</p>
            </div>
          </div>
        )}

        {/* 4. MUST Breakdown */}
        {tool === 'MUST' && result.breakdown && (
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900">
              <span className="font-bold text-sm">Overall MUST Risk Score:</span>
              <span className="text-2xl font-black font-mono">{result.score}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="font-semibold text-slate-500">Step 1: BMI Score</span>
                <div className="font-bold text-slate-900 text-sm">{result.breakdown.step1BMI.score}</div>
                <div className="text-[11px] text-slate-500 font-mono">{result.breakdown.step1BMI.note}</div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="font-semibold text-slate-500">Step 2: Weight Loss Score</span>
                <div className="font-bold text-slate-900 text-sm">{result.breakdown.step2WeightLoss.score}</div>
                <div className="text-[11px] text-slate-500 font-mono">{result.breakdown.step2WeightLoss.note}</div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="font-semibold text-slate-500">Step 3: Acute Disease</span>
                <div className="font-bold text-slate-900 text-sm">{result.breakdown.step3AcuteDisease.score}</div>
                <div className="text-[11px] text-slate-500 font-mono">{result.breakdown.step3AcuteDisease.note}</div>
              </div>
            </div>

            {result.management && (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-2">
                <strong className="text-slate-900 block">Step 5 — Action Plan for {result.risk}:</strong>
                <ul className="list-disc list-inside space-y-1">
                  {result.management.carePlan.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Action Button: Proceed to Formulas */}
        <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link
            to="/select-tool"
            className="clinical-btn-secondary text-xs w-full sm:w-auto"
          >
            <span>Change Screening Tool</span>
          </Link>

          <button
            onClick={() => navigate('/formulas')}
            className="clinical-btn-primary w-full sm:w-auto text-sm py-3 px-8 shadow-md"
          >
            <span>Continue to Nutritional Formulas & TEE</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
}
