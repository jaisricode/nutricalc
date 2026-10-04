/**
 * Client-Side Calculation Engine
 * Reusable functions matching backend calculation logic for zero-latency reactive UI.
 */

export function calculateBMI(weightKg, heightCm) {
  const w = parseFloat(weightKg);
  const hCm = parseFloat(heightCm);

  if (isNaN(w) || w <= 0 || isNaN(hCm) || hCm <= 0) {
    return { value: 0, formatted: '0.00 kg/m²', breakdown: '', category: '' };
  }

  const heightM = hCm / 100;
  const heightMSquared = heightM * heightM;
  const bmi = w / heightMSquared;
  const rounded = parseFloat(bmi.toFixed(2));

  let category = 'Normal';
  if (bmi < 18.5) category = 'Underweight';
  else if (bmi >= 18.5 && bmi < 23) category = 'Normal (Asian WHO)';
  else if (bmi >= 23 && bmi < 25) category = 'Overweight (Asian standard)';
  else if (bmi >= 25 && bmi < 30) category = 'Overweight (WHO standard)';
  else category = 'Obese';

  const breakdown = `${w} / (${heightM.toFixed(2)}²) = ${w} / ${heightMSquared.toFixed(4)} = ${rounded} kg/m²`;

  return {
    value: rounded,
    raw: bmi,
    unit: 'kg/m²',
    formatted: `${rounded} kg/m²`,
    breakdown,
    category
  };
}

export function calculateIBW(heightCm) {
  const hCm = parseFloat(heightCm);
  if (isNaN(hCm) || hCm <= 0) {
    return { value: 0, formatted: '0.00 kg', breakdown: '' };
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

export function calculateABW(actualWeightKg, ibwKg) {
  const actualW = parseFloat(actualWeightKg);
  const ibw = parseFloat(ibwKg);

  if (isNaN(actualW) || actualW <= 0 || isNaN(ibw)) {
    return { value: 0, formatted: '0.00 kg', breakdown: '' };
  }

  const abw = ibw + 0.4 * (actualW - ibw);
  const rounded = parseFloat(abw.toFixed(2));
  const breakdown = `${ibw.toFixed(2)} + (0.4 × (${actualW.toFixed(2)} - ${ibw.toFixed(2)})) = ${rounded} kg`;

  return {
    value: rounded,
    raw: abw,
    unit: 'kg',
    formatted: `${rounded} kg`,
    breakdown
  };
}

export function calculateBMR(weightKg, heightCm, ageYears, gender) {
  const w = parseFloat(weightKg);
  const h = parseFloat(heightCm);
  const a = parseFloat(ageYears);
  const g = (gender || '').trim().toLowerCase();

  if (isNaN(w) || w <= 0 || isNaN(h) || h <= 0 || isNaN(a) || a < 0 || !g) {
    return { value: 0, formatted: '0 kcal/day', breakdown: '' };
  }

  const termW = 10 * w;
  const termH = 6.5 * h;
  const termA = 5 * a;

  let bmr;
  let breakdown;

  if (g === 'male') {
    bmr = termW + termH - termA + 5;
    breakdown = `10(${w}) + 6.5(${h}) - 5(${a}) + 5 = ${termW.toFixed(0)} + ${termH.toFixed(1)} - ${termA.toFixed(0)} + 5 = ${Math.round(bmr)} kcal/day`;
  } else {
    bmr = termW + termH - termA - 161;
    breakdown = `10(${w}) + 6.5(${h}) - 5(${a}) - 161 = ${termW.toFixed(0)} + ${termH.toFixed(1)} - ${termA.toFixed(0)} - 161 = ${Math.round(bmr)} kcal/day`;
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

export function calculateTEE(bmr, activityFactor, injuryFactor) {
  const b = parseFloat(bmr);
  const af = parseFloat(activityFactor);
  const ifact = parseFloat(injuryFactor);

  if (isNaN(b) || b <= 0 || isNaN(af) || af <= 0 || isNaN(ifact) || ifact <= 0) {
    return { value: 0, formatted: '0 kcal/day', breakdown: '' };
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

export function calculateAllFormulasClient(patient, params = {}) {
  const { weight, height, age, gender } = patient || {};
  const { activityFactor, injuryFactor, activityLevel, injuryCondition, injuryMin, injuryMax } = params;

  const bmiRes = calculateBMI(weight, height);
  const ibwRes = calculateIBW(height);
  const abwRes = calculateABW(weight, ibwRes.value);
  const bmrRes = calculateBMR(weight, height, age, gender);

  let teeRes = null;
  if (bmrRes.value > 0 && activityFactor && injuryFactor) {
    teeRes = calculateTEE(bmrRes.value, activityFactor, injuryFactor);
  }

  return {
    bmi: bmiRes.value,
    bmiCategory: bmiRes.category,
    ibw: ibwRes.value,
    abw: abwRes.value,
    bmr: bmrRes.value,
    physicalActivity: {
      level: activityLevel || 'Sedentary',
      factor: activityFactor ? parseFloat(activityFactor) : 1.0
    },
    injury: {
      condition: injuryCondition || 'Normal / Minor Surgery',
      factor: injuryFactor ? parseFloat(injuryFactor) : 1.0,
      minFactor: injuryMin ? parseFloat(injuryMin) : 1.0,
      maxFactor: injuryMax ? parseFloat(injuryMax) : 1.0
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
