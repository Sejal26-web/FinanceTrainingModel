const express = require("express");
const asyncHandler = require("../middleware/asyncHandler");
const { validatePredictionInput } = require("../middleware/validators");
const predictionController = require("../controllers/predictionController");

const router = express.Router();

router.post("/", validatePredictionInput, asyncHandler(predictionController.create));
router.get("/", asyncHandler(predictionController.getHistory));
router.get("/stats", asyncHandler(predictionController.getStats));

module.exports = router;
