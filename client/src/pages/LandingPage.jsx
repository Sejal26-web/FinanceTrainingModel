import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FiShield, FiTrendingUp, FiClock, FiBarChart2, FiArrowRight } from "react-icons/fi";

const features = [
  {
    icon: FiShield,
    title: "Dual-Model Analysis",
    desc: "KNN & Random Forest models evaluate your application simultaneously for maximum accuracy.",
  },
  {
    icon: FiTrendingUp,
    title: "97%+ Accuracy",
    desc: "Our Random Forest model achieves 97% accuracy with real-world validated results.",
  },
  {
    icon: FiClock,
    title: "Instant Results",
    desc: "Get your loan approval prediction in seconds, not days. No waiting, no paperwork delays.",
  },
  {
    icon: FiBarChart2,
    title: "Detailed Analytics",
    desc: "View confidence scores, model comparison charts, and feature importance breakdowns.",
  },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="orb orb-1" />
          <div className="orb orb-2" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center" data-aos="fade-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-50 border border-cyan-200 mb-8">
              <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
              <span className="text-cyan-700 text-sm font-medium">AI-Powered Loan Prediction</span>
            </div>

            <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight">
              <span className="text-gray-900">Smart Loan</span>
              <br />
              <span className="bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                Approval Predictor
              </span>
            </h1>

            <p className="text-lg lg:text-xl text-gray-500 max-w-2xl mx-auto mb-10">
              Leverage advanced machine learning to instantly predict your loan approval chances.
              Powered by KNN and Random Forest algorithms with 97%+ accuracy.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {user ? (
                <button
                  onClick={() => navigate("/apply")}
                  className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-xl font-semibold text-white text-lg hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-300"
                >
                  Apply for Loan
                  <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                </button>
              ) : (
                <>
                  <button
                    onClick={() => navigate("/register")}
                    className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-xl font-semibold text-white text-lg hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-300"
                  >
                    Get Started
                    <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                  </button>
                  <button
                    onClick={() => navigate("/login")}
                    className="inline-flex items-center gap-3 px-8 py-4 border border-gray-300 rounded-xl font-semibold text-gray-700 text-lg hover:bg-gray-50 transition-all duration-300"
                  >
                    Sign In
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Stats bar */}
          <div
            className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            {[
              { value: "97%", label: "RF Accuracy" },
              { value: "95.5%", label: "KNN Accuracy" },
              { value: "< 3s", label: "Prediction Time" },
              { value: "2", label: "ML Models" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="glass-card p-6 text-center rounded-xl border border-gray-200"
              >
                <div className="text-3xl font-bold text-cyan-600">{stat.value}</div>
                <div className="text-gray-500 text-sm mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16" data-aos="fade-up">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Why Choose LoanPredict AI?
            </h2>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">
              Built with state-of-the-art machine learning models for reliable loan predictions.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <div
                key={feature.title}
                className="glass-card p-6 rounded-xl border border-gray-200 hover:border-cyan-400 transition-all duration-300 group hover:shadow-md"
                data-aos="fade-up"
                data-aos-delay={i * 100}
              >
                <div className="w-12 h-12 rounded-lg bg-cyan-50 flex items-center justify-center mb-4 group-hover:bg-cyan-100 transition-colors">
                  <feature.icon className="text-cyan-600 text-xl" />
                </div>
                <h3 className="text-gray-900 font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16" data-aos="fade-up">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: "01", title: "Create Account", desc: "Sign up and complete your profile with personal details." },
              { step: "02", title: "Submit Application", desc: "Fill out the loan form and upload supporting documents." },
              { step: "03", title: "View Results", desc: "Get instant AI predictions with detailed model comparison charts." },
            ].map((item, i) => (
              <div
                key={item.step}
                className="relative text-center"
                data-aos="fade-up"
                data-aos-delay={i * 150}
              >
                <div className="text-6xl font-bold text-cyan-100 mb-4">{item.step}</div>
                <h3 className="text-gray-900 font-semibold text-xl mb-2">{item.title}</h3>
                <p className="text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4 text-center" data-aos="fade-up">
          <div className="glass-card p-12 rounded-2xl border border-cyan-200 shadow-md">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Check Your Eligibility?</h2>
            <p className="text-gray-500 mb-8">
              Join thousands of users who have used our AI system to predict their loan approval.
            </p>
            <button
              onClick={() => navigate(user ? "/apply" : "/register")}
              className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-xl font-semibold text-white text-lg hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-300"
            >
              {user ? "Apply Now" : "Get Started Free"}
              <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
<section className="py-20">
  <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

    <div className="mb-12">
      <h2 className="text-4xl font-bold text-white">
        Questions? We’ve Got Answers
      </h2>
    </div>

    <div className="space-y-4">

      <details className="border-b border-white/10 pb-4 group">
        <summary className="cursor-pointer text-lg text-gray-300 hover:text-white flex justify-between items-center">
          How is LoanWise different from traditional loan platforms?
          <span className="group-open:rotate-180 transition">▼</span>
        </summary>
        <p className="mt-3 text-gray-400 text-sm leading-relaxed">
          LoanWise stands out by using advanced machine learning algorithms such as KNN and Random Forest 
          to analyze your loan application in real-time. Instead of relying solely on manual verification 
          or static rules, our system evaluates multiple financial and behavioral factors to give you an 
          instant prediction. This helps users understand their approval chances before applying, saving time, 
          reducing uncertainty, and improving decision-making.
        </p>
      </details>

      <details className="border-b border-white/10 pb-4 group">
        <summary className="cursor-pointer text-lg text-gray-300 hover:text-white flex justify-between items-center">
          What is a personal loan and how can it be used?
          <span className="group-open:rotate-180 transition">▼</span>
        </summary>
        <p className="mt-3 text-gray-400 text-sm leading-relaxed">
          A personal loan is an unsecured loan that does not require collateral and can be used for a variety 
          of purposes such as medical emergencies, education, travel, home renovation, or debt consolidation. 
          The approval is usually based on your credit score, income, and financial history. Since there is no 
          collateral involved, interest rates may vary depending on your creditworthiness.
        </p>
      </details>

      <details className="border-b border-white/10 pb-4 group">
        <summary className="cursor-pointer text-lg text-gray-300 hover:text-white flex justify-between items-center">
          How is a personal loan different from a credit card?
          <span className="group-open:rotate-180 transition">▼</span>
        </summary>
        <p className="mt-3 text-gray-400 text-sm leading-relaxed">
          A personal loan provides a fixed amount of money upfront with a structured repayment plan over a 
          defined period, usually with fixed EMIs. In contrast, a credit card offers a revolving credit limit 
          that you can use repeatedly, but it often comes with higher interest rates if not paid on time. 
          Personal loans are generally better for large, one-time expenses, while credit cards are suitable 
          for smaller, ongoing purchases.
        </p>
      </details>

      <details className="border-b border-white/10 pb-4 group">
        <summary className="cursor-pointer text-lg text-gray-300 hover:text-white flex justify-between items-center">
          Will checking my loan eligibility affect my credit score?
          <span className="group-open:rotate-180 transition">▼</span>
        </summary>
        <p className="mt-3 text-gray-400 text-sm leading-relaxed">
          No, checking your eligibility on LoanWise does not affect your credit score. We use a soft inquiry 
          process that allows you to explore your loan options safely. This means you can check your chances 
          multiple times without worrying about any negative impact on your credit history.
        </p>
      </details>

      <details className="border-b border-white/10 pb-4 group">
        <summary className="cursor-pointer text-lg text-gray-300 hover:text-white flex justify-between items-center">
          How can I protect myself from loan scams and fraud?
          <span className="group-open:rotate-180 transition">▼</span>
        </summary>
        <p className="mt-3 text-gray-400 text-sm leading-relaxed">
          To protect yourself from scams, always ensure you are using trusted and verified platforms like LoanWise. 
          Avoid sharing sensitive information such as OTPs, passwords, or banking details with unknown sources. 
          Be cautious of offers that seem too good to be true, and always verify official communication channels. 
          Staying informed and alert is the best way to prevent fraud.
        </p>
      </details>

    </div>

  </div>
</section>
      
    
    </div>
  );
}
