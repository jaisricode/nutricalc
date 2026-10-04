/**
 * Clinical Reference Guidelines for NutriCalc
 */

export const SCREENING_TOOLS_INFO = {
  GLIM: {
    id: 'GLIM',
    name: 'GLIM Criteria',
    fullName: 'Global Leadership Initiative on Malnutrition',
    description: 'Consensus-based two-step diagnostic framework combining phenotypic and etiologic criteria for diagnosing and grading malnutrition severity.',
    badgeColor: 'blue',
    criteriaGroups: ['Phenotypic (Weight loss, Low BMI, Muscle mass)', 'Etiologic (Reduced intake/assimilation, Disease burden/inflammation)'],
    outputType: 'Malnutrition Identification + Stage 1 (Moderate) / Stage 2 (Severe)',
    recommendedFor: 'Inpatients, oncology, intensive care, and clinical research'
  },
  SGA: {
    id: 'SGA',
    name: 'SGA Assessment',
    fullName: 'Subjective Global Assessment',
    description: 'Gold-standard comprehensive clinical tool evaluating medical history (weight, intake, GI symptoms, function) and physical examination (fat loss, muscle wasting, oedema, ascites).',
    badgeColor: 'teal',
    criteriaGroups: ['Medical History (Weight, Intake, GI, Function)', 'Physical Examination (Subcutaneous fat, Muscle wasting, Oedema, Ascites)'],
    outputType: 'Qualitative Clinical Rating: SGA-A (Well Nourished), SGA-B (Moderately Malnourished), SGA-C (Severely Malnourished)',
    recommendedFor: 'Surgical patients, gastrointestinal disease, dialysis, and routine hospital admissions'
  },
  MNA: {
    id: 'MNA',
    name: 'MNA Screening',
    fullName: 'Mini Nutritional Assessment (Short-Form)',
    description: 'Validated 14-point screening tool designed specifically for geriatric and adult populations, evaluating food intake, weight change, mobility, neuropsychological stress, and BMI/Calf circumference.',
    badgeColor: 'purple',
    criteriaGroups: ['Intake decline', 'Weight loss', 'Mobility', 'Psychological stress', 'Neuropsychological', 'BMI or Calf Circumference (mutual exclusive)'],
    outputType: '12–14: Normal | 8–11: At Risk | 0–7: Malnourished',
    recommendedFor: 'Geriatric medicine, long-term care, outpatient clinics, and community screening'
  },
  MUST: {
    id: 'MUST',
    name: 'MUST Screening',
    fullName: 'Malnutrition Universal Screening Tool',
    description: 'Five-step evidence-based screening protocol identifying adults at risk of malnutrition and providing structured clinical management pathways.',
    badgeColor: 'emerald',
    criteriaGroups: ['Step 1: BMI Score', 'Step 2: Weight Loss Score', 'Step 3: Acute Disease Effect', 'Step 4: Overall Risk', 'Step 5: Clinical Action Plan'],
    outputType: '0: Low Risk | 1: Medium Risk | ≥2: High Risk + Clinical Management Guidelines',
    recommendedFor: 'Hospitals, care homes, primary care, and community healthcare facilities'
  }
};
