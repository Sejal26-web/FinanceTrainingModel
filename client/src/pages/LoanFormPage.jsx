import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { submitPrediction } from "../services/api";
import {
  FiUser,
  FiCalendar,
  FiBriefcase,
  FiUpload,
  FiX,
  FiSend,
  FiFileText,
} from "react-icons/fi";

const VALID_LOAN_TERMS = [36, 60, 84, 120, 180, 240, 300, 360, 480];
const EMPLOYMENT_TYPES = ["Salaried", "Self-Employed", "Business", "Freelancer", "Unemployed"];
const LOAN_TYPES = ["Home Loan", "Personal Loan", "Education Loan", "Vehicle Loan", "Business Loan", "Gold Loan", "Agriculture Loan"];

const initialLoanForm = {
  gender: "Male",
  married: "No",
  dependents: 0,
  education: "Graduate",
  self_employed: "No",
  applicant_income: "",
  coapplicant_income: "",
  loan_amount: "",
  loan_amount_term: 360,
  credit_history: 1,
  property_area: "Urban",
};

export default function LoanFormPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [applicantName, setApplicantName] = useState(user?.name || "");
  const [applicantAge, setApplicantAge] = useState(user?.age || "");
  const [employmentType, setEmploymentType] = useState(user?.employmentType || "");
  const [loanType, setLoanType] = useState("");
  const [files, setFiles] = useState([]);
  const [form, setForm] = useState(initialLoanForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    setFiles((prev) => [...prev, ...newFiles].slice(0, 5));
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const formData = new FormData();

      // Applicant info
      formData.append("applicantName", applicantName);
      if (applicantAge) formData.append("applicantAge", applicantAge);
      formData.append("employmentType", employmentType);
      if (loanType) formData.append("loanType", loanType);

      // Loan fields
      Object.entries(form).forEach(([key, value]) => {
        formData.append(key, value);
      });

      // Support documents
      files.forEach((file) => {
        formData.append("supportDocs", file);
      });

      const res = await submitPrediction(formData);
      navigate("/results", { state: { prediction: res.data } });
    } catch (err) {
      setError(err.response?.data?.message || "Prediction failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full px-4 py-3 t-bg-input border t-border rounded-xl t-text placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-200 dark:focus:ring-blue-800 transition-colors";
  const selectClass = `${inputClass} appearance-none`;
  const labelClass = "block t-text-secondary text-sm font-medium mb-2";

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8" data-aos="fade-up">
        <h1 className="text-3xl font-bold t-text mb-2">Loan Application</h1>
        <p className="t-text-muted">Fill in your details to get an AI-powered loan prediction</p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm" data-aos="fade-up">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Personal Information */}
        <div className="glass-card p-6 rounded-2xl border t-border" data-aos="fade-up">
          <h2 className="text-xl font-semibold t-text mb-6 flex items-center gap-2">
            <FiUser className="text-cyan-600" /> Personal Information
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            <div>
              <label className={labelClass}>Full Name *</label>
              <input
                type="text"
                value={applicantName}
                onChange={(e) => setApplicantName(e.target.value)}
                required
                className={inputClass}
                placeholder="Your name"
              />
            </div>
            <div>
              <label className={labelClass}>Age</label>
              <input
                type="number"
                value={applicantAge}
                onChange={(e) => setApplicantAge(e.target.value)}
                min={18}
                max={120}
                className={inputClass}
                placeholder="25"
              />
            </div>
            <div>
              <label className={labelClass}>Employment Type *</label>
              <select
                value={employmentType}
                onChange={(e) => setEmploymentType(e.target.value)}
                required
                className={selectClass}
              >
                <option value="">Select</option>
                {EMPLOYMENT_TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Loan Type *</label>
              <select
                value={loanType}
                onChange={(e) => setLoanType(e.target.value)}
                required
                className={selectClass}
              >
                <option value="">Select Loan Type</option>
                {LOAN_TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Loan Details */}
        <div className="glass-card p-6 rounded-2xl border t-border" data-aos="fade-up" data-aos-delay="100">
          <h2 className="text-xl font-semibold t-text mb-6 flex items-center gap-2">
            <FiFileText className="text-cyan-600" /> Loan Details
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            <div>
              <label className={labelClass}>Gender</label>
              <select name="gender" value={form.gender} onChange={handleChange} className={selectClass}>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Married</label>
              <select name="married" value={form.married} onChange={handleChange} className={selectClass}>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Dependents</label>
              <input
                type="number"
                name="dependents"
                value={form.dependents}
                onChange={handleChange}
                min={0}
                max={10}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Education</label>
              <select name="education" value={form.education} onChange={handleChange} className={selectClass}>
                <option value="Graduate">Graduate</option>
                <option value="Not Graduate">Not Graduate</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Self Employed</label>
              <select name="self_employed" value={form.self_employed} onChange={handleChange} className={selectClass}>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Property Area</label>
              <select name="property_area" value={form.property_area} onChange={handleChange} className={selectClass}>
                <option value="Urban">Urban</option>
                <option value="Semiurban">Semiurban</option>
                <option value="Rural">Rural</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Applicant Income (₹)</label>
              <input
                type="number"
                name="applicant_income"
                value={form.applicant_income}
                onChange={handleChange}
                required
                min={0}
                className={inputClass}
                placeholder="50000"
              />
            </div>
            <div>
              <label className={labelClass}>Co-applicant Income (₹)</label>
              <input
                type="number"
                name="coapplicant_income"
                value={form.coapplicant_income}
                onChange={handleChange}
                required
                min={0}
                className={inputClass}
                placeholder="0"
              />
            </div>
            <div>
              <label className={labelClass}>Loan Amount (₹ thousands)</label>
              <input
                type="number"
                name="loan_amount"
                value={form.loan_amount}
                onChange={handleChange}
                required
                min={1}
                className={inputClass}
                placeholder="150"
              />
            </div>
            <div>
              <label className={labelClass}>Loan Term (months)</label>
              <select name="loan_amount_term" value={form.loan_amount_term} onChange={handleChange} className={selectClass}>
                {VALID_LOAN_TERMS.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Credit History</label>
              <select name="credit_history" value={form.credit_history} onChange={handleChange} className={selectClass}>
                <option value={1}>Good (1)</option>
                <option value={0}>Bad (0)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Upload Support Documents */}
        {/* Upload Support Documents */}
<div className="glass-card p-6 rounded-2xl border t-border" data-aos="fade-up" data-aos-delay="200">
  <h2 className="text-xl font-semibold t-text mb-6 flex items-center gap-2">
    <FiUpload className="text-cyan-600" /> Upload Required Documents
  </h2>

  <div className="space-y-6">

    {/* ✅ Proof ID */}
    <div>
      <p className="t-text-secondary mb-2 text-sm font-medium">Proof ID (Aadhar / PAN / Passport)</p>
      <div className="border-2 border-dashed t-border rounded-xl p-6 text-center hover:border-cyan-500 transition-colors">
        <input
          type="file"
          id="proofId"
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={handleFileChange}
          className="hidden"
        />
        <label htmlFor="proofId" className="cursor-pointer">
          <FiUpload className="text-2xl t-text-muted mx-auto mb-2" />
          <p className="t-text-secondary text-sm">Upload Proof ID</p>
        </label>
      </div>
    </div>

    {/* ✅ Income Certificate */}
    <div>
      <p className="t-text-secondary mb-2 text-sm font-medium">Income Certificate</p>
      <div className="border-2 border-dashed t-border rounded-xl p-6 text-center hover:border-cyan-500 transition-colors">
        <input
          type="file"
          id="incomeCert"
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={handleFileChange}
          className="hidden"
        />
        <label htmlFor="incomeCert" className="cursor-pointer">
          <FiUpload className="text-2xl t-text-muted mx-auto mb-2" />
          <p className="t-text-secondary text-sm">Upload Income Certificate</p>
        </label>
      </div>
    </div>

    {/* ✅ Salary Slip (Conditional FIXED) */}
    {employmentType === "Salaried" && (
      <div>
        <p className="t-text-secondary mb-2 text-sm font-medium">Salary Slip (Last 3 Months)</p>
        <div className="border-2 border-dashed t-border rounded-xl p-6 text-center hover:border-cyan-500 transition-colors">
          <input
            type="file"
            id="salarySlip"
            multiple
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleFileChange}
            className="hidden"
          />
          <label htmlFor="salarySlip" className="cursor-pointer">
            <FiUpload className="text-2xl t-text-muted mx-auto mb-2" />
            <p className="t-text-secondary text-sm">Upload Salary Slips</p>
          </label>
        </div>
      </div>
    )}

  </div>
</div>  

        {/* Submit */}
        <div className="text-center" data-aos="fade-up" data-aos-delay="300">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-xl font-semibold text-white text-lg hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 disabled:opacity-50"
          >
            {loading ? (
              <>
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <FiSend /> Submit Application
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
