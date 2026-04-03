const {
  createPrediction,
  getPredictionHistory,
  getUserPredictionHistory,
  getPredictionStats,
} = require("../services/predictionService");

async function create(req, res) {
  const files = (req.files || []).map((f) => ({
    filename: f.filename,
    originalName: f.originalname,
    path: `/uploads/${f.filename}`,
    size: f.size,
  }));

  const meta = {
    userId: req.user?._id,
    applicantName: req.body.applicantName || req.user?.name,
    applicantAge: req.body.applicantAge ? Number(req.body.applicantAge) : req.user?.age,
    employmentType: req.body.employmentType || req.user?.employmentType,
    supportDocs: files,
  };

  const result = await createPrediction(req.validatedInput, meta);
  res.status(201).json(result);
}

async function getHistory(_req, res) {
  const predictions = await getPredictionHistory();
  res.json(predictions);
}

async function getMyHistory(req, res) {
  const predictions = await getUserPredictionHistory(req.user._id);
  res.json(predictions);
}

async function getStats(_req, res) {
  const stats = await getPredictionStats();
  res.json(stats);
}

module.exports = { create, getHistory, getMyHistory, getStats };
