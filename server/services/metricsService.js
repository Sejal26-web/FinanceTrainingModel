const fs = require("fs");
const path = require("path");
const AppError = require("../utils/AppError");

const METRICS_PATH = path.join(__dirname, "..", "..", "ml", "metrics.json");

function getModelMetrics() {
  if (!fs.existsSync(METRICS_PATH)) {
    throw AppError.notFound("Metrics not found. Train the models first (npm run ml:train).");
  }

  const raw = fs.readFileSync(METRICS_PATH, "utf-8");

  try {
    return JSON.parse(raw);
  } catch {
    throw AppError.internal("Metrics file is corrupted");
  }
}

module.exports = { getModelMetrics };
