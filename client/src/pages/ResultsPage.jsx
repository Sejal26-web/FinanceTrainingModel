import { useLocation, useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Bar, Doughnut, Radar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import { getMetrics } from "../services/api";
import { COLORS, darkChartOptions, radarChartOptions, doughnutChartOptions } from "../config/chartConfig";
import { FiCheckCircle, FiXCircle, FiBarChart2, FiArrowLeft, FiArrowRight } from "react-icons/fi";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

export default function ResultsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const prediction = location.state?.prediction;
  const [metrics, setMetrics] = useState(null);

  useEffect(() => {
    if (!prediction) {
      navigate("/apply");
      return;
    }
    getMetrics()
      .then((res) => setMetrics(res.data))
      .catch(() => {});
  }, [prediction, navigate]);

  if (!prediction) return null;

  const { results } = prediction;
  const knn = results.knn;
  const rf = results.rf;

  const isKnnApproved = knn.prediction === "Approved";
  const isRfApproved = rf.prediction === "Approved";
  const bothAgree = knn.prediction === rf.prediction;

  // Confidence comparison bar chart
  const confidenceData = {
    labels: ["KNN", "Random Forest"],
    datasets: [
      {
        label: "Confidence %",
        data: [knn.confidence, rf.confidence],
        backgroundColor: [COLORS.cyan.bg, COLORS.blue.bg],
        borderColor: [COLORS.cyan.border, COLORS.blue.border],
        borderWidth: 2,
        borderRadius: 8,
      },
    ],
  };

  // Approval probability doughnut for each
  const knnDoughnutData = {
    labels: ["Approved", "Rejected"],
    datasets: [
      {
        data: [knn.probabilities.approved, knn.probabilities.rejected],
        backgroundColor: [COLORS.green.bg, COLORS.red.bg],
        borderColor: [COLORS.green.border, COLORS.red.border],
        borderWidth: 2,
      },
    ],
  };

  const rfDoughnutData = {
    labels: ["Approved", "Rejected"],
    datasets: [
      {
        data: [rf.probabilities.approved, rf.probabilities.rejected],
        backgroundColor: [COLORS.green.bg, COLORS.red.bg],
        borderColor: [COLORS.green.border, COLORS.red.border],
        borderWidth: 2,
      },
    ],
  };

  // Radar chart (if metrics available)
  const radarData = metrics
    ? {
        labels: ["Accuracy", "Precision", "Recall", "F1 Score", "CV Mean"],
        datasets: [
          {
            label: "KNN",
            data: [
              metrics.knn.accuracy,
              metrics.knn.precision,
              metrics.knn.recall,
              metrics.knn.f1_score,
              metrics.knn.cv_mean,
            ],
            backgroundColor: COLORS.cyan.light,
            borderColor: COLORS.cyan.border,
            pointBackgroundColor: COLORS.cyan.border,
          },
          {
            label: "Random Forest",
            data: [
              metrics.rf.accuracy,
              metrics.rf.precision,
              metrics.rf.recall,
              metrics.rf.f1_score,
              metrics.rf.cv_mean,
            ],
            backgroundColor: COLORS.blue.light,
            borderColor: COLORS.blue.border,
            pointBackgroundColor: COLORS.blue.border,
          },
        ],
      }
    : null;

  // Feature importance bar chart
  const featureImportanceData = metrics?.rf?.feature_importance
    ? {
        labels: Object.keys(metrics.rf.feature_importance),
        datasets: [
          {
            label: "Importance %",
            data: Object.values(metrics.rf.feature_importance),
            backgroundColor: Object.keys(metrics.rf.feature_importance).map(
              (_, i) =>
                [
                  COLORS.cyan.bg,
                  COLORS.blue.bg,
                  COLORS.purple.bg,
                  COLORS.green.bg,
                  COLORS.amber.bg,
                  COLORS.red.bg,
                  COLORS.pink.bg,
                  COLORS.teal.bg,
                  COLORS.orange.bg,
                  COLORS.indigo.bg,
                  COLORS.slate.bg,
                ][i % 11]
            ),
            borderRadius: 6,
          },
        ],
      }
    : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8" data-aos="fade-up">
        <button
          onClick={() => navigate("/apply")}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <FiArrowLeft /> Back to Form
        </button>
        <Link
          to="/profile"
          className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors"
        >
          View All Loans <FiArrowRight />
        </Link>
      </div>

      {/* Result Summary Cards */}
      <div className="grid md:grid-cols-2 gap-6 mb-8" data-aos="fade-up">
        {/* KNN Result */}
        <div
          className={`glass-card p-6 rounded-2xl border ${
            isKnnApproved ? "border-green-500/30" : "border-red-500/30"
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">KNN Model</h3>
            {isKnnApproved ? (
              <FiCheckCircle className="text-green-400 text-2xl" />
            ) : (
              <FiXCircle className="text-red-400 text-2xl" />
            )}
          </div>
          <div
            className={`text-3xl font-bold mb-2 ${
              isKnnApproved ? "text-green-400" : "text-red-400"
            }`}
          >
            {knn.prediction}
          </div>
          <div className="text-gray-400">
            Confidence: <span className="text-white font-semibold">{knn.confidence}%</span>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
            <div className="bg-green-500/10 rounded-lg p-2 text-center">
              <div className="text-green-400 font-semibold">{knn.probabilities.approved}%</div>
              <div className="text-gray-500">Approval</div>
            </div>
            <div className="bg-red-500/10 rounded-lg p-2 text-center">
              <div className="text-red-400 font-semibold">{knn.probabilities.rejected}%</div>
              <div className="text-gray-500">Rejection</div>
            </div>
          </div>
        </div>

        {/* RF Result */}
        <div
          className={`glass-card p-6 rounded-2xl border ${
            isRfApproved ? "border-green-500/30" : "border-red-500/30"
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Random Forest Model</h3>
            {isRfApproved ? (
              <FiCheckCircle className="text-green-400 text-2xl" />
            ) : (
              <FiXCircle className="text-red-400 text-2xl" />
            )}
          </div>
          <div
            className={`text-3xl font-bold mb-2 ${
              isRfApproved ? "text-green-400" : "text-red-400"
            }`}
          >
            {rf.prediction}
          </div>
          <div className="text-gray-400">
            Confidence: <span className="text-white font-semibold">{rf.confidence}%</span>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
            <div className="bg-green-500/10 rounded-lg p-2 text-center">
              <div className="text-green-400 font-semibold">{rf.probabilities.approved}%</div>
              <div className="text-gray-500">Approval</div>
            </div>
            <div className="bg-red-500/10 rounded-lg p-2 text-center">
              <div className="text-red-400 font-semibold">{rf.probabilities.rejected}%</div>
              <div className="text-gray-500">Rejection</div>
            </div>
          </div>
        </div>
      </div>

      {/* Agreement Badge */}
      <div className="text-center mb-8" data-aos="fade-up" data-aos-delay="100">
        <div
          className={`inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium ${
            bothAgree
              ? "bg-green-500/10 border border-green-500/20 text-green-400"
              : "bg-yellow-500/10 border border-yellow-500/20 text-yellow-400"
          }`}
        >
          {bothAgree ? <FiCheckCircle /> : <FiBarChart2 />}
          {bothAgree
            ? `Both models agree: ${knn.prediction}`
            : "Models disagree — review details below"}
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Confidence Comparison */}
        <div className="glass-card p-6 rounded-2xl border border-white/5" data-aos="fade-up" data-aos-delay="200">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <FiBarChart2 className="text-cyan-400" /> Confidence Comparison
          </h3>
          <Bar data={confidenceData} options={darkChartOptions} />
        </div>

        {/* Probability Split */}
        <div className="glass-card p-6 rounded-2xl border border-white/5" data-aos="fade-up" data-aos-delay="250">
          <h3 className="text-lg font-semibold text-white mb-4">Probability Distribution</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-center text-gray-400 text-sm mb-2">KNN</p>
              <Doughnut data={knnDoughnutData} options={doughnutChartOptions} />
            </div>
            <div>
              <p className="text-center text-gray-400 text-sm mb-2">Random Forest</p>
              <Doughnut data={rfDoughnutData} options={doughnutChartOptions} />
            </div>
          </div>
        </div>
      </div>

      {/* Model Metrics Comparison */}
      {metrics && (
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Radar Chart */}
          {radarData && (
            <div className="glass-card p-6 rounded-2xl border border-white/5" data-aos="fade-up" data-aos-delay="300">
              <h3 className="text-lg font-semibold text-white mb-4">Model Performance Radar</h3>
              <Radar data={radarData} options={radarChartOptions} />
            </div>
          )}

          {/* Accuracy Metrics Cards */}
          <div className="glass-card p-6 rounded-2xl border border-white/5" data-aos="fade-up" data-aos-delay="350">
            <h3 className="text-lg font-semibold text-white mb-4">Accuracy Scores</h3>
            <div className="space-y-4">
              {[
                { label: "Accuracy", knn: metrics.knn.accuracy, rf: metrics.rf.accuracy },
                { label: "Precision", knn: metrics.knn.precision, rf: metrics.rf.precision },
                { label: "Recall", knn: metrics.knn.recall, rf: metrics.rf.recall },
                { label: "F1 Score", knn: metrics.knn.f1_score, rf: metrics.rf.f1_score },
                { label: "CV Mean", knn: metrics.knn.cv_mean, rf: metrics.rf.cv_mean },
              ].map((m) => (
                <div key={m.label} className="flex items-center justify-between py-2 border-b border-white/5">
                  <span className="text-gray-400">{m.label}</span>
                  <div className="flex gap-6">
                    <span className="text-cyan-400 font-semibold">{m.knn}%</span>
                    <span className="text-blue-400 font-semibold">{m.rf}%</span>
                  </div>
                </div>
              ))}
              <div className="flex justify-end gap-6 text-xs text-gray-500">
                <span>● KNN</span>
                <span>● RF</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Feature Importance */}
      {featureImportanceData && (
        <div className="glass-card p-6 rounded-2xl border border-white/5 mb-8" data-aos="fade-up" data-aos-delay="400">
          <h3 className="text-lg font-semibold text-white mb-4">
            RF Feature Importance
          </h3>
          <Bar
            data={featureImportanceData}
            options={{
              ...darkChartOptions,
              indexAxis: "y",
              plugins: { ...darkChartOptions.plugins, legend: { display: false } },
            }}
          />
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center" data-aos="fade-up" data-aos-delay="500">
        <button
          onClick={() => navigate("/apply")}
          className="inline-flex items-center justify-center gap-2 px-8 py-3 border border-white/10 rounded-xl font-semibold text-white hover:bg-white/5 transition-all"
        >
          <FiArrowLeft /> New Application
        </button>
        <Link
          to="/compare"
          className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl font-semibold text-white hover:shadow-lg hover:shadow-cyan-500/25 transition-all"
        >
          Full Model Comparison <FiArrowRight />
        </Link>
      </div>
    </div>
  );
}
