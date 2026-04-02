import { useState } from "react";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import PredictionForm from "./components/features/PredictionForm";
import ModelComparison from "./components/features/ModelComparison";
import PredictionHistory from "./components/features/PredictionHistory";

export default function App() {
  const [activeTab, setActiveTab] = useState("predict");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-4">
      <Header activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="space-y-6">
        {activeTab === "predict" && <PredictionForm />}
        {activeTab === "compare" && <ModelComparison />}
        {activeTab === "history" && <PredictionHistory />}
      </main>

      <Footer />
    </div>
  );
}
