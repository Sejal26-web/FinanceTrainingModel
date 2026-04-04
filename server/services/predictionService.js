const Prediction = require("../models/Prediction");
const { runPythonPrediction } = require("./mlService");
const AppError = require("../utils/AppError");

const HISTORY_LIMIT = 50;

async function createPrediction(input, meta = {}) {
  const results = await runPythonPrediction(input);

  const prediction = await Prediction.create({
    user: meta.userId,
    applicantName: meta.applicantName,
    applicantAge: meta.applicantAge,
    employmentType: meta.employmentType,
    loanType: meta.loanType || "",
    supportDocs: meta.supportDocs || [],
    input,
    results,
  });

  return {
    id: prediction._id,
    applicantName: prediction.applicantName,
    input: prediction.input,
    results: prediction.results,
    createdAt: prediction.createdAt,
  };
}

async function getPredictionHistory() {
  return Prediction.find()
    .sort({ createdAt: -1 })
    .limit(HISTORY_LIMIT)
    .populate("user", "name email")
    .lean();
}

async function getUserPredictionHistory(userId) {
  return Prediction.find({ user: userId })
    .sort({ createdAt: -1 })
    .limit(HISTORY_LIMIT)
    .lean();
}

async function getPredictionStats() {
  const predictions = await Prediction.find().lean();
  const total = predictions.length;

  if (total === 0) {
    return { total: 0, knn: {}, rf: {} };
  }

  const knnApproved = predictions.filter(
    (p) => p.results?.knn?.prediction === "Approved"
  ).length;

  const rfApproved = predictions.filter(
    (p) => p.results?.rf?.prediction === "Approved"
  ).length;

  const agreementCount = predictions.filter(
    (p) => p.results?.knn?.prediction === p.results?.rf?.prediction
  ).length;

  return {
    total,
    knn: {
      approved: knnApproved,
      rejected: total - knnApproved,
      approvalRate: ((knnApproved / total) * 100).toFixed(2),
    },
    rf: {
      approved: rfApproved,
      rejected: total - rfApproved,
      approvalRate: ((rfApproved / total) * 100).toFixed(2),
    },
    agreement: {
      count: agreementCount,
      rate: ((agreementCount / total) * 100).toFixed(2),
    },
  };
}

module.exports = { createPrediction, getPredictionHistory, getUserPredictionHistory, getPredictionStats };
