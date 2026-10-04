import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Activity, 
  ClipboardCheck, 
  Stethoscope, 
  HeartHandshake, 
  ShieldAlert, 
  ArrowRight, 
  User, 
  Calculator,
  Info
} from 'lucide-react';
import { useAssessment } from '../context/AssessmentContext.jsx';
import { SCREENING_TOOLS_INFO } from '../data/clinicalGuidelines.js';

export default function ToolSelection() {
  const navigate = useNavigate();
  const { patientDetails, setScreeningTool } = useAssessment();

  const handleSelectTool = (toolKey) => {
    setScreeningTool(toolKey);
    navigate(`/assessment/${toolKey.toLowerCase()}`);
  };

  const tools = [
    {
      key: 'GLIM',
      info: SCREENING_TOOLS_INFO.GLIM,
      icon: Activity,
      color: 'border-blue-200 hover:border-blue-500 bg-blue-50/20 text-blue-600',
      badge: 'Two-Step Diagnostic Framework',
      tags: ['Phenotypic Criteria', 'Etiologic Criteria', 'Severity Grading']
    },
    {
      key: 'SGA',
      info: SCREENING_TOOLS_INFO.SGA,
      icon: Stethoscope,
      color: 'border-teal-200 hover:border-teal-500 bg-teal-50/20 text-teal-600',
      badge: 'Subjective Global Gold Standard',
      tags: ['Medical History', 'Physical Exam', 'A/B/C Clinical Rating']
    },
    {
      key: 'MNA',
      info: SCREENING_TOOLS_INFO.MNA,
      icon: HeartHandshake,
      color: 'border-purple-200 hover:border-purple-500 bg-purple-50/20 text-purple-600',
      badge: '14-Point Validated Screening',
      tags: ['Food Intake', 'Mobility & Stress', 'BMI / Calf Circumference']
    },
    {
      key: 'MUST',
      info: SCREENING_TOOLS_INFO.MUST,
      icon: ShieldAlert,
      color: 'border-amber-200 hover:border-amber-500 bg-amber-50/20 text-amber-600',
      badge: '5-Step Universal Tool',
      tags: ['BMI Score', 'Weight Loss %', 'Acute Disease Effect', 'Care Guidelines']
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Patient Mini Banner */}
      {patientDetails.name && (
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-brand-50 text-brand-700 flex items-center justify-center font-bold text-sm">
              {patientDetails.name.charAt(0)}
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <span>{patientDetails.name}</span>
                {patientDetails.ipNo && (
                  <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                    {patientDetails.ipNo}
                  </span>
                )}
              </div>
              <div className="text-xs text-slate-500 flex items-center gap-3 mt-0.5">
                <span>{patientDetails.age} yrs</span>
                <span>•</span>
                <span>{patientDetails.gender}</span>
                <span>•</span>
                <span>{patientDetails.weight} kg</span>
                <span>•</span>
                <span>{patientDetails.height} cm</span>
              </div>
            </div>
          </div>

          <Link
            to="/register"
            className="text-xs font-semibold text-brand-600 hover:text-brand-700 underline"
          >
            Edit Patient Details
          </Link>
        </div>
      )}

      {/* Page Title */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-sans">
          Select Nutritional Screening & Assessment Tool
        </h1>
        <p className="text-sm text-slate-600 max-w-2xl mx-auto">
          Choose one of the four standardized clinical assessment instruments according to patient clinical setting and hospital protocol.
        </p>
      </div>

      {/* 4 Tool Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tools.map(({ key, info, icon: Icon, color, badge, tags }) => (
          <div
            key={key}
            className={`bg-white rounded-2xl border-2 p-6 sm:p-7 shadow-clinical hover:shadow-clinical-lg transition-all flex flex-col justify-between ${color}`}
          >
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-white shadow-sm border border-slate-200/80 flex items-center justify-center">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono">
                      {info.fullName}
                    </span>
                    <h2 className="text-2xl font-black text-slate-900 font-sans tracking-tight">
                      {info.id}
                    </h2>
                  </div>
                </div>

                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                  {badge}
                </span>
              </div>

              <p className="text-sm text-slate-600 leading-relaxed">
                {info.description}
              </p>

              <div className="space-y-2 pt-2">
                <div className="text-xs font-semibold text-slate-700">Criteria & Components:</div>
                <div className="flex flex-wrap gap-1.5">
                  {tags.map((t) => (
                    <span key={t} className="text-xs font-medium px-2.5 py-1 rounded-md bg-white border border-slate-200 text-slate-700 shadow-2xs">
                      ✓ {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs text-slate-600 space-y-1">
                <div><strong className="text-slate-700">Clinical Outcome:</strong> {info.outputType}</div>
                <div><strong className="text-slate-700">Setting:</strong> {info.recommendedFor}</div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-end">
              <button
                onClick={() => handleSelectTool(key)}
                className="clinical-btn-primary w-full sm:w-auto text-sm"
              >
                <span>Start {key} Assessment</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Alternative direct navigation option */}
      <div className="pt-4 text-center">
        <Link
          to="/formulas"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
        >
          <Calculator className="w-4 h-4" />
          <span>Skip screening and proceed directly to Nutritional Formulas & TEE</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

    </div>
  );
}
