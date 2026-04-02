import {
  Chart as ChartJS,
  CategoryScale, LinearScale, BarElement, ArcElement,
  Title, Tooltip, Legend,
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";
import GlassCard from "../ui/GlassCard";
import SectionTitle from "../ui/SectionTitle";
import Badge from "../ui/Badge";
import { darkChartOptions, doughnutChartOptions, COLORS } from "../../config/chartConfig";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

export default function PredictionResult({ result }) {
  const { knn, rf } = result.results;

  const confidenceData = {
    labels: ["KNN", "Random Forest"],
    datasets: [
      {
        label: "Approved %",
        data: [knn.probabilities.approved, rf.probabilities.approved],
        backgroundColor: [COLORS.cyan.bg, COLORS.blue.bg],
        borderColor: [COLORS.cyan.border, COLORS.blue.border],
        borderWidth: 1,
        borderRadius: 8,
      },
      {
        label: "Rejected %",
        data: [knn.probabilities.rejected, rf.probabilities.rejected],
        backgroundColor: [COLORS.red.bg, COLORS.red.bg],
        borderColor: [COLORS.red.border, COLORS.red.border],
        borderWidth: 1,
        borderRadius: 8,
      },
    ],
  };

  const makeDoughnut = (probs) => ({
    labels: ["Approved", "Rejected"],
    datasets: [{
      data: [probs.approved, probs.rejected],
      backgroundColor: [COLORS.green.bg, COLORS.red.bg],
      borderWidth: 0,
      spacing: 2,
    }],
  });

  return (
    <div className="space-y-6 mt-6">
      {/* Result badges */}
      <GlassCard data-aos="fade-up">
        <SectionTitle subtitle="Side-by-side prediction from both algorithms">
          Prediction Results
        </SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <ResultCard name="KNN Algorithm" result={knn} gradient="from-accent-cyan/10 to-accent-blue/5" />
          <ResultCard name="Random Forest" result={rf} gradient="from-accent-purple/10 to-accent-blue/5" />
        </div>
      </GlassCard>

      {/* Charts */}
      <GlassCard data-aos="fade-up" data-aos-delay="100">
        <SectionTitle subtitle="Approval probability breakdown">
          Probability Comparison
        </SectionTitle>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-72">
            <Bar data={confidenceData} options={darkChartOptions} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-center text-xs text-text-muted uppercase tracking-wider mb-3 font-medium">KNN</p>
              <div className="h-52">
                <Doughnut data={makeDoughnut(knn.probabilities)} options={doughnutChartOptions} />
              </div>
            </div>
            <div>
              <p className="text-center text-xs text-text-muted uppercase tracking-wider mb-3 font-medium">Random Forest</p>
              <div className="h-52">
                <Doughnut data={makeDoughnut(rf.probabilities)} options={doughnutChartOptions} />
              </div>
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}

function ResultCard({ name, result, gradient }) {
  return (
    <div className={`bg-gradient-to-br ${gradient} rounded-xl border border-white/5 p-6 text-center`}>
      <p className="text-xs text-text-muted uppercase tracking-widest font-semibold mb-3">{name}</p>
      <Badge status={result.prediction} className="text-base px-5 py-2 glow-pulse" />
      <p className="text-text-secondary text-sm mt-3">
        Confidence: <span className="text-text-primary font-semibold">{result.confidence}%</span>
      </p>
    </div>
  );
}
