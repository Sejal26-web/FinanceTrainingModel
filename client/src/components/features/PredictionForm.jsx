import { useState } from "react";
import { submitPrediction } from "../../services/api";
import GlassCard from "../ui/GlassCard";
import SectionTitle from "../ui/SectionTitle";
import PredictionResult from "./PredictionResult";

const INITIAL = {
  gender: "Male",
  married: "Yes",
  dependents: 0,
  education: "Graduate",
  self_employed: "No",
  applicant_income: 5000,
  coapplicant_income: 0,
  loan_amount: 150,
  loan_amount_term: 360,
  credit_history: 1,
  property_area: "Urban",
};

const SELECT_FIELDS = [
  { name: "gender", label: "Gender", options: ["Male", "Female"] },
  { name: "married", label: "Married", options: ["Yes", "No"] },
  { name: "dependents", label: "Dependents", options: [{ v: 0, l: "0" }, { v: 1, l: "1" }, { v: 2, l: "2" }, { v: 3, l: "3+" }] },
  { name: "education", label: "Education", options: ["Graduate", "Not Graduate"] },
  { name: "self_employed", label: "Self Employed", options: ["Yes", "No"] },
];

const NUMBER_FIELDS = [
  { name: "applicant_income", label: "Applicant Income ($)", min: 0 },
  { name: "coapplicant_income", label: "Co-Applicant Income ($)", min: 0 },
  { name: "loan_amount", label: "Loan Amount (K$)", min: 1 },
];

export default function PredictionForm() {
  const [form, setForm] = useState(INITIAL);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const { data } = await submitPrediction({
        ...form,
        dependents: Number(form.dependents),
        applicant_income: Number(form.applicant_income),
        coapplicant_income: Number(form.coapplicant_income),
        loan_amount: Number(form.loan_amount),
        loan_amount_term: Number(form.loan_amount_term),
        credit_history: Number(form.credit_history),
      });
      setResult(data);
    } catch (err) {
      setError(err.response?.data?.error || "Prediction failed");
    } finally {
      setLoading(false);
    }
  };

  const inputBase =
    "w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 text-sm outline-none transition-all duration-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-200 placeholder:text-gray-400";

  return (
    <>
      <GlassCard data-aos="fade-up">
        <SectionTitle subtitle="Fill in the applicant's details to run KNN & Random Forest predictions">
          Enter Loan Details
        </SectionTitle>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {/* Select fields */}
            {SELECT_FIELDS.map((f) => (
              <div key={f.name} className="space-y-1.5">
                <label className="text-xs font-medium text-text-muted uppercase tracking-wider">
                  {f.label}
                </label>
                <select name={f.name} value={form[f.name]} onChange={handleChange} className={inputBase}>
                  {f.options.map((opt) =>
                    typeof opt === "object" ? (
                      <option key={opt.v} value={opt.v}>{opt.l}</option>
                    ) : (
                      <option key={opt}>{opt}</option>
                    )
                  )}
                </select>
              </div>
            ))}

            {/* Number fields */}
            {NUMBER_FIELDS.map((f) => (
              <div key={f.name} className="space-y-1.5">
                <label className="text-xs font-medium text-text-muted uppercase tracking-wider">
                  {f.label}
                </label>
                <input
                  type="number"
                  name={f.name}
                  value={form[f.name]}
                  onChange={handleChange}
                  min={f.min}
                  className={inputBase}
                />
              </div>
            ))}

            {/* Loan term */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-text-muted uppercase tracking-wider">
                Loan Term (months)
              </label>
              <select name="loan_amount_term" value={form.loan_amount_term} onChange={handleChange} className={inputBase}>
                {[36, 60, 84, 120, 180, 240, 300, 360, 480].map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            {/* Credit history */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-text-muted uppercase tracking-wider">
                Credit History
              </label>
              <select name="credit_history" value={form.credit_history} onChange={handleChange} className={inputBase}>
                <option value={1}>Good (1)</option>
                <option value={0}>Bad (0)</option>
              </select>
            </div>

            {/* Property area */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-text-muted uppercase tracking-wider">
                Property Area
              </label>
              <select name="property_area" value={form.property_area} onChange={handleChange} className={inputBase}>
                <option>Urban</option>
                <option>Semiurban</option>
                <option>Rural</option>
              </select>
            </div>
          </div>

          {/* Submit */}
          <div className="mt-6 flex items-center gap-4">
            <button
              type="submit"
              disabled={loading}
              className="
                px-8 py-3 rounded-xl font-semibold text-sm
                bg-gradient-to-r from-accent-blue to-accent-purple text-white
                shadow-lg shadow-accent-blue/25
                hover:shadow-accent-purple/40 hover:-translate-y-0.5
                transition-all duration-300
                disabled:opacity-40 disabled:cursor-not-allowed disabled:translate-y-0 disabled:shadow-none
                cursor-pointer
              "
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Predicting...
                </span>
              ) : (
                "Run Prediction"
              )}
            </button>

            {error && (
              <div className="text-sm text-accent-red bg-accent-red/10 border border-accent-red/20 px-4 py-2 rounded-lg">
                {error}
              </div>
            )}
          </div>
        </form>
      </GlassCard>

      {result && <PredictionResult result={result} />}
    </>
  );
}
