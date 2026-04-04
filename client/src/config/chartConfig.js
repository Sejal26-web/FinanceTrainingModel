const isDocDark = () => document.documentElement.classList.contains("dark");

function themeColors() {
  const dark = isDocDark();
  return {
    text: dark ? "#cbd5e1" : "#475569",
    textStrong: dark ? "#f1f5f9" : "#0f172a",
    grid: dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)",
    border: dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)",
    tooltipBg: dark ? "rgba(10,10,30,0.92)" : "rgba(255,255,255,0.95)",
    tooltipBorder: dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
    tickBg: dark ? "transparent" : "transparent",
  };
}

function buildBarOptions() {
  const c = themeColors();
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: c.text, font: { family: "Inter, system-ui", size: 12 }, padding: 16 } },
      tooltip: { backgroundColor: c.tooltipBg, titleColor: c.textStrong, bodyColor: c.text, borderColor: c.tooltipBorder, borderWidth: 1, cornerRadius: 8, padding: 12 },
    },
    scales: {
      x: { ticks: { color: c.text, font: { size: 11 } }, grid: { color: c.grid }, border: { color: c.border } },
      y: { ticks: { color: c.text, font: { size: 11 } }, grid: { color: c.grid }, border: { color: c.border }, beginAtZero: true, max: 100 },
    },
  };
}

function buildRadarOptions() {
  const c = themeColors();
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: c.text, font: { family: "Inter", size: 12 }, padding: 16 } },
      tooltip: { backgroundColor: c.tooltipBg, titleColor: c.textStrong, bodyColor: c.text, borderColor: c.tooltipBorder, borderWidth: 1, cornerRadius: 8, padding: 12 },
    },
    scales: {
      r: {
        angleLines: { color: c.grid },
        grid: { color: c.grid },
        ticks: { color: c.text, backdropColor: c.tickBg, font: { size: 10 } },
        pointLabels: { color: c.text, font: { size: 11 } },
        min: 0,
        max: 100,
      },
    },
  };
}

function buildDoughnutOptions() {
  const c = themeColors();
  return {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "65%",
    plugins: {
      legend: { position: "bottom", labels: { color: c.text, padding: 14, font: { size: 11 } } },
      tooltip: { backgroundColor: c.tooltipBg, titleColor: c.textStrong, bodyColor: c.text, borderColor: c.tooltipBorder, borderWidth: 1, cornerRadius: 8 },
    },
  };
}

export function getChartOptions(type = "bar") {
  if (type === "radar") return buildRadarOptions();
  if (type === "doughnut") return buildDoughnutOptions();
  return buildBarOptions();
}

// Keep static exports for backward compat (will use the current theme at import time)
export const darkChartOptions = buildBarOptions();
export const radarChartOptions = buildRadarOptions();
export const doughnutChartOptions = buildDoughnutOptions();

export const COLORS = {
  cyan: { bg: "rgba(6, 182, 212, 0.55)", border: "#06b6d4", light: "rgba(6, 182, 212, 0.12)" },
  blue: { bg: "rgba(99, 102, 241, 0.55)", border: "#6366f1", light: "rgba(99, 102, 241, 0.12)" },
  green: { bg: "rgba(16, 185, 129, 0.55)", border: "#10b981", light: "rgba(16, 185, 129, 0.12)" },
  red: { bg: "rgba(244, 63, 94, 0.50)", border: "#f43f5e", light: "rgba(244, 63, 94, 0.12)" },
  purple: { bg: "rgba(168, 85, 247, 0.55)", border: "#a855f7", light: "rgba(168, 85, 247, 0.12)" },
  amber: { bg: "rgba(245, 158, 11, 0.55)", border: "#f59e0b", light: "rgba(245, 158, 11, 0.12)" },
  teal: { bg: "rgba(20, 184, 166, 0.55)", border: "#14b8a6", light: "rgba(20, 184, 166, 0.12)" },
  orange: { bg: "rgba(251, 146, 60, 0.55)", border: "#fb923c", light: "rgba(251, 146, 60, 0.12)" },
  indigo: { bg: "rgba(129, 140, 248, 0.55)", border: "#818cf8", light: "rgba(129, 140, 248, 0.12)" },
  pink: { bg: "rgba(236, 72, 153, 0.55)", border: "#ec4899", light: "rgba(236, 72, 153, 0.12)" },
  slate: { bg: "rgba(148, 163, 184, 0.40)", border: "#94a3b8", light: "rgba(148, 163, 184, 0.10)" },
};

export const FEATURE_PALETTE = [
  COLORS.cyan.border, COLORS.blue.border, COLORS.green.border,
  COLORS.amber.border, COLORS.red.border, COLORS.purple.border,
  COLORS.teal.border, COLORS.orange.border, COLORS.indigo.border,
  COLORS.pink.border, COLORS.slate.border,
];
