import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import PatientRecord from '../models/PatientRecord.js';
import { calculateAllFormulas } from '../services/calculationEngine.js';
import { evaluateGLIM, evaluateSGA, evaluateMNA, evaluateMUST } from '../services/assessmentEvaluators.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });
dotenv.config({ path: path.join(__dirname, '../../.env') });

const samplePatients = [
  {
    patientDetails: {
      name: 'John Doe',
      ipNo: 'IP-2026-8801',
      weight: 70,
      height: 170,
      age: 45,
      gender: 'Male',
      district: 'Bengaluru Urban',
      state: 'Karnataka',
      pincode: '560001'
    },
    screeningType: 'MUST',
    screeningData: {
      previousWeight: 76,
      currentWeight: 70,
      isAcutelyIllNoIntake5Days: false
    },
    activity: {
      level: 'Active',
      factor: 1.25
    },
    injury: {
      condition: 'Ventilator',
      factor: 1.60,
      category: 'Specific'
    }
  },
  {
    patientDetails: {
      name: 'Eleanor Vance',
      ipNo: 'IP-2026-8802',
      weight: 48,
      height: 158,
      age: 72,
      gender: 'Female',
      district: 'Mumbai Suburban',
      state: 'Maharashtra',
      pincode: '400050'
    },
    screeningType: 'GLIM',
    screeningData: {
      weightLoss: {
        usualWeight: 55,
        currentWeight: 48,
        timePeriod: 'within_6_months'
      },
      bmiData: {
        useAsianThreshold: true
      },
      muscleMass: {
        isReduced: true,
        assessmentMethod: 'Calf circumference',
        details: 'Calf circumference 29.5 cm (<31 cm cutoff)'
      },
      foodIntake: {
        ingestion50Percent1to2Weeks: true,
        chronicGICondition: true,
        symptoms: ['Nausea', 'Anorexia']
      },
      diseaseBurden: {
        hasChronicDisease: true,
        chronicDiseaseType: 'COPD, Malnourished',
        crp: 18.5
      }
    },
    activity: {
      level: 'Confined to Bed',
      factor: 1.20
    },
    injury: {
      condition: 'COPD, Malnourished',
      factor: 1.30,
      category: 'Specific'
    }
  },
  {
    patientDetails: {
      name: 'Rajesh Kumar',
      ipNo: 'IP-2026-8803',
      weight: 62,
      height: 165,
      age: 58,
      gender: 'Male',
      district: 'Chennai',
      state: 'Tamil Nadu',
      pincode: '600001'
    },
    screeningType: 'SGA',
    screeningData: {
      overallRating: 'B',
      medicalHistory: {
        weightLoss6m: '5–10% loss',
        weightChange2w: 'No change but below usual weight',
        dietaryIntake: 'Suboptimal diet',
        giSymptoms: ['Nausea'],
        functionalCapacity: 'Difficulty with ambulation / normal activities'
      },
      physicalExam: {
        subcutaneousFat: 'Moderate loss around triceps',
        muscleWasting: 'Mild wasting in quadriceps and temples',
        oedema: 'Mild to moderate',
        ascites: 'No sign'
      },
      clinicalNotes: 'Post-op day 4 following abdominal surgery. Appetite improving slowly.'
    },
    activity: {
      level: 'Low Activity',
      factor: 1.11
    },
    injury: {
      condition: 'Surgery',
      factor: 1.20,
      minFactor: 1.1,
      maxFactor: 1.2,
      category: 'General'
    }
  },
  {
    patientDetails: {
      name: 'Margaret Jenkins',
      ipNo: 'IP-2026-8804',
      weight: 52,
      height: 160,
      age: 78,
      gender: 'Female',
      district: 'Hyderabad',
      state: 'Telangana',
      pincode: '500001'
    },
    screeningType: 'MNA',
    screeningData: {
      qA: 1, // moderate decline in intake
      qB: 2, // 1-3 kg loss
      qC: 1, // leaves bed/chair but does not go out
      qD: 0, // acute psychological stress
      qE: 1, // mild dementia
      useBMI: true,
      qF1: 1 // BMI 19 to <21
    },
    activity: {
      level: 'Resting',
      factor: 1.10
    },
    injury: {
      condition: 'Normal / Minor Surgery',
      factor: 1.0,
      category: 'Specific'
    }
  }
];

async function seedDatabase() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.log('⚠️  No MONGODB_URI found. Seed script requires MongoDB Atlas connection string.');
    process.exit(0);
  }

  try {
    await mongoose.connect(uri);
    console.log('Connected to MongoDB. Clearing existing test data...');
    await PatientRecord.deleteMany({});

    console.log('Seeding clinical test patient records...');

    for (const item of samplePatients) {
      let screeningResult = null;
      if (item.screeningType === 'GLIM') {
        screeningResult = evaluateGLIM(item.screeningData, item.patientDetails);
      } else if (item.screeningType === 'SGA') {
        screeningResult = evaluateSGA(item.screeningData);
      } else if (item.screeningType === 'MNA') {
        screeningResult = evaluateMNA(item.screeningData, item.patientDetails);
      } else if (item.screeningType === 'MUST') {
        screeningResult = evaluateMUST(item.screeningData, item.patientDetails);
      }

      const formulas = calculateAllFormulas(item.patientDetails, {
        activityFactor: item.activity.factor,
        activityLevel: item.activity.level,
        injuryFactor: item.injury.factor,
        injuryCondition: item.injury.condition,
        injuryMin: item.injury.minFactor,
        injuryMax: item.injury.maxFactor
      });

      const record = new PatientRecord({
        patientDetails: item.patientDetails,
        screening: {
          selected: true,
          tool: item.screeningType,
          assessmentData: item.screeningData,
          result: screeningResult
        },
        formulas: {
          ...formulas,
          physicalActivity: {
            level: item.activity.level,
            factor: item.activity.factor
          },
          injury: {
            condition: item.injury.condition,
            factor: item.injury.factor,
            minFactor: item.injury.minFactor,
            maxFactor: item.injury.maxFactor,
            category: item.injury.category
          }
        },
        clinicalNotes: `Routine clinical screening and calorie requirement audit for ${item.patientDetails.name}.`
      });

      await record.save();
      console.log(`✓ Inserted: ${item.patientDetails.name} (${item.screeningType})`);
    }

    console.log('🎉 Seeding completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding DB:', err);
    process.exit(1);
  }
}

seedDatabase();
