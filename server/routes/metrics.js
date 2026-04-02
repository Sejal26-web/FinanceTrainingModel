const express = require("express");
const asyncHandler = require("../middleware/asyncHandler");
const metricsController = require("../controllers/metricsController");

const router = express.Router();

router.get("/", asyncHandler(metricsController.getMetrics));

module.exports = router;
