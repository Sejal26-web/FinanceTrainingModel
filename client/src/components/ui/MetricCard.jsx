export default function MetricCard({ value, label, icon: Icon, color = "cyan" }) {
  const colorMap = {
    cyan: "text-accent-cyan",
    blue: "text-accent-blue",
    purple: "text-accent-purple",
    green: "text-accent-green",
    red: "text-accent-red",
    gold: "text-accent-gold",
  };

  return (
    <div className="glass-card rounded-xl p-5 text-center group hover:border-gray-300 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
      {Icon && (
        <div className={`${colorMap[color]} mb-2 flex justify-center`}>
          <Icon size={20} />
        </div>
      )}
      <div className={`text-2xl font-bold ${colorMap[color]}`}>{value}</div>
      <div className="text-xs text-text-muted uppercase tracking-wider mt-1 font-medium">{label}</div>
    </div>
  );
}
