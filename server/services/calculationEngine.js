/**
 * NutriCalc Calculation Engine
 * 
 * Implements authoritative nutritional and metabolic formulas.
 * Provides transparent step-by-step audit traces for clinical and medical research use.
 */

/**
 * Calculate Body Mass Index (BMI)
 * Formula: BMI = Weight(kg) / (Height(m))^2
 * @param {number} weightKg - Patient weight in kg
 * @param {number} heightCm - Patient height in cm
 * @returns {{ value: number, formatted: string, breakdown: string, category: string }}
 */
export function calculateBMI(weightKg, heightCm) {
  const w = parseFloat(weightKg);
  const hCm = parseFloat(heightCm);

  if (isNaN(w) || w <= 0 || isNaN(hCm) || hCm <= 0) {
    throw new Error('Valid positive numbers are required for weight and height.');
  }

  const heightM = hCm / 100;
  const heightMSquared = heightM * heightM;
  const bmi = w / heightMSquared;
  const rounded = parseFloat(bmi.toFixed(2));

  let category = 'Normal';
  if (bmi < 18.5) category = 'Underweight';
  else if (bmi >= 18.5 && bmi < 23) category = 'Normal (Asian WHO) / Low Normal';
  else if (bmi >= 23 && bmi < 25) category = 'Overweight (Asian standard)';
  else if (bmi >= 25 && bmi < 30) category = 'Overweight (WHO standard)';
  else category = 'Obese';

  const breakdown = `${w} kg / (${heightM.toFixed(2)} m)² = ${w} / ${heightMSquared.toFixed(4)} = ${rounded} kg/m²`;

  return {
    value: rounded,
    raw: bmi,
    unit: 'kg/m²',
    formatted: `${rounded} kg/m²`,
    breakdown,
    category
  };
}

/**
 * Calculate Ideal Body Weight (IBW)
 * Project Specified Formula: IBW = Height(cm) - 100
 * @param {number} heightCm - Patient height in cm
 * @returns {{ value: number, formatted: string, breakdown: string }}
 */
export function calculateIBW(heightCm) {
  const hCm = parseFloat(heightCm);
  if (isNaN(hCm) || hCm <= 0) {
    throw new Error('Valid positive height is required for IBW calculation.');
  }

  const ibw = hCm - 100;
  const rounded = parseFloat(ibw.toFixed(2));
  const breakdown = `${hCm} cm - 100 = ${rounded} kg`;

  return {
    value: rounded,
    raw: ibw,
    unit: 'kg',
    formatted: `${rounded} kg`,
    breakdown
  };
}

/**
 * Calculate Adjusted Body Weight (ABW)
 * Project Specified Formula: ABW = IBW + (0.4 * (Actual Weight - IBW))
 * @param {number} actualWeightKg - Actual patient weight in kg
 * @param {number} ibwKg - Ideal body weight in kg
 * @returns {{ value: number, formatted: string, breakdown: string }}
 */
export function calculateABW(actualWeightKg, ibwKg) {
  const actualW = parseFloat(actualWeightKg);
  const ibw = parseFloat(ibwKg);

  if (isNaN(actualW) || actualW <= 0 || isNaN(ibw)) {
    throw new Error('Valid actual weight and IBW are required for ABW calculation.');
  }

  const abw = ibw + 0.4 * (actualW - ibw);
  const rounded = parseFloat(abw.toFixed(2));
  const breakdown = `${ibw.toFixed(2)} + (0.4 × (${actualW.toFixed(2)} - ${ibw.toFixed(2)})) = ${ibw.toFixed(2)} + ${(0.4 * (actualW - ibw)).toFixed(2)} = ${rounded} kg`;

  return {
    value: rounded,
    raw: abw,
    unit: 'kg',
    formatted: `${rounded} kg`,
    breakdown
  };
}

/**
 * Calculate Basal Metabolic Rate (BMR)
 * Project Specified Formulas (Mifflin-St Jeor derivative):
 * For Men: BMR = (10 * Weight) + (6.5 * Height) - (5 * Age) + 5
 * For Women: BMR = (10 * Weight) + (6.5 * Height) - (5 * Age) - 161
 * @param {number} weightKg - Weight in kg
 * @param {number} heightCm - Height in cm
 * @param {number} ageYears - Age in years
 * @param {string} gender - 'Male' or 'Female'
 * @returns {{ value: number, formatted: string, breakdown: string }}
 */
export function calculateBMR(weightKg, heightCm, ageYears, gender) {
  const w = parseFloat(weightKg);
  const h = parseFloat(heightCm);
  const a = parseFloat(ageYears);
  const g = (gender || '').trim().toLowerCase();

  if (isNaN(w) || w <= 0 || isNaN(h) || h <= 0 || isNaN(a) || a < 0) {
    throw new Error('Valid positive weight, height, and age are required.');
  }

  if (g !== 'male' && g !== 'female') {
    throw new Error('Gender must be specified as Male or Female.');
  }

  const termW = 10 * w;
  const termH = 6.5 * h;
  const termA = 5 * a;

  let bmr;
  let breakdown;

  if (g === 'male') {
    bmr = termW + termH - termA + 5;
    breakdown = `(10 × ${w}) + (6.5 × ${h}) - (5 × ${a}) + 5 = ${termW.toFixed(1)} + ${termH.toFixed(1)} - ${termA.toFixed(1)} + 5 = ${Math.round(bmr)} kcal/day`;
  } else {
    bmr = termW + termH - termA - 161;
    breakdown = `(10 × ${w}) + (6.5 × ${h}) - (5 × ${a}) - 161 = ${termW.toFixed(1)} + ${termH.toFixed(1)} - ${termA.toFixed(1)} - 161 = ${Math.round(bmr)} kcal/day`;
  }

  const rounded = Math.round(bmr);

  return {
    value: rounded,
    raw: bmr,
    unit: 'kcal/day',
    formatted: `${rounded} kcal/day`,
    breakdown
  };
}

/**
 * Calculate Total Energy Expenditure (TEE)
 * Definitive Formula: TEE = BMR * Physical Activity Factor * Injury Factor
 * @param {number} bmr - Basal Metabolic Rate (kcal/day)
 * @param {number} activityFactor - Physical Activity Factor
 * @param {number} injuryFactor - Clinical/Injury Factor
 * @returns {{ value: number, formatted: string, breakdown: string }}
 */
export function calculateTEE(bmr, activityFactor, injuryFactor) {
  const b = parseFloat(bmr);
  const af = parseFloat(activityFactor);
  const ifact = parseFloat(injuryFactor);

  if (isNaN(b) || b <= 0 || isNaN(af) || af <= 0 || isNaN(ifact) || ifact <= 0) {
    throw new Error('Valid positive values for BMR, Activity Factor, and Injury Factor are required.');
  }

  const tee = b * af * ifact;
  const rounded = Math.round(tee);
  const breakdown = `${Math.round(b)} × ${af.toFixed(2)} × ${ifact.toFixed(2)} = ${rounded} kcal/day`;

  return {
    value: rounded,
    raw: tee,
    unit: 'kcal/day',
    formatted: `${rounded} kcal/day`,
    breakdown
  };
}

/**
 * Master calculation runner for all formulas
 * @param {Object} patient - { weight, height, age, gender }
 * @param {Object} params - { activityFactor, injuryFactor, activityLevel, injuryCondition, injuryMin, injuryMax }
 */
export function calculateAllFormulas(patient, params = {}) {
  const { weight, height, age, gender } = patient;
  const { activityFactor, injuryFactor, activityLevel, injuryCondition, injuryMin, injuryMax } = params;

  const bmiRes = calculateBMI(weight, height);
  const ibwRes = calculateIBW(height);
  const abwRes = calculateABW(weight, ibwRes.value);
  const bmrRes = calculateBMR(weight, height, age, gender);

  let teeRes = null;
  if (activityFactor && injuryFactor) {
    teeRes = calculateTEE(bmrRes.value, activityFactor, injuryFactor);
  }

  return {
    bmi: bmiRes.value,
    bmiCategory: bmiRes.category,
    ibw: ibwRes.value,
    abw: abwRes.value,
    bmr: bmrRes.value,
    physicalActivity: {
      level: activityLevel || 'Unspecified',
      factor: activityFactor ? parseFloat(activityFactor) : null
    },
    injury: {
      condition: injuryCondition || 'Unspecified',
      factor: injuryFactor ? parseFloat(injuryFactor) : null,
      minFactor: injuryMin ? parseFloat(injuryMin) : null,
      maxFactor: injuryMax ? parseFloat(injuryMax) : null
    },
    tee: teeRes ? teeRes.value : null,
    breakdowns: {
      bmi: bmiRes.breakdown,
      ibw: ibwRes.breakdown,
      abw: abwRes.breakdown,
      bmr: bmrRes.breakdown,
      tee: teeRes ? teeRes.breakdown : null
    }
  };
}
