import React, { createContext, useContext, useState, useEffect } from 'react';
import { calculateAllFormulasClient } from '../services/calculationEngine.js';
import { getActivityFactor } from '../data/activityFactors.js';
import { getInjuryCondition } from '../data/injuryFactors.js';

const AssessmentContext = createContext();

const initialPatientDetails = {
  name: '',
  weight: '',
  height: '',
  age: '',
  gender: 'Male',
  ipNo: '',
  district: '',
  state: '',
  pincode: ''
};

const initialScreening = {
  selected: false,
  tool: null, // 'GLIM' | 'SGA' | 'MNA' | 'MUST'
  assessmentData: {},
  result: null
};

const initialFormulas = {
  bmi: 0,
  bmiCategory: '',
  ibw: 0,
  abw: 0,
  bmr: 0,
  physicalActivity: {
    level: 'Sedentary',
    factor: 1.0,
    description: 'Typical daily living activities'
  },
  injury: {
    condition: 'Normal / Minor Surgery',
    factor: 1.0,
    minFactor: 1.0,
    maxFactor: 1.0,
    category: 'Specific Conditions'
  },
  tee: 0,
  breakdowns: {
    bmi: '',
    ibw: '',
    abw: '',
    bmr: '',
    tee: ''
  }
};

export function AssessmentProvider({ children }) {
  // Load state from sessionStorage if available to survive accidental refresh
  const [patientDetails, setPatientDetails] = useState(() => {
    try {
      const saved = sessionStorage.getItem('nutricalc_patient');
      return saved ? JSON.parse(saved) : initialPatientDetails;
    } catch {
      return initialPatientDetails;
    }
  });

  const [screening, setScreening] = useState(() => {
    try {
      const saved = sessionStorage.getItem('nutricalc_screening');
      return saved ? JSON.parse(saved) : initialScreening;
    } catch {
      return initialScreening;
    }
  });

  const [formulas, setFormulas] = useState(() => {
    try {
      const saved = sessionStorage.getItem('nutricalc_formulas');
      return saved ? JSON.parse(saved) : initialFormulas;
    } catch {
      return initialFormulas;
    }
  });

  const [workflowMode, setWorkflowMode] = useState('screening'); // 'screening' | 'formulas'
  const [clinicalNotes, setClinicalNotes] = useState('');
  const [activeRecordId, setActiveRecordId] = useState(null);

  // Sync to session storage on updates
  useEffect(() => {
    try {
      sessionStorage.setItem('nutricalc_patient', JSON.stringify(patientDetails));
      sessionStorage.setItem('nutricalc_screening', JSON.stringify(screening));
      sessionStorage.setItem('nutricalc_formulas', JSON.stringify(formulas));
    } catch (e) {
      console.error('Session storage sync error:', e);
    }
  }, [patientDetails, screening, formulas]);

  // Recalculate formulas automatically when patient physical parameters change
  useEffect(() => {
    if (patientDetails.weight && patientDetails.height && patientDetails.age && patientDetails.gender) {
      const defaultActivityFactor = getActivityFactor(patientDetails.gender, formulas.physicalActivity.level);
      const injuryObj = getInjuryCondition(formulas.injury.condition);

      // Preserve existing selected injury factor if it's within range, else default
      let factorToUse = formulas.injury.factor;
      if (injuryObj.isRange) {
        if (factorToUse < injuryObj.min || factorToUse > injuryObj.max) {
          factorToUse = injuryObj.defaultVal;
        }
      } else {
        factorToUse = injuryObj.fixedValue;
      }

      const calculated = calculateAllFormulasClient(patientDetails, {
        activityLevel: formulas.physicalActivity.level,
        activityFactor: defaultActivityFactor,
        injuryCondition: injuryObj.name,
        injuryFactor: factorToUse,
        injuryMin: injuryObj.min,
        injuryMax: injuryObj.max
      });

      setFormulas(prev => ({
        ...prev,
        ...calculated,
        physicalActivity: {
          ...prev.physicalActivity,
          factor: defaultActivityFactor
        },
        injury: {
          ...prev.injury,
          condition: injuryObj.name,
          factor: factorToUse,
          minFactor: injuryObj.min,
          maxFactor: injuryObj.max,
          category: injuryObj.category
        }
      }));
    }
  }, [patientDetails.weight, patientDetails.height, patientDetails.age, patientDetails.gender]);

  const updatePatientDetails = (details) => {
    setPatientDetails(prev => ({ ...prev, ...details }));
  };

  const setScreeningTool = (toolName) => {
    setScreening(prev => ({
      ...prev,
      selected: true,
      tool: toolName,
      assessmentData: {},
      result: null
    }));
  };

  const updateAssessmentData = (data) => {
    setScreening(prev => ({
      ...prev,
      assessmentData: { ...prev.assessmentData, ...data }
    }));
  };

  const setAssessmentResult = (result) => {
    setScreening(prev => ({
      ...prev,
      result
    }));
  };

  const updateFormulaParams = ({ activityLevel, activityFactor, injuryCondition, injuryFactor, injuryMin, injuryMax, category }) => {
    const actFactor = activityFactor !== undefined ? activityFactor : getActivityFactor(patientDetails.gender, activityLevel);
    
    const calculated = calculateAllFormulasClient(patientDetails, {
      activityLevel: activityLevel || formulas.physicalActivity.level,
      activityFactor: actFactor,
      injuryCondition: injuryCondition || formulas.injury.condition,
      injuryFactor: injuryFactor !== undefined ? injuryFactor : formulas.injury.factor,
      injuryMin: injuryMin !== undefined ? injuryMin : formulas.injury.minFactor,
      injuryMax: injuryMax !== undefined ? injuryMax : formulas.injury.maxFactor
    });

    setFormulas({
      ...calculated,
      physicalActivity: {
        level: activityLevel || formulas.physicalActivity.level,
        factor: actFactor,
        description: ''
      },
      injury: {
        condition: injuryCondition || formulas.injury.condition,
        factor: injuryFactor !== undefined ? parseFloat(injuryFactor) : formulas.injury.factor,
        minFactor: injuryMin !== undefined ? parseFloat(injuryMin) : formulas.injury.minFactor,
        maxFactor: injuryMax !== undefined ? parseFloat(injuryMax) : formulas.injury.maxFactor,
        category: category || formulas.injury.category
      }
    });
  };

  const resetAssessment = () => {
    setPatientDetails(initialPatientDetails);
    setScreening(initialScreening);
    setFormulas(initialFormulas);
    setClinicalNotes('');
    setActiveRecordId(null);
    setWorkflowMode('screening');
    sessionStorage.removeItem('nutricalc_patient');
    sessionStorage.removeItem('nutricalc_screening');
    sessionStorage.removeItem('nutricalc_formulas');
  };

  const loadExistingRecord = (record) => {
    if (!record) return;
    setActiveRecordId(record._id);
    setPatientDetails(record.patientDetails || initialPatientDetails);
    setScreening(record.screening || initialScreening);
    setFormulas(record.formulas || initialFormulas);
    setClinicalNotes(record.clinicalNotes || '');
    setWorkflowMode(record.screening?.selected ? 'screening' : 'formulas');
  };

  return (
    <AssessmentContext.Provider
      value={{
        patientDetails,
        updatePatientDetails,
        screening,
        setScreeningTool,
        updateAssessmentData,
        setAssessmentResult,
        formulas,
        updateFormulaParams,
        workflowMode,
        setWorkflowMode,
        clinicalNotes,
        setClinicalNotes,
        activeRecordId,
        resetAssessment,
        loadExistingRecord
      }}
    >
      {children}
    </AssessmentContext.Provider>
  );
}

export const useAssessment = () => {
  const context = useContext(AssessmentContext);
  if (!context) {
    throw new Error('useAssessment must be used within an AssessmentProvider');
  }
  return context;
};
