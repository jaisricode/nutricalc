import mongoose from 'mongoose';
import PatientRecord from '../models/PatientRecord.js';
import { calculateAllFormulas } from '../services/calculationEngine.js';
import { evaluateAssessment } from '../services/assessmentEvaluators.js';

// In-Memory fallback store if MongoDB Atlas is not yet connected by user
const memoryStore = new Map();

const isDBConnected = () => mongoose.connection.readyState === 1;

/**
 * @route   POST /api/patients
 * @desc    Save a complete patient record with screening & formula results
 */
export const createPatientRecord = async (req, res, next) => {
  try {
    const { patientDetails, screening, formulas, clinicalNotes, assessor } = req.body;

    // 1. Compute or verify nutritional formulas
    const calculatedFormulas = calculateAllFormulas(patientDetails, {
      activityFactor: formulas?.physicalActivity?.factor,
      injuryFactor: formulas?.injury?.factor,
      activityLevel: formulas?.physicalActivity?.level,
      injuryCondition: formulas?.injury?.condition,
      injuryMin: formulas?.injury?.minFactor,
      injuryMax: formulas?.injury?.maxFactor
    });

    // 2. Compute or verify screening assessment if selected
    let evaluatedScreening = {
      selected: false,
      tool: null,
      assessmentData: {},
      result: null
    };

    if (screening && screening.selected && screening.tool && screening.tool !== 'None') {
      const evalResult = evaluateAssessment(screening.tool, screening.assessmentData, patientDetails);
      evaluatedScreening = {
        selected: true,
        tool: screening.tool,
        assessmentData: screening.assessmentData || {},
        result: evalResult
      };
    }

    const newRecordData = {
      patientDetails,
      screening: evaluatedScreening,
      formulas: {
        ...calculatedFormulas,
        physicalActivity: {
          level: formulas?.physicalActivity?.level || 'Sedentary',
          factor: formulas?.physicalActivity?.factor || 1.0,
          description: formulas?.physicalActivity?.description || ''
        },
        injury: {
          condition: formulas?.injury?.condition || 'Normal / Minor Surgery',
          factor: formulas?.injury?.factor || 1.0,
          minFactor: formulas?.injury?.minFactor,
          maxFactor: formulas?.injury?.maxFactor,
          category: formulas?.injury?.category || 'General'
        }
      },
      clinicalNotes: clinicalNotes || '',
      metadata: {
        version: '1.0.0',
        assessor: assessor || 'Clinical Nutritionist',
        auditTrail: [
          {
            action: 'Record Created',
            timestamp: new Date(),
            details: `Patient ${patientDetails.name} registered. Screening: ${evaluatedScreening.selected ? evaluatedScreening.tool : 'None'}. TEE: ${calculatedFormulas.tee} kcal/day.`
          }
        ]
      }
    };

    if (isDBConnected()) {
      const patient = new PatientRecord(newRecordData);
      const savedPatient = await patient.save();
      return res.status(201).json({
        success: true,
        message: 'Patient record created and saved to MongoDB Atlas successfully.',
        data: savedPatient
      });
    } else {
      // Memory Store fallback
      const mockId = new mongoose.Types.ObjectId().toString();
      const mockPatient = {
        _id: mockId,
        ...newRecordData,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      memoryStore.set(mockId, mockPatient);
      return res.status(201).json({
        success: true,
        message: 'Patient record saved in local memory store (MongoDB Atlas URI not connected).',
        data: mockPatient,
        storageMode: 'memory'
      });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/patients
 * @desc    Get all patient records with search, filter, and pagination
 */
export const getAllPatients = async (req, res, next) => {
  try {
    const {
      search,
      tool,
      risk,
      gender,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 20
    } = req.query;

    if (isDBConnected()) {
      const query = {};

      if (search) {
        query.$or = [
          { 'patientDetails.name': { $regex: search, $options: 'i' } },
          { 'patientDetails.ipNo': { $regex: search, $options: 'i' } },
          { 'patientDetails.district': { $regex: search, $options: 'i' } },
          { 'patientDetails.state': { $regex: search, $options: 'i' } }
        ];
      }

      if (tool && tool !== 'all') {
        query['screening.tool'] = tool.toUpperCase();
      }

      if (gender && gender !== 'all') {
        query['patientDetails.gender'] = new RegExp(`^${gender}$`, 'i');
      }

      if (risk && risk !== 'all') {
        query['screening.result.classification'] = { $regex: risk, $options: 'i' };
      }

      const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
      const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

      const [patients, total] = await Promise.all([
        PatientRecord.find(query).sort(sort).skip(skip).limit(parseInt(limit, 10)),
        PatientRecord.countDocuments(query)
      ]);

      return res.json({
        success: true,
        count: patients.length,
        total,
        page: parseInt(page, 10),
        totalPages: Math.ceil(total / parseInt(limit, 10)) || 1,
        data: patients
      });
    } else {
      // Memory Store filtering
      let records = Array.from(memoryStore.values());

      if (search) {
        const s = search.toLowerCase();
        records = records.filter(p =>
          p.patientDetails.name.toLowerCase().includes(s) ||
          (p.patientDetails.ipNo && p.patientDetails.ipNo.toLowerCase().includes(s)) ||
          p.patientDetails.district.toLowerCase().includes(s) ||
          p.patientDetails.state.toLowerCase().includes(s)
        );
      }

      if (tool && tool !== 'all') {
        records = records.filter(p => p.screening?.tool?.toUpperCase() === tool.toUpperCase());
      }

      if (gender && gender !== 'all') {
        records = records.filter(p => p.patientDetails.gender.toLowerCase() === gender.toLowerCase());
      }

      records.sort((a, b) => {
        const valA = a[sortBy] || a.patientDetails[sortBy] || a.createdAt;
        const valB = b[sortBy] || b.patientDetails[sortBy] || b.createdAt;
        if (sortOrder === 'asc') return valA > valB ? 1 : -1;
        return valA < valB ? 1 : -1;
      });

      const total = records.length;
      const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
      const paginated = records.slice(skip, skip + parseInt(limit, 10));

      return res.json({
        success: true,
        count: paginated.length,
        total,
        page: parseInt(page, 10),
        totalPages: Math.ceil(total / parseInt(limit, 10)) || 1,
        data: paginated,
        storageMode: 'memory'
      });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/patients/:id
 * @desc    Get single patient record by ID
 */
export const getPatientById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (isDBConnected()) {
      const patient = await PatientRecord.findById(id);
      if (!patient) {
        return res.status(404).json({
          success: false,
          message: 'Patient record not found.'
        });
      }
      return res.json({ success: true, data: patient });
    } else {
      const patient = memoryStore.get(id);
      if (!patient) {
        return res.status(404).json({
          success: false,
          message: 'Patient record not found in memory store.'
        });
      }
      return res.json({ success: true, data: patient, storageMode: 'memory' });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT /api/patients/:id
 * @desc    Update a patient record
 */
export const updatePatientRecord = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { patientDetails, screening, formulas, clinicalNotes } = req.body;

    let updatedFields = {};

    if (patientDetails) {
      updatedFields.patientDetails = patientDetails;
      // Recompute formulas
      const calculatedFormulas = calculateAllFormulas(patientDetails, {
        activityFactor: formulas?.physicalActivity?.factor,
        injuryFactor: formulas?.injury?.factor,
        activityLevel: formulas?.physicalActivity?.level,
        injuryCondition: formulas?.injury?.condition,
        injuryMin: formulas?.injury?.minFactor,
        injuryMax: formulas?.injury?.maxFactor
      });
      updatedFields.formulas = calculatedFormulas;
    }

    if (screening) {
      let evaluatedScreening = {
        selected: false,
        tool: null,
        assessmentData: {},
        result: null
      };

      if (screening.selected && screening.tool && screening.tool !== 'None') {
        const details = patientDetails || (await (isDBConnected() ? PatientRecord.findById(id) : memoryStore.get(id)))?.patientDetails;
        const evalResult = evaluateAssessment(screening.tool, screening.assessmentData, details);
        evaluatedScreening = {
          selected: true,
          tool: screening.tool,
          assessmentData: screening.assessmentData || {},
          result: evalResult
        };
      }
      updatedFields.screening = evaluatedScreening;
    }

    if (clinicalNotes !== undefined) {
      updatedFields.clinicalNotes = clinicalNotes;
    }

    if (isDBConnected()) {
      const updated = await PatientRecord.findByIdAndUpdate(
        id,
        {
          $set: updatedFields,
          $push: {
            'metadata.auditTrail': {
              action: 'Record Updated',
              timestamp: new Date(),
              details: 'Record modified and recalculations applied.'
            }
          }
        },
        { new: true, runValidators: true }
      );

      if (!updated) {
        return res.status(404).json({ success: false, message: 'Patient not found.' });
      }

      return res.json({ success: true, message: 'Patient record updated.', data: updated });
    } else {
      const existing = memoryStore.get(id);
      if (!existing) {
        return res.status(404).json({ success: false, message: 'Patient not found.' });
      }

      const updated = {
        ...existing,
        ...updatedFields,
        updatedAt: new Date()
      };
      updated.metadata.auditTrail.push({
        action: 'Record Updated',
        timestamp: new Date(),
        details: 'Record modified in memory store.'
      });
      memoryStore.set(id, updated);

      return res.json({ success: true, message: 'Patient record updated.', data: updated, storageMode: 'memory' });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @route   DELETE /api/patients/:id
 * @desc    Delete patient record
 */
export const deletePatientRecord = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (isDBConnected()) {
      const deleted = await PatientRecord.findByIdAndDelete(id);
      if (!deleted) {
        return res.status(404).json({ success: false, message: 'Patient record not found.' });
      }
      return res.json({ success: true, message: 'Patient record deleted successfully.' });
    } else {
      if (!memoryStore.has(id)) {
        return res.status(404).json({ success: false, message: 'Patient record not found.' });
      }
      memoryStore.delete(id);
      return res.json({ success: true, message: 'Patient record deleted from memory store.' });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/patients/stats/dashboard
 * @desc    Get dashboard statistics (real metrics, no fabricated stats)
 */
export const getDashboardStats = async (req, res, next) => {
  try {
    if (isDBConnected()) {
      const [totalPatients, glimCount, sgaCount, mnaCount, mustCount, recentPatients, recentAssessments] = await Promise.all([
        PatientRecord.countDocuments(),
        PatientRecord.countDocuments({ 'screening.tool': 'GLIM' }),
        PatientRecord.countDocuments({ 'screening.tool': 'SGA' }),
        PatientRecord.countDocuments({ 'screening.tool': 'MNA' }),
        PatientRecord.countDocuments({ 'screening.tool': 'MUST' }),
        PatientRecord.find().sort({ createdAt: -1 }).limit(5).select('patientDetails formulas screening createdAt'),
        PatientRecord.find({ 'screening.selected': true }).sort({ createdAt: -1 }).limit(5).select('patientDetails screening createdAt')
      ]);

      const totalAssessments = glimCount + sgaCount + mnaCount + mustCount;

      return res.json({
        success: true,
        data: {
          totalPatients,
          totalAssessments,
          tools: {
            GLIM: glimCount,
            SGA: sgaCount,
            MNA: mnaCount,
            MUST: mustCount
          },
          recentPatients,
          recentAssessments
        }
      });
    } else {
      const records = Array.from(memoryStore.values());
      const totalPatients = records.length;
      const glimCount = records.filter(r => r.screening?.tool === 'GLIM').length;
      const sgaCount = records.filter(r => r.screening?.tool === 'SGA').length;
      const mnaCount = records.filter(r => r.screening?.tool === 'MNA').length;
      const mustCount = records.filter(r => r.screening?.tool === 'MUST').length;
      const totalAssessments = glimCount + sgaCount + mnaCount + mustCount;

      const recentPatients = [...records].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);
      const recentAssessments = records.filter(r => r.screening?.selected).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);

      return res.json({
        success: true,
        data: {
          totalPatients,
          totalAssessments,
          tools: {
            GLIM: glimCount,
            SGA: sgaCount,
            MNA: mnaCount,
            MUST: mustCount
          },
          recentPatients,
          recentAssessments
        },
        storageMode: 'memory'
      });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/evaluate-screening
 * @desc    Standalone evaluation endpoint
 */
export const evaluateScreeningEndpoint = async (req, res, next) => {
  try {
    const { tool, assessmentData, patientDetails } = req.body;

    if (!tool) {
      return res.status(400).json({ success: false, message: 'Assessment tool name is required.' });
    }

    const result = evaluateAssessment(tool, assessmentData, patientDetails);

    return res.json({
      success: true,
      tool,
      result
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/calculate-formulas
 * @desc    Standalone formula calculation endpoint
 */
export const calculateFormulasEndpoint = async (req, res, next) => {
  try {
    const { weight, height, age, gender, activityFactor, injuryFactor, activityLevel, injuryCondition, injuryMin, injuryMax } = req.body;

    const results = calculateAllFormulas(
      { weight, height, age, gender },
      { activityFactor, injuryFactor, activityLevel, injuryCondition, injuryMin, injuryMax }
    );

    return res.json({
      success: true,
      data: results
    });
  } catch (error) {
    next(error);
  }
};
