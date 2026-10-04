/**
 * API Service for NutriCalc
 */

const API_BASE = '/api';

async function handleResponse(response) {
  const data = await response.json().catch(() => ({
    success: false,
    message: `Server returned HTTP ${response.status}`
  }));

  if (!response.ok) {
    const errorMsg = data.errors ? data.errors.join(', ') : (data.message || 'Request failed');
    const err = new Error(errorMsg);
    err.status = response.status;
    err.details = data;
    throw err;
  }

  return data;
}

export const api = {
  // Health & Server Status
  getHealth: async () => {
    const res = await fetch(`${API_BASE}/health`);
    return handleResponse(res);
  },

  // Dashboard Stats
  getDashboardStats: async () => {
    const res = await fetch(`${API_BASE}/patients/stats/dashboard`);
    return handleResponse(res);
  },

  // Patient CRUD
  createPatient: async (patientPayload) => {
    const res = await fetch(`${API_BASE}/patients`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patientPayload)
    });
    return handleResponse(res);
  },

  getAllPatients: async (params = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') {
        query.append(k, v);
      }
    });

    const res = await fetch(`${API_BASE}/patients?${query.toString()}`);
    return handleResponse(res);
  },

  getPatientById: async (id) => {
    const res = await fetch(`${API_BASE}/patients/${id}`);
    return handleResponse(res);
  },

  updatePatient: async (id, updatedPayload) => {
    const res = await fetch(`${API_BASE}/patients/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedPayload)
    });
    return handleResponse(res);
  },

  deletePatient: async (id) => {
    const res = await fetch(`${API_BASE}/patients/${id}`, {
      method: 'DELETE'
    });
    return handleResponse(res);
  },

  // Standalone Calculation / Evaluation Endpoints
  evaluateScreening: async (tool, assessmentData, patientDetails) => {
    const res = await fetch(`${API_BASE}/evaluate-screening`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tool, assessmentData, patientDetails })
    });
    return handleResponse(res);
  },

  calculateFormulas: async (formulaParams) => {
    const res = await fetch(`${API_BASE}/calculate-formulas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formulaParams)
    });
    return handleResponse(res);
  }
};
