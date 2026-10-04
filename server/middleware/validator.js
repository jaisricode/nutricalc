/**
 * Request Validation Middleware for NutriCalc
 */

export const validatePatientDetails = (req, res, next) => {
  const { patientDetails } = req.body;

  if (!patientDetails) {
    return res.status(400).json({
      success: false,
      message: 'patientDetails object is required.'
    });
  }

  const { name, weight, height, age, gender, district, state, pincode } = patientDetails;
  const errors = [];

  if (!name || !name.trim()) errors.push('Patient name is required.');
  
  const w = parseFloat(weight);
  if (isNaN(w) || w <= 0) errors.push('Weight must be a positive number greater than 0 kg.');
  
  const h = parseFloat(height);
  if (isNaN(h) || h <= 0) errors.push('Height must be a positive number greater than 0 cm.');
  
  const a = parseFloat(age);
  if (isNaN(a) || a < 0) errors.push('Age must be a valid non-negative number.');
  
  if (!gender || !['male', 'female'].includes(gender.trim().toLowerCase())) {
    errors.push('Gender must be either Male or Female.');
  }

  if (!district || !district.trim()) errors.push('District is required.');
  if (!state || !state.trim()) errors.push('State is required.');
  if (!pincode || !pincode.toString().trim()) errors.push('Pincode is required.');

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed.',
      errors
    });
  }

  next();
};

export const validateFormulaCalculation = (req, res, next) => {
  const { weight, height, age, gender, activityFactor, injuryFactor, injuryMin, injuryMax } = req.body;
  const errors = [];

  const w = parseFloat(weight);
  if (isNaN(w) || w <= 0) errors.push('Weight must be greater than 0 kg.');

  const h = parseFloat(height);
  if (isNaN(h) || h <= 0) errors.push('Height must be greater than 0 cm.');

  const a = parseFloat(age);
  if (isNaN(a) || a < 0) errors.push('Age must be a valid non-negative number.');

  if (!gender || !['male', 'female'].includes(gender.trim().toLowerCase())) {
    errors.push('Gender must be either Male or Female.');
  }

  if (activityFactor !== undefined) {
    const af = parseFloat(activityFactor);
    if (isNaN(af) || af <= 0) errors.push('Activity factor must be greater than 0.');
  }

  if (injuryFactor !== undefined) {
    const ifact = parseFloat(injuryFactor);
    if (isNaN(ifact) || ifact <= 0) errors.push('Injury factor must be greater than 0.');

    if (injuryMin !== undefined && injuryMax !== undefined) {
      const min = parseFloat(injuryMin);
      const max = parseFloat(injuryMax);
      if (ifact < min - 0.001 || ifact > max + 0.001) {
        errors.push(`Selected injury factor (${ifact}) must fall within allowed range [${min} – ${max}].`);
      }
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Formula parameters validation failed.',
      errors
    });
  }

  next();
};
