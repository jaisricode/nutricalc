import mongoose from 'mongoose';

const PatientRecordSchema = new mongoose.Schema(
  {
    patientDetails: {
      name: {
        type: String,
        required: [true, 'Patient name is required'],
        trim: true
      },
      weight: {
        type: Number,
        required: [true, 'Weight (kg) is required'],
        min: [0.1, 'Weight must be greater than 0']
      },
      height: {
        type: Number,
        required: [true, 'Height (cm) is required'],
        min: [1, 'Height must be greater than 0']
      },
      age: {
        type: Number,
        required: [true, 'Age is required'],
        min: [0, 'Age must be a valid positive number']
      },
      gender: {
        type: String,
        required: [true, 'Gender is required'],
        enum: ['Male', 'Female', 'male', 'female'],
        set: (v) => v ? v.charAt(0).toUpperCase() + v.slice(1).toLowerCase() : v
      },
      ipNo: {
        type: String,
        trim: true,
        default: ''
      },
      district: {
        type: String,
        required: [true, 'District is required'],
        trim: true
      },
      state: {
        type: String,
        required: [true, 'State is required'],
        trim: true
      },
      pincode: {
        type: String,
        required: [true, 'Pincode is required'],
        trim: true
      }
    },

    screening: {
      selected: {
        type: Boolean,
        default: false
      },
      tool: {
        type: String,
        enum: ['GLIM', 'SGA', 'MNA', 'MUST', 'None', null],
        default: null
      },
      assessmentData: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
      },
      result: {
        score: mongoose.Schema.Types.Mixed,
        classification: String,
        severity: String,
        risk: String,
        breakdown: mongoose.Schema.Types.Mixed,
        criteria: mongoose.Schema.Types.Mixed,
        summaryText: String,
        management: mongoose.Schema.Types.Mixed
      }
    },

    formulas: {
      bmi: {
        type: Number,
        required: true
      },
      bmiCategory: {
        type: String,
        default: ''
      },
      ibw: {
        type: Number,
        required: true
      },
      abw: {
        type: Number,
        required: true
      },
      bmr: {
        type: Number,
        required: true
      },
      physicalActivity: {
        level: {
          type: String,
          default: 'Sedentary'
        },
        factor: {
          type: Number,
          default: 1.0
        },
        description: String
      },
      injury: {
        condition: {
          type: String,
          default: 'Normal / Minor Surgery'
        },
        factor: {
          type: Number,
          default: 1.0
        },
        minFactor: Number,
        maxFactor: Number,
        category: String
      },
      tee: {
        type: Number,
        required: true
      },
      breakdowns: {
        bmi: String,
        ibw: String,
        abw: String,
        bmr: String,
        tee: String
      }
    },

    clinicalNotes: {
      type: String,
      default: ''
    },

    metadata: {
      version: {
        type: String,
        default: '1.0.0'
      },
      assessor: {
        type: String,
        default: 'Clinical Nutritionist'
      },
      auditTrail: [
        {
          action: String,
          timestamp: {
            type: Date,
            default: Date.now
          },
          details: String
        }
      ]
    }
  },
  {
    timestamps: true
  }
);

// Indexes for fast searching and research retrieval
PatientRecordSchema.index({ 'patientDetails.name': 'text', 'patientDetails.ipNo': 'text' });
PatientRecordSchema.index({ 'patientDetails.state': 1, 'patientDetails.district': 1 });
PatientRecordSchema.index({ 'screening.tool': 1 });
PatientRecordSchema.index({ createdAt: -1 });

export default mongoose.model('PatientRecord', PatientRecordSchema);
