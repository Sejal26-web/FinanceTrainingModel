import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, BarElement, ArcElement,
  RadialLinearScale, PointElement, LineElement, Filler,
  Title, Tooltip, Legend,
} from "chart.js";
import { Bar, Radar, Doughnut } from "react-chartjs-2";
import { HiOutlineChartBar, HiOutlineCpuChip, HiOutlineCheckCircle, HiOutlineArrowPath } from "react-icons/hi2";
import { getMetrics, getPredictionStats } from "../../services/api";
import {
  darkChartOptions, radarChartOptions, doughnutChartOptions,
  COLORS, FEATURE_PALETTE,
} from "../../config/chartConfig";
import GlassCard from "../ui/GlassCard";
import SectionTitle from "../ui/SectionTitle";
import MetricCard from "../ui/MetricCard";
import Spinner from "../ui/Spinner";

ChartJS.register(
  CategoryScale, LinearScale, BarElement, ArcElement,
  RadialLinearScale, PointElement, LineElement, Filler,
  Title, Tooltip, Legend
);

export default function ModelComparison() {
  const [metrics, setMetrics] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const [mRes, sRes] = await Promise.all([getMetrics(), getPredictionStats()]);
        setMetrics(mRes.data);
        setStats(sRes.data);
      } catch {
        setError("Failed to load metrics. Train models first (npm run ml:train).");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <Spinner />;
  if (error) {
    return (
      <div className="text-sm text-accent-red bg-accent-red/10 border border-accent-red/20 px-6 py-4 rounded-xl text-center">
        {error}
      </div>
    );
  }
  if (!metrics) return null;

  const { knn, rf } = metrics;

  // Performance bar
  const perfData = {
    labels: ["Accuracy", "Precision", "Recall", "F1 Score"],
    datasets: [
      {
        label: "KNN",
        data: [knn.accuracy, knn.precision, knn.recall, knn.f1_score],
        backgroundColor: COLORS.cyan.bg,
        borderColor: COLORS.cyan.border,
        borderWidth: 1,
        borderRadius: 8,
      },
      {
        label: "Random Forest",
        data: [rf.accuracy, rf.precision, rf.recall, rf.f1_score],
        backgroundColor: COLORS.blue.bg,
        borderColor: COLORS.blue.border,
        borderWidth: 1,
        borderRadius: 8,
      },
    ],
  };

  // Radar
  const radarData = {
    labels: ["Accuracy", "Precision", "Recall", "F1 Score", "CV Mean"],
    datasets: [
      {
        label: "KNN",
        data: [knn.accuracy, knn.precision, knn.recall, knn.f1_score, knn.cv_mean],
        backgroundColor: COLORS.cyan.light,
        borderColor: COLORS.cyan.border,
        pointBackgroundColor: COLORS.cyan.border,
        borderWidth: 2,
      },
      {
        label: "Random Forest",
        data: [rf.accuracy, rf.precision, rf.recall, rf.f1_score, rf.cv_mean],
        backgroundColor: COLORS.blue.light,
        borderColor: COLORS.blue.border,
        pointBackgroundColor: COLORS.blue.border,
        borderWidth: 2,
      },
    ],
  };

  // CV scores
  const cvData = {
    labels: ["Fold 1", "Fold 2", "Fold 3", "Fold 4", "Fold 5"],
    datasets: [
      { label: "KNN", data: knn.cv_scores, backgroundColor: COLORS.cyan.bg, borderRadius: 6 },
      { label: "Random Forest", data: rf.cv_scores, backgroundColor: COLORS.blue.bg, borderRadius: 6 },
    ],
  };

  // Feature importance
  const featureLabels = rf.feature_importance ? Object.keys(rf.feature_importance) : [];
  const featureValues = rf.feature_importance ? Object.values(rf.feature_importance) : [];
  const featureData = {
    labels: featureLabels,
    datasets: [{
      data: featureValues,
      backgroundColor: FEATURE_PALETTE.slice(0, featureLabels.length).map((c) => c + "99"),
      borderColor: FEATURE_PALETTE.slice(0, featureLabels.length),
      borderWidth: 1,
      spacing: 2,
    }],
  };

  const featureDoughnutOpts = {
    ...doughnutChartOptions,
    cutout: "55%",
    plugins: {
      ...doughnutChartOptions.plugins,
      legend: {
        position: "right",
        labels: { color: "#475569", padding: 8, font: { size: 10 }, boxWidth: 12, borderRadius: 2 },
      },
    },
  };

  return (
    <div className="space-y-6">
      {/* Metric summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3" data-aos="fade-up">
        <MetricCard value={`${knn.accuracy}%`} label="KNN Accuracy" icon={HiOutlineChartBar} color="cyan" />
        <MetricCard value={`${rf.accuracy}%`} label="RF Accuracy" icon={HiOutlineChartBar} color="purple" />
        <MetricCard value={`${knn.cv_mean}%`} label="KNN CV Mean" icon={HiOutlineArrowPath} color="cyan" />
        <MetricCard value={`${rf.cv_mean}%`} label="RF CV Mean" icon={HiOutlineArrowPath} color="blue" />
        {stats?.total > 0 && (
          <>
            <MetricCard value={stats.total} label="Predictions" icon={HiOutlineCpuChip} color="purple" />
            <MetricCard value={`${stats.agreement.rate}%`} label="Agreement" icon={HiOutlineCheckCircle} color="green" />
          </>
        )}
      </div>

      {/* Performance bar chart */}
      <GlassCard data-aos="fade-up" data-aos-delay="50">
        <SectionTitle subtitle="Accuracy, Precision, Recall & F1 side by side">
          Performance Metrics Comparison
        </SectionTitle>
        <div className="h-80">
          <Bar data={perfData} options={darkChartOptions} />
        </div>
      </GlassCard>

      {/* Radar + Feature importance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard data-aos="fade-right" data-aos-delay="100">
          <SectionTitle subtitle="Multi-metric radar overlay">Radar Overview</SectionTitle>
          <div className="h-80">
            <Radar data={radarData} options={radarChartOptions} />
          </div>
        </GlassCard>

        <GlassCard data-aos="fade-left" data-aos-delay="100">
          <SectionTitle subtitle="Which features matter most to Random Forest">
            RF Feature Importance
          </SectionTitle>
          <div className="h-80">
            <Doughnut data={featureData} options={featureDoughnutOpts} />
          </div>
        </GlassCard>
      </div>

      {/* Cross-validation */}
      <GlassCard data-aos="fade-up" data-aos-delay="150">
        <SectionTitle subtitle="Per-fold accuracy across 5-fold cross-validation">
          Cross-Validation Scores
        </SectionTitle>
        <div className="h-72">
          <Bar data={cvData} options={darkChartOptions} />
        </div>
      </GlassCard>

      {/* Confusion matrices */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <GlassCard data-aos="fade-right" data-aos-delay="200">
          <SectionTitle>KNN Confusion Matrix</SectionTitle>
          <ConfusionMatrix matrix={knn.confusion_matrix} />
        </GlassCard>
        <GlassCard data-aos="fade-left" data-aos-delay="200">
          <SectionTitle>RF Confusion Matrix</SectionTitle>
          <ConfusionMatrix matrix={rf.confusion_matrix} />
        </GlassCard>
      </div>
    </div>
  );
}

function ConfusionMatrix({ matrix }) {
  if (!matrix) return null;
  const labels = ["Rejected", "Approved"];

  return (
    <div className="overflow-x-auto">
      <table className="w-full max-w-xs mx-auto text-sm">
        <thead>
          <tr>
            <th className="p-3" />
            <th className="p-3 text-text-muted font-semibold text-xs uppercase tracking-wider">Pred Rejected</th>
            <th className="p-3 text-text-muted font-semibold text-xs uppercase tracking-wider">Pred Approved</th>
          </tr>
        </thead>
        <tbody>
          {matrix.map((row, i) => (
            <tr key={i}>
              <td className="p-3 text-text-muted font-medium text-xs uppercase tracking-wider">
                Actual {labels[i]}
              </td>
              {row.map((val, j) => (
                <td
                  key={j}
                  className={`p-3 text-center text-lg font-bold rounded-lg ${
                    i === j
                      ? "text-accent-green bg-accent-green/5"
                      : "text-accent-red bg-accent-red/5"
                  }`}
                >
                  {val}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
