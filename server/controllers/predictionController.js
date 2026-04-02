const {
  createPrediction,
  getPredictionHistory,
  getPredictionStats,
} = require("../services/predictionService");

async function create(req, res) {
  const result = await createPrediction(req.validatedInput);
  res.status(201).json(result);
}

async function getHistory(_req, res) {
  const predictions = await getPredictionHistory();
  res.json(predictions);
}

async function getStats(_req, res) {
  const stats = await getPredictionStats();
  res.json(stats);
}

module.exports = { create, getHistory, getStats };
