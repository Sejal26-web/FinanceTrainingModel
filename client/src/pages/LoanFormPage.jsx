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
    "w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-colors";
  const selectClass = `${inputClass} appearance-none`;
  const labelClass = "block text-gray-300 text-sm font-medium mb-2";

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8" data-aos="fade-up">
        <h1 className="text-3xl font-bold text-white mb-2">Loan Application</h1>
        <p className="text-gray-400">Fill in your details to get an AI-powered loan prediction</p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm" data-aos="fade-up">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Personal Information */}
        <div className="glass-card p-6 rounded-2xl border border-white/5" data-aos="fade-up">
          <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
            <FiUser className="text-cyan-400" /> Personal Information
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
        <div className="glass-card p-6 rounded-2xl border border-white/5" data-aos="fade-up" data-aos-delay="100">
          <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
            <FiFileText className="text-cyan-400" /> Loan Details
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
        <div className="glass-card p-6 rounded-2xl border border-white/5" data-aos="fade-up" data-aos-delay="200">
  <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
    <FiUpload className="text-cyan-400" /> Upload Documents
  </h2>

  <div className="space-y-6">

    {/* ID Proof */}
    <div>
      <label className="block text-gray-300 mb-2 font-medium">ID Proof</label>
      <input
        type="file"
        onChange={(e) => handleFileChange(e, "idProof")}
        className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-cyan-500 file:text-white hover:file:bg-cyan-600"
      />
    </div>

    {/* Income Certificate */}
    <div>
      <label className="block text-gray-300 mb-2 font-medium">Income Certificate</label>
      <input
        type="file"
        onChange={(e) => handleFileChange(e, "incomeProof")}
        className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-cyan-500 file:text-white hover:file:bg-cyan-600"
      />
    </div>

    {/* Salary Slip */}
    <div>
      <label className="block text-gray-300 mb-2 font-medium">Salary Slip</label>
      <input
        type="file"
        onChange={(e) => handleFileChange(e, "salarySlip")}
        className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-cyan-500 file:text-white hover:file:bg-cyan-600"
      />
    </div>

  </div>
</div>

      

        {/* Submit */}
        <div className="text-center" data-aos="fade-up" data-aos-delay="300">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl font-semibold text-white text-lg hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 disabled:opacity-50"
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
