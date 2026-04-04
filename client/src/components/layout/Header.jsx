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
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
          LoanPredict AI
        </h1>
      </div>
      <p className="text-gray-500 text-sm md:text-base">
        Compare KNN &amp; Random Forest predictions in real-time
      </p>

      {/* Tab bar */}
      <nav className="mt-7 inline-flex bg-white/70 border border-gray-200 rounded-xl p-1.5 gap-1 shadow-sm">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => onTabChange(t.key)}
            className={`
              px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 cursor-pointer
              ${activeTab === t.key
                ? "bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 shadow-sm border border-blue-200"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
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
