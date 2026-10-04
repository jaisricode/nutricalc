import React from 'react';
import { 
  BookOpen, 
  Calculator, 
  Activity, 
  ShieldCheck, 
  Database, 
  FileCode2, 
  Stethoscope, 
  HeartHandshake, 
  ShieldAlert,
  Sparkles,
  Award
} from 'lucide-react';
import { SCREENING_TOOLS_INFO } from '../data/clinicalGuidelines.js';

export default function About() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* Page Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 text-brand-700 border border-brand-200 text-xs font-semibold uppercase tracking-wider">
          <Award className="w-3.5 h-3.5" />
          Clinical Reference & Scientific Methodology
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 font-sans">
          About Nutri<span className="text-brand-600">Calc</span>
        </h1>
        <p className="text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed">
          NutriCalc is an evidence-based clinical nutrition assessment and metabolic calculation system engineered for clinical dietitians, nutritionists, hospital care teams, and academic medical researchers.
        </p>
      </div>

      {/* Section 1: Nutritional Formulas Specification */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-clinical space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 font-mono">Mathematical Engine</span>
            <h2 className="text-xl font-bold text-slate-900">Standardized Nutritional Formulas</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <div className="font-bold text-slate-900 text-sm">Body Mass Index (BMI)</div>
            <code className="block font-mono bg-white p-2 rounded border border-slate-200 text-brand-700">
              BMI = Weight(kg) / (Height(m))²
            </code>
            <p className="text-slate-600 leading-relaxed">
              Standard anthropometric indicator of nutritional mass. Asian-specific thresholds (&lt;18.5 kg/m² for underweight, &lt;23 for normal) supported across GLIM criteria.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <div className="font-bold text-slate-900 text-sm">Ideal Body Weight (IBW)</div>
            <code className="block font-mono bg-white p-2 rounded border border-slate-200 text-brand-700">
              IBW = Height(cm) - 100
            </code>
            <p className="text-slate-600 leading-relaxed">
              Project-specified clinical baseline for assessing target metabolic mass in adults.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <div className="font-bold text-slate-900 text-sm">Adjusted Body Weight (ABW)</div>
            <code className="block font-mono bg-white p-2 rounded border border-slate-200 text-brand-700">
              ABW = IBW + (0.4 × (Actual Weight - IBW))
            </code>
            <p className="text-slate-600 leading-relaxed">
              Used in clinical dietetics when actual weight significantly diverges from ideal body weight to prevent overfeeding or underfeeding.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <div className="font-bold text-slate-900 text-sm">Basal Metabolic Rate (BMR)</div>
            <code className="block font-mono bg-white p-2 rounded border border-slate-200 text-brand-700 leading-relaxed">
              Male: 10W + 6.5H - 5A + 5<br />
              Female: 10W + 6.5H - 5A - 161
            </code>
            <p className="text-slate-600 leading-relaxed">
              Mifflin-St Jeor derivative predicting resting 24-hour basal metabolic requirements in kcal/day.
            </p>
          </div>

        </div>

        {/* Definitive TEE Callout */}
        <div className="bg-brand-900 text-white p-6 rounded-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-sky-300 font-bold">Definitive TEE Equation</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-white/10 border border-white/20">Mandatory Injury Factor</span>
          </div>
          <div className="text-xl font-mono font-bold text-sky-200">
            TEE = BMR × Physical Activity Factor × Injury Factor
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Calculates exact patient calorie expenditure by multiplying baseline BMR by gender-aware physical activity and condition-specific clinical stress factors.
          </p>
        </div>
      </div>

      {/* Section 2: Standardized Screening Instruments */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-clinical space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700 font-mono">Screening Guidelines</span>
            <h2 className="text-xl font-bold text-slate-900">Standardized Malnutrition Tools</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          
          {Object.entries(SCREENING_TOOLS_INFO).map(([k, tool]) => (
            <div key={k} className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-base font-black font-sans text-slate-900">{tool.id}</span>
                <span className="font-mono text-[11px] text-slate-500">{tool.fullName}</span>
              </div>
              <p className="text-slate-600 leading-relaxed">{tool.description}</p>
              <div className="space-y-1 pt-1 border-t border-slate-200">
                <div><strong className="text-slate-800">Criteria:</strong> {tool.criteriaGroups.join('; ')}</div>
                <div><strong className="text-slate-800">Outcome:</strong> {tool.outputType}</div>
              </div>
            </div>
          ))}

        </div>
      </div>

      {/* Section 3: Architecture & Medical Research Safety */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-clinical space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-purple-700 font-mono">Data Architecture</span>
            <h2 className="text-xl font-bold text-slate-900">Healthcare Research Reproducibility</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-600">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
            <strong className="text-slate-900 block font-bold">1. Full Input Auditing</strong>
            <p>Every calculation preserves raw user responses, specific formula steps, and intermediate values for retrospective research validation.</p>
          </div>
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
            <strong className="text-slate-900 block font-bold">2. Zero Hardcoding</strong>
            <p>MongoDB Atlas connection parameters and sensitive credentials are isolated in environment variables (<code className="font-mono">.env</code>).</p>
          </div>
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
            <strong className="text-slate-900 block font-bold">3. Clinical Safety</strong>
            <p>Provides deterministic mathematical operations without fabricated scoring rules, supporting dietitians in clinical decision making.</p>
          </div>
        </div>
      </div>

    </div>
  );
}
