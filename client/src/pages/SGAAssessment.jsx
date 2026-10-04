import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Stethoscope, 
  Scale, 
  Utensils, 
  Activity, 
  Eye, 
  ArrowRight, 
  CheckCircle2, 
  Info,
  FileEdit
} from 'lucide-react';
import { useAssessment } from '../context/AssessmentContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { evaluateSGA } from '../services/assessmentEvaluators.js';

export default function SGAAssessment() {
  const navigate = useNavigate();
  const { patientDetails, updateAssessmentData, setAssessmentResult } = useAssessment();
  const { success } = useToast();

  const [medicalHistory, setMedicalHistory] = useState({
    usualWeight: '',
    currentWeight: patientDetails.weight || '',
    past6MonthsLoss: '0–<5% loss',
    past2WeeksChange: 'No change; normal weight',
    dietaryIntake: 'No change; adequate',
    dietaryDuration: '',
    giSymptoms: {
      nausea: 'None / intermittent',
      vomiting: 'None / intermittent',
      diarrhea: 'None / intermittent',
      anorexia: 'None / intermittent'
    },
    functionalCapacity: 'No dysfunction',
    functionalDuration: '',
    functionalTrend: 'No change'
  });

  const [physicalExam, setPhysicalExam] = useState({
    subcutaneousFat: {
      underEyes: 'A - Normal',
      triceps: 'A - Normal',
      biceps: 'A - Normal'
    },
    muscleWasting: {
      temple: 'A - Normal',
      clavicle: 'A - Normal',
      shoulder: 'A - Normal',
      scapulaRibs: 'A - Normal',
      quadriceps: 'A - Normal',
      calf: 'A - Normal',
      knee: 'A - Normal',
      interosseous: 'A - Normal'
    },
    oedema: 'No sign',
    ascites: 'No sign'
  });

  const [overallRating, setOverallRating] = useState('A');
  const [clinicalNotes, setClinicalNotes] = useState('');

  // Live evaluation
  const liveResult = evaluateSGA({ medicalHistory, physicalExam, overallRating, clinicalNotes });

  const handleCalculateAndProceed = () => {
    const assessmentPayload = {
      medicalHistory,
      physicalExam,
      overallRating,
      clinicalNotes
    };

    updateAssessmentData(assessmentPayload);
    setAssessmentResult(liveResult);
    success('SGA qualitative evaluation recorded successfully.');
    navigate('/screening-result');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-clinical">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
              <Stethoscope className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-teal-600 font-mono">
                SGA Clinical Assessment
              </div>
              <h1 className="text-2xl font-black text-slate-900 font-sans">
                Subjective Global Assessment
              </h1>
            </div>
          </div>

          <div className="text-right sm:border-l sm:pl-6 border-slate-200">
            <div className="text-xs text-slate-500">Patient: <strong className="text-slate-900">{patientDetails.name || 'Anonymous'}</strong></div>
            <div className="text-xs text-slate-500 mt-0.5">
              Weight: <strong className="text-slate-900 font-mono">{patientDetails.weight} kg</strong> | Height: <strong className="text-slate-900 font-mono">{patientDetails.height} cm</strong>
            </div>
          </div>
        </div>

        <div className="mt-4 p-3 bg-teal-50/60 rounded-xl border border-teal-100 text-xs text-teal-900 leading-relaxed">
          <strong>SGA Clinical Structure:</strong> Combines structured medical history with detailed physical examination of fat and muscle wasting. The final rating is an integrated clinical determination: <strong>A (Well nourished)</strong>, <strong>B (Moderately malnourished / suspected)</strong>, or <strong>C (Severely malnourished)</strong>.
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: The Assessment Forms */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* PART 1: MEDICAL HISTORY */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-clinical space-y-6">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <span className="w-6 h-6 rounded-full bg-teal-600 text-white text-xs font-bold flex items-center justify-center">1</span>
              <h2 className="text-base font-bold text-slate-900">Medical History</h2>
            </div>

            {/* A. Weight History */}
            <div className="space-y-3 bg-slate-50/60 p-4 rounded-xl border border-slate-200/80">
              <label className="text-sm font-bold text-slate-900 block flex items-center gap-2">
                <Scale className="w-4 h-4 text-teal-600" />
                A. Weight Change History
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Weight Change During Past 6 Months</label>
                  <select
                    value={medicalHistory.past6MonthsLoss}
                    onChange={(e) => setMedicalHistory(prev => ({ ...prev, past6MonthsLoss: e.target.value }))}
                    className="clinical-select text-xs"
                  >
                    <option value="0–<5% loss">0–&lt;5% loss (Normal / minimal)</option>
                    <option value="5–10% loss">5–10% loss (Moderate loss)</option>
                    <option value=">10% loss">&gt;10% loss (Severe loss)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Weight Change During Past 2 Weeks</label>
                  <select
                    value={medicalHistory.past2WeeksChange}
                    onChange={(e) => setMedicalHistory(prev => ({ ...prev, past2WeeksChange: e.target.value }))}
                    className="clinical-select text-xs"
                  >
                    <option value="No change; normal weight">No change; normal weight</option>
                    <option value="Increase to within 5%">Increase to within 5%</option>
                    <option value="Increase one level above">Increase one level above</option>
                    <option value="No change but below usual weight">No change but below usual weight</option>
                    <option value="Increase to within 5–10%">Increase to within 5–10%</option>
                    <option value="Decrease">Decrease (Continuing active loss)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* B. Dietary Intake */}
            <div className="space-y-3 bg-slate-50/60 p-4 rounded-xl border border-slate-200/80">
              <label className="text-sm font-bold text-slate-900 block flex items-center gap-2">
                <Utensils className="w-4 h-4 text-teal-600" />
                B. Dietary Intake
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Current Dietary Pattern</label>
                  <select
                    value={medicalHistory.dietaryIntake}
                    onChange={(e) => setMedicalHistory(prev => ({ ...prev, dietaryIntake: e.target.value }))}
                    className="clinical-select text-xs"
                  >
                    <option value="No change; adequate">No change; adequate</option>
                    <option value="No change; inadequate">No change; inadequate</option>
                    <option value="Suboptimal diet">Suboptimal diet (Solid but reduced)</option>
                    <option value="Full liquid">Full liquid diet</option>
                    <option value="Hypocaloric liquid">Hypocaloric liquid</option>
                    <option value="Starvation">Starvation / NPO</option>
                    <option value="Intake borderline; increasing">Intake borderline; increasing</option>
                    <option value="Intake borderline; decreasing">Intake borderline; decreasing</option>
                    <option value="Intake poor; no change">Intake poor; no change</option>
                    <option value="Intake poor; increasing">Intake poor; increasing</option>
                    <option value="Intake poor; decreasing">Intake poor; decreasing</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Duration of Dietary Change</label>
                  <input
                    type="text"
                    value={medicalHistory.dietaryDuration}
                    onChange={(e) => setMedicalHistory(prev => ({ ...prev, dietaryDuration: e.target.value }))}
                    placeholder="e.g. 3 weeks, 2 months"
                    className="clinical-input text-xs"
                  />
                </div>
              </div>
            </div>

            {/* C. GI Symptoms */}
            <div className="space-y-3 bg-slate-50/60 p-4 rounded-xl border border-slate-200/80">
              <label className="text-sm font-bold text-slate-900 block">
                C. Gastrointestinal Symptoms (Daily &gt;2 weeks)
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                {['nausea', 'vomiting', 'diarrhea', 'anorexia'].map((s) => (
                  <div key={s} className="bg-white p-2.5 rounded-lg border border-slate-200 space-y-1">
                    <span className="font-bold text-slate-800 capitalize">{s}</span>
                    <select
                      value={medicalHistory.giSymptoms[s]}
                      onChange={(e) => setMedicalHistory(prev => ({
                        ...prev,
                        giSymptoms: { ...prev.giSymptoms, [s]: e.target.value }
                      }))}
                      className="clinical-select text-[11px] py-1"
                    >
                      <option value="None / intermittent">None / intermittent</option>
                      <option value="Some (daily >2 weeks)">Daily &gt;2 weeks</option>
                      <option value="Severe">Severe constant</option>
                    </select>
                  </div>
                ))}
              </div>
            </div>

            {/* D. Functional Capacity */}
            <div className="space-y-3 bg-slate-50/60 p-4 rounded-xl border border-slate-200/80">
              <label className="text-sm font-bold text-slate-900 block flex items-center gap-2">
                <Activity className="w-4 h-4 text-teal-600" />
                D. Functional Capacity
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Functional Impairment</label>
                  <select
                    value={medicalHistory.functionalCapacity}
                    onChange={(e) => setMedicalHistory(prev => ({ ...prev, functionalCapacity: e.target.value }))}
                    className="clinical-select text-xs"
                  >
                    <option value="No dysfunction">No dysfunction</option>
                    <option value="Difficulty with ambulation / normal activities">Difficulty with ambulation / work</option>
                    <option value="Bed/chair-ridden">Bed or chair-ridden</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Duration of Dysfunction</label>
                  <input
                    type="text"
                    value={medicalHistory.functionalDuration}
                    onChange={(e) => setMedicalHistory(prev => ({ ...prev, functionalDuration: e.target.value }))}
                    placeholder="e.g. 4 weeks"
                    className="clinical-input text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Change Past 2 Weeks</label>
                  <select
                    value={medicalHistory.functionalTrend}
                    onChange={(e) => setMedicalHistory(prev => ({ ...prev, functionalTrend: e.target.value }))}
                    className="clinical-select text-xs"
                  >
                    <option value="Improved">Improved</option>
                    <option value="No change">No change</option>
                    <option value="Regressed">Regressed</option>
                  </select>
                </div>
              </div>
            </div>

          </div>

          {/* PART 2: PHYSICAL EXAMINATION */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-clinical space-y-6">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <span className="w-6 h-6 rounded-full bg-teal-600 text-white text-xs font-bold flex items-center justify-center">2</span>
              <h2 className="text-base font-bold text-slate-900">Physical Examination</h2>
            </div>

            {/* Subcutaneous Fat Loss */}
            <div className="space-y-3 bg-slate-50/60 p-4 rounded-xl border border-slate-200/80">
              <label className="text-sm font-bold text-slate-900 block flex items-center gap-2">
                <Eye className="w-4 h-4 text-teal-600" />
                A. Loss of Subcutaneous Fat
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                {[
                  { key: 'underEyes', label: 'Under Eyes (Orbital Fat)' },
                  { key: 'triceps', label: 'Triceps' },
                  { key: 'biceps', label: 'Biceps / Chest' }
                ].map(({ key, label }) => (
                  <div key={key} className="bg-white p-3 rounded-lg border border-slate-200 space-y-1">
                    <span className="font-semibold text-slate-700">{label}</span>
                    <select
                      value={physicalExam.subcutaneousFat[key]}
                      onChange={(e) => setPhysicalExam(prev => ({
                        ...prev,
                        subcutaneousFat: { ...prev.subcutaneousFat, [key]: e.target.value }
                      }))}
                      className="clinical-select text-xs"
                    >
                      <option value="A - Normal">A - Normal (0 / No loss)</option>
                      <option value="B - Mild/Moderate loss">B - Mild/Moderate loss (+1)</option>
                      <option value="C - Severe loss">C - Severe hollow loss (+2)</option>
                    </select>
                  </div>
                ))}
              </div>
            </div>

            {/* Muscle Wasting */}
            <div className="space-y-3 bg-slate-50/60 p-4 rounded-xl border border-slate-200/80">
              <label className="text-sm font-bold text-slate-900 block">
                B. Muscle Wasting (8 Anatomical Sites)
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                {[
                  { key: 'temple', label: 'Temples' },
                  { key: 'clavicle', label: 'Clavicles' },
                  { key: 'shoulder', label: 'Shoulders (Acromion)' },
                  { key: 'scapulaRibs', label: 'Scapula / Ribs' },
                  { key: 'quadriceps', label: 'Quadriceps' },
                  { key: 'calf', label: 'Calf muscle' },
                  { key: 'knee', label: 'Knee bones' },
                  { key: 'interosseous', label: 'Interosseous (Thumb)' }
                ].map(({ key, label }) => (
                  <div key={key} className="bg-white p-2.5 rounded-lg border border-slate-200 space-y-1">
                    <span className="font-semibold text-slate-700 block truncate">{label}</span>
                    <select
                      value={physicalExam.muscleWasting[key]}
                      onChange={(e) => setPhysicalExam(prev => ({
                        ...prev,
                        muscleWasting: { ...prev.muscleWasting, [key]: e.target.value }
                      }))}
                      className="clinical-select text-[11px] py-1"
                    >
                      <option value="A - Normal">A - Normal</option>
                      <option value="B - Mild/Moderate">B - Mild/Mod</option>
                      <option value="C - Severe wasting">C - Severe</option>
                    </select>
                  </div>
                ))}
              </div>
            </div>

            {/* Oedema & Ascites */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-slate-50/60 p-4 rounded-xl border border-slate-200/80 space-y-2">
                <label className="text-xs font-bold text-slate-800 block">C. Ankle / Sacral Oedema</label>
                <select
                  value={physicalExam.oedema}
                  onChange={(e) => setPhysicalExam(prev => ({ ...prev, oedema: e.target.value }))}
                  className="clinical-select text-xs"
                >
                  <option value="No sign">No sign (0)</option>
                  <option value="Mild to moderate">Mild to moderate (+1 / +2)</option>
                  <option value="Severe">Severe (+3)</option>
                </select>
              </div>

              <div className="bg-slate-50/60 p-4 rounded-xl border border-slate-200/80 space-y-2">
                <label className="text-xs font-bold text-slate-800 block">D. Ascites</label>
                <select
                  value={physicalExam.ascites}
                  onChange={(e) => setPhysicalExam(prev => ({ ...prev, ascites: e.target.value }))}
                  className="clinical-select text-xs"
                >
                  <option value="No sign">No sign (0)</option>
                  <option value="Mild to moderate">Mild to moderate</option>
                  <option value="Severe">Severe</option>
                </select>
              </div>
            </div>

          </div>

        </div>

        {/* Right Col: Overall Qualitative Clinical Rating */}
        <div className="space-y-6">
          <div className="sticky top-20 bg-white rounded-2xl border-2 border-teal-300 p-6 shadow-clinical-lg space-y-5">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-teal-600 font-mono">Clinician Rating</span>
              <h3 className="text-xl font-black text-slate-900 mt-1 font-sans">
                Overall SGA Rating
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Select final clinical classification based on combined history and physical findings.
              </p>
            </div>

            {/* 3 Rating Choices */}
            <div className="space-y-3">
              {[
                {
                  rating: 'A',
                  title: 'SGA-A: Well Nourished',
                  desc: 'Normal weight, no significant loss, adequate dietary intake, no physical wasting.'
                },
                {
                  rating: 'B',
                  title: 'SGA-B: Moderately Malnourished',
                  desc: '5–10% weight loss, reduced intake, mild-to-moderate fat or muscle wasting.'
                },
                {
                  rating: 'C',
                  title: 'SGA-C: Severely Malnourished',
                  desc: '>10% progressive weight loss, severe dietary deficit, functional impairment, severe muscle wasting, oedema.'
                }
              ].map((item) => (
                <label
                  key={item.rating}
                  className={`block p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    overallRating === item.rating
                      ? 'border-teal-600 bg-teal-50/50 shadow-sm'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="radio"
                      name="overallRating"
                      value={item.rating}
                      checked={overallRating === item.rating}
                      onChange={(e) => setOverallRating(e.target.value)}
                      className="mt-1 text-teal-600 focus:ring-teal-500"
                    />
                    <div>
                      <div className="text-sm font-bold text-slate-900">{item.title}</div>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                </label>
              ))}
            </div>

            {/* Clinical Summary Notes */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <FileEdit className="w-3.5 h-3.5 text-teal-600" />
                <span>Clinical Impression / Findings Summary</span>
              </label>
              <textarea
                rows={3}
                value={clinicalNotes}
                onChange={(e) => setClinicalNotes(e.target.value)}
                placeholder="Document key clinical findings, oral nutrition tolerance, or GI symptoms..."
                className="clinical-input text-xs"
              />
            </div>

            <button
              type="button"
              onClick={handleCalculateAndProceed}
              className="bg-teal-600 hover:bg-teal-700 text-white w-full py-3 rounded-xl text-sm font-bold shadow-md transition-all flex items-center justify-center gap-2"
            >
              <span>Confirm & View SGA Result</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
