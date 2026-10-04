import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calculator, 
  Flame, 
  Activity, 
  AlertTriangle, 
  ArrowRight, 
  Scale, 
  Info,
  CheckCircle2,
  Sliders,
  SlidersHorizontal,
  FileCheck
} from 'lucide-react';
import { useAssessment } from '../context/AssessmentContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { PHYSICAL_ACTIVITY_LEVELS, getActivityFactor } from '../data/activityFactors.js';
import { INJURY_CONDITIONS, getInjuryCondition } from '../data/injuryFactors.js';
import FormulaCard from '../components/FormulaCard.jsx';

export default function FormulasPage() {
  const navigate = useNavigate();
  const { patientDetails, formulas, updateFormulaParams } = useAssessment();
  const { error, success } = useToast();

  const [selectedActivityId, setSelectedActivityId] = useState(() => {
    const found = PHYSICAL_ACTIVITY_LEVELS.find(l => l.name === formulas?.physicalActivity?.level);
    return found ? found.id : 'sedentary';
  });

  const [selectedInjuryId, setSelectedInjuryId] = useState(() => {
    const found = INJURY_CONDITIONS.find(c => c.name === formulas?.injury?.condition);
    return found ? found.id : 'spec_normal_minor_surgery';
  });

  const [injuryFactorValue, setInjuryFactorValue] = useState(() => {
    return formulas?.injury?.factor !== undefined ? formulas.injury.factor : 1.0;
  });

  const [rangeError, setRangeError] = useState('');

  // Selected Activity Object
  const currentActivityObj = PHYSICAL_ACTIVITY_LEVELS.find(l => l.id === selectedActivityId) || PHYSICAL_ACTIVITY_LEVELS[0];
  const autoActivityFactor = currentActivityObj.factors[patientDetails.gender || 'Male'];

  // Selected Injury Condition Object
  const currentInjuryObj = INJURY_CONDITIONS.find(c => c.id === selectedInjuryId) || INJURY_CONDITIONS[4];

  // Sync injury factor when injury condition changes
  const handleInjuryConditionChange = (conditionId) => {
    setSelectedInjuryId(conditionId);
    const cond = INJURY_CONDITIONS.find(c => c.id === conditionId);
    if (cond) {
      const initialVal = cond.isRange ? cond.defaultVal : cond.fixedValue;
      setInjuryFactorValue(initialVal);
      setRangeError('');

      updateFormulaParams({
        activityLevel: currentActivityObj.name,
        activityFactor: autoActivityFactor,
        injuryCondition: cond.name,
        injuryFactor: initialVal,
        injuryMin: cond.min,
        injuryMax: cond.max,
        category: cond.category
      });
    }
  };

  const handleActivityChange = (actId) => {
    setSelectedActivityId(actId);
    const act = PHYSICAL_ACTIVITY_LEVELS.find(l => l.id === actId);
    if (act) {
      const actFactor = act.factors[patientDetails.gender || 'Male'];
      updateFormulaParams({
        activityLevel: act.name,
        activityFactor: actFactor,
        injuryCondition: currentInjuryObj.name,
        injuryFactor: injuryFactorValue,
        injuryMin: currentInjuryObj.min,
        injuryMax: currentInjuryObj.max,
        category: currentInjuryObj.category
      });
    }
  };

  const handleCustomFactorInput = (val) => {
    const num = parseFloat(val);
    setInjuryFactorValue(val);

    if (isNaN(num)) {
      setRangeError('Please enter a valid numeric injury factor.');
      return;
    }

    if (num < currentInjuryObj.min || num > currentInjuryObj.max) {
      setRangeError(`Selected factor must be between ${currentInjuryObj.min} and ${currentInjuryObj.max}.`);
      return;
    }

    setRangeError('');
    updateFormulaParams({
      activityLevel: currentActivityObj.name,
      activityFactor: autoActivityFactor,
      injuryCondition: currentInjuryObj.name,
      injuryFactor: num,
      injuryMin: currentInjuryObj.min,
      injuryMax: currentInjuryObj.max,
      category: currentInjuryObj.category
    });
  };

  const handleProceedToFinal = () => {
    const num = parseFloat(injuryFactorValue);
    if (isNaN(num) || num < currentInjuryObj.min || num > currentInjuryObj.max) {
      error(`The selected injury factor must be between ${currentInjuryObj.min} and ${currentInjuryObj.max}.`);
      return;
    }

    navigate('/final-result');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-clinical flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <Calculator className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-emerald-600 font-mono">
              Nutritional & Metabolic Engine
            </div>
            <h1 className="text-2xl font-black text-slate-900 font-sans">
              Formulas & Total Energy Expenditure (TEE)
            </h1>
          </div>
        </div>

        <div className="text-right sm:border-l sm:pl-6 border-slate-200 text-xs text-slate-500">
          <div>Patient: <strong className="text-slate-900">{patientDetails.name || 'Anonymous'}</strong> ({patientDetails.gender})</div>
          <div className="mt-0.5">
            Weight: <strong className="text-slate-900 font-mono">{patientDetails.weight} kg</strong> | Height: <strong className="text-slate-900 font-mono">{patientDetails.height} cm</strong> | Age: <strong className="text-slate-900 font-mono">{patientDetails.age}y</strong>
          </div>
        </div>
      </div>

      {/* 4 Standard Nutritional Formula Cards */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
          Anthropometric & Basal Metabolic Calculations
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* 1. BMI */}
          <FormulaCard
            title="Body Mass Index (BMI)"
            formulaName="BMI"
            formulaString="Weight(kg) / (Height(m))²"
            calculatedValue={formulas?.bmi}
            unit="kg/m²"
            category={formulas?.bmiCategory}
            breakdown={formulas?.breakdowns?.bmi}
          />

          {/* 2. IBW */}
          <FormulaCard
            title="Ideal Body Weight"
            formulaName="IBW"
            formulaString="Height(cm) - 100"
            calculatedValue={formulas?.ibw}
            unit="kg"
            breakdown={formulas?.breakdowns?.ibw}
          />

          {/* 3. ABW */}
          <FormulaCard
            title="Adjusted Body Weight"
            formulaName="ABW"
            formulaString="IBW + (0.4 × (Actual Weight - IBW))"
            calculatedValue={formulas?.abw}
            unit="kg"
            breakdown={formulas?.breakdowns?.abw}
          />

          {/* 4. BMR */}
          <FormulaCard
            title="Basal Metabolic Rate"
            formulaName="BMR"
            formulaString={patientDetails.gender === 'Female' ? '10W + 6.5H - 5A - 161' : '10W + 6.5H - 5A + 5'}
            calculatedValue={formulas?.bmr}
            unit="kcal/day"
            breakdown={formulas?.breakdowns?.bmr}
            note={`Calculated for ${patientDetails.gender || 'Male'} gender.`}
          />

        </div>
      </div>

      {/* Factors Selection Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* 1. Physical Activity Factor */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-clinical space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-brand-600" />
                <h3 className="text-base font-bold text-slate-900">Physical Activity Factor</h3>
              </div>
              <span className="text-xs font-mono font-bold bg-brand-50 text-brand-700 px-3 py-1 rounded-full border border-brand-200">
                Factor: {autoActivityFactor.toFixed(2)} ({patientDetails.gender || 'Male'})
              </span>
            </div>

            <div className="mt-4 space-y-2">
              <label className="block text-xs font-semibold text-slate-700">Select Activity Level:</label>
              <select
                value={selectedActivityId}
                onChange={(e) => handleActivityChange(e.target.value)}
                className="clinical-select text-sm font-medium"
              >
                {PHYSICAL_ACTIVITY_LEVELS.map((level) => {
                  const factor = level.factors[patientDetails.gender || 'Male'];
                  return (
                    <option key={level.id} value={level.id}>
                      {level.name} — Factor {factor.toFixed(2)} ({level.description})
                    </option>
                  );
                })}
              </select>
            </div>

            <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1">
              <div><strong className="text-slate-800">Selected Level:</strong> {currentActivityObj.name}</div>
              <div><strong className="text-slate-800">Clinical Profile:</strong> {currentActivityObj.description}</div>
              <div><strong className="text-slate-800">Male/Female Factor:</strong> {currentActivityObj.factors.Male.toFixed(2)} (M) / {currentActivityObj.factors.Female.toFixed(2)} (F)</div>
            </div>
          </div>

          <div className="pt-3 text-[11px] text-slate-400">
            * Automatically tuned according to patient gender ({patientDetails.gender || 'Male'}).
          </div>
        </div>

        {/* 2. Clinical Injury / Stress Factor */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-clinical space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-amber-600" />
                <h3 className="text-base font-bold text-slate-900">Clinical Injury & Stress Factor</h3>
              </div>
              <span className="text-xs font-mono font-bold bg-amber-50 text-amber-700 px-3 py-1 rounded-full border border-amber-200">
                Factor: {parseFloat(injuryFactorValue || 1).toFixed(2)}
              </span>
            </div>

            <div className="mt-4 space-y-2">
              <label className="block text-xs font-semibold text-slate-700">Select Clinical / Stress Condition:</label>
              <select
                value={selectedInjuryId}
                onChange={(e) => handleInjuryConditionChange(e.target.value)}
                className="clinical-select text-sm font-medium"
              >
                <optgroup label="General Conditions">
                  {INJURY_CONDITIONS.filter(c => c.category === 'General Conditions').map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name} — {c.isRange ? `Range [${c.min} – ${c.max}]` : `Fixed ${c.fixedValue}`}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="Specific Conditions">
                  {INJURY_CONDITIONS.filter(c => c.category === 'Specific Conditions').map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name} — {c.isRange ? `Range [${c.min} – ${c.max}]` : `Fixed ${c.fixedValue}`}
                    </option>
                  ))}
                </optgroup>
              </select>
            </div>

            {/* Range Handling: Slider + Numeric Input Per Specification */}
            {currentInjuryObj.isRange ? (
              <div className="mt-4 p-4 bg-amber-50/50 rounded-xl border border-amber-200 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-amber-900">Clinician Configurable Range:</span>
                  <span className="font-mono text-amber-800 bg-amber-100 px-2 py-0.5 rounded font-bold">
                    Allowed: {currentInjuryObj.min} – {currentInjuryObj.max}
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min={currentInjuryObj.min}
                    max={currentInjuryObj.max}
                    step="0.05"
                    value={injuryFactorValue}
                    onChange={(e) => handleCustomFactorInput(e.target.value)}
                    className="w-full accent-amber-600 cursor-pointer"
                  />
                  <div className="w-24 flex-shrink-0">
                    <input
                      type="number"
                      step="0.01"
                      min={currentInjuryObj.min}
                      max={currentInjuryObj.max}
                      value={injuryFactorValue}
                      onChange={(e) => handleCustomFactorInput(e.target.value)}
                      className="clinical-input text-xs font-mono py-1.5"
                    />
                  </div>
                </div>

                {rangeError && (
                  <p className="text-[11px] text-rose-600 flex items-center gap-1 font-semibold">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    {rangeError}
                  </p>
                )}

                <p className="text-[11px] text-slate-500 leading-relaxed">
                  {currentInjuryObj.description}. The clinical nutritionist specifies the exact value within the allowable clinical range.
                </p>
              </div>
            ) : (
              <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600">
                <strong>Fixed Value Condition:</strong> Automatically applied factor of <strong>{currentInjuryObj.fixedValue.toFixed(2)}</strong> ({currentInjuryObj.description}).
              </div>
            )}
          </div>

          <div className="pt-3 text-[11px] text-slate-400">
            * Mandatory for definitive TEE calculation.
          </div>
        </div>

      </div>

      {/* DEFINITIVE TEE CALCULATION DISPLAY */}
      <div className="bg-gradient-to-br from-slate-900 via-brand-950 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-700/80 pb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-sky-400 font-mono">Definitive Project Formula</span>
            <h2 className="text-2xl sm:text-3xl font-black text-white font-sans mt-1">
              Total Energy Expenditure (TEE)
            </h2>
          </div>

          <div className="text-right">
            <div className="text-4xl sm:text-5xl font-black text-sky-300 font-mono">
              {formulas?.tee || '—'}
            </div>
            <div className="text-xs text-slate-400 font-semibold tracking-wider uppercase mt-1">
              kcal / day
            </div>
          </div>
        </div>

        {/* Formula breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          
          <div className="bg-white/10 rounded-xl p-4 border border-white/10 backdrop-blur space-y-1">
            <span className="text-xs text-slate-400 font-mono">BMR</span>
            <div className="text-xl font-bold font-mono text-white">{formulas?.bmr} kcal</div>
            <div className="text-[11px] text-slate-300">Basal metabolic rate</div>
          </div>

          <div className="bg-white/10 rounded-xl p-4 border border-white/10 backdrop-blur space-y-1">
            <span className="text-xs text-slate-400 font-mono">Activity Factor</span>
            <div className="text-xl font-bold font-mono text-white">{autoActivityFactor.toFixed(2)}</div>
            <div className="text-[11px] text-slate-300">{currentActivityObj.name}</div>
          </div>

          <div className="bg-white/10 rounded-xl p-4 border border-white/10 backdrop-blur space-y-1">
            <span className="text-xs text-slate-400 font-mono">Injury Factor</span>
            <div className="text-xl font-bold font-mono text-white">{parseFloat(injuryFactorValue || 1).toFixed(2)}</div>
            <div className="text-[11px] text-slate-300">{currentInjuryObj.name}</div>
          </div>

        </div>

        {/* Audit string */}
        <div className="bg-black/30 rounded-xl p-4 border border-white/10 font-mono text-xs sm:text-sm text-sky-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <span>TEE Equation: BMR × Activity × Injury</span>
          <span className="font-bold text-white bg-white/10 px-3 py-1 rounded">
            {formulas?.breakdowns?.tee || `${formulas?.bmr} × ${autoActivityFactor.toFixed(2)} × ${parseFloat(injuryFactorValue || 1).toFixed(2)} = ${formulas?.tee} kcal/day`}
          </span>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-end gap-4">
          <button
            onClick={handleProceedToFinal}
            className="w-full sm:w-auto bg-sky-400 hover:bg-sky-300 text-slate-950 font-bold py-3 px-8 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 text-sm"
          >
            <span>Review Final Assessment Report</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
}
