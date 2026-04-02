const { getModelMetrics } = require("../services/metricsService");

function getMetrics(_req, res) {
  const metrics = getModelMetrics();
  res.json(metrics);
}

module.exports = { getMetrics };
