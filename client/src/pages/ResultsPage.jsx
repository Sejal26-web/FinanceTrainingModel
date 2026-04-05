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
import { COLORS, getChartOptions } from "../config/chartConfig";
import {
  FiCheckCircle,
  FiXCircle,
  FiBarChart2,
  FiArrowLeft,
  FiArrowRight,
  FiActivity,
  FiTarget,
  FiTrendingUp,
  FiAward,
  FiLayers,
  FiAlertTriangle,
  FiShield,
} from "react-icons/fi";

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

function CircularProgress({ value, size = 120, stroke = 8, color, label }) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="var(--border-color, rgba(0,0,0,0.05))"
            strokeWidth={stroke}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 1s ease-out" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold t-text">{value}%</span>
        </div>
      </div>
      <span className="t-text-muted text-sm">{label}</span>
    </div>
  );
}

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

  const { results, riskAssessment } = prediction;
  const knn = results.knn;
  const rf = results.rf;

  const isKnnApproved = knn.prediction === "Approved";
  const isRfApproved = rf.prediction === "Approved";
  const bothAgree = knn.prediction === rf.prediction;
  const finalVerdict = bothAgree ? knn.prediction : "Mixed";

  // Chart data
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
        barPercentage: 0.5,
      },
    ],
  };

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
  
  const featureImportanceData = metrics?.rf?.feature_importance
    ? {
        labels: Object.keys(metrics.rf.feature_importance).map(
          (k) => k.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
        ),
        datasets: [
          {
            label: "Importance",
            data: Object.values(metrics.rf.feature_importance).map((v) => (v * 100).toFixed(1)),
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
            borderColor: Object.keys(metrics.rf.feature_importance).map(
              (_, i) =>
                [
                  COLORS.cyan.border,
                  COLORS.blue.border,
                  COLORS.purple.border,
                  COLORS.green.border,
                  COLORS.amber.border,
                  COLORS.red.border,
                  COLORS.pink.border,
                  COLORS.teal.border,
                  COLORS.orange.border,
                  COLORS.indigo.border,
                  COLORS.slate.border,
                ][i % 11]
            ),
            borderWidth: 1,
            borderRadius: 6,
          },
        ],
      }
    : null;

  const metricsList = metrics
    ? [
        { label: "Accuracy", icon: FiTarget, knn: metrics.knn.accuracy, rf: metrics.rf.accuracy },
        { label: "Precision", icon: FiActivity, knn: metrics.knn.precision, rf: metrics.rf.precision },
        { label: "Recall", icon: FiTrendingUp, knn: metrics.knn.recall, rf: metrics.rf.recall },
        { label: "F1 Score", icon: FiAward, knn: metrics.knn.f1_score, rf: metrics.rf.f1_score },
        { label: "CV Mean", icon: FiLayers, knn: metrics.knn.cv_mean, rf: metrics.rf.cv_mean },
      ]
    : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      {/* Nav Row */}
      <div className="flex items-center justify-between" data-aos="fade-up">
        <button
          onClick={() => navigate("/apply")}
          className="flex items-center gap-2 px-4 py-2 rounded-lg t-text-muted hover:t-text hover:bg-black/5 dark:hover:bg-white/5 transition-all"
        >
          <FiArrowLeft size={16} /> Back
        </button>
        <Link
          to="/profile"
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 hover:bg-cyan-50 dark:hover:bg-cyan-900/20 transition-all"
        >
          All Loans <FiArrowRight size={16} />
        </Link>
      </div>

      {/* ── Risk Assessment Alert ── */}
      {riskAssessment && riskAssessment.flags?.length > 0 && (
        <div
          className={`rounded-2xl border p-6 ${
            riskAssessment.riskLevel === "High"
              ? "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
              : riskAssessment.riskLevel === "Medium"
              ? "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800"
              : "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
          }`}
          data-aos="fade-up"
        >
          <div className="flex items-center gap-3 mb-4">
            <div
              className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                riskAssessment.riskLevel === "High"
                  ? "bg-red-100 text-red-600"
                  : riskAssessment.riskLevel === "Medium"
                  ? "bg-amber-100 text-amber-600"
                  : "bg-green-100 text-green-600"
              }`}
            >
              <FiShield size={20} />
            </div>
            <div>
              <h3 className="font-semibold t-text flex items-center gap-2">
                Risk Assessment
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    riskAssessment.riskLevel === "High"
                      ? "bg-red-100 text-red-700"
                      : riskAssessment.riskLevel === "Medium"
                      ? "bg-amber-100 text-amber-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {riskAssessment.riskLevel} Risk — Score: {riskAssessment.riskScore}/100
                </span>
              </h3>
              {riskAssessment.autoRejected && (
                <p className="text-red-600 text-sm font-medium mt-1">
                  Application auto-rejected due to high risk score
                </p>
              )}
            </div>
          </div>
          <ul className="space-y-2">
            {riskAssessment.flags.map((flag, i) => (
              <li key={i} className="flex items-start gap-2 text-sm t-text-secondary">
                <FiAlertTriangle className="text-amber-500 mt-0.5 flex-shrink-0" />
                {flag}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ── Hero Verdict ── */}
      <div
        className={`relative overflow-hidden rounded-3xl border p-8 md:p-12 text-center ${
          finalVerdict === "Approved"
            ? "border-green-200 dark:border-green-800 bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-green-900/20 dark:via-transparent dark:to-emerald-900/20"
            : finalVerdict === "Rejected"
            ? "border-red-200 dark:border-red-800 bg-gradient-to-br from-red-50 via-white to-rose-50 dark:from-red-900/20 dark:via-transparent dark:to-rose-900/20"
            : "border-yellow-200 dark:border-yellow-800 bg-gradient-to-br from-yellow-50 via-white to-amber-50 dark:from-yellow-900/20 dark:via-transparent dark:to-amber-900/20"
        }`}
        data-aos="fade-up"
      >
        {/* Subtle glow */}
        <div
          className={`absolute top-0 left-1/2 -translate-x-1/2 w-96 h-32 rounded-full blur-3xl opacity-10 ${
            finalVerdict === "Approved"
              ? "bg-green-400"
              : finalVerdict === "Rejected"
              ? "bg-red-400"
              : "bg-yellow-400"
          }`}
        />

        <div className="relative z-10">
          <div
            className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 ${
              finalVerdict === "Approved"
                ? "bg-green-100 text-green-600"
                : finalVerdict === "Rejected"
                ? "bg-red-100 text-red-600"
                : "bg-yellow-100 text-yellow-600"
            }`}
          >
            {finalVerdict === "Approved" ? (
              <FiCheckCircle size={40} />
            ) : finalVerdict === "Rejected" ? (
              <FiXCircle size={40} />
            ) : (
              <FiBarChart2 size={40} />
            )}
          </div>

          <h1 className="text-4xl md:text-5xl font-bold t-text mb-3">
            Loan{" "}
            <span
              className={
                finalVerdict === "Approved"
                  ? "text-green-600"
                  : finalVerdict === "Rejected"
                  ? "text-red-600"
                  : "text-yellow-600"
              }
            >
              {finalVerdict === "Mixed" ? "Under Review" : finalVerdict}
            </span>
          </h1>

          <p className="t-text-muted text-lg max-w-lg mx-auto mb-8">
            {bothAgree
              ? `Both KNN and Random Forest models agree on this prediction with high confidence.`
              : `The two models produced different results. Review the detailed breakdown below.`}
          </p>

          {/* Confidence rings */}
          <div className="flex items-center justify-center gap-12 md:gap-20">
            <CircularProgress
              value={knn.confidence}
              color={isKnnApproved ? "#10b981" : "#f43f5e"}
              label="KNN Confidence"
            />
            <CircularProgress
              value={rf.confidence}
              color={isRfApproved ? "#10b981" : "#f43f5e"}
              label="RF Confidence"
            />
          </div>
        </div>
      </div>

      {/* ── Model Result Cards ── */}
      <div className="grid md:grid-cols-2 gap-6" data-aos="fade-up" data-aos-delay="100">
        {[
          { name: "KNN Model", model: knn, approved: isKnnApproved, accent: "cyan" },
          { name: "Random Forest", model: rf, approved: isRfApproved, accent: "blue" },
        ].map((m) => (
          <div
            key={m.name}
            className={`glass-card rounded-2xl border overflow-hidden ${
              m.approved ? "border-green-200 dark:border-green-800" : "border-red-200 dark:border-red-800"
            }`}
          >
            {/* Color strip */}
            <div
              className={`h-1 ${
                m.approved
                  ? "bg-gradient-to-r from-green-500 to-emerald-400"
                  : "bg-gradient-to-r from-red-500 to-rose-400"
              }`}
            />
            <div className="p-6">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      m.accent === "cyan" ? "bg-cyan-50 dark:bg-cyan-900/20" : "bg-blue-50 dark:bg-blue-900/20"
                    }`}
                  >
                    <FiActivity
                      className={m.accent === "cyan" ? "text-cyan-600" : "text-blue-600"}
                    />
                  </div>
                  <h3 className="text-lg font-semibold t-text">{m.name}</h3>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    m.approved
                      ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800"
                      : "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800"
                  }`}
                >
                  {m.model.prediction}
                </span>
              </div>

              {/* Probability bars */}
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between text-sm mb-1.5">
                    <span className="t-text-muted">Approval Probability</span>
                    <span className="text-green-600 font-semibold">{m.model.probabilities.approved}%</span>
                  </div>
                  <div className="h-2.5 bg-black/5 dark:bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-full transition-all duration-1000"
                      style={{ width: `${m.model.probabilities.approved}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between text-sm mb-1.5">
                    <span className="t-text-muted">Rejection Probability</span>
                    <span className="text-red-600 font-semibold">{m.model.probabilities.rejected}%</span>
                  </div>
                  <div className="h-2.5 bg-black/5 dark:bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-red-500 to-rose-400 rounded-full transition-all duration-1000"
                      style={{ width: `${m.model.probabilities.rejected}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Charts Row 1: Confidence + Probability Donuts ── */}
      <div className="grid lg:grid-cols-5 gap-6">
        <div
          className="lg:col-span-3 glass-card p-6 rounded-2xl border t-border"
          data-aos="fade-up"
          data-aos-delay="150"
        >
          <h3 className="text-base font-semibold t-text mb-1 flex items-center gap-2">
            <FiBarChart2 className="text-cyan-600" /> Confidence Comparison
          </h3>
          <p className="t-text-muted text-xs mb-4">How confident each model is in its prediction</p>
          <div className="h-64">
            <Bar
              data={confidenceData}
              options={{
                ...getChartOptions("bar"),
                plugins: { ...getChartOptions("bar").plugins, legend: { display: false } },
              }}
            />
          </div>
        </div>

        <div
          className="lg:col-span-2 glass-card p-6 rounded-2xl border t-border"
          data-aos="fade-up"
          data-aos-delay="200"
        >
          <h3 className="text-base font-semibold t-text mb-1">Probability Split</h3>
          <p className="t-text-muted text-xs mb-4">Approval vs rejection breakdown per model</p>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col items-center">
              <div className="h-40 w-full">
                <Doughnut data={knnDoughnutData} options={getChartOptions("doughnut")} />
              </div>
              <span className="t-text-muted text-xs mt-2 font-medium">KNN</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="h-40 w-full">
                <Doughnut data={rfDoughnutData} options={getChartOptions("doughnut")} />
              </div>
              <span className="t-text-muted text-xs mt-2 font-medium">Random Forest</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Model Metrics Section ── */}
      {metrics && (
        <>
          {/* Section Heading */}
          <div className="text-center pt-4" data-aos="fade-up">
            <h2 className="text-2xl font-bold t-text mb-1">Model Performance Metrics</h2>
            <p className="t-text-muted text-sm">
              Accuracy, precision, recall and more — KNN vs Random Forest
            </p>
          </div>

          {/* Metric Cards Row */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4" data-aos="fade-up" data-aos-delay="100">
            {metricsList.map((m) => (
              <div
                key={m.label}
                className="glass-card rounded-xl border t-border p-4 hover:border-cyan-400 transition-colors hover:shadow-sm"
              >
                <div className="flex items-center gap-2 mb-3">
                  <m.icon className="text-cyan-600 text-sm" />
                  <span className="t-text-muted text-xs font-medium">{m.label}</span>
                </div>
                <div className="flex items-end justify-between">
                  <div>
                    <div className="text-xs t-text-muted mb-0.5">KNN</div>
                    <div className="text-lg font-bold text-cyan-600">{m.knn}%</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs t-text-muted mb-0.5">RF</div>
                    <div className="text-lg font-bold text-blue-600">{m.rf}%</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Charts Row 2: Radar + Feature Importance */}
          <div className="grid lg:grid-cols-2 gap-6">
            {radarData && (
              <div
                className="glass-card p-6 rounded-2xl border t-border"
                data-aos="fade-up"
                data-aos-delay="150"
              >
                <h3 className="text-base font-semibold t-text mb-1">Performance Radar</h3>
                <p className="t-text-muted text-xs mb-4">
                  Multi-metric overlay comparing both models
                </p>
                <div className="h-72">
                  <Radar data={radarData} options={getChartOptions("radar")} />
                </div>
              </div>
            )}

            {featureImportanceData && (
              <div
                className="glass-card p-6 rounded-2xl border t-border"
                data-aos="fade-up"
                data-aos-delay="200"
              >
                <h3 className="text-base font-semibold t-text mb-1">
                  Feature Importance (RF)
                </h3>
                <p className="t-text-muted text-xs mb-4">
                  Which factors most influence the Random Forest decision
                </p>
                <div className="h-72">
                  <Bar
                    data={featureImportanceData}
                    options={{
                      ...getChartOptions("bar"),
                      indexAxis: "y",
                      scales: {
                        ...getChartOptions("bar").scales,
                        y: {
                          ...getChartOptions("bar").scales.y,
                          max: undefined,
                          ticks: {
                            ...getChartOptions("bar").scales.y.ticks,
                            font: { size: 10 },
                          },
                        },
                        x: {
                          ...getChartOptions("bar").scales.x,
                          ticks: {
                            ...getChartOptions("bar").scales.x.ticks,
                            callback: (v) => v + "%",
                          },
                        },
                      },
                      plugins: {
                        ...getChartOptions("bar").plugins,
                        legend: { display: false },
                        tooltip: {
                          ...getChartOptions("bar").plugins.tooltip,
                          callbacks: { label: (ctx) => `${ctx.parsed.x}%` },
                        },
                      },
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {/* ── Action Buttons ── */}
      <div
        className="flex flex-col sm:flex-row gap-4 justify-center pt-4 pb-8"
        data-aos="fade-up"
        data-aos-delay="250"
      >
        <button
          onClick={() => navigate("/apply")}
          className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-semibold t-text-secondary border t-border hover:bg-black/5 dark:hover:bg-white/5 transition-all"
        >
          <FiArrowLeft size={16} /> New Application
        </button>
        <Link
          to="/compare"
          className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-cyan-600 to-blue-600 hover:shadow-lg hover:shadow-cyan-500/25 transition-all"
        >
          Full Model Comparison <FiArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}
