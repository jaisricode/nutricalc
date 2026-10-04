/**
 * Clinical Injury & Stress Factors
 * Per NutriCalc Project Specification
 */

export const INJURY_CONDITIONS = [
  // General Conditions
  {
    id: 'gen_surgery',
    name: 'Surgery',
    category: 'General Conditions',
    isRange: true,
    min: 1.1,
    max: 1.2,
    defaultVal: 1.15,
    description: 'Post-operative general surgical stress (Allowed: 1.1 – 1.2)'
  },
  {
    id: 'gen_sepsis',
    name: 'Sepsis',
    category: 'General Conditions',
    isRange: true,
    min: 1.2,
    max: 1.6,
    defaultVal: 1.40,
    description: 'Systemic inflammatory sepsis (Allowed: 1.2 – 1.6)'
  },
  {
    id: 'gen_trauma',
    name: 'Trauma',
    category: 'General Conditions',
    isRange: true,
    min: 1.1,
    max: 1.8,
    defaultVal: 1.35,
    description: 'General physical injury / blunt trauma (Allowed: 1.1 – 1.8)'
  },
  {
    id: 'gen_burn',
    name: 'Burn',
    category: 'General Conditions',
    isRange: true,
    min: 1.5,
    max: 1.9,
    defaultVal: 1.70,
    description: 'Thermal burn injuries (Allowed: 1.5 – 1.9)'
  },

  // Specific Conditions
  {
    id: 'spec_normal_minor_surgery',
    name: 'Normal / Minor Surgery',
    category: 'Specific Conditions',
    isRange: false,
    fixedValue: 1.0,
    min: 1.0,
    max: 1.0,
    defaultVal: 1.0,
    description: 'Uncomplicated minor elective procedure (Fixed: 1.0)'
  },
  {
    id: 'spec_long_bone_fracture',
    name: 'Long Bone Fracture',
    category: 'Specific Conditions',
    isRange: false,
    fixedValue: 1.2,
    min: 1.2,
    max: 1.2,
    defaultVal: 1.2,
    description: 'Femur, tibia, humerus fractures (Fixed: 1.2)'
  },
  {
    id: 'spec_burn_post_graft',
    name: 'Burn Post Graft',
    category: 'Specific Conditions',
    isRange: true,
    min: 1.0,
    max: 1.2,
    defaultVal: 1.10,
    description: 'Post-graft skin reconstruction phase (Allowed: 1.0 – 1.2)'
  },
  {
    id: 'spec_copd_malnourished',
    name: 'COPD, Malnourished',
    category: 'Specific Conditions',
    isRange: false,
    fixedValue: 1.3,
    min: 1.3,
    max: 1.3,
    defaultVal: 1.3,
    description: 'Chronic obstructive pulmonary disease with malnutrition (Fixed: 1.3)'
  },
  {
    id: 'spec_severe_head_injury',
    name: 'Severe Head Injury',
    category: 'Specific Conditions',
    isRange: false,
    fixedValue: 1.4,
    min: 1.4,
    max: 1.4,
    defaultVal: 1.4,
    description: 'Traumatic brain injury / closed head injury (Fixed: 1.4)'
  },
  {
    id: 'spec_50_pct_burns_alt',
    name: '50% Burns',
    category: 'Specific Conditions',
    isRange: false,
    fixedValue: 1.5,
    min: 1.5,
    max: 1.5,
    defaultVal: 1.5,
    description: 'Extensive thermal burns covering 50% TBSA (Fixed: 1.5)'
  },
  {
    id: 'spec_cancer',
    name: 'Cancer',
    category: 'Specific Conditions',
    isRange: true,
    min: 1.0,
    max: 1.5,
    defaultVal: 1.20,
    description: 'Oncological malignancy with metabolic alteration (Allowed: 1.0 – 1.5)'
  },
  {
    id: 'spec_ventilator',
    name: 'Ventilator',
    category: 'Specific Conditions',
    isRange: false,
    fixedValue: 1.6,
    min: 1.6,
    max: 1.6,
    defaultVal: 1.6,
    description: 'Mechanically ventilated critical care patient (Fixed: 1.6)'
  },
  {
    id: 'spec_major_surg_multi_trauma',
    name: 'Major Surgery / Multiple Trauma / 0–20% Burns Pre-Graft',
    category: 'Specific Conditions',
    isRange: true,
    min: 1.2,
    max: 1.6,
    defaultVal: 1.35,
    description: 'Complex major surgery or polytrauma (Allowed: 1.2 – 1.6)'
  },
  {
    id: 'spec_acute_sepsis',
    name: 'Acute Sepsis',
    category: 'Specific Conditions',
    isRange: true,
    min: 1.2,
    max: 1.7,
    defaultVal: 1.45,
    description: 'Severe acute sepsis / bacteremia (Allowed: 1.2 – 1.7)'
  },
  {
    id: 'spec_20_40_burn_pre_graft',
    name: '20–40% Burn Pre-Graft',
    category: 'Specific Conditions',
    isRange: true,
    min: 1.5,
    max: 2.0,
    defaultVal: 1.75,
    description: 'Pre-graft burn injuries covering 20–40% TBSA (Allowed: 1.5 – 2.0)'
  },
  {
    id: 'spec_50_burn_high',
    name: '50% Burn',
    category: 'Specific Conditions',
    isRange: false,
    fixedValue: 2.0,
    min: 2.0,
    max: 2.0,
    defaultVal: 2.0,
    description: 'Severe 50% hypermetabolic burns (Fixed: 2.0)'
  }
];

export function getInjuryCondition(conditionName) {
  return INJURY_CONDITIONS.find(
    c => c.name.toLowerCase() === (conditionName || '').toLowerCase() || c.id === conditionName
  ) || INJURY_CONDITIONS[4]; // Default to Normal / Minor Surgery
}
