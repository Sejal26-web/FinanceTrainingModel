const express = require("express");
const asyncHandler = require("../middleware/asyncHandler");
const { validatePredictionInput } = require("../middleware/validators");
const { protect } = require("../middleware/auth");
const upload = require("../middleware/upload");
const predictionController = require("../controllers/predictionController");

const router = express.Router();

router.post(
  "/",
  protect,
  upload.array("supportDocs", 5),
  validatePredictionInput,
  asyncHandler(predictionController.create)
);
router.get("/", asyncHandler(predictionController.getHistory));
router.get("/my", protect, asyncHandler(predictionController.getMyHistory));
router.get("/stats", asyncHandler(predictionController.getStats));

module.exports = router;
