import React from 'react';
import { Check } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useAssessment } from '../context/AssessmentContext.jsx';

export default function Stepper() {
  const location = useLocation();
  const { workflowMode, screening } = useAssessment();

  // Define steps dynamically based on whether user chose screening or direct formulas
  let steps = [];

  if (workflowMode === 'formulas') {
    steps = [
      { id: 1, name: 'Patient Details', path: '/register' },
      { id: 2, name: 'Formulas & TEE', path: '/formulas' },
      { id: 3, name: 'Final Report', path: '/final-result' }
    ];
  } else {
    steps = [
      { id: 1, name: 'Patient Details', path: '/register' },
      { id: 2, name: 'Tool Selection', path: '/select-tool' },
      { id: 3, name: screening?.tool ? `${screening.tool} Assessment` : 'Assessment', path: `/assessment/${(screening?.tool || 'glim').toLowerCase()}` },
      { id: 4, name: 'Screening Result', path: '/screening-result' },
      { id: 5, name: 'Formulas & TEE', path: '/formulas' },
      { id: 6, name: 'Final Report', path: '/final-result' }
    ];
  }

  // Find active step
  const getActiveIndex = () => {
    const current = location.pathname;
    if (current === '/register') return 0;
    if (current === '/select-tool') return 1;
    if (current.startsWith('/assessment/')) return 2;
    if (current === '/screening-result') return 3;
    if (current === '/formulas') return workflowMode === 'formulas' ? 1 : 4;
    if (current === '/final-result') return workflowMode === 'formulas' ? 2 : 5;
    return 0;
  };

  const activeIndex = getActiveIndex();

  // Hide stepper on dashboard, patient records, about, etc.
  const isWorkflowRoute = ['/register', '/select-tool', '/screening-result', '/formulas', '/final-result'].includes(location.pathname) || location.pathname.startsWith('/assessment/');

  if (!isWorkflowRoute) return null;

  return (
    <div className="bg-white border-b border-slate-200 py-3 px-4 sm:px-6 mb-8 no-print shadow-xs">
      <div className="max-w-5xl mx-auto">
        <nav aria-label="Progress">
          <ol className="flex items-center justify-between overflow-x-auto py-1 no-scrollbar gap-2 sm:gap-4">
            {steps.map((step, stepIdx) => {
              const isCompleted = stepIdx < activeIndex;
              const isCurrent = stepIdx === activeIndex;

              return (
                <li key={step.name} className="flex-1 min-w-[110px] relative">
                  <div className="flex items-center gap-2 group">
                    <span
                      className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold transition-all ${
                        isCompleted
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : isCurrent
                          ? 'border-2 border-brand-600 bg-brand-50 text-brand-700 ring-2 ring-brand-100 font-bold'
                          : 'border border-slate-300 bg-slate-50 text-slate-400'
                      }`}
                    >
                      {isCompleted ? <Check className="h-4 w-4 stroke-[3]" /> : stepIdx + 1}
                    </span>
                    <span
                      className={`text-xs font-medium whitespace-nowrap ${
                        isCurrent
                          ? 'text-brand-700 font-semibold'
                          : isCompleted
                          ? 'text-slate-700'
                          : 'text-slate-400'
                      }`}
                    >
                      {step.name}
                    </span>
                  </div>

                  {stepIdx !== steps.length - 1 && (
                    <div
                      className={`hidden lg:block absolute top-3.5 right-0 left-auto w-1/4 h-[2px] -mr-2 ${
                        stepIdx < activeIndex ? 'bg-emerald-500' : 'bg-slate-200'
                      }`}
                      aria-hidden="true"
                    />
                  )}
                </li>
              );
            })}
          </ol>
        </nav>
      </div>
    </div>
  );
}
