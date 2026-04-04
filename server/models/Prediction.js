const mongoose = require("mongoose");

const predictionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    applicantName: { type: String, trim: true },
    applicantAge: { type: Number },
    employmentType: { type: String },
    loanType: {
      type: String,
      enum: ["Home Loan", "Personal Loan", "Education Loan", "Vehicle Loan", "Business Loan", "Gold Loan", "Agriculture Loan", ""],
      default: "",
    },
    supportDocs: [{ filename: String, originalName: String, path: String, size: Number }],
    input: {
      gender: { type: String, required: true, enum: ["Male", "Female"] },
      married: { type: String, required: true, enum: ["Yes", "No"] },
      dependents: { type: Number, required: true, min: 0, max: 10 },
      education: { type: String, required: true, enum: ["Graduate", "Not Graduate"] },
      self_employed: { type: String, required: true, enum: ["Yes", "No"] },
      applicant_income: { type: Number, required: true, min: 0 },
      coapplicant_income: { type: Number, required: true, min: 0 },
      loan_amount: { type: Number, required: true, min: 1 },
      loan_amount_term: { type: Number, required: true },
      credit_history: { type: Number, required: true, enum: [0, 1] },
      property_area: { type: String, required: true, enum: ["Urban", "Semiurban", "Rural"] },
    },
    results: {
      knn: {
        prediction: String,
        confidence: Number,
        probabilities: {
          rejected: Number,
          approved: Number,
        },
      },
      rf: {
        prediction: String,
        confidence: Number,
        probabilities: {
          rejected: Number,
          approved: Number,
        },
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Prediction", predictionSchema);
