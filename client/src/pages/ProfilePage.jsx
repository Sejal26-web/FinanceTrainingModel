import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { updateProfile, getMyPredictions } from "../services/api";
import {
  FiUser,
  FiMail,
  FiCalendar,
  FiBriefcase,
  FiEdit3,
  FiCheck,
  FiX,
  FiFileText,
  FiArrowRight,
} from "react-icons/fi";
import Badge from "../components/ui/Badge";

const EMPLOYMENT_TYPES = ["Salaried", "Self-Employed", "Business", "Freelancer", "Unemployed"];

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: "", age: "", employmentType: "" });
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        age: user.age || "",
        employmentType: user.employmentType || "",
      });
    }
    getMyPredictions()
      .then((res) => setLoans(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await updateProfile({
        name: form.name,
        age: form.age ? Number(form.age) : undefined,
        employmentType: form.employmentType,
      });
      updateUser(res.data.user);
      setEditing(false);
    } catch {
      // keep editing open
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Profile Card */}
      <div className="glass-card p-8 rounded-2xl border border-white/5 mb-8" data-aos="fade-up">
        <div className="flex items-start justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">User Profile</h2>
          {!editing ? (
            <button
              onClick={() => setEditing(true)}
              className="flex items-center gap-2 px-4 py-2 text-sm rounded-lg bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 transition-colors"
            >
              <FiEdit3 /> Edit
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-1 px-4 py-2 text-sm rounded-lg bg-green-500/10 text-green-400 hover:bg-green-500/20 transition-colors"
              >
                <FiCheck /> Save
              </button>
              <button
                onClick={() => {
                  setEditing(false);
                  setForm({ name: user.name, age: user.age || "", employmentType: user.employmentType || "" });
                }}
                className="flex items-center gap-1 px-4 py-2 text-sm rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
              >
                <FiX /> Cancel
              </button>
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white text-2xl font-bold">
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <div>
              {editing ? (
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-cyan-500/50 focus:outline-none"
                />
              ) : (
                <h3 className="text-xl font-semibold text-white">{user?.name}</h3>
              )}
              <p className="text-gray-400 flex items-center gap-1 mt-1">
                <FiMail className="text-sm" /> {user?.email}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="glass-card p-4 rounded-xl border border-white/5">
              <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
                <FiCalendar /> Age
              </div>
              {editing ? (
                <input
                  type="number"
                  value={form.age}
                  onChange={(e) => setForm({ ...form, age: e.target.value })}
                  className="bg-white/5 border border-white/10 rounded-lg px-3 py-1 text-white w-full focus:border-cyan-500/50 focus:outline-none"
                  min={18}
                  max={120}
                />
              ) : (
                <div className="text-white font-semibold text-lg">{user?.age || "—"}</div>
              )}
            </div>
            <div className="glass-card p-4 rounded-xl border border-white/5">
              <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
                <FiBriefcase /> Employment
              </div>
              {editing ? (
                <select
                  value={form.employmentType}
                  onChange={(e) => setForm({ ...form, employmentType: e.target.value })}
                  className="bg-white/5 border border-white/10 rounded-lg px-3 py-1 text-white w-full focus:border-cyan-500/50 focus:outline-none appearance-none"
                >
                  <option value="">Select</option>
                  {EMPLOYMENT_TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              ) : (
                <div className="text-white font-semibold text-lg">{user?.employmentType || "—"}</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-6 mb-8" data-aos="fade-up" data-aos-delay="100">
        <button
          onClick={() => navigate("/apply")}
          className="glass-card p-6 rounded-xl border border-white/5 hover:border-cyan-500/30 transition-all group text-left"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-white font-semibold text-lg mb-1">Apply for New Loan</h3>
              <p className="text-gray-400 text-sm">Submit a new loan application for AI prediction</p>
            </div>
            <FiArrowRight className="text-cyan-400 text-xl group-hover:translate-x-1 transition-transform" />
          </div>
        </button>
        <button
          onClick={() => navigate("/compare")}
          className="glass-card p-6 rounded-xl border border-white/5 hover:border-cyan-500/30 transition-all group text-left"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-white font-semibold text-lg mb-1">Model Comparison</h3>
              <p className="text-gray-400 text-sm">View KNN vs Random Forest performance metrics</p>
            </div>
            <FiArrowRight className="text-cyan-400 text-xl group-hover:translate-x-1 transition-transform" />
          </div>
        </button>
      </div>

      {/* Past Applied Loans */}
      <div className="glass-card p-8 rounded-2xl border border-white/5" data-aos="fade-up" data-aos-delay="200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <FiFileText className="text-cyan-400" /> Past Applied Loans
          </h2>
          <span className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-sm font-medium">
            {loans.length} Applications
          </span>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <span className="w-8 h-8 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin inline-block" />
          </div>
        ) : loans.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 mb-4">No loan applications yet</p>
            <Link
              to="/apply"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl font-semibold text-white hover:shadow-lg hover:shadow-cyan-500/25 transition-all"
            >
              Apply Now <FiArrowRight />
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Date</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Loan Type</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Loan Amount</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Income</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Credit</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">KNN</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">RF</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Docs</th>
                </tr>
              </thead>
              <tbody>
                {loans.map((loan) => (
                  <tr key={loan._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-3 px-4 text-gray-300">
                      {new Date(loan.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-gray-300">
                      {loan.loanType || "—"}
                    </td>
                    <td className="py-3 px-4 text-white font-medium">
                      ₹{loan.input?.loan_amount?.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-gray-300">
                      ₹{loan.input?.applicant_income?.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-gray-300">
                      {loan.input?.credit_history ? "Good" : "Bad"}
                    </td>
                    <td className="py-3 px-4">
                      <Badge status={loan.results?.knn?.prediction} />
                    </td>
                    <td className="py-3 px-4">
                      <Badge status={loan.results?.rf?.prediction} />
                    </td>
                    <td className="py-3 px-4 text-gray-400">
                      {loan.supportDocs?.length || 0} files
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
