const path = require("path");
const mongoose = require("mongoose");
const Prediction = require("./models/Prediction");
require("dotenv").config({ path: path.resolve(__dirname, ".env") });

const samplePredictions = [
  {
    input: { gender: "Male", married: "Yes", dependents: 0, education: "Graduate", self_employed: "No", applicant_income: 5849, coapplicant_income: 0, loan_amount: 128, loan_amount_term: 360, credit_history: 1, property_area: "Urban" },
    results: { knn: { prediction: "Approved", confidence: 80, probabilities: { rejected: 20, approved: 80 } }, rf: { prediction: "Approved", confidence: 92, probabilities: { rejected: 8, approved: 92 } } },
  },
  {
    input: { gender: "Female", married: "No", dependents: 1, education: "Not Graduate", self_employed: "No", applicant_income: 2583, coapplicant_income: 2358, loan_amount: 120, loan_amount_term: 360, credit_history: 1, property_area: "Semiurban" },
    results: { knn: { prediction: "Approved", confidence: 60, probabilities: { rejected: 40, approved: 60 } }, rf: { prediction: "Approved", confidence: 75, probabilities: { rejected: 25, approved: 75 } } },
  },
  {
    input: { gender: "Male", married: "Yes", dependents: 2, education: "Graduate", self_employed: "Yes", applicant_income: 3000, coapplicant_income: 0, loan_amount: 250, loan_amount_term: 360, credit_history: 0, property_area: "Rural" },
    results: { knn: { prediction: "Rejected", confidence: 85, probabilities: { rejected: 85, approved: 15 } }, rf: { prediction: "Rejected", confidence: 90, probabilities: { rejected: 90, approved: 10 } } },
  },
  {
    input: { gender: "Male", married: "Yes", dependents: 0, education: "Graduate", self_employed: "No", applicant_income: 9000, coapplicant_income: 5000, loan_amount: 200, loan_amount_term: 180, credit_history: 1, property_area: "Urban" },
    results: { knn: { prediction: "Approved", confidence: 95, probabilities: { rejected: 5, approved: 95 } }, rf: { prediction: "Approved", confidence: 97, probabilities: { rejected: 3, approved: 97 } } },
  },
  {
    input: { gender: "Female", married: "No", dependents: 0, education: "Not Graduate", self_employed: "Yes", applicant_income: 1800, coapplicant_income: 0, loan_amount: 100, loan_amount_term: 360, credit_history: 0, property_area: "Rural" },
    results: { knn: { prediction: "Rejected", confidence: 90, probabilities: { rejected: 90, approved: 10 } }, rf: { prediction: "Rejected", confidence: 95, probabilities: { rejected: 95, approved: 5 } } },
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/loan_predictor");
    console.log("Connected to MongoDB");

    await Prediction.deleteMany({});
    console.log("Cleared existing predictions");

    await Prediction.insertMany(samplePredictions);
    console.log(`Seeded ${samplePredictions.length} predictions`);

    await mongoose.disconnect();
    console.log("Done.");
  } catch (err) {
    console.error("Seed error:", err);
    process.exit(1);
  }
}

seed();
