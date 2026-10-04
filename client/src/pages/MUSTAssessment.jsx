import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldAlert, 
  Scale, 
  HeartPulse, 
  Flame, 
  ClipboardList, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle,
  Building2,
  Home,
  Users
} from 'lucide-react';
import { useAssessment } from '../context/AssessmentContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { evaluateMUST } from '../services/assessmentEvaluators.js';
import { calculateBMI } from '../services/calculationEngine.js';

export default function MUSTAssessment() {
  const navigate = useNavigate();
  const { patientDetails, updateAssessmentData, setAssessmentResult } = useAssessment();
  const { success } = useToast();

  const [previousWeight, setPreviousWeight] = useState('');
  const [currentWeight, setCurrentWeight] = useState(patientDetails.weight || '');
  const [isAcutelyIllNoIntake5Days, setIsAcutelyIllNoIntake5Days] = useState(false);

  // Live evaluation
  const liveResult = evaluateMUST(
    {
      previousWeight,
      currentWeight,
      isAcutelyIllNoIntake5Days
    },
    patientDetails
  );

  const handleCalculateAndProceed = () => {
    const assessmentPayload = {
      previousWeight,
      currentWeight,
      isAcutelyIllNoIntake5Days
    };

    updateAssessmentData(assessmentPayload);
    setAssessmentResult(liveResult);
    success('MUST 5-Step screening evaluated successfully.');
    navigate('/screening-result');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-clinical">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-amber-600 font-mono">
                5-Step Screening Protocol
              </div>
              <h1 className="text-2xl font-black text-slate-900 font-sans">
                Malnutrition Universal Screening Tool (MUST)
              </h1>
            </div>
          </div>

          <div className="text-right sm:border-l sm:pl-6 border-slate-200">
            <div className="text-xs text-slate-500">Patient: <strong className="text-slate-900">{patientDetails.name || 'Anonymous'}</strong></div>
            <div className="text-xs text-slate-500 mt-0.5">
              MUST Score: <strong className="text-amber-700 font-mono text-base">{liveResult.score}</strong> ({liveResult.risk})
            </div>
          </div>
        </div>

        <div className="mt-4 p-3 bg-amber-50/60 rounded-xl border border-amber-100 text-xs text-amber-900 leading-relaxed">
          <strong>MUST 5-Step Protocol:</strong> Step 1 (BMI score) + Step 2 (Weight loss score) + Step 3 (Acute disease effect score) = <strong>Step 4 (Overall risk)</strong> → <strong>Step 5 (Management guidelines)</strong>.
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: Steps 1, 2, 3 and 5 */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* STEP 1: BMI Score */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-clinical space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-amber-600 text-white text-xs font-bold flex items-center justify-center">1</span>
                <h3 className="text-base font-bold text-slate-900">Step 1 — BMI Score</h3>
              </div>
              <span className="text-xs font-mono font-bold bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full">
                Score: {liveResult.breakdown.step1BMI.score}
              </span>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-50 p-4 rounded-xl text-xs">
              <div>
                <span className="text-slate-500">Current Measured BMI:</span>{' '}
                <strong className="font-mono text-slate-900 text-sm">{liveResult.breakdown.step1BMI.bmi} kg/m²</strong>
                {liveResult.isObese && (
                  <span className="ml-2 text-xs font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                    BMI ≥30 (Obese, Score: 0)
                  </span>
                )}
              </div>
              <div className="text-slate-600">
                Height: <strong>{patientDetails.height} cm</strong> | Weight: <strong>{currentWeight} kg</strong>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 text-xs">
              <div className={`p-3 rounded-lg border ${liveResult.breakdown.step1BMI.score === 0 ? 'border-amber-600 bg-amber-50 font-bold text-amber-900' : 'border-slate-200 text-slate-600'}`}>
                <div>BMI &gt; 20 kg/m²</div>
                <div className="text-[11px] font-mono mt-1">Score: 0</div>
              </div>
              <div className={`p-3 rounded-lg border ${liveResult.breakdown.step1BMI.score === 1 ? 'border-amber-600 bg-amber-50 font-bold text-amber-900' : 'border-slate-200 text-slate-600'}`}>
                <div>BMI 18.5 – 20 kg/m²</div>
                <div className="text-[11px] font-mono mt-1">Score: 1</div>
              </div>
              <div className={`p-3 rounded-lg border ${liveResult.breakdown.step1BMI.score === 2 ? 'border-amber-600 bg-amber-50 font-bold text-amber-900' : 'border-slate-200 text-slate-600'}`}>
                <div>BMI &lt; 18.5 kg/m²</div>
                <div className="text-[11px] font-mono mt-1">Score: 2</div>
              </div>
            </div>
          </div>

          {/* STEP 2: Weight Loss Score */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-clinical space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-amber-600 text-white text-xs font-bold flex items-center justify-center">2</span>
                <h3 className="text-base font-bold text-slate-900">Step 2 — Unplanned Weight Loss Score (Past 3–6 Months)</h3>
              </div>
              <span className="text-xs font-mono font-bold bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full">
                Score: {liveResult.breakdown.step2WeightLoss.score}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Previous / Usual Weight (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  value={previousWeight}
                  onChange={(e) => setPreviousWeight(e.target.value)}
                  placeholder="e.g. 76"
                  className="clinical-input font-mono text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Current Weight (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  value={currentWeight}
                  onChange={(e) => setCurrentWeight(e.target.value)}
                  className="clinical-input font-mono text-xs"
                />
              </div>
            </div>

            {liveResult.breakdown.step2WeightLoss.percentLoss > 0 && (
              <div className="text-xs font-mono text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-200 flex items-center justify-between">
                <span>Calculated Unplanned Loss: <strong>{liveResult.breakdown.step2WeightLoss.percentLoss}%</strong></span>
                <span className="text-amber-800 font-semibold">{liveResult.breakdown.step2WeightLoss.note}</span>
              </div>
            )}

            <div className="grid grid-cols-3 gap-3 text-xs">
              <div className={`p-3 rounded-lg border ${liveResult.breakdown.step2WeightLoss.score === 0 ? 'border-amber-600 bg-amber-50 font-bold text-amber-900' : 'border-slate-200 text-slate-600'}`}>
                <div>Loss &lt; 5%</div>
                <div className="text-[11px] font-mono mt-1">Score: 0</div>
              </div>
              <div className={`p-3 rounded-lg border ${liveResult.breakdown.step2WeightLoss.score === 1 ? 'border-amber-600 bg-amber-50 font-bold text-amber-900' : 'border-slate-200 text-slate-600'}`}>
                <div>Loss 5 – 10%</div>
                <div className="text-[11px] font-mono mt-1">Score: 1</div>
              </div>
              <div className={`p-3 rounded-lg border ${liveResult.breakdown.step2WeightLoss.score === 2 ? 'border-amber-600 bg-amber-50 font-bold text-amber-900' : 'border-slate-200 text-slate-600'}`}>
                <div>Loss &gt; 10%</div>
                <div className="text-[11px] font-mono mt-1">Score: 2</div>
              </div>
            </div>
          </div>

          {/* STEP 3: Acute Disease Effect Score */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-clinical space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-amber-600 text-white text-xs font-bold flex items-center justify-center">3</span>
                <h3 className="text-base font-bold text-slate-900">Step 3 — Acute Disease Effect Score</h3>
              </div>
              <span className="text-xs font-mono font-bold bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full">
                Score: {liveResult.breakdown.step3AcuteDisease.score}
              </span>
            </div>

            <label className={`block p-4 rounded-xl border-2 cursor-pointer transition-all ${
              isAcutelyIllNoIntake5Days
                ? 'border-amber-600 bg-amber-50/50 shadow-xs'
                : 'border-slate-200 bg-white hover:bg-slate-50'
            }`}>
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={isAcutelyIllNoIntake5Days}
                  onChange={(e) => setIsAcutelyIllNoIntake5Days(e.target.checked)}
                  className="mt-1 rounded text-amber-600 focus:ring-amber-500"
                />
                <div>
                  <div className="text-sm font-bold text-slate-900">
                    Patient is acutely ill AND there has been or is likely to be no nutritional intake for &gt;5 days
                  </div>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Applies to critically ill patients undergoing major surgical stress, intensive care, or severe sepsis where food intake is entirely interrupted for &gt;5 days.
                  </p>
                </div>
              </div>
            </label>
          </div>

          {/* STEP 5: Management Guidelines Preview */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-clinical space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <span className="w-6 h-6 rounded-full bg-amber-600 text-white text-xs font-bold flex items-center justify-center">5</span>
              <h3 className="text-base font-bold text-slate-900">Step 5 — Management Guidelines for {liveResult.risk}</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-slate-800">
                  <Building2 className="w-4 h-4 text-amber-600" />
                  <span>Hospital</span>
                </div>
                <p className="text-slate-600 leading-relaxed">{liveResult.management.rescreening.hospital}</p>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-slate-800">
                  <Home className="w-4 h-4 text-amber-600" />
                  <span>Care Homes</span>
                </div>
                <p className="text-slate-600 leading-relaxed">{liveResult.management.rescreening.careHome}</p>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-slate-800">
                  <Users className="w-4 h-4 text-amber-600" />
                  <span>Community</span>
                </div>
                <p className="text-slate-600 leading-relaxed">{liveResult.management.rescreening.community}</p>
              </div>
            </div>

            <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-100 text-xs text-amber-950 space-y-1.5">
              <div className="font-bold">Recommended Clinical Action Plan:</div>
              <ul className="list-disc list-inside space-y-1 text-slate-700">
                {liveResult.management.carePlan.map((step, idx) => (
                  <li key={idx}>{step}</li>
                ))}
              </ul>
            </div>
          </div>

        </div>

        {/* Right Col: Overall MUST Score & Action */}
        <div className="space-y-6">
          <div className="sticky top-20 bg-white rounded-2xl border-2 border-amber-300 p-6 shadow-clinical-lg space-y-5">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600 font-mono">Step 4: Overall Risk</span>
              <div className="text-4xl font-black text-slate-900 mt-1 font-mono flex items-baseline gap-2">
                <span>{liveResult.score}</span>
                <span className="text-base text-slate-400 font-normal">points</span>
              </div>
            </div>

            {/* Step by step summary */}
            <div className="space-y-2 pt-2 text-xs border-t border-slate-100">
              <div className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">Score Calculation:</div>
              <div className="space-y-1 text-slate-600 font-mono">
                <div className="flex justify-between"><span>Step 1 (BMI):</span> <strong>{liveResult.breakdown.step1BMI.score}</strong></div>
                <div className="flex justify-between"><span>Step 2 (Weight Loss):</span> <strong>{liveResult.breakdown.step2WeightLoss.score}</strong></div>
                <div className="flex justify-between"><span>Step 3 (Acute Disease):</span> <strong>{liveResult.breakdown.step3AcuteDisease.score}</strong></div>
                <div className="flex justify-between border-t pt-1 font-bold text-slate-900"><span>Step 4 Total:</span> <strong>{liveResult.score}</strong></div>
              </div>
            </div>

            {/* Risk Classification Card */}
            <div className={`p-4 rounded-xl border ${
              liveResult.risk === 'High Risk'
                ? 'bg-rose-50 border-rose-200 text-rose-900'
                : liveResult.risk === 'Medium Risk'
                ? 'bg-amber-50 border-amber-200 text-amber-900'
                : 'bg-emerald-50 border-emerald-200 text-emerald-900'
            }`}>
              <div className="text-xs font-semibold uppercase tracking-wider">Overall Risk Category:</div>
              <div className="text-xl font-extrabold mt-0.5">
                {liveResult.risk}
              </div>
              <div className="text-xs font-semibold mt-1">
                Action: {liveResult.management.action}
              </div>
            </div>

            <button
              type="button"
              onClick={handleCalculateAndProceed}
              className="bg-amber-600 hover:bg-amber-700 text-white w-full py-3 rounded-xl text-sm font-bold shadow-md transition-all flex items-center justify-center gap-2"
            >
              <span>Confirm & View MUST Result</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
