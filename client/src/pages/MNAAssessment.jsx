import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  HeartHandshake, 
  Utensils, 
  Scale, 
  Activity, 
  Brain, 
  Sparkles, 
  ArrowRight, 
  Info,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { useAssessment } from '../context/AssessmentContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { evaluateMNA } from '../services/assessmentEvaluators.js';
import { calculateBMI } from '../services/calculationEngine.js';

export default function MNAAssessment() {
  const navigate = useNavigate();
  const { patientDetails, updateAssessmentData, setAssessmentResult } = useAssessment();
  const { success } = useToast();

  const autoBMI = patientDetails.weight && patientDetails.height ? calculateBMI(patientDetails.weight, patientDetails.height).value : null;

  let defaultF1Score = 3;
  if (autoBMI) {
    if (autoBMI < 19) defaultF1Score = 0;
    else if (autoBMI < 21) defaultF1Score = 1;
    else if (autoBMI < 23) defaultF1Score = 2;
    else defaultF1Score = 3;
  }

  const [qA, setQA] = useState(2); // Food intake decline (0, 1, 2)
  const [qB, setQB] = useState(3); // Weight loss (0, 1, 2, 3)
  const [qC, setQC] = useState(2); // Mobility (0, 1, 2)
  const [qD, setQD] = useState(2); // Psych stress (0, 2)
  const [qE, setQE] = useState(2); // Neuropsych (0, 1, 2)
  const [useBMI, setUseBMI] = useState(true);
  const [qF1, setQF1] = useState(defaultF1Score);
  const [qF2, setQF2] = useState(3);
  const [calfCircumference, setCalfCircumference] = useState('');

  // Live evaluation
  const liveResult = evaluateMNA(
    {
      qA,
      qB,
      qC,
      qD,
      qE,
      useBMI,
      qF1: useBMI ? qF1 : undefined,
      qF2: !useBMI ? qF2 : undefined,
      calfCircumference: !useBMI ? calfCircumference : undefined
    },
    patientDetails
  );

  const handleCalfChange = (val) => {
    setCalfCircumference(val);
    const num = parseFloat(val);
    if (!isNaN(num)) {
      setQF2(num < 31 ? 0 : 3);
    }
  };

  const handleCalculateAndProceed = () => {
    const assessmentPayload = {
      qA,
      qB,
      qC,
      qD,
      qE,
      useBMI,
      ...(useBMI ? { qF1 } : { qF2, calfCircumference })
    };

    updateAssessmentData(assessmentPayload);
    setAssessmentResult(liveResult);
    success('MNA score calculated successfully.');
    navigate('/screening-result');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-clinical">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-purple-600 font-mono">
                MNA Short-Form Protocol
              </div>
              <h1 className="text-2xl font-black text-slate-900 font-sans">
                Mini Nutritional Assessment (MNA®)
              </h1>
            </div>
          </div>

          <div className="text-right sm:border-l sm:pl-6 border-slate-200">
            <div className="text-xs text-slate-500">Patient: <strong className="text-slate-900">{patientDetails.name || 'Anonymous'}</strong></div>
            <div className="text-xs text-slate-500 mt-0.5">
              Score: <strong className="text-purple-700 font-mono text-base">{liveResult.score} / 14</strong>
            </div>
          </div>
        </div>

        <div className="mt-4 p-3 bg-purple-50/60 rounded-xl border border-purple-100 text-xs text-purple-900 leading-relaxed">
          <strong>Scoring Thresholds:</strong> <strong>12–14 points:</strong> Normal nutritional status | <strong>8–11 points:</strong> At risk of malnutrition | <strong>0–7 points:</strong> Malnourished. Mutual exclusivity enforced between Question F1 (BMI) and Question F2 (Calf circumference).
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: Questions A through F */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Question A */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-clinical space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-slate-900">
                A. Has food intake declined over the past 3 months due to loss of appetite, digestive problems, chewing or swallowing difficulties?
              </span>
              <span className="text-xs font-mono font-bold bg-purple-50 text-purple-700 px-2 py-0.5 rounded">
                Score: {qA}
              </span>
            </div>

            <div className="space-y-2 pt-1 text-xs">
              {[
                { val: 0, text: '0 = Severe decrease in food intake' },
                { val: 1, text: '1 = Moderate decrease in food intake' },
                { val: 2, text: '2 = No decrease in food intake' }
              ].map(opt => (
                <label key={opt.val} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${qA === opt.val ? 'border-purple-600 bg-purple-50/50 font-semibold text-purple-950' : 'border-slate-200 hover:bg-slate-50 text-slate-700'}`}>
                  <input
                    type="radio"
                    name="qA"
                    checked={qA === opt.val}
                    onChange={() => setQA(opt.val)}
                    className="text-purple-600"
                  />
                  <span>{opt.text}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Question B */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-clinical space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-slate-900">
                B. Weight loss during the last 3 months
              </span>
              <span className="text-xs font-mono font-bold bg-purple-50 text-purple-700 px-2 py-0.5 rounded">
                Score: {qB}
              </span>
            </div>

            <div className="space-y-2 pt-1 text-xs">
              {[
                { val: 0, text: '0 = Weight loss greater than 3 kg (6.6 lbs)' },
                { val: 1, text: '1 = Does not know' },
                { val: 2, text: '2 = Weight loss between 1 and 3 kg (2.2 and 6.6 lbs)' },
                { val: 3, text: '3 = No weight loss' }
              ].map(opt => (
                <label key={opt.val} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${qB === opt.val ? 'border-purple-600 bg-purple-50/50 font-semibold text-purple-950' : 'border-slate-200 hover:bg-slate-50 text-slate-700'}`}>
                  <input
                    type="radio"
                    name="qB"
                    checked={qB === opt.val}
                    onChange={() => setQB(opt.val)}
                    className="text-purple-600"
                  />
                  <span>{opt.text}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Question C */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-clinical space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-slate-900">
                C. Mobility
              </span>
              <span className="text-xs font-mono font-bold bg-purple-50 text-purple-700 px-2 py-0.5 rounded">
                Score: {qC}
              </span>
            </div>

            <div className="space-y-2 pt-1 text-xs">
              {[
                { val: 0, text: '0 = Bed or chair bound' },
                { val: 1, text: '1 = Able to get out of bed / chair but does not go out' },
                { val: 2, text: '2 = Goes out' }
              ].map(opt => (
                <label key={opt.val} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${qC === opt.val ? 'border-purple-600 bg-purple-50/50 font-semibold text-purple-950' : 'border-slate-200 hover:bg-slate-50 text-slate-700'}`}>
                  <input
                    type="radio"
                    name="qC"
                    checked={qC === opt.val}
                    onChange={() => setQC(opt.val)}
                    className="text-purple-600"
                  />
                  <span>{opt.text}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Question D */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-clinical space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-slate-900">
                D. Has suffered psychological stress or acute disease in the past 3 months?
              </span>
              <span className="text-xs font-mono font-bold bg-purple-50 text-purple-700 px-2 py-0.5 rounded">
                Score: {qD}
              </span>
            </div>

            <div className="space-y-2 pt-1 text-xs">
              {[
                { val: 0, text: '0 = Yes (Acute disease or severe psychological stress present)' },
                { val: 2, text: '2 = No' }
              ].map(opt => (
                <label key={opt.val} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${qD === opt.val ? 'border-purple-600 bg-purple-50/50 font-semibold text-purple-950' : 'border-slate-200 hover:bg-slate-50 text-slate-700'}`}>
                  <input
                    type="radio"
                    name="qD"
                    checked={qD === opt.val}
                    onChange={() => setQD(opt.val)}
                    className="text-purple-600"
                  />
                  <span>{opt.text}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Question E */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-clinical space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-slate-900">
                E. Neuropsychological problems
              </span>
              <span className="text-xs font-mono font-bold bg-purple-50 text-purple-700 px-2 py-0.5 rounded">
                Score: {qE}
              </span>
            </div>

            <div className="space-y-2 pt-1 text-xs">
              {[
                { val: 0, text: '0 = Severe dementia or depression' },
                { val: 1, text: '1 = Mild dementia' },
                { val: 2, text: '2 = No psychological problems' }
              ].map(opt => (
                <label key={opt.val} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${qE === opt.val ? 'border-purple-600 bg-purple-50/50 font-semibold text-purple-950' : 'border-slate-200 hover:bg-slate-50 text-slate-700'}`}>
                  <input
                    type="radio"
                    name="qE"
                    checked={qE === opt.val}
                    onChange={() => setQE(opt.val)}
                    className="text-purple-600"
                  />
                  <span>{opt.text}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Question F1 / F2 (Mutually Exclusive) */}
          <div className="bg-white rounded-2xl border-2 border-purple-300 p-6 shadow-clinical space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-purple-600">Question F (Mutual Exclusion)</span>
                <h3 className="text-base font-bold text-slate-900">
                  {useBMI ? 'F1. Body Mass Index (BMI)' : 'F2. Calf Circumference (CC)'}
                </h3>
              </div>
              <span className="text-xs font-mono font-bold bg-purple-100 text-purple-800 px-2.5 py-1 rounded-full">
                Score: {liveResult.breakdown.qF.score} / 3
              </span>
            </div>

            <div className="flex items-center gap-4 bg-slate-50 p-3 rounded-xl text-xs">
              <span className="font-semibold text-slate-700">Measurement Method:</span>
              <label className="flex items-center gap-1.5 cursor-pointer font-medium text-purple-900">
                <input
                  type="radio"
                  name="fMethod"
                  checked={useBMI}
                  onChange={() => setUseBMI(true)}
                  className="text-purple-600"
                />
                <span>Use F1: BMI (Standard)</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer font-medium text-purple-900">
                <input
                  type="radio"
                  name="fMethod"
                  checked={!useBMI}
                  onChange={() => setUseBMI(false)}
                  className="text-purple-600"
                />
                <span>Use F2: Calf Circumference (Fallback)</span>
              </label>
            </div>

            {useBMI ? (
              /* F1 BMI Options */
              <div className="space-y-2 pt-1 text-xs">
                {autoBMI && (
                  <div className="text-[11px] text-slate-500 mb-2">
                    Patient Calculated BMI: <strong className="font-mono text-slate-900">{autoBMI} kg/m²</strong>
                  </div>
                )}
                {[
                  { val: 0, text: '0 = BMI < 19 kg/m²' },
                  { val: 1, text: '1 = BMI 19 to < 21 kg/m²' },
                  { val: 2, text: '2 = BMI 21 to < 23 kg/m²' },
                  { val: 3, text: '3 = BMI ≥ 23 kg/m²' }
                ].map(opt => (
                  <label key={opt.val} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${qF1 === opt.val ? 'border-purple-600 bg-purple-50/50 font-semibold text-purple-950' : 'border-slate-200 hover:bg-slate-50 text-slate-700'}`}>
                    <input
                      type="radio"
                      name="qF1"
                      checked={qF1 === opt.val}
                      onChange={() => setQF1(opt.val)}
                      className="text-purple-600"
                    />
                    <span>{opt.text}</span>
                  </label>
                ))}
              </div>
            ) : (
              /* F2 Calf Circumference Options */
              <div className="space-y-3 pt-1 text-xs">
                <div className="bg-purple-50/50 p-3 rounded-lg border border-purple-100 text-[11px] text-purple-900">
                  Per MNA guidelines, if BMI cannot be obtained, use Calf Circumference in cm.
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Enter Calf Circumference (cm)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={calfCircumference}
                    onChange={(e) => handleCalfChange(e.target.value)}
                    placeholder="e.g. 30.5"
                    className="clinical-input font-mono text-xs w-48"
                  />
                </div>
                <div className="space-y-2">
                  {[
                    { val: 0, text: '0 = CC < 31 cm' },
                    { val: 3, text: '3 = CC ≥ 31 cm' }
                  ].map(opt => (
                    <label key={opt.val} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${qF2 === opt.val ? 'border-purple-600 bg-purple-50/50 font-semibold text-purple-950' : 'border-slate-200 hover:bg-slate-50 text-slate-700'}`}>
                      <input
                        type="radio"
                        name="qF2"
                        checked={qF2 === opt.val}
                        onChange={() => setQF2(opt.val)}
                        className="text-purple-600"
                      />
                      <span>{opt.text}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Right Col: Score Summary & Action */}
        <div className="space-y-6">
          <div className="sticky top-20 bg-white rounded-2xl border-2 border-purple-300 p-6 shadow-clinical-lg space-y-5">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-purple-600 font-mono">MNA Total Score</span>
              <div className="text-4xl font-black text-slate-900 mt-1 font-mono flex items-baseline gap-2">
                <span>{liveResult.score}</span>
                <span className="text-base text-slate-400 font-normal">/ 14</span>
              </div>
            </div>

            {/* Individual question breakdown */}
            <div className="space-y-2 pt-2 text-xs border-t border-slate-100">
              <div className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">Score Breakdown:</div>
              <div className="space-y-1 text-slate-600 font-mono">
                <div className="flex justify-between"><span>A. Food Intake:</span> <strong>{liveResult.breakdown.qA.score} / 2</strong></div>
                <div className="flex justify-between"><span>B. Weight Loss:</span> <strong>{liveResult.breakdown.qB.score} / 3</strong></div>
                <div className="flex justify-between"><span>C. Mobility:</span> <strong>{liveResult.breakdown.qC.score} / 2</strong></div>
                <div className="flex justify-between"><span>D. Psychological:</span> <strong>{liveResult.breakdown.qD.score} / 2</strong></div>
                <div className="flex justify-between"><span>E. Neuropsych:</span> <strong>{liveResult.breakdown.qE.score} / 2</strong></div>
                <div className="flex justify-between"><span>F. {liveResult.breakdown.qF.method}:</span> <strong>{liveResult.breakdown.qF.score} / 3</strong></div>
              </div>
            </div>

            {/* Classification Status */}
            <div className={`p-4 rounded-xl border ${
              liveResult.score <= 7 
                ? 'bg-rose-50 border-rose-200 text-rose-900'
                : liveResult.score <= 11
                ? 'bg-amber-50 border-amber-200 text-amber-900'
                : 'bg-emerald-50 border-emerald-200 text-emerald-900'
            }`}>
              <div className="text-xs font-semibold uppercase tracking-wider">Classification:</div>
              <div className="text-base font-extrabold mt-0.5">
                {liveResult.classification}
              </div>
              <p className="text-xs mt-2 opacity-90 leading-relaxed">
                {liveResult.actionGuideline}
              </p>
            </div>

            <button
              type="button"
              onClick={handleCalculateAndProceed}
              className="bg-purple-600 hover:bg-purple-700 text-white w-full py-3 rounded-xl text-sm font-bold shadow-md transition-all flex items-center justify-center gap-2"
            >
              <span>Confirm & View MNA Result</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
