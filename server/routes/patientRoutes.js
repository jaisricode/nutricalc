import express from 'express';
import {
  createPatientRecord,
  getAllPatients,
  getPatientById,
  updatePatientRecord,
  deletePatientRecord,
  getDashboardStats,
  evaluateScreeningEndpoint,
  calculateFormulasEndpoint
} from '../controllers/patientController.js';
import { validatePatientDetails, validateFormulaCalculation } from '../middleware/validator.js';

const router = express.Router();

// Dashboard Statistics
router.get('/stats/dashboard', getDashboardStats);

// Standalone Calculations & Evaluations
router.post('/evaluate-screening', evaluateScreeningEndpoint);
router.post('/calculate-formulas', validateFormulaCalculation, calculateFormulasEndpoint);

// Patient CRUD Endpoints
router.route('/')
  .post(validatePatientDetails, createPatientRecord)
  .get(getAllPatients);

router.route('/:id')
  .get(getPatientById)
  .put(updatePatientRecord)
  .delete(deletePatientRecord);

export default router;
