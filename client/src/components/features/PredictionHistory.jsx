import { useEffect, useState } from "react";
import { getPredictions } from "../../services/api";
import GlassCard from "../ui/GlassCard";
import SectionTitle from "../ui/SectionTitle";
import Badge from "../ui/Badge";
import Spinner from "../ui/Spinner";

export default function PredictionHistory() {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPredictions()
      .then(({ data }) => setPredictions(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;

  if (predictions.length === 0) {
    return (
      <GlassCard data-aos="fade-up">
        <SectionTitle>Prediction History</SectionTitle>
        <div className="text-center py-12">
          <div className="text-5xl mb-4">📭</div>
          <p className="text-text-muted">No predictions yet. Submit one from the Predict tab.</p>
        </div>
      </GlassCard>
    );
  }

  return (
    <GlassCard data-aos="fade-up">
      <SectionTitle subtitle={`${predictions.length} recent predictions`}>
        Prediction History
      </SectionTitle>

      <div className="overflow-x-auto -mx-6 md:-mx-7 px-6 md:px-7">
        <table className="w-full text-sm min-w-[640px]">
          <thead>
            <tr className="border-b t-border">
              {["Date", "Income", "Loan Amt", "Credit", "Education", "KNN", "RF", "Match"].map((h) => (
                <th
                  key={h}
                  className="text-left px-3 py-3.5 text-xs font-semibold t-text-muted uppercase tracking-wider first:pl-0"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5 dark:divide-white/5">
            {predictions.map((p, idx) => {
              const match = p.results?.knn?.prediction === p.results?.rf?.prediction;
              return (
                <tr
                  key={p._id}
                  data-aos="fade-up"
                  data-aos-delay={Math.min(idx * 30, 300)}
                  className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors"
                >
                  <td className="px-3 py-3.5 first:pl-0 t-text-secondary">
                    {new Date(p.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-3 py-3.5 t-text font-medium">
                    ${p.input?.applicant_income?.toLocaleString()}
                  </td>
                  <td className="px-3 py-3.5 t-text-secondary">
                    {p.input?.loan_amount}K
                  </td>
                  <td className="px-3 py-3.5">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-md ${
                      p.input?.credit_history === 1
                        ? "bg-accent-green/10 text-accent-green"
                        : "bg-accent-red/10 text-accent-red"
                    }`}>
                      {p.input?.credit_history === 1 ? "Good" : "Bad"}
                    </span>
                  </td>
                  <td className="px-3 py-3.5 t-text-secondary">
                    {p.input?.education}
                  </td>
                  <td className="px-3 py-3.5">
                    <Badge status={p.results?.knn?.prediction} />
                  </td>
                  <td className="px-3 py-3.5">
                    <Badge status={p.results?.rf?.prediction} />
                  </td>
                  <td className="px-3 py-3.5">
                    <span className={`inline-flex items-center gap-1 text-xs font-semibold ${
                      match ? "text-accent-green" : "text-accent-red"
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${match ? "bg-accent-green" : "bg-accent-red"}`} />
                      {match ? "Yes" : "No"}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </GlassCard>
  );
}
