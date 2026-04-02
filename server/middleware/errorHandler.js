const AppError = require("../utils/AppError");

const errorHandler = (err, _req, res, _next) => {
  if (err.isOperational) {
    return res.status(err.statusCode).json({ error: err.message });
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ error: messages.join(". ") });
  }

  // Mongoose cast error (invalid ObjectId, etc.)
  if (err.name === "CastError") {
    return res.status(400).json({ error: `Invalid value for ${err.path}` });
  }

  console.error("Unhandled error:", err);
  res.status(500).json({ error: "An unexpected error occurred" });
};

module.exports = errorHandler;
