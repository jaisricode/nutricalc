/**
 * Physical Activity Factors
 * Per NutriCalc Project Specification
 */

export const PHYSICAL_ACTIVITY_LEVELS = [
  {
    id: 'sedentary',
    name: 'Sedentary',
    description: 'Typical daily living activities, desk job, minimal walking',
    factors: {
      Male: 1.00,
      Female: 1.00
    }
  },
  {
    id: 'low_activity',
    name: 'Low Activity',
    description: '+30–60 minutes moderate daily activity',
    factors: {
      Male: 1.11,
      Female: 1.12
    }
  },
  {
    id: 'active',
    name: 'Active',
    description: '≥60 minutes moderate daily activity',
    factors: {
      Male: 1.25,
      Female: 1.27
    }
  },
  {
    id: 'very_active',
    name: 'Very Active',
    description: '≥60 min moderate + 60 min vigorous OR 120 min moderate activity',
    factors: {
      Male: 1.48,
      Female: 1.45
    }
  },
  {
    id: 'resting',
    name: 'Resting',
    description: 'Complete resting state / clinical observation',
    factors: {
      Male: 1.10,
      Female: 1.10
    }
  },
  {
    id: 'confined_to_bed',
    name: 'Confined to Bed',
    description: 'Patient strictly confined to hospital bed / immobilized',
    factors: {
      Male: 1.20,
      Female: 1.20
    }
  },
  {
    id: 'out_of_bed',
    name: 'Out of Bed',
    description: 'Patient ambulatory within ward or room',
    factors: {
      Male: 1.30,
      Female: 1.30
    }
  }
];

export function getActivityFactor(gender, levelName) {
  const g = (gender || 'Male').trim().toLowerCase() === 'female' ? 'Female' : 'Male';
  const found = PHYSICAL_ACTIVITY_LEVELS.find(
    l => l.name.toLowerCase() === (levelName || '').toLowerCase() || l.id === levelName
  );
  if (!found) return PHYSICAL_ACTIVITY_LEVELS[0].factors[g];
  return found.factors[g];
}
