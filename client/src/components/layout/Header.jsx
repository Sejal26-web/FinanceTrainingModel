import { HiOutlineSparkles } from "react-icons/hi2";

const TABS = [
  { key: "predict", label: "Predict", icon: "🎯" },
  { key: "compare", label: "Compare Models", icon: "📊" },
  { key: "history", label: "History", icon: "📋" },
];

export default function Header({ activeTab, onTabChange }) {
  return (
    <header className="text-center pt-8 pb-6" data-aos="fade-down">
      {/* Logo & title */}
      <div className="inline-flex items-center gap-2 mb-2">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-blue to-accent-purple flex items-center justify-center shadow-lg shadow-accent-blue/25">
          <HiOutlineSparkles className="text-white text-lg" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-accent-cyan via-accent-blue to-accent-purple bg-clip-text text-transparent">
          LoanPredict AI
        </h1>
      </div>
      <p className="text-text-muted text-sm md:text-base">
        Compare KNN &amp; Random Forest predictions in real-time
      </p>

      {/* Tab bar */}
      <nav className="mt-7 inline-flex glass rounded-xl p-1.5 gap-1">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => onTabChange(t.key)}
            className={`
              px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 cursor-pointer
              ${activeTab === t.key
                ? "bg-gradient-to-r from-accent-blue/15 to-accent-purple/15 text-accent-blue shadow-lg shadow-accent-blue/10 border border-accent-blue/20"
                : "text-text-muted hover:text-text-secondary hover:bg-white/5"
              }
            `}
          >
            <span className="mr-1.5">{t.icon}</span>
            {t.label}
          </button>
        ))}
      </nav>
    </header>
  );
}
