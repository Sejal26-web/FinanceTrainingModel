const express = require("express");
const asyncHandler = require("../middleware/asyncHandler");
const { protect } = require("../middleware/auth");
const authController = require("../controllers/authController");

const router = express.Router();

router.post("/register", asyncHandler(authController.register));
router.post("/login", asyncHandler(authController.login));
router.get("/profile", protect, asyncHandler(authController.getProfile));
router.put("/profile", protect, asyncHandler(authController.updateProfile));

module.exports = router;
