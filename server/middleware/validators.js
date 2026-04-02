const AppError = require("../utils/AppError");

const VALID_GENDERS = ["Male", "Female"];
const VALID_YES_NO = ["Yes", "No"];
const VALID_EDUCATION = ["Graduate", "Not Graduate"];
const VALID_PROPERTY_AREAS = ["Urban", "Semiurban", "Rural"];
const VALID_LOAN_TERMS = [36, 60, 84, 120, 180, 240, 300, 360, 480];

const PREDICTION_RULES = [
  { field: "gender", type: "enum", values: VALID_GENDERS },
  { field: "married", type: "enum", values: VALID_YES_NO },
  { field: "dependents", type: "number", min: 0, max: 10, integer: true },
  { field: "education", type: "enum", values: VALID_EDUCATION },
  { field: "self_employed", type: "enum", values: VALID_YES_NO },
  { field: "applicant_income", type: "number", min: 0 },
  { field: "coapplicant_income", type: "number", min: 0 },
  { field: "loan_amount", type: "number", min: 1 },
  { field: "loan_amount_term", type: "enum_number", values: VALID_LOAN_TERMS },
  { field: "credit_history", type: "enum_number", values: [0, 1] },
  { field: "property_area", type: "enum", values: VALID_PROPERTY_AREAS },
];

function validatePredictionInput(req, _res, next) {
  const errors = [];
  const sanitized = {};

  for (const rule of PREDICTION_RULES) {
    const raw = req.body[rule.field];

    if (raw === undefined || raw === null || raw === "") {
      errors.push(`${rule.field} is required`);
      continue;
    }

    if (rule.type === "enum") {
      if (!rule.values.includes(raw)) {
        errors.push(`${rule.field} must be one of: ${rule.values.join(", ")}`);
      } else {
        sanitized[rule.field] = raw;
      }
    }

    if (rule.type === "number") {
      const num = Number(raw);
      if (isNaN(num)) {
        errors.push(`${rule.field} must be a valid number`);
      } else if (rule.min !== undefined && num < rule.min) {
        errors.push(`${rule.field} must be at least ${rule.min}`);
      } else if (rule.max !== undefined && num > rule.max) {
        errors.push(`${rule.field} must be at most ${rule.max}`);
      } else if (rule.integer && !Number.isInteger(num)) {
        errors.push(`${rule.field} must be an integer`);
      } else {
        sanitized[rule.field] = num;
      }
    }

    if (rule.type === "enum_number") {
      const num = Number(raw);
      if (isNaN(num) || !rule.values.includes(num)) {
        errors.push(`${rule.field} must be one of: ${rule.values.join(", ")}`);
      } else {
        sanitized[rule.field] = num;
      }
    }
  }

  if (errors.length > 0) {
    throw AppError.badRequest(errors.join("; "));
  }

  req.validatedInput = sanitized;
  next();
}

module.exports = { validatePredictionInput };
