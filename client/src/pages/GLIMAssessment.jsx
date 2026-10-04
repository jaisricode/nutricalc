import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Activity, 
  Scale, 
  HeartPulse, 
  Stethoscope, 
  Flame, 
  FlaskConical, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle,
  Info
} from 'lucide-react';
import { useAssessment } from '../context/AssessmentContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { evaluateGLIM } from '../services/assessmentEvaluators.js';
import { calculateBMI } from '../services/calculationEngine.js';

export default function GLIMAssessment() {
  const navigate = useNavigate();
  const { patientDetails, updateAssessmentData, setAssessmentResult } = useAssessment();
  const { success, error } = useToast();

  const [weightLoss, setWeightLoss] = useState({
    usualWeight: '',
    currentWeight: patientDetails.weight || '',
    timePeriod: 'within_6_months',
    hasUnintentionalWeightLoss: false,
    manualStage: 'Stage 1 (Moderate)'
  });

  const [bmiData, setBmiData] = useState({
    useAsianThreshold: true,
    bmiValue: patientDetails.weight && patientDetails.height ? calculateBMI(patientDetails.weight, patientDetails.height).value : ''
  });

  const [muscleMass, setMuscleMass] = useState({
    isReduced: false,
    assessmentMethod: 'Physical examination',
    details: ''
  });

  const [foodIntake, setFoodIntake] = useState({
    ingestion50Percent1to2Weeks: false,
    intakeReductionOver2Weeks: false,
    chronicGICondition: false,
    symptoms: []
  });

  const [diseaseBurden, setDiseaseBurden] = useState({
    hasAcuteDisease: false,
    acuteDiseaseType: '',
    hasChronicDisease: false,
    chronicDiseaseType: '',
    crp: '',
    albumin: '',
    preAlbumin: ''
  });

  // Calculate live preview
  const liveResult = evaluateGLIM(
    { weightLoss, bmiData, muscleMass, foodIntake, diseaseBurden },
    patientDetails
  );

  const handleSymptomToggle = (symptom) => {
    setFoodIntake(prev => {
      const exists = prev.symptoms.includes(symptom);
      return {
        ...prev,
        symptoms: exists ? prev.symptoms.filter(s => s !== symptom) : [...prev.symptoms, symptom]
      };
    });
  };

  const handleCalculateAndProceed = () => {
    const assessmentPayload = {
      weightLoss,
      bmiData,
      muscleMass,
      foodIntake,
      diseaseBurden
    };

    updateAssessmentData(assessmentPayload);
    setAssessmentResult(liveResult);
    success('GLIM diagnostic criteria evaluated successfully.');
    navigate('/screening-result');
  };

  const age = parseFloat(patientDetails.age || 0);
  const isElderly = age >= 70;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-clinical">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-blue-600 font-mono">
                GLIM Diagnostic Framework
              </div>
              <h1 className="text-2xl font-black text-slate-900 font-sans">
                Global Leadership Initiative on Malnutrition
              </h1>
            </div>
          </div>

          <div className="text-right sm:border-l sm:pl-6 border-slate-200">
            <div className="text-xs text-slate-500">Patient: <strong className="text-slate-900">{patientDetails.name || 'Anonymous'}</strong></div>
            <div className="text-xs text-slate-500 mt-0.5">
              Age: <strong className="text-slate-900">{patientDetails.age}y</strong> | BMI: <strong className="text-slate-900 font-mono">{liveResult.criteria.phenotypic.lowBMI.bmi} kg/m²</strong>
            </div>
          </div>
        </div>

        <div className="mt-4 p-3 bg-blue-50/60 rounded-xl border border-blue-100 text-xs text-blue-900 leading-relaxed">
          <strong>GLIM Diagnostic Rule:</strong> Diagnosis of malnutrition requires at least <strong>1 Phenotypic criterion</strong> AND at least <strong>1 Etiologic criterion</strong>. Severity grading (Stage 1 Moderate vs Stage 2 Severe) is determined by phenotypic severity.
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: The Assessment Forms */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* SECTION A: PHENOTYPIC CRITERIA */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-clinical space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">A</span>
                <h2 className="text-base font-bold text-slate-900">Phenotypic Criteria (Any 1 required)</h2>
              </div>
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${liveResult.criteria.phenotypic.positive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'}`}>
                {liveResult.criteria.phenotypic.count} / 3 Positive
              </span>
            </div>

            {/* 1. Unintentional Weight Loss */}
            <div className="space-y-3 bg-slate-50/60 p-4 rounded-xl border border-slate-200/80">
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Scale className="w-4 h-4 text-blue-600" />
                  1. Unintentional Weight Loss
                </label>
                {liveResult.criteria.phenotypic.weightLoss.positive && (
                  <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                    Positive ({liveResult.criteria.phenotypic.weightLoss.stage})
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Usual / Previous Weight (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={weightLoss.usualWeight}
                    onChange={(e) => setWeightLoss(prev => ({ ...prev, usualWeight: e.target.value }))}
                    placeholder="e.g. 75"
                    className="clinical-input font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Current Weight (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={weightLoss.currentWeight}
                    onChange={(e) => setWeightLoss(prev => ({ ...prev, currentWeight: e.target.value }))}
                    className="clinical-input font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Time Period</label>
                  <select
                    value={weightLoss.timePeriod}
                    onChange={(e) => setWeightLoss(prev => ({ ...prev, timePeriod: e.target.value }))}
                    className="clinical-select text-xs"
                  >
                    <option value="within_6_months">Within past 6 months</option>
                    <option value="beyond_6_months">Beyond 6 months</option>
                  </select>
                </div>
              </div>

              {liveResult.criteria.phenotypic.weightLoss.percentage > 0 && (
                <div className="text-xs font-mono text-slate-700 bg-white p-2.5 rounded border border-slate-200 flex items-center justify-between">
                  <span>Calculated Loss: <strong>{liveResult.criteria.phenotypic.weightLoss.percentage}%</strong></span>
                  <span className="text-slate-500">{liveResult.criteria.phenotypic.weightLoss.note}</span>
                </div>
              )}
            </div>

            {/* 2. Low BMI */}
            <div className="space-y-3 bg-slate-50/60 p-4 rounded-xl border border-slate-200/80">
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <HeartPulse className="w-4 h-4 text-blue-600" />
                  2. Low Body Mass Index (BMI)
                </label>
                {liveResult.criteria.phenotypic.lowBMI.positive ? (
                  <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                    Positive ({liveResult.criteria.phenotypic.lowBMI.stage})
                  </span>
                ) : (
                  <span className="text-xs text-slate-400">Within Threshold</span>
                )}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 text-xs bg-white p-3 rounded-lg border border-slate-200">
                <div>
                  <span className="text-slate-500">Patient BMI:</span> <strong className="font-mono text-slate-900 text-sm">{liveResult.criteria.phenotypic.lowBMI.bmi} kg/m²</strong>
                  <span className="text-slate-400 ml-2">({patientDetails.age || 0} years old)</span>
                </div>

                <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
                  <input
                    type="checkbox"
                    checked={bmiData.useAsianThreshold}
                    onChange={(e) => setBmiData(prev => ({ ...prev, useAsianThreshold: e.target.checked }))}
                    className="rounded text-brand-600 focus:ring-brand-500"
                  />
                  <span>Use Asian Specific BMI Thresholds</span>
                </label>
              </div>

              <div className="text-[11px] text-slate-500 leading-relaxed">
                <strong>Applicable Standard Thresholds:</strong><br />
                • Age &lt;70 years: BMI &lt;20.0 kg/m² (Asian: &lt;18.5 kg/m²). Stage 2 Severe: &lt;18.5 kg/m².<br />
                • Age ≥70 years: BMI &lt;22.0 kg/m² (Asian: &lt;20.0 kg/m²). Stage 2 Severe: &lt;20.0 kg/m² (Asian &lt;18.5).
              </div>
            </div>

            {/* 3. Reduced Muscle Mass */}
            <div className="space-y-3 bg-slate-50/60 p-4 rounded-xl border border-slate-200/80">
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Stethoscope className="w-4 h-4 text-blue-600" />
                  3. Reduced Muscle Mass
                </label>
                {muscleMass.isReduced && (
                  <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                    Positive
                  </span>
                )}
              </div>

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                  <input
                    type="radio"
                    name="isReduced"
                    checked={!muscleMass.isReduced}
                    onChange={() => setMuscleMass(prev => ({ ...prev, isReduced: false }))}
                    className="text-brand-600"
                  />
                  <span>No (Normal Muscle Mass)</span>
                </label>
                <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                  <input
                    type="radio"
                    name="isReduced"
                    checked={muscleMass.isReduced}
                    onChange={() => setMuscleMass(prev => ({ ...prev, isReduced: true }))}
                    className="text-brand-600"
                  />
                  <span className="text-rose-700">Yes (Reduced Muscle Mass Identified)</span>
                </label>
              </div>

              {muscleMass.isReduced && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Assessment Method</label>
                    <select
                      value={muscleMass.assessmentMethod}
                      onChange={(e) => setMuscleMass(prev => ({ ...prev, assessmentMethod: e.target.value }))}
                      className="clinical-select text-xs"
                    >
                      <option value="Physical examination">Physical examination</option>
                      <option value="DXA">Dual-energy X-ray absorptiometry (DXA)</option>
                      <option value="Bioelectrical impedance analysis (BIA)">Bioelectrical impedance analysis (BIA)</option>
                      <option value="Ultrasound">Ultrasound</option>
                      <option value="CT">Computed Tomography (CT)</option>
                      <option value="MRI">Magnetic Resonance Imaging (MRI)</option>
                      <option value="Mid-upper arm circumference">Mid-upper arm circumference (MUAC)</option>
                      <option value="Calf circumference">Calf circumference</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Clinical Findings / Metric (Optional)</label>
                    <input
                      type="text"
                      value={muscleMass.details}
                      onChange={(e) => setMuscleMass(prev => ({ ...prev, details: e.target.value }))}
                      placeholder="e.g. Calf circumference 29.5 cm (<31 cm)"
                      className="clinical-input text-xs"
                    />
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* SECTION B: ETIOLOGIC CRITERIA */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-clinical space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">B</span>
                <h2 className="text-base font-bold text-slate-900">Etiologic Criteria (Any 1 required)</h2>
              </div>
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${liveResult.criteria.etiologic.positive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'}`}>
                {liveResult.criteria.etiologic.count} / 2 Positive
              </span>
            </div>

            {/* 1. Reduced Food Intake / Assimilation */}
            <div className="space-y-3 bg-slate-50/60 p-4 rounded-xl border border-slate-200/80">
              <label className="text-sm font-bold text-slate-900 block">
                1. Reduced Food Intake or Assimilation
              </label>

              <div className="space-y-2">
                <label className="flex items-start gap-2.5 text-xs text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={foodIntake.ingestion50Percent1to2Weeks}
                    onChange={(e) => setFoodIntake(prev => ({ ...prev, ingestion50Percent1to2Weeks: e.target.checked }))}
                    className="mt-0.5 rounded text-brand-600"
                  />
                  <span>Ingestion ≤50% of energy requirements for &gt;1 week</span>
                </label>

                <label className="flex items-start gap-2.5 text-xs text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={foodIntake.intakeReductionOver2Weeks}
                    onChange={(e) => setFoodIntake(prev => ({ ...prev, intakeReductionOver2Weeks: e.target.checked }))}
                    className="mt-0.5 rounded text-brand-600"
                  />
                  <span>Any reduction in food intake for &gt;2 weeks</span>
                </label>

                <label className="flex items-start gap-2.5 text-xs text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={foodIntake.chronicGICondition}
                    onChange={(e) => setFoodIntake(prev => ({ ...prev, chronicGICondition: e.target.checked }))}
                    className="mt-0.5 rounded text-brand-600"
                  />
                  <span>Chronic gastrointestinal condition adversely affecting food assimilation / absorption</span>
                </label>
              </div>

              {/* GI Symptoms */}
              <div className="pt-2">
                <div className="text-[11px] font-semibold text-slate-600 mb-1.5">Active GI Symptoms:</div>
                <div className="flex flex-wrap gap-2">
                  {['Dysphagia', 'Nausea', 'Vomiting', 'Diarrhea', 'Constipation', 'Abdominal pain', 'Malabsorptive disorder', 'Anorexia'].map((s) => (
                    <button
                      type="button"
                      key={s}
                      onClick={() => handleSymptomToggle(s)}
                      className={`text-xs px-2.5 py-1 rounded-lg border transition-all ${
                        foodIntake.symptoms.includes(s)
                          ? 'bg-blue-600 text-white border-blue-600 font-semibold'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {foodIntake.symptoms.includes(s) ? `✓ ${s}` : `+ ${s}`}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 2. Disease Burden / Inflammation */}
            <div className="space-y-3 bg-slate-50/60 p-4 rounded-xl border border-slate-200/80">
              <label className="text-sm font-bold text-slate-900 block flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-600" />
                2. Disease Burden / Inflammation
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-2 bg-white p-3 rounded-lg border border-slate-200">
                  <label className="flex items-center gap-2 text-xs font-bold text-slate-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={diseaseBurden.hasAcuteDisease}
                      onChange={(e) => setDiseaseBurden(prev => ({ ...prev, hasAcuteDisease: e.target.checked }))}
                      className="rounded text-brand-600"
                    />
                    <span>Acute Disease / Severe Injury</span>
                  </label>
                  {diseaseBurden.hasAcuteDisease && (
                    <select
                      value={diseaseBurden.acuteDiseaseType}
                      onChange={(e) => setDiseaseBurden(prev => ({ ...prev, acuteDiseaseType: e.target.value }))}
                      className="clinical-select text-xs"
                    >
                      <option value="">Select condition...</option>
                      <option value="Major infection / Sepsis">Major infection / Sepsis</option>
                      <option value="Burns">Burns</option>
                      <option value="Trauma">Trauma</option>
                      <option value="Closed head injury">Closed head injury</option>
                      <option value="Other acute disease">Other acute illness</option>
                    </select>
                  )}
                </div>

                <div className="space-y-2 bg-white p-3 rounded-lg border border-slate-200">
                  <label className="flex items-center gap-2 text-xs font-bold text-slate-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={diseaseBurden.hasChronicDisease}
                      onChange={(e) => setDiseaseBurden(prev => ({ ...prev, hasChronicDisease: e.target.checked }))}
                      className="rounded text-brand-600"
                    />
                    <span>Chronic Disease-Related Inflammation</span>
                  </label>
                  {diseaseBurden.hasChronicDisease && (
                    <select
                      value={diseaseBurden.chronicDiseaseType}
                      onChange={(e) => setDiseaseBurden(prev => ({ ...prev, chronicDiseaseType: e.target.value }))}
                      className="clinical-select text-xs"
                    >
                      <option value="">Select condition...</option>
                      <option value="Malignant disease / Cancer">Malignant disease / Cancer</option>
                      <option value="COPD">COPD</option>
                      <option value="Congestive heart failure">Congestive heart failure</option>
                      <option value="Chronic kidney disease">Chronic kidney disease</option>
                      <option value="Other chronic inflammation">Other chronic condition</option>
                    </select>
                  )}
                </div>
              </div>

              {/* Supportive Labs */}
              <div className="pt-2 bg-white p-3 rounded-lg border border-slate-200 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                  <FlaskConical className="w-3.5 h-3.5 text-blue-600" />
                  <span>Supportive Laboratory Markers (Optional Research Data)</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[10px] text-slate-500">C-Reactive Protein (mg/L)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={diseaseBurden.crp}
                      onChange={(e) => setDiseaseBurden(prev => ({ ...prev, crp: e.target.value }))}
                      placeholder="e.g. 15.2"
                      className="clinical-input font-mono text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-500">Serum Albumin (g/dL)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={diseaseBurden.albumin}
                      onChange={(e) => setDiseaseBurden(prev => ({ ...prev, albumin: e.target.value }))}
                      placeholder="e.g. 3.2"
                      className="clinical-input font-mono text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-500">Pre-albumin (mg/dL)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={diseaseBurden.preAlbumin}
                      onChange={(e) => setDiseaseBurden(prev => ({ ...prev, preAlbumin: e.target.value }))}
                      placeholder="e.g. 14"
                      className="clinical-input font-mono text-xs"
                    />
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* Right Col: Live Diagnostic Summary & Action */}
        <div className="space-y-6">
          <div className="sticky top-20 bg-white rounded-2xl border-2 border-brand-200 p-6 shadow-clinical-lg space-y-5">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-brand-600 font-mono">Live GLIM Evaluation</span>
              <h3 className="text-xl font-black text-slate-900 mt-1 font-sans">
                Diagnostic Result
              </h3>
            </div>

            {/* Criteria Checklist */}
            <div className="space-y-3 pt-2 text-xs">
              <div className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">Phenotypic Criteria:</div>
              <div className="space-y-1.5 pl-1 font-medium">
                <div className="flex items-center gap-2">
                  <span className={liveResult.criteria.phenotypic.weightLoss.positive ? 'text-emerald-600 font-bold' : 'text-slate-300'}>
                    {liveResult.criteria.phenotypic.weightLoss.positive ? '✓' : '○'}
                  </span>
                  <span className={liveResult.criteria.phenotypic.weightLoss.positive ? 'text-slate-900 font-bold' : 'text-slate-500'}>
                    Unintentional Weight Loss
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={liveResult.criteria.phenotypic.lowBMI.positive ? 'text-emerald-600 font-bold' : 'text-slate-300'}>
                    {liveResult.criteria.phenotypic.lowBMI.positive ? '✓' : '○'}
                  </span>
                  <span className={liveResult.criteria.phenotypic.lowBMI.positive ? 'text-slate-900 font-bold' : 'text-slate-500'}>
                    Low BMI Threshold
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={liveResult.criteria.phenotypic.reducedMuscleMass.positive ? 'text-emerald-600 font-bold' : 'text-slate-300'}>
                    {liveResult.criteria.phenotypic.reducedMuscleMass.positive ? '✓' : '○'}
                  </span>
                  <span className={liveResult.criteria.phenotypic.reducedMuscleMass.positive ? 'text-slate-900 font-bold' : 'text-slate-500'}>
                    Reduced Muscle Mass
                  </span>
                </div>
              </div>

              <div className="font-bold text-slate-800 uppercase tracking-wider text-[11px] pt-2">Etiologic Criteria:</div>
              <div className="space-y-1.5 pl-1 font-medium">
                <div className="flex items-center gap-2">
                  <span className={liveResult.criteria.etiologic.reducedIntake.positive ? 'text-emerald-600 font-bold' : 'text-slate-300'}>
                    {liveResult.criteria.etiologic.reducedIntake.positive ? '✓' : '○'}
                  </span>
                  <span className={liveResult.criteria.etiologic.reducedIntake.positive ? 'text-slate-900 font-bold' : 'text-slate-500'}>
                    Reduced Food Intake / GI
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={liveResult.criteria.etiologic.diseaseBurden.positive ? 'text-emerald-600 font-bold' : 'text-slate-300'}>
                    {liveResult.criteria.etiologic.diseaseBurden.positive ? '✓' : '○'}
                  </span>
                  <span className={liveResult.criteria.etiologic.diseaseBurden.positive ? 'text-slate-900 font-bold' : 'text-slate-500'}>
                    Disease Burden / Inflammation
                  </span>
                </div>
              </div>
            </div>

            {/* Final Diagnostic Status Card */}
            <div className={`p-4 rounded-xl border ${
              liveResult.malnutritionIdentified
                ? 'bg-rose-50 border-rose-200 text-rose-900'
                : 'bg-emerald-50 border-emerald-200 text-emerald-900'
            }`}>
              <div className="text-xs font-semibold uppercase tracking-wider">Diagnosis:</div>
              <div className="text-base font-extrabold mt-0.5">
                {liveResult.classification}
              </div>
              {liveResult.malnutritionIdentified && (
                <div className="text-xs font-bold text-rose-700 mt-1">
                  Severity: {liveResult.severity}
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={handleCalculateAndProceed}
              className="clinical-btn-primary w-full py-3 text-sm font-bold shadow-md"
            >
              <span>Confirm & View Screening Result</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
