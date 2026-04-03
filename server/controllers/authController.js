const jwt = require("jsonwebtoken");
const User = require("../models/User");
const AppError = require("../utils/AppError");
const { JWT_SECRET } = require("../middleware/auth");

function signToken(id) {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: "7d" });
}

exports.register = async (req, res) => {
  const { name, email, password, age, employmentType } = req.body;

  if (!name || !email || !password) {
    throw AppError.badRequest("Name, email and password are required");
  }

  if (password.length < 6) {
    throw AppError.badRequest("Password must be at least 6 characters");
  }

  const existing = await User.findOne({ email: email.toLowerCase().trim() });
  if (existing) {
    throw AppError.badRequest("Email already registered");
  }

  const user = await User.create({
    name: name.trim(),
    email: email.toLowerCase().trim(),
    password,
    age: age || undefined,
    employmentType: employmentType || "",
  });

  const token = signToken(user._id);

  res.status(201).json({
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      age: user.age,
      employmentType: user.employmentType,
    },
  });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw AppError.badRequest("Email and password are required");
  }

  const user = await User.findOne({ email: email.toLowerCase().trim() }).select("+password");

  if (!user || !(await user.comparePassword(password))) {
    throw AppError.badRequest("Invalid email or password");
  }

  const token = signToken(user._id);

  res.json({
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      age: user.age,
      employmentType: user.employmentType,
    },
  });
};

exports.getProfile = async (req, res) => {
  res.json({
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      age: req.user.age,
      employmentType: req.user.employmentType,
      createdAt: req.user.createdAt,
    },
  });
};

exports.updateProfile = async (req, res) => {
  const { name, age, employmentType } = req.body;
  const updates = {};

  if (name) updates.name = name.trim();
  if (age !== undefined) updates.age = age;
  if (employmentType !== undefined) updates.employmentType = employmentType;

  const user = await User.findByIdAndUpdate(req.user._id, updates, {
    new: true,
    runValidators: true,
  });

  res.json({
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      age: user.age,
      employmentType: user.employmentType,
    },
  });
};
