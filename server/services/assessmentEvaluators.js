/**
 * NutriCalc Assessment Evaluators
 * 
 * Standardized implementations of authoritative malnutrition screening & assessment tools:
 * 1. GLIM (Global Leadership Initiative on Malnutrition)
 * 2. SGA (Subjective Global Assessment)
 * 3. MNA (Mini Nutritional Assessment)
 * 4. MUST (Malnutrition Universal Screening Tool)
 */

import { calculateBMI } from './calculationEngine.js';

// ==========================================
// 1. GLIM EVALUATOR
// ==========================================

/**
 * Evaluates GLIM Diagnostic Criteria
 * 
 * Framework:
 * - Phenotypic Criteria:
 *   1. Weight Loss (>5% in 6m or >10% beyond 6m) -> Stage 1: 5-10% in 6m or 10-20% >6m; Stage 2: >10% in 6m or >20% >6m
 *   2. Low BMI: <70 yrs (<20, Asian <18.5); >=70 yrs (<22, Asian <20) -> Stage 1 vs Stage 2 (<18.5 for <70, <20 for >=70)
 *   3. Reduced Muscle Mass: Assessed by validated methods (DXA, BIA, US, CT, MRI, MUAC, CC, Physical Exam)
 * - Etiologic Criteria:
 *   1. Reduced food intake or assimilation (<=50% for 1-2w, any reduction >2w, chronic GI condition, symptoms)
 *   2. Disease burden / inflammation (Acute disease/injury or Chronic disease-related inflammation)
 * 
 * Malnutrition Diagnosis: >=1 Phenotypic AND >=1 Etiologic criteria.
 * Severity Grading: Highest stage from positive phenotypic criteria.
 */
export function evaluateGLIM(data, patient) {
  const {
    weightLoss, // { usualWeight, currentWeight, timePeriod, hasUnintentionalWeightLoss }
    bmiData,    // { useAsianThreshold, bmiValue }
    muscleMass, // { isReduced, assessmentMethod, details }
    foodIntake, // { ingestion50Percent1to2Weeks, intakeReductionOver2Weeks, chronicGICondition, symptoms: [] }
    diseaseBurden // { hasAcuteDisease, acuteDiseaseType, hasChronicDisease, chronicDiseaseType, crp, albumin, preAlbumin }
  } = data || {};

  const age = parseFloat(patient?.age || 0);
  const currentWeight = parseFloat(patient?.weight || weightLoss?.currentWeight || 0);
  const usualWeight = parseFloat(weightLoss?.usualWeight || 0);
  const heightCm = parseFloat(patient?.height || 0);

  // --- A. PHENOTYPIC CRITERIA EVALUATION ---
  
  // 1. Weight Loss
  let weightLossPositive = false;
  let weightLossStage = null;
  let percentWeightLoss = 0;
  let weightLossNote = 'No significant weight loss documented';

  if (usualWeight > 0 && currentWeight > 0 && usualWeight > currentWeight) {
    percentWeightLoss = parseFloat((((usualWeight - currentWeight) / usualWeight) * 100).toFixed(2));
    const timePeriod = weightLoss?.timePeriod || 'within_6_months'; // 'within_6_months' or 'beyond_6_months'

    if (timePeriod === 'within_6_months') {
      if (percentWeightLoss > 10) {
        weightLossPositive = true;
        weightLossStage = 'Stage 2 (Severe)';
        weightLossNote = `${percentWeightLoss}% weight loss in ≤6 months (>10% severe threshold met)`;
      } else if (percentWeightLoss >= 5) {
        weightLossPositive = true;
        weightLossStage = 'Stage 1 (Moderate)';
        weightLossNote = `${percentWeightLoss}% weight loss in ≤6 months (5-10% moderate threshold met)`;
      } else {
        weightLossNote = `${percentWeightLoss}% weight loss in ≤6 months (<5% below threshold)`;
      }
    } else { // beyond 6 months
      if (percentWeightLoss > 20) {
        weightLossPositive = true;
        weightLossStage = 'Stage 2 (Severe)';
        weightLossNote = `${percentWeightLoss}% weight loss in >6 months (>20% severe threshold met)`;
      } else if (percentWeightLoss >= 10) {
        weightLossPositive = true;
        weightLossStage = 'Stage 1 (Moderate)';
        weightLossNote = `${percentWeightLoss}% weight loss in >6 months (10-20% moderate threshold met)`;
      } else {
        weightLossNote = `${percentWeightLoss}% weight loss in >6 months (<10% below threshold)`;
      }
    }
  } else if (weightLoss?.hasUnintentionalWeightLoss) {
    weightLossPositive = true;
    weightLossStage = weightLoss?.manualStage || 'Stage 1 (Moderate)';
    weightLossNote = 'Clinically confirmed unintentional weight loss';
  }

  // 2. Low BMI
  let bmiValue = bmiData?.bmiValue;
  if (!bmiValue && currentWeight > 0 && heightCm > 0) {
    bmiValue = calculateBMI(currentWeight, heightCm).value;
  }
  bmiValue = parseFloat(bmiValue || 0);

  const isAsian = !!bmiData?.useAsianThreshold;
  const isElderly = age >= 70;

  let bmiPositive = false;
  let bmiStage = null;
  let bmiThresholdNote = '';

  if (bmiValue > 0) {
    if (!isElderly) {
      // Age < 70
      const standardCutoff = isAsian ? 18.5 : 20.0;
      const severeCutoff = 18.5; // for standard <70
      bmiThresholdNote = isAsian ? 'Asian cutoff <18.5 kg/m² (<70y)' : 'Standard cutoff <20.0 kg/m² (<70y)';

      if (isAsian) {
        if (bmiValue < 18.5) {
          bmiPositive = true;
          bmiStage = bmiValue < 17.0 ? 'Stage 2 (Severe)' : 'Stage 1 (Moderate)';
        }
      } else {
        if (bmiValue < 18.5) {
          bmiPositive = true;
          bmiStage = 'Stage 2 (Severe)';
        } else if (bmiValue < 20.0) {
          bmiPositive = true;
          bmiStage = 'Stage 1 (Moderate)';
        }
      }
    } else {
      // Age >= 70
      const standardCutoff = isAsian ? 20.0 : 22.0;
      bmiThresholdNote = isAsian ? 'Asian cutoff <20.0 kg/m² (≥70y)' : 'Standard cutoff <22.0 kg/m² (≥70y)';

      if (isAsian) {
        if (bmiValue < 18.5) {
          bmiPositive = true;
          bmiStage = 'Stage 2 (Severe)';
        } else if (bmiValue < 20.0) {
          bmiPositive = true;
          bmiStage = 'Stage 1 (Moderate)';
        }
      } else {
        if (bmiValue < 20.0) {
          bmiPositive = true;
          bmiStage = 'Stage 2 (Severe)';
        } else if (bmiValue < 22.0) {
          bmiPositive = true;
          bmiStage = 'Stage 1 (Moderate)';
        }
      }
    }
  }

  // 3. Reduced Muscle Mass
  const muscleMassPositive = !!muscleMass?.isReduced;
  const muscleMassMethod = muscleMass?.assessmentMethod || 'Physical examination';
  const muscleMassDetails = muscleMass?.details || '';

  // Phenotypic Summary
  const phenotypicCount = (weightLossPositive ? 1 : 0) + (bmiPositive ? 1 : 0) + (muscleMassPositive ? 1 : 0);
  const phenotypicPositive = phenotypicCount >= 1;

  // --- B. ETIOLOGIC CRITERIA EVALUATION ---

  // 1. Reduced Food Intake / Assimilation
  const hasIntakeDecline = !!(
    foodIntake?.ingestion50Percent1to2Weeks ||
    foodIntake?.intakeReductionOver2Weeks ||
    foodIntake?.chronicGICondition ||
    (foodIntake?.symptoms && foodIntake.symptoms.length > 0)
  );

  // 2. Disease Burden / Inflammation
  const hasDiseaseBurden = !!(
    diseaseBurden?.hasAcuteDisease ||
    diseaseBurden?.hasChronicDisease ||
    (diseaseBurden?.crp && parseFloat(diseaseBurden.crp) > 10)
  );

  // Etiologic Summary
  const etiologicCount = (hasIntakeDecline ? 1 : 0) + (hasDiseaseBurden ? 1 : 0);
  const etiologicPositive = etiologicCount >= 1;

  // --- C. FINAL GLIM DIAGNOSIS & SEVERITY ---
  const malnutritionIdentified = phenotypicPositive && etiologicPositive;

  let finalSeverity = null;
  if (malnutritionIdentified) {
    if (weightLossStage === 'Stage 2 (Severe)' || bmiStage === 'Stage 2 (Severe)') {
      finalSeverity = 'Stage 2 – Severe Malnutrition';
    } else {
      finalSeverity = 'Stage 1 – Moderate Malnutrition';
    }
  }

  return {
    tool: 'GLIM',
    classification: malnutritionIdentified ? 'Malnutrition Identified' : 'No GLIM Malnutrition Criteria Met',
    severity: finalSeverity || 'None / Not Applicable',
    malnutritionIdentified,
    criteria: {
      phenotypic: {
        positive: phenotypicPositive,
        count: phenotypicCount,
        weightLoss: {
          positive: weightLossPositive,
          percentage: percentWeightLoss,
          stage: weightLossStage,
          note: weightLossNote
        },
        lowBMI: {
          positive: bmiPositive,
          bmi: bmiValue,
          thresholdNote: bmiThresholdNote,
          stage: bmiStage
        },
        reducedMuscleMass: {
          positive: muscleMassPositive,
          method: muscleMassMethod,
          details: muscleMassDetails
        }
      },
      etiologic: {
        positive: etiologicPositive,
        count: etiologicCount,
        reducedIntake: {
          positive: hasIntakeDecline,
          details: foodIntake
        },
        diseaseBurden: {
          positive: hasDiseaseBurden,
          details: diseaseBurden
        }
      }
    },
    summaryText: malnutritionIdentified
      ? `Malnutrition identified based on GLIM consensus (${phenotypicCount} phenotypic + ${etiologicCount} etiologic criteria met). Severity: ${finalSeverity}.`
      : `GLIM criteria not met. (Phenotypic criteria met: ${phenotypicCount}/3, Etiologic criteria met: ${etiologicCount}/2).`
  };
}

// ==========================================
// 2. SGA EVALUATOR
// ==========================================

/**
 * Evaluates Subjective Global Assessment (SGA)
 * Preserves qualitative clinical A/B/C rating structure.
 * 
 * Ratings:
 * - A: Well nourished (Normal weight, no significant loss, adequate intake, minimal physical wasting)
 * - B: Moderately malnourished or suspected of being malnourished (Mild-to-moderate loss, dietary decline, mild wasting)
 * - C: Severely malnourished (Severe weight loss >10%, severe dietary deficit, functional impairment, severe muscle/fat loss, oedema)
 */
export function evaluateSGA(data) {
  const {
    medicalHistory,    // { weightChange, dietaryIntake, giSymptoms, functionalCapacity }
    physicalExam,      // { subcutaneousFat, muscleWasting, oedema, ascites }
    overallRating,     // 'A' | 'B' | 'C'
    clinicalNotes
  } = data || {};

  const rating = overallRating || 'A';
  let classification = '';
  let description = '';

  if (rating === 'A') {
    classification = 'SGA-A: Well Nourished';
    description = 'Normal nutritional state or mild symptoms with positive recent recovery trend.';
  } else if (rating === 'B') {
    classification = 'SGA-B: Moderately Malnourished (or Suspected)';
    description = 'Moderate weight loss (5-10%), reduced oral intake, mild-to-moderate physical subcutaneous fat or muscle wasting.';
  } else {
    classification = 'SGA-C: Severely Malnourished';
    description = 'Severe progressive weight loss (>10%), severe dietary restriction, functional capacity loss, obvious muscle wasting, loss of subcutaneous fat, oedema/ascites.';
  }

  return {
    tool: 'SGA',
    score: rating,
    classification,
    rating,
    description,
    assessmentData: {
      medicalHistory: medicalHistory || {},
      physicalExam: physicalExam || {},
      clinicalNotes: clinicalNotes || ''
    },
    summaryText: `Subjective Global Assessment rating: ${rating} (${classification}).`
  };
}

// ==========================================
// 3. MNA EVALUATOR
// ==========================================

/**
 * Evaluates Mini Nutritional Assessment (MNA) Short-Form
 * Maximum Score: 14 points
 * 
 * Questions:
 * A: Food intake decline past 3 months (0: severe, 1: moderate, 2: none)
 * B: Weight loss past 3 months (0: >3kg, 1: does not know, 2: 1-3kg, 3: no loss)
 * C: Mobility (0: bed/chair bound, 1: able to leave bed/chair but not out, 2: goes out)
 * D: Psychological stress / acute disease past 3 months (0: yes, 2: no)
 * E: Neuropsychological problems (0: severe dementia/depression, 1: mild dementia, 2: none)
 * F1: BMI score (0: <19, 1: 19-<21, 2: 21-<23, 3: >=23)
 * OR F2 (Fallback if BMI unavailable): Calf circumference (0: <31cm, 3: >=31cm)
 * 
 * Classification:
 * - 12–14: Normal nutritional status
 * - 8–11: At risk of malnutrition
 * - 0–7: Malnourished
 */
export function evaluateMNA(data, patient) {
  const {
    qA, // Food intake (0, 1, 2)
    qB, // Weight loss (0, 1, 2, 3)
    qC, // Mobility (0, 1, 2)
    qD, // Psychological stress (0, 2)
    qE, // Neuropsychological (0, 1, 2)
    useBMI = true,
    qF1, // BMI score (0, 1, 2, 3)
    qF2, // Calf circumference (0, 3)
    calfCircumference
  } = data || {};

  const scoreA = parseInt(qA ?? 2, 10);
  const scoreB = parseInt(qB ?? 3, 10);
  const scoreC = parseInt(qC ?? 2, 10);
  const scoreD = parseInt(qD ?? 2, 10);
  const scoreE = parseInt(qE ?? 2, 10);

  let scoreF = 0;
  let fMethod = 'F1 (BMI)';

  if (useBMI) {
    if (qF1 !== undefined && qF1 !== null) {
      scoreF = parseInt(qF1, 10);
    } else if (patient?.weight && patient?.height) {
      const bmi = calculateBMI(patient.weight, patient.height).value;
      if (bmi < 19) scoreF = 0;
      else if (bmi < 21) scoreF = 1;
      else if (bmi < 23) scoreF = 2;
      else scoreF = 3;
    }
  } else {
    fMethod = 'F2 (Calf Circumference)';
    if (qF2 !== undefined && qF2 !== null) {
      scoreF = parseInt(qF2, 10);
    } else if (calfCircumference !== undefined) {
      scoreF = parseFloat(calfCircumference) < 31 ? 0 : 3;
    }
  }

  const totalScore = scoreA + scoreB + scoreC + scoreD + scoreE + scoreF;

  let classification = 'Normal nutritional status';
  let severity = 'Normal';
  let actionGuideline = 'Rescreen periodically (e.g. annually or upon clinical change).';

  if (totalScore <= 7) {
    classification = 'Malnourished';
    severity = 'High Risk / Malnourished';
    actionGuideline = 'Full nutritional assessment, intervention by clinical dietitian, and tailored meal plans required.';
  } else if (totalScore <= 11) {
    classification = 'At risk of malnutrition';
    severity = 'Medium Risk / At Risk';
    actionGuideline = 'Close monitoring, dietary counseling, regular weight checks, and prevention strategies.';
  }

  return {
    tool: 'MNA',
    score: totalScore,
    maxScore: 14,
    classification,
    severity,
    breakdown: {
      qA: { label: 'Food intake decline', score: scoreA, max: 2 },
      qB: { label: 'Weight loss (past 3 months)', score: scoreB, max: 3 },
      qC: { label: 'Mobility', score: scoreC, max: 2 },
      qD: { label: 'Psychological stress / acute disease', score: scoreD, max: 2 },
      qE: { label: 'Neuropsychological problems', score: scoreE, max: 2 },
      qF: { label: fMethod, score: scoreF, max: 3, method: fMethod }
    },
    actionGuideline,
    summaryText: `MNA Screening Score: ${totalScore}/14 — ${classification}.`
  };
}

// ==========================================
// 4. MUST EVALUATOR
// ==========================================

/**
 * Evaluates MUST (Malnutrition Universal Screening Tool) - 5 Steps
 * 
 * Step 1: BMI Score
 *   - BMI > 20: 0 (Note: >30 indicates obesity)
 *   - BMI 18.5 - 20: 1
 *   - BMI < 18.5: 2
 * 
 * Step 2: Unplanned Weight Loss Score (past 3-6 months)
 *   - < 5%: 0
 *   - 5 - 10%: 1
 *   - > 10%: 2
 * 
 * Step 3: Acute Disease Effect Score
 *   - Acutely ill AND no nutritional intake for >5 days (or likely): 2
 *   - Otherwise: 0
 * 
 * Step 4: Overall Risk Score
 *   - 0: Low Risk
 *   - 1: Medium Risk
 *   - >= 2: High Risk
 * 
 * Step 5: Management Guidelines for Hospital, Care Home, and Community.
 */
export function evaluateMUST(data, patient) {
  const {
    bmiScore: manualBmiScore,
    previousWeight,
    currentWeight: dataCurrentWeight,
    percentWeightLoss: manualPercentLoss,
    isAcutelyIllNoIntake5Days
  } = data || {};

  const currentW = parseFloat(dataCurrentWeight || patient?.weight || 0);
  const prevW = parseFloat(previousWeight || 0);
  const heightCm = parseFloat(patient?.height || 0);

  // Step 1: BMI Score
  let bmiVal = 0;
  let bmiScore = 0;
  let isObese = false;

  if (currentW > 0 && heightCm > 0) {
    bmiVal = calculateBMI(currentW, heightCm).value;
    if (bmiVal > 20) {
      bmiScore = 0;
      if (bmiVal >= 30) isObese = true;
    } else if (bmiVal >= 18.5) {
      bmiScore = 1;
    } else {
      bmiScore = 2;
    }
  } else if (manualBmiScore !== undefined) {
    bmiScore = parseInt(manualBmiScore, 10);
  }

  // Step 2: Weight Loss Score
  let percentLoss = 0;
  let weightLossScore = 0;

  if (prevW > 0 && currentW > 0 && prevW > currentW) {
    percentLoss = parseFloat((((prevW - currentW) / prevW) * 100).toFixed(2));
    if (percentLoss > 10) {
      weightLossScore = 2;
    } else if (percentLoss >= 5) {
      weightLossScore = 1;
    } else {
      weightLossScore = 0;
    }
  } else if (manualPercentLoss !== undefined) {
    percentLoss = parseFloat(manualPercentLoss);
    if (percentLoss > 10) weightLossScore = 2;
    else if (percentLoss >= 5) weightLossScore = 1;
    else weightLossScore = 0;
  }

  // Step 3: Acute Disease Effect Score
  const acuteDiseaseScore = isAcutelyIllNoIntake5Days ? 2 : 0;

  // Step 4: Overall Risk
  const totalScore = bmiScore + weightLossScore + acuteDiseaseScore;

  let risk = 'Low Risk';
  let management = {};

  if (totalScore === 0) {
    risk = 'Low Risk';
    management = {
      category: 'Low Risk',
      action: 'Routine clinical care',
      rescreening: {
        hospital: 'Repeat screening weekly',
        careHome: 'Repeat screening monthly',
        community: 'Repeat screening annually for special groups (e.g. elderly >75y)'
      },
      carePlan: [
        'Document risk category in patient medical records.',
        'Follow standard dietary and clinical care guidelines.',
        'Treat underlying conditions.'
      ]
    };
  } else if (totalScore === 1) {
    risk = 'Medium Risk';
    management = {
      category: 'Medium Risk',
      action: 'Observe and document',
      rescreening: {
        hospital: 'Document dietary intake for 3 days; rescreen weekly',
        careHome: 'Document dietary intake for 3 days; rescreen at least monthly',
        community: 'Repeat screening at least every 2-3 months'
      },
      carePlan: [
        'Document all food and fluid intake for 3 days.',
        'If intake is adequate, continue monitoring and repeat screening.',
        'If intake is inadequate, follow local nutrition policy, set goals, improve/increase nutritional intake, monitor and review care plan.'
      ]
    };
  } else {
    risk = 'High Risk';
    management = {
      category: 'High Risk',
      action: 'Active Clinical Treatment',
      rescreening: {
        hospital: 'Weekly review and monitoring',
        careHome: 'Monthly review or as indicated by care plan',
        community: 'Monthly review and clinical dietitian monitoring'
      },
      carePlan: [
        'Refer to clinical dietitian, Nutritional Support Team (NST), or implement immediate local nutrition support protocol.',
        'Set specific nutritional goals (energy and protein requirements).',
        'Improve and increase nutritional intake (oral nutritional supplements, fortified meals, enteral/parenteral if indicated).',
        'Monitor and regularly review the nutritional care plan.',
        'Treat underlying illness, record special dietary needs according to local policy.'
      ]
    };
  }

  return {
    tool: 'MUST',
    score: totalScore,
    risk,
    classification: `${risk} (MUST Score: ${totalScore})`,
    isObese,
    breakdown: {
      step1BMI: {
        bmi: bmiVal,
        score: bmiScore,
        note: isObese ? `BMI ${bmiVal} kg/m² (Obese, Score: 0)` : `BMI ${bmiVal} kg/m² (Score: ${bmiScore})`
      },
      step2WeightLoss: {
        previousWeight: prevW,
        currentWeight: currentW,
        percentLoss,
        score: weightLossScore,
        note: `${percentLoss}% unplanned loss (Score: ${weightLossScore})`
      },
      step3AcuteDisease: {
        isAcutelyIllNoIntake5Days: !!isAcutelyIllNoIntake5Days,
        score: acuteDiseaseScore,
        note: isAcutelyIllNoIntake5Days ? 'Acutely ill + no intake >5 days (Score: 2)' : 'No acute disease effect (Score: 0)'
      }
    },
    management,
    summaryText: `MUST Overall Score: ${totalScore} — ${risk}.`
  };
}

/**
 * Master assessment router
 */
export function evaluateAssessment(toolName, assessmentData, patient) {
  const tool = (toolName || '').toUpperCase();
  switch (tool) {
    case 'GLIM':
      return evaluateGLIM(assessmentData, patient);
    case 'SGA':
      return evaluateSGA(assessmentData);
    case 'MNA':
      return evaluateMNA(assessmentData, patient);
    case 'MUST':
      return evaluateMUST(assessmentData, patient);
    default:
      throw new Error(`Unsupported assessment tool: ${toolName}`);
  }
}
