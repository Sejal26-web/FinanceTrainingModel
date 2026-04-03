const jwt = require("jsonwebtoken");
const AppError = require("../utils/AppError");
const User = require("../models/User");

const JWT_SECRET = process.env.JWT_SECRET || "loan_predictor_secret_key_2024";

async function protect(req, _res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw AppError.badRequest("Authentication required");
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      throw AppError.badRequest("User no longer exists");
    }

    req.user = user;
    next();
  } catch (err) {
    if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
      throw AppError.badRequest("Invalid or expired token");
    }
    throw err;
  }
}

module.exports = { protect, JWT_SECRET };
