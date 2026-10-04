import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Users, 
  CheckCircle, 
  Activity, 
  Calculator, 
  UserPlus, 
  ArrowRight, 
  FileText, 
  TrendingUp, 
  Calendar, 
  ShieldAlert,
  Search,
  Sparkles,
  ClipboardCheck
} from 'lucide-react';
import { api } from '../services/api.js';
import { useAssessment } from '../context/AssessmentContext.jsx';
import ClinicalBadge from '../components/ClinicalBadge.jsx';

export default function Dashboard() {
  const navigate = useNavigate();
  const { resetAssessment } = useAssessment();
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalAssessments: 0,
    tools: { GLIM: 0, SGA: 0, MNA: 0, MUST: 0 },
    recentPatients: [],
    recentAssessments: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    api.getDashboardStats()
      .then((res) => {
        if (isMounted && res.success) {
          setStats(res.data);
        }
      })
      .catch((err) => {
        console.warn('Dashboard stats fetch:', err.message);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => { isMounted = false; };
  }, []);

  const handleStartNew = () => {
    resetAssessment();
    navigate('/register');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Hero / Header Section */}
      <div className="bg-gradient-to-r from-brand-900 via-brand-800 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-8 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/20 text-brand-200 border border-brand-400/30 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            Clinical Nutrition & Research Suite
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-sans text-white">
            Nutri<span className="text-sky-300">Calc</span> Decision Support Dashboard
          </h1>

          <p className="text-slate-200 text-sm sm:text-base leading-relaxed">
            Standardized malnutrition diagnosis (GLIM, SGA, MNA, MUST) integrated with authoritative metabolic formulas and calorie requirement calculations.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={handleStartNew}
              className="bg-brand-500 hover:bg-brand-400 text-white font-semibold px-5 py-2.5 rounded-xl shadow-md transition-all flex items-center gap-2 text-sm"
            >
              <UserPlus className="w-4 h-4" />
              <span>+ New Patient Assessment</span>
            </button>

            <Link
              to="/patients"
              className="bg-white/10 hover:bg-white/20 text-white border border-white/20 font-medium px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 text-sm backdrop-blur"
            >
              <Users className="w-4 h-4" />
              <span>View Patient Records</span>
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Cards (True real statistics from DB) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-clinical hover:border-brand-300 transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase">Total Patients</span>
            <Users className="w-4 h-4 text-brand-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 font-mono">
            {loading ? '—' : stats.totalPatients}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Registered records</div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-clinical hover:border-brand-300 transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase">Screenings</span>
            <ClipboardCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 font-mono">
            {loading ? '—' : stats.totalAssessments}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Completed evaluations</div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-clinical hover:border-brand-300 transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase">GLIM</span>
            <span className="w-2 h-2 rounded-full bg-blue-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 font-mono">
            {loading ? '—' : stats.tools.GLIM}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">GLIM diagnostic sets</div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-clinical hover:border-brand-300 transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase">SGA</span>
            <span className="w-2 h-2 rounded-full bg-teal-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 font-mono">
            {loading ? '—' : stats.tools.SGA}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Subjective ratings</div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-clinical hover:border-brand-300 transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase">MNA</span>
            <span className="w-2 h-2 rounded-full bg-purple-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 font-mono">
            {loading ? '—' : stats.tools.MNA}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">14-pt mini scores</div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-clinical hover:border-brand-300 transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase">MUST</span>
            <span className="w-2 h-2 rounded-full bg-amber-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 font-mono">
            {loading ? '—' : stats.tools.MUST}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">5-Step protocol sets</div>
        </div>

      </div>

      {/* Quick Launch Clinical Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <div className="bg-gradient-to-br from-white to-blue-50/40 rounded-2xl border border-blue-100 p-6 shadow-clinical hover:shadow-clinical-lg transition-all flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center mb-4">
              <ClipboardCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Nutritional Screening Tools</h3>
            <p className="text-sm text-slate-600 mt-2 leading-relaxed">
              Standardized assessment for malnutrition risk and classification using GLIM, SGA, MNA, or MUST criteria.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-brand-700 font-semibold">4 Standardized Frameworks</span>
            <button
              onClick={() => {
                resetAssessment();
                navigate('/register');
              }}
              className="clinical-btn-primary text-xs py-2"
            >
              <span>Start Assessment</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="bg-gradient-to-br from-white to-emerald-50/40 rounded-2xl border border-emerald-100 p-6 shadow-clinical hover:shadow-clinical-lg transition-all flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4">
              <Calculator className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Direct Formula Calculation</h3>
            <p className="text-sm text-slate-600 mt-2 leading-relaxed">
              Instant calculation of BMI, Ideal Body Weight (IBW), Adjusted Body Weight (ABW), Basal Metabolic Rate (BMR), and Total Energy Expenditure (TEE).
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-emerald-700 font-semibold">TEE = BMR × Activity × Injury</span>
            <button
              onClick={() => {
                resetAssessment();
                navigate('/register');
              }}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold py-2 px-4 rounded-lg flex items-center gap-1.5 shadow-sm transition-all"
            >
              <span>Calculate Formulas</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

      {/* Recent Patients Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-clinical overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Recent Patients & Assessments</h3>
            <p className="text-xs text-slate-500 mt-0.5">Live audit log from MongoDB Atlas / Medical Repository</p>
          </div>
          <Link
            to="/patients"
            className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1"
          >
            <span>View All Records</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="p-8 text-center text-slate-400 text-sm animate-pulse">Loading patient registry...</div>
        ) : stats.recentPatients.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <FileText className="w-10 h-10 text-slate-300 mx-auto" />
            <h4 className="text-sm font-semibold text-slate-700">No patient records in database</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Start your first clinical assessment or nutritional calculation to store records in MongoDB Atlas.
            </p>
            <button
              onClick={handleStartNew}
              className="clinical-btn-primary text-xs py-2 mt-2"
            >
              <UserPlus className="w-4 h-4" />
              <span>Create First Patient</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3">Patient Name</th>
                  <th className="px-4 py-3">IP Number</th>
                  <th className="px-4 py-3">Age / Gender</th>
                  <th className="px-4 py-3">Screening Tool</th>
                  <th className="px-4 py-3">Screening Status</th>
                  <th className="px-4 py-3">BMI</th>
                  <th className="px-4 py-3">TEE (kcal/day)</th>
                  <th className="px-6 py-3 text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {stats.recentPatients.map((patient) => (
                  <tr key={patient._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-3.5 font-bold text-slate-900">
                      {patient.patientDetails.name}
                    </td>
                    <td className="px-4 py-3.5 font-mono text-slate-600">
                      {patient.patientDetails.ipNo || '—'}
                    </td>
                    <td className="px-4 py-3.5">
                      {patient.patientDetails.age}y / {patient.patientDetails.gender}
                    </td>
                    <td className="px-4 py-3.5">
                      {patient.screening?.tool ? (
                        <span className="font-semibold text-brand-700 bg-brand-50 px-2 py-0.5 rounded border border-brand-200">
                          {patient.screening.tool}
                        </span>
                      ) : (
                        <span className="text-slate-400">Direct Formulas</span>
                      )}
                    </td>
                    <td className="px-4 py-3.5">
                      {patient.screening?.result?.classification ? (
                        <ClinicalBadge
                          classification={patient.screening.result.classification}
                          severity={patient.screening.result.severity}
                          size="sm"
                        />
                      ) : (
                        <span className="text-slate-400 italic">Not Screened</span>
                      )}
                    </td>
                    <td className="px-4 py-3.5 font-mono">
                      {patient.formulas?.bmi ? `${patient.formulas.bmi} kg/m²` : '—'}
                    </td>
                    <td className="px-4 py-3.5 font-mono font-bold text-slate-900">
                      {patient.formulas?.tee ? `${patient.formulas.tee} kcal` : '—'}
                    </td>
                    <td className="px-6 py-3.5 text-right text-slate-400 font-sans">
                      {new Date(patient.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
