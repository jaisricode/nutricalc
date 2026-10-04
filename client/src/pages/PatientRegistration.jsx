import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Scale, 
  Ruler, 
  Calendar, 
  MapPin, 
  Hash, 
  FileSpreadsheet, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle,
  Stethoscope,
  Calculator
} from 'lucide-react';
import { useAssessment } from '../context/AssessmentContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

export default function PatientRegistration() {
  const navigate = useNavigate();
  const { patientDetails, updatePatientDetails, setWorkflowMode } = useAssessment();
  const { error } = useToast();

  const [formData, setFormData] = useState({
    name: patientDetails.name || '',
    weight: patientDetails.weight || '',
    height: patientDetails.height || '',
    age: patientDetails.age || '',
    gender: patientDetails.gender || 'Male',
    ipNo: patientDetails.ipNo || '',
    district: patientDetails.district || '',
    state: patientDetails.state || '',
    pincode: patientDetails.pincode || ''
  });

  const [validationErrors, setValidationErrors] = useState({});

  const validate = () => {
    const errs = {};
    const nameTrim = (formData.name || '').trim();
    if (!nameTrim) errs.name = 'Patient name is required.';

    const w = parseFloat(formData.weight);
    if (isNaN(w) || w <= 0) errs.weight = 'Weight must be greater than 0 kg.';
    else if (w > 400) errs.weight = 'Please enter a realistic weight (<400 kg).';

    const h = parseFloat(formData.height);
    if (isNaN(h) || h <= 0) errs.height = 'Height must be greater than 0 cm.';
    else if (h > 260) errs.height = 'Please enter a realistic height (<260 cm).';

    const a = parseFloat(formData.age);
    if (isNaN(a) || a < 0) errs.age = 'Age must be a valid positive number.';
    else if (a > 125) errs.age = 'Please enter a realistic age.';

    if (!formData.gender) errs.gender = 'Gender is required.';

    if (!formData.district?.trim()) errs.district = 'District is required.';
    if (!formData.state?.trim()) errs.state = 'State is required.';

    const pin = (formData.pincode || '').toString().trim();
    if (!pin) errs.pincode = 'Pincode is required.';
    else if (pin.length < 4 || pin.length > 10) errs.pincode = 'Enter a valid postal/zip code (4-10 digits).';

    setValidationErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleProceed = (destination) => {
    if (!validate()) {
      error('Please fix the validation errors before proceeding.');
      return;
    }

    // Save trimmed clean data to global context
    const cleanData = {
      ...formData,
      name: formData.name.trim(),
      weight: parseFloat(formData.weight),
      height: parseFloat(formData.height),
      age: parseFloat(formData.age),
      district: formData.district.trim(),
      state: formData.state.trim(),
      pincode: formData.pincode.toString().trim(),
      ipNo: formData.ipNo ? formData.ipNo.trim() : ''
    };

    updatePatientDetails(cleanData);

    if (destination === 'screening') {
      setWorkflowMode('screening');
      navigate('/select-tool');
    } else {
      setWorkflowMode('formulas');
      navigate('/formulas');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Page Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 font-sans">
          Nutri<span className="text-brand-600">Calc</span>
        </h1>
        <p className="text-base font-semibold text-slate-600">
          Nutrition Assessment & Calculation System
        </p>
        <p className="text-xs text-slate-500 max-w-xl mx-auto">
          Please register patient anthropometric measurements and clinical identifiers. Patient data persists securely across assessment and calculation routes.
        </p>
      </div>

      {/* Patient Registration Form Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-clinical space-y-6">
        <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
          <User className="w-5 h-5 text-brand-600" />
          <h2 className="text-lg font-bold text-slate-900">Patient Details & Anthropometry</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          
          {/* 1. Patient Name */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Patient Full Name <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g. John Doe"
                className={`clinical-input ${validationErrors.name ? 'border-rose-400 focus:ring-rose-200' : ''}`}
              />
            </div>
            {validationErrors.name && (
              <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3 h-3" /> {validationErrors.name}
              </p>
            )}
          </div>

          {/* 2. IP Number */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              IP / Inpatient Number <span className="text-slate-400 font-normal">(Optional)</span>
            </label>
            <div className="relative">
              <input
                type="text"
                name="ipNo"
                value={formData.ipNo}
                onChange={handleInputChange}
                placeholder="e.g. IP-2026-904"
                className="clinical-input font-mono"
              />
            </div>
          </div>

          {/* 3. Weight */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Weight (kg) <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.1"
                min="1"
                name="weight"
                value={formData.weight}
                onChange={handleInputChange}
                placeholder="e.g. 70"
                className={`clinical-input font-mono ${validationErrors.weight ? 'border-rose-400' : ''}`}
              />
              <span className="absolute right-3 top-2.5 text-xs font-semibold text-slate-400 pointer-events-none">kg</span>
            </div>
            {validationErrors.weight && (
              <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3 h-3" /> {validationErrors.weight}
              </p>
            )}
          </div>

          {/* 4. Height */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Height (cm) <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.5"
                min="1"
                name="height"
                value={formData.height}
                onChange={handleInputChange}
                placeholder="e.g. 170"
                className={`clinical-input font-mono ${validationErrors.height ? 'border-rose-400' : ''}`}
              />
              <span className="absolute right-3 top-2.5 text-xs font-semibold text-slate-400 pointer-events-none">cm</span>
            </div>
            {validationErrors.height && (
              <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3 h-3" /> {validationErrors.height}
              </p>
            )}
          </div>

          {/* 5. Age */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Age (Years) <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type="number"
                min="0"
                max="125"
                name="age"
                value={formData.age}
                onChange={handleInputChange}
                placeholder="e.g. 45"
                className={`clinical-input font-mono ${validationErrors.age ? 'border-rose-400' : ''}`}
              />
              <span className="absolute right-3 top-2.5 text-xs font-semibold text-slate-400 pointer-events-none">yrs</span>
            </div>
            {validationErrors.age && (
              <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3 h-3" /> {validationErrors.age}
              </p>
            )}
          </div>

          {/* 6. Gender */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Gender <span className="text-rose-500">*</span>
            </label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              className="clinical-select"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          {/* 7. District */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              District <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="district"
              value={formData.district}
              onChange={handleInputChange}
              placeholder="e.g. Bengaluru Urban"
              className={`clinical-input ${validationErrors.district ? 'border-rose-400' : ''}`}
            />
            {validationErrors.district && (
              <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3 h-3" /> {validationErrors.district}
              </p>
            )}
          </div>

          {/* 8. State */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              State <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleInputChange}
              placeholder="e.g. Karnataka"
              className={`clinical-input ${validationErrors.state ? 'border-rose-400' : ''}`}
            />
            {validationErrors.state && (
              <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3 h-3" /> {validationErrors.state}
              </p>
            )}
          </div>

          {/* 9. Pincode */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Pincode / Postal Code <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="pincode"
              value={formData.pincode}
              onChange={handleInputChange}
              placeholder="e.g. 560001"
              className={`clinical-input font-mono ${validationErrors.pincode ? 'border-rose-400' : ''}`}
            />
            {validationErrors.pincode && (
              <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3 h-3" /> {validationErrors.pincode}
              </p>
            )}
          </div>

        </div>
      </div>

      {/* Two Large Professional Choice Cards Per Specification */}
      <div className="space-y-4">
        <div className="text-center">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
            Select Desired Assessment Workflow
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Choose whether to perform full malnutrition screening or proceed directly to nutritional formulas.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* CARD 1: Screening Tools */}
          <div
            onClick={() => handleProceed('screening')}
            className="group cursor-pointer bg-white rounded-2xl border-2 border-brand-200 p-6 sm:p-7 shadow-clinical hover:shadow-clinical-lg hover:border-brand-600 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center group-hover:bg-brand-600 group-hover:text-white transition-colors">
                  <Stethoscope className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-brand-50 text-brand-700 border border-brand-200">
                  Option 1
                </span>
              </div>

              <h3 className="text-xl font-bold text-slate-900 group-hover:text-brand-700 transition-colors">
                Screening Tools
              </h3>

              <p className="text-sm text-slate-600 mt-2.5 leading-relaxed">
                "Perform nutritional and malnutrition screening using standardized assessment tools."
              </p>

              <div className="mt-4 flex flex-wrap gap-1.5">
                {['GLIM', 'SGA', 'MNA', 'MUST'].map((t) => (
                  <span key={t} className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-brand-600 font-semibold text-sm group-hover:translate-x-1 transition-transform">
              <span>Continue with Screening</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>

          {/* CARD 2: Formulas */}
          <div
            onClick={() => handleProceed('formulas')}
            className="group cursor-pointer bg-white rounded-2xl border-2 border-emerald-200 p-6 sm:p-7 shadow-clinical hover:shadow-clinical-lg hover:border-emerald-600 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  <Calculator className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Option 2
                </span>
              </div>

              <h3 className="text-xl font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                Formulas
              </h3>

              <p className="text-sm text-slate-600 mt-2.5 leading-relaxed">
                "Calculate BMI, IBW, ABW, BMR and Total Energy Requirement."
              </p>

              <div className="mt-4 flex flex-wrap gap-1.5">
                {['BMI', 'IBW', 'ABW', 'BMR', 'TEE'].map((f) => (
                  <span key={f} className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                    {f}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-emerald-600 font-semibold text-sm group-hover:translate-x-1 transition-transform">
              <span>Direct Formula Calculation</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
